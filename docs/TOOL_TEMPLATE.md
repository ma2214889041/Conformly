# Firsteck Plugin — Tool 注册标准模板

> 基于 Hermes Agent v0.14.0 (commit `378bca1d2`) 的内部 API 研究产出。
> 所有路径相对于 `hermes-agent/`。

---

## 1. Hermes Tool 系统三件套

每个工具由 **3 部分** 组成,缺一不可:

| 组件 | 类型 | 说明 |
|------|------|------|
| **Schema** | `dict` (OpenAI tool-call 格式) | LLM 决定要不要调用、传什么参数 |
| **Handler** | `def f(args: dict, **kw) -> str` | 真正干活的 Python 函数,返回 JSON 字符串 |
| **check_fn** | `def f() -> bool` (可选) | 运行时门禁,例如 "vault 是否存在"。每 30 秒缓存一次 |

注册入口:`PluginContext.register_tool(...)`(见 `hermes_cli/plugins.py:317`),最终落到 `tools/registry.py:234` 的全局 `registry.register()`。

每个 plugin 包必须导出 `register(ctx) -> None`,在 plugin enable 时被调用一次。

---

## 2. 工具文件骨架

把每个工具拆成 4 个文件(参考 `plugins/google_meet/`):

```
firsteck-plugin/
├── plugin.yaml              # 已存在
├── __init__.py              # 调 ctx.register_tool() 注册所有工具
├── tools/                   # 工具 Python 实现
│   ├── __init__.py
│   ├── _shared.py           # 公共 helpers: _json, _err, audit_log, vault_path
│   ├── get_client_status.py
│   ├── list_clients.py
│   ├── search_regulation.py
│   ├── gspr_gap_analyzer.py
│   └── parse_nb_letter.py
└── tests/
    └── test_<tool>.py
```

---

## 3. Schema 标准模板

```python
GET_CLIENT_STATUS_SCHEMA: Dict[str, Any] = {
    "name": "firsteck_get_client_status",            # snake_case, 必须全局唯一
    "description": (
        # ↓ LLM 读这个决定要不要调。写清楚:能做什么 / 何时用 / 限制 / 返回什么
        "Return the current IVDR submission status for a single Firsteck client. "
        "Reads the markdown dossier at $FIRSTECK_VAULT/clients/<client_id>.md, "
        "parses its YAML frontmatter and section headers, and returns a "
        "structured dict with phase, GREEN LIGHTs passed, current blockers, "
        "and the immediate next deliverable. "
        "Use this when the user asks 'where is client X' or 'what's blocking X'. "
        "Do NOT use it for cross-client overviews — use firsteck_list_clients."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "client_id": {
                "type": "string",
                "description": (
                    "Client identifier in UPPER-KEBAB form (e.g. CLIENT-A). "
                    "Case-insensitive; resolved against clients/*.md filenames."
                ),
            },
            "include_risk_history": {
                "type": "boolean",
                "description": "If true, include resolved risks too. Default false.",
                "default": False,
            },
        },
        "required": ["client_id"],
    },
}
```

**Schema 编写硬规则:**

1. `description` 是 LLM 唯一参考 — 写清楚 *when to use* 和 *when NOT to use*
2. 参数名用 snake_case
3. `required` 数组只放真正必须的参数,其余给 `default`
4. 不要在 description 里塞 emoji 或 markdown — 容易把 token 浪费在 LLM 本不需要的格式上
5. 工具名前缀 `firsteck_`,避免和 builtin / 其他 plugin 撞名

---

## 4. Handler 标准模板

```python
"""firsteck_get_client_status — fetch a client's IVDR status."""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from plugins.firsteck.tools._shared import (
    audit_log,
    err,
    ok,
    require_vault,
    parse_client_md,
)

logger = logging.getLogger(__name__)


def check_firsteck_vault() -> bool:
    """Runtime gate: return True when FIRSTECK_VAULT exists.

    Hermes calls this every ~30s when assembling the tool list for the LLM.
    If it returns False the tool stays registered but is filtered out of
    that turn's schema. Keep it cheap (<5ms).
    """
    try:
        return require_vault().exists()
    except Exception:
        return False


def handle_get_client_status(args: Dict[str, Any], **_kw) -> str:
    """Execute the tool.

    Contract (enforced by Hermes runtime):
      * Receives validated args dict (matches the SCHEMA above)
      * Receives **kwargs we don't use yet — Hermes may pass session_id,
        approval_callback, etc. in future versions, so always accept **_kw
      * MUST return a JSON-serializable string (not a dict)
      * MUST NOT raise — catch everything and return err(msg) instead.
        Unhandled exceptions crash the tool dispatcher loop.
      * SHOULD be idempotent and side-effect-free for read tools.
        Write tools MUST go through audit_log() and (for HITL ones) the
        approval flow described in §6.
    """
    client_id = (args.get("client_id") or "").strip().upper()
    if not client_id:
        return err("client_id is required")

    include_history = bool(args.get("include_risk_history", False))

    vault = require_vault()
    md_path = vault / "clients" / f"{client_id.lower()}.md"
    if not md_path.exists():
        # Cheap recovery: list candidates so the LLM can re-ask the user.
        candidates = sorted(p.stem for p in (vault / "clients").glob("*.md"))
        return err(
            f"no client file at {md_path}",
            candidates=candidates,
        )

    try:
        client_data = parse_client_md(md_path, include_history=include_history)
    except Exception as e:
        logger.exception("parse_client_md failed for %s", client_id)
        return err(f"failed to parse client file: {e}", path=str(md_path))

    audit_log(
        tool="firsteck_get_client_status",
        args={"client_id": client_id, "include_risk_history": include_history},
        status="ok",
    )
    return ok(client_data)
```

**Handler 硬规则:**

1. **必返回 `str`,内容是 JSON** — 看 `plugins/google_meet/tools.py:228` 的 `_json()` 范式
2. **永不 raise** — Hermes 工具循环没有兜底,异常会让整个 turn 崩
3. **永不直接 print/input** — TTY 已被 prompt_toolkit 占用,会 deadlock
4. **签名一律 `(args: Dict, **_kw) -> str`** — `**_kw` 是为了未来兼容 Hermes 注入 `session_id` 等
5. **大文件返回前先估算长度** — `max_result_size_chars` 可在 register 时设,超过会截断
6. **写操作必须 audit_log + 可选 HITL**(见 §6)

---

## 5. `_shared.py` 公共工具

```python
"""Shared helpers for all firsteck tools."""

from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def vault_path() -> Path:
    """Resolve the Firsteck Vault root.

    Order: $FIRSTECK_VAULT > ~/firsteck-vault > <plugin>/../firsteck-vault.
    Does NOT verify existence — callers use require_vault() for that.
    """
    env = os.environ.get("FIRSTECK_VAULT")
    if env:
        return Path(env).expanduser().resolve()
    default = Path.home() / "firsteck-vault"
    if default.exists():
        return default
    return (Path(__file__).resolve().parent.parent.parent / "firsteck-vault").resolve()


def require_vault() -> Path:
    p = vault_path()
    if not p.exists():
        raise FileNotFoundError(
            f"FIRSTECK_VAULT not found at {p}. "
            "Set the FIRSTECK_VAULT env var or create the directory."
        )
    return p


# ---------------------------------------------------------------------------
# Response builders
# ---------------------------------------------------------------------------

def ok(data: Any, **extra) -> str:
    return json.dumps({"success": True, "data": data, **extra}, ensure_ascii=False, default=str)


def err(msg: str, **extra) -> str:
    logger.warning("firsteck tool error: %s", msg)
    return json.dumps({"success": False, "error": msg, **extra}, ensure_ascii=False, default=str)


# ---------------------------------------------------------------------------
# Audit log — single source of truth for every tool invocation
# ---------------------------------------------------------------------------

_AUDIT_LOG = Path.home() / ".firsteck" / "audit.log"


def audit_log(tool: str, args: Dict[str, Any], status: str, **extra) -> None:
    """Append a one-line audit record. NEVER raises."""
    try:
        _AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
        rec = {
            "ts": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "tool": tool,
            "args": args,
            "status": status,
            **extra,
        }
        with _AUDIT_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False, default=str) + "\n")
    except Exception as e:
        logger.debug("audit_log write failed: %s", e)


# ---------------------------------------------------------------------------
# Markdown / frontmatter parser
# ---------------------------------------------------------------------------

_FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)


def split_frontmatter(text: str) -> tuple[Dict[str, Any], str]:
    """Return (frontmatter_dict, body_str). Empty dict if no frontmatter."""
    m = _FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    import yaml  # PyYAML — already a Hermes dependency
    fm = yaml.safe_load(m.group(1)) or {}
    return fm, m.group(2)


def parse_client_md(path: Path, include_history: bool = False) -> Dict[str, Any]:
    """Parse a clients/<id>.md file into a structured dict.

    Defined here, not in get_client_status.py, so it's reusable from
    list_clients.py and gspr_gap_analyzer.py.
    """
    text = path.read_text(encoding="utf-8")
    fm, body = split_frontmatter(text)
    # Section-aware parsing happens here — keep it forgiving:
    # missing sections return [] / "", not raise.
    return {
        "client_id": fm.get("client_id"),
        "codename": fm.get("codename"),
        "ivdr_class": fm.get("ivd_class"),
        "current_phase": fm.get("current_phase"),
        "green_lights_passed": fm.get("green_lights_passed", []),
        "nb": fm.get("nb"),
        "risk_flags": fm.get("risk_flags", []),
        "last_contact": fm.get("last_contact"),
        # body sections (parsed by # heading) deliberately omitted from
        # this snippet — implement in PR for get_client_status.
        "_body_preview": body[:400],
    }
```

---

## 6. HITL(人在回路审批)集成点

Hermes 的内建 HITL 在 `tools/approval.py`,**主要面向危险 shell 命令**,而不是任意工具。但 Firsteck 的写操作(改 client.md、写 NB letter response 草稿)需要审批,我们用 **混合策略**:

### 策略 A — 借 `prompt_dangerous_approval` 复用 CLI/Gateway 弹窗(推荐)

```python
from tools.approval import prompt_dangerous_approval

def handle_write_nb_response_draft(args: Dict, **_kw) -> str:
    client_id = args["client_id"]
    target_path = ...
    description = f"Write NB response draft for {client_id} to {target_path}"

    choice = prompt_dangerous_approval(
        command=f"firsteck.write_nb_response({client_id})",
        description=description,
        allow_permanent=False,   # 此类写操作不要"永久允许"
    )
    if choice == "deny":
        audit_log(tool="...", args=args, status="denied_by_user")
        return err("user denied write")

    # ... 真正写入 ...
    audit_log(tool="...", args=args, status="ok", choice=choice)
    return ok({"path": str(target_path)})
```

**优点:** 同一套弹窗在 CLI / Telegram / Discord 都已工作。
**缺点:** 这个 API 主要给 shell command 用,我们的 description 字段会被显示为 "command"。可读性凑合,不算别扭。

### 策略 B — 工具内置 `confirm` 参数(降级方案)

如果用户在 yolo 模式或非交互场景下跑(cron / batch),策略 A 会按配置 fallback。我们的工具应该额外接受一个 `confirm: bool` 参数:

```python
"properties": {
    ...,
    "confirm": {
        "type": "boolean",
        "description": (
            "Set to true ONLY after explicit user confirmation. "
            "If false, the tool returns the proposed write target without "
            "executing — this lets the LLM preview the action."
        ),
        "default": False,
    },
}
```

`confirm=False` → 干跑(dry-run),返回 "would write to X"。
`confirm=True` → 真写。

让 LLM 自己负责"先 dry-run、给用户看、得到 yes 再调一次 confirm=True"。这种"两阶段"模式在 Hermes 的 `delete_file` 等工具里用过,LLM 很熟。

### 策略 C — 关键决定:不交给 LLM,**写专门的 CLI 命令**

例如"批准 NB 响应函发出"这种不可逆动作,**不应该**让 LLM 直接调工具,应该走 `hermes firsteck approve-nb-response <client_id>` 这样的 CLI(用 `ctx.register_cli_command` 注册)。LLM 只能输出"草稿已准备好,运行命令 X 来批准发送"。

### 决策表

| 操作类型 | 策略 |
|---------|------|
| 只读(get_client_status, search_regulation) | 不需要审批 |
| 改 vault 内部文件(parse_nb_letter 写解析结果) | 策略 B(confirm 参数) |
| 创建新 client 档案 | 策略 A(prompt_dangerous_approval) |
| 任何"对外送出"动作(邮件、上传到 NB portal) | 策略 C(只能走 CLI,不暴露为工具) |

---

## 7. 单元测试骨架

```python
"""tests/test_get_client_status.py"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from plugins.firsteck.tools.get_client_status import (
    handle_get_client_status,
    check_firsteck_vault,
)


@pytest.fixture
def vault(tmp_path, monkeypatch):
    """Build a minimal vault layout for tests."""
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    (v / "clients" / "client-test.md").write_text(
        "---\nclient_id: CLIENT-TEST\ncodename: Acme\nivd_class: C\n"
        "current_phase: Phase 3 — Submission\nnb: BSI NL\n"
        "green_lights_passed: []\nrisk_flags: [R1]\n---\n# body\n",
        encoding="utf-8",
    )
    monkeypatch.setenv("FIRSTECK_VAULT", str(v))
    return v


def test_returns_ok(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-TEST"}))
    assert res["success"] is True
    assert res["data"]["ivdr_class"] == "C"
    assert res["data"]["nb"] == "BSI NL"


def test_unknown_client_returns_candidates(vault):
    res = json.loads(handle_get_client_status({"client_id": "BOGUS"}))
    assert res["success"] is False
    assert "client-test" in res["candidates"]


def test_missing_client_id(vault):
    res = json.loads(handle_get_client_status({}))
    assert res["success"] is False
    assert "required" in res["error"]


def test_check_fn(vault):
    assert check_firsteck_vault() is True


def test_check_fn_when_missing(tmp_path, monkeypatch):
    monkeypatch.setenv("FIRSTECK_VAULT", str(tmp_path / "does-not-exist"))
    assert check_firsteck_vault() is False
```

跑测试:`cd hermes-agent && venv/bin/pytest plugins/firsteck/tests/ -q`(plugin 必须先 symlink 到 hermes-agent 的 `plugins/` 或者 `~/.hermes/plugins/`,且 `sys.path` 能找到)。

---

## 8. `__init__.py`(plugin 主入口)最终形态

```python
"""Firsteck plugin entrypoint."""

from __future__ import annotations

import logging

from plugins.firsteck.tools.get_client_status import (
    GET_CLIENT_STATUS_SCHEMA,
    handle_get_client_status,
    check_firsteck_vault,
)
from plugins.firsteck.tools.list_clients import (
    LIST_CLIENTS_SCHEMA,
    handle_list_clients,
)
from plugins.firsteck.tools.search_regulation import (
    SEARCH_REGULATION_SCHEMA,
    handle_search_regulation,
)
from plugins.firsteck.tools.gspr_gap_analyzer import (
    GSPR_GAP_ANALYZER_SCHEMA,
    handle_gspr_gap_analyzer,
)
from plugins.firsteck.tools.parse_nb_letter import (
    PARSE_NB_LETTER_SCHEMA,
    handle_parse_nb_letter,
)

logger = logging.getLogger(__name__)

_TOOLS = (
    ("firsteck_get_client_status",  GET_CLIENT_STATUS_SCHEMA,  handle_get_client_status,  "📋"),
    ("firsteck_list_clients",       LIST_CLIENTS_SCHEMA,       handle_list_clients,       "👥"),
    ("firsteck_search_regulation",  SEARCH_REGULATION_SCHEMA,  handle_search_regulation,  "📚"),
    ("firsteck_gspr_gap_analyzer",  GSPR_GAP_ANALYZER_SCHEMA,  handle_gspr_gap_analyzer,  "🧭"),
    ("firsteck_parse_nb_letter",    PARSE_NB_LETTER_SCHEMA,    handle_parse_nb_letter,    "✉️"),
)


def register(ctx) -> None:
    """Called once by Hermes when the firsteck plugin is enabled."""
    for name, schema, handler, emoji in _TOOLS:
        ctx.register_tool(
            name=name,
            toolset="firsteck",
            schema=schema,
            handler=handler,
            check_fn=check_firsteck_vault,
            emoji=emoji,
            description=schema["description"][:200],
        )
    logger.info("Firsteck plugin registered %d tools", len(_TOOLS))
```

启用方法:`hermes plugins enable firsteck` → 工具会出现在 `hermes tools list` 的 `firsteck` 工具集里。

---

## 9. 跨工具调用(plugin-to-plugin)

工具可以互相调用,**两条路径**:

### 直调(推荐 — 同 plugin 内)

```python
# gspr_gap_analyzer.py
from plugins.firsteck.tools.search_regulation import handle_search_regulation

def handle_gspr_gap_analyzer(args, **_kw):
    # 直接调,绕过 LLM
    reg_res = json.loads(handle_search_regulation({"query": "Annex I GSPR"}))
```

### 通过 registry(跨 plugin 时用)

```python
from tools.registry import registry

entry = registry._tools.get("some_other_plugin_tool")
if entry:
    result = entry.handler({...})
```

跨 plugin 直调能用,但**绕过了 LLM 的可观察性**(用户看不到中间调了什么)。Firsteck 内部 5 个工具之间允许直调;调外部 plugin 工具时优先让 LLM 自己 orchestrate。

---

## 10. Logging / debug 路径

| 用途 | 路径 |
|------|------|
| Plugin 业务日志 | 用 `logging.getLogger(__name__)`,出现在 `~/.hermes/logs/agent.log` |
| 工具调用审计 | `~/.firsteck/audit.log`(自建,JSON Lines) |
| Plugin 加载错误 | `hermes plugins list` 显示 `error` 列;详情在 `~/.hermes/logs/agent.log` |
| 工具不可用原因 | `hermes tools list --verbose`(check_fn 失败原因) |

---

## 11. 改完模板的下一步

1. 你审本模板 → 确认/反馈
2. 我按这个模板写 5 个工具的骨架(只有 schema + handler 框架 + audit_log,业务逻辑留 TODO)
3. 你 review 骨架 → 确认
4. 实现 A 类 2 个工具(简单,4 小时)→ 端到端测试
5. 实现 B 类 3 个工具(知识,1-2 天 / 个)→ 端到端测试

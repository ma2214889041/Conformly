# Firsteck Plugin — 研究阶段遗留问题清单

> 在写业务工具代码前需要你拍板的不确定点。按 "需要回答的紧迫性" 排序。

---

## 🔴 P0 — 必须先答,否则无法动工

### Q1. Gemini 2.5 Pro 怎么接进 Hermes?

**研究结论:**
- Hermes 原生支持 Gemini,有两条路:
  - `gemini` provider:Google AI Studio API key 直连
  - `openrouter` provider:用 OpenRouter 的 `google/gemini-2.5-pro`
- 代码里能看到对 `gemini-2.5-pro` / `gemini-2.5-flash` / `gemini-3-*` 的明确支持(`tools/mixture_of_agents_tool.py:66`, `tools/vision_tools.py:1336`)
- 但 **2M 上下文窗口是 Google AI Studio 限定** — OpenRouter 通常给的是 1M 或更少。

**待你拍板:**
- (a) 用 Google AI Studio API key 直连 → 你提供 `GEMINI_API_KEY`
- (b) 用 OpenRouter → 你提供 `OPENROUTER_API_KEY`,但接受可能 ≤1M token 上下文
- 选哪个?

**推荐:** (a) — 直连 Google,拿满 2M 窗口,这是你 LLM-Wiki 架构的关键前提。

---

### Q2. Plugin 怎么物理放置 + Python import path?

**研究结论:**
- 当前我们用符号链接 `~/.hermes/plugins/firsteck → ai-week/firsteck-plugin`
- Hermes plugin loader 已识别,`hermes plugins list` 能看到
- **但是** Python 内部 import 路径是 `plugins.firsteck.tools.xxx`,这要求 `hermes-agent/plugins/firsteck/` 也存在(或 `sys.path` 注入)
- 模板里写的 `from plugins.firsteck.tools.get_client_status import ...` 在我们当前 symlink 布局下能不能跑通,**没验证**

**待你拍板:**
- (a) **保持当前布局**(`ai-week/firsteck-plugin/`),我去找 Hermes plugin loader 的 sys.path 注入点,验证或修复
- (b) **直接放进 `hermes-agent/plugins/firsteck/`** — 破坏你"不改 upstream"的洁癖,但 import 路径 100% 干净
- (c) **重命名为顶层包** `firsteck_plugin/`,用 setup.py 安装到 venv → 最干净但最重

**推荐:** (a) — 先验证 symlink import 是否工作,如果不行降到 (c)。

---

### Q3. 你的 demo 演示流是什么?

模板覆盖了 5 个工具,但黑客松演示通常 3 分钟讲一个故事。需要你确认 3 幕镜头:

- **幕 1 — 你之前说的 GSPR gap analyzer**:输入一个客户 + 技术文档,输出对照 IVDR Annex I 的缺口报告
- **幕 2 — 客户进度大屏**:`list_clients` + `get_client_status` 喂前端
- **幕 3 — NB 信件解析**:`parse_nb_letter` 把 PDF 转结构化清单

**待你拍板:**
- 这 3 幕的顺序对吗?
- 还是另有故事线(比如 "新客户进来 → 自动 IVDR 分类")?
- 演示用 CLI(`hermes`)还是 Telegram?CLI 更快,Telegram 更"震撼"

---

## 🟡 P1 — 应该早点答,影响实现选型

### Q4. HITL 策略选哪个?

模板第 6 节列了 3 种:
- A:复用 `prompt_dangerous_approval`
- B:工具内 `confirm` 参数(两阶段)
- C:不可逆动作走 CLI 命令

**待你拍板:**
- A 还是 B 当默认?C 用于哪些工具?
- 黑客松 demo 阶段为了节奏快,要不要默认 yolo,只对 `create_client_dossier` / `parse_nb_letter` 写盘做审批?

**推荐:** demo 阶段 = "yolo + 关键写盘要 confirm"(B 策略)。生产再切 A。

---

### Q5. 工具直调还是让 LLM orchestrate?

模板第 9 节谈了跨工具调用。具体到 `gspr_gap_analyzer`:

它内部要做 3 件事:
1. 读客户技术文档(等于 `list_clients` 之子集)
2. 读 IVDR Annex I 法规(等于 `search_regulation`)
3. 用 LLM 对照 → 输出缺口报告

**待你拍板:**
- (a) 工具内部 Python 直调 step 1/2,只第 3 步走 ctx.llm → 速度快,但 LLM 看不到中间过程
- (b) 工具内只做 step 3,让 LLM 在外面先调 1/2 把数据塞进 prompt → 慢但透明
- (c) 工具完全 Python 化:用 `ctx.llm.chat()` 做 step 3,**用户在 transcript 里看到一次"工具调用",不看到内部 LLM 子调用** → 体验最好但可观察性弱

**推荐:** (c) — 用户体验最好。可观察性靠 audit.log 兜底。

---

### Q6. 长会话 / 记忆策略

你担心 "18 个月项目的长会话"。研究结论:

- Hermes 有 **两层**记忆:
  - **MEMORY.md + USER.md**(`~/.hermes/memories/`):markdown 文件,Agent 写入,system prompt 始终带入。**容量受限**(几千 token)
  - **Session DB**(`~/.hermes/sessions/`):SQLite + FTS5 全文索引,完整保留每条消息;可搜索/恢复
- 对超长 / 跨年的项目,真正的"项目状态"应该存在 `firsteck-vault/clients/<id>.md` 和 `projects/<id>/`(已建),而不是依赖 Hermes 的 memory
- Hermes 自带 context compression,长 turn 会自动压缩

**待你拍板:**
- 同意"项目状态存在 vault,记忆只存用户偏好"这个分工吗?
- 要不要把 vault 路径写进 SOUL.md 让 Agent 每次都"记得"vault 在哪?

**推荐:** 同意分工 + 写进 SOUL.md。

---

### Q7. PDF 解析依赖

`parse_nb_letter` 工具需要从 PDF 抽文本。可选:
- (a) `pypdf`(纯 Python,装得快,精度一般)
- (b) `pdfplumber`(基于 pdfminer,表格识别好)
- (c) `marker` / `markitdown`(开源新工具,转 markdown 质量高,装包重)
- (d) Gemini 2.5 Pro 原生接受 PDF 输入(直接 vision)→ **不装包,质量最好**

**待你拍板:**
- 选哪个?

**推荐:** (d) — 直接喂 PDF 给 Gemini,零额外依赖,质量最好。失败时 fallback 到 (a)。

---

## 🟢 P2 — 可以晚点答,不影响 MVP

### Q8. 工具暴露给哪些 toolset?

Hermes 默认开了 `firsteck` toolset 后,5 个工具会一起进 LLM 的 schema 列表。但 LLM 看的工具越多,token 浪费越多。

要不要做 **profile 切分**:
- "PM 模式":`firsteck_get_client_status / list_clients`(2 个)
- "RA 模式":再加 `search_regulation / parse_nb_letter`(4 个)
- "顾问模式":全开(5 个)

**待你拍板:** 黑客松阶段需要这个吗?(我倾向"不需要,全开就行")

---

### Q9. SOUL.md / Agent persona 改造

Hermes 默认 SOUL.md 是通用助理。要不要改造成:

> "You are Firsteck Hermes — a compliance co-pilot for Chinese IVD manufacturers entering the EU under IVDR. You speak Chinese, English, and Italian fluently. You always cite IVDR articles when answering regulatory questions, and you never give legal advice — you defer to the user's RA lead."

**待你拍板:** 同意改吗?用上面这版还是你另写?

**推荐:** 同意,黑客松前必须改 — 不然 demo 出来还像 generic chatbot。

---

### Q10. 默认裁剪 toolsets

`hermes tools list` 默认会启用 spotify, gif, apple-reminders 等几十个 toolset。LLM token 浪费,而且演示时让面板看着乱。

**待你拍板:** demo 前是否裁剪到 `firsteck + terminal + read_file + write_file + web_search` 这 5 个核心 toolset?

**推荐:** 是。

---

### Q11. 演示需要 / 不需要做的事

需要确认 demo 阶段我们要 / 不要做:

- [ ] 真实跑通 5 个工具 → **必须**
- [ ] 前端"客户大屏"(network graph / kanban)→ 你说过想要,要不要在黑客松前做?
- [ ] Telegram 接入(消息驱动) → 加分项
- [ ] 中英意 i18n 演示 → 加分项
- [ ] 接 Honcho 做用户建模 → **不要**(超出 demo 范围)

**待你拍板:**

---

## 🆘 P3 — 我自己也不确定的实现细节(等动工时再说)

### Q12. Hermes plugin 怎么 reload 不重启?

写工具时改 `tools/get_client_status.py` 是否要重启 hermes 进程?有没有 `hermes plugins reload firsteck`?

研究结论:**没有 hot-reload**。每次改 Python 要 Ctrl+C → 重新 `hermes` 启动。
开发体感会有点慢,但模板里的 pytest 让我们至少能离线测试 handler 逻辑。

### Q13. `ctx.llm` 怎么从工具内部拿到?

模板里展示了 `ctx.register_tool()` 时 ctx 有 `ctx.llm`,但 handler 函数被注册后,被调用时收不到 ctx —— 它只收 `args` 和 `**kw`。

研究结论:**handler 默认拿不到 ctx**。要 LLM 子调用得自己 import:

```python
from agent.plugin_llm import PluginLlm
llm = PluginLlm(plugin_id="firsteck")
res = llm.chat(messages=[{"role":"user","content":"..."}])
```

这个 API 我没读完整,实际用法可能要再查 `agent/plugin_llm.py`。**动工时会再深挖。**

### Q14. 一个 ctx.register_tool 调用能不能注册"动态 schema"的工具?

例如 `firsteck_get_client_status` 的 `client_id` 应该是个枚举(只能是当前已存在的客户)。
能不能让 LLM 看到的 schema 自动列出 `["CLIENT-A", "CLIENT-B", "CLIENT-C"]`?

研究结论:**可以** — `registry.register()` 接受 `dynamic_schema_overrides: Callable`(`tools/registry.py:246`)。每次 LLM 拉 schema 时调用,可以动态填枚举值。**对 demo 体验有正向加成,但不是 P0。**

---

# 我建议的下一步

按紧迫性,你回答下面 7 个 P0/P1 我就能动手了:

1. **Q1** — Gemini 直连还是 OpenRouter?
2. **Q2** — Plugin 物理布局?(我推荐先试 symlink,有问题再换)
3. **Q3** — 3 幕 demo 故事确认?
4. **Q4** — HITL 用 B 策略 + demo 阶段 yolo 同意吗?
5. **Q5** — `gspr_gap_analyzer` 用方案 (c)(Python 全包)同意吗?
6. **Q7** — PDF 解析用 Gemini 原生(方案 d)同意吗?
7. **Q9 + Q10** — SOUL.md 改写 + 默认裁剪 toolsets 同意吗?

P2 / P3 可以晚点答或动工时一起决定。

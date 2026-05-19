---
client_id: CLIENT-A
codename: "Shenzhen MoleQ Diagnostics"
country: CN
contact_lang: [zh, en]
ivd_class: C
product_type: "Molecular IVD — Multiplex RT-PCR Kit"
indication: "Respiratory viral panel (Influenza A/B, RSV, SARS-CoV-2)"
current_phase: "Phase 3 — SUBMISSION"
green_lights_passed: []
nb: "BSI Netherlands (NB 2797)"
opened: 2025-11-04
last_contact: 2026-05-12
status: active
risk_flags: ["NB clock-stop possible", "Clinical evidence gap on RSV strain coverage"]
---

# Client A — Shenzhen MoleQ Diagnostics(脱敏代号)

> ⚠️ 模拟数据 / Hackathon Demo。所有公司名、产品名、人物、日期均为虚构。

## 1. 公司基本面

- **总部**:深圳南山区
- **成立**:2017
- **核心团队**:CEO Dr. Liang Wei(原 BGI),CTO Dr. Sun Min(分子诊断 12 年)
- **现有市场**:中国 NMPA 三类证(2022 拿到),东南亚 5 国注册
- **欧盟战略**:首次进入 EU,以呼吸道多重 PCR 为先导产品

## 2. 产品 (Device under assessment)

| 字段 | 值 |
|------|----|
| 商品名 | MoleQ Respi-4 Panel |
| Intended Purpose | 鼻咽拭子样本中 Flu A/B + RSV + SARS-CoV-2 核酸定性检测 |
| Use Setting | 中心实验室 + 中型医院 |
| IVDR Classification | **Class C** (Rule 3(a) — 传染性病原体检测) |
| Reference standard | RT-PCR + 测序 |
| Software | Yes — 内嵌结果判读算法 (MoleQ-Analytica v2.3) |

## 3. 监管路径

- **Conformity Assessment**:Annex IX (Full QMS + Tech Doc Assessment)
- **Notified Body**:BSI Netherlands(NB 2797)— 合同已签,提交窗口 2026 Q3
- **CPS 必要性**:✅ 是(Class C + 新分析声明组合)
- **EU Authorised Representative**:Obelis (Brussels) — 已委任

## 4. 当前进展 (CPS Workflow 视角)

参见 [[cps-workflow]](../notes/procedures/cps-workflow.md)

- ✅ Phase 0 — Evaluation 完成(2025-12)
- ✅ Phase 1 — Site selection:主中心 Ospedale San Raffaele (Milano)
- ✅ Phase 2 — Quotation:合同 € 487,000 已签
- ✅ Phase 2.5 — Protocol writing v1.4 完成
- 🟡 Phase 3 — SUBMISSION(**当前阶段**)
  - ✅ CE 提交 2026-03-18
  - 🟡 等待 Parere Unico(预计 2026-05-28)
  - ⬜ MinSal 申请尚未递交
- ⬜ GREEN LIGHT #1 — Admin & RA(未通过)

## 5. 已识别风险

| # | 风险 | 严重度 | 当前应对 |
|---|------|--------|---------|
| R1 | RSV 临床证据样本量不足(预估 n=42, 需 n≥80) | 高 | 拟增 2 个卫星中心(Bologna + Padova) |
| R2 | 软件 v2.3 未提交 IEC 62304 文档 | 高 | 客户工程团队 2026-06-15 前补齐 |
| R3 | 中文版 IFU 翻译不符合 EU 语言要求(需 24 种语言) | 中 | 与 Obelis 协商分阶段策略 |
| R4 | NB 审核员档期紧(BSI 2026 Q3 满档) | 中 | 已锁定 2026-09 时间窗 |

## 6. 关键沟通记录

- 2026-05-12 — 与 CTO Sun Min 电话:确认 RSV 增点方案
- 2026-04-30 — BSI 邮件:要求补充 Annex II IFU 中的稳定性数据
- 2026-04-15 — 与 PI Prof. Rossi(San Raffaele)视频会:protocol amendment #1 审议

## 7. 下一步动作(Agent 应主动追踪)

- [ ] 2026-05-28 — 跟进 CE Parere Unico 结果
- [ ] 2026-06-01 — 启动 MinSal 申请准备
- [ ] 2026-06-15 — 客户软件文档 (IEC 62304) deadline check
- [ ] 2026-06-30 — Bologna / Padova 卫星中心可行性确认

## 8. 文件索引

- 原始资料:`raw/clients/client-a/`(待客户上传)
- NB 来信:`raw/nb_letters/`(2026-04-30 BSI 邮件待存)
- 项目日志:`projects/client-a-cps-2026/`(待建)

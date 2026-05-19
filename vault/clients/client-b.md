---
client_id: CLIENT-B
codename: "Beijing OncoGene Bio"
country: CN
contact_lang: [zh, en]
ivd_class: D
product_type: "Companion Diagnostic — NGS panel"
indication: "EGFR / KRAS / BRAF mutation detection for lung & colorectal cancer therapy selection"
current_phase: "Phase 0 — Evaluation"
green_lights_passed: []
nb: "TBD (shortlisted: TÜV SÜD, DEKRA)"
opened: 2026-04-22
last_contact: 2026-05-15
status: active
risk_flags: ["Class D = highest scrutiny", "CDx requires EMA opinion (Article 48(6))", "No prior EU NB engagement"]
---

# Client B — Beijing OncoGene Bio(脱敏代号)

> ⚠️ 模拟数据 / Hackathon Demo。

## 1. 公司基本面

- 总部:北京中关村
- 成立:2014
- 核心团队:CEO Dr. Zhang Hua(原 Foundation Medicine 中国总监)
- 已有市场:中国 NMPA 三类证(2023)、HSA Singapore(2024)
- 欧盟战略:跟 Roche / AstraZeneca 的肺癌靶向药联合上市

## 2. 产品

| 字段 | 值 |
|------|----|
| 商品名 | OncoTarget Lung-CRC v3 |
| Intended Purpose | FFPE 组织样本中 EGFR/KRAS/BRAF 关键 hotspot 突变检测,用于辅助 EGFR-TKI / KRAS G12C 抑制剂用药选择 |
| Platform | Illumina NextSeq 550Dx + 自研生信流水线 |
| IVDR Classification | **Class D** (Rule 3(g) — companion diagnostic) |
| Software | Yes — bioinformatics pipeline OncoCall v3.1(含 ML variant calling) |

## 3. 监管路径

- **Conformity Assessment**:Annex IX(QMS + Tech Doc 全套审核)+ **Article 48(6) EMA scientific opinion**(CDx 强制)
- **NB**:未定,正在 TÜV SÜD 和 DEKRA 之间评估
- **CPS 必要性**:✅ 强制(Class D)
- **EU Authorised Representative**:未指定

## 4. 当前进展

参见 [[cps-workflow]](../notes/procedures/cps-workflow.md)

- 🟡 Phase 0 — Evaluation(**当前阶段**)
  - ✅ 厂商启动会(2026-05-02)
  - 🟡 产品评估进行中
  - ⬜ 主中心选址未启动(候选:Istituto Europeo di Oncologia Milano, IRCCS Candiolo)
- ⬜ Phase 1 → 6 未开始

## 5. 已识别风险

| # | 风险 | 严重度 | 当前应对 |
|---|------|--------|---------|
| R1 | Class D 审核周期长(EMA + NB),欧盟商业化预计 30+ 个月 | 高 | 与客户管理预期,优先 EFS 申请 |
| R2 | CDx 需要配套药企 stewardship letter,Roche/AZ 中国分公司不直接背书 | 高 | 升级到客户总部协调 |
| R3 | ML 生信流水线无 IVDR Annex I §16 (software) 完整文档 | 高 | 建议外包 IEC 62304 / 14971 文档化 |
| R4 | 中国本土样本能否代表欧洲患者群 | 中 | 拟欧洲多中心补充小队列 |

## 6. 关键沟通记录

- 2026-05-15 — 与 CEO Dr. Zhang 视频会:确认 30 月时间线可接受
- 2026-05-02 — Kickoff:产品技术介绍,Firsteck 提供 IVDR gap analysis 草稿

## 7. 下一步动作

- [ ] 2026-05-30 — 完成 IVDR gap analysis report 交付
- [ ] 2026-06-10 — NB 初选会议(TÜV SÜD)
- [ ] 2026-06-25 — Pharma partner 协调会(Roche EU)
- [ ] 2026-07-15 — 主中心 site visit(IEO Milano)

## 8. 文件索引

- 原始资料:`raw/clients/client-b/`(待客户上传)
- 项目日志:`projects/client-b-cps-2026/`(待建)

---
type: nb_letter_mock
source: BSI Netherlands NB 2797
client_ref: CLIENT-A
date_issued: 2026-04-30
deadline: 2026-06-29
clock_stopped: true
status: mock_placeholder
---

# Notified Body Deficiency Letter (模拟)

> ⚠️ Hackathon demo 模拟。真实通信请用原始 PDF 存档。

---

**BSI Group The Netherlands B.V.**
Notified Body 2797
Say Building, John M. Keynesplein 9, 1066 EP Amsterdam

Date: 30 April 2026
Reference: NB2797-IVDR-2026-1184
Subject: Deficiency Letter — Technical Documentation Assessment
Project: MoleQ Respi-4 Panel (UDI-DI 0481234567890)
Client: Shenzhen MoleQ Diagnostics Co., Ltd.

Dear Dr. Sun Min,

Following our review of the Technical Documentation submitted on 18 February 2026 under IVDR (EU) 2017/746 Annex II + III, we have identified **4 deficiencies** requiring response. Pursuant to Article 48(11), **the conformity assessment clock is stopped** as of the date of this letter and will resume upon receipt of complete responses.

You have **60 calendar days** (until 29 June 2026) to submit a comprehensive response. Failure to respond within this period may result in closure of the project file.

## Findings

### D1 — Analytical Performance: Precision (Major)
**Section cited:** Technical File §4.2.3
**Reference:** IVDR Annex I §9.1(a); CLSI EP05-A3
**Issue:** Precision study was conducted over 5 days (n=5×2×2), whereas the harmonized standard CLSI EP05-A3 requires a 20-day design. The truncated dataset does not allow adequate estimation of between-day variance components.
**Evidence required:** Repeat the precision evaluation using the full 20×2×2 design, OR provide a scientifically justified rationale for the deviation referencing the device's intended use and analytical claims.

### D2 — Clinical Performance: RSV Sample Size (Major)
**Section cited:** CPS Protocol v1.4 §6.2; CPSR draft §5.3
**Reference:** IVDR Annex XIII Part A §1.2.3
**Issue:** Clinical performance data for RSV detection includes only 42 positive specimens, with a 95% CI on sensitivity of [78.4%, 94.1%]. The lower CI bound does not robustly support the claimed sensitivity of ≥90%.
**Evidence required:** Increase RSV positive sample n to ≥80, OR revise the intended-use claim for RSV detection.

### D3 — Software Documentation (Major)
**Section cited:** Technical File §7 (Software lifecycle)
**Reference:** IEC 62304:2006/AMD 1:2015; IVDR Annex I §16
**Issue:** No IEC 62304 software lifecycle documentation provided for the result-interpretation algorithm MoleQ-Analytica v2.3. Risk classification (Class A/B/C per IEC 62304) is not declared.
**Evidence required:** Complete IEC 62304 software design history file including: software safety classification justification, SOUP analysis, verification and validation summary, post-market software maintenance plan.

### D4 — Stability Claims (Minor)
**Section cited:** Technical File §4.5; IFU §11
**Reference:** IVDR Annex I §9.4
**Issue:** In-use stability claim of "8 hours after kit opening" is supported only by accelerated studies at 37°C; no real-time data at ambient (18–25°C) conditions are provided.
**Evidence required:** Real-time stability data at intended-use storage conditions, OR amendment of the IFU to reflect only the supported claim.

---

Please structure your response as a point-by-point response table referencing each finding by D-number. Use track changes for all updated documents.

Yours sincerely,

Dr. M. van der Berg
Lead Reviewer, IVDR Conformity Assessment
BSI Netherlands

cc: Project Manager A. Janssen

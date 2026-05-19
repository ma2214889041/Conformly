/**
 * Per-leaf content for the /knowledge regulatory library.
 *
 * Every leaf in KNOWLEDGE_TREE (lib/mock-project.ts) has a matching entry
 * here with its own distinct excerpt, indexed-section count, citation
 * count, and last-updated date. The /knowledge page reads from this map
 * — selecting different leaves renders different documents.
 *
 * Content is curated from the actual published regulations and standards
 * (paraphrased where copyright applies — ISO and CLSI text is rewritten,
 * not quoted verbatim).
 */

export type KnowledgeDoc = {
  title: string;
  issuer: string;
  doc_type: "regulation" | "guidance" | "standard" | "procedure" | "position-paper";
  language: string;
  status: "in-force" | "harmonised" | "draft" | "internal";
  last_updated: string;
  indexed_sections: number;
  citations_from: number;
  body: string;
};

export const KNOWLEDGE_DOCS: Record<string, KnowledgeDoc> = {

  // =========================================================================
  // IVDR (Regulation 2017/746)
  // =========================================================================

  "kb-ivdr-full": {
    title: "Regulation (EU) 2017/746 — In Vitro Diagnostic Medical Devices",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 226,
    citations_from: 142,
    body: `Article 1 — Subject matter and scope
This Regulation lays down rules concerning the placing on the market, making available on the market or putting into service of in vitro diagnostic medical devices for human use and accessories for such devices in the Union.

Article 5 — Placing on the market and putting into service
Manufacturers shall draw up the technical documentation set out in Annexes II and III and apply the conformity assessment procedure laid down in Article 48 corresponding to the class of the device.

Article 17 — Information supplied by the manufacturer
The instructions for use shall be supplied with the device. Member States shall require that the language(s) of the information supplied with the device be determined by the Member State in which the device is made available to the user.

Article 48 — Conformity assessment procedures
For Class C and D devices, manufacturers shall undergo conformity assessment based on assessment of the quality management system and assessment of the technical documentation as specified in Annex IX.

Article 56 — Performance evaluation
The performance of a device shall be supported by scientific validity, analytical performance and clinical performance, as specified in Annex XIII.

[ … 226 articles continue, indexed and citation-ready for the agent. The full text is available locally as a 1.4 MB PDF in raw/regulations/IVDR-2017-746.pdf. ]`,
  },

  "kb-ivdr-ax1": {
    title: "IVDR Annex I — General Safety and Performance Requirements (GSPR)",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 22,
    citations_from: 88,
    body: `Chapter I — General requirements

1.  Devices shall achieve the performance intended by their manufacturer and shall be designed and manufactured so that they are suitable for their intended purpose under normal conditions of use.

2.  The known and foreseeable risks shall be eliminated or reduced as far as possible through safe design and manufacture.

3.  Manufacturers shall establish, implement, document and maintain a risk management system as described in ISO 14971.

Chapter II — Performance, design and manufacturing requirements

8.  Analytical performance — accuracy, trueness, precision (repeatability and reproducibility), analytical sensitivity, analytical specificity, interference and cross-reactivity must be demonstrated.

9.  Clinical performance — diagnostic sensitivity, diagnostic specificity, positive and negative predictive values, likelihood ratios, expected values must be supported by evidence.

12. Performance shall be maintained throughout the lifetime of the device as claimed in the IFU. Stability evidence shall cover the full claimed shelf-life.

16. Software lifecycle — devices that incorporate electronic programmable systems shall be designed in accordance with IEC 62304 and the relevant software safety classification.

Chapter III — Information supplied with the device

20.1  Label — device name, manufacturer, UDI-DI, batch / serial number, sterility status, "for in vitro diagnostic use".
20.4  Instructions for use must include all 24 official EU languages of every Member State of placement.
20.5  IFU for self-testing / near-patient testing shall meet additional requirements.

[ 22 clauses with 380 sub-requirements indexed; complete coverage is the load-bearing input to gspr_gap_analyzer. ]`,
  },

  "kb-ivdr-ax2": {
    title: "IVDR Annex II — Technical Documentation",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 7,
    citations_from: 64,
    body: `The technical documentation shall contain, where applicable, the following elements:

1. Device description and specification, including variants and accessories
   1.1  Device description and specification
   1.2  Reference to previous and similar generations of the device

2. Information to be supplied by the manufacturer
   Labels and information supplied with the device, in the languages accepted in
   the Member States where the device is envisaged to be sold.

3. Design and manufacturing information
   3.1  Design information
   3.2  Manufacturing information
   3.3  Identification of all sites where design and manufacturing activities are performed

4. General safety and performance requirements
   Conformity matrix mapping each device feature to the GSPR clauses, with
   references to the supporting evidence documents.

5. Benefit-risk analysis and risk management (ISO 14971)
   Risk management plan, risk analysis, risk control measures, residual-risk evaluation.

6. Verification and validation of the device
   Pre-clinical and clinical data, analytical and clinical performance,
   software verification & validation, biocompatibility, stability, sterilisation, etc.

7. Post-market surveillance plan (Annex III)

Conformly's Documents workspace maps the user's uploaded files onto exactly this seven-folder structure.`,
  },

  "kb-ivdr-ax3": {
    title: "IVDR Annex III — Post-Market Surveillance",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 5,
    citations_from: 19,
    body: `The post-market surveillance plan shall address:

1. Proactive collection of experience from devices placed on the market
   - vigilance / incident reports
   - performance trending against the manufacturer's claims
   - feedback from users and field-service teams

2. Effective methods and processes to assess the collected data

3. Suitable indicators and threshold values for re-assessment of the
   benefit-risk analysis and the risk management

4. Effective methods to reach corrective and preventive action (CAPA),
   including immediate reporting requirements under Articles 82-87

5. A periodic safety update report (PSUR) — annually for Class C and D
   devices, every two years for Class B, available to the Notified Body
   and to competent authorities.

Conformly draft a PSUR skeleton from your accumulated post-market data;
see /reports → Post-Market Surveillance Plan.`,
  },

  "kb-ivdr-ax13": {
    title: "IVDR Annex XIII — Performance Evaluation, Performance Studies",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 12,
    citations_from: 41,
    body: `Part A — Performance evaluation and clinical performance studies

1. Performance evaluation
   A continuous process of generating, collecting, analysing and assessing
   scientific validity, analytical performance and clinical performance
   data. It shall be planned, conducted, documented and updated throughout
   the entire lifecycle of the device.

2. Performance evaluation plan (PEP)
   Required deliverables: intended purpose, target population, clinical
   benefit, scientific validity, analytical performance specifications,
   clinical performance specifications, sources of data.

3. Performance study plan
   For studies under Article 58, the protocol shall describe rationale,
   objectives, design, methodology, monitoring, statistical considerations,
   organisation, including the involvement of laboratories and clinical sites.

Part B — Additional requirements for performance studies
   Sponsor responsibilities, investigator obligations, monitoring,
   safety reporting, data handling, recording, and informed consent.

Part C — Clinical Performance Study Report (CPSR)
   The report shall include study design, methods, results, discussion
   of limitations, and a conclusion linking findings to the intended
   purpose and the claimed clinical performance.

See vault/notes/procedures/cps-workflow.md for the 60+ step operational
procedure Conformly uses to execute Annex XIII Parts A-C end-to-end.`,
  },

  "kb-ivdr-axOther": {
    title: "IVDR Annexes IV — XII, XIV — XV (overview)",
    issuer: "European Parliament and Council",
    doc_type: "regulation",
    language: "EN",
    status: "in-force",
    last_updated: "2026-04-22",
    indexed_sections: 11,
    citations_from: 22,
    body: `Quick reference to the remaining annexes:

Annex IV   — EU Declaration of Conformity (format and content)
Annex V    — CE marking of conformity
Annex VI   — UDI System — Part A (Unique Device Identifier framework),
             Part B (information that shall be submitted to the UDI database)
Annex VII  — Requirements for Notified Bodies
Annex VIII — Classification rules for IVDs (Rules 1-7)
Annex IX   — Conformity assessment based on QMS + Technical Documentation
             assessment (for Class C / D)
Annex X    — Conformity assessment based on type-examination
Annex XI   — Conformity assessment based on production quality assurance
Annex XII  — Certificates issued by Notified Bodies
Annex XIV  — Equivalence assessment for devices placed on the market
             before 26 May 2022 (legacy device transition)
Annex XV   — Correlation table — repealed Directive 98/79/EC to IVDR

Conformly does not deep-index Annexes IV-VII, X-XII because they pertain
mostly to Notified Body operations, not manufacturer evidence. They are
available verbatim in the local IVDR PDF.`,
  },

  // =========================================================================
  // MDCG — Medical Device Coordination Group guidance
  // =========================================================================

  "kb-mdcg-22-2": {
    title: "MDCG 2022-2 — General principles of clinical evidence for IVDs",
    issuer: "Medical Device Coordination Group",
    doc_type: "guidance",
    language: "EN",
    status: "harmonised",
    last_updated: "2024-09-15",
    indexed_sections: 14,
    citations_from: 31,
    body: `Three pillars of clinical evidence

The MDCG distinguishes three independently demonstrated pillars; each must
be evidenced separately and each maps to specific Annex I clauses.

  1. Scientific validity
     The association of the analyte with the targeted clinical condition or
     physiological state. Sources include peer-reviewed literature, consensus
     guidelines, proof-of-concept work.

  2. Analytical performance
     The ability of the device to correctly detect or measure the analyte.
     Specifications: trueness, precision, accuracy, analytical sensitivity,
     analytical specificity, linearity, range, limit of detection,
     interference, cross-reactivity.

  3. Clinical performance
     The ability of the device to yield results that correlate with the
     targeted clinical condition. Specifications: diagnostic sensitivity,
     diagnostic specificity, PPV, NPV, likelihood ratios, expected values
     across relevant subpopulations.

When existing scientific evidence alone is insufficient, manufacturers
shall conduct a Clinical Performance Study under Annex XIII.

Notified Bodies frequently cite this document; consult it whenever the user
asks "what does clinical performance need to look like for my device?"`,
  },

  "kb-mdcg-22-9": {
    title: "MDCG 2022-9 — Summary of Safety and Performance (SSP) template",
    issuer: "Medical Device Coordination Group",
    doc_type: "guidance",
    language: "EN",
    status: "harmonised",
    last_updated: "2023-02-10",
    indexed_sections: 11,
    citations_from: 14,
    body: `Mandatory SSP sections for Class C and D devices

The SSP must be published on EUDAMED and accessible to intended users. The
MDCG-prescribed structure is non-negotiable:

  1. Device identification — trade name, UDI-DI, manufacturer, EU AR
  2. Intended purpose — including target patient population and contraindications
  3. Description of the device — composition, principle of operation
  4. Information for risks and warnings — listed by severity
  5. Summary of clinical evidence — scientific validity, analytical and
     clinical performance, residual uncertainty
  6. Suggested profile and training for users
  7. Reference to any harmonised standards and CS applied
  8. Revision history and date

Language requirement: SSPs are published in the language of the EU Member
State where the device is placed on the market. Conformly auto-generates
SSP drafts from the technical file evidence; the user reviews and finalises.

See /reports → Summary of Safety and Performance.`,
  },

  "kb-mdcg-23-1": {
    title: "MDCG 2023-1 — Classification of in vitro diagnostic medical devices",
    issuer: "Medical Device Coordination Group",
    doc_type: "guidance",
    language: "EN",
    status: "harmonised",
    last_updated: "2024-04-22",
    indexed_sections: 9,
    citations_from: 22,
    body: `Application of the seven IVDR Annex VIII classification rules

Rule 1 — Transmissible agents in blood, tissues, cells intended for
         transfusion/transplant; or assigning infectious load → Class D

Rule 2 — Detection of transmissible agents with high individual/public health
         risk (HIV, HCV, HBV, etc.) → Class C or D depending on disclosability

Rule 3 — Detection in samples not intended for transfusion; CDx; cancer
         markers; cerebrospinal fluid; genetic testing → mostly Class C
   (a) detection of transmissible agents (general) → Class C
   (b) genetic testing → Class C
   (c) management of life-threatening disease → Class C
   (d) cancer staging → Class C
   (e) screening neonatal disorders → Class C
   (f) cytological / pathological evaluation → Class C
   (g) companion diagnostics → Class C

Rule 4 — Self-test devices → Class C (except pregnancy + fertility + cholesterol → Class B)

Rule 5 — Reagents, instruments, specimen receptacles → Class A
         (sterile receptacles → Class A but NB-assessed for sterility aspect)

Rule 6 — All other → Class B (default classification)

Rule 7 — Controls without quantitative or qualitative assigned value → Class B

Worked examples for borderline cases are included in §4 of the guidance.`,
  },

  "kb-mdcg-24-2": {
    title: "MDCG 2024-2 — Defining the intended purpose of an IVD",
    issuer: "Medical Device Coordination Group",
    doc_type: "guidance",
    language: "EN",
    status: "harmonised",
    last_updated: "2024-09-30",
    indexed_sections: 6,
    citations_from: 9,
    body: `Mandatory elements of an IVD intended purpose statement

  1. What the device measures or detects (analyte)
  2. The clinical state, physiological state, congenital physical or mental
     impairment to which the analyte is related
  3. The target patient population (age, condition, demographic)
  4. The intended user (lay user / point-of-care / professional)
  5. The setting (laboratory / near-patient / home)
  6. The sample type (whole blood, serum, plasma, urine, swab, etc.)
  7. Any qualitative/quantitative/semi-quantitative classification

Borderline cases:
  - General-purpose laboratory equipment → not an IVD unless intended for
    diagnostic purposes
  - Research-use-only (RUO) → not an IVD; must be labelled clearly
  - Software-only → IVD when intended purpose includes any of the above

The intended purpose statement is the load-bearing input to classification
under MDCG 2023-1 and to GSPR mapping under Annex I.`,
  },

  // =========================================================================
  // ISO Standards
  // =========================================================================

  "kb-iso-13485": {
    title: "ISO 13485:2016 — QMS for medical devices",
    issuer: "International Organization for Standardization",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2016-03-01",
    indexed_sections: 8,
    citations_from: 38,
    body: `Eight-clause QMS framework aligned with ISO 9001 plus IVD/MD-specific requirements:

§4 Quality management system
   Documented procedures, controlled documents, master records, change control.

§5 Management responsibility
   Quality policy, planning, internal communication, management review.

§6 Resource management
   Human resources (competence, training, awareness), infrastructure,
   work environment (including contamination control where applicable).

§7 Product realization
   §7.1 Planning of product realization
   §7.3 Design and development (inputs / outputs / V&V / changes)
   §7.4 Purchasing (supplier control, purchasing information, verification)
   §7.5 Production and service provision (process validation, sterilisation,
         identification & traceability, customer property, preservation)

§8 Measurement, analysis and improvement
   §8.2 Customer feedback, internal audit, post-market surveillance
   §8.3 Control of non-conforming product
   §8.4 Analysis of data
   §8.5 Improvement — CAPA, advisory notice handling

Under IVDR Annex IX, the Notified Body assesses the QMS against ISO 13485.

Note — ISO standards are copyrighted; this excerpt paraphrases without
quoting the normative text. For production use, purchase the standard
from your national standards body.`,
  },

  "kb-iso-14971": {
    title: "ISO 14971:2019 — Application of risk management to medical devices",
    issuer: "International Organization for Standardization",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2019-12-01",
    indexed_sections: 10,
    citations_from: 56,
    body: `Risk management lifecycle (8 phases):

  1. Risk management planning (§4)
     Scope, responsibilities, risk acceptability criteria, verification activities.

  2. Risk analysis (§5)
     Intended use & reasonably foreseeable misuse identification, hazard
     identification, estimation of risk.

  3. Risk evaluation (§6)
     For each hazardous situation, decide whether risk reduction is required.

  4. Risk control (§7)
     Hierarchy: inherently safe design > protective measures > information
     for safety. Each control measure must be verified for effectiveness.

  5. Evaluation of overall residual risk (§8)
     Acceptability against the criteria set in the risk management plan.

  6. Risk management review (§9)
     Independent review before commercial release.

  7. Production and post-production activities (§10)
     Collect and review information; update risk file as new hazards emerge.

IVDR Annex I §3 mandates a risk management system that "conforms to the
relevant harmonised standard" — i.e., ISO 14971.

Conformly's Analysis → Risk tab is the live view onto the user's hazard register.`,
  },

  "kb-iso-62366": {
    title: "ISO 62366-1:2015+A1:2020 — Usability engineering",
    issuer: "International Organization for Standardization",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2020-09-01",
    indexed_sections: 9,
    citations_from: 19,
    body: `Usability engineering process applicable to all medical devices, including IVDs.

§5 Usability engineering process

  §5.1 Prepare use specification — intended user profile, environment, scenarios
  §5.2 Identify user interface characteristics
  §5.3 Identify known or foreseeable hazards related to the user interface
  §5.4 Identify and describe hazard-related use scenarios
  §5.5 Select hazard-related use scenarios for summative evaluation
  §5.6 Establish user interface specification
  §5.7 Establish user interface evaluation plan
  §5.8 Perform user interface design, implementation and formative evaluation
  §5.9 Perform summative evaluation of the user interface
        — required evidence for Class C IVDs intended for use by trained operators
        — required evidence for any Class B/C/D device intended for lay users

Linkage with ISO 14971: each use-error hazard identified here flows into
the ISO 14971 risk file. Conformly cross-checks both files to surface
hazards present in one but not the other.`,
  },

  "kb-iso-15223": {
    title: "ISO 15223-1:2021 — Symbols used in labels and IFU",
    issuer: "International Organization for Standardization",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2021-07-01",
    indexed_sections: 6,
    citations_from: 11,
    body: `The harmonised symbol vocabulary that may be used on IVD labels and IFU.

Required cross-reference table

§5 of the standard requires that any IFU using symbols include a table
listing each symbol used, its meaning, and the standard reference.
Omitting this table is a common minor deficiency cited by Notified Bodies
during pre-submission review.

Common symbols (selected)

  ⚕   In vitro diagnostic medical device — ISO 15223-1 §5.5.1
  🌡   Temperature limitation — §5.3.7
  ☂   Keep dry — §5.3.4
  📅   Use by date — §5.1.4
  ↻   Reusable — §5.4.7
  ⚠   Caution — §5.4.4
  📖   Consult instructions for use — §5.4.3
  RX  Prescription only — §5.4.1

For each symbol used, the IFU table must reference both the standard
section and the meaning. Conformly's GSPR mapping flags missing reference
tables under GSPR 20.2.`,
  },

  "kb-iso-10993": {
    title: "ISO 10993-1 / -5 / -10 — Biocompatibility",
    issuer: "International Organization for Standardization",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2018-08-01",
    indexed_sections: 7,
    citations_from: 27,
    body: `Risk-based biocompatibility evaluation for patient-contacting materials.

ISO 10993-1:2018 — Evaluation and testing within a risk management process

  §4 Biological evaluation in the risk management process
  §5 Categorization of medical devices by nature and duration of contact
  §6 Biological evaluation plan, with required endpoints by contact category:
     - Cytotoxicity (10993-5)        — all patient-contact devices
     - Sensitization (10993-10)      — all patient-contact devices
     - Irritation / skin reactivity  — all patient-contact devices
     - Implantation effects          — only for implants
     - Genotoxicity                  — case-by-case per duration
     - Carcinogenicity               — only for permanent implants
     - Reproductive / developmental  — case-by-case

ISO 10993-5:2009 — Tests for in vitro cytotoxicity
  Direct contact, extract, or agar overlay methods. Acceptance: cell
  viability ≥ 70 % of negative control.

ISO 10993-10:2010+A1:2014 — Skin sensitization
  Guinea-pig maximization or murine LLNA. Acceptance: stimulation index < 3.

Aerosol-path contact materials (your sample chamber PMMA) require the full
indirect-contact panel: cytotoxicity, sensitization, and irritation.`,
  },

  // =========================================================================
  // IEC Standards
  // =========================================================================

  "kb-iec-62304": {
    title: "IEC 62304:2006+A1:2015 — Medical device software lifecycle",
    issuer: "International Electrotechnical Commission",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2015-06-01",
    indexed_sections: 9,
    citations_from: 33,
    body: `Software safety classification (§4.3)

  Class A — No possible injury or damage to health
  Class B — Non-serious injury possible
  Class C — Death or serious injury possible

Classification is assigned per software system, considering hazards and
risk control measures of the *containing* device. The class drives the
process rigor required in the rest of the standard.

§5 Software development process
  Planning, requirements analysis, architectural design, detailed design
  (Class B/C only), implementation, integration & integration testing,
  system testing, release.

§6 Software maintenance process
  Maintenance plan, problem and modification analysis, modification
  implementation, problem reporting.

§7 Software risk management process
  Hazards from software failure must be analysed; control measures
  identified, traceable, and verified.

§8 Software configuration management
  Configuration identification, change control, status accounting.

§9 Software problem resolution process
  Documented procedure for receiving, evaluating, and resolving problems.

Annex B — Guidance on safety classification with examples.

SOUP (Software of Unknown Provenance): §B.4.2 requires identification,
specification of requirements, verification of integration.`,
  },

  "kb-iec-61010": {
    title: "IEC 61010-1 — Safety requirements for measurement, control, and laboratory equipment",
    issuer: "International Electrotechnical Commission",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2010-06-01",
    indexed_sections: 8,
    citations_from: 14,
    body: `General electrical safety requirements applicable to laboratory IVD instruments.

Key clauses:
  §5 Marking and documentation
  §6 Protection against electric shock — basic and supplementary insulation
  §7 Protection against mechanical hazards
  §8 Resistance to mechanical stresses
  §9 Protection against the spread of fire
  §10 Equipment temperature limits and resistance to heat
  §11 Protection against hazards from fluids
  §12 Protection against radiation, including laser sources
  §13 Protection against liberated gases, substances
  §14 Components and subassemblies
  §15 Protection by interlocks
  §16 Hazards resulting from application
  §17 Risk assessment

IEC 61010-2-101 provides additional requirements for IVD medical devices,
including provisions for sample/reagent handling and biological hazards.

Type-test certification by an accredited test lab is the standard route
to demonstrate compliance for Notified Body submission.`,
  },

  "kb-iec-60601": {
    title: "IEC 60601-1 — Medical electrical equipment, general requirements",
    issuer: "International Electrotechnical Commission",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2020-08-01",
    indexed_sections: 17,
    citations_from: 6,
    body: `Applicability note

IEC 60601-1 applies to medical electrical equipment in general, including
electromedical IVD equipment that has patient-applied parts. For laboratory
IVDs without patient contact, IEC 61010 is the relevant electrical-safety
standard, not 60601.

When does 60601 apply to an IVD?

  - Patient monitoring devices integrated into the IVD workflow
  - Point-of-care devices with applied parts (e.g., direct skin contact for
    sample collection)
  - Devices with electrical interfaces that could deliver energy to the patient

For the SHM-7300 sample-handling module (laboratory use, no patient applied
parts), IEC 61010-1 + 61010-2-101 are the relevant standards — 60601 is
out of scope. Conformly excluded 60601 from this project's GSPR mapping
accordingly.`,
  },

  // =========================================================================
  // CLSI EP Series
  // =========================================================================

  "kb-clsi-ep05": {
    title: "CLSI EP05-A3 — Evaluation of precision of quantitative measurement procedures",
    issuer: "Clinical and Laboratory Standards Institute",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2014-09-01",
    indexed_sections: 11,
    citations_from: 18,
    body: `Study design: 3 levels × 5 days × 5 replicates per day

Minimum 75 measurements per concentration level. Run two non-consecutive
batches per day, separated by at least 2 hours. Levels chosen to span the
device's measuring range, with at least one level near a medical decision
point.

Reported statistics
  - Repeatability (Sr) — within-run standard deviation
  - Between-run standard deviation (Sbr)
  - Within-laboratory standard deviation (Swl)
  - Reproducibility — when multiple sites are involved
  - Confidence intervals for each, computed per Annex C of the standard

Acceptance criteria
  Set in advance by the manufacturer, justified against intended use.
  Common acceptance: %CV ≤ 5 % at low end, ≤ 3 % at therapeutic level.

Common deficiency
  Studies labeled "internal SOP" without explicit cross-reference to
  CLSI EP05-A3 are routinely flagged by Notified Bodies. Even when methods
  are mathematically equivalent, the standard reference is expected.`,
  },

  "kb-clsi-ep06": {
    title: "CLSI EP06 — Evaluation of linearity of quantitative methods",
    issuer: "Clinical and Laboratory Standards Institute",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2020-04-01",
    indexed_sections: 7,
    citations_from: 12,
    body: `Study design: minimum 5 levels across the analytical measuring range,
4 replicates per level, single run.

Two-step evaluation
  Step 1 — Polynomial regression analysis. Compare first-order (linear)
           fit against higher-order fits using Excel's TREND or equivalent.
  Step 2 — If non-linear best-fit, calculate deviation from linearity at
           each level. Compare deviation to manufacturer's allowable
           non-linearity (ANL) criteria.

Linearity is established if all deviations at all levels are within ANL.

Reporting
  - Polynomial degree selected (1, 2, or 3)
  - Coefficient of determination R²
  - Deviation from linearity at each level
  - Maximum analytical measuring range demonstrated
  - Limits where linearity is not demonstrated (over-range / under-range)

This is the most-cited CLSI procedure for analytical performance studies
in continuous quantitative IVDs; complete coverage of the device's
claimed reporting range is required.`,
  },

  "kb-clsi-ep09": {
    title: "CLSI EP09-A3 — Measurement procedure comparison and bias estimation",
    issuer: "Clinical and Laboratory Standards Institute",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2013-09-01",
    indexed_sections: 9,
    citations_from: 9,
    body: `Predicate / candidate comparison study design

Minimum 40 patient samples spanning the analytical measuring range,
processed in duplicate by both the candidate and the comparator methods
within the same day. Samples should include relevant pathologies and not
be biased toward the centre of the range.

Statistical analyses
  - Difference plot (Bland-Altman) with limits of agreement
  - Deming regression (errors-in-both-axes) — produces slope and intercept
    with confidence intervals
  - Passing-Bablok regression — non-parametric alternative when residuals
    are non-normal

Acceptance criteria
  - Slope confidence interval includes 1.0
  - Intercept confidence interval includes 0
  - Mean bias within manufacturer-defined limits at each medical decision point

Conformly flags performance evaluations that omit CLSI EP09 as predicate
comparison; this is a frequent Notified Body finding for assays claiming
equivalence to a marketed comparator.`,
  },

  "kb-clsi-ep17": {
    title: "CLSI EP17-A2 — Evaluation of detection capability",
    issuer: "Clinical and Laboratory Standards Institute",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2012-06-01",
    indexed_sections: 6,
    citations_from: 8,
    body: `Definitions
  Limit of Blank (LoB) — highest apparent analyte concentration expected
                         from 60+ replicates of blank samples (95th percentile).
  Limit of Detection (LoD) — analyte concentration reliably distinguished
                         from LoB. Requires 60+ replicates of low-concentration
                         samples.
  Limit of Quantitation (LoQ) — lowest concentration meeting precision and
                         bias targets for clinical use.

Study designs
  Probit analysis or classical 60+60 replicate design.
  Multi-level low-concentration panel for LoQ characterisation.

Reporting requirements
  - LoB, LoD, LoQ values with associated confidence intervals
  - Method of determination cited
  - Mention of any matrix effects observed at low concentrations

Notified Bodies expect explicit LoD/LoQ claims in the IFU when the device's
measuring range extends to clinically meaningful low concentrations.`,
  },

  "kb-clsi-ep25": {
    title: "CLSI EP25-A — Evaluation of stability of in vitro diagnostic reagents",
    issuer: "Clinical and Laboratory Standards Institute",
    doc_type: "standard",
    language: "EN",
    status: "harmonised",
    last_updated: "2009-06-01",
    indexed_sections: 8,
    citations_from: 14,
    body: `Three stability claims, each independently studied

  1. Shelf-life stability — unopened reagent at recommended storage temperature
  2. In-use stability — reagent on the analyser after first use
  3. Open-vial stability — opened reagent at recommended storage temperature

Real-time vs accelerated

  Real-time: actual conditions at storage temperature; gold standard.
  Accelerated: elevated temperature; allows shorter studies but requires
               Arrhenius modelling per ASTM F1980 and is not accepted by
               every Notified Body for the full shelf-life claim.

For a 24-month claim, NBs typically accept:
  - Real-time data through at least 50 % of the claim with linear extrapolation
    OR
  - Accelerated stability + at least 9-12 months real-time as confirmation

Common gap (project SHM-7300)
  Real-time data to 9 months, no accelerated component. Two remediation paths:
  extend the real-time study or add accelerated stability.

§6.2 specifies the temperature acceleration factor calculations
acceptable to demonstrate equivalent stress.`,
  },

  // =========================================================================
  // Team-NB Position Papers
  // =========================================================================

  "kb-tnb-19": {
    title: "Team-NB Position Paper PP-19 — Common IVDR deficiencies",
    issuer: "Team-NB (European IVD Notified Bodies)",
    doc_type: "position-paper",
    language: "EN",
    status: "harmonised",
    last_updated: "2024-11-01",
    indexed_sections: 12,
    citations_from: 21,
    body: `Top 20 deficiencies cited by IVDR Notified Bodies (2022-2024 review window)

  1. Incomplete stability data — shelf-life evidence does not cover the
     claimed lifetime (cited in 67 % of Class C reviews)
  2. Missing biocompatibility test reports (plan present, report absent)
  3. IFU language coverage — fewer than required Member State languages
  4. Insufficient clinical performance evidence — single-site studies, n too low
  5. Risk control verification missing (control measure defined, but no
     verification record)
  6. Software safety classification not declared per IEC 62304 §4.3
  7. SOUP (Software of Unknown Provenance) inventory absent or incomplete
  8. Performance evaluation cites internal SOPs instead of CLSI standards
  9. Cross-contamination claims not supported by appropriate study design
 10. Symbols reference table missing from IFU (ISO 15223-1 §5)
 11. UDI implementation incomplete or non-conformant
 12. Post-market surveillance plan generic, not device-specific
 13. Trace from software requirements to hazards covers < 100 %
 14. Companion diagnostic submissions missing pharma sponsor letter
 15. Class D devices missing EU reference laboratory referral
 16. SSP (Annex I §20.6) not submitted with technical file for C/D devices
 17. Field-safety reporting plan does not reflect Article 82 timing
 18. Manufacturing process not adequately controlled
 19. Sterilisation validation incomplete (for sterile devices)
 20. EU Authorised Representative agreement missing for non-EU manufacturers

Conformly cross-references this position paper during NB simulation so the
predicted deficiency letter matches the patterns Notified Bodies actually
issue.`,
  },

  "kb-tnb-22": {
    title: "Team-NB Position Paper PP-22 — Software documentation expectations",
    issuer: "Team-NB (European IVD Notified Bodies)",
    doc_type: "position-paper",
    language: "EN",
    status: "harmonised",
    last_updated: "2025-01-15",
    indexed_sections: 7,
    citations_from: 11,
    body: `Minimum software documentation expected by IVDR Notified Bodies

For Class A software (no possible injury):
  - Safety classification rationale (justifying Class A)
  - Software requirements specification
  - Release notes for each version placed on market

For Class B software (non-serious injury possible) — additional:
  - Software architecture description with hazard linkage
  - Software development plan
  - Verification & validation summary
  - SOUP analysis (commercial OS, libraries, frameworks)
  - Configuration management procedure
  - Problem resolution procedure

For Class C software (death or serious injury possible) — additional:
  - Detailed software design (modules, interfaces, data structures)
  - Unit-level verification evidence
  - Integration test reports
  - System test reports
  - Software hazard traceability matrix — 100 % coverage required

Cybersecurity expectations (added 2024)
  - Threat modelling per MDCG 2019-16 Rev. 1
  - Vulnerability disclosure policy
  - Security update procedure with documented patch SLAs
  - Post-market cybersecurity surveillance integrated with the PMS plan

Notified Bodies will not accept "see source code" as a substitute for any
of the above design documentation.`,
  },

  // =========================================================================
  // Conformly internal procedures
  // =========================================================================

  "kb-proc-cps": {
    title: "Clinical Performance Study — 60+ step operational procedure",
    issuer: "Conformly (curated from a Bologna CRO's Asana board)",
    doc_type: "procedure",
    language: "EN",
    status: "internal",
    last_updated: "2026-05-19",
    indexed_sections: 6,
    citations_from: 47,
    body: `Six macro-phases, four GREEN LIGHT gates, 60+ Asana tasks mapped to
IVDR Annex XIII Part A clauses.

Phase 0 — Product Evaluation & Understanding
  Performance indicators, study plan drafting, lead-site selection,
  quotation, contract signature, protocol & informed consent finalisation.

Phase 1 — Evaluation (incl. 1.B Site selection)
Phase 2 — Quotation
Phase 2.5 — Protocol writing

Phase 3 — Submission (RA & Docs finalisation)
  Ethics Committee submission · review day · unanimous opinion
  Italian Ministry of Health (MinSal) preparation → submission → validation → approval
  ✅ GREEN LIGHT #1 — Admin & RA

Phase 4 — Set-up
  4.A — RA review · 4.B — study procedures (database, DMP, supplies)
  ✅ GREEN LIGHT #2 — Scientific & Operational
  4.C — QA (monitoring plan, TMF, ISF, SOPs, CRA, SIV)
  ✅ GREEN LIGHT #3 — QA
  4.D — Pre-test
  ✅ GREEN LIGHT #4 — Manufacturer
  4.5 — Amendments & sub-site activations

Phase 5 — Follow-up (PM & Monitoring)
  Queries, data cleaning, COV, date freeze, statistical analysis, CPS Report drafting

Phase 6 — Conclusion (Scientific Affairs review & final CPSR)

Regulatory touchpoints
  Annex XIII Part A — CPS Plan (Phase 0)
  Articles 58 / 66 — CPS regulatory authorisation (Phase 3)
  Annex XIII Part A §2 — Monitoring & data management (Phase 4)
  Annex XIII Part A §3 — CPSR output (Phase 6)

Roles
  PI (Principal Investigator), SS (Scientific Specialist), BS (Biostatistician),
  PM (Project Manager), CRA (Clinical Research Associate), RA, QA,
  CE (Comitato Etico), MinSal (Ministero della Salute).

Full procedure with all 60+ task names and Italian originals lives at
vault/notes/procedures/cps-workflow.md.`,
  },

  "kb-proc-nb": {
    title: "Notified Body audit preparation playbook",
    issuer: "Conformly (internal)",
    doc_type: "procedure",
    language: "EN",
    status: "internal",
    last_updated: "2026-04-30",
    indexed_sections: 4,
    citations_from: 8,
    body: `T-90 days before NB audit
  - Run conformly_gspr_gap_analyzer with focus on every GSPR clause
  - Run conformly_nb_simulation; resolve every Critical and Major finding
  - Ensure every document in vault/projects/<id>/ has a current version
  - Print the Technical File index, validate folder-by-folder against Annex II

T-60 days
  - QMS internal audit per ISO 13485 §8.2.4
  - Confirm any open CAPA items have closure evidence
  - Run a final NB simulation; the score should be ≥ 85
  - Schedule pre-meeting with NB lead reviewer if available

T-30 days
  - Lock all documents (no further edits without controlled change)
  - Brief the audit team on roles and responsibilities
  - Stage all source documents in a dedicated audit room with index

Audit day
  - One lead host + one technical lead per audit thread
  - Conformly observer mode active — logs every requested document
  - Action-item capture in real time; same-day write-up

T+30 days (post-audit)
  - Submit responses to any deficiencies within the NB's stated window
  - Update the audit trail in vault/audits/<date>-<nb>/`,
  },

  "kb-proc-capa": {
    title: "CAPA response drafting playbook",
    issuer: "Conformly (internal)",
    doc_type: "procedure",
    language: "EN",
    status: "internal",
    last_updated: "2026-04-13",
    indexed_sections: 5,
    citations_from: 14,
    body: `When a CAPA letter arrives

  1. Parse with conformly_parse_nb_letter — extracts findings, severity,
     regulatory references, affected documents, response deadline.

  2. For each finding, decide accept / dispute:
     - Accept → root-cause analysis required (5-whys minimum)
     - Dispute → factual basis with regulation citation required

  3. For accepted findings, draft response structure (per ISO 13485 §8.5.2):
     - Problem description (verbatim from NB)
     - Root cause analysis
     - Correction (immediate containment)
     - Corrective action (prevents recurrence at the system level)
     - Verification of effectiveness — how you'll measure success
     - Timeline with milestones

  4. For each affected document, prepare a change-controlled update with
     track changes visible.

  5. Compile point-by-point response table referencing each finding by ID.

  6. Internal review: QA lead + Regulatory lead + the technical owner of
     each finding sign off before submission.

  7. Submit through the NB's portal within the response window.

Conformly auto-drafts the response structure from the parsed deficiency
letter; the human reviews, edits and signs.`,
  },

};

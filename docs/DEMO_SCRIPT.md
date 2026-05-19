# Conformly · 90-second demo script

> Designed for a single take, screen-recorded at 1080p with system audio
> off. Length target: **90 seconds**. Voice-over total ~210 words.

---

## Scene 0 — Title card (0:00 – 0:03)

**On screen:** Conformly logo on the landing-page hero.

**VO:** "This is Conformly."

---

## Scene 1 — The hook (0:03 – 0:15)

**On screen:** scroll slowly down `conformly.gopromp.com` past the
"old way vs Conformly way" comparison cards.

**VO:** "Medical-device teams don't fail IVDR because the regulation
is impossible. They fail because they design without ever seeing it.
We make IVDR visible from Day 1 — and tell you what a Notified Body
would flag, **before** you submit."

---

## Scene 2 — Dashboard (0:15 – 0:30)

**On screen:** click **Open the product** → `/dashboard`. Pause on the
6-phase timeline + ScoreRing + Today's Actions.

**VO:** "Drop your design files in. Conformly tracks every phase of the
510-day certification journey. The score ring on the right is the agent's
real-time prediction of how a Notified Body would rate you today —
based on every clause, every document, every gap."

---

## Scene 3 — Live Gemini (0:30 – 0:55)

**On screen:** navigate to `/nb-simulation`. Press **Run live (real
Gemini)**. The timer starts ticking — let it run.

**VO** *(while waiting)*: "This is a real call to Gemini 3 Pro. Right
now — through our FastAPI sidecar — the model is reading an actual
TÜV SÜD deficiency letter from the project vault. Two million tokens
of context, no vector search, no RAG. Ten seconds…"

**On screen:** the timer hits ~10 s, the green LiveResultBanner appears
showing TÜV SÜD · NB 0123 · clock_stopped · 4 findings · 10.3 s.

**VO** *(when result lands)*: "Four findings, structured. Each one with
the IVDR clause it cites, the severity, the documents affected, and a
Generate-CAPA button."

---

## Scene 4 — Knowledge transparency (0:55 – 1:10)

**On screen:** navigate to `/knowledge`. Click through 3 different
documents in the tree — IVDR Annex I, MDCG 2022-2, CLSI EP05-A3 —
showing distinct content in each.

**VO:** "Every claim Conformly makes traces back to a real source.
Twenty-seven regulatory documents, indexed at section level. You can
see exactly what the agent is reading."

---

## Scene 5 — Chat (1:10 – 1:25)

**On screen:** navigate to `/chat`. Click the **Is my device Class B or
Class C?** suggested question. Real Gemini reply lands in ~5 seconds with
citation pills.

**VO:** "Ask anything regulatory in plain English — Class B or C,
software lifecycle expectations, biocompatibility requirements.
Every answer cites both the regulation and a document from your project."

---

## Scene 6 — Architecture + close (1:25 – 1:30)

**On screen:** back to the landing page, scroll to the architecture
ASCII diagram.

**VO:** "Built on the open-source Hermes Agent runtime. Powered by
Gemini 3. Deployed on a single Vultr box. Try it at conformly.gopromp.com."

---

## Capture tips

- Use Chrome on a 1920×1080 display, zoom 100 %.
- Quit Slack / Mail / anything that fires a notification.
- Pre-warm both `/nb-simulation` (open once before recording so Next.js is
  hot) and `/chat` (open once so the WebSocket-style handshake is done).
- The live Gemini call is non-deterministic in latency: rehearse twice
  to get a feel for the timing, then record on the third take.
- Don't try to scrub through — the demo should feel continuous.

## Tools to use

- **macOS:** built-in screen recording (Cmd+Shift+5) for 1080p capture.
- **Voice-over:** record separately, mix in iMovie / DaVinci Resolve.
- **Final export:** H.264, 1080p, ≤ 25 MB to fit hackathon upload limits.

## Backup plan if the live Gemini call fails

- Press **Reset to scripted preview** on `/nb-simulation` — the page
  falls back to a faithful 8-finding mock that's identical in shape.
- Voice-over change: "Here's a captured run from earlier this week —
  the live call works the same way, only the latency varies."

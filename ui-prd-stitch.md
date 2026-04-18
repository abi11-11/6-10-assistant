# 6:10 Assistant — UI Design PRD for Google Stitch

## Product Context

**Product:** 6:10 Assistant — An AI-first operations intelligence tool for industrial facility managers.

**Primary User — Maya (Operations Lead):**
- Arrives at 6:10 AM with under 2 hours before the 8:00 AM leadership review
- Needs to understand overnight activity, separate noise from threats, and produce a credible briefing
- Does NOT want dashboards with overwhelming data or an AI making confident guesses
- Wants to trust the system — inspect evidence, challenge conclusions, maintain authority

**Secondary User — Nisha (Site Head):**
- Arrives at 8:00 AM, reads the published briefing
- Needs: what happened, what's harmless, what needs escalation, what's still uncertain

**Design Mandate:**
- Dark, serious, command-center aesthetic — this is a high-stakes operations tool
- Information density without clutter — time pressure is real
- Human authority must feel paramount — AI is the assistant, Maya is the decision-maker
- Every AI conclusion must be visually accompanied by its confidence and reasoning

---

## Global Design System

### Color Palette

```
Background (primary):     #0D1117  — Near-black, GitHub-style
Background (panels):      #161B22  — Dark navy surface
Background (cards):       #1C2128  — Slightly elevated card surface
Border (subtle):          #30363D  — Muted border
Border (active):          #58A6FF  — Blue highlight for selected state

Text (primary):           #E6EDF3  — Off-white body text
Text (secondary):         #8B949E  — Muted label text
Text (disabled):          #484F58  — Placeholder/disabled

Accent (blue):            #58A6FF  — Primary interactive / selected
Accent (green):           #3FB950  — Approved / high confidence / success
Accent (yellow):          #D29922  — Warning / medium confidence / unresolved
Accent (red):             #F85149  — Critical / rejected / low confidence
Accent (purple):          #BC8CFF  — Agent activity / AI-generated content
Accent (cyan):            #39C5CF  — Mission / drone route

Status colors:
  DRAFT:                  #8B949E  (muted gray)
  UNDER_INVESTIGATION:    #D29922  (amber)
  READY_FOR_REVIEW:       #58A6FF  (blue)
  APPROVED:               #3FB950  (green)
  REJECTED:               #F85149  (red)
```

### Typography

```
Font family:   "Inter", system-ui, sans-serif (import from Google Fonts)
Monospace:     "JetBrains Mono", monospace (for IDs, timestamps, confidence values)

Scale:
  display:     28px / 700 weight  — Page titles, briefing headlines
  heading:     20px / 600 weight  — Panel headers, finding titles
  subheading:  15px / 600 weight  — Section labels, badge text
  body:        14px / 400 weight  — Descriptions, evidence text
  caption:     12px / 400 weight  — Timestamps, metadata, IDs
  mono:        13px / 400 weight  — Confidence values, event IDs, zone codes
```

### Spacing

```
Base unit: 4px
xs: 4px   sm: 8px   md: 16px   lg: 24px   xl: 32px   2xl: 48px
Border radius: 6px (cards), 4px (badges), 8px (panels)
```

### Component Patterns

**Confidence Bar:**
- Track: full width, 6px height, background #30363D, radius 3px
- Fill: color-coded (red <40%, amber 40–70%, green >70%)
- Value shown in mono font to the right: "78%"

**Status Badge:**
- Pill shape, 12px font, uppercase, colored border + light tinted background
- DRAFT: gray | UNDER_INVESTIGATION: amber | READY_FOR_REVIEW: blue | APPROVED: green | REJECTED: red

**AI Attribution Tag:**
- Small purple tag: "🤖 AI-generated" on any content produced by the agent
- Helps Maya distinguish AI content from seeded facts

**Evidence Reference Chip:**
- Inline monospace chip: `CAM-001` `BADGE-004` with icon for source type

---

## Screen 1: Morning Investigation Workspace (Primary)

> **Route:** `/` or `/investigation`
> **Epic:** 1 (Stories 1.1, 1.2, 1.3)
> **User:** Maya

### Layout — Three-Panel Grid (Desktop 1280px+)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                     │
│  6:10 Assistant    [Investigation: Apr 17 Overnight]  6:10 AM   │
├──────────────┬──────────────────────────┬───────────────────────┤
│              │                          │                       │
│  FINDINGS    │   FINDING DETAIL &       │   SPATIAL MAP         │
│  QUEUE       │   EVIDENCE PANEL         │   PANEL               │
│  (320px)     │   (flex grow)            │   (380px)             │
│              │                          │                       │
│  [5 cards]   │  Title + Confidence      │  SVG zone map         │
│              │  Status + Rationale      │  Event markers        │
│              │  Evidence chain          │  Highlighted zone     │
│              │  Unresolved questions    │                       │
│              │  Recommended action      │  Timeline strip       │
│              │  [Approve] [Reject]      │  (bottom of map)      │
│              │  [Needs Investigation]   │                       │
└──────────────┴──────────────────────────┴───────────────────────┘
```

### Panel 1: Findings Queue (Left, 320px fixed)

**Header:**
- Label: "Overnight Findings" (heading)
- Subtitle: "5 prioritized · Apr 17 · 22:00–06:00" (caption, muted)
- Sort indicator: "Sorted by confidence ↓" (caption)

**Finding Card (repeat ×5, clickable):**
```
┌─────────────────────────────────┐
│ [●] Access Point Anomaly        │  ← colored dot = status
│     admin-building              │  ← zone (caption, muted)
│                                 │
│  ████████░░  78%    [DRAFT]     │  ← confidence bar + status badge
│                                 │
│  2 unresolved questions  →      │  ← count + chevron
└─────────────────────────────────┘
```

**Selected state:** Blue left border (3px), background tinted #1A2332, `aria-selected="true"`

**Finding status color dot legend:**
- Gray dot = DRAFT
- Amber dot = UNDER_INVESTIGATION  
- Blue dot = READY_FOR_REVIEW
- Green dot = APPROVED
- Red dot = REJECTED

### Panel 2: Finding Detail & Evidence (Center, flex)

**When no finding selected:**
- Centered empty state: ghost icon + "Select a finding to begin investigation"

**When finding selected:**

**Section A — Finding Header:**
```
Access Point Anomaly at admin-building        [DRAFT badge]
🤖 AI-generated · Finding ID: finding-1
──────────────────────────────────────────────────────────
Confidence:  ████████░░  78%
```

**Section B — Observation:**
- Label: "OBSERVATION" (subheading, muted)
- Body: full description text from seeded data

**Section C — Hypothesis:**
- Label: "WORKING HYPOTHESIS" + 🤖 tag
- Purple left border accent on this block
- Text: Agent's candidate explanation

**Section D — Evidence Chain:**
- Label: "EVIDENCE REFERENCED"
- Horizontal list of chips: `BADGE-004` `CAM-012` (each clickable, shows tooltip with full evidence metadata)
- Each chip: source icon (camera/badge/fence/drone) + event ID + zone + timestamp

**Section E — Unresolved Questions:**
- Label: "OPEN QUESTIONS" with amber warning icon
- Bullet list with amber `?` prefix:
  - "Who attempted access? Malfunction or break-in?"
  - "What was the forced entry method?"

**Section F — Recommended Next Action:**
- Label: "RECOMMENDED ACTION" + 🤖 tag
- Callout box: "Run badge access query for admin-building 02:00–04:00 window"

**Section G — Review Actions (sticky bottom of panel):**
```
──────────────────────────────────────────────────────────
[✓ Approve]    [✗ Reject]    [⚠ Needs Investigation]
──────────────────────────────────────────────────────────
```
- Approve: green button
- Reject: red button  
- Needs Investigation: amber outline button
- All disabled if finding is already decided (show decision badge instead)

### Panel 3: Spatial Map (Right, 380px fixed)

**Map Canvas (SVG):**
- Dark background (#0D1117) with zone grid overlay
- Zones labeled: `perimeter-north`, `admin-building`, `storage-yard-south`, `data-center`, `block-c`
- Zone rectangles with subtle border (#30363D)

**Event Markers:**
- Circle per finding, positioned in its zone
- Color = confidence color (red/amber/green)
- Size = proportional to confidence (min 12px, max 24px radius)
- Selected finding's marker: pulsing ring animation
- Hover tooltip: finding title + confidence

**Timeline Strip (below map, full width of panel):**
- X-axis: 22:00 → 06:00 (overnight window)
- Each event plotted as a tick mark, colored by type
- Selected finding's event highlighted with vertical highlight bar

---

## Screen 2: Agent Investigation Status (Modal/Drawer)

> **Triggered by:** "Needs Investigation" action on a finding, or when Epic 2 agent is running
> **Epic:** 2 (Stories 2.1, 2.2, 2.3)

### Layout — Right Drawer (640px wide, slides over map panel)

**Header:**
```
Agent Investigation                          [×]
Finding: Access Point Anomaly · admin-building
```

**Agent Activity Feed (scrollable list):**

Each step shown as a timeline entry:
```
  🤖 ──●── Analyzing unresolved questions          [10:32:01]
  ✓  ──●── Identified 2 evidence gaps              [10:32:02]
  🔧 ──●── Invoking: badge-access-tool             [10:32:03]
            Zone: admin-building | Window: 02:00-04:00
  ✓  ──●── Evidence returned: 3 items              [10:32:05]
  🤖 ──●── Recomputing confidence...               [10:32:06]
  ✓  ──●── Confidence updated: 55% → 82%           [10:32:07]
            Reason: Badge logs corroborate anomaly
```

Color coding per step type:
- 🤖 Purple: agent reasoning step
- 🔧 Cyan: tool invocation
- ✓ Green: successful result
- ⚠ Amber: partial result / uncertainty
- ✗ Red: tool failure / no evidence

**MCP Tool Call Detail (expandable per step):**
```
▼ badge-access-tool call #1
  Input:  { zone: "admin-building", window: "02:00-04:00" }
  Output: [
    { eventId: "BADGE-007", confidence: 0.89, ... },
    { eventId: "BADGE-008", confidence: 0.71, ... }
  ]
  Latency: 142ms
```

**Updated Confidence (bottom of drawer):**
```
Before:  ████████░░  55%
After:   ██████████  82%   ↑ +27%
```

**Actions:**
- [View Updated Finding] — closes drawer, refreshes center panel
- [Propose Mission] — opens Mission Simulation screen (if confidence still low)

---

## Screen 3: Drone Mission Simulation

> **Route:** `/findings/:id/mission`
> **Epic:** 3 (Stories 3.1, 3.2, 3.3)

### Layout — Full Screen Takeover

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Investigation                                     │
│  Mission Simulation: Fence Alert · perimeter-north  [DRAFT] │
├───────────────────────────────┬──────────────────────────────┤
│                               │                              │
│   MISSION MAP (SVG)           │   MISSION PLAN               │
│                               │                              │
│   [Facility map with          │   Target Uncertainty:        │
│    drone route overlay]       │   "Was breach intentional?"  │
│                               │                              │
│   ● Start (entrance)          │   Route (3 checkpoints):     │
│   ──── route line ────        │   1. Gate 3 — fence inspect  │
│   ① Checkpoint 1 (Gate 3)     │   2. Perimeter-N camera      │
│   ② Checkpoint 2 (cam)        │   3. Zone A badge reader     │
│   ③ Checkpoint 3 (badge)      │                              │
│   ● End (entrance)            │   Predicted Evidence:        │
│                               │   · CAM-N captures motion    │
│                               │   · Badge shows no entry     │
│                               │   Expected Δ confidence: +20%│
│                               │                              │
│                               │   ─────────────────────────  │
│                               │   [✓ Approve Mission]        │
│                               │   [✗ Reject Mission]         │
│                               │   [Edit Checkpoints]         │
└───────────────────────────────┴──────────────────────────────┘
```

**Mission Map Details:**
- Drone route as animated dashed cyan line
- Checkpoints numbered ①②③ with tap/click to expand rationale
- Zone shading shows coverage area
- Start/End marked with drone icon

**Checkpoint card (on hover/click):**
```
① Gate 3 Perimeter Inspection
Purpose: Verify fence integrity at breach zone
Expected: Physical damage visible or no damage
Resolves: "Was breach intentional?"
```

**After approval — Simulation Running:**
- Animated drone icon follows route on map
- Live feed (simulated): "Arriving at Gate 3... Scanning... No physical breach found"
- Each checkpoint completes with outcome tag: `✓ No damage` / `⚠ Motion detected`

**Post-simulation Results:**
```
Mission Complete
─────────────────────────────────────
Gate 3:    ✓ No physical breach found
Camera N:  ⚠ Motion from nearby tree
Badge:     ✓ No unauthorized entry
─────────────────────────────────────
Confidence updated: 45% → 63%  (+18%)
Finding status: READY_FOR_REVIEW
[View Updated Finding →]
```

---

## Screen 4: Human Review & Decision (Modal)

> **Triggered by:** Approve / Reject / Needs Investigation buttons in Screen 1
> **Epic:** 4 (Stories 4.1, 4.2)

### Layout — Center Modal (600px wide)

**Header:**
```
Review Finding
Access Point Anomaly at admin-building
```

**Evidence Summary (read-only, collapsible):**
- Full evidence chain listed (all `evidence_ids` with source + description)
- Confidence change history: "Initial 55% → Evidence expansion +27% → Final 82%"
- Agent reasoning trace (collapsible, labeled 🤖)

**Decision Form:**

```
Your Decision *
  ○ Approve — Include in briefing as reviewed finding
  ○ Reject  — Exclude; flag as noise or false alarm
  ○ Refine  — Include but with modified conclusion

Rationale (required) *
┌─────────────────────────────────────────────────┐
│ Evidence corroborates badge anomaly. Recommend  │
│ escalation to security team.                    │
└─────────────────────────────────────────────────┘
Reviewer: Maya (Operations Lead)         [Submit Decision]
```

**After submission:**
- Finding card in queue updates status badge immediately
- Toast: "Decision recorded — Finding marked APPROVED"
- Modal closes, center panel shows decision state

**Decision Provenance Trail (visible in center panel after decision):**
```
Decision History
─────────────────────────────────────────────────
04:17 · Agent   · Confidence 55% (initial)       🤖
04:17 · Tool    · badge-access-tool invoked       🔧
04:17 · Agent   · Confidence updated to 82%      🤖
06:14 · Maya    · APPROVED                       ✓
                 "Evidence corroborates..."
```

---

## Screen 5: Morning Briefing (Publication View)

> **Route:** `/briefing`
> **Epic:** 4 (Story 4.3)
> **Users:** Maya (publish), Nisha (read)

### Layout — Single Column, Print-Friendly

**Header:**
```
Morning Briefing
Ridgeway Site · April 17, 2026 · Generated 07:58 AM
Prepared by: Maya (Operations Lead)
Status: [PUBLISHED]
```

**Section 1 — Summary:**
- 2–3 sentence natural language summary of overnight period
- "3 findings reviewed · 2 approved · 1 rejected · 0 unresolved"

**Section 2 — Approved Findings (cards):**

Each card:
```
┌──────────────────────────────────────────────────────────┐
│ ✓  Access Point Anomaly at admin-building      [APPROVED] │
│    Confidence: 82%                                        │
│    Conclusion: Badge anomaly confirmed. Recommend         │
│    security team review of after-hours access logs.       │
│    Evidence: BADGE-007, CAM-012                           │
│    Reviewed by: Maya · 06:14 AM                           │
└──────────────────────────────────────────────────────────┘
```

**Section 3 — Unresolved Uncertainties:**
- Amber callout block listing any findings that remain uncertain
- "The following findings could not be fully resolved and are flagged for follow-up:"

**Section 4 — Recommended Actions:**
- Numbered action list
- Each action linked to its source finding

**Section 5 — Rejected / Noise:**
- Collapsed by default, expandable
- Shows rejected findings with rationale (Maya's override)

**Footer Actions:**
```
[📥 Download PDF]   [📧 Share with Nisha]   [← Back to Investigation]
```

---

## Screen 6: Empty / Loading States

### App Loading (initial)
- Dark background, centered logo "6:10"
- Subtle pulsing animation
- "Loading overnight scenario..." (caption)

### No Findings Loaded
- Empty state in findings queue
- Icon: clipboard with question mark
- "No overnight findings for this period"
- [Load Demo Scenario] button

### Agent Thinking (inline in center panel)
- Replaced content with animated gradient bar
- "Agent is analyzing evidence..." (purple, pulsing)
- Progress steps visible as they complete

---

## Navigation & App Shell

**Top Header Bar (fixed, 56px):**
```
[6:10]  Investigation: Apr 17 Overnight    [6:10 AM ↑]    [Maya ▾]
```
- Left: App logo / wordmark
- Center: Active scenario label
- Right: Current time (updates live) + user avatar menu

**Tab Navigation (below header):**
```
[Investigation]  [Briefing]
```
- Investigation = Screen 1 (primary)
- Briefing = Screen 5 (published output)

---

## Key Interaction Flows to Design

1. **Finding Selection** → click card in queue → center panel animates in with finding detail, map highlights zone marker

2. **Approve flow** → click Approve → modal appears with evidence summary and rationale field → submit → card status updates, toast fires

3. **Agent Investigation** → click "Needs Investigation" → drawer slides in from right → real-time activity feed populates → completion updates confidence bar in center panel

4. **Mission Simulation** → triggered when agent confidence still low after tool invocation → navigates to full-screen mission view → approve → animation plays → outcome feeds back

5. **Publish Briefing** → from Briefing tab → review approved set → click Publish → status changes to PUBLISHED, share actions appear

---

## Responsive Notes

- **≥1280px**: Full three-panel layout (Screen 1)
- **1024–1279px**: Map panel collapses to tab (Map | Evidence)
- **<1024px**: Single column; findings queue becomes scrollable top section; detail below

---

## Accessibility Requirements (WCAG 2.1 AA)

- All interactive elements: visible focus ring (2px solid #58A6FF, 2px offset)
- Finding cards: `role="button"`, `aria-selected`, keyboard Enter/Space activates
- Status badges: color + text label (never color alone)
- Confidence bars: `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`
- Modal dialogs: `role="dialog"`, `aria-modal`, focus trap, Escape closes
- Review form: all inputs labeled, required marked with `aria-required`
- Map SVG: `role="img"` with descriptive `aria-label`; findings also listed in text form
- Agent feed: `aria-live="polite"` region for new activity steps

---

## Stitch Prompt Suggestion

Use the following as your Stitch input prompt:

> **Design a dark-mode operations intelligence web application called "6:10 Assistant" for an industrial facility operations lead named Maya. The app helps her review overnight security incidents before an 8 AM leadership meeting.**
>
> **Design System:** Dark background (#0D1117), panel surfaces (#161B22), Inter font, monospace values, status color coding (green=approved, amber=warning, red=critical, blue=selected, purple=AI-generated).
>
> **Screen 1 (Primary Workspace):** Three-panel layout. Left panel (320px): vertical list of 5 prioritized "finding" cards, each showing title, zone, color-coded confidence bar (%), and status badge. Center panel: selected finding detail with confidence bar, AI-generated hypothesis (purple tag), evidence reference chips, open questions list (amber ? bullets), recommended action callout, and Approve/Reject/Investigate action buttons at the bottom. Right panel (380px): dark SVG facility map with colored circle markers per finding, selected finding pulsing, and a timeline strip at the bottom showing overnight events.
>
> **Screen 2 (Agent Investigation Drawer):** Right-side drawer showing a real-time agent activity feed with timeline entries, color-coded by type (purple=reasoning, cyan=tool call, green=result), and expandable tool call detail with before/after confidence comparison.
>
> **Screen 3 (Drone Mission Simulation):** Full-screen split. Left: dark facility map with animated cyan drone route, numbered checkpoints. Right: mission plan panel listing target uncertainty, checkpoint purposes, predicted evidence, and Approve/Reject/Edit buttons. Post-approval: animated simulation with outcome results per checkpoint.
>
> **Screen 4 (Review Modal):** 600px centered modal with evidence summary, decision radio (Approve/Reject/Refine), required rationale textarea, reviewer identity, and submit button. Post-decision: decision provenance trail showing AI steps and human override in chronological order.
>
> **Screen 5 (Morning Briefing):** Single-column publication view with summary stats, approved finding cards (each with conclusion + evidence refs + reviewer), unresolved uncertainties callout, recommended actions list, and PDF/share actions.
>
> The visual tone is serious, high-stakes, command-center. Premium dark UI. No playful elements. Dense but readable information hierarchy.

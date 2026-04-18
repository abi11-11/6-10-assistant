# Tactical Intelligence Architecture: The Design System

## 1. Overview & Creative North Star

### The Creative North Star: "The Tactical Instrument"
This design system is not an "app"—it is a precision instrument. It is designed for high-stakes environments where split-second decisions are made based on complex industrial telemetry. We are moving away from the "SaaS template" aesthetic toward a **Tactical Intelligence Architecture**. 

The goal is to provide a sense of absolute authority through high-density data, tonal depth, and a sophisticated editorial hierarchy. We achieve a premium feel by breaking the traditional grid; we use intentional asymmetry, overlapping technical readouts, and a distinct contrast between "Human" typography (Inter) and "Machine" data (JetBrains Mono). This is a "command-center" experience: serious, immutable, and hyper-functional.

---

### 2. Colors & Surface Logic

Our palette is rooted in the "Void"—a deep, near-black foundation that allows technical data to glow with intent.

#### The "No-Line" Rule
Traditional UI relies on 1px borders to separate content. In this system, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts. By moving from `surface_container_lowest` to `surface_container_high`, we create "tectonic" shifts that guide the eye without adding visual noise.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
- **Base Layer:** `background` (#10141a) — The desk surface.
- **Primary Panels:** `surface_container_low` (#181c22) — Large functional regions.
- **Active Cards:** `surface_container` (#1c2026) — Interactive data units.
- **High-Intensity Popovers:** `surface_container_highest` (#31353c) — Immediate focus.

#### The "Glass & Gradient" Rule
To elevate the "6:10 Assistant" beyond a flat dashboard, floating elements (modals, tooltips) should utilize **Glassmorphism**. Apply a semi-transparent `surface_variant` with a 12px-20px backdrop blur. 
- **Signature AI Texture:** AI-generated content (Purple #BC8CFF) should utilize a subtle linear gradient (from `secondary` to `secondary_container`) to provide a "digital soul" that distinguishes machine intelligence from raw telemetry.

---

### 3. Typography

The typographic system creates a dual-narrative: the human interpretation vs. the raw technical truth.

*   **Human Narrative (Inter):** Used for headlines, labels, and body text. It is clean, neutral, and authoritative.
    *   *Display/Headline:* Use tight letter-spacing (-0.02em) for an editorial, "high-end" feel.
    *   *Title/Body:* Standard spacing for maximum legibility.
*   **Machine Data (JetBrains Mono):** Reserved strictly for technical values, timestamps, coordinates, and confidence percentages.
    *   *Usage:* Whenever a number represents a real-time industrial metric, it must be in JetBrains Mono. This signals to the user that they are looking at "raw" data.

---

### 4. Elevation & Depth

We eschew traditional drop shadows for **Tonal Layering**.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, natural lift. Depth is a result of light, not lines.
*   **Ambient Shadows:** For "floating" elements, shadows must be extra-diffused. Use a 24px-32px blur at 6% opacity, tinted with the `primary` blue (#58A6FF) to mimic the ambient glow of a high-tech screen.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility (e.g., input focus), use the `outline_variant` token at **20% opacity**. Never use 100% opaque borders unless it is a state-critical active selection.
*   **Sharpness:** All containers follow a rigid rounding scale of `sm` (2px) to `md` (6px). We favor the "Sharp Corner" aesthetic to maintain a professional, industrial tone.

---

### 5. Components

#### Buttons (Tactical Triggers)
- **Primary (Blue):** A solid fill of `primary_container`. No gradients. Sharp `md` corners.
- **AI Action (Purple):** A subtle gradient from `secondary` to `secondary_container`. This is the only component allowed to have a vibrant gradient.
- **Ghost/Tertiary:** No background. Only a `label-md` in `on_surface_variant`.

#### Technical Data Cards
- **Construction:** Use `surface_container` background. 
- **Header:** Use `title-sm` (Inter) for the title and `label-sm` (JetBrains Mono) for the ID/Timestamp in the top-right corner.
- **Content:** Forbid the use of divider lines. Separate metrics using 16px vertical padding (Spacing Scale) or a 1-step tonal shift in the background.

#### Inputs & Forms
- **Field State:** Background should be `surface_container_lowest`. 
- **Focus:** Transition the "Ghost Border" from 20% to 100% opacity using the `primary` blue.
- **Error:** Utilize the `error` red (#F85149) sparingly. A single 2px vertical "accent bar" on the left side of the input is more professional than a full red border.

#### Status Chips
- **Logic:** Chips are small, high-density indicators.
- **Success/Warning/Critical:** Use a "dim" version of the color for the background (15% opacity) and the full-strength color for the text (`on_tertiary_fixed_variant`). This ensures the "Command Center" remains dark and readable without neon-colored distractions.

---

### 6. Do’s and Don’ts

#### Do
- **Do** lean into information density. High-stakes users prefer seeing more data at once over "breathable" consumer white space.
- **Do** use JetBrains Mono for any value that changes in real-time.
- **Do** use `surface` shifts to create hierarchy. A nested panel should always be darker or lighter than its parent, never the same color.

#### Don’t
- **Don’t** use standard "drop shadows" (0, 0, 0, 0.5). They look muddy on near-black backgrounds.
- **Don’t** use rounded "pill" buttons. Keep corners sharp (4px-6px) to maintain the industrial aesthetic.
- **Don’t** use icons for primary navigation. Use high-contrast typography (all-caps `label-md`) to ensure the tool feels like an editorial dashboard rather than a mobile app.
- **Don't** use 1px dividers between list items. Use 8px of vertical space or a subtle `surface_container` toggle.

---

### 7. Token Summary Reference

| Role | Token | Value |
| :--- | :--- | :--- |
| **Foundation** | `background` | #0D1117 |
| **Panel Surface** | `surface_container_low` | #161B22 |
| **Card Surface** | `surface_container` | #1C2128 |
| **Ghost Border** | `outline_variant` (20%) | #30363D |
| **Active/Primary** | `primary_container` | #58A6FF |
| **AI/Intelligence** | `secondary` | #BC8CFF |
| **Success** | `tertiary_container` | #3FB950 |
| **Warning** | `amber` | #D29922 |
| **Critical** | `error` | #F85149 |
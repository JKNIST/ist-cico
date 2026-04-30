## Goal

Make the prototype's `/kalender` page (month view + edit-event dialog) look as close as possible to the two screenshots from the existing production app, so it can be used as a faithful design reference for the dev team.

## Scope

This plan covers **visual redesign only** — no behavioral changes, no data-model changes. Only the month view and the event view/edit dialog. Day/week views, filters, and other pages stay as-is.

---

## 1. Calendar page header (`src/pages/Calendar.tsx`)

To match screenshot 1, simplify the area above the calendar grid:

- Hide (in this prototype) the view-mode toggle, filter chips row, color legend, EventLimitBanner, and the demo "simulate API limit" switch. Lock `viewMode` to `"month"`.
- Keep the page title "Kalender" minimal (the screenshot shows it as the main heading on the left of the top bar — already provided by the global header).
- Add a small month navigation strip above the grid: `<` `>` `apr 2026` (lowercase month, no year-toggle), aligned left, no big "Idag" button.
- Move/restyle the "Lägg till händelse" CTA to a **bottom-right** position inside the calendar area, solid teal `#2a9d8f`, uppercase text "LÄGG TILL HÄNDELSE".

## 2. Month grid (in `renderMonthView`)

Match the screenshot's grid:

- **Add a leftmost week-number column** (`grid-cols-[40px_repeat(7,1fr)]`). Week numbers shown in a small gray font, vertically centered at the top of each row (15, 16, 17, 18…). Use `getISOWeek` from date-fns.
- **Weekday header**: uppercase `MÅN TIS ONS TORS FRE LÖR SÖN`, small gray text, light-gray bottom border, no background fill.
- **Day cell**:
  - Day number **left-aligned**, top-left, plain gray text. Outside-month days use lighter gray text and a subtle `bg-gray-50` cell background.
  - Today: solid teal circle (`#2a9d8f`) with white number, still left-aligned.
  - Remove the centered/rounded number wrapper currently used.
- **Cell borders**: thin `border-gray-200`, white background; remove rounded corners on the outer container so the grid reads as a flat sheet.

## 3. Event chips inside cells

Two visual styles to match the screenshot:

- **Administrative / closure events** ("Stengt dag - Giraffen", "Stengt periode avd. ..."):
  - Light pink background `bg-red-100` / `#fde2e2`, dark gray text.
  - Small **circled-X icon** on the left (`XCircle`, currently used — keep).
  - Rounded `rounded` (4px), full width of cell, single line, `truncate`.
  - Remove icons for "warning" admin events here (keep `XCircle` style for closures only, since the screenshot only shows closures).

- **Regular events** ("Friends Meet-up", "Event 128", "Friendlies #002", "rrr", "CA- - test 'andre veien'..."):
  - Solid teal background `#287E95` (matches existing chat-badge token), **white text**, no icon, no time text inline.
  - Same rounded shape, full width, truncate.
  - Remove the share/lock/repeat icons and the start-time line in the chip — the screenshot shows only the title.

- **Limited-capacity** events (light pink with `AlertTriangle`):
  - Use the same pink style as closures but with the alert icon. Title format like "29. april" / "Begränsad kapacitet" — matches the "29. april" pink chip in the screenshot.

- Drop the `+N mer` chip styling change (current style is fine and not visible in screenshot), but make it small, gray text, no background, just `+N mer` link-style.

## 4. Event view dialog (`src/components/ViewEventDialog.tsx`) — keep, but…

The screenshot shows the **edit** dialog, not the view dialog. To match, when a regular event chip is clicked, open `AddEventDialog` directly in edit mode instead of going through `ViewEventDialog` first. (Two-step current flow: chip → view dialog → "Redigera" → edit dialog. New flow: chip → edit dialog.)

Keep `ViewEventDialog` in the codebase but stop using it from the month grid for regular events. Admin-event clicks continue to open their period dialogs unchanged.

## 5. Edit-event dialog (`src/components/AddEventDialog.tsx`) — Material-style redesign

Restyle to match screenshot 2 as closely as possible without bringing in MUI:

- **Title**: "Redigera händelse" (or "Lägg till händelse" when creating), plain left-aligned, no close X, no sub-text.
- **Inputs — floating-label outlined style**, implemented with Tailwind on the existing shadcn `Input`/`Textarea`:
  - 1px gray border, rounded `rounded-sm` (~3px), label sits on the top border with white background gutter when the field is filled/focused, label color teal `#2a9d8f` on focus.
  - Required asterisk `*` after each label.
  - Apply to: Titel, Beskrivning, Välj avdelningar, Välj deltagare, Händelsedatum, Starttid, Sluttid, Slutdatum för återkommande händelse.
- **"Dela med vårdnadshavare"** toggle:
  - Teal `Switch`, label to the right, helper text below in small gray: "När denna händelse är aktiverad kommer den vara synlig för vårdnadshavare du måste välja barn".
- **Departments multi-select** ("Välj avdelningar"):
  - Outlined input that displays selected items as **rounded chips** with circled-X to remove (`Fladdermusen ⊗  Giraffen ⊗  Hunden ⊗`), light gray border, no background. Right-side `X` clears all and a `▾` opens picker.
- **Participants** ("Välj deltagare"):
  - Single chip showing `👤 197 personer` (person icon + count), same outlined style, dropdown arrow on the right.
- **Heldag** toggle row (gray when off, teal when on). When on: hide Starttid/Sluttid.
- **Händelsedatum** row: small calendar icon left of the value, value `29 apr 2026`, underline-style border (single bottom border, not full box) — matches the screenshot's "underline" Material text-field look for date/time fields.
- **Starttid / Sluttid**: side-by-side, clock icon prefix, underline-style border, value like `13:30`.
- **"Är händelsen återkommande?"** toggle (teal). When on, reveal a 3-row inline-label section:
  - `Upprepa *` → dropdown ("Dagligen"/"Veckovis"/...).
  - `Varje *` → small numeric input + `dag(ar)` suffix.
  - `Till *` → calendar icon + date underline field.
  - Labels are left-aligned in a fixed-width column (~80px), fields fill the rest.
- **Footer metadata** (small gray, person icon): `Skapad av : Kerstin Ahlberg vid 2026-04-27 13:04`.
- **Action buttons** (bottom-right, all text-only, uppercase, no background):
  - `TA BORT` — red text (`text-red-500`)
  - `AVBRYT` — teal text (`text-[#2a9d8f]`)
  - `UPPDATERA` — gray/disabled text until form is dirty, teal when active
  - Spacing: `gap-6`, no border-top above them.

## 6. Mock data tweaks

To make the prototype look like the screenshot on first load:

- Set the calendar's initial `currentDate` to **April 2026** so users land on the same month shown in screenshot 1.
- Add a few mock events around 17 Apr 2026 so the cell shows the same density:
  - Closure "Stengt dag - Giraffen" (department Giraffen) on 2026-04-17
  - Closure "Stengt dag - Hunden" (department Hunden) on 2026-04-17
  - Regular "Friends Meet-up" on 2026-04-17
  - Regular "Event 128" on 2026-04-17
  - Closure "Stengt periode avd. Hunden" 2026-04-21 → 04-23
  - Regular "Friendlies #002" on 2026-04-21
  - Regular "CA- - test 'andre veien', mot CICO" 2026-04-20
  - Closure "29. april" (limited capacity) on 2026-04-29
  - Recurring "rrr" daily 2026-04-27 → 2026-05-13
- Make sure the global department filter default ("Blåbär") doesn't hide them — either add Blåbär to each event's departments, or temporarily clear the filter on the Kalender page when this redesign loads. Recommended: add `"Blåbär"` to each new event's departments to stay consistent with the global-filter rule in memory.

---

## Out of scope

- Day view, week view, filter chips, color legend, API-limit banner — these stay in code (just hidden) and can be re-enabled later.
- Top-bar global elements (language selector, department dropdown, KERSTIN, ?) — already provided by the existing global header; no changes needed.
- The administration page / closure period dialogs.
- i18n key updates — copy in dialog stays Swedish per the screenshot.

## Files to edit

- `src/pages/Calendar.tsx` — header simplification, month grid + week-number column + new chip styles, default month, route clicks to edit dialog directly.
- `src/components/AddEventDialog.tsx` — Material-style redesign as above.
- `src/data/calendar/mockEvents.ts` — add the April-2026 mock events.
- (Optional) small Tailwind helper classes inline; no design-token changes needed (`#2a9d8f` teal already in use, `bg-red-100` available).

## Approximate effort

Medium. Most work is in `AddEventDialog.tsx` (Material-style restyle) and the month grid restyle in `Calendar.tsx`.

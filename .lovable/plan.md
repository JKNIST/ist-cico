## Problem

In `/administration` → "Skapa/Redigera temporär schemaperiod" → section **"Dagar med begränsad kapacitet"**, the day chips (e.g. `24 dec.`, `25 dec.`, `31 dec.`) render with very light yellow background (`bg-amber-100`) and inherit the `Badge` `secondary` variant's pale text color. They sit inside a `bg-amber-50` container, so the result is light-yellow chips with near-white text on a light-yellow panel — fails WCAG contrast and is hard to read (see screenshot).

## Fix

File: `src/components/TemporarySchemaPeriodDialog.tsx` (around lines 372–384)

**Container** (`bg-amber-50`): keep the soft yellow panel — it's a useful visual grouping and works fine when chips have proper contrast.

**Chips**: replace the washed-out style with a high-contrast amber chip:

- Background: deeper amber (`bg-amber-200` for sufficient contrast against the `bg-amber-50` panel, with a subtle `border-amber-300` to define the edges)
- Text: dark amber (`text-amber-900`) — passes WCAG AA against `amber-200`
- Hover/X icon: keep `hover:text-destructive` for removal affordance, but base icon inherits the dark amber text so it's visible

Resulting chip classes:
```
flex items-center gap-1 bg-amber-200 text-amber-900 border border-amber-300 hover:bg-amber-300
```

Drop `variant="secondary"` (or keep but override) so the secondary text color doesn't fight the new colors.

## Files changed

| File | Change |
|---|---|
| `src/components/TemporarySchemaPeriodDialog.tsx` | Update Badge classes for limited-capacity day chips to use `bg-amber-200 text-amber-900 border border-amber-300` for proper contrast |

No other components/files affected. No design tokens changed (uses existing Tailwind amber scale, consistent with the warning/amber category already used elsewhere for limited-capacity events).

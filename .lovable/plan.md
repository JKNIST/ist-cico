# View Event Modal — UI-omdesign + UX-hierarki

## UX-tankesätt (varför så här)

Den nuvarande view-modalen är en lista av badges och ikon-rader — det signalerar "data" snarare än "information om en händelse". En läsmodal ska vara **scanbar på 2 sekunder**: man ska direkt se *vad*, *när*, *vem* — och därefter kunna gräva i detaljer.

Designprinciper jag följer:

1. **Visuell rytm matchar edit-modalen** — samma typografi, färger (#2a9d8f), spacing och uppercase-knappar. Användaren ska känna att view och edit är *samma objekt i två lägen*, inte två olika dialoger.
2. **Progressive disclosure** — det viktigaste högst upp (titel + kategori-chip + delad-status), detaljer i mitten, metadata diskret nederst.
3. **Inga "field labels" som i ett formulär** — i läs-läge är fält-etiketter brus. Istället: ikon + värde, eller en liten grå caption ovanför värdet (samma stil som edit-modalens datum/tid-fält i läs-läge).
4. **Färgkodning återanvänds** — händelsens kategori-färg (röd/orange/grön/blå från event-color-systemet) syns som en tunn vänsterkant på modalen, så man direkt vet *vilken typ* utan att läsa.
5. **Footer-actions speglar edit** — `TA BORT` (röd, vänster), `AVBRYT` + `REDIGERA` (teal, höger). Primär action är "Redigera" eftersom det är användarens troligaste nästa steg från läs-läge.

## Informationsarkitektur (uppifrån och ner)

```text
┌─────────────────────────────────────────────────┐
│ │ [Kategori-chip]   [Delad m. vårdnadshavare]   │  ← snabb status
│ │ Studiebesök på biblioteket                    │  ← TITEL (stort)
│ │                                               │
│ │ Beskrivningstext här, max ~3 rader synliga,   │  ← kontext
│ │ resten flödar med scroll om mycket text.      │
│ │                                               │
│ │ ─────────────────────────────────────────     │
│ │                                               │
│ │ NÄR                                           │  ← caption (11px grå)
│ │ 📅 Tisdag, 5 maj 2026                         │
│ │ 🕐 14:30 – 15:00     (eller "Heldag")         │
│ │ 🔁 Upprepas varje vecka tom. 30 jun 2026     │  ← endast om recurring
│ │                                               │
│ │ VEM                                           │
│ │ 🏢 Blåbär, Lingon                             │  ← chips (samma stil som edit)
│ │ 👥 35 personer                                │
│ │                                               │
│ │ ─────────────────────────────────────────     │
│ │ 👤 Skapad av Bertil · 2026-04-12 09:14        │  ← metadata, 11px grå
│ │    Senast uppdaterad: 2026-04-20 15:02        │
└─────────────────────────────────────────────────┘
                    [TA BORT]    [AVBRYT]  [REDIGERA]
                     röd          teal      teal-fyllt
```

Vänsterkanten (`│`) är en 4px färgad linje som matchar händelsens kategori — samma färgsystem som chip-färgerna på kalendern.

## Designsystem-detaljer (matchar edit-modalen)

- **Container**: `max-w-2xl`, `p-6`, vit bg, vänster border-l-4 i kategorifärg.
- **Titel**: `text-xl font-medium text-gray-800` (samma som edit `DialogTitle`).
- **Section-captions** ("NÄR", "VEM"): `text-[11px] uppercase tracking-wide text-gray-500 mb-2`.
- **Värden**: `text-sm text-gray-800`, ikoner `h-4 w-4 text-gray-500`.
- **Avdelnings-chips**: samma pillstil som edit (`border border-gray-300 rounded-full px-2.5 py-0.5 text-xs`) — men *utan* X-knapp eftersom det är read-only.
- **Top-status-chips** (kategori, "Delad med vårdnadshavare"): liten pill överst, kategori-chip i kategorifärg, delad-chip i grått.
- **Separator**: `border-t border-gray-200` (mjuk, inte hård).
- **Footer-knappar**: identiska med edit — uppercase, tracking-wide, text-only utom "REDIGERA" som är primär (kan ligga som text-teal eller solid teal — jag väljer **text-teal med tunn underline on hover** för konsekvens med "AVBRYT" och "TA BORT").

## Specifika UX-beslut värda att nämna

- **"Ta bort" till vänster, åtskild med `flex-1`** — separerar destruktiv action från övriga, minskar miss-klick. Standardpraxis i Material och iOS Human Interface.
- **Ingen "Stäng X"-knapp i headern** — `Escape` + klick utanför + `AVBRYT` räcker. Att lägga till en X gör headern stökig och dubblerar funktionalitet.
- **Recurring-info kondenserad till en rad** — "🔁 Upprepas varje vecka tom. 30 jun 2026" istället för flera rader. Användare som vill se exakta detaljer öppnar edit.
- **Tom-state för fält** — om beskrivning saknas, dölj sektionen helt (visa inte "Ingen beskrivning"). Mindre brus.
- **Kategori-chip text** — använd i18n-nycklar (`eventDialog.category.external` etc.), inte hårdkodat.

## Filer som ändras

- `src/components/ViewEventDialog.tsx` — fullständig omskrivning av JSX och styling enligt ovan. State och props oförändrade (`open`, `event`, `onDelete`, `onEdit`, `onOpenChange`).
- `src/lib/calendarUtils.ts` — återanvänd befintlig `getCategoryColor` för vänsterkanten; lägg ev. till en `getCategoryLabel` helper om den saknas.
- `src/i18n/*.json` — lägg till saknade nycklar (`eventDialog.sections.when`, `eventDialog.sections.who`, `eventDialog.lastUpdated` osv.) på sv/en/no.

## Vad som *inte* ändras

- Ingen ändring i `Calendar.tsx` — flödet (klick → view → redigera/ta bort) sitter redan rätt sedan förra ändringen.
- Ingen ändring i `AddEventDialog.tsx`.
- Ingen ändring i mock-data eller event-modellen.

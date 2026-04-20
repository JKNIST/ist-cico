

## Plan: Alternativ A — "Ladda fler"-banner i månadsvyn

Implementerar Alternativ A (manuell pagination med banner + knapp) så det kan diskuteras mot Alternativ C med dev-team.

### Vad som byggs

**1. Mock-data: skapa en månad som överskrider 50 events**
- `src/data/calendar/mockEvents.ts`: lägg till ~30 extra events i **december 2025** (blandat möten, aktiviteter, påminnelser) så totala antalet hamnar runt 75–85 för den månaden.

**2. Simulera API-gränsen**
- `src/pages/Calendar.tsx`: lägg till konstant `EVENT_LIMIT = 50` och state `loadedBatches` (start: 1).
- För månadsvyn: sortera månadens events på datum, plocka de första `loadedBatches * 50`. Övriga "saknas" — exakt som i prod.
- Liten demo-toggle i kontroll-raden: **"Simulera API-gräns (50)"** (default ON så problemet syns direkt).

**3. Ny komponent: `EventLimitBanner`**
- Fil: `src/components/calendar/EventLimitBanner.tsx`
- Visas överst i månadsvyn när `displayed < total`
- Innehåll:
  ```text
  ⓘ Visar 50 av 87 händelser denna månad.
     Vissa dagar kan sakna händelser.    [Ladda nästa 50]
  ```
- Färg: `bg-amber-50 border-amber-200` (tydlig men inte alarmerande)
- Knappen ökar `loadedBatches` med 1 → nästa batch slås ihop → banner uppdaterar sig själv eller försvinner när allt är laddat.
- Liten "fake fetch"-spinner på knappen i 400ms via `setTimeout` så det känns realistiskt.

**4. Reset-logik**
- När användaren byter månad → `loadedBatches` återställs till 1 (simulerar nytt API-anrop).

### Filer som ändras

| Fil | Ändring |
|---|---|
| `src/data/calendar/mockEvents.ts` | +~30 events i december 2025 |
| `src/pages/Calendar.tsx` | EVENT_LIMIT, batch-state, toggle, integration av banner, månadsbyte-reset |
| `src/components/calendar/EventLimitBanner.tsx` (ny) | Banner med count + "Ladda nästa 50"-knapp |

### Diskussionsunderlag (Alternativ A vs C)

När detta är byggt har du en konkret demo att visa dev:

- **A (det vi bygger nu)**: Frontend-only lösning. Inga backend-ändringar. Användaren ser problemet + får en explicit handling. Nackdel: kräver klick, "saknade dagar" är tomma tills man laddar.
- **C (att diskutera)**: Backend gör 4–5 parallella anrop per vecka istället för ett per månad. Ingen UX-förändring krävs. Kräver att API:et stödjer godtyckliga datumintervall.

Du kan i samtalet med dev växla toggeln på/av för att visa "med problem" vs "utan", och visa hur A löser det reaktivt medan C skulle eliminera det helt.


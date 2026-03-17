

## Plan: Utöka mock-data för kalender och administration fram till sommaren 2026

### Vad som behövs

Nuvarande mock-data slutar i mars 2026. Jag utökar med:

### 1. Fler kalenderhändelser (april-juni 2026)

Lägger till ca 15-20 nya events i `src/data/calendar/mockEvents.ts`:

| Månad | Händelser |
|-------|-----------|
| **April** | Valborgsfirande, Naturpromenad, Föräldramöte vår, Brandövning, Kulturbesök |
| **Maj** | Nationaldagsfirande, Sommarutflykt, Fotografering, Avslutningsfest förskolan, Planeringsdag (WARNING) |
| **Juni** | Skolavslutning, Midsommarfirande, Sommarpyssel, Sista dagen-fest, Deadline sommarschema (WARNING) |

Blandar alla kategorier: EXTERNAL, INTERNAL, WARNING, CLOSURE. Inkluderar recurring events som sträcker sig till sommaren.

### 2. Fler administration-perioder i `src/pages/Administration.tsx`

**Nya TemporarySchemaPeriod:**
- "Påsklov 2026" (v14, 30 mar - 6 apr) med limited capacity days som krockar med kalenderhändelser
- "Sommar 2026" (22 jun - 14 aug) med limited capacity days i juni/juli
- "Sportlov 2026" (16-20 feb) med limited capacity days

**Nya ClosurePeriod:**
- "Påskstängning" (2-3 april) — krockar med april-events
- "Kristi himmelsfärd" (14 maj) — krockar med maj-events  
- "Sommarstängning vecka 29-30" (13-24 juli)
- "Nationaldagen" (6 juni) — krockar med nationaldagsevent

### 3. Konflikter som skapas

Medvetet placerar kalenderhändelser på samma datum som closure/limited capacity days:
- Valborgsfirande 30 april + limited capacity samma dag
- Nationaldagsevent 6 juni + closure samma dag
- Sommarutflykt i juli + sommarstängning
- Påskpyssel 25 mars (redan finns) + påsklov limited capacity

Detta genererar varningar i både kalender och administration.

### Filer att ändra

| Fil | Åtgärd |
|-----|--------|
| `src/data/calendar/mockEvents.ts` | Lägg till ~18 nya events april-juni |
| `src/pages/Administration.tsx` | Lägg till 3-4 nya perioder och 3-4 nya closure periods |


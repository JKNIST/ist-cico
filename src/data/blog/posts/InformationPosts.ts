import { BlogPost } from "@/types/blog";
import { createPastDate, formatRelativeDate } from "../DateUtils";
import { generateReaders } from "../ReaderUtils";

const date1 = createPastDate(3);
const date2 = createPastDate(8);
const date3 = createPastDate(12);
const date4 = createPastDate(1);
const date5 = createPastDate(5);
const date6 = createPastDate(10);
const date7 = createPastDate(15);
const date8 = createPastDate(2);

export const informationPosts: BlogPost[] = [
  {
    id: "info-1",
    title: "Nya rutiner för sjukanmälan",
    tags: ["Alla avdelningar", "Viktigt"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date1),
    publishedDate: date1,
    status: "Publicerad",
    content: `Kära föräldrar,

Från och med 1 februari inför vi nya rutiner för sjukanmälan.

**Nya rutiner:**
1. Ring eller SMS:a till förskolan senast kl. 08:00
2. Telefonnummer: 070-123 45 67
3. Ange barnets namn, avdelning och ungefärlig sjukdomsorsak
4. Meddela när ni förväntar er att barnet kommer tillbaka

**Viktigt att veta:**
- Barn ska vara hemma vid feber över 38°C
- Barn ska vara symptomfria i 24 timmar innan återkomst
- Vid magsjuka: 48 timmar symptomfritt innan återkomst

Detta för att minska smittspridning och säkerställa bra bemanning.

Tack för er förståelse!

Med vänliga hälsningar,
Förskolechefen`,
    hasImages: false,
    isRead: true,
    category: "INFORMATION",
    internalOnly: false,
    readers: generateReaders(false, 95),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "info-2",
    title: "Parkeringsregler vid lämning och hämtning",
    tags: ["Alla avdelningar"],
    author: "Astrid Lindgren",
    date: formatRelativeDate(date2),
    publishedDate: date2,
    status: "Publicerad",
    content: `Hej alla!

Vi har märkt att parkeringssituationen vid lämning och hämtning ibland blir lite rörig. Här är några påminnelser:

**Parkeringsregler:**
- Använd de markerade parkeringsplatserna
- Parkera INTE vid gångvägen eller entrén
- Max 15 minuters parkering under lämning/hämtning
- Respektera grannarnas uppfartsvägar

**Alternativ:**
- Cykla eller gå till förskolan om möjligt
- Använd parkeringen vid idrottsplatsen (100m bort)
- Dela bilresa med andra föräldrar

Vi uppskattar allas samarbete för att göra lämning och hämtning säkrare för barnen!

Tack!
/Astrid`,
    hasImages: false,
    isRead: false,
    category: "INFORMATION",
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    internalOnly: false,
    readers: generateReaders(false, 58),
  },
  {
    id: "info-3",
    title: "Ny schema-mall från och med mars",
    tags: ["Personal", "Ledningsgrupp"],
    author: "Greta Thunberg",
    date: formatRelativeDate(date3),
    publishedDate: date3,
    status: "Publicerad",
    content: `Hej kollegor!

Från och med mars månad införs en ny mall för schemaläggning.

**Ändringar:**
- Ny digital plattform för schemaönskemål
- Senaste inlämningstid: den 20:e varje månad
- Automatisk konflikthantering
- Bättre översikt över bemanning

**Utbildning:**
- Fredag 23 februari, kl. 13:00-15:00
- Lokal: Personalrummet
- Obligatorisk för alla pedagoger

Länk till plattformen och instruktioner kommer via e-post nästa vecka.

Frågor? Kontakta mig eller HR.

/Greta`,
    hasImages: false,
    isRead: false,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 70),
  },
  {
    id: "info-4",
    title: "Viktig uppdatering om allergirutiner",
    tags: ["Personal", "Viktigt"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date4),
    publishedDate: date4,
    status: "Publicerad",
    content: `Hej alla kollegor!

Vi har uppdaterat våra allergirutiner efter senaste revisionen. Alla pedagoger måste ta del av detta.

**Nya rutiner:**
- Allergikort ska finnas synligt i varje avdelnings kök
- Alla vikarier ska informeras om allergier vid arbetspassets start
- Nötfri zon gäller nu hela förskolan, inte bara matsalen
- Epipen-utbildning är obligatorisk – ny omgång i april

**Barn med uppdaterade allergiplaner:**
- Emma A. (Blåbär) – ny jordnötsallergi
- Lucas S. (Lingon) – uppdaterad glutenintolerans
- Olivia J. (Odon) – äggallergi borttagen

Kontakta mig om ni har frågor.

/Ingrid`,
    hasImages: false,
    isRead: false,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 45),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "info-5",
    title: "Personaldag 18 april – program och anmälan",
    tags: ["Personal", "Planering"],
    author: "Alfred Nobel",
    date: formatRelativeDate(date5),
    publishedDate: date5,
    status: "Publicerad",
    content: `Hej kollegor!

Den 18 april har vi gemensam personaldag. Förskolan är stängd för barn detta datum.

**Program:**
- 08:00–09:00: Frukost och mingel
- 09:00–10:30: Föreläsning: "Barns delaktighet i dokumentation" (extern föreläsare)
- 10:30–10:45: Fika
- 10:45–12:00: Workshop i grupper
- 12:00–13:00: Lunch
- 13:00–14:30: Kollegialt lärande – reflektion kring pedagogisk dokumentation
- 14:30–15:00: Avslutning och utvärdering

**Plats:** Församlingshemmet, Storgatan 12

Anmäl eventuella matallergier till mig senast 10 april.

/Alfred`,
    hasImages: false,
    isRead: true,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 88),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "info-6",
    title: "Sommarschema – önskemål senast 15 maj",
    tags: ["Personal", "Schema"],
    author: "Björn Borg",
    date: formatRelativeDate(date6),
    publishedDate: date6,
    status: "Publicerad",
    content: `Hej alla!

Det är dags att börja planera sommarschemat. Som ni vet slår vi ihop avdelningar under sommarveckorna.

**Viktiga datum:**
- **15 maj**: Sista dag att lämna in semesterönskemål
- **22 juni – 14 augusti**: Sommarperiod med reducerad bemanning
- **Vecka 29–30** (13–24 juli): Förskolan stängd

**Sommargrupper:**
- Blåbär + Lingon slås ihop i Blåbärs lokaler
- Odon + Vildhallon slås ihop i Odons lokaler

**Bemanning:**
- Minst 3 pedagoger per sommargrupp
- Vikarier rekryteras vid behov – meddela mig om ni har tips

Fyll i era önskemål i det nya schemasystemet senast 15 maj.

/Björn`,
    hasImages: false,
    isRead: false,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 30),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "info-7",
    title: "Resultat från medarbetarenkäten",
    tags: ["Personal", "Ledningsgrupp"],
    author: "Annika Sörenstam",
    date: formatRelativeDate(date7),
    publishedDate: date7,
    status: "Publicerad",
    content: `Hej kollegor!

Tack till alla som svarade på medarbetarenkäten! Vi hade en svarsfrekvens på 92%.

**Sammanfattning av resultaten:**

✅ **Styrkor (betyg 4-5 av 5):**
- Kollegialt samarbete: 4.6
- Arbetsmiljö: 4.3
- Relation till barn och familjer: 4.8
- Stöd från ledning: 4.1

⚠️ **Förbättringsområden (betyg under 3.5):**
- Tid för dokumentation: 2.8
- Planeringstid: 3.1
- Lönesamtal och utvecklingsmöjligheter: 3.2

**Nästa steg:**
- Arbetsgrupp för att förbättra planeringstid – intresseanmälan till mig
- Uppföljningsmöte med alla avdelningar v.16
- Handlingsplan presenteras på APT i maj

Hela rapporten finns i personalrummet.

/Annika`,
    hasImages: false,
    isRead: true,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 75),
  },
  {
    id: "info-8",
    title: "Ny vikarie på Lingon fr.o.m. måndag",
    tags: ["Personal", "Lingon"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date8),
    publishedDate: date8,
    status: "Publicerad",
    content: `Hej!

Kort info: Från och med måndag börjar Sara Ekström som vikarie på Lingon-avdelningen. Hon ersätter Maria under hennes föräldraledighet.

**Om Sara:**
- Utbildad barnskötare
- 3 års erfarenhet från Solstrålen förskola
- Har jobbat extra hos oss förra sommaren

Sara kommer kl. 07:00 på måndag. Kan någon på Lingon ta emot och visa runt?

Tack!
/Ingrid`,
    hasImages: false,
    isRead: false,
    category: "INFORMATION",
    internalOnly: true,
    readers: generateReaders(true, 55),
    departments: ["Lingon"],
  },
];

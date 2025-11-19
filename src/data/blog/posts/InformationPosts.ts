import { BlogPost } from "@/types/blog";
import { createPastDate, formatRelativeDate } from "../DateUtils";
import { generateReaders } from "../ReaderUtils";

const date1 = createPastDate(3);
const date2 = createPastDate(8);
const date3 = createPastDate(12);

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
    title: "[INTERNT] Ny schema-mall från och med mars",
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
];

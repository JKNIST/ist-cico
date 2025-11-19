import { BlogPost } from "@/types/blog";
import { createPastDate, formatRelativeDate } from "../DateUtils";
import { generateReaders } from "../ReaderUtils";

const date1 = createPastDate(2);
const date2 = createPastDate(5);
const date3 = createPastDate(14);

export const importantDatesPosts: BlogPost[] = [
  {
    id: "important-1",
    title: "Vårterminens startdatum och välkomstfrukosten",
    tags: ["Alla avdelningar"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date1),
    publishedDate: date1,
    status: "Publicerad",
    content: `Kära föräldrar och barn,

Vi vill påminna er om att vårterminen startar måndag den 15 januari kl. 07:00. Vi ser fram emot att välkomna tillbaka alla barn efter jullovet!

**Viktiga datum:**
- Måndag 15 januari: Terminsstart
- Onsdag 17 januari: Välkomstfrukost kl. 08:30-09:30
- Fredag 26 januari: Föräldramöte kl. 18:00

Välkomstfrukosten är ett tillfälle för både barn och föräldrar att träffa pedagogerna och prata om terminen. Vi bjuder på kaffe, te och lättare frukost.

Vänliga hälsningar,
Pedagogteamet`,
    hasImages: false,
    isRead: true,
    category: "VIKTIGA DATUM",
    internalOnly: false,
    readers: generateReaders(false, 85),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "important-2",
    title: "Sportlovsveckan - förskolan stängd 19-23 februari",
    tags: ["Alla avdelningar", "Sportlov"],
    author: "Astrid Lindgren",
    date: formatRelativeDate(date2),
    publishedDate: date2,
    status: "Publicerad",
    content: `Hej allihopa!

Vi vill påminna om att förskolan är stängd under sportlovsveckan, 19-23 februari.

**Stängningsdatum:**
- Måndag 19 feb - Fredag 23 feb: Stängt
- Måndag 26 feb: Öppnar igen som vanligt kl. 07:00

Om ni har särskilda omständigheter och behöver barnomsorg under sportlovet, vänligen kontakta administrationen senast den 31 januari.

Vi önskar alla familjer en trevlig sportlov!

Med vänliga hälsningar,
Förskolechefen`,
    hasImages: false,
    isRead: true,
    category: "VIKTIGA DATUM",
    internalOnly: false,
    readers: generateReaders(false, 92),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
  },
  {
    id: "important-3",
    title: "Fotografering 12 mars - glöm inte att klä barnen fint!",
    tags: ["Spindeln", "Fjärilen", "Baggen"],
    author: "Greta Thunberg",
    date: formatRelativeDate(date3),
    publishedDate: date3,
    status: "Publicerad",
    content: `Kära föräldrar,

Den 12 mars kommer fotografen till förskolan för vår årliga fotografering!

**Information:**
- Datum: Tisdag 12 mars
- Tid: 09:00-15:00 (varje avdelning har sina tider)
- Både grupp- och individuella bilder tas

Vi rekommenderar att ni kläder era barn i fina kläder denna dag. Tänk på:
- Undvik kläder med stora tryck eller budskap
- Välj helst enfärgade eller diskreta mönster
- Barnen ska känna sig bekväma

Beställningsformulär för bilderna kommer att delas ut efter fotograferingen.

Med vänliga hälsningar,
Greta`,
    hasImages: true,
    images: ["/placeholder.svg"],
    isRead: false,
    category: "VIKTIGA DATUM",
    internalOnly: false,
    readers: generateReaders(false, 45),
    departments: ["Blåbär", "Lingon"],
    groups: ["Blåbär-Blå", "Lingon-Röd"],
  },
];

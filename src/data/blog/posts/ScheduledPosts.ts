import { BlogPost } from "@/types/blog";
import { createFutureDate, formatRelativeDate } from "../DateUtils";
import { generateReaders } from "../ReaderUtils";

const date1 = createFutureDate(3);
const date2 = createFutureDate(7);

export const scheduledPosts: BlogPost[] = [
  {
    id: "scheduled-1",
    title: "Påsklov - viktiga datum och öppettider",
    tags: ["Alla avdelningar", "Påsklov"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date1),
    publishedDate: date1,
    status: "Schemalagd",
    content: `Kära föräldrar!

Vi närmar oss påsken och vill informera om öppettider under påskveckan.

**Stängningsdatum:**
- Skärtorsdag 28 mars: Stänger kl. 15:00
- Långfredagen 29 mars: Stängt
- Påskafton 30 mars: Stängt
- Påskdagen 31 mars: Stängt
- Annandag påsk 1 april: Stängt
- Tisdag 2 april: Öppnar igen som vanligt kl. 07:00

**Påskpyssel:**
Veckan innan påsken (25-28 mars) kommer vi att ha extra mycket påskpyssel och aktiviteter!

Vi önskar alla familjer en glad påsk!

Med vänliga hälsningar,
Pedagogteamet`,
    hasImages: false,
    isRead: false,
    category: "VIKTIGA DATUM",
    internalOnly: false,
    readers: [],
  },
  {
    id: "scheduled-2",
    title: "Föräldramöte vårterminen - obligatoriskt",
    tags: ["Alla avdelningar"],
    author: "Astrid Lindgren",
    date: formatRelativeDate(date2),
    publishedDate: date2,
    status: "Schemalagd",
    content: `Hej alla föräldrar!

Vi bjuder in till årets första föräldramöte för vårterminen.

**Information:**
- Datum: Onsdag 20 mars
- Tid: 18:00-20:00
- Plats: Förskolans stora sal
- Kaffe och kaka serveras

**Agenda:**
1. Välkomna och presentation av nya pedagoger
2. Vårterminens planering och teman
3. Diskussion: Barnens utveckling och trivsel
4. Kommande aktiviteter och föräldraengagemang
5. Frågestund

**OBS!** Anmälan krävs senast 15 mars via Unikum.

Vi ser fram emot att träffa er alla!

Med vänliga hälsningar,
Förskolechefen`,
    hasImages: false,
    isRead: false,
    category: "VIKTIGA DATUM",
    internalOnly: false,
    readers: [],
  },
];

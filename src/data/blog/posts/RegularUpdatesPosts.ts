import { BlogPost } from "@/types/blog";
import { createPastDate, formatRelativeDate } from "../DateUtils";
import { generateReaders } from "../ReaderUtils";

const date1 = createPastDate(1);
const date2 = createPastDate(7);
const date3 = createPastDate(10);
const date4 = createPastDate(21);

export const regularUpdatesPosts: BlogPost[] = [
  {
    id: "update-1",
    title: "Veckans tema: Vinter och snö",
    tags: ["Spindeln", "Fjärilen"],
    author: "Astrid Lindgren",
    date: formatRelativeDate(date1),
    publishedDate: date1,
    status: "Publicerad",
    content: `Hej familjer!

Denna vecka arbetar vi med temat "Vinter och snö". Barnen får utforska:

**Måndagens aktiviteter:**
- Snöflingepyssel med papper
- Läsa "Snömannen" av Raymond Briggs
- Leka utomhus och bygga snöänglar

**Onsdagens aktiviteter:**
- Experimentera med is som smälter
- Skapa vinterkollage
- Sjunga vintervisa tillsammans

**Fredagens aktiviteter:**
- Baka pepparkakor
- Vinterdisco i gympasalen
- Avslutande sagostund om vinterdjur

Kom ihåg att klä barnen varmt - vi är ute mycket!

Trevlig vecka önskar pedagogerna!`,
    hasImages: true,
    images: ["/placeholder.svg"],
    isRead: false,
    category: "REGELBUNDNA UPPDATERINGAR",
    internalOnly: false,
    readers: generateReaders(false, 78),
    departments: ["Blåbär", "Lingon"],
    groups: ["Blåbär-Blå", "Blåbär-Grön", "Lingon-Gul"],
  },
  {
    id: "update-2",
    title: "Baggeavdelningens byggprojekt",
    tags: ["Baggen"],
    author: "Zlatan Ibrahimović",
    date: formatRelativeDate(date2),
    publishedDate: date2,
    status: "Publicerad",
    content: `Hej Bagge-familjer!

Vi har startat ett spännande byggprojekt där barnen får bygga sin egen "drömstad" med olika material.

**Vad vi gör:**
- Använda LEGO, trä och kartong
- Rita stadskartor tillsammans
- Diskutera olika byggnader och deras funktioner
- Lära oss om samarbete och planering

Projektet kommer pågå i 3 veckor och avslutas med en utställning där föräldrarna får komma och titta!

**Utställning:** Fredag 9 februari, kl. 15:30-16:30

Välkomna!

/Zlatan och Bagge-teamet`,
    hasImages: false,
    isRead: true,
    category: "REGELBUNDNA UPPDATERINGAR",
    internalOnly: false,
    readers: generateReaders(false, 88),
    departments: ["Odon"],
    groups: ["Odon-Lila", "Odon-Orange"],
  },
  {
    id: "update-3",
    title: "Spindelns utomhusäventyr i skogen",
    tags: ["Spindeln"],
    author: "Ingrid Bergman",
    date: formatRelativeDate(date3),
    publishedDate: date3,
    status: "Publicerad",
    content: `Kära Spindel-föräldrar!

Denna vecka har vi haft fantastiska utomhusäventyr i närskogen!

**Vad vi upplevt:**
- Hittat djurspår i snön (rådjur, ekorre, fåglar)
- Byggt kojor av grenar
- Lekt kurragömma bland träden
- Samlat kottar och stenar för pyssel

Barnen har visat stort intresse för naturen och frågar mycket om djuren som bor i skogen. Nästa vecka fortsätter vi med att lära oss mer om skogstier och allemansrätten.

**Påminnelse:** Se till att barnen har rejäla vinterskor och varma vantar!

Med vänliga hälsningar,
Ingrid och Spindel-teamet`,
    hasImages: true,
    images: ["/placeholder.svg"],
    isRead: true,
    category: "REGELBUNDNA UPPDATERINGAR",
    internalOnly: false,
    readers: generateReaders(false, 65),
    departments: ["Vildhallon"],
    groups: ["Vildhallon-Rosa"],
  },
  {
    id: "update-4",
    title: "Fjärilsavdelningens musikvecka",
    tags: ["Fjärilen"],
    author: "Annika Sörenstam",
    date: formatRelativeDate(date4),
    publishedDate: date4,
    status: "Publicerad",
    content: `Hej alla Fjärilsfamiljer!

Förra veckan hade vi vår musikvecka och det var en succé!

**Höjdpunkter:**
- Barnen fick testa olika instrument (trumma, xylofon, gitarr)
- Vi sjöng barnvisor tillsammans
- Dansade till olika musikstilar
- Skapade egna "instrument" av hushållsföremål

Många barn upptäckte nya favoritmusikstilar och några visade verklig talang! Vi kommer att fortsätta integrera musik i våra dagliga aktiviteter.

Tack för en underbar vecka!

/Annika och Fjärilspedagogerna`,
    hasImages: false,
    isRead: true,
    category: "REGELBUNDNA UPPDATERINGAR",
    internalOnly: false,
    readers: generateReaders(false, 72),
  },
];

export const initialConversations = [
  {
    id: 1,
    title: "Chat med vårdnadshavare",
    student: "Emma Andersson",
    department: "Blåbär",
    lastMessage: "Vi ses imorgon!",
    participants: [
      "Emma's Guardian", 
      "Blåbär Staff 1",
      "Blåbär Staff 2",
      "Blåbär Staff 3"
    ],
    messages: [
      {
        id: 1,
        sender: "Emma's Guardian",
        content: "Hej! Min dotter kommer lite senare imorgon.",
        timestamp: "09:30",
        isRead: false
      },
      {
        id: 2,
        sender: "Blåbär Staff 1",
        content: "Tack för informationen! När ungefär kommer hon?",
        timestamp: "09:32",
        isRead: false
      },
      {
        id: 3,
        sender: "Emma's Guardian",
        content: "Hon kommer runt klockan 10:30, efter läkarbesöket.",
        timestamp: "09:33",
        isRead: false
      },
      {
        id: 4,
        sender: "Blåbär Staff 2",
        content: "Det är inga problem, vi har aktiviteter hela förmiddagen.",
        timestamp: "09:34",
        isRead: false
      },
      {
        id: 5,
        sender: "Blåbär Staff 1",
        content: "Vi ses imorgon!",
        timestamp: "09:35",
        isRead: false
      }
    ]
  },
  {
    id: 2,
    title: "Teammöte planering",
    department: "Blåbär",
    lastMessage: "Vi behöver diskutera budget för nästa kvartal",
    participants: ["Jonas Nilsson", "Maria Larsson", "Anna Svensson", "Erik Berg"],
    messages: [
      {
        id: 1,
        sender: "Maria Larsson",
        content: "Ska vi boka in ett möte nästa vecka?",
        timestamp: "13:45",
        isRead: true
      },
      {
        id: 2,
        sender: "Erik Berg",
        content: "Tisdagar brukar passa bra för mig. Vad säger ni andra?",
        timestamp: "13:50",
        isRead: true
      },
      {
        id: 3,
        sender: "Anna Svensson",
        content: "Jag föredrar onsdagar om möjligt, men kan anpassa mig.",
        timestamp: "14:05",
        isRead: true
      },
      {
        id: 4,
        sender: "Jonas Nilsson",
        content: "Onsdag förmiddag skulle passa mig bra också.",
        timestamp: "14:10",
        isRead: true
      },
      {
        id: 5,
        sender: "Maria Larsson",
        content: "Vi behöver diskutera budget för nästa kvartal",
        timestamp: "14:15",
        isRead: false
      }
    ]
  },
  {
    id: 3,
    title: "Föräldramöte planering",
    student: "Alex Nilsson",
    department: "Lingon",
    lastMessage: "Tack för all information!",
    participants: [
      "Alex's Guardian",
      "Lingon Teacher 1",
      "Lingon Teacher 2",
      "Lingon Support Staff"
    ],
    messages: [
      {
        id: 1,
        sender: "Alex's Guardian",
        content: "När börjar föräldramötet?",
        timestamp: "15:30",
        isRead: false
      },
      {
        id: 2,
        sender: "Lingon Teacher 1",
        content: "Mötet börjar kl 18:00 i aulan. Vi kommer att gå igenom terminsplaneringen.",
        timestamp: "15:33",
        isRead: false
      },
      {
        id: 3,
        sender: "Lingon Teacher 2",
        content: "Vi kommer också att presentera den nya läroplanen och diskutera fritidsaktiviteter.",
        timestamp: "15:36",
        isRead: false
      },
      {
        id: 4,
        sender: "Lingon Support Staff",
        content: "Det finns också möjlighet att boka enskilda samtal efter mötet.",
        timestamp: "15:38",
        isRead: false
      },
      {
        id: 5,
        sender: "Alex's Guardian",
        content: "Tack för all information!",
        timestamp: "15:40",
        isRead: false
      }
    ]
  },
  {
    id: 4,
    title: "Utflykt planering",
    student: "Lisa Berg",
    department: "Odon",
    lastMessage: "Perfekt, vi ser fram emot utflykten!",
    participants: [
      "Lisa's Guardian",
      "Odon Staff 1",
      "Odon Staff 2",
      "Odon Support"
    ],
    messages: [
      {
        id: 1,
        sender: "Odon Staff 1",
        content: "Vi planerar en utflykt till naturreservatet nästa vecka, torsdag kl 9:00.",
        timestamp: "11:20",
        isRead: false
      },
      {
        id: 2,
        sender: "Odon Staff 2",
        content: "Barnen behöver ha med sig matsäck och lämpliga kläder för väderlek.",
        timestamp: "11:22",
        isRead: false
      },
      {
        id: 3,
        sender: "Odon Support",
        content: "Vi kommer att åka kommunaltrafik, så alla behöver vara på plats senast 8:45.",
        timestamp: "11:23",
        isRead: false
      },
      {
        id: 4,
        sender: "Lisa's Guardian",
        content: "Perfekt, vi ser fram emot utflykten!",
        timestamp: "11:25",
        isRead: false
      }
    ]
  },
  {
    id: 5,
    title: "Sommarfest diskussion",
    student: "Max Pettersson",
    department: "Vildhallon",
    lastMessage: "Alla är välkomna!",
    participants: [
      "Max's Guardian",
      "Vildhallon Teacher 1",
      "Vildhallon Teacher 2",
      "Vildhallon Support"
    ],
    messages: [
      {
        id: 1,
        sender: "Vildhallon Teacher 1",
        content: "Vi planerar en sommarfest i juni, preliminärt den 15:e.",
        timestamp: "14:10",
        isRead: false
      },
      {
        id: 2,
        sender: "Max's Guardian",
        content: "Det låter roligt! Vad kan vi föräldrar bidra med?",
        timestamp: "14:12",
        isRead: false
      },
      {
        id: 3,
        sender: "Vildhallon Support",
        content: "Vi skulle uppskatta hjälp med förberedelser och kanske några som kan baka.",
        timestamp: "14:14",
        isRead: false
      },
      {
        id: 4,
        sender: "Vildhallon Teacher 2",
        content: "Alla är välkomna!",
        timestamp: "14:20",
        isRead: false
      }
    ]
  },
  {
    id: 6,
    title: "IT-support",
    department: "Blåbär",
    lastMessage: "Problem med skrivaren på andra våningen",
    participants: ["Jonas Nilsson", "IT Support", "System Admin", "Network Team"],
    messages: [
      {
        id: 1,
        sender: "Jonas Nilsson",
        content: "Jag kan inte skriva ut dokument från mitt kontor.",
        timestamp: "16:40",
        isRead: false
      },
      {
        id: 2,
        sender: "IT Support",
        content: "Problem med skrivaren på andra våningen",
        timestamp: "16:45",
        isRead: false
      },
      {
        id: 3,
        sender: "System Admin",
        content: "Vi har noterat problemet och arbetar på en lösning. Det verkar vara ett nätverksproblem.",
        timestamp: "16:48",
        isRead: false
      },
      {
        id: 4,
        sender: "Network Team",
        content: "Vi kontrollerar routern och kommer att uppdatera er inom kort.",
        timestamp: "16:55",
        isRead: false
      }
    ]
  },
  {
    id: 7,
    title: "After-school Activities",
    student: "Peter Smith",
    department: "Lingon",
    lastMessage: "Looking forward to the event",
    participants: ["Activity Leader", "Peter's Guardian", "Class Teacher"],
    messages: [
      {
        id: 1,
        sender: "Peter's Guardian",
        content: "Will there be any after-school activities next week?",
        timestamp: "15:30",
        isRead: false
      },
      {
        id: 2,
        sender: "Class Teacher",
        content: "We're coordinating with the activity team on the schedule.",
        timestamp: "15:38",
        isRead: false
      },
      {
        id: 3,
        sender: "Activity Leader",
        content: "Yes! We're planning a special event.",
        timestamp: "15:45",
        isRead: false
      },
      {
        id: 4,
        sender: "Activity Leader",
        content: "It will be a science fair with interactive experiments for the children.",
        timestamp: "15:47",
        isRead: false
      },
      {
        id: 5,
        sender: "Peter's Guardian",
        content: "Looking forward to the event",
        timestamp: "15:52",
        isRead: false
      }
    ]
  },
  {
    id: 8,
    title: "Personalschema",
    department: "Odon",
    lastMessage: "Schema för nästa vecka",
    participants: ["Jonas Nilsson", "Team Odon", "HR Staff", "Department Head"],
    messages: [
      {
        id: 1,
        sender: "Department Head",
        content: "Vi behöver göra några justeringar i schemat för nästa månad.",
        timestamp: "15:10",
        isRead: false
      },
      {
        id: 2,
        sender: "HR Staff",
        content: "Vi har tagit hänsyn till semesterönskemålen i planeringen.",
        timestamp: "15:20",
        isRead: false
      },
      {
        id: 3,
        sender: "Jonas Nilsson",
        content: "Kommer det att påverka den planerade kompetensutvecklingen?",
        timestamp: "15:25",
        isRead: false
      },
      {
        id: 4,
        sender: "Team Odon",
        content: "Schema för nästa vecka är nu tillgängligt",
        timestamp: "15:30",
        isRead: false
      }
    ]
  },
  {
    id: 9,
    title: "Blåbär - Veckoinformation",
    department: "Blåbär",
    lastMessage: "Information om nästa veckas aktiviteter",
    participants: [
      "All Guardians Blåbär",
      "Blåbär Staff 1",
      "Blåbär Staff 2"
    ],
    messages: [
      {
        id: 1,
        sender: "Blåbär Staff 1",
        content: "Här kommer information om nästa veckas aktiviteter: På måndag har vi utflykt, tisdag är det sångstund.",
        timestamp: "10:10",
        isRead: false
      },
      {
        id: 2,
        sender: "All Guardians Blåbär",
        content: "Behöver barnen ta med något särskilt för utflykten?",
        timestamp: "10:12",
        isRead: false
      },
      {
        id: 3,
        sender: "Blåbär Staff 2",
        content: "Barnen behöver ha med sig egen matsäck och vattenflaska till utflykten.",
        timestamp: "10:18",
        isRead: false
      },
      {
        id: 4,
        sender: "Blåbär Staff 2",
        content: "Information om nästa veckas aktiviteter",
        timestamp: "10:20",
        isRead: false
      }
    ]
  },
  {
    id: 10,
    title: "Lingon - Matteinformation",
    department: "Lingon",
    lastMessage: "Nya matematikmaterial har anlänt",
    participants: [
      "All Guardians Lingon",
      "Lingon Teacher 1",
      "Lingon Teacher 2"
    ],
    messages: [
      {
        id: 1,
        sender: "Lingon Teacher 1",
        content: "Vi har fått in nya matematikmaterial som kommer att användas från nästa vecka.",
        timestamp: "13:10",
        isRead: false
      },
      {
        id: 2,
        sender: "All Guardians Lingon",
        content: "Spännande! Kommer ni att hålla en introduktion för föräldrarna också?",
        timestamp: "13:12",
        isRead: false
      },
      {
        id: 3,
        sender: "Lingon Teacher 2",
        content: "Vi kan ordna en kort presentation vid nästa föräldramöte om det finns intresse.",
        timestamp: "13:13",
        isRead: false
      },
      {
        id: 4,
        sender: "Lingon Teacher 2",
        content: "Nya matematikmaterial har anlänt",
        timestamp: "13:15",
        isRead: false
      }
    ]
  },
  {
    id: 11,
    title: "Odon - Utomhusaktiviteter",
    department: "Odon",
    lastMessage: "Påminnelse om kläder efter väder",
    participants: [
      "All Guardians Odon",
      "Odon Staff 1",
      "Odon Staff 2"
    ],
    messages: [
      {
        id: 1,
        sender: "Odon Staff 1",
        content: "Kom ihåg att barnen behöver kläder efter väder nästa vecka. Vi kommer att vara mycket utomhus.",
        timestamp: "09:40",
        isRead: false
      },
      {
        id: 2,
        sender: "All Guardians Odon",
        content: "Är det några särskilda aktiviteter planerade?",
        timestamp: "09:43",
        isRead: false
      },
      {
        id: 3,
        sender: "Odon Staff 1",
        content: "Vi kommer att fokusera på naturvetenskap och utforska närmiljön.",
        timestamp: "09:46",
        isRead: false
      },
      {
        id: 4,
        sender: "Odon Staff 2",
        content: "Påminnelse om kläder efter väder",
        timestamp: "09:50",
        isRead: false
      }
    ]
  },
  {
    id: 12,
    title: "Vildhallon - Föräldramöte",
    department: "Vildhallon",
    lastMessage: "Agenda för föräldramötet är nu klar",
    participants: [
      "All Guardians Vildhallon",
      "Vildhallon Teacher 1",
      "Vildhallon Teacher 2"
    ],
    messages: [
      {
        id: 1,
        sender: "Vildhallon Teacher 1",
        content: "Vi har nu planerat agendan för föräldramötet som hålls nästa torsdag kl 18:00.",
        timestamp: "14:25",
        isRead: false
      },
      {
        id: 2,
        sender: "All Guardians Vildhallon",
        content: "Kommer det att finnas möjlighet till barnpassning under mötet?",
        timestamp: "14:28",
        isRead: false
      },
      {
        id: 3,
        sender: "Vildhallon Teacher 1",
        content: "Ja, vi ordnar med barnpassning i rummet intill. Meddela oss gärna i förväg om ditt barn kommer.",
        timestamp: "14:30",
        isRead: false
      },
      {
        id: 4,
        sender: "Vildhallon Teacher 2",
        content: "Agenda för föräldramötet är nu klar",
        timestamp: "14:35",
        isRead: false
      }
    ]
  }
];

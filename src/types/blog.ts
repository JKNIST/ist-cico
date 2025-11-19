export interface Reader {
  id: string;
  name: string;
  role: "guardian" | "staff";
  childName?: string;
  readAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  tags: string[];
  author: string;
  date: string;
  publishedDate: string;
  status: "Publicerad" | "Schemalagd";
  content?: string;
  hasImages: boolean;
  isRead: boolean;
  category: "VIKTIGA DATUM" | "REGELBUNDNA UPPDATERINGAR" | "INFORMATION";
  images?: string[];
  internalOnly?: boolean;
  readers?: Reader[];
}

export type BlogCategory = "ALLA" | "VIKTIGA DATUM" | "REGELBUNDNA UPPDATERINGAR" | "INFORMATION";

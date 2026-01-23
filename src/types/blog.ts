export interface Reader {
  id: string;
  name: string;
  role: "guardian" | "staff";
  childName?: string;
  readAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  fileType: 'docx' | 'pdf' | 'jpg' | 'png' | 'xlsx' | 'other';
  size: string;
  url: string;
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
  departments?: string[];
  groups?: string[];
  attachments?: Attachment[];
  important?: boolean;
  recipientCount?: { seen: number; total: number };
}

export type BlogCategory = "ALLA" | "VIKTIGA DATUM" | "REGELBUNDNA UPPDATERINGAR" | "INFORMATION";

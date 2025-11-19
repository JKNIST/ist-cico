import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  FileUp,
  Code,
} from "lucide-react";

export function EditorToolbar() {
  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/30">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Image className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <FileUp className="h-4 w-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
}

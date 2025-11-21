import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { UserSettings } from "./UserSettings";

export function UserProfile() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary font-semibold gap-2"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings className="h-4 w-4" />
        BERTIL
      </Button>
      <UserSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

import { MoreVertical, UserPlus, UserMinus, LogOut, Lock, LockKeyhole } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ChatHeaderProps {
  title: string;
  participants: string[];
  isLocked?: boolean;
  onAddParticipant?: (participant: string) => void;
  onRemoveParticipant?: (participant: string) => void;
  onLeave?: () => void;
  onToggleLock?: () => void;
}

export const ChatHeader = ({ 
  title, 
  participants,
  isLocked = false,
  onAddParticipant,
  onRemoveParticipant,
  onLeave,
  onToggleLock
}: ChatHeaderProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");

  const handleAddParticipant = () => {
    if (newParticipant.trim() && onAddParticipant) {
      onAddParticipant(newParticipant.trim());
      setNewParticipant("");
      setShowAddDialog(false);
    }
  };

  return (
    <div className="bg-background p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-medium text-foreground">{title}</h1>
            {isLocked && (
              <span className="flex items-center gap-1 text-warning">
                <LockKeyhole className="h-4 w-4" />
                <span className="text-sm">Locked</span>
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{participants.join(', ')}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conversation Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowAddDialog(true)}
              disabled={isLocked}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Participant
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowRemoveDialog(true)}
              disabled={isLocked}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Remove Participant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleLock}>
              <Lock className="mr-2 h-4 w-4" />
              {isLocked ? 'Unlock Chat' : 'Lock Chat'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLeave} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Leave Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add Participant Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Enter participant name"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddParticipant}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Participant Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Participant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {participants.map((participant) => (
              <div key={participant} className="flex items-center justify-between py-2">
                <span>{participant}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (onRemoveParticipant) {
                      onRemoveParticipant(participant);
                    }
                    setShowRemoveDialog(false);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

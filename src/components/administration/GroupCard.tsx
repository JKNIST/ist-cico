import { Users, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChildGroup } from "@/types/groups";

interface GroupCardProps {
  group: ChildGroup;
  onEdit: (group: ChildGroup) => void;
  onDelete: (id: string) => void;
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: group.color || '#94a3b8' }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{group.fullName}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {group.children.length} barn
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Skapad av {group.createdBy}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(group.createdAt).toLocaleDateString('sv-SE')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(group)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

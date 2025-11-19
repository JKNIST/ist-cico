import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GroupCard } from "./GroupCard";
import { GroupDialog } from "./GroupDialog";
import { mockDepartments } from "@/data/groups/mockGroups";
import { ChildGroup, Department } from "@/types/groups";

export function GroupsManagement() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ChildGroup | null>(null);
  const [selectedDepartmentForNew, setSelectedDepartmentForNew] = useState<string | null>(null);
  const [openDepartments, setOpenDepartments] = useState<Record<string, boolean>>({
    "dept-1": true,
    "dept-2": true,
    "dept-3": true,
    "dept-4": true,
  });

  const handleCreateNew = (departmentName?: string) => {
    setEditingGroup(null);
    setSelectedDepartmentForNew(departmentName || null);
    setDialogOpen(true);
  };

  const handleEdit = (group: ChildGroup) => {
    setEditingGroup(group);
    setSelectedDepartmentForNew(null);
    setDialogOpen(true);
  };

  const handleDelete = (groupId: string) => {
    setDepartments(prevDepts =>
      prevDepts.map(dept => ({
        ...dept,
        groups: dept.groups.filter(g => g.id !== groupId),
      }))
    );
  };

  const handleSave = (group: ChildGroup) => {
    setDepartments(prevDepts =>
      prevDepts.map(dept => {
        if (dept.name !== group.department) return dept;

        if (editingGroup) {
          // Update existing group
          return {
            ...dept,
            groups: dept.groups.map(g => (g.id === group.id ? group : g)),
          };
        } else {
          // Add new group
          return {
            ...dept,
            groups: [...dept.groups, group],
          };
        }
      })
    );
    setDialogOpen(false);
  };

  const toggleDepartment = (deptId: string) => {
    setOpenDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  // Prepare department data for dialog
  const departmentsForDialog = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    children: dept.children,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">{t('administration.groups.title')}</h1>
        </div>
        <Button onClick={() => handleCreateNew()}>
          <Plus className="h-4 w-4 mr-2" />
          {t('administration.groups.createGroup')}
        </Button>
      </div>

      {/* Description */}
      <p className="text-muted-foreground">
        {t('administration.groups.description')}
      </p>

      {/* Departments List */}
      <div className="space-y-4">
        {departments.map(dept => (
          <Card key={dept.id}>
            <Collapsible
              open={openDepartments[dept.id]}
              onOpenChange={() => toggleDepartment(dept.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {openDepartments[dept.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      ({dept.groups.length} {dept.groups.length === 1 ? 'grupp' : 'grupper'})
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateNew(dept.name)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('administration.groups.addGroup')}
                  </Button>
                </div>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-3 pt-0">
                  {dept.groups.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('administration.groups.noGroups')}</p>
                    </div>
                  ) : (
                    dept.groups.map(group => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Group Dialog */}
      <GroupDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingGroup={editingGroup}
        departments={departmentsForDialog}
      />
    </div>
  );
}

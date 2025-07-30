import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";

export default function WorkspaceSelector({ 
  workspaces, 
  currentWorkspace, 
  onWorkspaceChange, 
  onCreateNew 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-gray-500" />
        <Select 
          value={currentWorkspace?.id} 
          onValueChange={(value) => {
            const workspace = workspaces.find(w => w.id === value);
            onWorkspaceChange(workspace);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione um workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" size="sm" onClick={onCreateNew}>
        <Plus className="w-4 h-4 mr-1" />
        Novo
      </Button>
    </div>
  );
}
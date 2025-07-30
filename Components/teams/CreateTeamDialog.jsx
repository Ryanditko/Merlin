import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const colorOptions = [
  "#78BE20", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"
];

export default function CreateTeamDialog({ onSubmit, onCancel }) {
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    color: colorOptions[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setTeamData(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(teamData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Equipe</DialogTitle>
          <DialogDescription>
            Organize suas automações e membros em uma nova equipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Nome da Equipe</Label>
            <Input
              id="name"
              name="name"
              value={teamData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={teamData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Cor da Equipe</Label>
            <div className="flex gap-2 mt-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    teamData.color === color ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Criar Equipe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
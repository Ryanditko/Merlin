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

export default function TemplateEditor({ template, team, onSubmit, onCancel }) {
  const [templateData, setTemplateData] = useState(template || {
    title: "",
    trigger: "",
    content: "",
    variables: [],
    tags: [],
    is_active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(templateData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{template ? "Editar" : "Criar"} Template</DialogTitle>
          <DialogDescription>
            Crie um novo template de automação para a equipe "{team.name}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={templateData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="trigger">Gatilho (ex: /reagendar)</Label>
            <Input
              id="trigger"
              name="trigger"
              value={templateData.trigger}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              name="content"
              value={templateData.content}
              onChange={handleChange}
              rows={6}
              placeholder="Use {variavel} para criar campos dinâmicos."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{template ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
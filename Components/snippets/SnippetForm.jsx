import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Save, FileText } from "lucide-react";

const categories = ["email", "forms", "social", "support", "sales", "personal", "other"];

export default function SnippetForm({ snippet, onSubmit, onCancel }) {
  const [currentSnippet, setCurrentSnippet] = useState(snippet || {
    title: "",
    shortcut: "",
    content: "",
    category: "other",
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentSnippet);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 green-gradient rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {snippet ? "Editar Snippet" : "Novo Snippet"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Assinatura de Email"
                value={currentSnippet.title}
                onChange={(e) => setCurrentSnippet({ ...currentSnippet, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="shortcut">Atalho</Label>
              <Input
                id="shortcut"
                placeholder="Ex: @@email"
                value={currentSnippet.shortcut}
                onChange={(e) => setCurrentSnippet({ ...currentSnippet, shortcut: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo do seu snippet aqui. Use {variaveis} para campos dinâmicos."
              value={currentSnippet.content}
              onChange={(e) => setCurrentSnippet({ ...currentSnippet, content: e.target.value })}
              className="h-36"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={currentSnippet.category}
                onValueChange={(value) => setCurrentSnippet({ ...currentSnippet, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <Label htmlFor="is_active">Ativo</Label>
              <Switch
                id="is_active"
                checked={currentSnippet.is_active}
                onCheckedChange={(checked) => setCurrentSnippet({ ...currentSnippet, is_active: checked })}
              />
              <span className="text-sm text-gray-600">
                {currentSnippet.is_active ? "O snippet aparecerá nas sugestões." : "O snippet não será sugerido."}
              </span>
            </div>
          </div>
        </form>

        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="green-gradient text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Snippet
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
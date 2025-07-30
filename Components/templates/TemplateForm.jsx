import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2, Eye } from "lucide-react";

export default function TemplateForm({ template, teams, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    trigger: template?.trigger || "",
    title: template?.title || "",
    content: template?.content || "",
    team_id: template?.team_id || "",
    variables: template?.variables || [],
    is_active: template?.is_active !== undefined ? template.is_active : true
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVariable = () => {
    const newVariable = {
      name: "",
      label: "",
      type: "text",
      required: false,
      options: []
    };
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable]
    }));
  };

  const updateVariable = (index, field, value) => {
    const updatedVariables = [...formData.variables];
    updatedVariables[index] = { ...updatedVariables[index], [field]: value };
    setFormData(prev => ({ ...prev, variables: updatedVariables }));
  };

  const removeVariable = (index) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderPreview = () => {
    let preview = formData.content;
    formData.variables.forEach(variable => {
      const placeholder = `{${variable.name}}`;
      const replacement = `<span class="bg-blue-100 text-blue-800 px-1 rounded">${variable.label || variable.name}</span>`;
      preview = preview.replace(new RegExp(`\\{${variable.name}\\}`, 'g'), replacement);
    });
    return preview;
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? "Editar Template" : "Novo Template"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atalho/Comando *
                  </label>
                  <Input
                    value={formData.trigger}
                    onChange={(e) => handleChange('trigger', e.target.value)}
                    placeholder="Ex: /hello ou @email"
                    required
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Como você vai ativar este template
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Nome do template"
                    required
                  />
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipe
                </label>
                <Select value={formData.team_id} onValueChange={(value) => handleChange('team_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma equipe (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Pessoal</SelectItem>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Conteúdo do Template *
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Ocultar" : "Visualizar"}
                  </Button>
                </div>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Digite o conteúdo do seu template aqui..."
                  rows={8}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{variavel}'} para criar campos dinâmicos
                </p>
                
                {showPreview && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                    <div 
                      className="text-sm text-gray-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                  </div>
                )}
              </div>

              {/* Variables */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Variáveis</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Variável
                  </Button>
                </div>
                
                {formData.variables.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhuma variável definida. Adicione variáveis para criar campos dinâmicos.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {formData.variables.map((variable, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="outline" className="font-mono">
                              {'{' + (variable.name || 'nome') + '}'}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariable(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nome da Variável
                              </label>
                              <Input
                                value={variable.name}
                                onChange={(e) => updateVariable(index, 'name', e.target.value)}
                                placeholder="nome"
                                className="font-mono text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Label/Descrição
                              </label>
                              <Input
                                value={variable.label}
                                onChange={(e) => updateVariable(index, 'label', e.target.value)}
                                placeholder="Nome do cliente"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tipo
                              </label>
                              <Select 
                                value={variable.type} 
                                onValueChange={(value) => updateVariable(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Texto</SelectItem>
                                  <SelectItem value="textarea">Texto Longo</SelectItem>
                                  <SelectItem value="date">Data</SelectItem>
                                  <SelectItem value="select">Seleção</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {variable.type === 'select' && (
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Opções (uma por linha)
                              </label>
                              <Textarea
                                value={variable.options?.join('\n') || ''}
                                onChange={(e) => updateVariable(index, 'options', e.target.value.split('\n').filter(Boolean))}
                                placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                                rows={3}
                                className="text-sm"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="green-gradient text-white">
            {template ? "Salvar Alterações" : "Criar Template"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
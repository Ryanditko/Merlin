import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Plus, Trash2, Play, Settings } from "lucide-react";

const triggerTypes = [
  { value: "keyboard_shortcut", label: "Atalho de Teclado" },
  { value: "url_match", label: "URL Específica" },
  { value: "manual", label: "Execução Manual" },
  { value: "form_detection", label: "Detecção de Formulário" }
];

const stepTypes = [
  { value: "type_text", label: "Digitar Texto" },
  { value: "click_element", label: "Clicar Elemento" },
  { value: "fill_form", label: "Preencher Campo" },
  { value: "wait", label: "Aguardar" },
  { value: "press_key", label: "Pressionar Tecla" },
  { value: "navigate", label: "Navegar URL" }
];

export default function WorkflowEditor({ workflow, onSubmit, onCancel }) {
  const [currentWorkflow, setCurrentWorkflow] = useState(workflow || {
    name: "",
    description: "",
    trigger: { type: "manual", value: "" },
    steps: [],
    is_active: true,
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentWorkflow);
  };

  const addStep = () => {
    const newStep = {
      id: `step${Date.now()}`,
      type: "type_text",
      target: "",
      value: "",
      delay: 500
    };
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (index, field, value) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeStep = (index) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
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
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {workflow ? "Editar Workflow" : "Novo Workflow"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nome do Workflow</Label>
              <Input
                id="name"
                placeholder="Ex: Preencher Formulário de Contato"
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="O que este workflow faz?"
                value={currentWorkflow.description}
                onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, description: e.target.value })}
              />
            </div>
          </div>

          {/* Trigger Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gatilho de Execução</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Gatilho</Label>
                  <Select
                    value={currentWorkflow.trigger?.type}
                    onValueChange={(value) => setCurrentWorkflow(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger, type: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor do Gatilho</Label>
                  <Input
                    placeholder={
                      currentWorkflow.trigger?.type === "keyboard_shortcut" ? "Ex: Ctrl+Shift+A" :
                      currentWorkflow.trigger?.type === "url_match" ? "Ex: linkedin.com" :
                      "Deixe vazio para execução manual"
                    }
                    value={currentWorkflow.trigger?.value || ""}
                    onChange={(e) => setCurrentWorkflow(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger, value: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Passos da Automação</CardTitle>
              <Button type="button" onClick={addStep} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Passo
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {currentWorkflow.steps?.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Passo {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo de Ação</Label>
                        <Select
                          value={step.type}
                          onValueChange={(value) => updateStep(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stepTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Elemento/Seletor</Label>
                        <Input
                          placeholder="Ex: #email, .btn-submit"
                          value={step.target}
                          onChange={(e) => updateStep(index, "target", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label>Valor/Conteúdo</Label>
                        <Input
                          placeholder="Texto ou valor"
                          value={step.value}
                          onChange={(e) => updateStep(index, "value", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {currentWorkflow.steps?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Play className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum passo adicionado</p>
                  <p className="text-sm">Clique em "Adicionar Passo" para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Workflow
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
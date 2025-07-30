import React, { useState, useEffect } from "react";
import { Template, User } from "@/entities/all";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, X, ArrowRight, Clock } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

import TemplateConfirmation from "../components/TemplateConfirmation";

export default function MagicalPopup({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
    
    // Focus on search input
    const searchInput = document.querySelector('#magical-search');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await Template.filter({ is_active: true });
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
    setIsLoading(false);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowConfirmation(true);
  };

  const handleTemplateConfirm = async (processedContent) => {
    // Insert text into active field
    const activeElement = document.activeElement;
    
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.contentEditable === 'true'
    )) {
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const currentValue = activeElement.value;
        
        const newValue = currentValue.substring(0, start) + processedContent + currentValue.substring(end);
        activeElement.value = newValue;
        
        // Trigger input event
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Set cursor position
        const newPosition = start + processedContent.length;
        activeElement.setSelectionRange(newPosition, newPosition);
        activeElement.focus();
      } else {
        // Handle contentEditable
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(processedContent));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(processedContent);
      alert('Texto copiado para a área de transferência!');
    }

    // Update usage count
    await Template.update(selectedTemplate.id, {
      usage_count: (selectedTemplate.usage_count || 0) + 1
    });

    onClose();
  };

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showConfirmation && selectedTemplate) {
    return (
      <div className="magical-overlay" onClick={onClose}>
        <div className="magical-popup" onClick={e => e.stopPropagation()}>
          <TemplateConfirmation
            template={selectedTemplate}
            onConfirm={handleTemplateConfirm}
            onCancel={() => setShowConfirmation(false)}
            onClose={onClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="magical-overlay" onClick={onClose}>
      <div className="magical-popup" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 green-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Merlin</h2>
              <p className="text-sm text-gray-500">Assistente de Automação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="magical-search"
              placeholder="Busque templates ou digite um comando..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Digite //m para abrir em qualquer lugar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Use / para comandos rápidos</span>
            </div>
          </div>
        </div>

        {/* Templates List */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Carregando templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-semibold text-gray-900 mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery 
                  ? "Tente uma busca diferente ou crie um novo template"
                  : "Você ainda não criou nenhum template"
                }
              </p>
              <Button 
                onClick={onClose}
                className="green-gradient text-white"
              >
                Criar Primeiro Template
              </Button>
            </div>
          ) : (
            <div className="p-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all text-left group border-2 border-transparent hover:border-green-200 mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            {template.title}
                          </h4>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-mono">
                            {template.trigger}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 ml-11">
                        {template.content.substring(0, 120)}...
                      </p>
                      <div className="flex items-center gap-3 mt-2 ml-11 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.usage_count || 0} usos
                        </span>
                        {template.variables && template.variables.length > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {template.variables.length} variáveis
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Pressione ESC para fechar</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Merlin - Assistente de Produtividade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
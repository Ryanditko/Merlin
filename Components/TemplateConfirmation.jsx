import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

function Placeholder({ value, onChange, placeholder }) {
    const [text, setText] = useState(value);
    const spanRef = useRef(null);

    const handleInput = (e) => {
        const newText = e.currentTarget.textContent;
        setText(newText);
        onChange(newText);
    };
    
    // Atualiza o conteúdo se a prop `value` mudar externamente
    useEffect(() => {
        if (text !== value) {
            setText(value);
        }
    }, [value]);

    return (
        <span className="inline-block">
            <span
                ref={spanRef}
                contentEditable
                onInput={handleInput}
                suppressContentEditableWarning
                className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md min-w-[50px] focus:outline-none focus:ring-2 focus:ring-green-500"
                data-placeholder={placeholder}
            >
                {text}
            </span>
        </span>
    );
}

export default function TemplateConfirmation({ template, onConfirm, onCancel }) {
  const [variables, setVariables] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const initialVariables = {};
    const extracted = extractPlaceholders(template.content);
    extracted.forEach(part => {
      if (part.type === 'placeholder') {
        initialVariables[part.value] = '';
      }
    });
    setVariables(initialVariables);
  }, [template]);

  const handlePlaceholderChange = (placeholderName, value) => {
    setVariables(prev => ({ ...prev, [placeholderName]: value }));
  };
  
  const extractPlaceholders = (content) => {
    const parts = content.split(/(\{[^}]+\})/g).filter(Boolean);
    return parts.map(part => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return { type: 'placeholder', value: part.slice(1, -1) };
      }
      return { type: 'text', value: part };
    });
  };

  const handleConfirm = () => {
    let finalContent = template.content;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        finalContent = finalContent.replace(regex, value || '');
    }
    onConfirm(finalContent);
  }

  const contentParts = extractPlaceholders(template.content);

  return (
    <div className="magical-overlay" onClick={onCancel}>
      <motion.div 
        className="magical-popup" 
        onClick={e => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
       >
          <div className="p-6 border-b">
              <h3 className="font-bold text-xl text-gray-900">{template.title}</h3>
              <p className="text-sm text-gray-500">Preencha os campos para inserir o texto.</p>
          </div>
          
          <div className="p-6 text-lg leading-relaxed whitespace-pre-wrap" ref={contentRef}>
            {contentParts.map((part, index) =>
              part.type === 'placeholder' ? (
                <Placeholder
                  key={index}
                  value={variables[part.value] || ''}
                  onChange={(val) => handlePlaceholderChange(part.value, val)}
                  placeholder={part.value}
                />
              ) : (
                <span key={index}>{part.value}</span>
              )
            )}
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button className="green-gradient text-white" onClick={handleConfirm}>
                <Sparkles className="w-4 h-4 mr-2" />
                Inserir Texto
            </Button>
          </div>
      </motion.div>
    </div>
  );
}
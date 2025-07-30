import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Play, Settings, FileText, Workflow, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ActionButton = ({ icon: Icon, title, description, href, variant = "outline", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link to={href} className="block">
      <Button 
        variant={variant} 
        className={`w-full h-auto p-4 justify-start hover:shadow-md transition-all duration-200 ${
          variant === "default" ? "green-gradient text-white" : "border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${
            variant === "default" ? "text-white" : "text-gray-500"
          }`} />
          <div className="text-left">
            <div className={`font-semibold ${
              variant === "default" ? "text-white" : "text-gray-900"
            }`}>
              {title}
            </div>
            <div className={`text-xs ${
              variant === "default" ? "text-green-100" : "text-gray-500"
            }`}>
              {description}
            </div>
          </div>
        </div>
      </Button>
    </Link>
  </motion.div>
);

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      title: "Criar Snippet",
      description: "Novo atalho de texto",
      href: createPageUrl("Snippets"),
      variant: "default"
    },
    {
      icon: Play,
      title: "Gravar Workflow",
      description: "Capturar sequência de ações",
      href: createPageUrl("Workflows")
    },
    {
      icon: FileText,
      title: "Ver Biblioteca",
      description: "Gerenciar snippets existentes",
      href: createPageUrl("Snippets")
    },
    {
      icon: Settings,
      title: "Configurações",
      description: "Personalizar comportamento",
      href: createPageUrl("Settings")
    }
  ];

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <ActionButton 
            key={action.title}
            {...action}
            delay={index * 0.1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Workflow as WorkflowEntity } from "@/entities/Workflow";
import { motion } from "framer-motion";
import { 
  Workflow, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Target, 
  Clock,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const triggerTypes = {
  keyboard_shortcut: { label: "Atalho", color: "bg-blue-100 text-blue-800" },
  url_match: { label: "URL", color: "bg-purple-100 text-purple-800" },
  manual: { label: "Manual", color: "bg-green-100 text-green-800" },
  form_detection: { label: "Formulário", color: "bg-orange-100 text-orange-800" }
};

export default function WorkflowCard({ workflow, onEdit, onDelete }) {
  const handleToggleActive = async (isActive) => {
    await WorkflowEntity.update(workflow.id, { is_active: isActive });
  };

  const triggerInfo = triggerTypes[workflow.trigger?.type] || triggerTypes.manual;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-full"
    >
      <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-bold text-gray-900 truncate">{workflow.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflow.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(workflow)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(workflow.id)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={`border-0 ${triggerInfo.color}`}>
              <Target className="w-3 h-3 mr-1.5" />
              {triggerInfo.label}
            </Badge>
            {workflow.trigger?.value && (
              <Badge variant="outline" className="text-xs font-mono">
                {workflow.trigger.value}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">{workflow.steps?.length || 0} passos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-gray-600">{workflow.success_rate || 0}% sucesso</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Play className="w-3 h-3" />
              <span>{workflow.usage_count || 0} execuções</span>
            </div>
            {workflow.last_executed && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>
                  Último: {format(new Date(workflow.last_executed), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={workflow.is_active ? "default" : "outline"}
              className={workflow.is_active ? "green-gradient text-white" : ""}
            >
              {workflow.is_active ? <Play className="w-3 h-3 mr-1.5" /> : <Pause className="w-3 h-3 mr-1.5" />}
              {workflow.is_active ? "Ativo" : "Pausado"}
            </Button>
          </div>
          <Switch
            checked={workflow.is_active}
            onCheckedChange={handleToggleActive}
          />
        </div>
      </Card>
    </motion.div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Snippet } from "@/entities/Snippet";
import { motion } from "framer-motion";
import { FileText, MoreVertical, Edit, Trash2, Tag, Zap, CheckCircle, XCircle } from "lucide-react";

const categoryColors = {
  email: "bg-blue-100 text-blue-800",
  forms: "bg-purple-100 text-purple-800",
  social: "bg-pink-100 text-pink-800",
  support: "bg-green-100 text-green-800",
  sales: "bg-orange-100 text-orange-800",
  personal: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

export default function SnippetCard({ snippet, onEdit, onDelete }) {
  const handleToggleActive = async (isActive) => {
    await Snippet.update(snippet.id, { is_active: isActive });
  };

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
            <CardTitle className="text-base font-bold text-gray-900 truncate">{snippet.title}</CardTitle>
            <Badge variant="outline" className="mt-2 text-xs font-mono">{snippet.shortcut}</Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(snippet)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(snippet.id)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3">
            {snippet.content}
          </p>
        </CardContent>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <Badge className={`border-0 ${categoryColors[snippet.category]}`}>
            <Tag className="w-3 h-3 mr-1.5" />
            {snippet.category}
          </Badge>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${snippet.is_active ? 'text-green-600' : 'text-gray-400'}`}>
              {snippet.is_active ? 'Ativo' : 'Inativo'}
            </span>
            <Switch
              checked={snippet.is_active}
              onCheckedChange={handleToggleActive}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
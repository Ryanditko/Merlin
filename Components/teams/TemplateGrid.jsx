import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function TemplateGrid({ templates, onEdit, onDelete }) {
  if (templates.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template criado
          </h3>
          <p className="text-gray-600">
            Crie o primeiro template para esta equipe.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(template => (
        <Card key={template.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 flex-1 pr-2">{template.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(template.id)} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-mono">
              {template.trigger}
            </p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {template.content}
            </p>
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>{template.usage_count || 0} usos</span>
              <Badge variant={template.is_active ? "default" : "secondary"}>
                {template.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
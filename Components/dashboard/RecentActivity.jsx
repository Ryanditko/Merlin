import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RecentActivity({ templates }) {
  const recentTemplates = templates
    .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-green-600" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Nenhuma atividade recente</p>
            <p className="text-sm">Crie templates para começar a automatizar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTemplates.map((template) => (
              <div key={template.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{template.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {template.trigger}
                    </Badge>
                    <span>
                      {format(new Date(template.updated_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {template.usage_count || 0} usos
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
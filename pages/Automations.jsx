import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Workflow } from "lucide-react";

export default function Automations() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automações</h1>
          <p className="text-gray-600">Crie fluxos de trabalho complexos para automatizar tarefas.</p>
        </div>
        <Button className="green-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Automação
        </Button>
      </div>
      
      <Card className="text-center py-24">
        <CardHeader>
          <Workflow className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <CardTitle className="text-2xl font-bold">Em Breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 max-w-md mx-auto">
            A funcionalidade de automações multi-passo está em desenvolvimento. Em breve, você poderá criar fluxos de trabalho poderosos para automatizar suas tarefas repetitivas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
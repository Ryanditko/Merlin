import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TeamHeader({ team, workspace, currentUser, members, templatesCount, onSettingsClick }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: team.color }}>
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <p className="text-gray-600">{team.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-6 text-sm border-t pt-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{members.length} Membros</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{templatesCount} Templates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
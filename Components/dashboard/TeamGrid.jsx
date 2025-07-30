import React, { useState } from "react";
import { Team } from "@/entities/Team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CreateTeamDialog from "../teams/CreateTeamDialog";

export default function TeamGrid({ teams, workspace, onTeamsChange }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateTeam = async (teamData) => {
    const newTeam = await Team.create({
      ...teamData,
      workspace_id: workspace.id
    });
    
    onTeamsChange([...teams, newTeam]);
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Equipes</h2>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Equipe
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma equipe criada
            </h3>
            <p className="text-gray-600 mb-4">
              Organize suas automações em equipes para melhor colaboração.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira equipe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <Link to={createPageUrl(`Teams?id=${team.id}`)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: team.color }}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          // Abrir configurações da equipe
                        }}
                      >
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {team.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>0 membros</span>
                      <span>0 templates</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {showCreateDialog && (
        <CreateTeamDialog
          onSubmit={handleCreateTeam}
          onCancel={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}
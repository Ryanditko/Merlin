import React, { useState, useEffect } from "react";
import { Team, TeamMember, Template, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings as SettingsIcon, Trash2, Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import TeamHeader from "../components/teams/TeamHeader";
import TemplateGrid from "../components/teams/TemplateGrid";
import TemplateEditor from "../components/templates/TemplateEditor";
import TeamSettings from "../components/teams/TeamSettings";
import CreateTeamDialog from "../components/teams/CreateTeamDialog";


export default function Teams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(searchParams.get("id"));
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      loadTeamData(selectedTeamId);
    } else if (teams.length > 0) {
      handleTeamSelect(teams[0].id);
    }
  }, [selectedTeamId, teams]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [user, userTeams] = await Promise.all([
          User.me(),
          Team.list()
      ]);
      setCurrentUser(user);
      setTeams(userTeams);
      if(userTeams.length > 0 && !selectedTeamId) {
        handleTeamSelect(userTeams[0].id);
      }
    } catch (error) {
       console.error("Erro ao carregar dados iniciais:", error);
    }
    setIsLoading(false);
  };
  
  const loadTeamData = async (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    setSelectedTeam(team);
    try {
      const [teamTemplates, teamMembers] = await Promise.all([
        Template.filter({ team_id: teamId }),
        TeamMember.filter({ team_id: teamId })
      ]);
      setTemplates(teamTemplates);
      setMembers(teamMembers);
    } catch (error) {
      console.error("Erro ao carregar dados da equipe:", error);
    }
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeamId(teamId);
    setSearchParams({ id: teamId });
  };
  
  const handleTemplateSubmit = async (templateData) => {
    if (editingTemplate) {
      await Template.update(editingTemplate.id, templateData);
    } else {
      await Template.create({ ...templateData, team_id: selectedTeamId });
    }
    setShowTemplateEditor(false);
    setEditingTemplate(null);
    loadTeamData(selectedTeamId);
  };
  
  const handleCreateTeam = async (teamData) => {
      const newTeam = await Team.create(teamData);
      // Adiciona o criador como admin
      await TeamMember.create({ team_id: newTeam.id, user_email: currentUser.email, role: 'admin' });
      setShowCreateTeam(false);
      loadInitialData();
      handleTeamSelect(newTeam.id);
  }

  if (isLoading && teams.length === 0) {
    return <div className="p-6">Carregando...</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Team Sidebar */}
      <aside className="w-72 border-r bg-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Equipes</h2>
        <Button className="w-full green-gradient text-white" onClick={() => setShowCreateTeam(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Equipe
        </Button>
        <nav className="flex flex-col space-y-1">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${selectedTeamId === team.id ? 'bg-green-100 text-green-900' : 'hover:bg-gray-100'}`}
            >
              <span className="w-6 h-6 rounded" style={{ backgroundColor: team.color }}></span>
              <span className="font-medium">{team.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {!selectedTeam ? (
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold">Selecione uma equipe</h3>
            <p className="text-gray-500">Ou crie uma nova para começar.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <TeamHeader
              team={selectedTeam}
              onSettingsClick={() => setShowSettings(true)}
            />
            
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Templates da Equipe</h2>
              <Button onClick={() => setShowTemplateEditor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </div>
            
            <TemplateGrid 
              templates={templates}
              onEdit={(template) => { setEditingTemplate(template); setShowTemplateEditor(true); }}
              onDelete={async (id) => { await Template.delete(id); loadTeamData(selectedTeamId); }}
            />
            
            <TeamMembers 
                team={selectedTeam}
                members={members}
                currentUser={currentUser}
                onMembersChange={() => loadTeamData(selectedTeamId)}
             />
          </div>
        )}
      </main>

      <AnimatePresence>
        {showTemplateEditor && (
          <TemplateEditor
            template={editingTemplate}
            team={selectedTeam}
            onSubmit={handleTemplateSubmit}
            onCancel={() => { setShowTemplateEditor(false); setEditingTemplate(null); }}
          />
        )}
        {showCreateTeam && (
            <CreateTeamDialog
              onSubmit={handleCreateTeam}
              onCancel={() => setShowCreateTeam(false)}
            />
        )}
        {showSettings && selectedTeam && (
          <TeamSettings 
            team={selectedTeam}
            onSave={() => { setShowSettings(false); loadInitialData(); }}
            onCancel={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


function TeamMembers({ team, members, currentUser, onMembersChange }) {
    const [inviteEmail, setInviteEmail] = useState("");
    
    const currentUserRole = members.find(m => m.user_email === currentUser.email)?.role;
    
    const handleInvite = async () => {
        if (!inviteEmail) return;
        try {
            await TeamMember.create({ team_id: team.id, user_email: inviteEmail, role: 'member' });
            setInviteEmail("");
            onMembersChange();
        } catch (error) {
            console.error("Erro ao convidar:", error);
            alert("Falha ao convidar membro.");
        }
    };
    
    const handleRemove = async (memberId) => {
        await TeamMember.delete(memberId);
        onMembersChange();
    };

    const handleRoleChange = async (memberId, role) => {
        await TeamMember.update(memberId, { role });
        onMembersChange();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Membros da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {currentUserRole === 'admin' && (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="email@exemplo.com" 
                      value={inviteEmail} 
                      onChange={e => setInviteEmail(e.target.value)} 
                    />
                    <Button onClick={handleInvite}><Plus className="w-4 h-4 mr-2" />Convidar</Button>
                  </div>
                )}
                <div className="space-y-2">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{member.user_email.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{member.user_email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentUserRole === 'admin' ? (
                                    <Select value={member.role} onValueChange={(role) => handleRoleChange(member.id, role)}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="member">Membro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge variant="outline">{member.role}</Badge>
                                )}
                                {currentUserRole === 'admin' && member.user_email !== team.created_by && (
                                    <Button variant="ghost" size="icon" onClick={() => handleRemove(member.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
import React, { useState, useEffect } from "react";
import { Template, Team, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  Edit2, 
  Trash2, 
  Copy,
  Eye,
  Target,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import TemplateForm from "../components/templates/TemplateForm";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, teamsData] = await Promise.all([
        Template.list('-updated_date'),
        Team.list()
      ]);
      setTemplates(templatesData);
      setTeams(teamsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (templateData) => {
    try {
      if (editingTemplate) {
        await Template.update(editingTemplate.id, templateData);
      } else {
        await Template.create(templateData);
      }
      setShowForm(false);
      setEditingTemplate(null);
      loadData();
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (templateId) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      try {
        await Template.delete(templateId);
        loadData();
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      // Você pode adicionar uma notificação aqui
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTeam = selectedTeam === "all" || template.team_id === selectedTeam;
    
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates de Automação</h1>
          <p className="text-gray-600">Gerencie seus atalhos de texto e automações</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="green-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar templates por título, atalho ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          >
            <option value="all">Todas as equipes</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <AnimatePresence>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "Nenhum template encontrado" : "Nenhum template ainda"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? "Tente uma busca diferente ou crie um novo template"
                : "Crie seu primeiro template para começar a automatizar"
              }
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="green-gradient text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Template
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                          {template.title}
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 text-xs font-mono">
                          {template.trigger}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(template)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(template.content)}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {template.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {template.usage_count || 0} usos
                          </span>
                          {template.variables && template.variables.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {template.variables.length} variáveis
                            </span>
                          )}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${template.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Template Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TemplateForm
            template={editingTemplate}
            teams={teams}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTemplate(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
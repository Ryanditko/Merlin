import React, { useState, useEffect } from "react";
import { Template, Team, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Clock, Zap, TrendingUp, FileText, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalExpansions: 0,
    timeSaved: 0,
    thisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, teamsData] = await Promise.all([
        Template.list('-usage_count'),
        Team.list()
      ]);
      
      setTemplates(templatesData);
      setTeams(teamsData);
      
      // Calculate stats
      const totalExpansions = templatesData.reduce((sum, t) => sum + (t.usage_count || 0), 0);
      setStats({
        totalTemplates: templatesData.length,
        totalExpansions,
        timeSaved: Math.floor(totalExpansions * 2.5),
        thisWeek: Math.floor(totalExpansions * 0.3)
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Merlin
            </h1>
            <p className="text-gray-600 text-lg">
              Seu assistente de produtividade com automação inteligente
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">
              Digite <code className="bg-green-100 px-2 py-1 rounded text-green-700 font-mono">//m</code> em qualquer lugar
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Sistema ativo
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Templates Criados"
            value={stats.totalTemplates}
            icon={FileText}
            color="green-gradient"
            delay={0}
          />
          <StatCard
            title="Expansões Realizadas"
            value={stats.totalExpansions}
            icon={Zap}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            delay={0.1}
          />
          <StatCard
            title="Tempo Economizado"
            value={`${Math.floor(stats.timeSaved / 60)}h ${stats.timeSaved % 60}m`}
            icon={Clock}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            delay={0.2}
          />
          <StatCard
            title="Equipes Ativas"
            value={teams.length}
            icon={Users}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Templates Recentes */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-6 h-6 text-green-600" />
                    Templates Recentes
                  </CardTitle>
                  <Link to={createPageUrl("Templates")}>
                    <Button className="green-gradient text-white shadow-lg hover:shadow-xl transition-all">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Template
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum template ainda
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Crie seu primeiro template para começar a automatizar
                      </p>
                      <Link to={createPageUrl("Templates")}>
                        <Button className="green-gradient text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Template
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {templates.slice(0, 5).map((template) => (
                        <div key={template.id} className="flex items-start gap-3 p-4 hover:bg-green-50 rounded-xl group transition-colors">
                          <div className="w-10 h-10 green-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{template.title}</h4>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-mono">
                                {template.trigger}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {template.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {template.usage_count || 0} usos
                              </span>
                              <span>•</span>
                              <span>Ativo</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Equipes
                  </CardTitle>
                  <Link to={createPageUrl("Teams")}>
                    <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-sm mb-1">Nenhuma equipe ainda</p>
                      <p className="text-gray-400 text-xs">Crie equipes para organizar templates</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {teams.slice(0, 4).map((team) => (
                        <Link key={team.id} to={createPageUrl(`Teams?id=${team.id}`)}>
                          <div className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
                              style={{ backgroundColor: team.color }}
                            >
                              {team.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                                {team.name}
                              </p>
                              <p className="text-xs text-gray-500">Equipe ativa</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Guia de Início */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    Como Começar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 green-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Crie templates</p>
                        <p className="text-gray-600 text-xs">Defina atalhos e conteúdo</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 green-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Use em qualquer lugar</p>
                        <p className="text-gray-600 text-xs">Digite //m para abrir o Merlin</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 green-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Organize em equipes</p>
                        <p className="text-gray-600 text-xs">Compartilhe com colegas</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-100">
                    <p className="text-xs text-green-700 font-medium">
                      💡 Dica: Use variáveis como {'{nome}'} nos seus templates
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
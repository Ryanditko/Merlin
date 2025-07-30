import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Workflow, Clock, Zap, Target, Timer, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0, isLoading }) => (
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
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        )}
        {trend && (
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function StatsGrid({ 
  totalSnippets, 
  activeSnippets, 
  totalWorkflows, 
  totalUsage, 
  timeSaved, 
  keystrokesSaved, 
  productivityScore,
  isLoading 
}) {
  const stats = [
    {
      title: "Total de Snippets",
      value: totalSnippets,
      icon: FileText,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: `${activeSnippets} ativos`
    },
    {
      title: "Workflows Criados",
      value: totalWorkflows,
      icon: Workflow,
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "Tempo Economizado",
      value: `${timeSaved}min`,
      icon: Timer,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      trend: "hoje"
    },
    {
      title: "Teclas Economizadas",
      value: keystrokesSaved.toLocaleString(),
      icon: Zap,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      trend: "hoje"
    },
    {
      title: "Usos Totais",
      value: totalUsage,
      icon: Target,
      color: "bg-gradient-to-r from-pink-500 to-pink-600"
    },
    {
      title: "Score Produtividade",
      value: `${productivityScore}%`,
      icon: TrendingUp,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      trend: "hoje"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.title}
          {...stat}
          delay={index * 0.1}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
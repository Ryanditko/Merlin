import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Zap, Clock, TrendingUp } from "lucide-react";

export default function QuickStats({ stats }) {
  const statItems = [
    {
      title: "Templates",
      value: stats.totalTemplates,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Expansions",
      value: stats.totalExpansions,
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Time Saved",
      value: `${Math.floor(stats.timeSaved / 60)}m ${stats.timeSaved % 60}s`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkflowCard from "./WorkflowCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow } from "lucide-react";

export default function WorkflowGrid({ workflows, isLoading, onEdit, onDelete, searchQuery }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-lg" />
        ))}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-16">
        <Workflow className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {searchQuery ? "Nenhum workflow encontrado" : "Nenhum workflow criado"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery ? "Tente uma busca diferente." : "Crie seu primeiro workflow para automatizar tarefas!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
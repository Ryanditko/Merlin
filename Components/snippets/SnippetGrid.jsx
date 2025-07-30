import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SnippetCard from "./SnippetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

export default function SnippetGrid({ snippets, isLoading, onEdit, onDelete, searchQuery }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {searchQuery ? "Nenhum snippet encontrado" : "Nenhum snippet criado"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery ? "Tente uma busca diferente." : "Crie seu primeiro snippet para começar!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
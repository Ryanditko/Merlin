import React, { useState, useEffect } from "react";
import { Snippet } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SnippetGrid from "../components/snippets/SnippetGrid";
import SnippetForm from "../components/snippets/SnippetForm";
import SnippetFilters from "../components/snippets/SnippetFilters";

export default function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all"
  });

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    setIsLoading(true);
    const data = await Snippet.list('-updated_date');
    setSnippets(data);
    setIsLoading(false);
  };

  const handleSubmit = async (snippetData) => {
    if (editingSnippet) {
      await Snippet.update(editingSnippet.id, snippetData);
    } else {
      await Snippet.create(snippetData);
    }
    setShowForm(false);
    setEditingSnippet(null);
    loadSnippets();
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleDelete = async (snippetId) => {
    await Snippet.delete(snippetId);
    loadSnippets();
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.shortcut.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.category === "all" || snippet.category === filters.category;
    const matchesStatus = filters.status === "all" || 
                         (filters.status === "active" && snippet.is_active) ||
                         (filters.status === "inactive" && !snippet.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Snippets</h1>
          <p className="text-gray-600">Gerencie seus atalhos de texto e templates</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="green-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Snippet
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar snippets por título, atalho ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500"
          />
        </div>
        
        <SnippetFilters filters={filters} onFiltersChange={setFilters} />
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <SnippetForm
            snippet={editingSnippet}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingSnippet(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Snippets Grid */}
      <SnippetGrid 
        snippets={filteredSnippets}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />
    </div>
  );
}
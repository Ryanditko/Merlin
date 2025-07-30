import React, { useState, useEffect } from "react";
import { Workflow } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Play, Pause, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import WorkflowGrid from "../components/workflows/WorkflowGrid";
import WorkflowEditor from "../components/workflows/WorkflowEditor";
import WorkflowRecorder from "../components/workflows/WorkflowRecorder";

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    const data = await Workflow.list('-updated_date');
    setWorkflows(data);
    setIsLoading(false);
  };

  const handleSubmit = async (workflowData) => {
    if (editingWorkflow) {
      await Workflow.update(editingWorkflow.id, workflowData);
    } else {
      await Workflow.create(workflowData);
    }
    setShowEditor(false);
    setEditingWorkflow(null);
    loadWorkflows();
  };

  const handleEdit = (workflow) => {
    setEditingWorkflow(workflow);
    setShowEditor(true);
  };

  const handleDelete = async (workflowId) => {
    await Workflow.delete(workflowId);
    loadWorkflows();
  };

  const handleRecordComplete = async (recordedWorkflow) => {
    await Workflow.create(recordedWorkflow);
    setShowRecorder(false);
    loadWorkflows();
  };

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows de Automação</h1>
          <p className="text-gray-600">Crie e gerencie sequências automáticas de ações</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowRecorder(true)}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Gravar Fluxo
          </Button>
          <Button 
            onClick={() => setShowEditor(true)}
            className="green-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Workflow
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-gray-200 focus:border-green-500"
        />
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showEditor && (
          <WorkflowEditor
            workflow={editingWorkflow}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowEditor(false);
              setEditingWorkflow(null);
            }}
          />
        )}
        {showRecorder && (
          <WorkflowRecorder
            onComplete={handleRecordComplete}
            onCancel={() => setShowRecorder(false)}
          />
        )}
      </AnimatePresence>

      {/* Workflows Grid */}
      <WorkflowGrid 
        workflows={filteredWorkflows}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />
    </div>
  );
}
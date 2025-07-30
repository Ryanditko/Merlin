import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Play, 
  Square, 
  Pause, 
  Save, 
  Circle,
  MousePointer,
  Keyboard,
  Clock
} from "lucide-react";

export default function WorkflowRecorder({ onComplete, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordedSteps([]);
    setRecordingTime(0);
    
    // Simulação de captura de ações do usuário
    // Em uma implementação real, isso seria conectado à extensão do navegador
    const simulateRecording = () => {
      const actions = [
        { type: "click_element", target: "#login-button", value: "", delay: 1000 },
        { type: "fill_form", target: "#email", value: "{user_email}", delay: 500 },
        { type: "fill_form", target: "#password", value: "{user_password}", delay: 500 },
        { type: "click_element", target: "#submit", value: "", delay: 1000 }
      ];
      
      actions.forEach((action, index) => {
        setTimeout(() => {
          if (isRecording && !isPaused) {
            setRecordedSteps(prev => [...prev, {
              id: `step${Date.now()}_${index}`,
              ...action
            }]);
          }
        }, (index + 1) * 2000);
      });
    };
    
    simulateRecording();
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleSave = () => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      trigger: { type: "manual", value: "" },
      steps: recordedSteps,
      is_active: true,
      tags: ["recorded"]
    };
    onComplete(workflow);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isRecording ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'
            }`}>
              <Circle className={`w-5 h-5 text-white ${isRecording ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gravador de Workflow</h2>
              <p className="text-sm text-gray-500">
                {isRecording ? (isPaused ? 'Pausado' : 'Gravando...') : 'Pronto para gravar'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Recording Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Controles de Gravação</span>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                  <Clock className="w-4 h-4" />
                  {formatTime(recordingTime)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Gravação
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseRecording} variant="outline">
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? 'Continuar' : 'Pausar'}
                    </Button>
                    <Button onClick={stopRecording} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      Parar
                    </Button>
                  </>
                )}
              </div>
              
              {isRecording && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Gravando suas ações!</strong> Execute as ações que deseja automatizar. 
                    Cada clique, digitação e navegação será capturada.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workflow-name">Nome do Workflow</Label>
              <Input
                id="workflow-name"
                placeholder="Ex: Login no Sistema"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workflow-description">Descrição</Label>
              <Input
                id="workflow-description"
                placeholder="O que este workflow faz?"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Recorded Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Capturadas ({recordedSteps.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {recordedSteps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MousePointer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma ação capturada ainda</p>
                  <p className="text-sm">Inicie a gravação para capturar suas ações</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordedSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        {step.type === 'click_element' ? (
                          <MousePointer className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Keyboard className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {step.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-500">
                          {step.target} {step.value && `→ "${step.value}"`}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {step.delay}ms
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={recordedSteps.length === 0 || !workflowName}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Workflow
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
import React, { useState, useEffect } from "react";
import { CodeEditor as CodeEditorEntity, User, Workspace } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Save, 
  Plus, 
  Trash2, 
  Play, 
  FileText,
  Shield,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function CodeEditor() {
  const [currentUser, setCurrentUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [codeEditor, setCodeEditor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [fileType, setFileType] = useState("javascript");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Assumir que há um workspace selecionado (em produção, isso viria do contexto)
      const workspaces = await Workspace.filter({ owner_id: user.id });
      if (workspaces.length > 0) {
        const currentWorkspace = workspaces[0];
        setWorkspace(currentWorkspace);
        
        // Verificar se o usuário tem acesso ao editor de código
        if (currentWorkspace.settings?.code_editing) {
          let editorData = await CodeEditorEntity.filter({ workspace_id: currentWorkspace.id });
          
          if (editorData.length === 0) {
            // Criar configuração inicial do editor
            editorData = [await CodeEditorEntity.create({
              workspace_id: currentWorkspace.id,
              authorized_emails: [user.email],
              code_files: [],
              custom_functions: []
            })];
          }
          
          setCodeEditor(editorData[0]);
          setIsAuthorized(editorData[0].authorized_emails.includes(user.email));
        }
      }
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
    }
    setIsLoading(false);
  };

  const createFile = async () => {
    if (!newFileName || !codeEditor) return;
    
    const newFile = {
      filename: newFileName,
      content: getDefaultContent(fileType),
      type: fileType,
      last_modified: new Date().toISOString(),
      modified_by: currentUser.email
    };
    
    const updatedFiles = [...(codeEditor.code_files || []), newFile];
    
    await CodeEditorEntity.update(codeEditor.id, {
      code_files: updatedFiles
    });
    
    setCodeEditor(prev => ({
      ...prev,
      code_files: updatedFiles
    }));
    
    setSelectedFile(newFile);
    setNewFileName("");
  };

  const saveFile = async (content) => {
    if (!selectedFile || !codeEditor) return;
    
    const updatedFiles = codeEditor.code_files.map(file =>
      file.filename === selectedFile.filename
        ? {
            ...file,
            content,
            last_modified: new Date().toISOString(),
            modified_by: currentUser.email
          }
        : file
    );
    
    await CodeEditorEntity.update(codeEditor.id, {
      code_files: updatedFiles
    });
    
    setCodeEditor(prev => ({
      ...prev,
      code_files: updatedFiles
    }));
    
    setSelectedFile(prev => ({
      ...prev,
      content,
      last_modified: new Date().toISOString(),
      modified_by: currentUser.email
    }));
  };

  const deleteFile = async (filename) => {
    if (!codeEditor) return;
    
    const updatedFiles = codeEditor.code_files.filter(file => file.filename !== filename);
    
    await CodeEditorEntity.update(codeEditor.id, {
      code_files: updatedFiles
    });
    
    setCodeEditor(prev => ({
      ...prev,
      code_files: updatedFiles
    }));
    
    if (selectedFile?.filename === filename) {
      setSelectedFile(null);
    }
  };

  const addAuthorizedEmail = async (email) => {
    if (!codeEditor) return;
    
    const updatedEmails = [...codeEditor.authorized_emails, email];
    
    await CodeEditorEntity.update(codeEditor.id, {
      authorized_emails: updatedEmails
    });
    
    setCodeEditor(prev => ({
      ...prev,
      authorized_emails: updatedEmails
    }));
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'javascript':
        return `// Função customizada do Merlin
function customFunction(params) {
  // Sua lógica aqui
  return params;
}

// Exportar para uso nas automações
window.MerlinCustom = window.MerlinCustom || {};
window.MerlinCustom.customFunction = customFunction;`;
      case 'css':
        return `/* Estilos customizados do Merlin */
.merlin-custom {
  /* Seus estilos aqui */
}`;
      case 'html':
        return `<!-- Template HTML customizado -->
<div class="merlin-template">
  <!-- Seu conteúdo aqui -->
</div>`;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar o editor de código. 
              Entre em contato com o administrador do workspace.
            </p>
            <Badge variant="outline" className="text-red-600">
              Email não autorizado: {currentUser?.email}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Código</h1>
          <p className="text-gray-600">Desenvolvimento customizado para automações</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-purple-100 text-purple-800">
            <Code className="w-3 h-3 mr-1" />
            Modo Desenvolvedor
          </Badge>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2 text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Use com cuidado - alterações afetam toda a aplicação</span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* File Explorer */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arquivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New File */}
              <div className="space-y-2">
                <Input
                  placeholder="Nome do arquivo"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Select value={fileType} onValueChange={setFileType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={createFile} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-1">
                {codeEditor?.code_files?.map((file) => (
                  <div
                    key={file.filename}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedFile?.filename === file.filename 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.filename}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.filename);
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-3">
          {selectedFile ? (
            <Card className="h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{selectedFile.filename}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedFile.type}</Badge>
                  <Button
                    onClick={() => saveFile(selectedFile.content)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <Textarea
                  value={selectedFile.content}
                  onChange={(e) => setSelectedFile(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                  className="h-full border-0 rounded-none font-mono text-sm resize-none"
                  placeholder="Digite seu código aqui..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhum arquivo selecionado</h3>
                <p>Selecione um arquivo da lista ou crie um novo</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
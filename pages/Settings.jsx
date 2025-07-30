import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon,
  Bell, 
  Shield, 
  Palette,
  Save,
  KeyRound
} from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      desktop: true,
      email: false,
    },
    appearance: {
      theme: "light",
      accentColor: "#78BE20"
    },
    security: {
      twoFactorAuth: false
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        // Em um app real, as configurações seriam carregadas do User.meta ou entidade de Settings
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({ 
      ...prev, 
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  
  const handleSave = async () => {
    // Aqui você salvaria as configurações no banco de dados
    // await User.updateMyUserData({ settings });
    alert("Configurações salvas!");
  }

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie seu perfil e preferências da aplicação.</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon /> Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input id="fullName" value={currentUser.full_name} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={currentUser.email} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette/> Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <Label>Cor de Destaque</Label>
                  <div className="flex gap-3 mt-2">
                    {['#78BE20', '#3B82F6', '#8B5CF6', '#F59E0B'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          settings.appearance.accentColor === color ? 'border-gray-800' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingChange('appearance', 'accentColor', color)}
                      />
                    ))}
                  </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell/> Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop-notifications">Notificações no Desktop</Label>
                <Switch 
                  id="desktop-notifications" 
                  checked={settings.notifications.desktop} 
                  onCheckedChange={(val) => handleSettingChange('notifications', 'desktop', val)}
                />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <Switch 
                  id="email-notifications"
                  checked={settings.notifications.email} 
                  onCheckedChange={(val) => handleSettingChange('notifications', 'email', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield/> Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Autenticação de Dois Fatores (2FA)</Label>
                <Switch 
                  id="two-factor"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(val) => handleSettingChange('security', 'twoFactorAuth', val)}
                />
              </div>
               <div>
                <Button variant="outline"><KeyRound className="w-4 h-4 mr-2" /> Alterar Senha</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="green-gradient text-white" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
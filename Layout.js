import React, { useEffect, useState } from "react";
import { User } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles,
  Menu,
  X,
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  Workflow
} from "lucide-react";

import MagicalPopup from "@/Pages/MagicalPopup";

export default function Layout({ children, currentPageName }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUser();
    setupGlobalListeners();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("Usuário não logado");
    }
  };

  const setupGlobalListeners = () => {
    // Listener para comando global (//m)
    let commandBuffer = '';
    let lastInputTime = 0;

    const handleKeyPress = (e) => {
      const now = Date.now();
      
      // Reset buffer se passou muito tempo
      if (now - lastInputTime > 1000) {
        commandBuffer = '';
      }
      
      lastInputTime = now;
      commandBuffer += e.key;
      
      // Verificar comando //m
      if (commandBuffer.includes('//m')) {
        e.preventDefault();
        setShowPopup(true);
        commandBuffer = '';
        
        // Limpar os caracteres digitados
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
          const value = activeElement.value || activeElement.textContent || '';
          const newValue = value.replace('//m', '');
          if (activeElement.value !== undefined) {
            activeElement.value = newValue;
          } else {
            activeElement.textContent = newValue;
          }
        }
      }
      
      // Manter apenas os últimos 10 caracteres
      if (commandBuffer.length > 10) {
        commandBuffer = commandBuffer.slice(-10);
      }
    };

    // ESC para fechar popup
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPopup) {
        setShowPopup(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keydown', handleEscape);
    };
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "Dashboard" },
    { icon: FileText, label: "Templates", href: "Templates" },
    { icon: Users, label: "Equipes", href: "Teams" },
    { icon: Workflow, label: "Automações", href: "Automations" },
    { icon: BarChart3, label: "Analytics", href: "Analytics" },
    { icon: Settings, label: "Configurações", href: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <style>
        {`
          .green-gradient {
            background: linear-gradient(135deg, #78BE20 0%, #6BA518 100%);
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .magical-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .magical-popup {
            background: white;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 600px;
            width: 90vw;
            max-height: 80vh;
            overflow: hidden;
          }
          
          .floating-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #78BE20 0%, #6BA518 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(120, 190, 32, 0.3);
            transition: all 0.3s ease;
            animation: pulse 3s infinite;
          }
          
          .floating-trigger:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 35px rgba(120, 190, 32, 0.4);
          }
          
          @keyframes pulse {
            0%, 100% { 
              box-shadow: 0 10px 25px rgba(120, 190, 32, 0.3), 0 0 0 0 rgba(120, 190, 32, 0.7); 
            }
            50% { 
              box-shadow: 0 10px 25px rgba(120, 190, 32, 0.3), 0 0 0 10px rgba(120, 190, 32, 0); 
            }
          }
          
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar-item {
            transition: all 0.2s ease;
          }
          
          .sidebar-item:hover {
            background: rgba(120, 190, 32, 0.1);
            border-radius: 8px;
          }
          
          .sidebar-item.active {
            background: linear-gradient(135deg, #78BE20 0%, #6BA518 100%);
            color: white;
            border-radius: 8px;
          }
        `}
      </style>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 glass-effect shadow-xl sidebar lg:translate-x-0 ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 green-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Merlin</h1>
              <p className="text-xs text-gray-500">Assistente de Produtividade</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={createPageUrl(item.href)}
                className={`flex items-center gap-3 px-3 py-3 text-gray-700 sidebar-item ${
                  currentPageName === item.href ? 'active text-white' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 green-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentUser.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => User.login()}
              className="w-full green-gradient text-white py-3 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
            >
              Entrar
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {children}
      </div>

      {/* Floating Trigger Button */}
      <button
        className="floating-trigger"
        onClick={() => setShowPopup(true)}
        title="Abrir Merlin (digite //m em qualquer lugar)"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Magical Popup */}
      {showPopup && (
        <MagicalPopup onClose={() => setShowPopup(false)} />
      )}

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
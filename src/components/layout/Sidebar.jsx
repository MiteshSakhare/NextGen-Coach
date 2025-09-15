import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Briefcase,
  Settings,
  Heart,
  Brain,
  Zap,
  Target,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-purple-500' },
  { id: 'resume', label: 'Resume Analyzer', icon: FileText, gradient: 'from-green-500 to-blue-500' },
  { id: 'interview', label: 'Interview Simulator', icon: MessageSquare, gradient: 'from-purple-500 to-pink-500' },
  { id: 'jobs', label: 'Job Matcher', icon: Briefcase, gradient: 'from-orange-500 to-red-500' },
  { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-gray-600' },
];

// Ultra Modern NextGen Logo
const UltraModernLogo = () => (
  <div className="flex items-center group">
    <motion.div
      className="relative w-10 h-10 sm:w-12 sm:h-12"
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="relative z-10"
          initial={{ rotateY: 0 }}
          whileHover={{ rotateY: 360 }}
          transition={{ duration: 0.8 }}
        >
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 border-2 border-white/30 rounded-xl sm:rounded-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <motion.div
        className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
        animate={{ 
          scale: [1, 1.2, 1],
          boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 4px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)']
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Zap className="h-1.5 w-1.5 text-white" />
      </motion.div>
    </motion.div>

    <div className="ml-3 sm:ml-4">
      <motion.h1 
        className="text-lg sm:text-xl font-black leading-tight"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.span
          className="bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        >
          NextGen Coach
        </motion.span>
      </motion.h1>
      <motion.p 
        className="text-xs text-gray-500 font-bold tracking-wider uppercase hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Career Platform
      </motion.p>
    </div>
  </div>
);

// Mobile Header Component (replaces duplicate hamburger)
const MobileHeader = ({ currentTab, setTab, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = (tabId) => {
    setTab(tabId);
    setIsOpen(false);
  };

  const getCurrentTabLabel = () => {
    const currentItem = menuItems.find(item => item.id === currentTab);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </motion.button>
            
            <UltraModernLogo />
          </div>

          {/* Right: Current Page Title */}
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">
              {getCurrentTabLabel()}
            </h2>
            <div className="flex items-center sm:hidden">
              {menuItems.find(item => item.id === currentTab)?.icon && 
                React.createElement(menuItems.find(item => item.id === currentTab).icon, {
                  className: "h-6 w-6 text-gray-700"
                })
              }
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <UltraModernLogo />
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
                
                {/* Navigation Items */}
                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-blue-700 shadow-lg scale-105 border border-blue-100/50'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <motion.div 
                          className={`p-2.5 rounded-xl mr-3 transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                              : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
                          }`}
                          whileHover={!isActive ? { scale: 1.1 } : {}}
                        >
                          <Icon className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                        </motion.div>
                        <span className="flex-1 text-left">{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            layoutId="mobileActiveIndicator"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
                
                {/* Footer */}
                <motion.div
                  className="mt-8 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Heart className="h-4 w-4 text-red-500" />
                      </motion.div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">NextGen Coach</p>
                        <p className="text-xs text-gray-600">v3.0 • AI Powered</p>
                      </div>
                    </div>
                    
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`p-1.5 rounded-md transition-all duration-200 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} shadow-md` 
                    : 'bg-transparent'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-current'
                  }`} />
                </div>
                <span className="text-xs font-medium mt-1 truncate w-full text-center">
                  {item.label.split(' ')[0]}
                </span>
                
                {isActive && (
                  <motion.div
                    className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"
                    layoutId="bottomActiveIndicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export function Sidebar() {
  const { currentTab, setTab } = useApp();

  return (
    <>
      {/* Mobile Navigation */}
      <MobileHeader currentTab={currentTab} setTab={setTab} menuItems={menuItems} />
      
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl">
          {/* Ultra Modern Logo */}
          <motion.div
            className="flex items-center flex-shrink-0 px-6 py-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <UltraModernLogo />
          </motion.div>
          
          {/* Navigation */}
          <div className="mt-8 flex-grow flex flex-col px-4">
            <nav className="flex-1 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-blue-700 shadow-xl scale-105 border border-blue-100/50 backdrop-blur-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102 hover:shadow-md'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.4 }}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div 
                      className={`p-2.5 rounded-xl mr-3 transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                          : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-100'
                      }`}
                      whileHover={!isActive ? { scale: 1.1 } : {}}
                    >
                      <Icon className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </motion.div>
                    <span className="flex-1 text-left">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
            
            {/* Enhanced Footer */}
            <motion.div
              className="flex-shrink-0 p-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border border-blue-200/30 backdrop-blur-sm">
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, #3B82F6 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, #8B5CF6 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 0%, #3B82F6 0%, transparent 50%)'
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">NextGen Coach</p>
                      <p className="text-xs text-gray-600">v3.0 • AI Powered</p>
                    </div>
                  </div>
                  
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

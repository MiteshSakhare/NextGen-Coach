import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ ADDED: Missing AnimatePresence
import { X } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export function MobileDrawer() {
  const { sidebarOpen, setSidebar, currentTab, setTab } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'resume', label: 'Resume Analyzer', icon: '📄' },
    { id: 'interview', label: 'Interview Simulator', icon: '💬' },
    { id: 'jobs', label: 'Job Matcher', icon: '💼' },
  ];

  const handleItemClick = (itemId) => {
    setTab(itemId);
    setSidebar(false);
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
          />
          
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setSidebar(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`p-4 rounded-xl text-center transition-colors ${
                      currentTab === item.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium">{item.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

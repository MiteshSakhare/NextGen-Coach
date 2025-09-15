import React from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { useApp } from '../../hooks/useApp';

export function Layout({ children }) {
  const { toggleSidebar } = useApp();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <MobileDrawer />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden lg:ml-64">
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h1 className="text-lg font-semibold text-gray-900">AI Career Coach</h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

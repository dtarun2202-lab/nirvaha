import React, { useState } from 'react';
import { BarChart3, Settings, LogOut, Menu, X, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { SuccessStoriesManager } from '../components/admin/SuccessStoriesManager';
import { WellnessRetreatsManager } from '../components/admin/WellnessRetreatsManager';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('success-stories');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'success-stories',
      label: 'Success Stories Manager',
      icon: <BarChart3 className="w-5 h-5" />,
      component: <SuccessStoriesManager />
    },
    {
      id: 'wellness-retreats',
      label: 'Wellness Retreats',
      icon: <Compass className="w-5 h-5" />,
      component: <WellnessRetreatsManager />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      component: (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#0F131A]">Settings</h2>
          <p className="text-gray-500 mt-4">Coming soon...</p>
        </div>
      )
    }
  ];

  const activeItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="flex h-screen bg-[#EEF7F1]">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-[#1a5d47] text-white transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-emerald-600">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
              <span className="text-[#1a5d47] font-bold">N</span>
            </div>
            Nirvaha Admin
          </h1>
          <p className="text-emerald-100 text-xs mt-2">Standalone Modules</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-500 text-white'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600">
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-100 hover:bg-emerald-700 transition-all">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-[#1a5d47]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1a5d47]" />
              )}
            </button>
            <h2 className="text-xl font-bold text-[#0F131A]">
              {activeItem?.label}
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            Admin Panel • {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeItem?.component}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
        />
      )}
    </div>
  );
}

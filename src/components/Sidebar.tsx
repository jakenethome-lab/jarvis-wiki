'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const agents = [
    { name: '홈', id: '', icon: '🏠' },
    { name: '부동산', id: 'real-estate', icon: '🏙️' },
    { name: '베라모드', id: 'beramode', icon: '⚔️' },
    { name: '아수라', id: 'asura', icon: '👹' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-lg font-bold flex items-center gap-2">
          <span>🦾</span> Jarvis Wiki
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out z-40
        w-64 bg-slate-900 text-white h-screen p-4 flex flex-col border-r border-slate-800
      `}>
        <div className="hidden md:flex text-xl font-bold mb-8 items-center gap-2">
          <span>🦾</span> Jarvis Wiki
        </div>
        
        <nav className="flex-1 space-y-2 mt-4 md:mt-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={agent.id ? `/agents/${agent.id}` : '/'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>{agent.icon}</span>
              {agent.name}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          Connected to Jarvis Main
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;

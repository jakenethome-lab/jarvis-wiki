'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const agents = [
    { name: '홈', id: '', icon: '🏠' },
    { name: '자비스', id: 'jarvis', icon: '🤖' },
    { name: '부동산', id: 'real-estate', icon: '🏙️' },
    { name: '베라모드', id: 'beramode', icon: '⚔️' },
    { name: '아수라', id: 'asura', icon: '👹' },
    { name: '지그문트', id: 'sigmund', icon: '🧠' },
    { name: '에르메스', id: 'hermes', icon: '🪽' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-lg font-bold flex items-center gap-2">
          <span>🦾</span> Jarvis Wiki
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out z-40
        w-64 bg-slate-900 dark:bg-slate-950 text-white h-screen p-4 flex flex-col border-r border-slate-800
      `}>
        <div className="hidden md:flex justify-between items-center mb-8">
          <div className="text-xl font-bold flex items-center gap-2">
            <span>🦾</span> Jarvis Wiki
          </div>
          <button onClick={toggleTheme} className="p-2 hover:bg-slate-800 rounded-full transition-colors bg-slate-800/50">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">에이전트 카테고리</div>
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={agent.id ? `/agents/${agent.id}` : '/'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600/20 hover:text-blue-400 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{agent.icon}</span>
              <span className="font-medium">{agent.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <div className="px-3 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Status</p>
            <p className="text-xs text-slate-300">Connected to Mac Mini</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;

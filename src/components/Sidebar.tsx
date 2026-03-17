import React from 'react';

const Sidebar = () => {
  const agents = [
    { name: '부동산', id: 'real-estate', icon: '🏠' },
    { name: '베라모드', id: 'beramode', icon: '⚔️' },
    { name: '아수라', id: 'asura', icon: '👹' },
  ];

  return (
    <div className="hidden md:flex w-64 bg-slate-900 text-white h-screen p-4 flex-col border-r border-slate-800">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <span>🦾</span> Jarvis Wiki
      </div>
      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Agents</div>
        {agents.map((agent) => (
          <a
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>{agent.icon}</span>
            {agent.name}
          </a>
        ))}
      </nav>
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
        Connected to Jarvis Main
      </div>
    </div>
  );
};

export default Sidebar;

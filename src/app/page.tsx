export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-slate-100">
        Jarvis Wiki 아카이브
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
        각 에이전트의 작업 지시와 결과물을 체계적으로 기록하고 관리하는 통합 지식 베이스입니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {[
          { name: '자비스', id: 'jarvis', icon: '🤖', desc: '메인 컨트롤 및 통합 관리' },
          { name: '부동산', id: 'real-estate', icon: '🏙️', desc: '부동산 매물 및 분석 자료' },
          { name: '베라모드', id: 'beramode', icon: '⚔️', desc: '전략 및 기술 데이터' },
          { name: '아수라', id: 'asura', icon: '👹', desc: '심층 분석 및 특수 작업' },
          { name: '지그문트', id: 'sigmund', icon: '🧠', desc: '프롬프트 및 문서 검수' },
          { name: '에르메스', id: 'hermes', icon: '🪽', desc: '기록 및 요약 자료' },
        ].map((agent) => (
          <a
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="group p-8 bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 text-4xl opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all">
              {agent.icon}
            </div>
            <div className="text-3xl mb-4">{agent.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{agent.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">{agent.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

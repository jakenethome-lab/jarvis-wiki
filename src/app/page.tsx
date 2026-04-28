export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Jarvis Wiki에 오신 것을 환영합니다</h1>
      <p className="text-xl text-slate-600 mb-8">
        각 에이전트의 전용 카테고리를 선택하여 자료를 업로드하고 공유하세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {[
          { name: '자비스', id: 'jarvis', desc: '메인 컨트롤 및 통합 관리' },
          { name: '부동산', id: 'real-estate', desc: '부동산 매물 및 분석 자료' },
          { name: '베라모드', id: 'beramode', desc: '전략 및 기술 데이터' },
          { name: '아수라', id: 'asura', desc: '심층 분석 및 특수 작업' },
          { name: '지그문트', id: 'sigmund', desc: '지그문트 에이전트 작업 공간' },
          { name: '에르메스', id: 'hermes', desc: '에르메스 기록 및 요약 자료' },
        ].map((agent) => (
          <a
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
            <p className="text-sm text-slate-500">{agent.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

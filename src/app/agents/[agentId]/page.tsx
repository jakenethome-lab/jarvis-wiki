"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const agentNames: Record<string, string> = {
    "real-estate": "부동산",
    "beramode": "베라모드",
    "asura": "아수라"
  };

  const agentName = agentNames[agentId] || agentId;

  const [files, setFiles] = useState<{name: string, type: string, size: string, date: string}[]>([
    { name: "예시_문서.pdf", type: "pdf", size: "1.2MB", date: "2026-03-17" },
    { name: "분석_결과.xlsx", type: "xlsx", size: "850KB", date: "2026-03-17" },
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{agentName} 카테고리</h1>
          <p className="text-slate-500 mt-1">{agentName} 에이전트 전용 작업 공간입니다.</p>
        </div>
        <button 
          onClick={() => alert("파일 업로드 기능은 서버 연동 후 활성화됩니다.")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          파일 업로드
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">파일명</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">종류</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">크기</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">날짜</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{file.name}</td>
                  <td className="px-6 py-4 text-slate-500 uppercase text-sm">{file.type}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{file.size}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{file.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline text-sm font-medium">다운로드</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {files.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              업로드된 파일이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

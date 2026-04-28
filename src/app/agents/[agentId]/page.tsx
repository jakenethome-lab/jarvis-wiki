"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const agentNames: Record<string, string> = {
    "real-estate": "부동산",
    "beramode": "베라모드",
    "asura": "아수라",
    "sigmund": "지그문트",
    "hermes": "에르메스"
  };

  const agentName = agentNames[agentId] || agentId;

  const [files, setFiles] = useState<{name: string, path?: string, url: string, size: number, uploadedAt: string, type?: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, content: string} | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [agentId]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/files?agentId=${agentId}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const viewContent = async (file: {name: string, url: string, type?: string}) => {
    if (file.type === 'local' || file.name.endsWith('.md')) {
      setLoadingContent(true);
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const content = await response.text();
          setSelectedFile({ name: file.name, content });
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoadingContent(false);
      }
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agentId", agentId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchFiles();
      } else {
        alert("업로드 실패");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 중 오류 발생");
    } finally {
      setUploading(false);
    }
  };

  // Group files by date
  const groupedFiles = files.reduce((acc, file) => {
    const date = new Date(file.uploadedAt).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const sortedDates = Object.keys(groupedFiles).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{agentName} 카테고리</h1>
          <p className="text-slate-500 mt-1">{agentName} 에이전트 전용 작업 공간입니다.</p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block text-center w-full md:w-auto ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? "업로드 중..." : "파일 업로드"}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sortedDates.length > 0 ? sortedDates.map(date => (
          <div key={date} className="space-y-3">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              {date}
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-slate-500 uppercase">파일명</th>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupedFiles[date].map((file, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            {file.path && file.path.includes('/') && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                                {file.path.split('/')[0]}
                              </span>
                            )}
                            <span className="font-medium text-slate-900 break-all">{file.name}</span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(file.uploadedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button 
                          onClick={() => viewContent(file)}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          {file.type === 'local' || file.name.endsWith('.md') ? '보기' : '다운로드'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )) : !uploading && (
          <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            업로드된 파일이 없습니다.
          </div>
        )}

        {/* Content Viewer */}
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedFile(null)}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 truncate mr-4">{selectedFile.name}</h3>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="bg-white border border-slate-200 px-3 py-1 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  닫기
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-base">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {loadingContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">내용을 불러오는 중입니다...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

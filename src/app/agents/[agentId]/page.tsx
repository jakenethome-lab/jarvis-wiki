"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const agentNames: Record<string, string> = {
    "jarvis": "자비스",
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
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

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

  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      const response = await fetch("/api/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, folderName: newFolderName }),
      });
      if (response.ok) {
        setNewFolderName("");
        setIsCreatingFolder(false);
        fetchFiles();
      } else {
        alert("폴더 생성 실패");
      }
    } catch (error) {
      alert("오류 발생");
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
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (response.ok) await fetchFiles();
      else alert("업로드 실패");
    } catch (error) {
      alert("업로드 중 오류 발생");
    } finally {
      setUploading(false);
    }
  };

  const groupedFiles = files.reduce((acc, file) => {
    const date = new Date(file.uploadedAt).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const sortedDates = Object.keys(groupedFiles).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{agentName}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">에이전트 전용 작업 아카이브</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreatingFolder(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <span>📁</span> 폴더 생성
          </button>
          <div className="relative">
            <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={uploading} />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer bg-blue-600 dark:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-blue-600/20 transition-all inline-block text-center text-sm ${uploading ? 'opacity-50' : ''}`}
            >
              {uploading ? "업로드 중..." : "새 파일 업로드"}
            </label>
          </div>
        </div>
      </div>

      {isCreatingFolder && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex flex-col md:flex-row gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex-1 w-full">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">새 폴더 이름 (예: 프로젝트명)</p>
            <input 
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200"
              placeholder="폴더명을 입력하세요..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-auto">
            <button onClick={createFolder} className="flex-1 md:flex-none px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:opacity-90 transition-colors">생성</button>
            <button onClick={() => setIsCreatingFolder(false)} className="flex-1 md:flex-none px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">취소</button>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {sortedDates.length > 0 ? sortedDates.map(date => (
          <div key={date} className="group">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 mb-4">
              <span className="w-1.5 h-8 bg-blue-600 dark:bg-blue-500 rounded-full group-hover:h-10 transition-all"></span>
              {date}
            </h2>
            <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">문서 정보</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {groupedFiles[date].map((file, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group/row">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            {file.path && file.path.includes('/') && (
                              <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                {file.path.split('/')[0]}
                              </span>
                            )}
                            <span className="font-bold text-slate-900 dark:text-slate-200 text-lg group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">{file.name}</span>
                          </div>
                          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                            {new Date(file.uploadedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} • {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => viewContent(file)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 transition-all shadow-sm"
                        >
                          {file.type === 'local' || file.name.endsWith('.md') ? '문서 보기' : '다운로드'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )) : !uploading && (
          <div className="py-32 text-center border-4 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[40px]">
            <span className="text-6xl mb-6 block opacity-50">📂</span>
            <p className="text-slate-400 dark:text-slate-600 font-bold text-xl">아직 업로드된 문서가 없습니다.</p>
          </div>
        )}

        {/* Content Viewer Modal */}
        {selectedFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedFile(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden w-full max-w-5xl h-full max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4 truncate">
                  <span className="text-2xl">📄</span>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl truncate">{selectedFile.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-2xl text-sm font-black text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all active:scale-95"
                >
                  닫기
                </button>
              </div>
              <div className="p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-300 leading-relaxed text-lg">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {loadingContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-2xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-900 dark:text-slate-100 font-black">문서를 해독 중입니다...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

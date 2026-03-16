"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  const agentNames: Record<string, string> = {
    "real-estate": "부동산",
    "beramode": "베라모드",
    "asura": "아수라"
  };

  const agentName = agentNames[agentId] || agentId;

  const [files, setFiles] = useState<{name: string, url: string, size: number, uploadedAt: string}[]>([]);
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
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
            className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? "업로드 중..." : "파일 업로드"}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">파일명</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{file.name}</td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      다운로드
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {files.length === 0 && !uploading && (
            <div className="py-12 text-center text-slate-400">
              업로드된 파일이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

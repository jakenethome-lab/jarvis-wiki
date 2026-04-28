import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";

function getFilesRecursively(dir: string, baseDir: string, folderName: string): any[] {
  const files: any[] = [];
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, baseDir, folderName));
    } else if (item.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        name: item,
        path: relativePath,
        url: `/api/content?path=${folderName}/${relativePath}`,
        size: stats.size,
        uploadedAt: stats.mtime.toISOString(),
        type: 'local'
      });
    }
  }
  return files;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
    }

    // 1. KV(Vercel Blob) 파일 목록 가져오기
    let parsedKvFiles = [];
    try {
      const kvFiles = await kv.lrange(`files:${agentId}`, 0, -1);
      parsedKvFiles = kvFiles.map((f: any) => typeof f === 'string' ? JSON.parse(f) : f);
    } catch (kvError) {
      console.error("KV fetch error:", kvError);
    }

    // 2. 로컬(content 폴더) 파일 목록 가져오기
    const idMapping: Record<string, string> = {
      "real-estate": "realestate",
      "beramode": "veramode",
      "asura": "asura",
      "sigmund": "sigmund",
      "hermes": "hermes",
      "general": "general"
    };

    const folderName = idMapping[agentId] || agentId;
    const contentPath = path.join(process.cwd(), 'content', folderName);
    
    const localFiles = getFilesRecursively(contentPath, contentPath, folderName);

    // 3. 합치기 (최신순)
    const allFiles = [...localFiles, ...parsedKvFiles].sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

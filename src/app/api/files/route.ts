import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";

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
      // KV 에러가 나더라도 로컬 파일은 보여줄 수 있도록 진행
    }

    // 2. 로컬(content 폴더) 파일 목록 가져오기
    const idMapping: Record<string, string> = {
      "real-estate": "realestate",
      "beramode": "veramode",
      "asura": "asura",
      "general": "general"
    };

    const folderName = idMapping[agentId] || agentId;
    const contentPath = path.join(process.cwd(), 'content', folderName);
    const localFiles = [];

    if (fs.existsSync(contentPath)) {
      const filenames = fs.readdirSync(contentPath);
      for (const filename of filenames) {
        if (filename.endsWith('.md')) {
          const stats = fs.statSync(path.join(contentPath, filename));
          localFiles.push({
            name: filename,
            url: `/api/content?path=${folderName}/${filename}`,
            size: stats.size,
            uploadedAt: stats.mtime.toISOString(),
            type: 'local'
          });
        }
      }
    }

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

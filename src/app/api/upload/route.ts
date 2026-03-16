import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const agentId = formData.get("agentId") as string;

  if (!file || !agentId) {
    return NextResponse.json({ error: "Missing file or agentId" }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
  });

  // KV에 파일 정보 저장 (에이전트별 리스트 관리)
  const fileInfo = {
    name: file.name,
    url: blob.url,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };

  await kv.lpush(`files:${agentId}`, JSON.stringify(fileInfo));

  return NextResponse.json(blob);
}

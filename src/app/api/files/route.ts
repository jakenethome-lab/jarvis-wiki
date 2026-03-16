import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
  }

  const files = await kv.lrange(`files:${agentId}`, 0, -1);
  const parsedFiles = files.map((f: any) => typeof f === 'string' ? JSON.parse(f) : f);

  return NextResponse.json({ files: parsedFiles });
}

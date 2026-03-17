import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    const fullPath = path.join(process.cwd(), 'content', filePath);
    
    // 경로 조작 방지 (보안)
    if (!fullPath.startsWith(path.join(process.cwd(), 'content'))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // MD 파일은 JSON으로 반환하거나 텍스트로 반환
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, folderName } = body;

    console.log("Folder creation request:", { agentId, folderName });

    if (!agentId || !folderName) {
      return NextResponse.json({ error: "Missing agentId or folderName" }, { status: 400 });
    }

    const idMapping: Record<string, string> = {
      "jarvis": "jarvis",
      "real-estate": "realestate",
      "beramode": "veramode",
      "asura": "asura",
      "sigmund": "sigmund",
      "hermes": "hermes",
    };

    const targetBase = idMapping[agentId] || agentId;
    
    // content 폴더 내에 에이전트 폴더가 없는 경우 대비
    const agentBasePath = path.join(process.cwd(), 'content', targetBase);
    if (!fs.existsSync(agentBasePath)) {
      fs.mkdirSync(agentBasePath, { recursive: true });
    }

    const newFolderPath = path.join(agentBasePath, folderName);

    console.log("Target path:", newFolderPath);

    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true });
      // .gitkeep 파일을 생성하여 빈 폴더도 Git에 추적되도록 함
      fs.writeFileSync(path.join(newFolderPath, '.gitkeep'), '');
    }

    return NextResponse.json({ success: true, path: newFolderPath });
  } catch (error: any) {
    console.error("Folder creation error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

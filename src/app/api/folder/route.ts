import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { agentId, folderName } = await request.json();

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
    const newFolderPath = path.join(process.cwd(), 'content', targetBase, folderName);

    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

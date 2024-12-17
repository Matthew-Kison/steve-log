import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { filename, content } = await req.json();

    if (!filename || !content) {
      return NextResponse.json(
        { error: "파일명과 내용이 필요합니다." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "posts", `${filename}.md`);

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({ message: "파일이 저장되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "파일 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

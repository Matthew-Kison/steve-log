"use client";

import TiptapEdidtor from "@/_components/tiptap-editor";
import React, { useState } from "react";

const EditorPage: React.FC = () => {
  const [filename, setFilename] = useState("");

  const handleSave = async (content: string) => {
    if (!filename) {
      alert("파일명을 입력하세요!");
      return;
    }

    const response = await fetch("/api/saveMarkdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename, content }),
    });

    if (response.ok) {
      alert("파일이 성공적으로 저장되었습니다!");
    } else {
      const errorData = await response.json();
      alert(`오류 발생: ${errorData.error}`);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="파일명 입력"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <TiptapEdidtor onSave={handleSave} />
    </div>
  );
};

export default EditorPage;

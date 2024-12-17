"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EditorProps {
  onSave: (content: string) => void;
}

const TiptapEdidtor: React.FC<EditorProps> = ({ onSave }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>여기에 글을 작성하세요...</p>",
  });

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave(content);
    }
  };

  if (!editor) {
    return null; // Editor가 로드되지 않았을 경우 대비
  }

  return (
    <div>
      {/* 컨트롤 패널 */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`py-1 px-3 rounded ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`py-1 px-3 rounded ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`py-1 px-3 rounded ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`py-1 px-3 rounded ${
            editor.isActive("paragraph")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="py-1 px-3 bg-gray-200 rounded"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="py-1 px-3 bg-gray-200 rounded"
        >
          Redo
        </button>
      </div>
      <EditorContent editor={editor} />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        저장
      </button>
    </div>
  );
};

export default TiptapEdidtor;

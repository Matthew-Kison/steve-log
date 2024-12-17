"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Node } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import FixedMenu from "@/_components/editor/fixed-menu";
import { Transaction } from "@tiptap/pm/state";

interface EditorProps {
  onSave: (content: string) => void;
}

const CustomEnterHandler = Node.create({
  name: 'customEnterHandler',

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {

        const { from } = editor.state.selection;

        // 현재 블록의 텍스트 확인
        const nodeText = editor.state.doc.textBetween(
          editor.state.selection.$from.start(),
          editor.state.selection.$from.end()
        );

        if (nodeText.trim() === '') {
          // DOM 노드 가져오기
          const domNode = editor.view.domAtPos(from).node as HTMLElement;

          if (domNode) {
            const blockRect = domNode.getBoundingClientRect();
            const position = {
              top: blockRect.bottom + window.scrollY,
              left: blockRect.left + window.scrollX,
            };

            // 트랜잭션에 메타데이터 추가
            editor.view.dispatch(
              editor.state.tr.setMeta('showContextMenu', position)
            );
          }
          return true; // 기본 Enter 동작 차단
        }

        return false; // 블록에 내용이 있으면 기본 Enter 동작
      },
    };
  },
});



const TiptapEditor: React.FC<EditorProps> = ({ onSave }) => {
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, CustomEnterHandler],
    editorProps: {
      attributes: {
        class: "prose outline-none",
      },
    },
    content: "<p>여기에 글을 작성하세요...</p>",
  });

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave(content);
    }
  };
  const closeMenu = () => setMenuPosition(null);

    // 트랜잭션 리스너를 사용해 메타데이터 읽기
    useEffect(() => {
      if (!editor) return;
  
      const handleUpdate = ({ transaction }: { transaction: Transaction }) => {
        const meta = transaction.getMeta('showContextMenu');
        if (meta) {
          setMenuPosition(meta);
        }
      };
  
      editor.on('update', handleUpdate);
      editor.on('transaction', handleUpdate);
  
      return () => {
        editor.off('update', handleUpdate);
        editor.off('transaction', handleUpdate);
      };
    }, [editor]);

    
  if (!editor) {
    return null; // Editor가 로드되지 않았을 경우 대비
  }

  return (
    <div className="relative">
      <FixedMenu editor={editor} className={""} />
      <EditorContent editor={editor} />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded prose"
      >
        저장
      </button>
      {/* Context Menu */}
      {menuPosition && (
        <div
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            background: 'white',
            border: '1px solid #ddd',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <div onClick={closeMenu} style={{ cursor: 'pointer' }}>
            Option 1
          </div>
          <div onClick={closeMenu} style={{ cursor: 'pointer' }}>
            Option 2
          </div>
          <div onClick={closeMenu} style={{ cursor: 'pointer' }}>
            Option 3
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;

"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Node } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Select, { SingleValue } from "react-select";
import { Transaction } from "@tiptap/pm/state";
import FixedMenu from "@/_components/editor/fixed-menu";

interface EditorProps {
  onSave: (content: string) => void;
}

const CustomEnterHandler = Node.create({
  name: "customEnterHandler",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { from } = editor.state.selection;

        // 현재 블록의 텍스트 확인
        const nodeText = editor.state.doc.textBetween(
          editor.state.selection.$from.start(),
          editor.state.selection.$from.end()
        );

        if (nodeText.trim() === "") {
          const domNode = editor.view.domAtPos(from).node as HTMLElement;

          if (domNode) {
            const blockRect = domNode.getBoundingClientRect();
            const position = {
              top: blockRect.bottom + window.scrollY,
              left: blockRect.left + window.scrollX,
            };

            editor.view.dispatch(
              editor.state.tr.setMeta("showContextMenu", position)
            );
          }
          return true; // 기본 Enter 동작 차단
        }

        return false; // 블록에 내용이 있으면 기본 Enter 동작
      },
    };
  },
});

interface IOption {
  value: string;
  label: string;
}
const options: IOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const TiptapEditor: React.FC<EditorProps> = ({ onSave }) => {
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, CustomEnterHandler],
    editorProps: {
      attributes: { class: "prose outline-none" },
      handleKeyDown: (_, event) => {
        // 다른 키 입력 시 메뉴 닫기
        if (menuPosition && event.key !== "ArrowDown") {
          setMenuPosition(null);
        }
        return false;
      },
    },
    content: "<p>여기에 글을 작성하세요...</p>",
  });

  useEffect(() => {
    if (!editor) return;

    const handleTransaction = ({
      transaction,
    }: {
      transaction: Transaction;
    }) => {
      const meta = transaction.getMeta("showContextMenu");
      if (meta) {
        setMenuPosition(meta);
      }
    };

    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave(content);
    }
  };

  const handleOptionChange = (selectedOption: SingleValue<IOption>) => {
    console.log("Selected Option:", selectedOption);
    setMenuPosition(null); // 옵션 선택 후 메뉴 닫기
  };

  if (!editor) return null;

  return (
    <div className="relative">
      <FixedMenu editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[300px] max-h-[500px] overflow-y-auto"
        onClick={() => editor?.commands.focus()}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded prose"
      >
        저장
      </button>

      {/* React-Select Context Menu */}
      {menuPosition && (
        <div
          style={{
            position: "absolute",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: "200px",
            zIndex: 1000,
          }}
        >
          <Select
            options={options}
            autoFocus
            menuIsOpen
            onChange={handleOptionChange}
            placeholder="Select an option"
            styles={{
              menu: (base) => ({ ...base, zIndex: 1000 }),
              control: (base) => ({ ...base, cursor: "pointer" }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;

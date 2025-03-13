import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";

const TipTapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, // Enable underline support
      TextAlign.configure({ types: ["heading", "paragraph"] }), // Enable text alignment
    ],
    content: content || "<p>Type here...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Send updated content to parent component
    },
  });

  if (!editor) return null;

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""}>
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""}>
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "active" : ""}>
          <FaUnderline />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? "active" : ""}>
          <FaAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? "active" : ""}>
          <FaAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? "active" : ""}>
          <FaAlignRight />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor}  onMouseDown={(event) => event.preventDefault()} />
    </div>
  );
};

export default TipTapEditor;

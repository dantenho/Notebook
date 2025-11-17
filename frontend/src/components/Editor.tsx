import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Table as TableIcon,
} from 'lucide-react';
import MermaidRenderer from './MermaidRenderer';

const lowlight = createLowlight(common);

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onContentUpdate?: (content: string) => void;
}

export default function Editor({ content, onChange, onContentUpdate }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none p-6',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      onContentUpdate?.(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${active ? 'bg-gray-300' : ''}`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  // Extract and render Mermaid diagrams
  const renderContentWithMermaid = () => {
    const html = editor.getHTML();
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = mermaidRegex.exec(html)) !== null) {
      // Add text before mermaid
      if (match.index > lastIndex) {
        parts.push(
          <div
            key={`text-${key++}`}
            dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }}
          />
        );
      }

      // Add mermaid diagram
      parts.push(<MermaidRenderer key={`mermaid-${key++}`} chart={match[1]} />);
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < html.length) {
      parts.push(
        <div key={`text-${key++}`} dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }} />
      );
    }

    return parts.length > 0 ? parts : null;
  };

  const mermaidContent = renderContentWithMermaid();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          <Code size={18} />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={18} />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        <MenuButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <TableIcon size={18} />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={18} />
        </MenuButton>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mermaidContent ? (
          <div className="p-6">{mermaidContent}</div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        <strong>Dica:</strong> Para criar diagramas Mermaid, use blocos de código com a sintaxe{' '}
        <code className="bg-gray-200 px-1 rounded">```mermaid</code>
      </div>
    </div>
  );
}

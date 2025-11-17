import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { notesApi } from '../services/api';
import Editor from '../components/Editor';
import ChatBox from '../components/ChatBox';
import { Save, FileText } from 'lucide-react';

export default function NotePage() {
  const { selectedNote, setSelectedNote } = useStore();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content || '');
      setTitle(selectedNote.title || '');
    }
  }, [selectedNote]);

  const saveNote = async () => {
    if (!selectedNote) return;

    setSaving(true);
    try {
      const updated = await notesApi.update(selectedNote.id!, {
        title,
        content,
      });
      setSelectedNote(updated.data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Erro ao salvar nota');
    } finally {
      setSaving(false);
    }
  };

  const handleInsertText = (text: string) => {
    // If content is empty, replace it
    if (!content || content === '<p></p>') {
      setContent(`<p>${text}</p>`);
    } else {
      // Append the AI generated text
      setContent(`${content}<p>${text}</p>`);
    }
  };

  if (!selectedNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Selecione uma nota para começar</p>
          <p className="text-sm mt-2">
            Ou crie uma nova nota clicando no botão + ao lado de um notebook
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="border-b border-gray-200 p-4 bg-white flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none focus:outline-none flex-1"
          placeholder="Título da nota"
        />
        <button
          onClick={saveNote}
          disabled={saving}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={18} />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {lastSaved && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-200 text-green-700 text-sm">
          Salvo às {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Editor content={content} onChange={setContent} />
      </div>

      <ChatBox onInsertText={handleInsertText} currentContent={content} />
    </div>
  );
}

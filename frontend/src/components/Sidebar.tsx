import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Plus, FolderOpen, FileText } from 'lucide-react';
import { useStore } from '../store';
import { spacesApi, stacksApi, notebooksApi, notesApi } from '../services/api';
import type { Stack, Notebook, Note } from '../types';

export default function Sidebar() {
  const {
    spaces,
    setSpaces,
    setSelectedNote,
  } = useStore();

  const [expandedSpaces, setExpandedSpaces] = useState<Set<number>>(new Set());
  const [expandedStacks, setExpandedStacks] = useState<Set<number>>(new Set());
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<number>>(new Set());
  const [spaceStacks, setSpaceStacks] = useState<Map<number, Stack[]>>(new Map());
  const [stackNotebooks, setStackNotebooks] = useState<Map<number, Notebook[]>>(new Map());
  const [notebookNotes, setNotebookNotes] = useState<Map<number, Note[]>>(new Map());

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const response = await spacesApi.getAll();
      setSpaces(response.data);
    } catch (error) {
      console.error('Error loading spaces:', error);
    }
  };

  const toggleSpace = async (spaceId: number) => {
    const newExpanded = new Set(expandedSpaces);
    if (newExpanded.has(spaceId)) {
      newExpanded.delete(spaceId);
    } else {
      newExpanded.add(spaceId);
      // Load stacks for this space
      const response = await stacksApi.getBySpaceId(spaceId);
      setSpaceStacks(new Map(spaceStacks.set(spaceId, response.data)));
    }
    setExpandedSpaces(newExpanded);
  };

  const toggleStack = async (stackId: number) => {
    const newExpanded = new Set(expandedStacks);
    if (newExpanded.has(stackId)) {
      newExpanded.delete(stackId);
    } else {
      newExpanded.add(stackId);
      // Load notebooks for this stack
      const response = await notebooksApi.getByStackId(stackId);
      setStackNotebooks(new Map(stackNotebooks.set(stackId, response.data)));
    }
    setExpandedStacks(newExpanded);
  };

  const toggleNotebook = async (notebookId: number) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
      // Load notes for this notebook
      const response = await notesApi.getByNotebookId(notebookId);
      setNotebookNotes(new Map(notebookNotes.set(notebookId, response.data)));
    }
    setExpandedNotebooks(newExpanded);
  };

  const createSpace = async () => {
    const name = prompt('Nome do Space:');
    if (!name) return;
    try {
      await spacesApi.create({ name });
      loadSpaces();
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  const createStack = async (spaceId: number) => {
    const name = prompt('Nome do Stack:');
    if (!name) return;
    try {
      await stacksApi.create({ name, space_id: spaceId });
      const response = await stacksApi.getBySpaceId(spaceId);
      setSpaceStacks(new Map(spaceStacks.set(spaceId, response.data)));
    } catch (error) {
      console.error('Error creating stack:', error);
    }
  };

  const createNotebook = async (stackId: number) => {
    const name = prompt('Nome do Notebook:');
    if (!name) return;
    try {
      await notebooksApi.create({ name, stack_id: stackId });
      const response = await notebooksApi.getByStackId(stackId);
      setStackNotebooks(new Map(stackNotebooks.set(stackId, response.data)));
    } catch (error) {
      console.error('Error creating notebook:', error);
    }
  };

  const createNote = async (notebookId: number) => {
    const title = prompt('Título da Nota:');
    if (!title) return;
    try {
      const response = await notesApi.create({ title, notebook_id: notebookId, content: '' });
      const notesResponse = await notesApi.getByNotebookId(notebookId);
      setNotebookNotes(new Map(notebookNotes.set(notebookId, notesResponse.data)));
      setSelectedNote(response.data);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Study Notebook</h1>
        <button
          onClick={createSpace}
          className="mt-3 w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Novo Space
        </button>
      </div>

      <div className="p-2">
        {spaces.map((space) => (
          <div key={space.id}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer group">
              <button onClick={() => toggleSpace(space.id!)}>
                {expandedSpaces.has(space.id!) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: space.color }}
              ></div>
              <span className="flex-1 font-medium">{space.name}</span>
              <button
                onClick={() => createStack(space.id!)}
                className="opacity-0 group-hover:opacity-100"
              >
                <Plus size={14} />
              </button>
            </div>

            {expandedSpaces.has(space.id!) && (
              <div className="ml-6">
                {spaceStacks.get(space.id!)?.map((stack) => (
                  <div key={stack.id}>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer group">
                      <button onClick={() => toggleStack(stack.id!)}>
                        {expandedStacks.has(stack.id!) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <FolderOpen size={16} className="text-yellow-600" />
                      <span className="flex-1">{stack.name}</span>
                      <button
                        onClick={() => createNotebook(stack.id!)}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {expandedStacks.has(stack.id!) && (
                      <div className="ml-6">
                        {stackNotebooks.get(stack.id!)?.map((notebook) => (
                          <div key={notebook.id}>
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer group">
                              <button onClick={() => toggleNotebook(notebook.id!)}>
                                {expandedNotebooks.has(notebook.id!) ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </button>
                              <FolderOpen size={16} className="text-blue-600" />
                              <span className="flex-1">{notebook.name}</span>
                              <button
                                onClick={() => createNote(notebook.id!)}
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {expandedNotebooks.has(notebook.id!) && (
                              <div className="ml-6">
                                {notebookNotes.get(notebook.id!)?.map((note) => (
                                  <div
                                    key={note.id}
                                    onClick={() => selectNote(note)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                  >
                                    <FileText size={16} className="text-gray-600" />
                                    <span className="text-sm">{note.title}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

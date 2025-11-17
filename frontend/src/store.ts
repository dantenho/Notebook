import { create } from 'zustand';
import type { Space, Stack, Notebook, Note, AISettings } from './types';

interface AppState {
  spaces: Space[];
  stacks: Stack[];
  notebooks: Notebook[];
  notes: Note[];
  selectedSpace: Space | null;
  selectedStack: Stack | null;
  selectedNotebook: Notebook | null;
  selectedNote: Note | null;
  aiSettings: AISettings;

  setSpaces: (spaces: Space[]) => void;
  setStacks: (stacks: Stack[]) => void;
  setNotebooks: (notebooks: Notebook[]) => void;
  setNotes: (notes: Note[]) => void;
  setSelectedSpace: (space: Space | null) => void;
  setSelectedStack: (stack: Stack | null) => void;
  setSelectedNotebook: (notebook: Notebook | null) => void;
  setSelectedNote: (note: Note | null) => void;
  setAISettings: (settings: AISettings) => void;
}

export const useStore = create<AppState>((set) => ({
  spaces: [],
  stacks: [],
  notebooks: [],
  notes: [],
  selectedSpace: null,
  selectedStack: null,
  selectedNotebook: null,
  selectedNote: null,
  aiSettings: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    apiKey: '',
    thinking: false,
  },

  setSpaces: (spaces) => set({ spaces }),
  setStacks: (stacks) => set({ stacks }),
  setNotebooks: (notebooks) => set({ notebooks }),
  setNotes: (notes) => set({ notes }),
  setSelectedSpace: (space) => set({ selectedSpace: space }),
  setSelectedStack: (stack) => set({ selectedStack: stack }),
  setSelectedNotebook: (notebook) => set({ selectedNotebook: notebook }),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setAISettings: (settings) => set({ aiSettings: settings }),
}));

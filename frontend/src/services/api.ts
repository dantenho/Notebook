import axios from 'axios';
import type { Space, Stack, Notebook, Note, AISettings, AIResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Spaces
export const spacesApi = {
  getAll: () => api.get<Space[]>('/spaces'),
  getById: (id: number) => api.get<Space>(`/spaces/${id}`),
  create: (space: Space) => api.post<Space>('/spaces', space),
  update: (id: number, space: Partial<Space>) => api.put<Space>(`/spaces/${id}`, space),
  delete: (id: number) => api.delete(`/spaces/${id}`),
};

// Stacks
export const stacksApi = {
  getAll: () => api.get<Stack[]>('/stacks'),
  getBySpaceId: (spaceId: number) => api.get<Stack[]>(`/stacks?space_id=${spaceId}`),
  getById: (id: number) => api.get<Stack>(`/stacks/${id}`),
  create: (stack: Stack) => api.post<Stack>('/stacks', stack),
  update: (id: number, stack: Partial<Stack>) => api.put<Stack>(`/stacks/${id}`, stack),
  delete: (id: number) => api.delete(`/stacks/${id}`),
};

// Notebooks
export const notebooksApi = {
  getAll: () => api.get<Notebook[]>('/notebooks'),
  getByStackId: (stackId: number) => api.get<Notebook[]>(`/notebooks?stack_id=${stackId}`),
  getById: (id: number) => api.get<Notebook>(`/notebooks/${id}`),
  create: (notebook: Notebook) => api.post<Notebook>('/notebooks', notebook),
  update: (id: number, notebook: Partial<Notebook>) => api.put<Notebook>(`/notebooks/${id}`, notebook),
  delete: (id: number) => api.delete(`/notebooks/${id}`),
};

// Notes
export const notesApi = {
  getAll: () => api.get<Note[]>('/notes'),
  getByNotebookId: (notebookId: number) => api.get<Note[]>(`/notes?notebook_id=${notebookId}`),
  getById: (id: number) => api.get<Note>(`/notes/${id}`),
  create: (note: Note) => api.post<Note>('/notes', note),
  update: (id: number, note: Partial<Note>) => api.put<Note>(`/notes/${id}`, note),
  delete: (id: number) => api.delete(`/notes/${id}`),
};

// AI
export const aiApi = {
  generate: (settings: AISettings, prompt: string, context?: string) =>
    api.post<AIResponse>('/ai/generate', {
      provider: settings.provider,
      model: settings.model,
      apiKey: settings.apiKey,
      prompt,
      context,
      thinking: settings.thinking,
    }),
  checkLlamaHealth: () => api.get<{ healthy: boolean }>('/ai/llama/health'),
};

export default api;

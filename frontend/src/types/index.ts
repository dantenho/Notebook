export interface Space {
  id?: number;
  name: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Stack {
  id?: number;
  name: string;
  space_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Notebook {
  id?: number;
  name: string;
  stack_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  id?: number;
  title: string;
  content?: string;
  notebook_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface AISettings {
  provider: string;
  model: string;
  apiKey?: string;
  thinking?: boolean;
}

export interface AIResponse {
  content: string;
  thinking?: string;
}

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

export type SourceType = 'pdf' | 'web' | 'pubmed' | 'scielo';

export interface Source {
  id?: number;
  note_id: number;
  type: SourceType;
  title: string;
  url?: string;
  file_path?: string;
  content?: string;
  metadata?: string;
  created_at?: string;
}

export interface SourceMetadata {
  authors?: string[];
  journal?: string;
  year?: number;
  doi?: string;
  pmid?: string;
  abstract?: string;
  keywords?: string[];
  pageCount?: number;
  [key: string]: any;
}

export interface PubMedSearchResult {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
}

export interface SciELOSearchResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  url: string;
}

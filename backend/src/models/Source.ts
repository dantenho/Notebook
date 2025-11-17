import db from '../db/database';

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

export class SourceModel {
  static getAll(): Source[] {
    const stmt = db.prepare('SELECT * FROM sources ORDER BY created_at DESC');
    return stmt.all() as Source[];
  }

  static getByNoteId(noteId: number): Source[] {
    const stmt = db.prepare('SELECT * FROM sources WHERE note_id = ? ORDER BY created_at DESC');
    return stmt.all(noteId) as Source[];
  }

  static getById(id: number): Source | undefined {
    const stmt = db.prepare('SELECT * FROM sources WHERE id = ?');
    return stmt.get(id) as Source | undefined;
  }

  static create(source: Source): Source {
    const stmt = db.prepare(
      'INSERT INTO sources (note_id, type, title, url, file_path, content, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      source.note_id,
      source.type,
      source.title,
      source.url || null,
      source.file_path || null,
      source.content || null,
      source.metadata || null
    );
    return this.getById(Number(result.lastInsertRowid))!;
  }

  static update(id: number, source: Partial<Source>): Source | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (source.title !== undefined) {
      updates.push('title = ?');
      values.push(source.title);
    }
    if (source.content !== undefined) {
      updates.push('content = ?');
      values.push(source.content);
    }
    if (source.metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(source.metadata);
    }

    if (updates.length === 0) return this.getById(id);

    values.push(id);

    const stmt = db.prepare(`UPDATE sources SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM sources WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

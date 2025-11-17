import db from '../db/database';

export interface Note {
  id?: number;
  title: string;
  content?: string;
  notebook_id: number;
  created_at?: string;
  updated_at?: string;
}

export class NoteModel {
  static getAll(): Note[] {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC');
    return stmt.all() as Note[];
  }

  static getByNotebookId(notebookId: number): Note[] {
    const stmt = db.prepare('SELECT * FROM notes WHERE notebook_id = ? ORDER BY updated_at DESC');
    return stmt.all(notebookId) as Note[];
  }

  static getById(id: number): Note | undefined {
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    return stmt.get(id) as Note | undefined;
  }

  static create(note: Note): Note {
    const stmt = db.prepare('INSERT INTO notes (title, content, notebook_id) VALUES (?, ?, ?)');
    const result = stmt.run(note.title, note.content || '', note.notebook_id);
    return this.getById(Number(result.lastInsertRowid))!;
  }

  static update(id: number, note: Partial<Note>): Note | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (note.title !== undefined) {
      updates.push('title = ?');
      values.push(note.title);
    }
    if (note.content !== undefined) {
      updates.push('content = ?');
      values.push(note.content);
    }
    if (note.notebook_id) {
      updates.push('notebook_id = ?');
      values.push(note.notebook_id);
    }

    if (updates.length === 0) return this.getById(id);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

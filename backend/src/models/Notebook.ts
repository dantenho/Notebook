import db from '../db/database';

export interface Notebook {
  id?: number;
  name: string;
  stack_id: number;
  created_at?: string;
  updated_at?: string;
}

export class NotebookModel {
  static getAll(): Notebook[] {
    const stmt = db.prepare('SELECT * FROM notebooks ORDER BY name');
    return stmt.all() as Notebook[];
  }

  static getByStackId(stackId: number): Notebook[] {
    const stmt = db.prepare('SELECT * FROM notebooks WHERE stack_id = ? ORDER BY name');
    return stmt.all(stackId) as Notebook[];
  }

  static getById(id: number): Notebook | undefined {
    const stmt = db.prepare('SELECT * FROM notebooks WHERE id = ?');
    return stmt.get(id) as Notebook | undefined;
  }

  static create(notebook: Notebook): Notebook {
    const stmt = db.prepare('INSERT INTO notebooks (name, stack_id) VALUES (?, ?)');
    const result = stmt.run(notebook.name, notebook.stack_id);
    return this.getById(Number(result.lastInsertRowid))!;
  }

  static update(id: number, notebook: Partial<Notebook>): Notebook | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (notebook.name) {
      updates.push('name = ?');
      values.push(notebook.name);
    }
    if (notebook.stack_id) {
      updates.push('stack_id = ?');
      values.push(notebook.stack_id);
    }

    if (updates.length === 0) return this.getById(id);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE notebooks SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM notebooks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

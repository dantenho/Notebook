import db from '../db/database';

export interface Stack {
  id?: number;
  name: string;
  space_id: number;
  created_at?: string;
  updated_at?: string;
}

export class StackModel {
  static getAll(): Stack[] {
    const stmt = db.prepare('SELECT * FROM stacks ORDER BY name');
    return stmt.all() as Stack[];
  }

  static getBySpaceId(spaceId: number): Stack[] {
    const stmt = db.prepare('SELECT * FROM stacks WHERE space_id = ? ORDER BY name');
    return stmt.all(spaceId) as Stack[];
  }

  static getById(id: number): Stack | undefined {
    const stmt = db.prepare('SELECT * FROM stacks WHERE id = ?');
    return stmt.get(id) as Stack | undefined;
  }

  static create(stack: Stack): Stack {
    const stmt = db.prepare('INSERT INTO stacks (name, space_id) VALUES (?, ?)');
    const result = stmt.run(stack.name, stack.space_id);
    return this.getById(Number(result.lastInsertRowid))!;
  }

  static update(id: number, stack: Partial<Stack>): Stack | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (stack.name) {
      updates.push('name = ?');
      values.push(stack.name);
    }
    if (stack.space_id) {
      updates.push('space_id = ?');
      values.push(stack.space_id);
    }

    if (updates.length === 0) return this.getById(id);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE stacks SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM stacks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

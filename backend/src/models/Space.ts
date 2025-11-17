import db from '../db/database';

export interface Space {
  id?: number;
  name: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export class SpaceModel {
  static getAll(): Space[] {
    const stmt = db.prepare('SELECT * FROM spaces ORDER BY name');
    return stmt.all() as Space[];
  }

  static getById(id: number): Space | undefined {
    const stmt = db.prepare('SELECT * FROM spaces WHERE id = ?');
    return stmt.get(id) as Space | undefined;
  }

  static create(space: Space): Space {
    const stmt = db.prepare('INSERT INTO spaces (name, color) VALUES (?, ?)');
    const result = stmt.run(space.name, space.color || '#3b82f6');
    return this.getById(Number(result.lastInsertRowid))!;
  }

  static update(id: number, space: Partial<Space>): Space | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (space.name) {
      updates.push('name = ?');
      values.push(space.name);
    }
    if (space.color) {
      updates.push('color = ?');
      values.push(space.color);
    }

    if (updates.length === 0) return this.getById(id);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE spaces SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM spaces WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

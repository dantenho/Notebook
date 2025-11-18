/**
 * ═══════════════════════════════════════════════════════════════
 * MODEL: UserSettings (Configurações de Usuário)
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia configurações e customizações de interface do usuário.
 * Implementa padrão Singleton (apenas 1 registro com id = 1).
 *
 * @module UserSettings
 */

import db from '../db/database';

export interface UserSettings {
  id: number;
  avatar: string;
  display_name: string;
  theme: 'light' | 'dark' | 'auto';
  accent_color: string;
  font_size: 'small' | 'medium' | 'large';
  compact_mode: number;
  show_icons: number;
  created_at: string;
  updated_at: string;
}

export class UserSettingsModel {
  /**
   * Busca as configurações do usuário (sempre id = 1)
   */
  static get(): UserSettings | null {
    try {
      const stmt = db.prepare('SELECT * FROM user_settings WHERE id = 1');
      return stmt.get() as UserSettings | null;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
  }

  /**
   * Atualiza as configurações do usuário
   */
  static update(data: Partial<UserSettings>): UserSettings | null {
    try {
      const allowedFields = [
        'avatar',
        'display_name',
        'theme',
        'accent_color',
        'font_size',
        'compact_mode',
        'show_icons'
      ];

      const updates: string[] = [];
      const values: any[] = [];

      for (const field of allowedFields) {
        if (data[field as keyof UserSettings] !== undefined) {
          updates.push(`${field} = ?`);
          values.push(data[field as keyof UserSettings]);
        }
      }

      if (updates.length === 0) {
        return this.get();
      }

      // Adicionar updated_at
      updates.push('updated_at = CURRENT_TIMESTAMP');

      const query = `
        UPDATE user_settings
        SET ${updates.join(', ')}
        WHERE id = 1
      `;

      const stmt = db.prepare(query);
      stmt.run(...values);

      return this.get();
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return null;
    }
  }

  /**
   * Reseta configurações para valores padrão
   */
  static reset(): UserSettings | null {
    try {
      const stmt = db.prepare(`
        UPDATE user_settings
        SET
          avatar = '👤',
          display_name = 'Estudante',
          theme = 'light',
          accent_color = '#3b82f6',
          font_size = 'medium',
          compact_mode = 0,
          show_icons = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `);

      stmt.run();
      return this.get();
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      return null;
    }
  }
}

/**
 * ===================================================================
 * HELPERS PARA OPERAÇÕES DE BANCO DE DADOS
 * ===================================================================
 *
 * Funções utilitárias para simplificar operações comuns no banco de dados.
 * Reduz código duplicado e padroniza tratamento de erros.
 *
 * @module utils/database.helpers
 */

import db from '../db/database';

/**
 * Interface genérica para timestamps
 */
export interface WithTimestamps {
  created_at?: string;
  updated_at?: string;
}

/**
 * ===================================================================
 * HELPERS CRUD GENÉRICOS
 * ===================================================================
 */

/**
 * Executa SELECT com tratamento de erro padronizado
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 * @returns Resultados da query ou null em caso de erro
 *
 * @example
 * const spaces = safeSelect('SELECT * FROM spaces WHERE id = ?', [1]);
 */
export function safeSelect<T = any>(query: string, params: any[] = []): T[] | null {
  try {
    const stmt = db.prepare(query);
    return stmt.all(...params) as T[];
  } catch (error) {
    console.error('❌ Erro ao executar SELECT:', error);
    return null;
  }
}

/**
 * Executa SELECT retornando apenas um resultado
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 * @returns Primeiro resultado ou null
 *
 * @example
 * const space = safeSelectOne('SELECT * FROM spaces WHERE id = ?', [1]);
 */
export function safeSelectOne<T = any>(query: string, params: any[] = []): T | null {
  try {
    const stmt = db.prepare(query);
    return stmt.get(...params) as T || null;
  } catch (error) {
    console.error('❌ Erro ao executar SELECT:', error);
    return null;
  }
}

/**
 * Executa INSERT com tratamento de erro
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 * @returns ID do registro inserido ou null em caso de erro
 *
 * @example
 * const id = safeInsert('INSERT INTO spaces (name) VALUES (?)', ['Medicina']);
 */
export function safeInsert(query: string, params: any[] = []): number | null {
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    return result.lastInsertRowid as number;
  } catch (error) {
    console.error('❌ Erro ao executar INSERT:', error);
    return null;
  }
}

/**
 * Executa UPDATE com tratamento de erro
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 * @returns Número de linhas afetadas ou null em caso de erro
 *
 * @example
 * const affected = safeUpdate('UPDATE spaces SET name = ? WHERE id = ?', ['Medicina', 1]);
 */
export function safeUpdate(query: string, params: any[] = []): number | null {
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    return result.changes;
  } catch (error) {
    console.error('❌ Erro ao executar UPDATE:', error);
    return null;
  }
}

/**
 * Executa DELETE com tratamento de erro
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 * @returns Número de linhas deletadas ou null em caso de erro
 *
 * @example
 * const deleted = safeDelete('DELETE FROM spaces WHERE id = ?', [1]);
 */
export function safeDelete(query: string, params: any[] = []): number | null {
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    return result.changes;
  } catch (error) {
    console.error('❌ Erro ao executar DELETE:', error);
    return null;
  }
}

/**
 * ===================================================================
 * HELPERS PARA VALIDAÇÃO
 * ===================================================================
 */

/**
 * Verifica se um registro existe na tabela
 *
 * @param table - Nome da tabela
 * @param id - ID do registro
 * @returns true se existe, false caso contrário
 *
 * @example
 * if (!recordExists('spaces', 1)) {
 *   throw new Error('Espaço não encontrado');
 * }
 */
export function recordExists(table: string, id: number): boolean {
  const result = safeSelectOne(`SELECT 1 FROM ${table} WHERE id = ?`, [id]);
  return result !== null;
}

/**
 * Verifica se um nome já existe na tabela (para evitar duplicatas)
 *
 * @param table - Nome da tabela
 * @param name - Nome a verificar
 * @param excludeId - ID a excluir da verificação (útil em updates)
 * @returns true se já existe, false caso contrário
 *
 * @example
 * if (nameExists('spaces', 'Medicina')) {
 *   throw new Error('Espaço com este nome já existe');
 * }
 */
export function nameExists(table: string, name: string, excludeId?: number): boolean {
  let query = `SELECT 1 FROM ${table} WHERE name = ?`;
  const params: any[] = [name];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const result = safeSelectOne(query, params);
  return result !== null;
}

/**
 * ===================================================================
 * HELPERS PARA HIERARQUIA
 * ===================================================================
 */

/**
 * Valida se a relação pai-filho é válida na hierarquia
 *
 * @param parentTable - Tabela pai
 * @param parentId - ID do registro pai
 * @returns true se válido, false caso contrário
 *
 * @example
 * // Verificar se um space existe antes de criar um stack
 * if (!validateParent('spaces', spaceId)) {
 *   throw new Error('Espaço não encontrado');
 * }
 */
export function validateParent(parentTable: string, parentId: number): boolean {
  return recordExists(parentTable, parentId);
}

/**
 * Conta filhos de um registro pai
 *
 * @param childTable - Tabela filha
 * @param parentColumn - Coluna que referencia o pai
 * @param parentId - ID do pai
 * @returns Número de filhos
 *
 * @example
 * const stackCount = countChildren('stacks', 'space_id', spaceId);
 * console.log(`Este espaço tem ${stackCount} pilhas`);
 */
export function countChildren(childTable: string, parentColumn: string, parentId: number): number {
  const result = safeSelectOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${childTable} WHERE ${parentColumn} = ?`,
    [parentId]
  );
  return result?.count || 0;
}

/**
 * ===================================================================
 * HELPERS PARA TRANSAÇÕES
 * ===================================================================
 */

/**
 * Executa múltiplas operações em uma transação
 * Se qualquer operação falhar, todas são revertidas
 *
 * @param operations - Função com as operações a executar
 * @returns Resultado da transação
 *
 * @example
 * const result = executeTransaction(() => {
 *   const spaceId = safeInsert('INSERT INTO spaces (name) VALUES (?)', ['Medicina']);
 *   safeInsert('INSERT INTO stacks (name, space_id) VALUES (?, ?)', ['Anatomia', spaceId]);
 *   return spaceId;
 * });
 */
export function executeTransaction<T>(operations: () => T): T | null {
  try {
    const transaction = db.transaction(operations);
    return transaction();
  } catch (error) {
    console.error('❌ Erro ao executar transação:', error);
    return null;
  }
}

/**
 * ===================================================================
 * HELPERS PARA FORMATAÇÃO DE DADOS
 * ===================================================================
 */

/**
 * Adiciona timestamps automáticos aos dados
 *
 * @param data - Dados a formatar
 * @param includeUpdatedAt - Se deve incluir updated_at (padrão: false)
 * @returns Dados com timestamps
 *
 * @example
 * const spaceData = addTimestamps({ name: 'Medicina' });
 * // { name: 'Medicina', created_at: '2024-11-17T12:00:00.000Z' }
 */
export function addTimestamps<T extends object>(
  data: T,
  includeUpdatedAt: boolean = false
): T & WithTimestamps {
  const now = new Date().toISOString();
  const result: any = { ...data, created_at: now };

  if (includeUpdatedAt) {
    result.updated_at = now;
  }

  return result;
}

/**
 * Sanitiza string para prevenir SQL injection
 * NOTA: Better-sqlite3 já faz isso automaticamente com prepared statements,
 * mas esta função é útil para validação adicional
 *
 * @param str - String a sanitizar
 * @returns String sanitizada
 */
export function sanitizeString(str: string): string {
  return str.replace(/['"]/g, '');
}

/**
 * ===================================================================
 * HELPERS PARA DEBUGGING
 * ===================================================================
 */

/**
 * Loga query SQL formatada para debugging
 *
 * @param query - SQL query
 * @param params - Parâmetros da query
 */
export function logQuery(query: string, params: any[] = []): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 SQL:', query);
    if (params.length > 0) {
      console.log('📝 Params:', params);
    }
  }
}

/**
 * ===================================================================
 * EXPORTAÇÕES PADRÃO
 * ===================================================================
 */

export default {
  // CRUD Operations
  safeSelect,
  safeSelectOne,
  safeInsert,
  safeUpdate,
  safeDelete,

  // Validation
  recordExists,
  nameExists,
  validateParent,
  countChildren,

  // Transactions
  executeTransaction,

  // Formatting
  addTimestamps,
  sanitizeString,

  // Debugging
  logQuery
};

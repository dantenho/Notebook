/**
 * ===================================================================
 * CONFIGURAÇÃO DO BANCO DE DADOS SQLITE
 * ===================================================================
 *
 * Este arquivo configura e inicializa o banco de dados SQLite para o
 * aplicativo Study Notebook. Utiliza better-sqlite3 para operações
 * síncronas de alto desempenho.
 *
 * ESTRUTURA HIERÁRQUICA:
 * - Spaces (Espaços) - Nível mais alto de organização
 * - Stacks (Pilhas) - Agrupamento dentro de espaços
 * - Notebooks (Cadernos) - Cadernos dentro de pilhas
 * - Notes (Notas) - Notas individuais dentro de cadernos
 * - Sources (Fontes) - Referências anexadas às notas
 *
 * @module database
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ===================================================================
// CONFIGURAÇÃO DO CAMINHO DO BANCO DE DADOS
// ===================================================================

/**
 * Define o caminho do arquivo do banco de dados.
 *
 * Em PRODUÇÃO (Electron):
 *   - Usa variável de ambiente DATABASE_PATH definida pelo Electron
 *   - Geralmente: %APPDATA%/study-notebook/database.sqlite
 *
 * Em DESENVOLVIMENTO:
 *   - Usa caminho local: backend/database.sqlite
 */
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// ===================================================================
// CRIAÇÃO DO DIRETÓRIO DO BANCO DE DADOS
// ===================================================================

/**
 * Garante que o diretório pai do banco de dados existe.
 * Se não existir, cria recursivamente toda a estrutura de diretórios.
 */
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('📁 Diretório do banco de dados criado:', dbDir);
}

// ===================================================================
// INICIALIZAÇÃO DA CONEXÃO COM O BANCO DE DADOS
// ===================================================================

console.log('💾 Caminho do banco de dados:', dbPath);

/**
 * Instância do banco de dados SQLite.
 * Configurado com modo síncrono para melhor performance em desktop.
 */
const db = new Database(dbPath);

// ===================================================================
// CONFIGURAÇÕES DO BANCO DE DADOS
// ===================================================================

/**
 * Habilita chaves estrangeiras (Foreign Keys).
 * IMPORTANTE: Garante integridade referencial e cascade delete.
 *
 * Quando um Space é deletado:
 *   → Todos os Stacks dele são deletados
 *     → Todos os Notebooks desses Stacks são deletados
 *       → Todas as Notes desses Notebooks são deletadas
 *         → Todas as Sources dessas Notes são deletadas
 */
db.pragma('foreign_keys = ON');

// ===================================================================
// CRIAÇÃO DAS TABELAS DO BANCO DE DADOS
// ===================================================================

/**
 * Cria todas as tabelas necessárias para o funcionamento do aplicativo.
 * Usa IF NOT EXISTS para segurança em múltiplas inicializações.
 *
 * HIERARQUIA DAS TABELAS (de cima para baixo):
 * 1. spaces      - Espaços (ex: "Medicina", "Programação")
 * 2. stacks      - Pilhas (ex: "Anatomia", "Cardiologia")
 * 3. notebooks   - Cadernos (ex: "IAM", "Arritmias")
 * 4. notes       - Notas individuais (ex: "IAMCEST", "Flutter Atrial")
 * 5. sources     - Fontes/Referências anexadas às notas
 * 6. ai_settings - Configurações de IA (chaves API, modelos)
 */
db.exec(`
  -- ==================================================================
  -- TABELA: spaces (Espaços)
  -- ==================================================================
  -- Nível mais alto da hierarquia. Representa grandes áreas de estudo.
  -- Exemplo: "Medicina", "Programação", "Idiomas"
  --
  CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único do espaço
    name TEXT NOT NULL,                    -- Nome do espaço (ex: "Medicina")
    color TEXT DEFAULT '#3b82f6',          -- Cor para identificação visual
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- Data de última atualização
  );

  -- ==================================================================
  -- TABELA: stacks (Pilhas)
  -- ==================================================================
  -- Segundo nível. Agrupa cadernos relacionados dentro de um espaço.
  -- Exemplo: "Anatomia", "Farmacologia", "Revalida"
  --
  CREATE TABLE IF NOT EXISTS stacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da pilha
    name TEXT NOT NULL,                    -- Nome da pilha (ex: "Cardiologia")
    space_id INTEGER NOT NULL,             -- ID do espaço pai
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Cascade: deletar espaço deleta todas suas pilhas
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
  );

  -- ==================================================================
  -- TABELA: notebooks (Cadernos)
  -- ==================================================================
  -- Terceiro nível. Contém grupos de notas sobre tópicos específicos.
  -- Exemplo: "IAM", "Insuficiência Cardíaca", "Arritmias"
  --
  CREATE TABLE IF NOT EXISTS notebooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único do caderno
    name TEXT NOT NULL,                    -- Nome do caderno (ex: "IAM")
    stack_id INTEGER NOT NULL,             -- ID da pilha pai
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Cascade: deletar pilha deleta todos seus cadernos
    FOREIGN KEY (stack_id) REFERENCES stacks(id) ON DELETE CASCADE
  );

  -- ==================================================================
  -- TABELA: notes (Notas)
  -- ==================================================================
  -- Quarto nível. Notas individuais com conteúdo rich text.
  -- Exemplo: "IAMCEST", "IAMSEST", "Angina Instável"
  --
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da nota
    title TEXT NOT NULL,                   -- Título da nota
    content TEXT DEFAULT '',               -- Conteúdo em formato HTML/Markdown
    notebook_id INTEGER NOT NULL,          -- ID do caderno pai
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Cascade: deletar caderno deleta todas suas notas
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
  );

  -- ==================================================================
  -- TABELA: ai_settings (Configurações de IA)
  -- ==================================================================
  -- Armazena configurações de modelos de IA (API keys, providers).
  -- Suporta: OpenAI, Anthropic, Google Gemini, llama.cpp
  --
  CREATE TABLE IF NOT EXISTS ai_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da configuração
    provider TEXT NOT NULL,                -- Provider: 'openai', 'anthropic', 'google', 'llamacpp'
    model_name TEXT NOT NULL,              -- Nome do modelo (ex: 'gpt-4', 'claude-3-opus')
    api_key TEXT,                          -- Chave API (null para llama.cpp local)
    is_default INTEGER DEFAULT 0,          -- 1 se for configuração padrão
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- ==================================================================
  -- TABELA: sources (Fontes/Referências)
  -- ==================================================================
  -- Armazena fontes anexadas às notas (PDFs, artigos web, PubMed, SciELO).
  -- Utilizado pela IA para gerar respostas baseadas em evidências.
  --
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da fonte
    note_id INTEGER NOT NULL,              -- ID da nota à qual pertence
    type TEXT NOT NULL CHECK(type IN ('pdf', 'web', 'pubmed', 'scielo')),  -- Tipo da fonte
    title TEXT NOT NULL,                   -- Título da fonte/artigo
    url TEXT,                              -- URL (para web, pubmed, scielo)
    file_path TEXT,                        -- Caminho do arquivo (para PDF)
    content TEXT,                          -- Conteúdo extraído da fonte
    metadata TEXT,                         -- Metadados JSON (autores, ano, DOI, etc)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Cascade: deletar nota deleta todas suas fontes
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  );

  -- ==================================================================
  -- TABELA: learning_trails (Trilhas de Aprendizado)
  -- ==================================================================
  -- Sistema de trilhas para organizar estudos em sequências lógicas.
  -- Exemplo: "Cardiologia Básica" → contém notas em ordem de estudo
  --
  CREATE TABLE IF NOT EXISTS learning_trails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da trilha
    name TEXT NOT NULL,                    -- Nome da trilha (ex: "Cardiologia para Revalida")
    description TEXT,                      -- Descrição da trilha
    space_id INTEGER,                      -- Space relacionado (opcional)
    color TEXT DEFAULT '#8b5cf6',          -- Cor da trilha
    estimated_hours INTEGER DEFAULT 0,     -- Horas estimadas para completar
    difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),  -- Dificuldade
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE SET NULL
  );

  -- ==================================================================
  -- TABELA: trail_items (Itens da Trilha)
  -- ==================================================================
  -- Notas que fazem parte de uma trilha, em ordem específica.
  --
  CREATE TABLE IF NOT EXISTS trail_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único do item
    trail_id INTEGER NOT NULL,             -- ID da trilha
    note_id INTEGER NOT NULL,              -- ID da nota
    order_index INTEGER NOT NULL,          -- Ordem na trilha (0, 1, 2, ...)
    is_required INTEGER DEFAULT 1,         -- 1 = obrigatória, 0 = opcional
    estimated_minutes INTEGER DEFAULT 30,  -- Tempo estimado para estudar
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trail_id) REFERENCES learning_trails(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE(trail_id, note_id)  -- Mesma nota não pode aparecer 2x na trilha
  );

  -- ==================================================================
  -- TABELA: study_progress (Progresso de Estudos)
  -- ==================================================================
  -- Rastreia o progresso do usuário em cada nota.
  -- Sistema de revisão espaçada integrado.
  --
  CREATE TABLE IF NOT EXISTS study_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único do progresso
    note_id INTEGER NOT NULL,              -- ID da nota estudada
    status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN
      ('not_started', 'studying', 'completed', 'mastered')),  -- Status do estudo
    confidence_level INTEGER DEFAULT 0 CHECK(confidence_level BETWEEN 0 AND 100),  -- Confiança (0-100%)
    last_studied DATETIME,                 -- Última vez que estudou
    next_review DATETIME,                  -- Próxima revisão (spaced repetition)
    review_count INTEGER DEFAULT 0,        -- Quantas vezes já revisou
    time_spent_minutes INTEGER DEFAULT 0,  -- Tempo total gasto estudando
    notes TEXT,                            -- Anotações sobre o estudo
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE(note_id)  -- Uma linha por nota
  );

  -- ==================================================================
  -- TABELA: study_sessions (Sessões de Estudo)
  -- ==================================================================
  -- Registra cada sessão de estudo para analytics.
  --
  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da sessão
    note_id INTEGER NOT NULL,              -- Nota estudada
    trail_id INTEGER,                      -- Trilha relacionada (opcional)
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Início da sessão
    ended_at DATETIME,                     -- Fim da sessão
    duration_minutes INTEGER,              -- Duração em minutos
    quality_rating INTEGER CHECK(quality_rating BETWEEN 1 AND 5),  -- Avaliação da sessão (1-5)
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (trail_id) REFERENCES learning_trails(id) ON DELETE SET NULL
  );

  -- ==================================================================
  -- TABELA: tags (Tags para Organização)
  -- ==================================================================
  -- Sistema de tags para categorização cruzada.
  --
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da tag
    name TEXT NOT NULL UNIQUE,             -- Nome da tag (ex: "importante", "revisar")
    color TEXT DEFAULT '#gray-500',        -- Cor da tag
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- ==================================================================
  -- TABELA: note_tags (Relação Nota-Tag)
  -- ==================================================================
  -- Tabela de junção many-to-many entre notas e tags.
  --
  CREATE TABLE IF NOT EXISTS note_tags (
    note_id INTEGER NOT NULL,              -- ID da nota
    tag_id INTEGER NOT NULL,               -- ID da tag
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)  -- Evita duplicatas
  );
`);

// ===================================================================
// LOG DE INICIALIZAÇÃO
// ===================================================================
console.log('✅ Banco de dados inicializado com sucesso');
console.log('📊 Tabelas principais: spaces, stacks, notebooks, notes, sources, ai_settings');
console.log('🎓 Tabelas de aprendizado: learning_trails, trail_items, study_progress, study_sessions');
console.log('🏷️  Tabelas de organização: tags, note_tags');

export default db;

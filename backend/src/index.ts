/**
 * ===================================================================
 * SERVIDOR BACKEND - STUDY NOTEBOOK
 * ===================================================================
 *
 * Servidor Express que fornece API REST para o aplicativo Study Notebook.
 * Gerencia toda a lógica de negócios e comunicação com o banco de dados.
 *
 * FUNCIONALIDADES PRINCIPAIS:
 * - CRUD para hierarquia: Spaces > Stacks > Notebooks > Notes
 * - Gerenciamento de fontes (PDF, Web, PubMed, SciELO)
 * - Integração com APIs de IA (OpenAI, Anthropic, Google, llama.cpp)
 * - Upload e processamento de arquivos PDF
 * - Extração de conteúdo de páginas web
 * - Busca em bases científicas (PubMed, SciELO)
 *
 * ARQUITETURA:
 * - Express.js como framework HTTP
 * - SQLite (better-sqlite3) como banco de dados
 * - TypeScript para type-safety
 * - Rotas modulares organizadas por domínio
 *
 * @module backend/index
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// ===================================================================
// IMPORTAÇÃO DAS ROTAS
// ===================================================================
import spacesRouter from './routes/spaces';      // Rotas de Espaços
import stacksRouter from './routes/stacks';      // Rotas de Pilhas
import notebooksRouter from './routes/notebooks';// Rotas de Cadernos
import notesRouter from './routes/notes';        // Rotas de Notas
import aiRouter from './routes/ai';              // Rotas de IA
import sourcesRouter from './routes/sources';    // Rotas de Fontes/Referências

// ===================================================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// ===================================================================

/**
 * Carrega variáveis de ambiente do arquivo .env
 * Variáveis importantes:
 * - PORT: Porta do servidor (padrão: 3001)
 * - DATABASE_PATH: Caminho do banco de dados (definido pelo Electron)
 * - UPLOADS_PATH: Caminho para arquivos enviados (definido pelo Electron)
 */
dotenv.config();

// ===================================================================
// INICIALIZAÇÃO DO SERVIDOR EXPRESS
// ===================================================================

const app = express();

/**
 * Porta do servidor.
 * Em produção (Electron), usa variável de ambiente PORT.
 * Em desenvolvimento, usa 3001 como padrão.
 */
const PORT = process.env.PORT || 3001;

// ===================================================================
// CONFIGURAÇÃO DE MIDDLEWARES
// ===================================================================

/**
 * CORS (Cross-Origin Resource Sharing)
 * Permite que o frontend (React) faça requisições ao backend.
 * Em produção Electron, frontend e backend estão no mesmo host.
 */
app.use(cors());

/**
 * Parser de JSON
 * Limite de 50MB para suportar upload de PDFs e conteúdo extenso.
 */
app.use(express.json({ limit: '50mb' }));

/**
 * Parser de URL-encoded
 * Para formulários HTML tradicionais.
 */
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===================================================================
// REGISTRO DE ROTAS DA API
// ===================================================================

/**
 * ROTAS DA HIERARQUIA DE ORGANIZAÇÃO
 *
 * Hierarquia: Spaces > Stacks > Notebooks > Notes
 *
 * /api/spaces
 *   - GET    /           → Lista todos os espaços
 *   - GET    /:id        → Busca espaço por ID
 *   - POST   /           → Cria novo espaço
 *   - PUT    /:id        → Atualiza espaço
 *   - DELETE /:id        → Deleta espaço (cascade)
 *
 * /api/stacks
 *   - GET    /           → Lista todas as pilhas
 *   - GET    /:id        → Busca pilha por ID
 *   - GET    /space/:id  → Lista pilhas de um espaço
 *   - POST   /           → Cria nova pilha
 *   - PUT    /:id        → Atualiza pilha
 *   - DELETE /:id        → Deleta pilha (cascade)
 *
 * /api/notebooks
 *   - GET    /           → Lista todos os cadernos
 *   - GET    /:id        → Busca caderno por ID
 *   - GET    /stack/:id  → Lista cadernos de uma pilha
 *   - POST   /           → Cria novo caderno
 *   - PUT    /:id        → Atualiza caderno
 *   - DELETE /:id        → Deleta caderno (cascade)
 *
 * /api/notes
 *   - GET    /                → Lista todas as notas
 *   - GET    /:id             → Busca nota por ID
 *   - GET    /notebook/:id    → Lista notas de um caderno
 *   - POST   /                → Cria nova nota
 *   - PUT    /:id             → Atualiza nota
 *   - DELETE /:id             → Deleta nota (cascade)
 */
app.use('/api/spaces', spacesRouter);
app.use('/api/stacks', stacksRouter);
app.use('/api/notebooks', notebooksRouter);
app.use('/api/notes', notesRouter);

/**
 * ROTAS DE INTELIGÊNCIA ARTIFICIAL
 *
 * /api/ai
 *   - POST /generate     → Gera texto com IA (suporta contexto de fontes)
 *   - POST /edit         → Edita texto existente com IA
 *   - POST /complete     → Completa texto com IA
 *
 * Suporta múltiplos providers:
 * - openai (GPT-3.5, GPT-4, GPT-4-turbo)
 * - anthropic (Claude 3 Opus, Sonnet, Haiku)
 * - google (Gemini Pro, Gemini Ultra)
 * - llamacpp (modelos locais)
 */
app.use('/api/ai', aiRouter);

/**
 * ROTAS DE FONTES/REFERÊNCIAS
 *
 * /api/sources
 *   - GET    /note/:id         → Lista fontes de uma nota
 *   - POST   /pdf              → Upload e extração de PDF
 *   - POST   /web              → Extração de conteúdo de URL
 *   - POST   /pubmed/search    → Busca artigos no PubMed
 *   - POST   /pubmed/fetch     → Importa artigo do PubMed
 *   - POST   /scielo/search    → Busca artigos no SciELO
 *   - POST   /scielo/fetch     → Importa artigo do SciELO
 *   - DELETE /:id              → Remove fonte
 *
 * Tipos de fonte suportados:
 * - pdf: Arquivos PDF com extração de texto
 * - web: Páginas web com extração inteligente de conteúdo
 * - pubmed: Artigos científicos do PubMed
 * - scielo: Artigos científicos do SciELO
 */
app.use('/api/sources', sourcesRouter);

// ===================================================================
// ROTA DE HEALTH CHECK
// ===================================================================

/**
 * Endpoint para verificar se o servidor está funcionando.
 * Útil para monitoramento e debugging.
 *
 * Retorna:
 * {
 *   status: 'ok',
 *   timestamp: '2024-11-17T12:00:00.000Z'
 * }
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// ===================================================================
// TRATAMENTO DE ERROS GLOBAL
// ===================================================================

/**
 * Middleware de tratamento de erros.
 * Captura todos os erros não tratados nas rotas e retorna resposta padronizada.
 *
 * IMPORTANTE: Este middleware deve ser o último a ser registrado.
 *
 * @param err - Erro capturado
 * @param req - Requisição HTTP
 * @param res - Resposta HTTP
 * @param next - Função para próximo middleware
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log do erro no console para debugging
  console.error('❌ Erro capturado:', err.stack);

  // Determina código de status (usa 500 se não especificado)
  const statusCode = err.statusCode || 500;

  // Retorna resposta de erro padronizada
  res.status(statusCode).json({
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// ===================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ===================================================================

/**
 * Inicia o servidor HTTP na porta especificada.
 * Em produção (Electron), o servidor é iniciado automaticamente
 * quando o aplicativo é aberto.
 */
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         STUDY NOTEBOOK - BACKEND SERVER                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📝 API disponível em:   http://localhost:${PORT}/api`);
  console.log(`💾 Banco de dados:      ${process.env.DATABASE_PATH || 'backend/database.sqlite'}`);
  console.log(`📁 Uploads:             ${process.env.UPLOADS_PATH || 'backend/uploads'}`);
  console.log('');
  console.log('📊 Endpoints disponíveis:');
  console.log('   - /api/spaces     → Gerenciamento de Espaços');
  console.log('   - /api/stacks     → Gerenciamento de Pilhas');
  console.log('   - /api/notebooks  → Gerenciamento de Cadernos');
  console.log('   - /api/notes      → Gerenciamento de Notas');
  console.log('   - /api/ai         → Integração com IA');
  console.log('   - /api/sources    → Fontes e Referências');
  console.log('   - /api/health     → Health Check');
  console.log('');
  console.log('✅ Servidor pronto para receber requisições!');
  console.log('');
});

/**
 * Exporta a instância do app para testes e uso externo.
 */
export default app;

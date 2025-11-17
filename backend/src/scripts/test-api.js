/**
 * Script de teste das rotas da API
 * Testa todos os endpoints disponíveis
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

console.log('🧪 Iniciando testes da API...\n');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

let passedTests = 0;
let failedTests = 0;

/**
 * Helper para fazer requisições
 */
async function testEndpoint(method, endpoint, data = null, description) {
  try {
    const url = `${API_BASE}${endpoint}`;
    let response;

    console.log(`${colors.blue}Testing:${colors.reset} ${method} ${endpoint} - ${description}`);

    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(url);
        break;
      case 'POST':
        response = await axios.post(url, data);
        break;
      case 'PUT':
        response = await axios.put(url, data);
        break;
      case 'DELETE':
        response = await axios.delete(url);
        break;
    }

    if (response.status >= 200 && response.status < 300) {
      console.log(`   ${colors.green}✓${colors.reset} Status: ${response.status}\n`);
      passedTests++;
      return response.data;
    } else {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ${colors.red}✗${colors.reset} Erro: ${error.message}\n`);
    failedTests++;
    return null;
  }
}

/**
 * Executa todos os testes
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📋 TESTE 1: Hierarquia de Organização (CRUD)\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Criar Space
  const spaceData = {
    name: 'Medicina',
    description: 'Conteúdo médico para Revalida',
    color: '#3b82f6'
  };
  const space = await testEndpoint('POST', '/spaces', spaceData, 'Criar Space');

  if (!space) {
    console.log('❌ Falha crítica: Não foi possível criar Space. Abortando testes.\n');
    return;
  }

  const spaceId = space.id;

  // 2. Listar Spaces
  await testEndpoint('GET', '/spaces', null, 'Listar todos os Spaces');

  // 3. Buscar Space por ID
  await testEndpoint('GET', `/spaces/${spaceId}`, null, 'Buscar Space por ID');

  // 4. Criar Stack
  const stackData = {
    name: 'Cardiologia',
    description: 'Tópicos de cardiologia',
    space_id: spaceId
  };
  const stack = await testEndpoint('POST', '/stacks', stackData, 'Criar Stack');

  if (!stack) {
    console.log('❌ Falha: Não foi possível criar Stack.\n');
    return;
  }

  const stackId = stack.id;

  // 5. Listar Stacks
  await testEndpoint('GET', '/stacks', null, 'Listar todos os Stacks');

  // 6. Criar Notebook
  const notebookData = {
    name: 'IAM',
    description: 'Infarto Agudo do Miocárdio',
    stack_id: stackId
  };
  const notebook = await testEndpoint('POST', '/notebooks', notebookData, 'Criar Notebook');

  if (!notebook) {
    console.log('❌ Falha: Não foi possível criar Notebook.\n');
    return;
  }

  const notebookId = notebook.id;

  // 7. Listar Notebooks
  await testEndpoint('GET', '/notebooks', null, 'Listar todos os Notebooks');

  // 8. Criar Note
  const noteData = {
    title: 'IAMCEST',
    content: '<p>Infarto com supra de ST - tratamento urgente</p>',
    notebook_id: notebookId
  };
  const note = await testEndpoint('POST', '/notes', noteData, 'Criar Note');

  if (!note) {
    console.log('❌ Falha: Não foi possível criar Note.\n');
    return;
  }

  const noteId = note.id;

  // 9. Listar Notes
  await testEndpoint('GET', '/notes', null, 'Listar todas as Notes');

  // 10. Buscar Note por ID
  await testEndpoint('GET', `/notes/${noteId}`, null, 'Buscar Note por ID');

  console.log('\n═══════════════════════════════════════════════════════\n');
  console.log('📚 TESTE 2: Sistema de Fontes\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // 11. Listar Sources da Note (deve estar vazio)
  await testEndpoint('GET', `/sources/note/${noteId}`, null, 'Listar Sources da Note');

  console.log('\n═══════════════════════════════════════════════════════\n');
  console.log('🤖 TESTE 3: Integração com IA\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // 12. Health check do Llama.cpp (local)
  await testEndpoint('GET', '/ai/llama/health', null, 'Verificar saúde do Llama.cpp');

  console.log('\n═══════════════════════════════════════════════════════\n');
  console.log('🔄 TESTE 4: Atualização e Deleção (CASCADE)\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // 13. Atualizar Note
  const updatedNoteData = {
    title: 'IAMCEST - Atualizado',
    content: '<p>Conteúdo atualizado</p>'
  };
  await testEndpoint('PUT', `/notes/${noteId}`, updatedNoteData, 'Atualizar Note');

  // 14. Deletar Note (deve deletar sources, tags, progress via CASCADE)
  await testEndpoint('DELETE', `/notes/${noteId}`, null, 'Deletar Note');

  // 15. Deletar Notebook (deve deletar notes via CASCADE)
  await testEndpoint('DELETE', `/notebooks/${notebookId}`, null, 'Deletar Notebook');

  // 16. Deletar Stack (deve deletar notebooks via CASCADE)
  await testEndpoint('DELETE', `/stacks/${stackId}`, null, 'Deletar Stack');

  // 17. Deletar Space (deve deletar stacks via CASCADE)
  await testEndpoint('DELETE', `/spaces/${spaceId}`, null, 'Deletar Space');

  console.log('\n═══════════════════════════════════════════════════════\n');
  console.log('📈 RESULTADOS FINAIS\n');
  console.log('═══════════════════════════════════════════════════════\n');

  const totalTests = passedTests + failedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(`Total de testes: ${totalTests}`);
  console.log(`${colors.green}✓ Passou: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}✗ Falhou: ${failedTests}${colors.reset}`);
  console.log(`Taxa de sucesso: ${successRate}%\n`);

  if (failedTests === 0) {
    console.log(`${colors.green}✅ TODOS OS TESTES PASSARAM!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Alguns testes falharam. Verifique os logs acima.${colors.reset}\n`);
  }
}

// Aguarda um momento para o servidor inicializar, então executa testes
setTimeout(async () => {
  try {
    await runTests();
  } catch (error) {
    console.error('❌ Erro fatal durante os testes:', error.message);
  }
  process.exit(0);
}, 2000);

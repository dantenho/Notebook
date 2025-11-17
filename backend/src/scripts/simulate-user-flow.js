/**
 * ═══════════════════════════════════════════════════════════════
 * SIMULAÇÃO DE FLUXO COMPLETO DE USUÁRIO
 * ═══════════════════════════════════════════════════════════════
 *
 * Simula um estudante de medicina usando o Study Notebook
 * para preparação da Revalida.
 *
 * Cenário:
 * 1. Estudante cria organização hierárquica (Space > Stack > Notebook)
 * 2. Cria notas de estudo
 * 3. Visualiza e edita notas
 * 4. Consulta hierarquia completa
 * 5. Limpa ambiente de teste
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[96m',
  bold: '\x1b[1m'
};

console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`${colors.bold}${colors.cyan}       SIMULAÇÃO DE FLUXO COMPLETO DE USUÁRIO${colors.reset}`);
console.log('═══════════════════════════════════════════════════════════════\n');

/**
 * Helper para fazer requisições
 */
async function apiRequest(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;

  try {
    let response;
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
    return response.data;
  } catch (error) {
    console.error(`${colors.yellow}⚠️  Erro em ${method} ${endpoint}:${colors.reset}`, error.message);
    return null;
  }
}

/**
 * Simula fluxo completo
 */
async function simulateUserFlow() {
  console.log(`${colors.blue}👤 PERSONA:${colors.reset} Dr. João Silva`);
  console.log(`${colors.blue}📚 OBJETIVO:${colors.reset} Preparar para Revalida 2025 - Especialidade: Cardiologia\n`);

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}FASE 1: ORGANIZAÇÃO INICIAL${colors.reset}\n`);

  // 1. Criar Space "Medicina"
  console.log(`${colors.cyan}➜${colors.reset} Criando Space "Medicina"...`);
  const space = await apiRequest('POST', '/spaces', {
    name: 'Medicina',
    description: 'Conteúdo médico para Revalida 2025',
    color: '#3b82f6'
  });

  if (!space) {
    console.log(`${colors.yellow}❌ Falha ao criar Space. Abortando simulação.${colors.reset}\n`);
    return;
  }

  console.log(`${colors.green}✓${colors.reset} Space criado (ID: ${space.id})`);
  console.log(`  Nome: ${space.name}`);
  console.log(`  Cor: ${space.color}\n`);

  // 2. Criar Stack "Cardiologia"
  console.log(`${colors.cyan}➜${colors.reset} Criando Stack "Cardiologia" dentro de "Medicina"...`);
  const stack = await apiRequest('POST', '/stacks', {
    name: 'Cardiologia',
    description: 'Tópicos essenciais de cardiologia para Revalida',
    space_id: space.id,
    color: '#ef4444'
  });

  console.log(`${colors.green}✓${colors.reset} Stack criado (ID: ${stack.id})`);
  console.log(`  Nome: ${stack.name}`);
  console.log(`  Space ID: ${stack.space_id}\n`);

  // 3. Criar Notebook "IAM - Infarto Agudo do Miocárdio"
  console.log(`${colors.cyan}➜${colors.reset} Criando Notebook "IAM" dentro de "Cardiologia"...`);
  const notebook = await apiRequest('POST', '/notebooks', {
    name: 'IAM - Infarto Agudo do Miocárdio',
    description: 'Fisiopatologia, diagnóstico e tratamento',
    stack_id: stack.id
  });

  console.log(`${colors.green}✓${colors.reset} Notebook criado (ID: ${notebook.id})`);
  console.log(`  Nome: ${notebook.name}`);
  console.log(`  Stack ID: ${notebook.stack_id}\n`);

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}FASE 2: CRIAÇÃO DE CONTEÚDO${colors.reset}\n`);

  // 4. Criar Note "IAMCEST"
  console.log(`${colors.cyan}➜${colors.reset} Criando nota "IAMCEST"...`);
  const note1 = await apiRequest('POST', '/notes', {
    title: 'IAMCEST - IAM com Supradesnivelamento de ST',
    content: `
<h2>Fisiopatologia</h2>
<p>Oclusão total de artéria coronária com isquemia transmural.</p>

<h2>Diagnóstico</h2>
<ul>
  <li>Dor torácica > 20 minutos</li>
  <li>ECG: Supra de ST em derivações contíguas</li>
  <li>Troponina elevada</li>
</ul>

<h2>Tratamento</h2>
<ol>
  <li>AAS 200mg VO</li>
  <li>Clopidogrel 300mg VO</li>
  <li>Reperfusão (ICP primária ou fibrinolítico)</li>
  <li>Betabloqueador</li>
  <li>Estatina</li>
</ol>

<h2>Tempo porta-balão</h2>
<p><strong>Meta: < 90 minutos</strong></p>
    `,
    notebook_id: notebook.id
  });

  console.log(`${colors.green}✓${colors.reset} Nota criada (ID: ${note1.id})`);
  console.log(`  Título: ${note1.title}`);
  console.log(`  Tamanho: ${note1.content.length} caracteres\n`);

  // 5. Criar Note "IAMSEST"
  console.log(`${colors.cyan}➜${colors.reset} Criando nota "IAMSEST"...`);
  const note2 = await apiRequest('POST', '/notes', {
    title: 'IAMSEST - IAM sem Supradesnivelamento de ST',
    content: `
<h2>Diferença para IAMCEST</h2>
<p>Oclusão parcial ou transitória da coronária.</p>

<h2>ECG</h2>
<ul>
  <li>Infradesnivelamento de ST</li>
  <li>Inversão de onda T</li>
  <li>Ou ECG normal</li>
</ul>

<h2>Estratificação de Risco (GRACE)</h2>
<p>Define tratamento: conservador vs invasivo</p>

<h2>Tratamento</h2>
<ul>
  <li>Alto risco: Cateterismo em 24h</li>
  <li>Risco moderado: Cateterismo em 72h</li>
  <li>Baixo risco: Tratamento conservador</li>
</ul>
    `,
    notebook_id: notebook.id
  });

  console.log(`${colors.green}✓${colors.reset} Nota criada (ID: ${note2.id})`);
  console.log(`  Título: ${note2.title}\n`);

  // 6. Criar mais um Notebook para outro tópico
  console.log(`${colors.cyan}➜${colors.reset} Criando Notebook "Insuficiência Cardíaca"...`);
  const notebook2 = await apiRequest('POST', '/notebooks', {
    name: 'Insuficiência Cardíaca',
    description: 'IC aguda e crônica',
    stack_id: stack.id
  });

  const note3 = await apiRequest('POST', '/notes', {
    title: 'IC Descompensada',
    content: `
<h2>Classificação</h2>
<p>Killip I, II, III, IV</p>

<h2>Tratamento Agudo</h2>
<ul>
  <li>Furosemida IV</li>
  <li>Nitratos</li>
  <li>Ventilação não invasiva</li>
</ul>
    `,
    notebook_id: notebook2.id
  });

  console.log(`${colors.green}✓${colors.reset} Notebook e nota criados\n`);

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}FASE 3: CONSULTA E NAVEGAÇÃO${colors.reset}\n`);

  // 7. Listar hierarquia completa
  console.log(`${colors.cyan}➜${colors.reset} Consultando hierarquia completa...\n`);

  const spaces = await apiRequest('GET', '/spaces');
  console.log(`${colors.green}📂 Spaces (${spaces.length}):${colors.reset}`);
  for (const s of spaces) {
    console.log(`   ${s.id}. ${s.name} (${s.color || 'sem cor'})`);
  }
  console.log();

  const stacks = await apiRequest('GET', '/stacks');
  console.log(`${colors.green}📚 Stacks (${stacks.length}):${colors.reset}`);
  for (const st of stacks) {
    console.log(`   ${st.id}. ${st.name} → Space ID: ${st.space_id}`);
  }
  console.log();

  const notebooks = await apiRequest('GET', '/notebooks');
  console.log(`${colors.green}📓 Notebooks (${notebooks.length}):${colors.reset}`);
  for (const nb of notebooks) {
    console.log(`   ${nb.id}. ${nb.name} → Stack ID: ${nb.stack_id}`);
  }
  console.log();

  const notes = await apiRequest('GET', '/notes');
  console.log(`${colors.green}📝 Notes (${notes.length}):${colors.reset}`);
  for (const n of notes) {
    console.log(`   ${n.id}. ${n.title.substring(0, 50)}...`);
  }
  console.log();

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}FASE 4: EDIÇÃO DE CONTEÚDO${colors.reset}\n`);

  // 8. Atualizar nota
  console.log(`${colors.cyan}➜${colors.reset} Atualizando nota IAMCEST com informações adicionais...`);
  const updatedNote = await apiRequest('PUT', `/notes/${note1.id}`, {
    title: 'IAMCEST - IAM com Supradesnivelamento de ST [ATUALIZADO]',
    content: note1.content + `\n<h2>Complicações</h2>\n<ul>\n  <li>Choque cardiogênico</li>\n  <li>Ruptura de parede</li>\n  <li>Insuficiência mitral aguda</li>\n</ul>`
  });

  console.log(`${colors.green}✓${colors.reset} Nota atualizada`);
  console.log(`  Novo título: ${updatedNote.title}\n`);

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}FASE 5: VISUALIZAÇÃO FINAL${colors.reset}\n`);

  // 9. Buscar nota específica
  console.log(`${colors.cyan}➜${colors.reset} Buscando nota atualizada...`);
  const fetchedNote = await apiRequest('GET', `/notes/${note1.id}`);
  console.log(`${colors.green}✓${colors.reset} Nota recuperada:`);
  console.log(`  ID: ${fetchedNote.id}`);
  console.log(`  Título: ${fetchedNote.title}`);
  console.log(`  Última atualização: ${fetchedNote.updated_at}`);
  console.log(`  Tamanho: ${fetchedNote.content.length} caracteres\n`);

  // 10. Listar sources (deve estar vazio)
  console.log(`${colors.cyan}➜${colors.reset} Verificando fontes associadas à nota...`);
  const sources = await apiRequest('GET', `/sources/note/${note1.id}`);
  console.log(`${colors.green}✓${colors.reset} Fontes encontradas: ${sources.length}\n`);

  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`${colors.magenta}${colors.bold}RESUMO DA SIMULAÇÃO${colors.reset}\n`);

  console.log(`${colors.green}✅ Fluxo completo executado com sucesso!${colors.reset}\n`);
  console.log('Hierarquia criada:');
  console.log('└── 📂 Medicina (Space)');
  console.log('    └── 📚 Cardiologia (Stack)');
  console.log('        ├── 📓 IAM - Infarto Agudo do Miocárdio (Notebook)');
  console.log('        │   ├── 📝 IAMCEST [ATUALIZADO]');
  console.log('        │   └── 📝 IAMSEST');
  console.log('        └── 📓 Insuficiência Cardíaca (Notebook)');
  console.log('            └── 📝 IC Descompensada');
  console.log();

  console.log(`${colors.blue}📊 Estatísticas:${colors.reset}`);
  console.log(`   Spaces criados: 1`);
  console.log(`   Stacks criados: 1`);
  console.log(`   Notebooks criados: 2`);
  console.log(`   Notas criadas: 3`);
  console.log(`   Notas atualizadas: 1`);
  console.log();

  console.log(`${colors.yellow}🧹 Limpando dados de teste...${colors.reset}`);

  // Limpar tudo via cascade delete do Space
  await apiRequest('DELETE', `/spaces/${space.id}`);
  console.log(`${colors.green}✓${colors.reset} Todos os dados de teste removidos\n`);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`${colors.bold}${colors.green}              SIMULAÇÃO CONCLUÍDA COM SUCESSO!${colors.reset}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Aguarda servidor e executa
setTimeout(async () => {
  try {
    await simulateUserFlow();
  } catch (error) {
    console.error('❌ Erro fatal na simulação:', error.message);
  }
  process.exit(0);
}, 1000);

/**
 * Script de validação do banco de dados
 * Testa criação de tabelas, foreign keys, cascade delete
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando validação do banco de dados...\n');

// Cria banco de teste temporário
const testDbPath = path.join(__dirname, '../../test.sqlite');

// Remove se existir
if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
    console.log('✓ Banco de teste anterior removido\n');
}

const db = new Database(testDbPath);
db.pragma('foreign_keys = ON');

console.log('✓ Banco de teste criado\n');

// Lê e extrai SQL do database.ts
const databaseTs = fs.readFileSync(
    path.join(__dirname, '../db/database.ts'),
    'utf8'
);

const sqlMatch = databaseTs.match(/db\.exec\(`([\s\S]+?)`\);/);
if (!sqlMatch) {
    console.error('✗ Erro: Não foi possível extrair SQL');
    process.exit(1);
}

const sql = sqlMatch[1];

// Executa schema
try {
    db.exec(sql);
    console.log('✓ Schema SQL executado\n');
} catch (error) {
    console.error('✗ Erro ao criar schema:', error.message);
    process.exit(1);
}

// Verifica tabelas criadas
const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name
`).all();

console.log('📊 Tabelas criadas:');

const expectedTables = [
    'ai_settings',
    'learning_trails',
    'note_tags',
    'notebooks',
    'notes',
    'sources',
    'spaces',
    'stacks',
    'study_progress',
    'study_sessions',
    'tags',
    'trail_items'
];

let allFound = true;
for (const tableName of expectedTables) {
    const found = tables.find(t => t.name === tableName);
    if (found) {
        console.log('   ✓', tableName);
    } else {
        console.log('   ✗', tableName, 'FALTANDO!');
        allFound = false;
    }
}

if (!allFound) {
    console.error('\n✗ Erro: Algumas tabelas não foram criadas');
    process.exit(1);
}

console.log(`\n✓ Todas as ${tables.length} tabelas criadas\n`);

// Teste 1: Inserção básica
console.log('🧪 Teste 1: Inserção básica');
try {
    db.prepare('INSERT INTO spaces (name, color) VALUES (?, ?)')
        .run('Medicina', '#3b82f6');

    const space = db.prepare('SELECT * FROM spaces WHERE name = ?')
        .get('Medicina');

    if (space && space.name === 'Medicina') {
        console.log('   ✓ Inserção funcionou');
    } else {
        throw new Error('Inserção falhou');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Teste 2: Foreign Keys
console.log('\n🧪 Teste 2: Foreign Keys');
try {
    const space = db.prepare('SELECT id FROM spaces WHERE name = ?')
        .get('Medicina');

    db.prepare('INSERT INTO stacks (name, space_id) VALUES (?, ?)')
        .run('Cardiologia', space.id);

    const stack = db.prepare('SELECT * FROM stacks WHERE name = ?')
        .get('Cardiologia');

    if (stack && stack.space_id === space.id) {
        console.log('   ✓ Foreign keys funcionando');
    } else {
        throw new Error('Foreign key falhou');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Teste 3: CASCADE DELETE
console.log('\n🧪 Teste 3: CASCADE DELETE');
try {
    const space = db.prepare('SELECT id FROM spaces WHERE name = ?')
        .get('Medicina');

    // Deleta space
    db.prepare('DELETE FROM spaces WHERE id = ?').run(space.id);

    // Verifica se stacks foram deletadas também
    const stacks = db.prepare('SELECT * FROM stacks WHERE space_id = ?')
        .all(space.id);

    if (stacks.length === 0) {
        console.log('   ✓ CASCADE DELETE funcionando');
    } else {
        throw new Error('CASCADE DELETE falhou');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Teste 4: Trilhas de Aprendizado
console.log('\n🧪 Teste 4: Trilhas de Aprendizado');
try {
    // Cria space e trilha
    const spaceId = db.prepare('INSERT INTO spaces (name) VALUES (?)')
        .run('Test Space').lastInsertRowid;

    const trailId = db.prepare(`
        INSERT INTO learning_trails (name, description, space_id, difficulty, estimated_hours)
        VALUES (?, ?, ?, ?, ?)
    `).run('Cardiologia Básica', 'Trilha completa', spaceId, 'intermediate', 10).lastInsertRowid;

    const trail = db.prepare('SELECT * FROM learning_trails WHERE id = ?')
        .get(trailId);

    if (trail && trail.name === 'Cardiologia Básica') {
        console.log('   ✓ Trilhas de aprendizado funcionando');
    } else {
        throw new Error('Criação de trilha falhou');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Teste 5: Sistema de Progresso
console.log('\n🧪 Teste 5: Sistema de Progresso');
try {
    // Cria estrutura completa
    const spaceId = db.prepare('INSERT INTO spaces (name) VALUES (?)')
        .run('Medicine').lastInsertRowid;

    const stackId = db.prepare('INSERT INTO stacks (name, space_id) VALUES (?, ?)')
        .run('Cardiology', spaceId).lastInsertRowid;

    const notebookId = db.prepare('INSERT INTO notebooks (name, stack_id) VALUES (?, ?)')
        .run('AMI', stackId).lastInsertRowid;

    const noteId = db.prepare('INSERT INTO notes (title, content, notebook_id) VALUES (?, ?, ?)')
        .run('STEMI', '<p>Content</p>', notebookId).lastInsertRowid;

    // Cria progresso
    db.prepare(`
        INSERT INTO study_progress (note_id, status, confidence_level)
        VALUES (?, ?, ?)
    `).run(noteId, 'completed', 75);

    const progress = db.prepare('SELECT * FROM study_progress WHERE note_id = ?')
        .get(noteId);

    if (progress && progress.confidence_level === 75) {
        console.log('   ✓ Sistema de progresso funcionando');
    } else {
        throw new Error('Progresso falhou');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Teste 6: Tags
console.log('\n🧪 Teste 6: Sistema de Tags');
try {
    const tagId = db.prepare('INSERT INTO tags (name, color) VALUES (?, ?)')
        .run('importante', '#ef4444').lastInsertRowid;

    const noteId = db.prepare('SELECT id FROM notes LIMIT 1').get().id;

    db.prepare('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)')
        .run(noteId, tagId);

    const noteTags = db.prepare('SELECT * FROM note_tags WHERE note_id = ?')
        .all(noteId);

    if (noteTags.length > 0) {
        console.log('   ✓ Sistema de tags funcionando');
    } else {
        throw new Error('Tags falharam');
    }
} catch (error) {
    console.error('   ✗', error.message);
    process.exit(1);
}

// Estatísticas finais
console.log('\n📊 Estatísticas do Banco:');
console.log(`   - Tabelas: ${tables.length}`);

const counts = {
    spaces: db.prepare('SELECT COUNT(*) as c FROM spaces').get().c,
    stacks: db.prepare('SELECT COUNT(*) as c FROM stacks').get().c,
    notebooks: db.prepare('SELECT COUNT(*) as c FROM notebooks').get().c,
    notes: db.prepare('SELECT COUNT(*) as c FROM notes').get().c,
    trails: db.prepare('SELECT COUNT(*) as c FROM learning_trails').get().c,
    progress: db.prepare('SELECT COUNT(*) as c FROM study_progress').get().c,
    tags: db.prepare('SELECT COUNT(*) as c FROM tags').get().c
};

console.log(`   - Spaces: ${counts.spaces}`);
console.log(`   - Stacks: ${counts.stacks}`);
console.log(`   - Notebooks: ${counts.notebooks}`);
console.log(`   - Notes: ${counts.notes}`);
console.log(`   - Trilhas: ${counts.trails}`);
console.log(`   - Progresso: ${counts.progress}`);
console.log(`   - Tags: ${counts.tags}`);

db.close();

console.log('\n✅ TODOS OS TESTES PASSARAM!\n');
console.log('Banco de dados validado com sucesso.');
console.log(`Arquivo de teste: ${testDbPath}\n`);

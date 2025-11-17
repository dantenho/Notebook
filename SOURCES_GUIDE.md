# Guia de Fontes - Study Notebook

Sistema de gerenciamento de fontes de referência para suas notas, similar ao NotebookLM do Google.

## O que são Fontes?

Fontes são materiais de referência que você pode adicionar às suas notas para enriquecer seu conteúdo com informações de qualidade. A IA utilizará automaticamente essas fontes como contexto ao gerar ou editar texto.

## Tipos de Fontes Suportadas

### 1. PDF 📄
Upload de documentos PDF como artigos, livros, apostilas, etc.

**Características:**
- Extração automática de texto
- Suporte a múltiplas páginas
- Metadados preservados (autor, título, número de páginas)
- Limite: 50MB por arquivo

**Ideal para:**
- Artigos científicos baixados
- Livros médicos
- Apostilas de estudo
- Slides de aula em PDF

### 2. Web 🌐
Extração de conteúdo de páginas web.

**Características:**
- Extração inteligente do conteúdo principal
- Remove scripts, anúncios e navegação
- Preserva título e autores quando disponíveis
- Suporta a maioria dos sites

**Ideal para:**
- Artigos de blogs médicos
- Páginas wiki
- Guias online
- Notícias científicas

### 3. PubMed 🎓
Busca e importação direta de artigos do PubMed.

**Características:**
- Busca integrada na interface
- Importação de resumos completos
- Metadados completos (autores, journal, ano, PMID, DOI)
- Acesso gratuito

**Ideal para:**
- Pesquisa médica
- Artigos científicos peer-reviewed
- Estudos de caso
- Revisões sistemáticas

### 4. SciELO 📚
Busca e importação de artigos do SciELO (foco em português/espanhol).

**Características:**
- Busca em português e espanhol
- Artigos da América Latina
- Texto completo quando disponível
- Metadados completos

**Ideal para:**
- Artigos em português
- Pesquisas brasileiras
- Literatura latino-americana
- Estudos regionais

## Como Usar

### Adicionar Fontes

1. **Abra uma nota**
   - Selecione ou crie uma nota na sidebar

2. **Clique em "Fontes"**
   - Botão no topo da nota mostra quantas fontes já existem

3. **Escolha o tipo de fonte**
   - PDF: Upload de arquivo
   - Web: Digite a URL
   - PubMed: Busque por termos médicos
   - SciELO: Busque em português/espanhol

#### Exemplo: Adicionar artigo do PubMed

```
1. Clique na aba "PubMed"
2. Digite: "myocardial infarction treatment"
3. Clique em "Buscar"
4. Veja os resultados com título, autores, journal
5. Clique em "Adicionar" no artigo desejado
6. O artigo será processado e adicionado às fontes
```

#### Exemplo: Upload de PDF

```
1. Clique na aba "PDF"
2. Selecione o arquivo (.pdf)
3. Veja o nome e tamanho do arquivo
4. Clique em "Adicionar PDF"
5. Aguarde o processamento (extração de texto)
6. PDF estará disponível como fonte
```

### Visualizar Fontes

Na aba "Fontes (N)", você verá a lista de todas as fontes adicionadas:

- **Ícone colorido** indica o tipo (PDF=vermelho, Web=azul, PubMed=verde, SciELO=roxo)
- **Título** da fonte
- **Metadados**: autores, journal, ano (quando disponível)
- **Botões**:
  - 👁️ Ver conteúdo completo
  - 🗑️ Remover fonte

### Usar Fontes com IA

**As fontes são automaticamente incluídas ao usar a IA!**

Quando você tem fontes adicionadas:

1. **Indicador visual**
   - ChatBox mostra: "N fontes de referência serão usadas pela IA"

2. **Contexto automático**
   - A IA recebe o conteúdo das fontes automaticamente
   - Não precisa copiar/colar manualmente

3. **Melhor qualidade**
   - Respostas baseadas em evidências
   - Citações mais precisas
   - Informações atualizadas

#### Exemplo de Prompt com Fontes

**Sem fontes:**
```
Prompt: "Explique o tratamento do IAMCEST"
Resultado: Resposta genérica baseada no conhecimento do modelo
```

**Com fontes (artigos do PubMed sobre IAMCEST):**
```
Prompt: "Explique o tratamento do IAMCEST"
Resultado: Resposta detalhada baseada nos artigos adicionados,
           com protocolos específicos e evidências recentes
```

## Casos de Uso

### 1. Preparação para Revalida

```
Nota: "Cardiologia - Síndromes Coronarianas"

Fontes adicionadas:
- PDF: Diretriz Brasileira de IAM (SBC)
- PubMed: "STEMI management 2024"
- SciELO: "Tratamento do infarto em serviços brasileiros"
- Web: Protocolo do Hospital das Clínicas

Prompt para IA:
"Crie um resumo executivo sobre tratamento de IAMCEST
focando em condutas que caem no Revalida"

Resultado: Resumo com base nas 4 fontes, focado em:
- Protocolo SBC (Brasil específico)
- Evidências recentes (PubMed)
- Realidade brasileira (SciELO)
- Protocolo prático (HC)
```

### 2. Revisão de Literatura

```
Nota: "Diabetes Mellitus - Novas Terapias"

Adicionar 10-15 artigos do PubMed:
- Busca: "diabetes mellitus GLP-1 agonists 2023"
- Selecionar top 10 artigos mais relevantes

Prompt para IA:
"Faça uma revisão comparativa das terapias com
agonistas de GLP-1 baseada nas fontes"

Resultado: Revisão sintética de todos os artigos
```

### 3. Estudo de Caso

```
Nota: "Caso Clínico - Paciente com ICC"

Fontes:
- PDF: Diretriz de IC da ESC
- PubMed: "Heart failure pharmacotherapy"
- Web: Calculadora de NYHA

Prompt para IA:
"Baseado nas diretrizes, qual o manejo ideal
para IC CF III com FE 30%?"

Resultado: Recomendações baseadas nas diretrizes
```

## Dicas e Boas Práticas

### Organização de Fontes

1. **Uma nota por tópico**
   - Ex: "IAMCEST" tem suas próprias fontes
   - Não misture tópicos diferentes

2. **Qualidade > Quantidade**
   - 3-5 fontes de alta qualidade > 20 fontes medianas
   - Foque em artigos recentes e relevantes

3. **Diversifique as fontes**
   - Combine: Diretriz + Artigos + Protocolo prático
   - PDF (teórico) + PubMed (evidência) + Web (prática)

### Para Medicina/Revalida

1. **Sempre inclua diretrizes brasileiras**
   - SBC, SBD, SBPT, etc.
   - Use PDFs das diretrizes oficiais

2. **Artigos recentes do PubMed**
   - Últimos 2-3 anos
   - Foco em RCTs e meta-análises

3. **Protocolos locais**
   - Sites de hospitais escola
   - Protocolos do MS

4. **SciELO para contexto brasileiro**
   - Epidemiologia local
   - Realidade do SUS
   - Adaptações brasileiras

### Prompts Efetivos com Fontes

**❌ Ruim:**
```
"Me fala sobre diabetes"
```

**✅ Bom:**
```
"Com base nas fontes adicionadas, crie uma tabela
comparativa dos critérios diagnósticos de diabetes
segundo ADA e SBD"
```

**✅ Ótimo:**
```
"Usando as diretrizes brasileiras (PDF) e os estudos
do PubMed sobre metformina, explique:
1. Indicações formais
2. Contraindicações
3. Doses e titulação
4. Efeitos adversos principais
Formato: lista objetiva para revisão rápida"
```

## Limitações e Considerações

### Tamanho de Conteúdo

- Cada fonte é limitada a ~2000 caracteres no contexto da IA
- Se o PDF tem 100 páginas, apenas uma parte será usada
- **Solução**: Divida em múltiplas fontes (capítulos separados)

### Precisão

- A IA resume e sintetiza, não cita diretamente
- Sempre confira informações críticas na fonte original
- Use o botão 👁️ para ver o texto completo extraído

### Idioma

- PubMed: principalmente inglês
- SciELO: português, espanhol
- Web: depende do site
- PDF: qualquer idioma, mas extração melhor em textos sem imagens

### Qualidade da Extração

**PDF:**
- ✅ Ótimo: PDFs de texto nativo
- ⚠️ Regular: PDFs escaneados com OCR
- ❌ Ruim: PDFs de imagens puras (tabelas, gráficos)

**Web:**
- ✅ Ótimo: Artigos de blog, notícias
- ⚠️ Regular: Sites com muita formatação
- ❌ Ruim: Sites com paywall, login obrigatório

## Troubleshooting

### "Erro ao fazer upload do PDF"
- Verifique se o arquivo é PDF válido
- Tamanho máximo: 50MB
- Tente comprimir o PDF se muito grande

### "Erro ao extrair conteúdo da web"
- URL deve ser completa (https://...)
- Site pode estar bloqueado
- Tente copiar/colar o conteúdo manualmente

### "Nenhum resultado no PubMed"
- Use termos em inglês
- Simplifique a busca
- Tente sinônimos

### "IA não está usando as fontes"
- Verifique se fontes estão na aba "Fontes (N)"
- Veja o indicador azul no ChatBox
- Fontes vazias (sem conteúdo) não ajudam

## Exemplos Práticos para Revalida

### Cardiologia

```
Nota: "Emergências Cardiológicas"

Fontes:
1. PDF: Diretriz de IAM com Supra de ST (SBC 2020)
2. PubMed: "STEMI primary PCI vs thrombolysis 2023"
3. SciELO: "Perfil do IAM no Brasil"
4. Web: Protocolo SAMU de dor torácica

Prompts úteis:
- "Critérios para fibrinolítico no IAMCEST segundo SBC"
- "Comparação entre ICP primária e fibrinolítico"
- "Fluxograma de decisão baseado nas fontes"
- "Questões de múltipla escolha sobre manejo do IAM"
```

### Infectologia

```
Nota: "Antibióticos - Guia Rápido"

Fontes:
1. PDF: Manual de Antibióticos do HC-FMUSP
2. PubMed: "Antibiotic resistance 2024"
3. Web: Bulário ANVISA - Principais ATB

Prompts:
- "Tabela de doses de ATB para adultos"
- "Espectro de cada classe de antibiótico"
- "Ajuste de dose em IR baseado nas fontes"
```

### Ginecologia

```
Nota: "Pré-natal de Baixo Risco"

Fontes:
1. PDF: Caderno de Atenção Básica - Pré-natal (MS)
2. SciELO: "Suplementação no pré-natal"
3. Web: Calendário de vacinas para gestantes

Prompts:
- "Protocolo completo de pré-natal do MS"
- "Exames por trimestre com interpretação"
- "Vacinas: indicadas e contraindicadas"
```

## Recursos Avançados

### Combinação de Fontes

Combine diferentes tipos para melhor resultado:

```
Tópico: Tratamento da HAS

Fonte teórica (PDF):
- Diretriz Brasileira de Hipertensão

Fonte científica (PubMed):
- "Hypertension treatment outcomes 2024"

Fonte prática (Web):
- Algoritmo de tratamento do UpToDate

Fonte local (SciELO):
- "Aderência a anti-hipertensivos no Brasil"

= Contexto completo: teoria + evidência + prática + realidade local
```

### Atualização de Fontes

- Revise periodicamente suas fontes
- Delete fontes desatualizadas
- Adicione novos estudos conforme publicados
- Mantenha diretrizes atualizadas

### Compartilhamento

- Fontes ficam vinculadas à nota
- Se exportar nota, exporte também as fontes
- PDFs precisam ser re-adicionados se mudar de máquina

## FAQ

**P: Quantas fontes posso adicionar por nota?**
R: Não há limite técnico, mas recomendamos 5-10 fontes relevantes.

**P: As fontes consomem muito espaço?**
R: PDFs são armazenados localmente. Texto extraído fica no banco de dados.

**P: Posso usar a mesma fonte em várias notas?**
R: Não, cada fonte pertence a uma nota. Adicione novamente se necessário.

**P: A IA sempre usa todas as fontes?**
R: Sim, mas cada fonte é limitada a ~2000 caracteres para evitar overflow.

**P: Fontes funcionam com llama.cpp?**
R: Sim! Todas as features de fontes funcionam com qualquer provider.

**P: Posso editar uma fonte depois de adicionada?**
R: Não diretamente. Delete e adicione novamente se necessário.

**P: As fontes substituem meu estudo?**
R: Não! Fontes são complementos. Você ainda precisa ler e entender o material.

---

**Dica Final:** O sistema de fontes é mais poderoso quanto mais específico for seu uso. Ao invés de adicionar 50 artigos gerais sobre medicina, adicione 5 artigos específicos sobre o tópico exato que está estudando. Qualidade > Quantidade!

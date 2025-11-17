# Exemplos de Uso - Study Notebook

Este documento contém exemplos práticos de como usar o Study Notebook para diferentes áreas de conhecimento.

## Medicina

### Estrutura Sugerida

```
📁 Medicina
  📚 Anatomia
    📓 Cabeça e Pescoço
    📓 Tórax
    📓 Abdômen
  📚 Cardiologia
    📓 Síndromes Coronarianas
      📄 IAMCEST
      📄 IAMSEST
      📄 Angina Instável
    📓 Arritmias
    📓 Insuficiência Cardíaca
  📚 Farmacologia
    📓 Cardiovascular
    📓 Antibióticos
```

### Exemplo de Nota: IAMCEST

```html
<h1>IAMCEST - Infarto Agudo do Miocárdio com Supra de ST</h1>

<h2>Definição</h2>
<p>Síndrome coronariana aguda com oclusão total da artéria coronária.</p>

<h2>Critérios Diagnósticos</h2>
<ul>
  <li>Dor precordial típica > 20 minutos</li>
  <li>Elevação do segmento ST ≥ 1mm em derivações contíguas</li>
  <li>Biomarcadores cardíacos elevados</li>
</ul>

<h2>Fluxograma de Atendimento</h2>
```

````mermaid
graph TD
    A[Paciente com Dor Torácica] --> B[ECG em 10 min]
    B --> C{Supra de ST?}
    C -->|Sim| D[IAMCEST]
    C -->|Não| E[Investigar outras causas]
    D --> F{Tempo < 12h?}
    F -->|Sim| G[Reperfusão]
    F -->|Não| H[Estratificação]
    G --> I{ICP disponível?}
    I -->|Sim < 90min| J[Angioplastia Primária]
    I -->|Não| K[Fibrinolítico]
````

```html
<h2>Medicações</h2>
<table>
  <tr>
    <th>Medicação</th>
    <th>Dose</th>
    <th>Via</th>
  </tr>
  <tr>
    <td>AAS</td>
    <td>200-325mg</td>
    <td>VO/Mastigado</td>
  </tr>
  <tr>
    <td>Clopidogrel</td>
    <td>300-600mg</td>
    <td>VO</td>
  </tr>
</table>
```

---

## Tecnologia

### Estrutura Sugerida

```
📁 Tecnologia
  📚 Frontend
    📓 React
      📄 Hooks Essenciais
      📄 Context API
      📄 Performance
    📓 Vue.js
    📓 CSS/Tailwind
  📚 Backend
    📓 Node.js/Express
    📓 Python/Django
    📓 APIs REST
  📚 DevOps
    📓 Docker
    📓 CI/CD
    📓 Kubernetes
```

### Exemplo de Nota: React Hooks

```html
<h1>React Hooks - Guia Essencial</h1>

<h2>useState</h2>
<pre><code class="language-javascript">
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicado {count} vezes
    </button>
  );
}
</code></pre>

<h2>useEffect</h2>
<pre><code class="language-javascript">
useEffect(() => {
  // Executa após render
  document.title = `Você clicou ${count} vezes`;

  // Cleanup (opcional)
  return () => {
    document.title = 'React App';
  };
}, [count]); // Dependências
</code></pre>

<h2>Regras dos Hooks</h2>
<ul>
  <li>Sempre chame no nível superior (não em loops/condições)</li>
  <li>Só chame em componentes React ou custom hooks</li>
  <li>Nomes de custom hooks devem começar com 'use'</li>
</ul>
```

### Exemplo de Nota: Arquitetura de Microsserviços

````mermaid
graph TB
    A[Cliente] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Product Service]
    B --> F[Order Service]

    C --> G[(Auth DB)]
    D --> H[(User DB)]
    E --> I[(Product DB)]
    F --> J[(Order DB)]

    F --> K[Message Queue]
    K --> L[Notification Service]
    K --> M[Email Service]
````

---

## Idiomas

### Estrutura Sugerida

```
📁 Idiomas
  📚 Inglês
    📓 Vocabulário
      📄 Business English
      📄 Phrasal Verbs
      📄 Idioms
    📓 Gramática
      📄 Tempos Verbais
      📄 Conditionals
    📓 Listening/Speaking
  📚 Espanhol
    📓 Básico
    📓 Intermediário
```

### Exemplo de Nota: Phrasal Verbs Comuns

```html
<h1>Phrasal Verbs Essenciais</h1>

<h2>Trabalho</h2>
<table>
  <tr>
    <th>Phrasal Verb</th>
    <th>Significado</th>
    <th>Exemplo</th>
  </tr>
  <tr>
    <td>Take on</td>
    <td>Assumir (responsabilidade)</td>
    <td>I'll take on this project</td>
  </tr>
  <tr>
    <td>Carry out</td>
    <td>Executar, realizar</td>
    <td>We need to carry out the plan</td>
  </tr>
  <tr>
    <td>Figure out</td>
    <td>Descobrir, resolver</td>
    <td>I figured out the solution</td>
  </tr>
</table>

<h2>Vida Diária</h2>
<ul>
  <li><strong>Get up</strong>: Levantar-se</li>
  <li><strong>Give up</strong>: Desistir</li>
  <li><strong>Look after</strong>: Cuidar de</li>
  <li><strong>Run into</strong>: Encontrar por acaso</li>
</ul>
```

---

## Projetos Pessoais

### Estrutura Sugerida

```
📁 Projetos Pessoais
  📚 Casa
    📓 Reformas
      📄 Orçamentos
      📄 Cronograma
    📓 Decoração
  📚 Finanças
    📓 Investimentos
      📄 Ações
      📄 FIIs
      📄 Renda Fixa
    📓 Orçamento Mensal
  📚 Viagens
    📓 Europa 2024
    📓 Planejamento Férias
```

### Exemplo de Nota: Roteiro de Viagem

```html
<h1>Paris - 5 Dias</h1>

<h2>Dia 1 - Chegada e Centro</h2>
<ul>
  <li>Check-in hotel (14h)</li>
  <li>Torre Eiffel (17h) - Pôr do sol</li>
  <li>Jantar no Le Jules Verne</li>
</ul>

<h2>Dia 2 - Museus</h2>
<ul>
  <li>Louvre (9h) - Comprar ingresso online!</li>
  <li>Jardins das Tulherias (12h)</li>
  <li>Musée d'Orsay (15h)</li>
</ul>

<h2>Orçamento</h2>
<table>
  <tr>
    <th>Item</th>
    <th>Valor</th>
  </tr>
  <tr>
    <td>Passagens</td>
    <td>€800</td>
  </tr>
  <tr>
    <td>Hotel (5 noites)</td>
    <td>€600</td>
  </tr>
  <tr>
    <td>Alimentação</td>
    <td>€400</td>
  </tr>
  <tr>
    <td>Atrações</td>
    <td>€200</td>
  </tr>
  <tr>
    <th>Total</th>
    <th>€2000</th>
  </tr>
</table>
```

````mermaid
gantt
    title Roteiro Paris
    dateFormat YYYY-MM-DD
    section Dia 1
    Torre Eiffel           :2024-06-01, 3h
    Jantar                 :2024-06-01, 2h
    section Dia 2
    Louvre                 :2024-06-02, 4h
    Musée d'Orsay         :2024-06-02, 3h
    section Dia 3
    Versailles             :2024-06-03, 8h
````

---

## Fitness & Saúde

### Estrutura Sugerida

```
📁 Fitness & Saúde
  📚 Treinos
    📓 Academia
      📄 Treino A - Peito/Tríceps
      📄 Treino B - Costas/Bíceps
      📄 Treino C - Pernas
    📓 Cardio
  📚 Nutrição
    📓 Dietas
    📓 Receitas Fit
    📓 Suplementação
  📚 Bem-estar
    📓 Meditação
    📓 Sono
```

### Exemplo de Nota: Plano de Treino

```html
<h1>Treino A - Peito e Tríceps</h1>

<h2>Aquecimento</h2>
<ul>
  <li>5 min esteira</li>
  <li>Rotação de ombros: 2x15</li>
</ul>

<h2>Exercícios</h2>
<table>
  <tr>
    <th>Exercício</th>
    <th>Séries x Reps</th>
    <th>Carga</th>
    <th>Descanso</th>
  </tr>
  <tr>
    <td>Supino Reto</td>
    <td>4 x 10</td>
    <td>80kg</td>
    <td>90s</td>
  </tr>
  <tr>
    <td>Supino Inclinado</td>
    <td>3 x 12</td>
    <td>60kg</td>
    <td>60s</td>
  </tr>
  <tr>
    <td>Crucifixo</td>
    <td>3 x 12</td>
    <td>20kg</td>
    <td>60s</td>
  </tr>
  <tr>
    <td>Tríceps Pulley</td>
    <td>3 x 15</td>
    <td>40kg</td>
    <td>45s</td>
  </tr>
  <tr>
    <td>Tríceps Francês</td>
    <td>3 x 12</td>
    <td>30kg</td>
    <td>45s</td>
  </tr>
</table>

<h2>Notas</h2>
<ul>
  <li>Aumentar carga do supino em 5kg na próxima semana</li>
  <li>Foco na contração no crucifixo</li>
  <li>Tempo sob tensão: 3-1-2</li>
</ul>
```

---

## Negócios/Trabalho

### Estrutura Sugerida

```
📁 Trabalho
  📚 Projetos
    📓 Projeto X
      📄 Requisitos
      📄 Reuniões
      📄 Tasks
    📓 Projeto Y
  📚 Reuniões
    📓 1-on-1
    📓 Sprints
  📚 Aprendizado
    📓 Cursos
    📓 Certificações
```

### Exemplo de Nota: Reunião de Sprint Planning

```html
<h1>Sprint Planning - Sprint 23</h1>
<p><strong>Data:</strong> 15/01/2024 | <strong>Duração:</strong> 2h</p>

<h2>Participantes</h2>
<ul>
  <li>Product Owner: Maria</li>
  <li>Scrum Master: João</li>
  <li>Dev Team: 5 pessoas</li>
</ul>

<h2>Meta da Sprint</h2>
<blockquote>
  Implementar autenticação OAuth2 e melhorar performance do dashboard
</blockquote>

<h2>Backlog Selecionado</h2>
<table>
  <tr>
    <th>ID</th>
    <th>História</th>
    <th>Pontos</th>
    <th>Responsável</th>
  </tr>
  <tr>
    <td>US-123</td>
    <td>Implementar login OAuth2</td>
    <td>8</td>
    <td>Carlos</td>
  </tr>
  <tr>
    <td>US-124</td>
    <td>Otimizar queries do dashboard</td>
    <td>5</td>
    <td>Ana</td>
  </tr>
  <tr>
    <td>US-125</td>
    <td>Adicionar cache Redis</td>
    <td>3</td>
    <td>Pedro</td>
  </tr>
</table>

<h2>Riscos Identificados</h2>
<ul>
  <li>OAuth2 pode ter complexidade maior que estimado</li>
  <li>Dependência da API externa do provedor</li>
</ul>
```

---

## Usando IA para Melhorar suas Notas

### Exemplo 1: Expandir Tópico

**Prompt:** "Adicione 3 exemplos práticos de uso de useEffect em React"

### Exemplo 2: Criar Diagrama

**Prompt:** "Crie um diagrama Mermaid mostrando o ciclo de vida de um componente React"

### Exemplo 3: Resumir

**Prompt:** "Resuma este texto em 3 bullet points principais"

### Exemplo 4: Traduzir

**Prompt:** "Traduza esta explicação técnica para linguagem simples que um iniciante entenda"

### Exemplo 5: Checklist

**Prompt:** "Transforme este conteúdo em uma checklist de estudos"

---

## Dicas de Organização

### Para Estudantes

1. **Crie um Space por disciplina**
   - Matemática, Física, Química, etc.

2. **Use Stacks para tópicos principais**
   - Em Matemática: Álgebra, Cálculo, Geometria

3. **Notebooks para subtópicos**
   - Em Cálculo: Limites, Derivadas, Integrais

4. **Use a IA para:**
   - Explicar conceitos difíceis
   - Criar exercícios
   - Resumir capítulos de livros

### Para Profissionais

1. **Space por área de atuação**
   - Desenvolvimento, Marketing, Vendas

2. **Stacks para projetos ou clientes**

3. **Use a IA para:**
   - Escrever relatórios
   - Criar apresentações
   - Brainstorming de ideias

### Para Uso Pessoal

1. **Organize por áreas da vida**
   - Saúde, Finanças, Hobbies

2. **Use diagramas Mermaid para:**
   - Mapas mentais
   - Planejamentos
   - Genealogias

3. **Aproveite a IA para:**
   - Planejar viagens
   - Criar rotinas
   - Organizar metas

---

## Atalhos e Produtividade

### Atalhos do Editor

- `Ctrl/Cmd + B` - Negrito
- `Ctrl/Cmd + I` - Itálico
- `Ctrl/Cmd + Z` - Desfazer
- `Ctrl/Cmd + Shift + Z` - Refazer

### Workflow Sugerido

1. **Captura rápida**: Crie a nota com título e ideias principais
2. **Expansão**: Use a IA para expandir os tópicos
3. **Organização**: Adicione formatação, tabelas e diagramas
4. **Revisão**: Use a IA para revisar e melhorar o texto

### Templates Úteis

Crie notas "template" em cada Stack para padronizar:
- Reuniões
- Revisões de estudo
- Projetos
- Artigos

---

**Lembre-se**: O Study Notebook cresce com você. Comece simples e vá expandindo conforme sua necessidade!

import { modules, glossary, evaluateQuiz, evaluateLab, defaultProgress, normalizeProgress, progressPercent, searchCourse } from './course.js';

const STORAGE_KEY = 'sourei-n8n-course-v1';
const main = document.querySelector('#main');
const nav = document.querySelector('#module-nav');
const sidebar = document.querySelector('#sidebar');
const announcer = document.querySelector('#announcer');
const searchInput = document.querySelector('#search');
const searchPanel = document.querySelector('#search-panel');
let inventory = null;
let examples = null;
let progress = loadProgress();

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeProgress(JSON.parse(stored)) : defaultProgress();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return defaultProgress();
  }
}

function saveProgress(message = '') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  document.documentElement.dataset.theme = progress.theme;
  updateProgressUI();
  if (message) announce(message);
}

function announce(message) {
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = message; });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function renderNavigation() {
  nav.innerHTML = `${modules.map(module => `
    <a class="module-link ${progress.completed.includes(module.id) ? 'done' : ''}" href="#module/${module.id}" data-module="${module.id}">
      <span class="module-index">${progress.completed.includes(module.id) ? '✓' : module.id}</span>
      <span>${escapeHTML(module.title)}</span>
    </a>`).join('')}`;
}

function updateProgressUI() {
  const percent = progressPercent(progress);
  document.querySelector('#progress-label').textContent = `${percent}%`;
  const bar = document.querySelector('#progress-bar');
  bar.setAttribute('aria-valuenow', String(percent));
  bar.querySelector('span').style.width = `${percent}%`;
  renderNavigation();
}

function setActiveNav(id) {
  document.querySelectorAll('.module-link').forEach(link => link.classList.toggle('active', Number(link.dataset.module) === id));
}

function homeTemplate() {
  const completed = progress.completed.length;
  return `
    <section class="hero">
      <span class="eyebrow">Formação prática • n8n + tracking</span>
      <h1>Automações que sobrevivem à produção.</h1>
      <p class="lead">Da leitura de um workflow ao pipeline confiável de purchase. Treine com a arquitetura real da Sourei, usando exemplos sanitizados e laboratórios avaliáveis.</p>
      <div class="hero-actions"><a class="button primary" href="#module/${progress.current}">${completed ? 'Continuar curso' : 'Começar pelo módulo 0'}</a><a class="button" href="#inventory">Explorar inventário</a></div>
    </section>
    <section class="stats" aria-label="Resumo do curso">
      <article class="stat"><strong>13</strong><span>módulos operacionais</span></article>
      <article class="stat"><strong>52</strong><span>questões com explicação</span></article>
      <article class="stat"><strong>${completed}/13</strong><span>módulos concluídos</span></article>
    </section>
    <section class="path"><span class="eyebrow">Trilha completa</span><h2>Aprenda na ordem em que o dado viaja</h2><div class="module-cards">
      ${modules.map(module => `<a class="card module-card" href="#module/${module.id}"><span class="number">MÓDULO ${String(module.id).padStart(2, '0')}</span><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.objectives[0])}. ${escapeHTML(module.objectives[1])}.</p></a>`).join('')}
    </div></section>`;
}

function renderHome() {
  setActiveNav(-1);
  main.innerHTML = `${homeTemplate()}`;
  document.title = 'n8n aplicado | Sourei Lab';
}

function renderQuiz(module) {
  const previousScore = progress.quizScores[module.id];
  return `<section class="quiz" aria-labelledby="quiz-heading"><span class="eyebrow">Checkpoint</span><h2 id="quiz-heading">Quiz do módulo</h2><p class="muted">Escolha uma resposta em cada questão. Você recebe a explicação ao corrigir.</p>
    <form id="quiz-form">
      ${module.quiz.map((question, index) => `<fieldset class="quiz-question"><legend>${index + 1}. ${escapeHTML(question.question)}</legend>${question.options.map((option, optionIndex) => `<label class="option"><input type="radio" name="q${index}" value="${optionIndex}"> <span>${escapeHTML(option)}</span></label>`).join('')}<div id="feedback-${index}" class="feedback" hidden></div></fieldset>`).join('')}
      <button class="button primary" type="submit">Corrigir quiz</button>${previousScore !== undefined ? `<p class="muted">Melhor resultado salvo: ${previousScore}%</p>` : ''}
    </form></section>`;
}

function renderMedia(module) {
  const diagram = `<figure class="course-diagram"><img src="public/${escapeHTML(module.media.diagram)}" alt="Diagrama didático do módulo ${module.id}: ${escapeHTML(module.title)}"><figcaption>Diagrama do módulo. A explicação textual completa está no conteúdo abaixo.</figcaption></figure>`;
  if (!module.media.video) return `<section class="media-section" aria-label="Diagrama do módulo">${diagram}</section>`;
  return `<section class="media-section" aria-labelledby="video-${module.id}"><span class="eyebrow">Microvídeo</span><h2 id="video-${module.id}">Veja o fluxo antes de abrir os detalhes</h2><video controls preload="metadata" poster="${escapeHTML(module.media.poster)}"><source src="${escapeHTML(module.media.video)}" type="video/mp4"><track kind="captions" srclang="pt-BR" label="Português" src="${escapeHTML(module.media.captions)}" default>Seu navegador não reproduz vídeo. Use a transcrição disponível no material do curso.</video><p><a class="transcript-link" href="${escapeHTML(module.media.transcript)}" target="_blank" rel="noopener">Abrir transcrição completa</a></p>${diagram}</section>`;
}

function moduleTemplate(module) {
  const isDone = progress.completed.includes(module.id);
  return `<article>
    <header class="module-header"><span class="eyebrow">Módulo ${String(module.id).padStart(2, '0')} • ${isDone ? 'Concluído' : 'Em andamento'}</span><h1>${escapeHTML(module.title)}</h1><p class="lead">O que você será capaz de executar ao final:</p><ul class="objective-list">${module.objectives.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></header>
    ${renderMedia(module)}
    <section class="lesson" aria-label="Conteúdo do módulo">${module.sections.map((section, index) => `<h2>${index + 1}. ${['Modelo operacional', 'Implementação', 'Validação e operação'][index]}</h2><p>${escapeHTML(section)}</p>`).join('')}</section>
    <aside class="card real-example"><span class="tag">Exemplo real sanitizado</span><h2>${escapeHTML(module.realExample.workflow)}</h2><p>${escapeHTML(module.realExample.analysis)}</p><p class="source">Fonte: data/${escapeHTML(module.realExample.source)}. Parâmetros e credenciais foram omitidos.</p></aside>
    ${renderQuiz(module)}
    <section class="lab card" aria-labelledby="lab-heading"><span class="eyebrow">Mão na massa</span><h2 id="lab-heading">Laboratório avaliável</h2><p>${escapeHTML(module.lab.prompt)}</p><h3>Critérios de aceite</h3><ul class="criteria">${module.lab.criteria.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul><label for="lab-response"><strong>Sua entrega</strong></label><textarea id="lab-response" placeholder="Escreva sua solução. O avaliador procura os conceitos essenciais, mas os critérios acima exigem revisão humana.">${progress.labs[module.id]?.response ? escapeHTML(progress.labs[module.id].response) : ''}</textarea><div class="module-actions"><button id="evaluate-lab" class="button primary" type="button">Avaliar conceitos</button></div><div id="lab-result" class="lab-result" aria-live="polite"></div></section>
    <div class="module-actions"><button id="complete-module" class="button ${isDone ? '' : 'primary'}" type="button">${isDone ? 'Marcar como não concluído' : 'Concluir módulo'}</button></div>
    <nav class="pager" aria-label="Navegação entre módulos">${module.id > 0 ? `<a class="button" href="#module/${module.id - 1}">← ${escapeHTML(modules[module.id - 1].title)}</a>` : '<a class="button" href="#home">← Início</a>'}${module.id < 12 ? `<a class="button" href="#module/${module.id + 1}">${escapeHTML(modules[module.id + 1].title)} →</a>` : '<a class="button primary" href="#progress">Ver meu progresso →</a>'}</nav>
  </article>`;
}

function renderModule(id) {
  const module = modules[id];
  if (!module) { location.hash = '#home'; return; }
  progress.current = id;
  saveProgress();
  setActiveNav(id);
  main.innerHTML = `${moduleTemplate(module)}`;
  document.title = `${id}. ${module.title} | Sourei Lab`;
  document.querySelector('#quiz-form').addEventListener('submit', event => gradeQuiz(event, module));
  document.querySelector('#evaluate-lab').addEventListener('click', () => gradeLab(module));
  document.querySelector('#complete-module').addEventListener('click', () => toggleComplete(module.id));
}

function gradeQuiz(event, module) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  let correct = 0;
  module.quiz.forEach((question, index) => {
    const selectedValue = data.get(`q${index}`);
    const feedback = document.querySelector(`#feedback-${index}`);
    feedback.hidden = false;
    if (selectedValue === null) {
      feedback.className = 'feedback bad';
      feedback.textContent = 'Selecione uma resposta antes de corrigir.';
      return;
    }
    const result = evaluateQuiz(question, Number(selectedValue));
    if (result.correct) correct += 1;
    feedback.className = `feedback ${result.correct ? 'good' : 'bad'}`;
    feedback.textContent = `${result.correct ? 'Correto.' : `Resposta correta: ${result.correctAnswer}.`} ${result.explanation}`;
  });
  const score = Math.round((correct / module.quiz.length) * 100);
  progress.quizScores[module.id] = Math.max(score, Number(progress.quizScores[module.id] || 0));
  saveProgress(`Quiz corrigido. Resultado: ${score}%.`);
}

function gradeLab(module) {
  const response = document.querySelector('#lab-response').value.trim();
  const result = evaluateLab(module.lab, response);
  progress.labs[module.id] = { passed: result.passed, response };
  saveProgress(result.passed ? 'Conceitos essenciais encontrados.' : 'O laboratório ainda tem conceitos ausentes.');
  const target = document.querySelector('#lab-result');
  target.className = `lab-result feedback ${result.passed ? 'good' : 'bad'}`;
  target.textContent = result.passed ? 'Todos os conceitos essenciais foram encontrados. Agora revise sua entrega pelos critérios de aceite.' : `Revise estes conceitos: ${result.missing.join(', ')}.`;
}

function toggleComplete(id) {
  progress.completed = progress.completed.includes(id) ? progress.completed.filter(item => item !== id) : [...progress.completed, id].sort((a, b) => a - b);
  saveProgress(progress.completed.includes(id) ? `Módulo ${id} concluído.` : `Conclusão do módulo ${id} removida.`);
  renderModule(id);
}

async function loadInventory() {
  if (inventory) return inventory;
  const response = await fetch('data/workflow-inventory.safe.json');
  if (!response.ok) throw new Error('Não foi possível carregar o inventário.');
  inventory = await response.json();
  return inventory;
}

async function renderInventory() {
  setActiveNav(-1);
  main.innerHTML = `<header class="module-header"><span class="eyebrow">Base real • dados sanitizados</span><h1>Inventário de workflows</h1><p class="lead">Explore a fotografia segura da operação. IDs internos, parâmetros, credenciais e URLs não são exibidos.</p></header><div id="inventory-content" class="empty">Carregando inventário...</div>`;
  document.title = 'Inventário real | Sourei Lab';
  try {
    const data = await loadInventory();
    const target = document.querySelector('#inventory-content');
    target.className = '';
    target.innerHTML = `<section class="stats"><article class="stat"><strong>${data.count}</strong><span>workflows no snapshot</span></article><article class="stat"><strong>${data.workflows.filter(item => item.active).length}</strong><span>ativos</span></article><article class="stat"><strong>${new Set(data.workflows.flatMap(item => item.trigger_types)).size}</strong><span>tipos de trigger</span></article></section><div class="inventory-toolbar"><label>Filtrar <input id="inventory-filter" type="search" placeholder="Nome ou tipo de nó"></label><label>Estado <select id="inventory-state"><option value="all">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></label></div><p id="inventory-count" class="muted"></p><div class="table-wrap"><table><thead><tr><th>Workflow</th><th>Estado</th><th>Nós</th><th>Triggers</th><th>Atualizado</th></tr></thead><tbody id="inventory-body"></tbody></table></div><p class="notice">Fonte: snapshot seguro da API pública do n8n. A interface omite o hash de identificação e mostra apenas metadados operacionais.</p>`;
    const update = () => renderInventoryRows(data.workflows, document.querySelector('#inventory-filter').value, document.querySelector('#inventory-state').value);
    document.querySelector('#inventory-filter').addEventListener('input', update);
    document.querySelector('#inventory-state').addEventListener('change', update);
    update();
  } catch (error) {
    document.querySelector('#inventory-content').textContent = error.message;
  }
}

function renderInventoryRows(workflows, query, state) {
  const folded = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rows = workflows.filter(item => {
    const matchesText = `${item.name} ${Object.keys(item.node_types).join(' ')}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(folded);
    const matchesState = state === 'all' || (state === 'active' ? item.active : !item.active);
    return matchesText && matchesState;
  });
  document.querySelector('#inventory-count').textContent = `${rows.length} resultado(s).`;
  const body = document.querySelector('#inventory-body');
  body.replaceChildren(...rows.map(item => {
    const row = document.createElement('tr');
    const values = [item.name, item.active ? 'Ativo' : 'Inativo', String(item.node_count), item.trigger_types.map(type => type.split('.').pop()).join(', ') || 'Manual', new Date(item.updatedAt).toLocaleDateString('pt-BR')];
    values.forEach((value, index) => { const cell = document.createElement('td'); cell.textContent = value; if (index === 1 && item.active) cell.className = 'status'; row.append(cell); });
    return row;
  }));
}

async function loadExamples() {
  if (examples) return examples;
  const response = await fetch('data/workflow-examples.safe.json');
  if (!response.ok) throw new Error('Não foi possível carregar os exemplos.');
  examples = await response.json();
  return examples;
}

function nodeLabel(type) {
  return String(type).split('.').pop().replace(/([a-z])([A-Z])/g, '$1 $2');
}

function drawWorkflowGraph(example) {
  const host = document.querySelector('#workflow-graph');
  host.replaceChildren();
  const width = 1200;
  const height = Math.max(520, Math.ceil(example.nodes.length / 8) * 90);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Topologia sanitizada de ${example.name}, com ${example.node_count} nós e ${example.edges.length} conexões.`);
  const byKey = new Map(example.nodes.map((node, index) => [node.key, { ...node, x: 30 + (index % 8) * 145, y: 35 + Math.floor(index / 8) * 90 }]));
  for (const edge of example.edges) {
    const from = byKey.get(edge.from);
    const to = byKey.get(edge.to);
    if (!from || !to) continue;
    const line = document.createElementNS(svg.namespaceURI, 'line');
    line.setAttribute('x1', String(from.x + 118)); line.setAttribute('y1', String(from.y + 28));
    line.setAttribute('x2', String(to.x)); line.setAttribute('y2', String(to.y + 28));
    line.setAttribute('class', 'graph-edge');
    svg.append(line);
  }
  for (const node of byKey.values()) {
    const group = document.createElementNS(svg.namespaceURI, 'g');
    group.setAttribute('class', `graph-node${node.disabled ? ' disabled' : ''}`);
    const title = document.createElementNS(svg.namespaceURI, 'title'); title.textContent = `${node.name}. Tipo ${nodeLabel(node.type)}.`;
    const rect = document.createElementNS(svg.namespaceURI, 'rect'); rect.setAttribute('x', String(node.x)); rect.setAttribute('y', String(node.y)); rect.setAttribute('width', '118'); rect.setAttribute('height', '56'); rect.setAttribute('rx', '10');
    const name = document.createElementNS(svg.namespaceURI, 'text'); name.setAttribute('x', String(node.x + 8)); name.setAttribute('y', String(node.y + 22)); name.textContent = node.name.length > 18 ? `${node.name.slice(0, 17)}…` : node.name;
    const type = document.createElementNS(svg.namespaceURI, 'text'); type.setAttribute('x', String(node.x + 8)); type.setAttribute('y', String(node.y + 42)); type.setAttribute('class', 'graph-type'); type.textContent = nodeLabel(node.type).slice(0, 18);
    group.append(title, rect, name, type); svg.append(group);
  }
  host.append(svg);
}

function renderExampleDetail(example) {
  const counts = example.nodes.reduce((result, node) => { const type = nodeLabel(node.type); result[type] = (result[type] || 0) + 1; return result; }, {});
  const typeCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  document.querySelector('#example-detail').innerHTML = `<section class="stats"><article class="stat"><strong>${example.node_count}</strong><span>nós</span></article><article class="stat"><strong>${example.edges.length}</strong><span>conexões</span></article><article class="stat"><strong>${example.active ? 'Ativo' : 'Inativo'}</strong><span>estado no snapshot</span></article></section><section class="card"><h2>${escapeHTML(example.name)}</h2><p class="muted">Topologia lida da API e sanitizada. Valores de parâmetros, credenciais, URLs e identificadores internos não fazem parte deste material.</p><div class="type-chips">${typeCounts.map(([type, count]) => `<span>${escapeHTML(type)} <b>${count}</b></span>`).join('')}</div></section><div id="workflow-graph" class="workflow-graph" tabindex="0" aria-label="Grafo rolável do workflow"></div><details class="card"><summary>Lista dos nós e campos configuráveis</summary><div class="node-list">${example.nodes.map(node => `<article><strong>${escapeHTML(node.name)}</strong><span>${escapeHTML(nodeLabel(node.type))}</span><small>${node.parameter_fields.length ? `Campos: ${escapeHTML(node.parameter_fields.join(', '))}` : 'Sem campos de parâmetro no snapshot'}</small></article>`).join('')}</div></details>`;
  drawWorkflowGraph(example);
}

async function renderExamples() {
  setActiveNav(-1);
  main.innerHTML = `<header class="module-header"><span class="eyebrow">Casos reais sanitizados</span><h1>Raio-X dos workflows</h1><p class="lead">Abra fluxos simples, intermediários e avançados para entender nós, conexões e responsabilidades sem acessar segredos.</p></header><div id="examples-content" class="empty">Carregando exemplos...</div>`;
  document.title = 'Raio-X dos workflows | Sourei Lab';
  try {
    const data = await loadExamples();
    const target = document.querySelector('#examples-content');
    target.className = '';
    target.innerHTML = `<label class="example-picker"><strong>Workflow para estudar</strong><select id="example-select">${data.examples.map((example, index) => `<option value="${index}">${escapeHTML(example.name)} (${example.node_count} nós)</option>`).join('')}</select></label><div id="example-detail"></div>`;
    const select = document.querySelector('#example-select');
    const update = () => renderExampleDetail(data.examples[Number(select.value)]);
    select.addEventListener('change', update);
    update();
  } catch (error) {
    document.querySelector('#examples-content').textContent = error.message;
  }
}

function renderGlossary() {
  setActiveNav(-1);
  main.innerHTML = `<header class="module-header"><span class="eyebrow">Referência rápida</span><h1>Glossário operacional</h1><p class="lead">Termos que conectam n8n, APIs, identidade, tracking e operação confiável.</p></header><dl class="glossary">${glossary.map(entry => `<div class="card"><dt>${escapeHTML(entry.term)}</dt><dd>${escapeHTML(entry.definition)}</dd></div>`).join('')}</dl>`;
  document.title = 'Glossário | Sourei Lab';
}

function renderMaterials() {
  const materials = [
    ['Guia do instrutor', 'Carga horária, método, avaliação, gates críticos e projeto final.', 'guia-do-instrutor.md'],
    ['Caderno de atividades', 'Quinze práticas que acompanham a trilha, do webhook ao rollback.', 'caderno-de-atividades.md'],
    ['Ficha de debugging', 'Modelo para sintoma, linha do tempo, hipótese, teste e conclusão.', 'ficha-debugging.md'],
    ['Checklist de publicação e rollback', 'Portões antes, durante e depois de uma mudança operacional.', 'checklist-publicacao-rollback.md'],
    ['Fixture de purchase sintético', 'Pedido fictício para laboratórios sem dados de cliente.', 'fixture-purchase-sintetico.json']
  ];
  setActiveNav(-1);
  main.innerHTML = `<header class="module-header"><span class="eyebrow">Pacote interno</span><h1>Materiais práticos</h1><p class="lead">Arquivos para conduzir aulas, executar atividades e padronizar debugging, publicação e avaliação.</p></header><section class="material-grid">${materials.map(([title, description, file]) => `<article class="card"><h2>${escapeHTML(title)}</h2><p class="muted">${escapeHTML(description)}</p><a class="button" href="public/materials/${escapeHTML(file)}" target="_blank" rel="noopener">Abrir material</a></article>`).join('')}</section>`;
  document.title = 'Materiais práticos | Sourei Lab';
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'progresso-curso-n8n-sourei.json';
  anchor.click();
  URL.revokeObjectURL(url);
  announce('Progresso exportado.');
}

async function importProgress(file) {
  if (!file) return;
  try {
    progress = normalizeProgress(JSON.parse(await file.text()));
    saveProgress('Progresso importado com sucesso.');
    renderProgress();
  } catch (error) {
    announce(error.message || 'Arquivo de progresso inválido.');
    alert('Não foi possível importar. Use um arquivo exportado por este curso.');
  }
}

function renderProgress() {
  setActiveNav(-1);
  main.innerHTML = `<header class="module-header"><span class="eyebrow">Portabilidade local</span><h1>Seu progresso, sob seu controle</h1><p class="lead">Os dados ficam somente neste navegador. Exporte um backup ou importe em outro dispositivo.</p></header><section class="stats"><article class="stat"><strong>${progressPercent(progress)}%</strong><span>concluído</span></article><article class="stat"><strong>${progress.completed.length}</strong><span>módulos concluídos</span></article><article class="stat"><strong>${Object.keys(progress.quizScores).length}</strong><span>quizzes respondidos</span></article></section><section class="card"><h2>Backup do progresso</h2><p>O arquivo contém apenas módulos concluídos, notas, respostas dos laboratórios, tema e posição atual. Revise respostas pessoais antes de compartilhar.</p><div class="data-actions"><button id="export-progress" class="button primary">Exportar JSON</button><label class="button">Importar JSON<input id="import-progress" class="sr-only file-input" type="file" accept="application/json"></label><button id="reset-progress" class="button danger">Apagar progresso</button></div></section>`;
  document.querySelector('#export-progress').addEventListener('click', exportProgress);
  document.querySelector('#import-progress').addEventListener('change', event => importProgress(event.target.files[0]));
  document.querySelector('#reset-progress').addEventListener('click', () => { if (confirm('Apagar todo o progresso local?')) { progress = defaultProgress(); saveProgress('Progresso apagado.'); renderProgress(); } });
  document.title = 'Meu progresso | Sourei Lab';
}

function handleSearch() {
  const query = searchInput.value;
  const results = searchCourse(query);
  if (!query.trim()) { searchPanel.hidden = true; return; }
  searchPanel.hidden = false;
  searchPanel.innerHTML = `${results.length ? results.slice(0, 12).map(result => `<a class="search-result" href="${result.kind === 'Módulo' ? `#module/${result.id}` : '#glossary'}"><small>${result.kind}</small><strong>${escapeHTML(result.title)}</strong>${result.definition ? `<span class="muted">${escapeHTML(result.definition)}</span>` : ''}</a>`).join('') : '<div class="empty">Nenhum resultado.</div>'}`;
  announce(`${results.length} resultado(s) encontrado(s).`);
}

function route() {
  searchPanel.hidden = true;
  sidebar.classList.remove('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  const hash = location.hash.replace(/^#/, '') || 'home';
  if (hash.startsWith('module/')) renderModule(Number(hash.split('/')[1]));
  else if (hash === 'inventory') renderInventory();
  else if (hash === 'examples') renderExamples();
  else if (hash === 'materials') renderMaterials();
  else if (hash === 'glossary') renderGlossary();
  else if (hash === 'progress') renderProgress();
  else renderHome();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.querySelector('#menu-toggle').addEventListener('click', event => {
  const open = sidebar.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
document.querySelector('#theme-toggle').addEventListener('click', () => { progress.theme = progress.theme === 'dark' ? 'light' : 'dark'; saveProgress(`Tema ${progress.theme === 'dark' ? 'escuro' : 'claro'} ativado.`); });
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('keydown', event => { if (event.key === 'Escape') { searchInput.value = ''; searchPanel.hidden = true; } });
document.addEventListener('click', event => { if (!searchPanel.contains(event.target) && event.target !== searchInput) searchPanel.hidden = true; });
window.addEventListener('hashchange', route);

document.documentElement.dataset.theme = progress.theme;
updateProgressUI();
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(() => {});

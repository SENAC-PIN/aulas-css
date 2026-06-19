const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const exerciseDir = path.join(root, "exercicios");
const reportFile = path.join(root, "relatorio-exercicios.html");

const markers = {
  html: ["<!-- STUDENT_HTML_START -->", "<!-- STUDENT_HTML_END -->"],
  css: ["/* STUDENT_CSS_START */", "/* STUDENT_CSS_END */"],
};

const placeholderPattern = /Substitua este conte[uú]do pela sua resposta\./i;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripComments(value) {
  return String(value)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
}

function extractRegion(source, [start, end]) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) return null;
  return source.slice(startIndex + start.length, endIndex);
}

function criterion(id, label, hint, test) {
  return { id, label, hint, test };
}

const rubricByName = [
  {
    match: /sintaxe|como-usar|erros/,
    criteria: [
      criterion("css-declaration", "Escreveu uma declaração CSS", "Use o formato property: value; dentro de uma regra CSS.", ({ css }) => /[a-z-]+\s*:\s*[^;{}]+;/i.test(css)),
    ],
  },
  {
    match: /comentarios/,
    criteria: [
      criterion("css-comment", "Adicionou um comentário CSS", "Escreva um comentário usando /* comentário */ dentro da sua área CSS.", ({ rawCss }) => /\/\*[\s\S]*?\*\//.test(rawCss.replace("/* Escreva seu CSS aqui. */", ""))),
    ],
  },
  {
    match: /seletores|combinadores|pseudoclasses|pseudoelementos/,
    criteria: [
      criterion("css-rule", "Criou uma regra com selector", "Crie um selector seguido por { property: value; }.", ({ css }) => /[^{}]+\{[\s\S]*?[a-z-]+\s*:/i.test(css)),
    ],
  },
  {
    match: /cores/,
    criteria: [
      criterion("color-property", "Usou color ou background", "Aplique color ou background a um elemento.", ({ css }) => /\b(?:background(?:-color)?|color)\s*:/i.test(css)),
      criterion("color-format", "Usou um formato de cor CSS", "Use uma cor em HEX, rgb() ou hsl().", ({ css }) => /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(css)),
    ],
  },
  {
    match: /fundos|gradientes/,
    criteria: [criterion("background", "Configurou um background", "Use background ou background-image na sua regra.", ({ css }) => /\bbackground(?:-image|-color)?\s*:/i.test(css))],
  },
  {
    match: /bordas/,
    criteria: [criterion("border", "Configurou uma border", "Adicione border, border-radius ou uma variação de border.", ({ css }) => /\bborder(?:-[a-z-]+)?\s*:/i.test(css))],
  },
  {
    match: /margens/,
    criteria: [criterion("margin", "Usou margin", "Adicione margin ou uma de suas variações.", ({ css }) => /\bmargin(?:-(?:top|right|bottom|left))?\s*:/i.test(css))],
  },
  {
    match: /preenchimento/,
    criteria: [criterion("padding", "Usou padding", "Adicione padding ou uma de suas variações.", ({ css }) => /\bpadding(?:-(?:top|right|bottom|left))?\s*:/i.test(css))],
  },
  {
    match: /altura-largura|largura-maxima/,
    criteria: [criterion("size", "Controlou o tamanho de um elemento", "Use width, height, min-width, max-width, min-height ou max-height.", ({ css }) => /\b(?:min-|max-)?(?:width|height)\s*:/i.test(css))],
  },
  {
    match: /modelo-de-caixa|dimensionamento-de-caixa/,
    criteria: [criterion("box-model", "Usou uma propriedade do Box Model", "Use box-sizing, padding, border ou margin.", ({ css }) => /\b(?:box-sizing|padding|border|margin)(?:-[a-z-]+)?\s*:/i.test(css))],
  },
  {
    match: /contorno/,
    criteria: [criterion("outline", "Usou outline", "Adicione a propriedade outline.", ({ css }) => /\boutline(?:-[a-z-]+)?\s*:/i.test(css))],
  },
  {
    match: /texto|fontes|fontes-personalizadas/,
    criteria: [criterion("typography", "Estilizou o texto", "Use uma propriedade font-*, text-*, line-height ou letter-spacing.", ({ css }) => /\b(?:font(?:-[a-z-]+)?|text-[a-z-]+|line-height|letter-spacing)\s*:/i.test(css))],
  },
  {
    match: /icones|botoes/,
    criteria: [
      criterion("button", "Criou um button", "Inclua um elemento <button> na área HTML.", ({ html }) => /<button\b/i.test(html)),
      criterion("button-style", "Estilizou o button", "Crie uma regra CSS para o button.", ({ css }) => /button[^{}]*\{[\s\S]*?[a-z-]+\s*:/i.test(css)),
    ],
  },
  {
    match: /links|navegacao|paginacao/,
    criteria: [
      criterion("link", "Criou um link", "Inclua um elemento <a> na área HTML.", ({ html }) => /<a\b/i.test(html)),
      criterion("link-state", "Estilizou um estado do link", "Experimente :hover, :focus ou :active.", ({ css }) => /:(?:hover|focus|active)\b/i.test(css)),
    ],
  },
  {
    match: /listas|contadores/,
    criteria: [criterion("list", "Criou uma lista", "Use <ul>, <ol> e elementos <li>.", ({ html }) => /<(?:ul|ol)\b[\s\S]*?<li\b/i.test(html))],
  },
  {
    match: /tabelas/,
    criteria: [criterion("table", "Criou uma table", "Use <table> com células <th> ou <td>.", ({ html }) => /<table\b[\s\S]*?<t[dh]\b/i.test(html))],
  },
  {
    match: /display|bloco-em-linha/,
    criteria: [criterion("display", "Usou display", "Adicione a propriedade display a uma regra CSS.", ({ css }) => /\bdisplay\s*:/i.test(css))],
  },
  {
    match: /posicionamento|deslocamentos-de-posicao|z-index/,
    criteria: [criterion("position", "Usou position", "Adicione position e, se necessário, top, right, bottom ou left.", ({ css }) => /\bposition\s*:/i.test(css))],
  },
  {
    match: /transbordamento/,
    criteria: [criterion("overflow", "Usou overflow", "Use overflow, overflow-x ou overflow-y.", ({ css }) => /\boverflow(?:-[xy])?\s*:/i.test(css))],
  },
  {
    match: /flutuacao/,
    criteria: [criterion("float", "Usou float", "Adicione float: left ou float: right.", ({ css }) => /\bfloat\s*:/i.test(css))],
  },
  {
    match: /alinhamento|flexbox|flex-|container-flex|itens-flex/,
    criteria: [criterion("flex", "Criou um Flex Container", "Aplique display: flex ao container.", ({ css }) => /\bdisplay\s*:\s*(?:inline-)?flex\b/i.test(css))],
  },
  {
    match: /grid|grade/,
    criteria: [
      criterion("grid", "Criou um Grid Container", "Aplique display: grid ao container.", ({ css }) => /\bdisplay\s*:\s*(?:inline-)?grid\b/i.test(css)),
      criterion("grid-columns", "Definiu as colunas do Grid", "Use grid-template-columns para definir as colunas.", ({ css }) => /\bgrid-template-columns\s*:/i.test(css)),
    ],
  },
  {
    match: /pseudoclasses/,
    criteria: [criterion("pseudo-class", "Usou uma pseudo-class", "Use :hover, :focus, :active, :first-child ou :nth-child().", ({ css }) => /:(?:hover|focus|active|first-child|nth-child)\b/i.test(css))],
  },
  {
    match: /pseudoelementos/,
    criteria: [criterion("pseudo-element", "Usou um pseudo-element", "Use ::before, ::after, ::first-letter ou ::first-line.", ({ css }) => /::(?:before|after|first-letter|first-line)\b/i.test(css))],
  },
  {
    match: /opacidade/,
    criteria: [criterion("opacity", "Usou opacity", "Adicione a propriedade opacity com valor entre 0 e 1.", ({ css }) => /\bopacity\s*:/i.test(css))],
  },
  {
    match: /menus-suspensos/,
    criteria: [criterion("dropdown", "Criou a interação do Dropdown", "Combine :hover ou :focus-within com uma mudança de display ou visibility.", ({ css }) => /:(?:hover|focus-within)\b/i.test(css) && /\b(?:display|visibility)\s*:/i.test(css))],
  },
  {
    match: /imagem|imagens|objeto|mascaras|sprites/,
    criteria: [criterion("image", "Trabalhou com uma imagem", "Use <img>, background-image, object-fit, filter, clip-path ou mask.", ({ html, css }) => /<img\b/i.test(html) || /\b(?:background-image|object-fit|object-position|filter|clip-path|mask)\s*:/i.test(css))],
  },
  {
    match: /formularios|atributo/,
    criteria: [criterion("form", "Criou controles de formulário", "Inclua <form>, <label> e <input> ou <button>.", ({ html }) => /<(?:form|input|label|button)\b/i.test(html))],
  },
  {
    match: /unidades/,
    criteria: [criterion("unit", "Usou uma unidade CSS", "Use px, %, rem, em, vw, vh, fr ou outra unidade adequada.", ({ css }) => /(?:^|[\s:(])\d*\.?\d+(?:px|%|rem|em|vw|vh|fr)\b/i.test(css))],
  },
  {
    match: /variaveis|property/,
    criteria: [
      criterion("custom-property", "Declarou uma CSS Custom Property", "Declare uma variável como --cor-principal: #355070;.", ({ css }) => /--[a-z0-9-]+\s*:/i.test(css)),
      criterion("var", "Usou var()", "Consuma a variável com var(--nome-da-variavel).", ({ css }) => /var\(\s*--[a-z0-9-]+/i.test(css)),
    ],
  },
  {
    match: /consultas-de-midia|responsivo|rwd/,
    criteria: [criterion("media-query", "Criou uma Media Query", "Adicione uma regra @media para adaptar o layout.", ({ css }) => /@media\b/i.test(css))],
  },
  {
    match: /supports/,
    criteria: [criterion("supports", "Usou @supports", "Crie uma regra @supports para testar uma funcionalidade.", ({ css }) => /@supports\b/i.test(css))],
  },
  {
    match: /transformacoes-2d|transformacoes-3d/,
    criteria: [criterion("transform", "Usou transform", "Adicione transform com rotate(), scale(), translate() ou outra função.", ({ css }) => /\btransform\s*:/i.test(css))],
  },
  {
    match: /transicoes/,
    criteria: [criterion("transition", "Usou transition", "Adicione a propriedade transition.", ({ css }) => /\btransition(?:-[a-z-]+)?\s*:/i.test(css))],
  },
  {
    match: /animacoes/,
    criteria: [criterion("animation", "Criou uma CSS Animation", "Use @keyframes e aplique animation a um elemento.", ({ css }) => /@keyframes\b/i.test(css) && /\banimation(?:-[a-z-]+)?\s*:/i.test(css))],
  },
  {
    match: /sombras/,
    criteria: [criterion("shadow", "Usou uma shadow", "Adicione box-shadow ou text-shadow.", ({ css }) => /\b(?:box-shadow|text-shadow)\s*:/i.test(css))],
  },
  {
    match: /sass/,
    criteria: [criterion("sass", "Usou um recurso de SASS", "Use uma variável $nome, nesting ou explique a conversão para CSS.", ({ html, rawCss }) => /\$[a-z0-9_-]+|\.scss|sass/i.test(`${html}\n${rawCss}`))],
  },
];

function listExerciseFiles() {
  if (!fs.existsSync(exerciseDir)) throw new Error(`Pasta não encontrada: ${exerciseDir}`);
  return fs.readdirSync(exerciseDir).filter((file) => file.endsWith(".html")).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function getTopicCriteria(fileName) {
  const matches = rubricByName.filter((rubric) => rubric.match.test(fileName));
  const unique = new Map();
  for (const match of matches) for (const item of match.criteria) unique.set(item.id, item);
  return [...unique.values()];
}

function evaluate(fileName) {
  const source = fs.readFileSync(path.join(exerciseDir, fileName), "utf8");
  const rawHtml = extractRegion(source, markers.html);
  const rawCss = extractRegion(source, markers.css);
  const title = source.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, "").trim() || fileName;
  const context = {
    rawHtml: rawHtml || "",
    rawCss: rawCss || "",
    html: stripComments(rawHtml || ""),
    css: stripComments(rawCss || ""),
  };

  const baseCriteria = [
    criterion("html", "Substituiu o HTML inicial", "Remova o texto padrão e escreva sua solução entre STUDENT_HTML_START e STUDENT_HTML_END.", ({ html }) => html.length > 0 && !placeholderPattern.test(html)),
    criterion("css", "Escreveu CSS próprio", "Escreva suas regras entre STUDENT_CSS_START e STUDENT_CSS_END.", ({ css }) => css.length > 0),
  ];
  if (rawHtml === null || rawCss === null) {
    baseCriteria.unshift(criterion("markers", "Mantenha as áreas da resposta", "Restaure os marcadores STUDENT_HTML e STUDENT_CSS para permitir a correção.", () => false));
  }
  const criteria = [...baseCriteria, ...getTopicCriteria(fileName)].map((item) => ({
    id: item.id,
    label: item.label,
    hint: item.hint,
    passed: Boolean(item.test(context)),
  }));
  const passedCount = criteria.filter((item) => item.passed).length;
  const started = !placeholderPattern.test(context.html) || context.css.length > 0;
  const status = passedCount === criteria.length ? "completed" : started ? "in-progress" : "not-started";
  const lessonFile = fileName.replace(/^\d+-/, "");

  return {
    fileName,
    lessonFile,
    title,
    status,
    score: passedCount,
    total: criteria.length,
    percent: Math.round((passedCount / criteria.length) * 100),
    criteria,
  };
}

function renderCriteria(criteria) {
  return `<ul class="criterios">${criteria.map((item) => `<li class="${item.passed ? "passou" : "pendente"}">
    <span class="icone" aria-hidden="true">${item.passed ? "✓" : "○"}</span>
    <div><strong>${escapeHtml(item.label)}</strong>${item.passed ? "" : `<p>${escapeHtml(item.hint)}</p>`}</div>
  </li>`).join("")}</ul>`;
}

function renderHtmlReport(results) {
  const generatedAt = new Date().toLocaleString("pt-BR");
  const completed = results.filter((item) => item.status === "completed").length;
  const inProgress = results.filter((item) => item.status === "in-progress").length;
  const notStarted = results.length - completed - inProgress;
  const progress = results.length ? Math.round((completed / results.length) * 100) : 0;
  const statusLabels = { completed: "Concluído", "in-progress": "Em andamento", "not-started": "Não iniciado" };

  const rows = results.map((result) => `<article class="resultado ${result.status}" data-status="${result.status}" data-search="${escapeHtml(`${result.fileName} ${result.title}`.toLowerCase())}">
    <div class="linha-principal">
      <div>
        <span class="numero">${escapeHtml(result.fileName.match(/^\d+/)?.[0] || "")}</span>
        <h2>${escapeHtml(result.title.replace(/^Exercício\s+\d+\s*:\s*/i, ""))}</h2>
        <div class="links"><a href="exercicios/${encodeURIComponent(result.fileName)}">Abrir exercício</a><a href="aulas/${encodeURIComponent(result.lessonFile)}">Rever aula</a></div>
      </div>
      <div class="pontuacao"><strong>${result.score}/${result.total}</strong><span class="status">${statusLabels[result.status]}</span></div>
    </div>
    <div class="barra pequena"><span style="width:${result.percent}%"></span></div>
    <details ${result.status === "completed" ? "" : "open"}>
      <summary>Ver critérios e dicas</summary>
      ${renderCriteria(result.criteria)}
    </details>
  </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Progresso dos exercícios</title>
  <style>
    :root { --ink:#24313f; --muted:#607080; --line:#d7e0ea; --bg:#f4f7fb; --paper:#fff; --brand:#355070; --green:#2d8a5f; --amber:#a86612; --gray:#718096; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Arial,Helvetica,sans-serif; line-height:1.5; color:var(--ink); background:var(--bg); }
    header { padding:32px 24px; color:#fff; background:var(--brand); }
    header > div, main { max-width:1100px; margin:auto; }
    header h1, header p { margin:0; } header p { margin-top:6px; color:#e8eef4; }
    main { padding:26px 20px 48px; }
    .painel { padding:20px; border:1px solid var(--line); border-radius:10px; background:var(--paper); }
    .resumo { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:20px; }
    .cartao strong { display:block; font-size:28px; } .cartao span { color:var(--muted); }
    .progresso { grid-column:1/-1; } .progresso div:first-child { display:flex; justify-content:space-between; gap:16px; margin-bottom:8px; }
    .barra { height:12px; overflow:hidden; border-radius:999px; background:#e3e9ef; } .barra span { display:block; height:100%; background:var(--green); }
    .barra.pequena { height:6px; margin:14px 0; }
    .ferramentas { position:sticky; top:0; z-index:2; display:flex; flex-wrap:wrap; gap:10px; margin-bottom:18px; padding:12px; border:1px solid var(--line); background:rgba(255,255,255,.96); }
    input { flex:1 1 240px; min-width:0; padding:10px 12px; border:1px solid #aebdcc; border-radius:6px; font:inherit; }
    button { padding:9px 12px; border:1px solid var(--line); border-radius:6px; color:var(--ink); background:#fff; cursor:pointer; }
    button.ativo { border-color:var(--brand); color:#fff; background:var(--brand); }
    .resultado { margin-bottom:14px; padding:18px; border:1px solid var(--line); border-left:7px solid var(--gray); border-radius:9px; background:#fff; }
    .resultado.completed { border-left-color:var(--green); } .resultado.in-progress { border-left-color:var(--amber); }
    .linha-principal { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; }
    h2 { display:inline; margin:0; font-size:19px; } .numero { margin-right:8px; color:var(--muted); font-weight:bold; }
    .links { display:flex; gap:14px; margin-top:5px; } a { color:var(--brand); }
    .pontuacao { display:flex; flex-direction:column; align-items:flex-end; gap:5px; white-space:nowrap; }
    .pontuacao > strong { font-size:20px; } .status { padding:4px 9px; border-radius:999px; color:#fff; background:var(--gray); font-size:12px; font-weight:bold; }
    .completed .status { background:var(--green); } .in-progress .status { background:var(--amber); }
    details { border-top:1px solid var(--line); padding-top:10px; } summary { cursor:pointer; font-weight:bold; }
    .criterios { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:14px 0 0; padding:0; list-style:none; }
    .criterios li { display:flex; gap:9px; padding:11px; border-radius:7px; background:#f7f9fb; } .criterios .icone { color:var(--amber); font-size:20px; } .criterios .passou .icone { color:var(--green); }
    .criterios p { margin:3px 0 0; color:var(--muted); font-size:14px; }
    .vazio { display:none; padding:30px; text-align:center; color:var(--muted); }
    .comando { margin-top:18px; color:var(--muted); font-size:14px; } code { padding:2px 6px; border-radius:4px; background:#e8eef4; }
    @media (max-width:760px) { .resumo { grid-template-columns:repeat(2,1fr); } .criterios { grid-template-columns:1fr; } .linha-principal { display:grid; } .pontuacao { align-items:flex-start; } }
  </style>
</head>
<body>
  <header><div><h1>Progresso dos exercícios</h1><p>Feedback automático gerado em ${escapeHtml(generatedAt)}</p></div></header>
  <main>
    <section class="resumo">
      <div class="painel cartao"><strong>${results.length}</strong><span>Total</span></div>
      <div class="painel cartao"><strong>${completed}</strong><span>Concluídos</span></div>
      <div class="painel cartao"><strong>${inProgress}</strong><span>Em andamento</span></div>
      <div class="painel cartao"><strong>${notStarted}</strong><span>Não iniciados</span></div>
      <div class="painel progresso"><div><strong>Progresso geral</strong><span>${progress}%</span></div><div class="barra"><span style="width:${progress}%"></span></div></div>
    </section>
    <section class="ferramentas painel" aria-label="Filtros">
      <input id="busca" type="search" placeholder="Buscar exercício ou assunto…" aria-label="Buscar exercício">
      <button class="ativo" data-filter="all">Todos</button>
      <button data-filter="completed">Concluídos</button>
      <button data-filter="in-progress">Em andamento</button>
      <button data-filter="not-started">Não iniciados</button>
    </section>
    <section id="resultados">${rows}</section>
    <p id="vazio" class="painel vazio">Nenhum exercício corresponde ao filtro.</p>
    <p class="comando">Depois de editar os exercícios, execute <code>node scripts/corrigir_exercicios.js</code> para atualizar este relatório.</p>
  </main>
  <script>
    const search = document.querySelector("#busca");
    const buttons = [...document.querySelectorAll("[data-filter]")];
    const cards = [...document.querySelectorAll(".resultado")];
    let activeFilter = "all";
    function filterCards() {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      for (const card of cards) {
        const show = (activeFilter === "all" || card.dataset.status === activeFilter) && card.dataset.search.includes(term);
        card.hidden = !show;
        if (show) visible++;
      }
      document.querySelector("#vazio").style.display = visible ? "none" : "block";
    }
    search.addEventListener("input", filterCards);
    for (const button of buttons) button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      for (const item of buttons) item.classList.toggle("ativo", item === button);
      filterCards();
    });
  </script>
</body>
</html>`;
}

function formatResult(result) {
  const labels = { completed: "concluído", "in-progress": "em andamento", "not-started": "não iniciado" };
  const pending = result.criteria.filter((item) => !item.passed).map((item) => `  - ${item.label}: ${item.hint}`);
  return [`${result.fileName}: ${labels[result.status]} (${result.score}/${result.total})`, ...pending].join("\n");
}

try {
  const results = listExerciseFiles().map(evaluate);
  fs.writeFileSync(reportFile, renderHtmlReport(results), "utf8");
  console.log(["Correção concluída", ...results.map(formatResult), "", `Relatório salvo em: ${reportFile}`].join("\n"));
} catch (error) {
  console.error(`Erro ao corrigir exercícios: ${error.message}`);
  process.exitCode = 1;
}

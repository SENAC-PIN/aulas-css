const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const exerciseDir = path.join(root, "exercicios");
const reportFile = path.join(root, "relatorio-exercicios.html");
const progressFile = path.join(root, "progresso-aluno.json");

const markers = {
  html: ["<!-- STUDENT_HTML_START -->", "<!-- STUDENT_HTML_END -->"],
  css: ["/* STUDENT_CSS_START */", "/* STUDENT_CSS_END */"],
  reflection: ["<!-- STUDENT_REFLECTION_START -->", "<!-- STUDENT_REFLECTION_END -->"],
};

const placeholderPattern = /Substitua este conte[uú]do pela sua resposta\./i;
const reflectionPlaceholderPattern = /Explique com suas palavras uma decis[aã]o tomada na sua solu[cç][aã]o\./i;

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
    match: /icones/,
    criteria: [
      criterion("icon-element", "Criou um ícone real", "Use SVG, uma fonte de ícones ou uma técnica de background/mask.", ({ html, css }) => /<svg\b|<i\b[^>]*class=["'][^"']*icon/i.test(html) || /\b(?:background-image|mask-image|-webkit-mask-image)\s*:/i.test(css)),
      criterion("icon-style", "Controlou o ícone por CSS", "Defina tamanho e cor ou preenchimento do ícone.", ({ css }) => /\b(?:width|font-size)\s*:/i.test(css) && /\b(?:color|fill|stroke|background(?:-color)?)\s*:/i.test(css)),
    ],
  },
  {
    match: /listas/,
    criteria: [criterion("list-style", "Personalizou os marcadores", "Use list-style, list-style-type ou ::marker.", ({ css }) => /\blist-style(?:-[a-z-]+)?\s*:|::marker\b/i.test(css))],
  },
  {
    match: /transbordamento-x-e-y/,
    criteria: [
      criterion("overflow-x", "Controlou o eixo horizontal", "Use overflow-x.", ({ css }) => /\boverflow-x\s*:/i.test(css)),
      criterion("overflow-y", "Controlou o eixo vertical", "Use overflow-y.", ({ css }) => /\boverflow-y\s*:/i.test(css)),
    ],
  },
  {
    match: /sprites-de-imagem/,
    criteria: [
      criterion("sprite-image", "Usou uma única imagem de sprite", "Defina background-image no elemento do sprite.", ({ css }) => /\bbackground-image\s*:/i.test(css)),
      criterion("sprite-position", "Recortou o sprite", "Use background-position com valores diferentes.", ({ css }) => /\bbackground-position\s*:/i.test(css)),
    ],
  },
  {
    match: /fontes-personalizadas/,
    criteria: [
      criterion("font-face", "Registrou uma fonte", "Declare uma regra @font-face.", ({ css }) => /@font-face\b/i.test(css)),
      criterion("font-source", "Definiu a origem da fonte", "Inclua src e aplique a font-family registrada.", ({ css }) => /\bsrc\s*:/i.test(css) && /\bfont-family\s*:/i.test(css)),
    ],
  },
  {
    match: /otimizacao/,
    criteria: [criterion("reusable-style", "Criou estilos reutilizáveis", "Use uma classe base compartilhada e pelo menos um modificador.", ({ html, css }) => /class=["'][^"']*\b[a-z0-9_-]+\s+[a-z0-9_-]+/i.test(html) && (css.match(/\.[a-z0-9_-]+\s*\{/gi) || []).length >= 2)],
  },
  {
    match: /modal-de-imagem/,
    criteria: [
      criterion("image-modal", "Criou a camada modal", "Use dialog ou uma camada posicionada sobre a viewport.", ({ html, css }) => /<dialog\b/i.test(html) || /\bposition\s*:\s*fixed\b/i.test(css)),
      criterion("modal-state", "Criou estados de abrir e fechar", "Use :target, uma classe de estado ou dialog.", ({ html, css }) => /<dialog\b/i.test(html) || /:target\b|\.(?:aberto|ativo|open)\b/i.test(css)),
    ],
  },
  {
    match: /formatos-de-imagem/,
    criteria: [criterion("image-shape", "Recortou a imagem", "Use clip-path com circle(), ellipse() ou polygon().", ({ css }) => /\bclip-path\s*:\s*(?:circle|ellipse|polygon)\(/i.test(css))],
  },
  {
    match: /posicao-de-objeto/,
    criteria: [criterion("object-position", "Posicionou o conteúdo da imagem", "Use object-position em uma imagem com tamanho limitado.", ({ css }) => /\bobject-position\s*:/i.test(css))],
  },
  {
    match: /mascaras/,
    criteria: [criterion("mask-image", "Aplicou uma máscara", "Use mask-image ou -webkit-mask-image.", ({ css }) => /\b(?:-webkit-)?mask-image\s*:/i.test(css))],
  },
  {
    match: /paginacao/,
    criteria: [
      criterion("page-links", "Criou links de páginas", "Inclua pelo menos três links na paginação.", ({ html }) => (html.match(/<a\b/gi) || []).length >= 3),
      criterion("current-page", "Identificou a página atual", "Use aria-current=\"page\" e estilize esse estado.", ({ html, css }) => /aria-current\s*=\s*["']page["']/i.test(html) && /aria-current/i.test(css)),
    ],
  },
  {
    match: /-property/,
    criteria: [criterion("at-property", "Registrou a custom property", "Declare @property com syntax, inherits e initial-value.", ({ css }) => /@property\s+--[a-z0-9-]+/i.test(css) && /\bsyntax\s*:|\binherits\s*:|\binitial-value\s*:/i.test(css))],
  },
  {
    match: /itens-flex/,
    criteria: [criterion("flex-item", "Configurou um Flex Item", "Use order, flex-grow, flex-shrink, flex-basis ou align-self.", ({ css }) => /\b(?:order|flex-grow|flex-shrink|flex-basis|align-self)\s*:/i.test(css))],
  },
  {
    match: /flex-responsivo/,
    criteria: [
      criterion("flex-wrap", "Permitiu a quebra dos itens", "Use flex-wrap: wrap.", ({ css }) => /\bflex-wrap\s*:\s*wrap\b/i.test(css)),
      criterion("flex-breakpoint", "Adaptou o Flexbox", "Use @media ou uma base flexível que reorganize os itens.", ({ css }) => /@media\b/i.test(css) || /\bflex\s*:\s*[^;]*\b(?:%|px|rem)\b/i.test(css)),
    ],
  },
  {
    match: /itens-grid/,
    criteria: [criterion("grid-item", "Posicionou um Grid Item", "Use grid-column, grid-row ou grid-area.", ({ css }) => /\bgrid-(?:column|row|area)(?:-[a-z]+)?\s*:/i.test(css))],
  },
  {
    match: /layout-grid-12-colunas/,
    criteria: [
      criterion("twelve-columns", "Criou 12 colunas", "Use grid-template-columns: repeat(12, 1fr).", ({ css }) => /grid-template-columns\s*:\s*repeat\(\s*12\s*,/i.test(css)),
      criterion("column-span", "Distribuiu os elementos", "Use grid-column com span.", ({ css }) => /\bgrid-column\s*:[^;]*\bspan\b/i.test(css)),
    ],
  },
  {
    match: /rwd-visao-em-grade/,
    criteria: [criterion("responsive-grid", "Alterou a grade por breakpoint", "Use @media para mudar grid-template-columns.", ({ css }) => /@media\b[\s\S]*grid-template-columns\s*:/i.test(css))],
  },
  {
    match: /rwd-imagens/,
    criteria: [
      criterion("fluid-image", "Criou uma imagem fluida", "Use width/max-width responsivo e height: auto.", ({ css }) => /\b(?:width|max-width)\s*:\s*100%/i.test(css) && /\bheight\s*:\s*auto\b/i.test(css)),
      criterion("responsive-source", "Ofereceu fontes responsivas", "Use picture, source ou srcset.", ({ html }) => /<(?:picture|source)\b|\bsrcset\s*=/i.test(html)),
    ],
  },
  {
    match: /rwd-modelos/,
    criteria: [criterion("responsive-template", "Criou um template responsivo", "Use áreas de Grid e um breakpoint.", ({ css }) => /grid-template-areas\s*:/i.test(css) && /@media\b/i.test(css))],
  },
  {
    match: /css-responsivo/,
    criteria: [criterion("fluid-layout", "Criou um layout fluido", "Use flex-wrap, auto-fit/auto-fill ou medidas flexíveis.", ({ css }) => /\bflex-wrap\s*:\s*wrap\b|repeat\(\s*auto-(?:fit|fill)|\bmax-width\s*:/i.test(css))],
  },
  {
    match: /rwd-introducao/,
    criteria: [criterion("fluid-component", "Criou um componente fluido", "Combine width flexível com max-width.", ({ css }) => /\bwidth\s*:\s*100%/i.test(css) && /\bmax-width\s*:/i.test(css))],
  },
  {
    match: /rwd-janela-de-visualizacao/,
    criteria: [criterion("viewport-unit", "Usou unidades da viewport", "Use vw, vh, vmin ou vmax.", ({ css }) => /\d*\.?\d+(?:vw|vh|vmin|vmax)\b/i.test(css))],
  },
  {
    match: /rwd-videos/,
    criteria: [criterion("video-ratio", "Preservou a proporção do vídeo", "Use aspect-ratio ou padding proporcional.", ({ css }) => /\baspect-ratio\s*:|padding-(?:bottom|top)\s*:\s*56\.25%/i.test(css))],
  },
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
    match: /css-posicionamento/,
    criteria: [
      criterion("position-flow", "Comparou static e relative", "Use position: static e position: relative para comparar o fluxo normal e o deslocamento.", ({ css }) => /\bposition\s*:\s*static\b/i.test(css) && /\bposition\s*:\s*relative\b/i.test(css)),
      criterion("position-absolute", "Demonstrou absolute", "Use position: absolute dentro de um ancestral posicionado e aplique offsets.", ({ css }) => /\bposition\s*:\s*absolute\b/i.test(css) && /\b(?:top|right|bottom|left|inset)\s*:/i.test(css)),
      criterion("position-fixed", "Demonstrou fixed", "Inclua um elemento com position: fixed.", ({ css }) => /\bposition\s*:\s*fixed\b/i.test(css)),
      criterion("position-sticky", "Demonstrou sticky", "Use position: sticky com um limite como top: 0.", ({ css }) => /\bposition\s*:\s*sticky\b/i.test(css) && /\b(?:top|bottom)\s*:/i.test(css)),
    ],
  },
  {
    match: /deslocamentos-de-posicao/,
    criteria: [
      criterion("four-offsets", "Usou os quatro offsets", "Demonstre top, right, bottom e left.", ({ css }) => ["top", "right", "bottom", "left"].every((property) => new RegExp(`\\b${property}\\s*:`).test(css))),
      criterion("inset", "Usou a shorthand inset", "Adicione um exemplo com inset.", ({ css }) => /\binset\s*:/i.test(css)),
    ],
  },
  {
    match: /css-z-index/,
    criteria: [
      criterion("z-index-values", "Criou níveis de empilhamento", "Use pelo menos dois valores de z-index em elementos sobrepostos.", ({ css }) => (css.match(/\bz-index\s*:\s*-?\d+/gi) || []).length >= 2),
      criterion("stacking-context", "Criou um contexto de empilhamento", "Use isolation, transform ou outra propriedade que crie um contexto local.", ({ css }) => /\bisolation\s*:\s*isolate\b|\btransform\s*:|\bopacity\s*:\s*0?\.\d+/i.test(css)),
    ],
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
    match: /consultas-de-midia|rwd-frameworks/,
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
    match: /098-css-sass/,
    criteria: [
      criterion("sass-variable", "Criou e usou uma variável SASS", "Declare $nome: valor; e use $nome em uma propriedade.", ({ rawCss }) => {
        const names = [...rawCss.matchAll(/\$([a-z0-9_-]+)\s*:/gi)].map((match) => match[1]);
        return names.some((name) => new RegExp(`\\$${name}\\b[\\s\\S]*\\$${name}\\b`, "i").test(rawCss));
      }),
      criterion("sass-feature", "Usou um recurso estrutural de SASS", "Use nesting com &, @mixin/@include ou outra construção SASS.", ({ rawCss }) => /&\s*:[a-z-]+|@mixin\b|@include\b/i.test(rawCss)),
    ],
  },
  {
    match: /099-tutorial-sass/,
    criteria: [
      criterion("sass-mixin", "Criou um mixin SASS", "Declare um mixin com @mixin e pelo menos um parâmetro.", ({ rawCss }) => /@mixin\s+[a-z0-9_-]+\s*\([^)]*\$[a-z0-9_-]+/i.test(rawCss)),
      criterion("sass-include", "Reutilizou o mixin", "Aplique o mixin com @include.", ({ rawCss }) => /@include\s+[a-z0-9_-]+/i.test(rawCss)),
    ],
  },
  {
    match: /sass-legado-nao-utilizado/,
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
  const rawReflection = extractRegion(source, markers.reflection);
  const title = source.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, "").trim() || fileName;
  const context = {
    rawHtml: rawHtml || "",
    rawCss: rawCss || "",
    html: stripComments(rawHtml || ""),
    css: stripComments(rawCss || ""),
    reflection: stripComments(rawReflection || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  };

  const baseCriteria = [
    criterion("html", "Substituiu o HTML inicial", "Remova o texto padrão e escreva sua solução entre STUDENT_HTML_START e STUDENT_HTML_END.", ({ html }) => html.length > 0 && !placeholderPattern.test(html)),
    criterion("css", "Escreveu CSS próprio", "Escreva suas regras entre STUDENT_CSS_START e STUDENT_CSS_END.", ({ css }) => css.length > 0),
    criterion("reflection", "Explicou uma decisão da solução", "Escreva com suas palavras uma justificativa de pelo menos 40 caracteres no Registro de autoria.", ({ reflection }) => reflection.length >= 40 && !reflectionPlaceholderPattern.test(reflection)),
  ];
  if (rawHtml === null || rawCss === null || rawReflection === null) {
    baseCriteria.unshift(criterion("markers", "Mantenha as áreas da resposta", "Restaure os marcadores STUDENT_HTML, STUDENT_CSS e STUDENT_REFLECTION para permitir a correção.", () => false));
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

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readProgress() {
  const empty = {
    version: 1,
    profile: { name: "Estudante" },
    history: { activityDates: [], completedAt: {}, hintsUsed: {} },
    snapshot: {},
  };
  if (!fs.existsSync(progressFile)) return empty;

  const saved = JSON.parse(fs.readFileSync(progressFile, "utf8"));
  return {
    ...empty,
    ...saved,
    profile: { ...empty.profile, ...(saved.profile || {}) },
    history: { ...empty.history, ...(saved.history || {}) },
    snapshot: saved.snapshot || {},
  };
}

function calculateStreak(activityDates) {
  const dates = [...new Set(activityDates)].sort().reverse();
  if (dates.length === 0) return 0;

  const today = new Date(`${localDateKey()}T00:00:00`);
  const latest = new Date(`${dates[0]}T00:00:00`);
  const daysSinceLatest = Math.round((today - latest) / 86400000);
  if (daysSinceLatest > 1) return 0;

  let streak = 1;
  for (let index = 1; index < dates.length; index++) {
    const previous = new Date(`${dates[index - 1]}T00:00:00`);
    const current = new Date(`${dates[index]}T00:00:00`);
    if (Math.round((previous - current) / 86400000) !== 1) break;
    streak++;
  }
  return streak;
}

function hasCompletedRange(results, first, last) {
  return results
    .filter((result) => {
      const number = Number(result.fileName.match(/^\d+/)?.[0]);
      return number >= first && number <= last;
    })
    .every((result) => result.status === "completed");
}

function deriveBadges(results) {
  const completed = results.filter((result) => result.status === "completed").length;
  const badges = [
    { id: "first-step", name: "First Step", description: "Concluiu a primeira missão.", unlocked: completed >= 1 },
    { id: "cascade-apprentice", name: "Cascade Apprentice", description: "Concluiu 10 missões.", unlocked: completed >= 10 },
    { id: "flexbox-explorer", name: "Flexbox Explorer", description: "Dominou as missões de Flexbox.", unlocked: hasCompletedRange(results, 76, 80) },
    { id: "grid-architect", name: "Grid Architect", description: "Dominou as missões de CSS Grid.", unlocked: hasCompletedRange(results, 81, 85) },
    { id: "responsive-ranger", name: "Responsive Ranger", description: "Concluiu a jornada de Responsive Design.", unlocked: hasCompletedRange(results, 87, 95) },
    { id: "css-master", name: "CSS Master", description: "Concluiu todas as missões.", unlocked: completed === results.length && results.length > 0 },
  ];
  return badges;
}

function updateProgress(results) {
  const progress = readProgress();
  const today = localDateKey();
  const changed = results.some((result) => {
    const previous = progress.snapshot[result.fileName];
    if (!previous) return result.status !== "not-started";
    return previous.score !== result.score || previous.status !== result.status;
  });

  if (changed && !progress.history.activityDates.includes(today)) {
    progress.history.activityDates.push(today);
  }

  for (const result of results) {
    if (result.status === "completed" && !progress.history.completedAt[result.fileName]) {
      progress.history.completedAt[result.fileName] = new Date().toISOString();
    }
  }

  progress.snapshot = Object.fromEntries(results.map((result) => [result.fileName, {
    status: result.status,
    score: result.score,
    total: result.total,
  }]));

  const completed = results.filter((result) => result.status === "completed").length;
  const passedCriteria = results.reduce((total, result) => total + result.score, 0);
  const xp = passedCriteria * 10 + completed * 50;
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const badges = deriveBadges(results);

  progress.derived = {
    generatedAt: new Date().toISOString(),
    xp,
    level,
    currentLevelXp,
    nextLevelXp: 500,
    streak: calculateStreak(progress.history.activityDates),
    completed,
    badges: badges.filter((badge) => badge.unlocked).map((badge) => badge.id),
  };

  if (fs.existsSync(progressFile)) {
    fs.copyFileSync(progressFile, path.join(root, "progresso-aluno.backup.json"));
  }
  fs.writeFileSync(progressFile, `${JSON.stringify(progress, null, 2)}\n`, "utf8");
  return { progress, badges };
}

function renderCriteria(criteria) {
  return `<ul class="criterios">${criteria.map((item) => `<li class="${item.passed ? "passou" : "pendente"}">
    <span class="icone" aria-hidden="true">${item.passed ? "✓" : "○"}</span>
    <div><strong>${escapeHtml(item.label)}</strong>${item.passed ? "" : `<p>${escapeHtml(item.hint)}</p>`}</div>
  </li>`).join("")}</ul>`;
}

function renderHtmlReport(results, game) {
  const generatedAt = new Date().toLocaleString("pt-BR");
  const completed = results.filter((item) => item.status === "completed").length;
  const inProgress = results.filter((item) => item.status === "in-progress").length;
  const notStarted = results.length - completed - inProgress;
  const progress = results.length ? Math.round((completed / results.length) * 100) : 0;
  const statusLabels = { completed: "Concluído", "in-progress": "Em andamento", "not-started": "Não iniciado" };
  const { profile, derived } = game.progress;
  const unlockedBadges = game.badges.filter((badge) => badge.unlocked);
  const profileName = profile.name === "Estudante" ? "" : profile.name;
  const progressForBrowser = JSON.stringify(game.progress).replace(/</g, "\\u003c");

  const rows = results.map((result) => {
    const focus = result.criteria.find((item) => !["markers", "html", "css", "reflection"].includes(item.id))?.label || "a organização do seu código";
    return `<article class="resultado ${result.status}" data-status="${result.status}" data-search="${escapeHtml(`${result.fileName} ${result.title}`.toLowerCase())}">
    <div class="linha-principal">
      <div>
        <span class="numero">${escapeHtml(result.fileName.match(/^\d+/)?.[0] || "")}</span>
        <h2>${escapeHtml(result.title.replace(/^Exercício\s+\d+\s*:\s*/i, ""))}</h2>
        <div class="links"><a href="exercicios/${encodeURIComponent(result.fileName)}">Abrir exercício</a><a href="aulas/${encodeURIComponent(result.lessonFile)}">Rever aula</a></div>
      </div>
      <div class="pontuacao"><strong>${result.score}/${result.total}</strong><span class="status">${statusLabels[result.status]}</span></div>
    </div>
    <div class="barra pequena"><span style="width:${result.percent}%"></span></div>
    <details>
      <summary>Ver critérios e dicas</summary>
      ${renderCriteria(result.criteria)}
      <div class="autoria">
        <strong>Checkpoint de autoria</strong>
        <p>Prepare-se para explicar, sem consultar ferramentas, como sua solução atende ao critério “${escapeHtml(focus)}” e para fazer uma pequena alteração solicitada pelo professor.</p>
      </div>
    </details>
  </article>`;
  }).join("\n");

  const badges = game.badges.map((badge) => `<li class="${badge.unlocked ? "desbloqueado" : "bloqueado"}">
    <span aria-hidden="true">${badge.unlocked ? "🏅" : "◇"}</span>
    <div><strong>${escapeHtml(badge.name)}</strong><p>${escapeHtml(badge.description)}</p></div>
  </li>`).join("");

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
    .jogador { display:grid; grid-template-columns:auto 1fr auto; gap:18px; align-items:center; margin-bottom:16px; color:#fff; background:linear-gradient(135deg,#355070,#23364d); }
    .nivel { display:grid; place-items:center; width:76px; height:76px; border:3px solid #fff; border-radius:50%; text-align:center; } .nivel strong { display:block; font-size:26px; line-height:1; }
    .jogador h2 { display:block; margin:8px 0 6px; font-size:22px; } .jogador p { margin:0; color:#dce6ef; }
    .jogador .barra { margin-top:10px; background:rgba(255,255,255,.22); } .jogador .barra span { background:#f4c95d; }
    .campo-nome label { display:block; margin-bottom:5px; color:#dce6ef; font-size:13px; font-weight:bold; }
    .controle-nome { display:flex; gap:8px; } .controle-nome input { flex:1; min-width:140px; padding:8px 10px; border:1px solid rgba(255,255,255,.45); border-radius:6px; font:inherit; }
    .controle-nome button { padding:8px 12px; border:0; border-radius:6px; color:var(--brand); background:#fff; font-weight:bold; cursor:pointer; }
    .mensagem-nome { min-height:20px; margin-top:4px !important; font-size:12px; }
    .metricas-jogo { display:flex; gap:16px; text-align:center; } .metricas-jogo strong { display:block; font-size:22px; } .metricas-jogo span { color:#dce6ef; font-size:13px; }
    .resumo { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:20px; }
    .cartao strong { display:block; font-size:28px; } .cartao span { color:var(--muted); }
    .progresso { grid-column:1/-1; } .progresso div:first-child { display:flex; justify-content:space-between; gap:16px; margin-bottom:8px; }
    .barra { height:12px; overflow:hidden; border-radius:999px; background:#e3e9ef; } .barra span { display:block; height:100%; background:var(--green); }
    .barra.pequena { height:6px; margin:14px 0; }
    .ferramentas { position:sticky; top:0; z-index:2; display:flex; flex-wrap:wrap; gap:10px; margin-bottom:18px; padding:12px; border:1px solid var(--line); background:rgba(255,255,255,.96); }
    input { flex:1 1 240px; min-width:0; padding:10px 12px; border:1px solid #aebdcc; border-radius:6px; font:inherit; }
    button { padding:9px 12px; border:1px solid var(--line); border-radius:6px; color:var(--ink); background:#fff; cursor:pointer; }
    button.ativo { border-color:var(--brand); color:#fff; background:var(--brand); }
    button:disabled { cursor:wait; opacity:.65; }
    .botao-corrigir { border-color:var(--green); color:#fff; background:var(--green); font-weight:bold; }
    .status-correcao { align-self:center; flex:1 1 100%; color:var(--muted); font-size:13px; }
    .status-correcao.sucesso { color:var(--green); } .status-correcao.erro { color:#a33b3b; }
    #resultados { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; align-items:start; }
    .resultado { min-width:0; padding:14px 16px; border:1px solid var(--line); border-left:7px solid var(--gray); border-radius:9px; background:#fff; }
    .resultado.completed { border-left-color:var(--green); } .resultado.in-progress { border-left-color:var(--amber); }
    .linha-principal { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; }
    h2 { display:inline; margin:0; font-size:19px; } .numero { margin-right:8px; color:var(--muted); font-weight:bold; }
    .links { display:flex; gap:14px; margin-top:5px; } a { color:var(--brand); }
    .pontuacao { display:flex; flex-direction:column; align-items:flex-end; gap:5px; white-space:nowrap; }
    .pontuacao > strong { font-size:20px; } .status { padding:4px 9px; border-radius:999px; color:#fff; background:var(--gray); font-size:12px; font-weight:bold; }
    .completed .status { background:var(--green); } .in-progress .status { background:var(--amber); }
    .resultado details { border-top:1px solid var(--line); padding-top:8px; } .resultado summary { cursor:pointer; font-weight:bold; font-size:14px; }
    .criterios { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:14px 0 0; padding:0; list-style:none; }
    .criterios li { display:flex; gap:9px; padding:11px; border-radius:7px; background:#f7f9fb; } .criterios .icone { color:var(--amber); font-size:20px; } .criterios .passou .icone { color:var(--green); }
    .criterios p { margin:3px 0 0; color:var(--muted); font-size:14px; }
    .autoria { margin-top:12px; padding:12px 14px; border-left:4px solid var(--brand); background:#edf3f8; } .autoria p { margin:4px 0 0; }
    .bloco-retratil { margin-bottom:12px; } .bloco-retratil > summary { display:flex; justify-content:space-between; align-items:center; gap:16px; cursor:pointer; list-style:none; } .bloco-retratil > summary::-webkit-details-marker { display:none; }
    .bloco-retratil > summary::after { content:"+"; display:grid; place-items:center; width:28px; height:28px; border-radius:50%; color:#fff; background:var(--brand); font-size:20px; }
    .bloco-retratil[open] > summary::after { content:"−"; }
    .bloco-retratil[open] > summary { margin-bottom:14px; }
    .conquistas h2 { display:block; margin:0; }
    .badges { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:0; padding:0; list-style:none; }
    .badges li { display:flex; gap:10px; padding:12px; border:1px solid var(--line); border-radius:8px; } .badges li > span { font-size:24px; } .badges p { margin:2px 0 0; color:var(--muted); font-size:13px; }
    .badges .bloqueado { opacity:.5; filter:grayscale(1); }
    .integridade { margin-bottom:18px; border-left:6px solid #76558d; } .integridade h2 { display:block; margin:0 0 6px; } .integridade p { margin:5px 0; }
    .acoes { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; } .acoes a { display:inline-block; padding:9px 12px; border-radius:6px; color:#fff; background:var(--brand); text-decoration:none; }
    .vazio { display:none; padding:30px; text-align:center; color:var(--muted); }
    .paginacao-relatorio { display:flex; justify-content:center; align-items:center; gap:12px; margin:18px 0; } .paginacao-relatorio button { min-width:94px; } .paginacao-relatorio span { color:var(--muted); font-size:14px; }
    .comando { margin-top:18px; color:var(--muted); font-size:14px; } code { padding:2px 6px; border-radius:4px; background:#e8eef4; }
    @media (max-width:760px) { .jogador { grid-template-columns:auto 1fr; } .metricas-jogo { grid-column:1/-1; justify-content:space-around; } .resumo { grid-template-columns:repeat(2,1fr); } #resultados,.criterios,.badges { grid-template-columns:1fr; } .linha-principal { display:grid; } .pontuacao { align-items:flex-start; } }
  </style>
</head>
<body>
  <header><div><h1>Progresso dos exercícios</h1><p>Feedback automático gerado em ${escapeHtml(generatedAt)}</p></div></header>
  <main>
    <section class="painel jogador">
      <div class="nivel"><span>Nível</span><strong>${derived.level}</strong></div>
      <div>
        <div class="campo-nome"><label for="nome-estudante">Nome do estudante</label><div class="controle-nome"><input id="nome-estudante" value="${escapeHtml(profileName)}" maxlength="80" autocomplete="name" placeholder="Digite seu nome"><button id="salvar-nome" type="button">Salvar nome</button></div><p id="mensagem-nome" class="mensagem-nome" aria-live="polite"></p></div>
        <h2>Olá, <span id="nome-relatorio">${escapeHtml(profileName || "Estudante")}</span>!</h2><p>${derived.xp} XP acumulados</p><div class="barra"><span style="width:${Math.round((derived.currentLevelXp / derived.nextLevelXp) * 100)}%"></span></div><p>${derived.currentLevelXp}/${derived.nextLevelXp} XP para o próximo nível</p>
      </div>
      <div class="metricas-jogo"><div><strong>${derived.streak}</strong><span>dias de sequência</span></div><div><strong>${unlockedBadges.length}</strong><span>badges</span></div></div>
    </section>
    <section class="resumo">
      <div class="painel cartao"><strong>${results.length}</strong><span>Total</span></div>
      <div class="painel cartao"><strong>${completed}</strong><span>Concluídos</span></div>
      <div class="painel cartao"><strong>${inProgress}</strong><span>Em andamento</span></div>
      <div class="painel cartao"><strong>${notStarted}</strong><span>Não iniciados</span></div>
      <div class="painel progresso"><div><strong>Progresso geral</strong><span>${progress}%</span></div><div class="barra"><span style="width:${progress}%"></span></div></div>
    </section>
    <details class="painel conquistas bloco-retratil"><summary><h2>Badges da jornada (${unlockedBadges.length}/${game.badges.length})</h2></summary><ul class="badges">${badges}</ul></details>
    <details class="painel integridade bloco-retratil">
      <summary><h2>Autoria, aprendizagem e backup</h2></summary>
      <div><p>O objetivo não é detectar IA — detectores são pouco confiáveis. Cada missão exige uma reflexão escrita e pode incluir uma breve defesa oral ou alteração ao vivo do código.</p>
      <p>O estudante deve conseguir explicar as próprias decisões e modificar sua solução sem ajuda externa.</p>
      <div class="acoes"><a id="baixar-progresso" href="progresso-aluno.json" download="progresso-aluno.json">Baixar backup do progresso</a></div></div>
    </details>
    <section class="ferramentas painel" aria-label="Filtros">
      <button id="corrigir-agora" class="botao-corrigir" type="button">Corrigir atividades agora</button>
      <input id="busca" type="search" placeholder="Buscar exercício ou assunto…" aria-label="Buscar exercício">
      <button class="ativo" data-filter="all">Todos</button>
      <button data-filter="completed">Concluídos</button>
      <button data-filter="in-progress">Em andamento</button>
      <button data-filter="not-started">Não iniciados</button>
      <span id="status-correcao" class="status-correcao" aria-live="polite"></span>
    </section>
    <section id="resultados">${rows}</section>
    <p id="vazio" class="painel vazio">Nenhum exercício corresponde ao filtro.</p>
    <nav id="paginacao-relatorio" class="paginacao-relatorio" aria-label="Paginação dos exercícios"><button id="pagina-anterior" type="button">Anterior</button><span id="info-pagina"></span><button id="proxima-pagina" type="button">Próxima</button></nav>
    <div class="comando">
      <p>Para usar o botão de correção, inicie o curso com <code>node scripts/iniciar_curso.js</code> e abra <code>http://127.0.0.1:3000</code>.</p>
      <p>Como alternativa, execute <code>node scripts/corrigir_exercicios.js</code> para atualizar XP, badges e relatório.</p>
      <p>Defina o perfil com <code>node scripts/gerenciar_progresso.js perfil "Nome"</code>. Use os comandos <code>exportar</code> e <code>importar</code> para levar o progresso a outro computador.</p>
    </div>
  </main>
  <script>
    const progressData = ${progressForBrowser};
    const nameInput = document.querySelector("#nome-estudante");
    const reportName = document.querySelector("#nome-relatorio");
    const nameMessage = document.querySelector("#mensagem-nome");
    const cachedName = localStorage.getItem("cssQuestStudentName");
    if (cachedName) {
      nameInput.value = cachedName;
      reportName.textContent = cachedName;
    }
    document.querySelector("#salvar-nome").addEventListener("click", async () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameMessage.textContent = "Digite um nome antes de salvar.";
        nameInput.focus();
        return;
      }
      localStorage.setItem("cssQuestStudentName", name);
      reportName.textContent = name;
      nameMessage.textContent = "Nome salvo e exibido neste relatório.";
      if (location.protocol !== "file:") {
        try {
          const response = await fetch("/api/perfil", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error(result.message);
          nameMessage.textContent = "Nome salvo no relatório e no backup do progresso.";
        } catch {
          nameMessage.textContent = "Nome salvo neste navegador; não foi possível atualizar o JSON.";
        }
      }
    });
    document.querySelector("#baixar-progresso").addEventListener("click", (event) => {
      const name = nameInput.value.trim() || "Estudante";
      progressData.profile.name = name;
      const blob = new Blob([JSON.stringify(progressData, null, 2) + "\\n"], { type: "application/json" });
      event.currentTarget.href = URL.createObjectURL(blob);
      setTimeout(() => URL.revokeObjectURL(event.currentTarget.href), 1000);
    });
    const correctionButton = document.querySelector("#corrigir-agora");
    const correctionStatus = document.querySelector("#status-correcao");
    correctionButton.addEventListener("click", async () => {
      correctionStatus.className = "status-correcao";
      if (location.protocol === "file:") {
        correctionStatus.classList.add("erro");
        correctionStatus.textContent = "Inicie com node scripts/iniciar_curso.js e abra o relatório pelo endereço localhost.";
        return;
      }
      correctionButton.disabled = true;
      correctionButton.textContent = "Corrigindo…";
      correctionStatus.textContent = "Analisando as respostas e recalculando o progresso.";
      try {
        const response = await fetch("/api/corrigir", { method: "POST" });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.message || "Falha na correção.");
        correctionStatus.classList.add("sucesso");
        correctionStatus.textContent = result.message;
        setTimeout(() => location.reload(), 700);
      } catch (error) {
        correctionStatus.classList.add("erro");
        correctionStatus.textContent = error.message + " Confirme se o servidor local está ativo.";
        correctionButton.disabled = false;
        correctionButton.textContent = "Corrigir atividades agora";
      }
    });
    const search = document.querySelector("#busca");
    const buttons = [...document.querySelectorAll("[data-filter]")];
    const cards = [...document.querySelectorAll(".resultado")];
    const previousPageButton = document.querySelector("#pagina-anterior");
    const nextPageButton = document.querySelector("#proxima-pagina");
    const pageInfo = document.querySelector("#info-pagina");
    const pagination = document.querySelector("#paginacao-relatorio");
    const pageSize = 12;
    let activeFilter = "all";
    let currentPage = 1;
    let filteredCards = cards;
    function renderPage() {
      const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      for (const card of cards) card.hidden = true;
      const start = (currentPage - 1) * pageSize;
      for (const card of filteredCards.slice(start, start + pageSize)) card.hidden = false;
      pageInfo.textContent = "Página " + currentPage + " de " + totalPages + " · " + filteredCards.length + " exercício(s)";
      previousPageButton.disabled = currentPage === 1;
      nextPageButton.disabled = currentPage === totalPages;
      pagination.hidden = filteredCards.length === 0;
      document.querySelector("#vazio").style.display = filteredCards.length ? "none" : "block";
    }
    function filterCards() {
      const term = search.value.trim().toLowerCase();
      filteredCards = cards.filter((card) => (activeFilter === "all" || card.dataset.status === activeFilter) && card.dataset.search.includes(term));
      currentPage = 1;
      renderPage();
    }
    search.addEventListener("input", filterCards);
    for (const button of buttons) button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      for (const item of buttons) item.classList.toggle("ativo", item === button);
      filterCards();
    });
    previousPageButton.addEventListener("click", () => {
      if (currentPage > 1) currentPage--;
      renderPage();
      document.querySelector(".ferramentas").scrollIntoView({ behavior: "smooth" });
    });
    nextPageButton.addEventListener("click", () => {
      if (currentPage * pageSize < filteredCards.length) currentPage++;
      renderPage();
      document.querySelector(".ferramentas").scrollIntoView({ behavior: "smooth" });
    });
    filterCards();
  </script>
</body>
</html>`;
}

function formatResult(result) {
  const labels = { completed: "concluído", "in-progress": "em andamento", "not-started": "não iniciado" };
  const pending = result.criteria.filter((item) => !item.passed).map((item) => `  - ${item.label}: ${item.hint}`);
  return [`${result.fileName}: ${labels[result.status]} (${result.score}/${result.total})`, ...pending].join("\n");
}

function correctExercises() {
  const results = listExerciseFiles().map(evaluate);
  const game = updateProgress(results);
  fs.writeFileSync(reportFile, renderHtmlReport(results, game), "utf8");
  return { results, game, progressFile, reportFile };
}

if (require.main === module) {
  try {
    const { results } = correctExercises();
    console.log(["Correção concluída", ...results.map(formatResult), "", `Progresso salvo em: ${progressFile}`, `Relatório salvo em: ${reportFile}`].join("\n"));
  } catch (error) {
    console.error(`Erro ao corrigir exercícios: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { correctExercises };

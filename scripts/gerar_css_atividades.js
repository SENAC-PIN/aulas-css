const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lessonDir = path.join(root, "aulas");
const exerciseDir = path.join(root, "exercicios");
const assetDir = path.join(root, "assets");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replaceAll("@", "at")
    .replaceAll("!", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const portugueseFiles = {
  "CSS Syntax": "css-sintaxe.html",
  "CSS Selectors": "css-seletores.html",
  "CSS How To": "css-como-usar.html",
  "CSS Comments": "css-comentarios.html",
  "CSS Errors": "css-erros.html",
  "CSS Colors": "css-cores.html",
  "CSS Backgrounds": "css-fundos.html",
  "CSS Borders": "css-bordas.html",
  "CSS Margins": "css-margens.html",
  "CSS Padding": "css-preenchimento.html",
  "CSS Height / Width": "css-altura-largura.html",
  "CSS Box Model": "css-modelo-de-caixa.html",
  "CSS Outline": "css-contorno.html",
  "CSS Text": "css-texto.html",
  "CSS Fonts": "css-fontes.html",
  "CSS Icons": "css-icones.html",
  "CSS Links": "css-links.html",
  "CSS Lists": "css-listas.html",
  "CSS Tables": "css-tabelas.html",
  "CSS Display": "css-display.html",
  "CSS Max-width": "css-largura-maxima.html",
  "CSS Position": "css-posicionamento.html",
  "CSS Position Offsets": "css-deslocamentos-de-posicao.html",
  "CSS Z-index": "css-z-index.html",
  "CSS Overflow": "css-transbordamento.html",
  "Overflow": "transbordamento.html",
  "Overflow X and Y": "transbordamento-x-e-y.html",
  "Code Challenge": "desafio-de-codigo.html",
  "CSS Float": "css-flutuacao.html",
  "CSS Inline-block": "css-bloco-em-linha.html",
  "CSS Align": "css-alinhamento.html",
  "CSS Combinators": "css-combinadores.html",
  "CSS Pseudo-classes": "css-pseudoclasses.html",
  "CSS Pseudo-elements": "css-pseudoelementos.html",
  "CSS Opacity": "css-opacidade.html",
  "CSS Navigation Bars": "css-barras-de-navegacao.html",
  "CSS Dropdowns": "css-menus-suspensos.html",
  "CSS Image Gallery": "css-galeria-de-imagens.html",
  "CSS Image Sprites": "css-sprites-de-imagem.html",
  "CSS Attribute Selectors": "css-seletores-de-atributo.html",
  "CSS Forms": "css-formularios.html",
  "CSS Counters": "css-contadores.html",
  "CSS Units": "css-unidades.html",
  "CSS Inheritance": "css-heranca.html",
  "CSS Specificity": "css-especificidade.html",
  "CSS !important": "css-important.html",
  "CSS Math Functions": "css-funcoes-matematicas.html",
  "CSS Optimization": "css-otimizacao.html",
  "CSS Accessibility": "css-acessibilidade.html",
  "CSS Website Layout": "css-layout-de-site.html",
  "CSS Gradients": "css-gradientes.html",
  "CSS Shadows": "css-sombras.html",
  "CSS Text Effects": "css-efeitos-de-texto.html",
  "CSS Custom Fonts": "css-fontes-personalizadas.html",
  "CSS 2D Transforms": "css-transformacoes-2d.html",
  "CSS 3D Transforms": "css-transformacoes-3d.html",
  "CSS Transitions": "css-transicoes.html",
  "CSS Animations": "css-animacoes.html",
  "CSS Tooltips": "css-dicas.html",
  "CSS Image Styling": "css-estilizacao-de-imagens.html",
  "CSS Image Modal": "css-modal-de-imagem.html",
  "CSS Image Centering": "css-centralizacao-de-imagem.html",
  "CSS Image Filters": "css-filtros-de-imagem.html",
  "CSS Image Shapes": "css-formatos-de-imagem.html",
  "CSS object-fit": "css-ajuste-de-objeto.html",
  "CSS object-position": "css-posicao-de-objeto.html",
  "CSS Masking": "css-mascaras.html",
  "CSS Buttons": "css-botoes.html",
  "CSS Pagination": "css-paginacao.html",
  "CSS Multiple Columns": "css-multiplas-colunas.html",
  "CSS User Interface": "css-interface-de-usuario.html",
  "CSS Variables": "css-variaveis.html",
  "CSS @property": "css-property.html",
  "CSS Box Sizing": "css-dimensionamento-de-caixa.html",
  "CSS Media Queries": "css-consultas-de-midia.html",
  "CSS FLEXBOX": "css-flexbox.html",
  "Flexbox Intro": "flexbox-introducao.html",
  "Flex Container": "container-flex.html",
  "Flex Items": "itens-flex.html",
  "Flex Responsive": "flex-responsivo.html",
  "CSS GRID": "css-grid.html",
  "Grid Intro": "grid-introducao.html",
  "Grid Container": "container-grid.html",
  "Grid Items": "itens-grid.html",
  "Grid 12-column Layout": "layout-grid-12-colunas.html",
  "CSS @supports": "css-supports.html",
  "CSS RESPONSIVE": "css-responsivo.html",
  "RWD Intro": "rwd-introducao.html",
  "RWD Viewport": "rwd-janela-de-visualizacao.html",
  "RWD Grid View": "rwd-visao-em-grade.html",
  "RWD Media Queries": "rwd-consultas-de-midia.html",
  "RWD Images": "rwd-imagens.html",
  "RWD Videos": "rwd-videos.html",
  "RWD Frameworks": "rwd-frameworks.html",
  "RWD Templates": "rwd-modelos.html",
  "CSS CERT": "css-certificacao.html",
  "CSS Certificate": "css-certificado.html",
  "CSS SASS": "css-sass.html",
  "SASS Tutorial": "tutorial-sass.html",
};

const technicalTitles = {
  "CSS Syntax": "CSS Syntax",
  "CSS Selectors": "CSS Selectors",
  "CSS How To": "CSS How To",
  "CSS Comments": "CSS Comments",
  "CSS Errors": "CSS Errors",
  "CSS Colors": "CSS Colors",
  "CSS Backgrounds": "CSS Backgrounds",
  "CSS Borders": "CSS Borders",
  "CSS Margins": "CSS Margins",
  "CSS Padding": "CSS Padding",
  "CSS Height / Width": "CSS Height / Width",
  "CSS Box Model": "CSS Box Model",
  "CSS Outline": "CSS Outline",
  "CSS Text": "CSS Text",
  "CSS Fonts": "CSS Fonts",
  "CSS Icons": "CSS Icons",
  "CSS Links": "CSS Links",
  "CSS Lists": "CSS Lists",
  "CSS Tables": "CSS Tables",
  "CSS Display": "CSS Display",
  "CSS Max-width": "CSS Max-width",
  "CSS Position": "CSS Position",
  "CSS Position Offsets": "CSS Position Offsets",
  "CSS Z-index": "CSS Z-index",
  "CSS Overflow": "CSS Overflow",
  "Overflow": "Overflow",
  "Overflow X and Y": "Overflow X and Y",
  "Code Challenge": "Code Challenge",
  "CSS Float": "CSS Float",
  "CSS Inline-block": "CSS Inline-block",
  "CSS Align": "CSS Align",
  "CSS Combinators": "CSS Combinators",
  "CSS Pseudo-classes": "CSS Pseudo-classes",
  "CSS Pseudo-elements": "CSS Pseudo-elements",
  "CSS Opacity": "CSS Opacity",
  "CSS Navigation Bars": "CSS Navigation Bars",
  "CSS Dropdowns": "CSS Dropdowns",
  "CSS Image Gallery": "CSS Image Gallery",
  "CSS Image Sprites": "CSS Image Sprites",
  "CSS Attribute Selectors": "CSS Attribute Selectors",
  "CSS Forms": "CSS Forms",
  "CSS Counters": "CSS Counters",
  "CSS Units": "CSS Units",
  "CSS Inheritance": "CSS Inheritance",
  "CSS Specificity": "CSS Specificity",
  "CSS !important": "CSS !important",
  "CSS Math Functions": "CSS Math Functions",
  "CSS Optimization": "CSS Optimization",
  "CSS Accessibility": "CSS Accessibility",
  "CSS Website Layout": "CSS Website Layout",
  "CSS Gradients": "CSS Gradients",
  "CSS Shadows": "CSS Shadows",
  "CSS Text Effects": "CSS Text Effects",
  "CSS Custom Fonts": "CSS Custom Fonts",
  "CSS 2D Transforms": "CSS 2D Transforms",
  "CSS 3D Transforms": "CSS 3D Transforms",
  "CSS Transitions": "CSS Transitions",
  "CSS Animations": "CSS Animations",
  "CSS Tooltips": "CSS Tooltips",
  "CSS Image Styling": "CSS Image Styling",
  "CSS Image Modal": "CSS Image Modal",
  "CSS Image Centering": "CSS Image Centering",
  "CSS Image Filters": "CSS Image Filters",
  "CSS Image Shapes": "CSS Image Shapes",
  "CSS object-fit": "CSS object-fit",
  "CSS object-position": "CSS object-position",
  "CSS Masking": "CSS Masking",
  "CSS Buttons": "CSS Buttons",
  "CSS Pagination": "CSS Pagination",
  "CSS Multiple Columns": "CSS Multiple Columns",
  "CSS User Interface": "CSS User Interface",
  "CSS Variables": "CSS Variables",
  "CSS @property": "CSS @property",
  "CSS Box Sizing": "CSS Box Sizing",
  "CSS Media Queries": "CSS Media Queries",
  "CSS FLEXBOX": "CSS FLEXBOX",
  "Flexbox Intro": "Flexbox Intro",
  "Flex Container": "Flex Container",
  "Flex Items": "Flex Items",
  "Flex Responsive": "Flex Responsive",
  "CSS GRID": "CSS GRID",
  "Grid Intro": "Grid Intro",
  "Grid Container": "Grid Container",
  "Grid Items": "Grid Items",
  "Grid 12-column Layout": "Grid 12-column Layout",
  "CSS @supports": "CSS @supports",
  "CSS RESPONSIVE": "CSS RESPONSIVE",
  "RWD Intro": "RWD Intro",
  "RWD Viewport": "RWD Viewport",
  "RWD Grid View": "RWD Grid View",
  "RWD Media Queries": "RWD Media Queries",
  "RWD Images": "RWD Images",
  "RWD Videos": "RWD Videos",
  "RWD Frameworks": "RWD Frameworks",
  "RWD Templates": "RWD Templates",
  "CSS CERT": "CSS CERT",
  "CSS Certificate": "CSS Certificate",
  "CSS SASS": "CSS SASS",
  "SASS Tutorial": "SASS Tutorial",
};

function titleOf(topic) {
  // Os nomes dos assuntos são termos técnicos e devem permanecer no
  // original em inglês. O conteúdo explicativo continua em português.
  return technicalTitles[topic] || topic;
}

function summary(topic) {
  const key = topic.toLowerCase();
  if (key.includes("selector") || key.includes("combinator") || key.includes("pseudo")) {
    return "Treine formas de escolher elementos específicos da página para aplicar estilos.";
  }
  if (key.includes("overflow")) {
    return "Controle o que acontece quando o conteudo fica maior que a caixa.";
  }
  if (key.includes("flex")) {
    return "Organize itens em linha ou coluna com distribuicao flexivel de espaco.";
  }
  if (key.includes("grid")) {
    return "Crie layouts em linhas e colunas com controle preciso.";
  }
  if (key.includes("responsive") || key.startsWith("rwd") || key.includes("media")) {
    return "Adapte a página para telas pequenas, medias e grandes.";
  }
  if (key.includes("animation") || key.includes("transition") || key.includes("transform")) {
    return "Adicione movimento e mudancas visuais controladas com CSS.";
  }
  if (key.includes("image") || key.includes("object") || key.includes("mask")) {
    return "Controle apresentação, corte, filtro e posicionamento de imagens.";
  }
  return `Aprenda o papel de ${titleOf(topic)} e pratique alterando o exemplo.`;
}

function focusedLesson(html, css, activity, result, checklist, extra = {}) {
  return {
    html,
    css,
    activity,
    guide: {
      goal: activity,
      steps: [
        activity,
        "Crie o HTML necessário dentro da área do estudante.",
        "Aplique as propriedades específicas do tema dentro da área CSS.",
        "Teste o resultado e explique na reflexão por que essas propriedades resolvem a tarefa.",
      ],
      result,
      checklist,
    },
    ...extra,
  };
}

const specializedLessons = {
  "CSS Syntax": focusedLesson(
    '<div class="bloco-sintaxe">Sintaxe básica: Seletor, Propriedade e Valor</div>',
    `.bloco-sintaxe {
  color: #17415f;
  background-color: #dff3f6;
  font-size: 18px; /* propriedade usada para alterar o tamanho do texto */
  padding: 20px;
  border-radius: 6px;
  text-align: center;
}`,
    "Altere o valor de font-size para aumentar ou diminuir o texto e identifique seletor, propriedade e valor na regra.",
    "O texto deve mudar de tamanho por meio de uma declaração font-size válida dentro da regra CSS.",
    ["Manteve um seletor seguido por chaves.", "Escreveu a propriedade font-size.", "Informou um valor com unidade e ponto e vírgula."],
    { concepts: [
      ["Seletor", "Indica quais elementos HTML receberão os estilos; no exemplo, .bloco-sintaxe seleciona a classe."],
      ["Propriedade", "Define o aspecto que será alterado, como color, font-size ou padding."],
      ["Valor", "Configura a propriedade; em font-size: 18px, 18px é o valor."],
      ["Declaração", "É o conjunto propriedade: valor; e normalmente termina com ponto e vírgula."],
    ] }
  ),
  "CSS Position": focusedLesson(
    '<div class="position-showcase"><article class="position-card position-static"><strong>static</strong><span>Permanece no fluxo normal.</span></article><article class="position-card position-relative"><strong>relative</strong><span>Move-se sem perder seu espaço.</span></article><div class="absolute-stage"><span>container relative</span><strong class="position-absolute">absolute</strong></div><div class="sticky-stage"><h3 class="position-sticky">sticky</h3><p>Role dentro desta caixa.</p><p>Conteúdo intermediário.</p><p>O título continua preso ao topo.</p></div><span class="position-fixed">fixed</span></div>',
    `.position-showcase { display: grid; gap: 16px; padding-bottom: 36px; }
.position-card { padding: 14px; border: 2px solid #355070; background: #eaf4fb; }
.position-card strong, .position-card span { display: block; }
.position-static { position: static; top: 20px; }
.position-relative { position: relative; top: 8px; left: 24px; width: calc(100% - 24px); background: #fff3cd; }
.absolute-stage { position: relative; min-height: 105px; padding: 12px; border: 2px dashed #2a9d8f; }
.position-absolute { position: absolute; top: 12px; right: 12px; padding: 12px; background: #2a9d8f; color: white; }
.sticky-stage { height: 125px; overflow: auto; border: 2px solid #b56576; background: white; }
.sticky-stage p { min-height: 48px; margin: 0; padding: 10px; }
.position-sticky { position: sticky; top: 0; z-index: 1; margin: 0; padding: 10px; background: #b56576; color: white; }
.position-fixed { position: fixed; right: 16px; bottom: 16px; z-index: 10; padding: 8px 12px; border-radius: 999px; background: #24313f; color: white; pointer-events: none; }`,
    "Crie uma comparação que demonstre static, relative, absolute, fixed e sticky, explicando a referência usada por cada elemento.",
    "A solução deve tornar perceptível como os cinco valores de position afetam o fluxo, o deslocamento e a referência do elemento.",
    ["Demonstrou static e relative.", "Usou absolute dentro de um ancestral posicionado.", "Incluiu um elemento fixed.", "Criou uma situação rolável para observar sticky."],
    { concepts: [
      ["static", "Valor padrão: o elemento segue o fluxo normal e top/right/bottom/left não produzem deslocamento."],
      ["relative", "Mantém seu espaço no fluxo, aceita offsets e também pode servir como referência para descendentes absolute."],
      ["absolute", "Sai do fluxo e usa como referência o ancestral posicionado mais próximo; sem ele, usa o bloco inicial."],
      ["fixed", "Sai do fluxo e normalmente se posiciona em relação à viewport, permanecendo visível durante a rolagem."],
      ["sticky", "Alterna entre o fluxo normal e uma posição presa quando alcança um limite como top dentro do container de rolagem."],
    ] }
  ),
  "CSS Position Offsets": focusedLesson(
    '<div class="palco-offsets"><span class="marcador offset-top-left">top + left</span><span class="marcador offset-top-right">top + right</span><span class="marcador offset-bottom-left">bottom + left</span><span class="marcador offset-bottom-right">bottom + right</span><strong class="offset-inset">inset</strong></div>',
    `.palco-offsets { position: relative; min-height: 260px; border: 3px dashed #355070; background: #f4f7fb; }
.marcador, .offset-inset { position: absolute; padding: 10px; color: white; }
.offset-top-left { top: 12px; left: 12px; background: #355070; }
.offset-top-right { top: 12px; right: 12px; background: #2a9d8f; }
.offset-bottom-left { bottom: 12px; left: 12px; background: #b56576; }
.offset-bottom-right { right: 12px; bottom: 12px; background: #8f5d2f; }
.offset-inset { inset: 105px 95px auto; text-align: center; background: #24313f; }`,
    "Posicione elementos nos quatro cantos usando top, right, bottom e left e adicione um exemplo equivalente com inset.",
    "Os offsets devem ser observados em relação a um container explicitamente posicionado.",
    ["O container estabelece a referência com position.", "Usou top e bottom.", "Usou left e right.", "Demonstrou a shorthand inset."],
    { concepts: [
      ["top/right/bottom/left", "Definem a distância entre as bordas do elemento posicionado e as bordas de seu bloco de referência."],
      ["inset", "É a shorthand dos quatro offsets e aceita de um a quatro valores, como margin e padding."],
      ["Referência", "Em absolute, os offsets dependem do ancestral posicionado mais próximo; em fixed, normalmente dependem da viewport."],
      ["Conflitos", "Quando largura, left e right são definidos juntos, as regras de dimensionamento decidem qual valor será ajustado."],
    ] }
  ),
  "CSS Z-index": focusedLesson(
    '<div class="palco-camadas"><span class="camada camada-base">z-index: 1</span><span class="camada camada-meio">z-index: 2</span><div class="contexto-local"><span>filho: 999</span></div><span class="camada camada-frente">fora: 4</span></div>',
    `.palco-camadas { position: relative; isolation: isolate; min-height: 230px; background: #eef3f8; border: 2px solid #355070; }
.camada, .contexto-local { position: absolute; width: 125px; height: 95px; display: grid; place-items: center; color: white; font-weight: bold; }
.camada-base { top: 25px; left: 25px; z-index: 1; background: #355070; }
.camada-meio { top: 60px; left: 85px; z-index: 2; background: #2a9d8f; }
.contexto-local { top: 95px; left: 145px; z-index: 3; transform: rotate(-2deg); background: #b56576; }
.contexto-local span { position: relative; z-index: 999; }
.camada-frente { top: 125px; left: 205px; z-index: 4; background: #24313f; }`,
    "Crie camadas sobrepostas e um contexto de empilhamento aninhado para mostrar por que um filho com z-index alto não escapa do contexto do pai.",
    "A ordem visual deve resultar dos valores de z-index e dos contextos de empilhamento, não da margem ou de uma posição acidental.",
    ["Os elementos estão realmente sobrepostos.", "Usou diferentes valores de z-index.", "Criou um contexto com isolation, transform ou propriedade equivalente.", "Explicou o limite do z-index do elemento filho."],
    { concepts: [
      ["Ordem de empilhamento", "z-index controla a ordem no eixo visual quando elementos pertencem ao mesmo contexto de empilhamento."],
      ["Contexto local", "Um filho com z-index: 999 continua limitado ao contexto criado pelo pai; ele não supera irmãos externos do pai."],
      ["Criação de contexto", "Propriedades como isolation: isolate, transform, opacity menor que 1 e certos elementos posicionados podem criar contextos."],
      ["Diagnóstico", "Quando z-index parece não funcionar, compare primeiro os contextos ancestrais, não apenas os números dos elementos."],
    ] }
  ),
  "CSS Icons": focusedLesson(
    '<button class="acao-icone"><svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM8 4v6h8V4m-8 9h8v5H8z"/></svg><span>Salvar</span></button>',
    `.acao-icone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 0;
  border-radius: 6px;
  background: #355070;
  color: white;
  cursor: pointer;
}
.icone { width: 22px; height: 22px; fill: currentColor; }
.acao-icone:hover { color: #ffe8a3; }`,
    "Crie dois botões com ícones SVG e faça os ícones herdarem a cor com currentColor.",
    "A solução deve exibir pelo menos um ícone vetorial alinhado ao texto e estilizado por CSS.",
    ["Existe um SVG ou outra técnica real de ícone.", "O tamanho do ícone é controlado por CSS.", "O ícone acompanha a cor do componente."]
  ),
  "CSS Lists": focusedLesson(
    '<div class="listas-demo"><ul class="lista-marcadores"><li>HTML semântico</li><li>CSS organizado</li></ul><ol class="lista-etapas"><li>Planejar</li><li>Implementar</li><li>Revisar</li></ol></div>',
    `.lista-marcadores { list-style-type: square; list-style-position: inside; }
.lista-marcadores li::marker { color: #b56576; font-size: 1.3em; }
.lista-etapas { list-style-type: upper-roman; }
.listas-demo li { margin: 6px 0; padding-left: 6px; }`,
    "Personalize uma lista com list-style e ::marker, mantendo os itens legíveis.",
    "A página deve mostrar uma lista cujo marcador ou numeração foi realmente personalizado.",
    ["Usou ul ou ol com li.", "Aplicou list-style ou list-style-type.", "Personalizou o marcador ou seu posicionamento."]
  ),
  "Overflow X and Y": focusedLesson(
    '<div class="caixa-eixos"><div class="conteudo-largo">Conteúdo largo → coluna 1 | coluna 2 | coluna 3 | coluna 4</div><p>Linha vertical 1</p><p>Linha vertical 2</p><p>Linha vertical 3</p></div>',
    `.caixa-eixos {
  width: 260px;
  height: 110px;
  overflow-x: auto;
  overflow-y: scroll;
  padding: 10px;
  border: 2px solid #355070;
}
.conteudo-largo { width: 520px; white-space: nowrap; }`,
    "Configure overflow-x e overflow-y com comportamentos diferentes e compare as duas barras de rolagem.",
    "A caixa deve controlar separadamente o transbordamento horizontal e o vertical.",
    ["Definiu largura e altura limitadas.", "Usou overflow-x.", "Usou overflow-y com um valor diferente."]
  ),
  "CSS Image Sprites": focusedLesson(
    '<div class="acoes-sprite"><button><span class="sprite sprite-casa" aria-hidden="true"></span>Início</button><button><span class="sprite sprite-busca" aria-hidden="true"></span>Buscar</button><button><span class="sprite sprite-config" aria-hidden="true"></span>Ajustes</button></div>',
    `.acoes-sprite { display: flex; flex-wrap: wrap; gap: 12px; }
.acoes-sprite button { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; }
.sprite {
  width: 48px;
  height: 48px;
  background-image: url("../assets/icones-sprite.svg");
  background-size: 144px 48px;
  background-repeat: no-repeat;
}
.sprite-casa { background-position: 0 0; }
.sprite-busca { background-position: -48px 0; }
.sprite-config { background-position: -96px 0; }`,
    "Crie três classes que revelem partes diferentes da mesma imagem usando background-position.",
    "Três ícones diferentes devem ser recortados de um único arquivo de sprite.",
    ["Todos usam a mesma background-image.", "O tamanho do sprite foi definido.", "Cada classe usa um background-position diferente."]
  ),
  "CSS Custom Fonts": focusedLesson(
    '<div class="amostra-fonte"><h3>Fonte personalizada local</h3><p>O navegador usa a fonte registrada pelo @font-face.</p></div>',
    `@font-face {
  font-family: "FonteCurso";
  src: local("Georgia");
  font-style: normal;
  font-weight: 400;
}
.amostra-fonte { padding: 20px; border-left: 6px solid #b56576; background: #f7f2fa; }
.amostra-fonte h3 { font-family: "FonteCurso", Georgia, serif; font-size: 30px; margin: 0 0 8px; }`,
    "Registre uma fonte com @font-face e aplique a família personalizada com uma fonte de fallback.",
    "O título deve usar uma família declarada em @font-face e continuar legível se ela não estiver disponível.",
    ["Declarou @font-face.", "Definiu font-family e src.", "Aplicou a família com um fallback adequado."]
  ),
  "CSS Image Modal": focusedLesson(
    '<a class="miniatura-modal" href="#imagem-ampliada"><img src="../assets/imagem-exemplo.svg" alt="Abrir imagem colorida ampliada"></a><div class="modal-imagem" id="imagem-ampliada"><a class="fechar-modal" href="#" aria-label="Fechar imagem">×</a><img src="../assets/imagem-exemplo.svg" alt="Imagem colorida ampliada"></div>',
    `.miniatura-modal img { width: 220px; display: block; cursor: zoom-in; }
.modal-imagem {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: none;
  place-items: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.82);
}
.modal-imagem:target { display: grid; }
.modal-imagem img { max-width: 85vw; max-height: 75vh; }
.fechar-modal { position: absolute; top: 20px; right: 28px; color: white; font-size: 36px; text-decoration: none; }`,
    "Monte um modal de imagem que abra pela miniatura e possa ser fechado, usando :target ou dialog.",
    "Ao acionar a miniatura, a imagem deve aparecer ampliada sobre uma camada que cobre a janela.",
    ["Existe uma miniatura acionável.", "A camada modal cobre a viewport.", "Há estados claros para abrir e fechar."]
  ),
  "CSS Image Shapes": focusedLesson(
    '<div class="formas-imagem"><img class="forma-circulo" src="../assets/imagem-exemplo.svg" alt="Imagem recortada em círculo"><img class="forma-poligono" src="../assets/imagem-exemplo.svg" alt="Imagem recortada em polígono"></div>',
    `.formas-imagem { display: flex; flex-wrap: wrap; gap: 18px; }
.formas-imagem img { width: 180px; height: 150px; object-fit: cover; }
.forma-circulo { clip-path: circle(45% at 50% 50%); }
.forma-poligono { clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%); }`,
    "Crie dois recortes diferentes com clip-path, como circle() e polygon().",
    "As imagens devem assumir formas visivelmente diferentes sem editar o arquivo original.",
    ["Usou uma imagem.", "Aplicou clip-path.", "Criou pelo menos duas formas distinguíveis."]
  ),
  "CSS object-position": focusedLesson(
    '<div class="comparacao-objeto"><figure><img class="foto-objeto foco-esquerda" src="../assets/imagem-exemplo.svg" alt="Recorte com foco à esquerda"><figcaption>left center</figcaption></figure><figure><img class="foto-objeto foco-direita" src="../assets/imagem-exemplo.svg" alt="Recorte com foco à direita"><figcaption>right center</figcaption></figure></div>',
    `.comparacao-objeto { display: flex; flex-wrap: wrap; gap: 16px; }
.comparacao-objeto figure { margin: 0; text-align: center; }
.foto-objeto { width: 210px; height: 120px; object-fit: cover; border: 3px solid #355070; }
.foco-esquerda { object-position: left center; }
.foco-direita { object-position: right center; }`,
    "Compare dois valores de object-position mantendo o mesmo tamanho e object-fit.",
    "As duas cópias da imagem devem mostrar recortes diferentes por causa de object-position.",
    ["A imagem tem largura e altura limitadas.", "Usou object-fit.", "Comparou pelo menos dois valores de object-position."]
  ),
  "CSS Masking": focusedLesson(
    '<img class="imagem-mascarada" src="../assets/imagem-exemplo.svg" alt="Imagem revelada por uma máscara radial">',
    `.imagem-mascarada {
  width: 320px;
  max-width: 100%;
  display: block;
  -webkit-mask-image: radial-gradient(circle, #000 48%, transparent 70%);
  mask-image: radial-gradient(circle, #000 48%, transparent 70%);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}`,
    "Aplique uma máscara com mask-image e mantenha o prefixo -webkit- para compatibilidade.",
    "A imagem deve desaparecer gradualmente de acordo com a forma definida pela máscara.",
    ["Usou mask-image.", "Incluiu a versão -webkit-mask-image.", "Definiu tamanho ou repetição da máscara."]
  ),
  "CSS Pagination": focusedLesson(
    '<nav class="paginacao" aria-label="Paginação"><a href="#" aria-label="Página anterior">‹</a><a href="#">1</a><a href="#" aria-current="page">2</a><a href="#">3</a><a href="#" aria-label="Próxima página">›</a></nav>',
    `.paginacao { display: flex; gap: 6px; align-items: center; }
.paginacao a { min-width: 38px; padding: 8px; border: 1px solid #355070; border-radius: 5px; text-align: center; text-decoration: none; }
.paginacao a:hover, .paginacao a:focus-visible { background: #eaf4fb; }
.paginacao a[aria-current="page"] { background: #355070; color: white; font-weight: bold; }`,
    "Crie uma paginação numerada e destaque a página atual com aria-current.",
    "A navegação deve ter páginas numeradas, controles anterior/próximo e um estado atual visível.",
    ["Usou nav com rótulo acessível.", "Incluiu links numerados.", "Estilizou o link com aria-current."]
  ),
  "Flex Items": focusedLesson(
    '<div class="flex-itens"><div class="item item-a">A</div><div class="item item-b">B cresce</div><div class="item item-c">C primeiro</div></div>',
    `.flex-itens { display: flex; min-height: 130px; gap: 10px; align-items: flex-start; }
.item { flex-basis: 90px; padding: 18px; background: #eaf4fb; border: 1px solid #355070; }
.item-b { flex-grow: 1; align-self: stretch; }
.item-c { order: -1; }`,
    "Altere individualmente os itens usando order, flex-grow, flex-basis ou align-self.",
    "Os itens devem ter tamanhos, ordem ou alinhamentos diferentes definidos pelas propriedades dos Flex Items.",
    ["O pai usa display: flex.", "Aplicou uma propriedade flex-* em um item.", "Usou order ou align-self em um item específico."]
  ),
  "Flex Responsive": focusedLesson(
    '<div class="cards-flex"><article>Card 1</article><article>Card 2</article><article>Card 3</article><article>Card 4</article></div>',
    `.cards-flex { display: flex; flex-wrap: wrap; gap: 12px; }
.cards-flex article { flex: 1 1 180px; padding: 24px; background: #eaf4fb; border: 1px solid #355070; }
@media (max-width: 480px) {
  .cards-flex { flex-direction: column; }
  .cards-flex article { flex-basis: auto; }
}`,
    "Crie cards que quebrem de linha e mudem para coluna em telas pequenas.",
    "Os cards devem se reorganizar sem provocar rolagem horizontal quando a viewport diminuir.",
    ["Usou flex-wrap.", "Definiu uma base flexível para os itens.", "Incluiu uma adaptação para tela pequena."]
  ),
  "Grid Items": focusedLesson(
    '<div class="grid-itens"><div class="item-destaque">Destaque</div><div>2</div><div>3</div><div class="item-alto">4</div><div>5</div></div>',
    `.grid-itens { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 70px; gap: 10px; }
.grid-itens > div { display: grid; place-items: center; background: #eaf4fb; border: 1px solid #355070; }
.item-destaque { grid-column: 1 / span 2; }
.item-alto { grid-row: span 2; }`,
    "Posicione itens específicos com grid-column e grid-row.",
    "Pelo menos um item deve ocupar várias colunas ou linhas dentro do Grid Container.",
    ["O pai usa display: grid.", "Definiu as colunas.", "Aplicou grid-column ou grid-row a um item."]
  ),
  "Grid 12-column Layout": focusedLesson(
    '<div class="grade-12"><header>12 colunas</header><section class="conteudo-grade">8 colunas</section><aside>4 colunas</aside><footer>12 colunas</footer></div>',
    `.grade-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; }
.grade-12 > * { padding: 18px; background: #eaf4fb; border: 1px solid #355070; }
.grade-12 header, .grade-12 footer { grid-column: span 12; }
.grade-12 .conteudo-grade { grid-column: span 8; }
.grade-12 aside { grid-column: span 4; }`,
    "Monte um layout de 12 colunas com regiões que ocupem 12, 8 e 4 colunas.",
    "O layout deve usar uma grade real de 12 colunas e distribuir conteúdo por diferentes spans.",
    ["Usou repeat(12, 1fr).", "Uma região ocupa 12 colunas.", "Criou a combinação 8 + 4 colunas."]
  ),
  "RWD Grid View": focusedLesson(
    '<div class="grade-rwd"><header>Topo</header><section class="conteudo-rwd">Conteúdo</section><aside>Lateral</aside><footer>Rodapé</footer></div>',
    `.grade-rwd { display: grid; grid-template-columns: 1fr; gap: 10px; }
.grade-rwd > * { padding: 18px; background: #eaf4fb; border: 1px solid #355070; }
@media (min-width: 700px) {
  .grade-rwd { grid-template-columns: repeat(12, 1fr); }
  .grade-rwd header, .grade-rwd footer { grid-column: 1 / -1; }
  .grade-rwd .conteudo-rwd { grid-column: span 8; }
  .grade-rwd aside { grid-column: span 4; }
}`,
    "Comece com uma coluna e transforme o layout em uma grade de 12 colunas em telas maiores.",
    "O conteúdo deve ficar empilhado no celular e lado a lado quando houver espaço.",
    ["Adotou estrutura mobile-first.", "Usou @media.", "A grade muda de uma para várias colunas."]
  ),
  "RWD Images": focusedLesson(
    '<picture class="imagem-rwd"><source media="(max-width: 520px)" srcset="../assets/galeria-projeto-2.svg"><img src="../assets/galeria-projeto-1.svg" alt="Arte responsiva escolhida conforme a largura da tela"></picture>',
    `.imagem-rwd { display: block; max-width: 720px; margin: auto; }
.imagem-rwd img { display: block; width: 100%; height: auto; border-radius: 10px; }`,
    "Crie uma imagem fluida e use picture ou srcset para oferecer uma alternativa em telas pequenas.",
    "A imagem não deve ultrapassar o container e deve permitir que o navegador escolha uma fonte adequada.",
    ["A imagem usa width ou max-width responsivo.", "A altura permanece proporcional.", "Usou picture, source ou srcset."]
  ),
  "RWD Templates": focusedLesson(
    '<div class="template-rwd"><header>Logo e menu</header><aside>Categorias</aside><section class="conteudo-template">Conteúdo principal</section><footer>Rodapé</footer></div>',
    `.template-rwd { display: grid; grid-template-areas: "topo" "lateral" "conteudo" "rodape"; gap: 10px; }
.template-rwd > * { padding: 20px; background: #eaf4fb; border: 1px solid #355070; }
.template-rwd header { grid-area: topo; }
.template-rwd aside { grid-area: lateral; }
.template-rwd .conteudo-template { grid-area: conteudo; }
.template-rwd footer { grid-area: rodape; }
@media (min-width: 720px) {
  .template-rwd { grid-template-columns: 220px 1fr; grid-template-areas: "topo topo" "lateral conteudo" "rodape rodape"; }
}`,
    "Implemente um template mobile-first com áreas nomeadas que mudem de posição em telas maiores.",
    "O template deve ter topo, navegação lateral, conteúdo e rodapé, empilhados no celular e reorganizados no desktop.",
    ["Usou áreas de Grid ou estrutura equivalente.", "Incluiu @media.", "A disposição muda entre telas pequenas e grandes."]
  ),
  "CSS SASS": focusedLesson(
    '<div class="comparacao-sass"><section><h3>SCSS</h3><pre><code>$cor: #355070;\n.cartao-sass {\n  background: $cor;\n  &amp;:hover { opacity: .8; }\n}</code></pre></section><section><h3>CSS compilado</h3><pre><code>.cartao-sass { background: #355070; }\n.cartao-sass:hover { opacity: .8; }</code></pre></section></div>',
    `.comparacao-sass { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
.comparacao-sass h3 { margin-top: 0; }
.comparacao-sass pre { height: 100%; box-sizing: border-box; }`,
    "Escreva SCSS com uma variável e nesting e apresente o CSS equivalente após a compilação.",
    "A solução deve distinguir claramente o código SCSS do CSS que o navegador executa.",
    ["Declarou e usou uma variável SASS.", "Usou nesting com & ou outro recurso SASS.", "Explicou ou mostrou o CSS compilado."],
    { snippet: `// styles.scss
$cor: #355070;
.cartao-sass {
  background: $cor;
  &:hover { opacity: .8; }
}

/* CSS compilado */
.cartao-sass { background: #355070; }
.cartao-sass:hover { opacity: .8; }` }
  ),
  "SASS Tutorial": focusedLesson(
    '<div class="comparacao-sass"><section><h3>Mixin SCSS</h3><pre><code>@mixin botao($cor) {\n  padding: 12px 18px;\n  background: $cor;\n}\n.botao-ok { @include botao(#2a9d8f); }</code></pre></section><section><h3>Resultado compilado</h3><button class="botao-ok">Confirmar</button></section></div>',
    `.comparacao-sass { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; align-items: start; }
.botao-ok { padding: 12px 18px; border: 0; border-radius: 6px; background: #2a9d8f; color: white; }`,
    "Crie um mixin SASS com parâmetro, use @include e escreva o CSS que seria gerado.",
    "O exercício deve mostrar um mixin reutilizável e o componente resultante após a compilação.",
    ["Declarou @mixin.", "Usou um parâmetro no mixin.", "Aplicou o mixin com @include e mostrou o CSS final."],
    { snippet: `// componentes.scss
@mixin botao($cor) {
  padding: 12px 18px;
  background: $cor;
}
.botao-ok { @include botao(#2a9d8f); }

/* CSS compilado */
.botao-ok {
  padding: 12px 18px;
  background: #2a9d8f;
}` }
  ),
};

const activityOverrides = {
  "CSS Optimization": "Refatore estilos repetidos criando uma classe base reutilizável e modificadores apenas com as diferenças.",
  "CSS @property": "Registre uma custom property com @property e anime seu valor em um estado :hover.",
  "CSS RESPONSIVE": "Altere flex-basis e flex-wrap para observar como os cards se reorganizam em larguras diferentes.",
  "RWD Intro": "Transforme a caixa em um componente fluido usando width, max-width e box-sizing.",
  "RWD Viewport": "Compare unidades vw e rem e limite o tamanho com clamp() para manter a leitura confortável.",
  "RWD Videos": "Mantenha o vídeo em proporção 16:9 enquanto a largura do container muda.",
};

function focusedGuide(activity, result, checklist) {
  return focusedLesson("", "", activity, result, checklist).guide;
}

const guideOverrides = {
  "CSS Optimization": focusedGuide(
    activityOverrides["CSS Optimization"],
    "Os componentes devem compartilhar uma classe base, deixando nos modificadores somente as diferenças.",
    ["Removeu declarações repetidas.", "Criou uma classe base reutilizável.", "Manteve modificadores pequenos e específicos."]
  ),
  "CSS @property": focusedGuide(
    activityOverrides["CSS @property"],
    "Uma custom property registrada deve mudar de valor com transição perceptível.",
    ["Declarou @property.", "Informou syntax, inherits e initial-value.", "Usou a propriedade registrada com var()."]
  ),
  "CSS RESPONSIVE": focusedGuide(
    activityOverrides["CSS RESPONSIVE"],
    "Os cards devem se reorganizar automaticamente sem causar rolagem horizontal.",
    ["Usou medidas flexíveis.", "Aplicou flex-wrap ou Grid responsivo.", "O conteúdo funciona em tela estreita."]
  ),
  "RWD Intro": focusedGuide(
    activityOverrides["RWD Intro"],
    "O componente deve ocupar o espaço disponível sem ultrapassar uma largura máxima.",
    ["Usou width flexível.", "Definiu max-width.", "Incluiu box-sizing para controlar o tamanho final."]
  ),
  "RWD Viewport": focusedGuide(
    activityOverrides["RWD Viewport"],
    "O texto deve responder à viewport sem ficar pequeno ou grande demais.",
    ["Usou vw, vh, vmin ou vmax.", "Definiu um limite com clamp(), min() ou max().", "O viewport está configurado no HTML."]
  ),
  "RWD Videos": focusedGuide(
    activityOverrides["RWD Videos"],
    "O vídeo deve preencher o container e conservar a proporção em qualquer largura.",
    ["O container tem largura fluida.", "A proporção do vídeo está definida.", "iframe ou video ocupa todo o container."]
  ),
};

function readExistingLesson(topic) {
  const file = portugueseFiles[topic];
  if (!file) return null;
  const lessonFile = path.join(lessonDir, file);
  if (!fs.existsSync(lessonFile)) return null;

  const source = fs.readFileSync(lessonFile, "utf8");
  const style = source.match(/<style>([\s\S]*?)<\/style>/i);
  const example = source.match(/<section class="painel">\s*<h2>Exemplo<\/h2>\s*<div class="exemplo">([\s\S]*?)<\/div>\s*<\/section>/i);
  const activitySection = source.match(/<section class="painel atividade">([\s\S]*?)<\/section>/i);
  const activity = activitySection?.[1].match(/<p>([\s\S]*?)<\/p>/i);
  if (!style || !example || !activity) return null;

  const normalizeBlock = (value) => {
    const lines = value.replaceAll("\r\n", "\n").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines.at(-1).trim()) lines.pop();
    const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
    const indent = indents.length ? Math.min(...indents) : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  };

  return {
    html: normalizeBlock(example[1]).split("\n").map((line) => line.trimStart()).join("\n"),
    css: normalizeBlock(style[1]),
    activity: activityOverrides[topic] || activity[1].trim(),
    guide: guideOverrides[topic],
  };
}

function lesson(topic) {
  if (specializedLessons[topic]) return specializedLessons[topic];
  const existing = readExistingLesson(topic);
  if (existing) return existing;

  const key = topic.toLowerCase();
  let html = '<div class="cartao-exemplo">Aprendendo CSS na prática</div>';
  let css = `.cartao-exemplo {
  padding: 24px;
  border-radius: 8px;
  background: #eaf4fb;
  color: #24313f;
}`;
  let activity = `Altere o exemplo para testar outro valor ligado a ${titleOf(topic)}.`;

  if (key.includes("syntax")) {
    css = `.cartao-exemplo {
  color: #17415f;
  background: #dff3f6;
}`;
    activity = "Crie uma segunda regra CSS para mudar o tamanho do texto.";
  } else if (key.includes("comments")) {
    css = `/* Comentario: explica a decisao de estilo */
.cartao-exemplo {
  padding: 24px;
  background: #eaf4fb;
}`;
    activity = "Adicione um comentario explicando a cor escolhida.";
  } else if (key.includes("errors")) {
    css = `.cartao-exemplo {
  color: #24313f;
  background: #eaf4fb;
  /* Remova um ponto e virgula para testar */
}`;
    activity = "Provocar e corrigir um erro simples de sintaxe.";
  } else if (key.includes("colors")) {
    html = '<div class="amostras-cores"><span>HEX</span><span>RGB</span><span>HSL</span></div>';
    css = `.amostras-cores { display: flex; gap: 10px; }
.amostras-cores span { padding: 18px; color: white; }
.amostras-cores span:nth-child(1) { background: #355070; }
.amostras-cores span:nth-child(2) { background: rgb(181, 101, 118); }
.amostras-cores span:nth-child(3) { background: hsl(158, 35%, 38%); }`;
    activity = "Troque uma cor HEX por RGB e outra por HSL.";
  } else if (key.includes("background") || key.includes("gradient")) {
    css = `.cartao-exemplo {
  padding: 36px;
  color: white;
  background: linear-gradient(135deg, #355070, #2a9d8f);
}`;
    activity = "Mude as cores, a direcao do gradiente ou use uma imagem de fundo.";
  } else if (key.includes("border") || key.includes("outline")) {
    css = `.cartao-exemplo {
  padding: 24px;
  border: 4px solid #b56576;
  outline: 3px dashed #355070;
  outline-offset: 6px;
}`;
    activity = "Teste solid, dashed, dotted, border-radius e outline-offset.";
  } else if (key.includes("margin")) {
    html = '<div class="box">Caixa A</div><div class="box">Caixa B</div>';
    css = `.box {
  margin: 20px;
  padding: 18px;
  background: #eaf4fb;
  border: 2px solid #355070;
}`;
    activity = "Troque margin por margin-left, margin-top e margin: auto.";
  } else if (key.includes("padding")) {
    css = `.cartao-exemplo {
  padding: 8px 32px 40px 16px;
  background: #eaf4fb;
  border: 2px solid #355070;
}`;
    activity = "Compare padding igual em todos os lados com padding individual.";
  } else if (key.includes("height") || key.includes("width") || key.includes("max-width")) {
    css = `.cartao-exemplo {
  width: 70%;
  max-width: 420px;
  min-height: 120px;
  padding: 16px;
  background: #eaf4fb;
}`;
    activity = "Aumente e reduza a janela para observar width e max-width.";
  } else if (key.includes("box model") || key.includes("box sizing")) {
    css = `.cartao-exemplo {
  box-sizing: border-box;
  width: 260px;
  padding: 30px;
  border: 6px solid #355070;
  margin: 20px;
  background: #eaf4fb;
}`;
    activity = "Compare border-box com content-box e calcule o tamanho final.";
  } else if (key.includes("text") || key.includes("fonts")) {
    html = '<p class="texto">Texto alinhado, decorado e transformado com CSS.</p>';
    css = `.texto {
  font-family: Georgia, serif;
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 2px 2px 0 #cdd7e2;
}`;
    activity = "Teste font-size, line-height, text-align e text-shadow.";
  } else if (key.includes("icons") || key.includes("buttons")) {
    html = '<button class="botao">* Continuar</button>';
    css = `.botao {
  padding: 12px 20px;
  border: 0;
  border-radius: 6px;
  background: #355070;
  color: white;
  cursor: pointer;
}

.botao:hover { background: #b56576; }`;
    activity = "Crie estados hover, active e focus-visible.";
  } else if (key.includes("links") || key.includes("navigation") || key.includes("pagination")) {
    html = '<nav class="navegacao"><a href="#">Inicio</a><a href="#">Aulas</a><a href="#">Contato</a></nav>';
    css = `.navegacao { display: flex; gap: 8px; background: #355070; padding: 10px; }
.navegacao a { color: white; text-decoration: none; padding: 8px 12px; }
.navegacao a:hover { background: #b56576; }`;
    activity = "Adicione estilos para hover, active e página atual.";
  } else if (key.includes("lists") || key.includes("counters")) {
    html = '<ol class="etapas"><li>Planejar</li><li>Codar</li><li>Revisar</li></ol>';
    css = `.etapas { counter-reset: etapa; list-style: none; padding-left: 0; }
.etapas li::before {
  counter-increment: etapa;
  content: "Etapa " counter(etapa) ": ";
  font-weight: bold;
  color: #355070;
}`;
    activity = "Mude o texto exibido antes de cada item.";
  } else if (key.includes("tables")) {
    html = '<table class="tabela"><tr><th>Aluno</th><th>Status</th></tr><tr><td>Ana</td><td>OK</td></tr></table>';
    css = `.tabela { border-collapse: collapse; width: 100%; }
.tabela th, .tabela td { border: 1px solid #9fb0c1; padding: 10px; }
.tabela th { background: #eaf4fb; }`;
    activity = "Adicione linhas e destaque as linhas pares.";
  } else if (key.includes("display") || key.includes("inline-block")) {
    html = '<span class="etiqueta">A</span><span class="etiqueta">B</span><span class="etiqueta">C</span>';
    css = `.etiqueta {
  display: inline-block;
  margin: 6px;
  padding: 12px 18px;
  background: #eaf4fb;
  border: 1px solid #355070;
}`;
    activity = "Compare display inline, block, inline-block e none.";
  } else if (key.includes("position") || key.includes("z-index")) {
    html = '<div class="area-posicao"><span class="camada-um">1</span><span class="camada-dois">2</span></div>';
    css = `.area-posicao { position: relative; height: 160px; background: #eaf4fb; }
.area-posicao span { position: absolute; width: 90px; height: 90px; display: grid; place-items: center; color: white; }
.camada-um { left: 30px; top: 20px; background: #355070; z-index: 1; }
.camada-dois { left: 80px; top: 55px; background: #b56576; z-index: 2; }`;
    activity = "Teste top, right, bottom, left e inverta o z-index.";
  } else if (key.includes("overflow")) {
    html = '<div class="caixa-rolagem">Conteudo grande dentro de uma caixa pequena. Role para ler tudo que aparece aqui.</div>';
    css = `.caixa-rolagem {
  width: 220px;
  height: 90px;
  overflow: auto;
  border: 2px solid #355070;
  padding: 12px;
}`;
    activity = "Teste visible, hidden, scroll, auto, overflow-x e overflow-y.";
  } else if (key.includes("float")) {
    html = '<div class="exemplo-flutuacao"><div class="miniatura"></div><p>Texto contornando uma caixa com float.</p></div>';
    css = `.miniatura { float: left; width: 120px; height: 90px; margin: 0 16px 8px 0; background: #355070; }
.exemplo-flutuacao::after { content: ""; display: block; clear: both; }`;
    activity = "Troque float para right e ajuste as margens.";
  } else if (key.includes("align") || key.includes("flex")) {
    html = '<div class="container-flexivel"><span>1</span><span>2</span><span>3</span></div>';
    css = `.container-flexivel { display: flex; gap: 10px; justify-content: space-between; align-items: center; }
.container-flexivel span { padding: 18px; background: #eaf4fb; border: 1px solid #355070; }`;
    activity = "Teste flex-direction, justify-content, align-items, gap e flex-wrap.";
  } else if (key.includes("grid")) {
    html = '<div class="grade"><span>1</span><span>2</span><span>3</span><span>4</span></div>';
    css = `.grade { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.grade span { padding: 20px; background: #eaf4fb; border: 1px solid #355070; }`;
    activity = "Mude para 3 colunas e faca um item ocupar duas colunas.";
  } else if (key.includes("pseudo-classes")) {
    html = '<button class="botao-acao">Passe o mouse</button>';
    css = `.botao-acao { padding: 12px 18px; }
.botao-acao:hover { background: #355070; color: white; }
.botao-acao:focus { outline: 3px solid #b56576; }`;
    activity = "Adicione estilos para :first-child ou :nth-child.";
  } else if (key.includes("pseudo-elements")) {
    html = '<p class="frase">CSS cria detalhes sem mudar o HTML.</p>';
    css = `.frase::before { content: ">> "; color: #b56576; }
.frase::first-letter { font-size: 36px; color: #355070; }`;
    activity = "Use ::after para adicionar um detalhe no final.";
  } else if (key.includes("opacity")) {
    css = `.cartao-exemplo { padding: 24px; background: #355070; color: white; opacity: 0.65; }`;
    activity = "Altere opacity entre 0.2 e 1.";
  } else if (key.includes("dropdown")) {
    html = '<div class="menu-suspenso"><button>Menu</button><div><a href="#">HTML</a><a href="#">CSS</a></div></div>';
    css = `.menu-suspenso { position: relative; display: inline-block; }
.menu-suspenso div { display: none; position: absolute; min-width: 120px; background: white; border: 1px solid #9fb0c1; }
.menu-suspenso:hover div { display: block; }
.menu-suspenso a { display: block; padding: 8px; }`;
    activity = "Adicione links e mude a posição do menu.";
  } else if (key.includes("image gallery")) {
    html = '<div class="galeria-imagens"><figure class="item-galeria"><img class="foto-galeria" src="../assets/galeria-projeto-1.svg" alt="Cartaz colorido do projeto 1"><figcaption>Projeto 1</figcaption></figure><figure class="item-galeria"><img class="foto-galeria" src="../assets/galeria-projeto-2.svg" alt="Cartaz colorido do projeto 2"><figcaption>Projeto 2</figcaption></figure><figure class="item-galeria"><img class="foto-galeria" src="../assets/galeria-projeto-3.svg" alt="Cartaz colorido do projeto 3"><figcaption>Projeto 3</figcaption></figure></div>';
    css = `.galeria-imagens {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
}
.item-galeria {
  margin: 0;
  overflow: hidden;
  border: 1px solid #d7e0ea;
  border-radius: 8px;
  background: #ffffff;
}
.foto-galeria {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.item-galeria figcaption {
  margin: 0;
  padding: 10px;
  font-weight: bold;
}`;
    activity = "Adicione novas imagens e teste diferentes tamanhos de coluna na galeria.";
  } else if (key.includes("image") || key.includes("object") || key.includes("mask") || key.includes("sprites")) {
    html = '<img class="foto" alt="Imagem colorida de exemplo" src="../assets/imagem-exemplo.svg">';
    css = `.foto {
  width: 260px;
  height: 150px;
  object-fit: cover;
  object-position: center;
  border-radius: 14px;
  filter: saturate(1.3);
  display: block;
  margin: auto;
}`;
    activity = "Teste object-fit, object-position, filter, border-radius e clip-path.";
  } else if (key.includes("2d transforms")) {
    css = `.cartao-exemplo {
  padding: 24px;
  background: #eaf4fb;
  transform: rotate(-3deg) scale(1.05);
}`;
    activity = "Teste translate(), rotate(), scale() e skew().";
  } else if (key.includes("3d transforms")) {
    css = `.exemplo { perspective: 500px; }
.cartao-exemplo {
  padding: 24px;
  background: #eaf4fb;
  transform: rotateY(25deg);
}`;
    activity = "Altere perspective e rotateY.";
  } else if (key.includes("css forms") || key.includes("attribute selectors")) {
    html = '<form class="formulario"><label>Nome<input></label><label>Email<input type="email"></label><button>Enviar</button></form>';
    css = `.formulario { display: grid; gap: 10px; max-width: 280px; }
.formulario input { padding: 10px; border: 1px solid #9fb0c1; }
.formulario input[type="email"] { border-color: #b56576; }
.formulario button { padding: 10px; background: #355070; color: white; border: 0; }`;
    activity = "Adicione estilo para input:focus e input[type='email'].";
  } else if (key.includes("variables") || key.includes("@property")) {
    css = `:root { --cor-principal: #355070; --espaco: 18px; }
.cartao-exemplo {
  padding: var(--espaco);
  background: var(--cor-principal);
  color: white;
}`;
    activity = "Crie uma segunda variavel para border-radius.";
  } else if (key.includes("media") || key.includes("responsive") || key.startsWith("rwd")) {
    css = `.cartao-exemplo { padding: 24px; background: #eaf4fb; }
@media (max-width: 600px) {
  .cartao-exemplo { background: #fff3cd; font-size: 20px; }
}`;
    activity = "Altere o breakpoint para 800px e teste a largura da tela.";
  } else if (key.includes("@supports")) {
    css = `.cartao-exemplo { padding: 24px; background: #eaf4fb; }
@supports (display: grid) {
  .cartao-exemplo { border: 4px solid #2a9d8f; }
}`;
    activity = "Crie uma regra alternativa para quando uma propriedade for suportada.";
  } else if (key.includes("sass")) {
    html = '<div class="cartao">Aprendendo SASS na prática</div>';
    css = `$cor: #355070;
.cartao {
  padding: 24px;
  background: $cor;
  color: white;
}`;
    activity = "Reescreva o exemplo em CSS comum, substituindo a variavel SASS.";
  } else if (key.includes("code challenge")) {
    html = '<div class="desafio"><h3>Cartao desafio</h3><p>Melhore este componente.</p><button>Acao</button></div>';
    css = `.desafio { padding: 20px; border: 2px solid #355070; }
.desafio button { padding: 10px 16px; }`;
    activity = "Desafio: deixe o cartao responsivo, acessivel e com hover no botao.";
  }

  return { html, css, activity };
}


function learningGoal(topic) {
  const key = topic.toLowerCase();
  if (topic === "CSS Syntax") return "Compreender a estrutura de uma regra CSS, distinguindo seletor, propriedade, valor e declaração.";
  if (topic === "CSS Position") return "Distinguir os valores de position e compreender como cada um altera o fluxo e a referência do elemento.";
  if (topic === "CSS Position Offsets") return "Compreender como os offsets posicionam um elemento em relação ao seu bloco de referência.";
  if (topic === "CSS Z-index") return "Compreender a ordem de empilhamento e a influência dos contextos de empilhamento sobre z-index.";
  if (key.includes("sass")) return "Compreender como recursos do SASS são escritos e transformados em CSS executável pelo navegador.";
  if (key.includes("flex")) return `Compreender como ${titleOf(topic)} organiza e adapta itens ao espaço disponível.`;
  if (key.includes("grid")) return `Compreender como ${titleOf(topic)} controla linhas, colunas e o posicionamento dos itens.`;
  if (key.includes("responsive") || key.startsWith("rwd")) return `Compreender como ${titleOf(topic)} mantém o conteúdo utilizável em diferentes tamanhos de tela.`;
  if (key.includes("image") || key.includes("object") || key.includes("mask") || key.includes("sprites")) return `Compreender como ${titleOf(topic)} controla a apresentação e o comportamento das imagens.`;
  if (key.includes("icon")) return "Compreender como ícones vetoriais são inseridos, dimensionados e coloridos com CSS.";
  if (key.includes("lists")) return "Compreender como listas e seus marcadores podem ser estruturados e personalizados.";
  if (key.includes("pagination")) return "Compreender a estrutura visual e acessível de uma navegação paginada.";
  if (key.includes("@property")) return "Compreender como registrar uma custom property tipada e torná-la animável.";
  if (key.includes("overflow")) return "Compreender como controlar separadamente o conteúdo que ultrapassa os limites de uma caixa.";
  if (key.includes("optimization")) return "Compreender como reduzir repetição e tornar regras CSS mais reutilizáveis e fáceis de manter.";
  return `Compreender os conceitos centrais de ${titleOf(topic)} e aplicá-los corretamente em uma solução própria.`;
}

function exerciseGuide(topic, item) {
  if (item.guide) {
    return {
      ...item.guide,
      goal: item.guide.goal === item.activity ? learningGoal(topic) : item.guide.goal,
    };
  }

  const key = topic.toLowerCase();
  const title = titleOf(topic);
  const base = {
    goal: `Praticar ${title} alterando o HTML e o CSS desta página.`,
    steps: [
      "Leia a proposta da atividade e mantenha o tema principal do exercício.",
      "Substitua o conteúdo de exemplo da área do estudante pela sua própria solução.",
      "Crie ou edite regras CSS dentro da tag <style> para resolver a tarefa.",
      "Abra a página no navegador e confira se o resultado visual mudou de forma clara.",
    ],
    result: "Ao final, a página deve mostrar uma solução visual diferente do modelo inicial e relacionada ao assunto estudado.",
    checklist: [
      "Removeu o texto padrão do modelo.",
      "Usou pelo menos uma propriedade CSS ligada ao tema da aula.",
      "O resultado aparece corretamente no navegador.",
    ],
  };

  if (key.includes("colors")) {
    return {
      goal: "Praticar formas diferentes de escrever cores em CSS: HEX, RGB e HSL.",
      steps: [
        "Crie três blocos, etiquetas ou cartões dentro da área do estudante.",
        "Aplique uma cor usando HEX, uma usando rgb() e outra usando hsl().",
        "Coloque um texto dentro de cada bloco identificando o formato de cor usado.",
        "Garanta contraste suficiente para que o texto fique legível.",
      ],
      result: "A página deve exibir três elementos coloridos, cada um usando uma sintaxe de cor diferente.",
      checklist: ["Há uma cor em HEX.", "Há uma cor em rgb().", "Há uma cor em hsl().", "Os textos continuam fáceis de ler."],
    };
  }

  if (key.includes("selector") || key.includes("combinator") || key.includes("pseudo")) {
    return {
      goal: "Treinar a escolha correta dos elementos que receberão estilos.",
      steps: [
        "Crie uma pequena estrutura HTML com títulos, parágrafos, links ou itens de lista.",
        "Escreva seletores específicos para alterar apenas alguns elementos, não todos.",
        "Use o seletor estudado na aula, como classe, descendente, combinador, pseudoclasse ou pseudoelemento.",
        "Teste se cada regra afeta somente o elemento esperado.",
      ],
      result: "A página deve deixar evidente que elementos diferentes receberam estilos diferentes por causa dos seletores usados.",
      checklist: ["Usou o seletor pedido pelo tema.", "Evitou aplicar o mesmo estilo em tudo.", "O efeito visual confirma que o seletor funcionou."],
    };
  }

  if (key.includes("overflow")) {
    return {
      goal: "Controlar o comportamento de um conteúdo maior que sua caixa.",
      steps: [
        "Crie uma caixa com largura ou altura limitada.",
        "Coloque dentro dela um texto longo, uma lista grande ou outro conteúdo que ultrapasse o espaço disponível.",
        "Aplique overflow, overflow-x ou overflow-y para controlar a rolagem ou o corte do conteúdo.",
        "Compare o resultado com visible, hidden, scroll ou auto.",
      ],
      result: "A página deve mostrar uma caixa onde o conteúdo excedente é controlado de forma intencional.",
      checklist: ["A caixa tem tamanho limitado.", "O conteúdo passa do tamanho da caixa.", "A propriedade overflow foi aplicada e é perceptível."],
    };
  }

  if (key.includes("flex")) {
    return {
      goal: "Organizar elementos em linha ou coluna usando Flexbox.",
      steps: [
        "Crie um container com pelo menos três itens dentro.",
        "Aplique display: flex no container.",
        "Use propriedades como gap, justify-content, align-items, flex-wrap ou flex-direction.",
        "Teste a largura da janela para observar como os itens se comportam.",
      ],
      result: "Os itens devem ficar alinhados e distribuídos pelo container com controle de espaçamento e direção.",
      checklist: ["O container usa display: flex.", "Há três ou mais itens.", "Foi usada ao menos uma propriedade de alinhamento ou distribuição."],
    };
  }

  if (key.includes("grid")) {
    return {
      goal: "Criar uma organização em linhas e colunas usando CSS Grid.",
      steps: [
        "Crie um container com vários blocos de conteúdo.",
        "Aplique display: grid no container.",
        "Defina colunas com grid-template-columns e espaçamento com gap.",
        "Se possível, faça um dos itens ocupar mais de uma coluna ou linha.",
      ],
      result: "A página deve apresentar uma grade clara, com itens alinhados em colunas e espaçamentos consistentes.",
      checklist: ["O container usa display: grid.", "As colunas foram definidas.", "O espaçamento entre itens está controlado."],
    };
  }

  if (key.includes("responsive") || key.startsWith("rwd") || key.includes("media")) {
    return {
      goal: "Adaptar o layout para diferentes tamanhos de tela.",
      steps: [
        "Crie uma seção com conteúdo que funcione em tela grande e pequena.",
        "Use medidas flexíveis, como %, max-width, fr ou rem.",
        "Adicione uma media query para alterar layout, tamanho ou espaçamento em telas menores.",
        "Teste diminuindo a largura do navegador.",
      ],
      result: "A página deve continuar organizada em telas pequenas, sem conteúdo espremido ou cortado.",
      checklist: ["Usou @media ou técnica responsiva equivalente.", "O layout muda em tela menor.", "Não há rolagem horizontal desnecessária."],
    };
  }

  if (key.includes("image") || key.includes("object") || key.includes("mask") || key.includes("sprites")) {
    return {
      goal: "Praticar apresentação e ajuste visual de imagens com CSS.",
      steps: [
        "Insira uma imagem na área do estudante usando a tag <img> ou um recurso local da pasta assets.",
        "Aplique estilos como width, height, object-fit, object-position, border-radius, filter ou clip-path.",
        "Inclua texto alternativo no atributo alt quando usar <img>.",
        "Observe se a imagem mantém boa proporção e não deforma.",
      ],
      result: "A página deve mostrar uma imagem estilizada, com tamanho, corte ou efeito visual controlado por CSS.",
      checklist: ["Há uma imagem no HTML ou no CSS.", "A imagem foi estilizada por CSS.", "A imagem não ficou deformada sem intenção."],
    };
  }

  if (key.includes("position") || key.includes("z-index")) {
    return {
      goal: "Controlar a posição de elementos na página.",
      steps: [
        "Crie pelo menos duas caixas ou elementos visuais.",
        "Aplique position com valores como relative, absolute, fixed ou sticky.",
        "Use top, right, bottom ou left para deslocar um elemento.",
        "Se houver sobreposição, use z-index para definir qual elemento fica na frente.",
      ],
      result: "A página deve mostrar um elemento deslocado ou sobreposto de forma controlada.",
      checklist: ["Usou a propriedade position.", "Usou ao menos um deslocamento.", "O posicionamento final é intencional e visível."],
    };
  }

  if (key.includes("float")) {
    return {
      goal: "Entender como o float faz um elemento flutuar ao lado de outro conteúdo.",
      steps: [
        "Crie uma imagem, caixa ou destaque pequeno antes de um parágrafo.",
        "Aplique float: left ou float: right nesse elemento.",
        "Adicione texto suficiente para contornar o elemento flutuante.",
        "Use clear em um elemento posterior para encerrar o efeito quando necessário.",
      ],
      result: "O texto deve contornar o elemento flutuante, e a área seguinte deve voltar ao fluxo normal quando clear for usado.",
      checklist: ["Usou float.", "Há texto contornando o elemento.", "Usou clear se o próximo conteúdo precisar ficar abaixo."],
    };
  }

  if (key.includes("form") || key.includes("attribute")) {
    return {
      goal: "Criar e estilizar campos de formulário de forma organizada.",
      steps: [
        "Monte um pequeno formulário com label, input e botão.",
        "Estilize os campos com padding, border, width ou background.",
        "Use seletores de atributo quando o tema pedir, por exemplo input[type=\"text\"].",
        "Verifique se os rótulos deixam claro o que deve ser preenchido.",
      ],
      result: "A página deve apresentar um formulário legível, alinhado e fácil de preencher.",
      checklist: ["Há labels associados aos campos.", "Os inputs foram estilizados.", "O botão está visível e coerente com o formulário."],
    };
  }

  if (key.includes("animation") || key.includes("transition") || key.includes("transform")) {
    return {
      goal: "Criar uma mudança visual controlada com CSS.",
      steps: [
        "Crie uma caixa, botão ou cartão para receber o efeito.",
        "Aplique transform, transition ou animation de acordo com o tema da aula.",
        "Use :hover quando quiser que o efeito aconteça ao passar o mouse.",
        "Mantenha o movimento simples para que o resultado seja fácil de observar.",
      ],
      result: "O elemento deve mudar de posição, escala, rotação, cor ou estado com uma transição ou animação perceptível.",
      checklist: ["O efeito está ligado ao tema.", "A mudança visual é perceptível.", "O movimento não atrapalha a leitura."],
    };
  }

  return {
    ...base,
    steps: [
      `Resolva a proposta: ${item.activity}`,
      ...base.steps.slice(1),
    ],
  };
}

function instructionalProperties(topic) {
  const exact = {
    "CSS Syntax": ["font-size"],
    "CSS Colors": ["background", "background-color", "color"],
    "CSS Backgrounds": ["background-image", "background"],
    "CSS Borders": ["border-style", "border"],
    "CSS Margins": ["margin"],
    "CSS Padding": ["padding"],
    "CSS Height / Width": ["width", "height"],
    "CSS Box Model": ["padding", "border", "margin"],
    "CSS Outline": ["outline"],
    "CSS Text": ["text-align", "font-size"],
    "CSS Fonts": ["font-family", "font-size"],
    "CSS Icons": ["fill", "color", "width"],
    "CSS Links": ["text-decoration", "color"],
    "CSS Lists": ["list-style-type", "list-style"],
    "CSS Tables": ["border-collapse", "border"],
    "CSS Display": ["display"],
    "CSS Max-width": ["max-width"],
    "CSS Position": ["position"],
    "CSS Position Offsets": ["inset", "top"],
    "CSS Z-index": ["z-index"],
    "CSS Overflow": ["overflow"],
    "Overflow": ["overflow"],
    "Overflow X and Y": ["overflow-x", "overflow-y"],
    "CSS Float": ["float"],
    "CSS Inline-block": ["display"],
    "CSS Align": ["justify-content", "align-items"],
    "CSS Opacity": ["opacity"],
    "CSS Navigation Bars": ["display", "background"],
    "CSS Dropdowns": ["display", "position"],
    "CSS Image Gallery": ["grid-template-columns"],
    "CSS Image Sprites": ["background-position"],
    "CSS Forms": ["padding", "border"],
    "CSS Counters": ["counter-increment", "counter-reset"],
    "CSS Units": ["font-size"],
    "CSS Inheritance": ["color", "font-family"],
    "CSS !important": ["color"],
    "CSS Math Functions": ["font-size", "width"],
    "CSS Accessibility": ["outline", "outline-offset"],
    "CSS Website Layout": ["display", "flex"],
    "CSS Gradients": ["background"],
    "CSS Shadows": ["box-shadow", "text-shadow"],
    "CSS Text Effects": ["text-shadow", "text-transform"],
    "CSS Custom Fonts": ["font-family", "src"],
    "CSS 2D Transforms": ["transform"],
    "CSS 3D Transforms": ["transform", "perspective"],
    "CSS Transitions": ["transition"],
    "CSS Animations": ["animation"],
    "CSS Tooltips": ["opacity", "visibility"],
    "CSS Image Styling": ["border-radius", "object-fit"],
    "CSS Image Modal": ["display", "position"],
    "CSS Image Centering": ["margin", "display"],
    "CSS Image Filters": ["filter"],
    "CSS Image Shapes": ["clip-path"],
    "CSS object-fit": ["object-fit"],
    "CSS object-position": ["object-position"],
    "CSS Masking": ["mask-image", "-webkit-mask-image"],
    "CSS Buttons": ["background", "border-radius"],
    "CSS Pagination": ["background", "color"],
    "CSS Multiple Columns": ["column-count", "column-gap"],
    "CSS User Interface": ["user-select", "resize"],
    "CSS Variables": ["background", "padding"],
    "CSS @property": ["initial-value", "syntax"],
    "CSS Box Sizing": ["box-sizing"],
    "CSS Media Queries": ["background", "display"],
    "CSS FLEXBOX": ["justify-content", "display"],
    "Flexbox Intro": ["display", "gap"],
    "Flex Container": ["justify-content", "align-items"],
    "Flex Items": ["flex-grow", "order"],
    "Flex Responsive": ["flex-wrap", "flex"],
    "CSS GRID": ["grid-template-columns", "display"],
    "Grid Intro": ["grid-template-columns", "display"],
    "Grid Container": ["grid-template-columns", "gap"],
    "Grid Items": ["grid-column", "grid-row"],
    "Grid 12-column Layout": ["grid-template-columns", "grid-column"],
    "CSS @supports": ["display", "border"],
    "CSS RESPONSIVE": ["flex-wrap", "flex"],
    "RWD Intro": ["max-width", "width"],
    "RWD Viewport": ["font-size"],
    "RWD Grid View": ["grid-template-columns", "grid-column"],
    "RWD Media Queries": ["flex-direction"],
    "RWD Images": ["width", "height"],
    "RWD Videos": ["padding-bottom", "aspect-ratio"],
    "RWD Frameworks": ["flex", "width"],
    "RWD Templates": ["grid-template-areas", "grid-template-columns"],
    "CSS CERT": ["border", "background"],
    "CSS Certificate": ["border", "font-family"],
  };
  return exact[topic] || [];
}

function guidedCss(topic, css) {
  const properties = instructionalProperties(topic);
  let target = null;
  let annotated = css;

  for (const property of properties) {
    const declaration = new RegExp(`\\b${property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`);
    const lines = annotated.split("\n");
    const lineIndex = lines.findIndex((line) => declaration.test(line));
    if (lineIndex === -1) continue;
    target = property;
    if (!lines[lineIndex].includes("/*") && lines[lineIndex].includes(";")) {
      lines[lineIndex] = lines[lineIndex].replace(";", "; /* altere esta declaração e observe o efeito */");
      annotated = lines.join("\n");
    }
    break;
  }

  return { css: annotated, target };
}

function referenceSnippet(topic, item) {
  const guided = guidedCss(topic, item.css);
  const startingPoint = guided.target
    ? `Comece pela declaração ${guided.target} indicada abaixo.`
    : "Localize no exemplo a parte relacionada ao tema e altere um valor por vez.";
  const guidance = `/* GUIA DA ATIVIDADE: ${item.activity} ${startingPoint} Salve e compare o antes e o depois. */`;

  if (item.snippet) return `${guidance}\n${item.snippet}`;
  return `<div class="exemplo">
  ${item.html}
</div>

<style>
${guidance}
${guided.css}
</style>`;
}

function page(topic, previous, next, exerciseFile) {
  const item = lesson(topic);
  const title = titleOf(topic);
  const videoLesson = topic === "CSS GRID" ? `
        <section class="painel">
            <h2>Videoaula: CSS Grid</h2>
            <p>Assista à explicação antes de realizar a atividade prática.</p>
            <div class="video-aula">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/Q9rbVLAZcI8"
                    title="Videoaula sobre CSS Grid"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen></iframe>
            </div>
            <p><a href="https://youtu.be/Q9rbVLAZcI8">Abrir a videoaula no YouTube</a></p>
        </section>` : "";
  const conceptsSection = item.concepts ? `        <section class="painel">
            <h2>Conceitos abordados</h2>
            <ul class="lista-topicos">
                ${item.concepts.map(([term, description]) => `<li><strong>${escapeHtml(term)}:</strong> ${escapeHtml(description)}</li>`).join("\n                ")}
            </ul>
        </section>` : "";
  const lessonDetails = [conceptsSection, videoLesson].filter(Boolean).join("\n");
  const extraLessonSection = lessonDetails ? `${lessonDetails}\n` : "";
  const renderedExample = item.html.replaceAll("\n", "\n                ");
  const snippet = referenceSnippet(topic, item);
  const previousLink = previous ? `<a href="${previous.file}">Anterior: ${escapeHtml(titleOf(previous.topic))}</a>` : "<span></span>";
  const nextLink = next ? `<a href="${next.file}">Próxima: ${escapeHtml(titleOf(next.topic))}</a>` : "<span></span>";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="../assets/curso.css">
    <style>
${item.css}
    </style>
</head>
<body>
    <header class="cabecalho-aula">
        <a class="link-voltar" href="../index.html">Voltar ao índice</a>
        <span class="professor">Professor Diogo Fragoso</span>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(summary(topic))}</p>
    </header>

    <main class="aula">
        <section class="painel">
            <h2>Exemplo</h2>
            <div class="exemplo">
                ${renderedExample}
            </div>
        </section>
${extraLessonSection}
        <section class="painel">
            <h2>Código base</h2>
            <pre><code>${escapeHtml(snippet)}</code></pre>
        </section>

        <section class="painel atividade">
            <h2>Atividade prática</h2>
            <p>${escapeHtml(item.activity)}</p>
            <ol>
                <li>Abra esta página no navegador.</li>
                <li>Edite o CSS no arquivo ou no DevTools.</li>
                <li>Anote qual propriedade mudou o resultado visual.</li>
            </ol>
            <p><a class="link-exercicio" href="../exercicios/${exerciseFile}">Abrir página do exercício</a></p>
        </section>

        <nav class="navegacao-aula">
            ${previousLink}
            ${nextLink}
        </nav>
    </main>
</body>
</html>
`;
}

function exercisePage(topic, number, item) {
  const title = titleOf(topic);
  const padded = String(number).padStart(3, "0");
  const guide = exerciseGuide(topic, item);
  const isSass = topic.toLowerCase().includes("sass");
  const studentCssMarkers = isSass ? "" : `        /* STUDENT_CSS_START */
        /* Escreva seu CSS aqui. */
        /* STUDENT_CSS_END */`;
  const sassEditor = isSass ? `
    <script type="text/scss" id="scss-do-aluno">
        /* STUDENT_CSS_START */
        /* Escreva seu SCSS aqui. Este bloco não é executado diretamente pelo navegador. */
        /* STUDENT_CSS_END */
    </script>` : "";
  const sassEditorSection = sassEditor ? `${sassEditor}\n` : "";
  const exerciseReferenceSnippet = referenceSnippet(topic, item);
  const steps = guide.steps.map((step) => `                <li>${escapeHtml(step)}</li>`).join("\n");
  const checklist = guide.checklist.map((step) => `                <li>${escapeHtml(step)}</li>`).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício ${padded} - ${escapeHtml(title)}</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #24313f;
            background: #ffffff;
        }

        main {
            max-width: 900px;
            margin: 0 auto;
            padding: 32px 20px;
        }

        .orientacao {
            margin-bottom: 24px;
            padding: 16px;
            border-left: 5px solid #355070;
            background: #f4f7fb;
        }

        .orientacao h2 {
            margin: 18px 0 8px;
            font-size: 18px;
        }

        .orientacao ol,
        .orientacao ul {
            margin-top: 8px;
            padding-left: 24px;
        }

        .orientacao li + li {
            margin-top: 6px;
        }

        .codigo-referencia {
            margin: 20px 0;
            padding: 16px;
            border: 1px solid #cdd7e2;
            border-radius: 6px;
            background: #ffffff;
        }

        .codigo-referencia h2 {
            margin-top: 0;
        }

        .codigo-referencia pre {
            overflow: auto;
            margin: 10px 0 0;
            padding: 16px;
            border-radius: 6px;
            background: #1f2933;
            color: #edf2f7;
        }

        .codigo-referencia code {
            font-family: Consolas, Monaco, monospace;
        }

        .area-do-aluno {
            min-height: 260px;
            padding: 20px;
            border: 2px dashed #aebdcc;
        }
        .registro-autoria {
            margin-top: 20px;
            padding: 16px;
            border-left: 5px solid #76558d;
            background: #f7f2fa;
        }

${studentCssMarkers}
</style>
${sassEditorSection}</head>
<body>
    <main>
        <section class="orientacao">
            <h1>Exercício ${padded}: ${escapeHtml(title)}</h1>
            <p><strong>Objetivo:</strong> ${escapeHtml(guide.goal)}</p>
            <p><strong>Proposta:</strong> ${escapeHtml(item.activity)}</p>

            <div class="codigo-referencia">
                <h2>Código base de referência</h2>
                <p>Observe como o HTML e as propriedades do tema são usados. Depois crie sua própria solução na área do estudante.</p>
                <pre><code>${escapeHtml(exerciseReferenceSnippet)}</code></pre>
            </div>

            <h2>O que fazer</h2>
            <ol>
${steps}
            </ol>

            <h2>Resultado esperado</h2>
            <p>${escapeHtml(guide.result)}</p>

            <h2>Checklist antes de entregar</h2>
            <ul>
${checklist}
            </ul>
        </section>

        <section class="area-do-aluno">
            <!-- STUDENT_HTML_START -->
            <h2>Minha solução</h2>
            <p>Substitua este conteúdo pela sua resposta.</p>
            <!-- STUDENT_HTML_END -->
        </section>
        <section class="registro-autoria">
            <h2>Registro de autoria</h2>
            <p>Explique uma decisão importante do seu código. Você poderá ser convidado a demonstrá-la ou alterá-la.</p>
            <!-- STUDENT_REFLECTION_START -->
            <p>Explique com suas palavras uma decisão tomada na sua solução.</p>
            <!-- STUDENT_REFLECTION_END -->
        </section>
    </main>
</body>
</html>
`;
}

const css = `
:root {
    --ink: #24313f;
    --muted: #5d6b78;
    --line: #d7e0ea;
    --paper: #ffffff;
    --soft: #f4f7fb;
    --brand: #355070;
    --accent: #b56576;
    --good: #2a9d8f;
}

* { box-sizing: border-box; }

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
    color: var(--ink);
    background: var(--soft);
}

a { color: var(--brand); }
a:hover { color: var(--accent); }

.cabecalho-site,
.cabecalho-aula {
    padding: 36px 24px;
    color: #ffffff;
    background: var(--brand);
}

.cabecalho-site {
    text-align: center;
}

.cabecalho-aula {
    text-align: left;
}

.cabecalho-site h1,
.cabecalho-aula h1 {
    margin: 0 auto 8px;
    max-width: 1100px;
    font-size: 32px;
    line-height: 1.15;
}

.cabecalho-site p,
.cabecalho-site span,
.cabecalho-aula p,
.cabecalho-aula span {
    display: block;
    max-width: 760px;
    margin: 0 auto;
    color: #e8eef4;
}

.professor {
    display: block;
    max-width: 1100px;
    margin: 0 auto 10px;
    color: #cdd9e5;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0;
}

.link-voltar {
    display: inline-block;
    max-width: 1100px;
    margin: 0 auto 14px;
    color: #ffffff;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
}

.cabecalho-aula .link-voltar,
.cabecalho-aula h1,
.cabecalho-aula p,
.cabecalho-aula span {
    margin-left: auto;
    margin-right: auto;
    width: min(100%, 1100px);
}

.layout-indice,
.chamada-layouts,
.aula {
    margin: 0 auto;
    padding: 28px 20px 48px;
}

.chamada-layouts {
    max-width: 1440px;
    padding-bottom: 0;
}

.chamada-layouts .painel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    align-items: center;
    border-left: 7px solid var(--good);
}

.chamada-layouts h2 {
    margin: 0 0 6px;
}

.chamada-layouts p {
    margin: 0;
    color: var(--muted);
}

.botao-layouts {
    display: inline-block;
    padding: 12px 16px;
    border-radius: 6px;
    color: #ffffff;
    background: var(--brand);
    font-weight: bold;
    text-decoration: none;
    white-space: nowrap;
}

.botao-layouts:hover {
    color: #ffffff;
    background: var(--accent);
}

.acoes-indice {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.botao-layouts.secundario {
    color: var(--brand);
    background: #e8eef4;
}

.botao-layouts.secundario:hover {
    color: #ffffff;
    background: var(--accent);
}

.aula {
    max-width: 1100px;
}

.layout-indice {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: start;
    gap: 14px;
    max-width: 1440px;
}

.painel {
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
}

.painel + .painel { margin-top: 20px; }
.lista-topicos { margin: 0; padding-left: 22px; }
.lista-topicos li { margin: 6px 0; }

.layout-indice .painel {
    min-width: 0;
    padding: 18px;
}

.layout-indice .painel h2 {
    margin-top: 0;
    font-size: 18px;
    line-height: 1.25;
}

.layout-indice .lista-topicos {
    font-size: 14px;
}

.layout-indice .lista-topicos a {
    overflow-wrap: anywhere;
}

.layout-indice .lista-topicos li { position: relative; break-inside: avoid; margin: 3px 0; padding: 6px 7px; border-left: 4px solid transparent; border-radius: 6px; border-bottom: 1px solid #edf1f5; }
.layout-indice .lista-topicos a { display: block; padding-right: 76px; text-decoration: none; }
.layout-indice .lista-topicos li.status-completed { border-left-color: #16845b; background: #e9f8f1; }
.layout-indice .lista-topicos li.status-in-progress { border-left-color: #d97706; background: #fff6e5; }
.layout-indice .lista-topicos li.status-not-started { border-left-color: #c24135; background: #fff0ee; }
.status-atividade, .legenda-status-item { display: inline-flex; align-items: center; justify-content: center; border: 1px solid currentColor; border-radius: 999px; font-weight: bold; line-height: 1; white-space: nowrap; }
.status-atividade { position: absolute; top: 50%; right: 6px; padding: 4px 6px; transform: translateY(-50%); font-size: 10px; }
.status-completed .status-atividade, .legenda-status-item.status-completed { color: #116b49; background: #d7f2e5; }
.status-in-progress .status-atividade, .legenda-status-item.status-in-progress { color: #a64b00; background: #ffedc7; }
.status-not-started .status-atividade, .legenda-status-item.status-not-started { color: #a83228; background: #ffddd9; }
.legenda-status { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 12px 0 22px; }
.legenda-status-item { gap: 5px; padding: 7px 10px; font-size: 12px; }
.resumo-status { margin-left: auto; color: var(--muted); font-size: 13px; }

.exemplo {
    min-height: 170px;
    padding: 20px;
    border: 2px dashed #aebdcc;
    background: #fbfdff;
}

.video-aula {
    overflow: hidden;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    background: #111827;
}

.video-aula iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
}

pre {
    overflow: auto;
    margin: 0;
    padding: 16px;
    border-radius: 8px;
    background: #1f2933;
    color: #edf2f7;
}

code { font-family: Consolas, Monaco, monospace; }
.atividade { border-left: 6px solid var(--good); }

.link-exercicio {
    display: inline-block;
    margin-top: 8px;
    padding: 10px 14px;
    border-radius: 6px;
    color: #ffffff;
    background: var(--brand);
    text-decoration: none;
}

.link-exercicio:hover {
    color: #ffffff;
    background: var(--accent);
}

.navegacao-aula {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 22px;
}

@media (max-width: 640px) {
    .cabecalho-site,
    .cabecalho-aula {
        padding: 28px 18px;
    }

    .cabecalho-site h1,
    .cabecalho-aula h1 {
        font-size: 26px;
    }

    .navegacao-aula { display: grid; }
}

@media (max-width: 1180px) {
    .layout-indice {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 820px) {
    .layout-indice {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .chamada-layouts .painel {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 560px) {
    .layout-indice {
        grid-template-columns: 1fr;
        padding-left: 14px;
        padding-right: 14px;
    }
}
`.trim();

function indexPage(pages) {
  const groups = [
    ["Fundamentos", "CSS Syntax", "CSS Errors"],
    ["Caixas e layout básico", "CSS Colors", "Code Challenge"],
    ["Seletores e cascata", "CSS Float", "CSS !important"],
    ["Layout moderno", "CSS Math Functions", "Grid 12-column Layout"],
    ["Responsivo e qualidade", "CSS @supports", "SASS Tutorial"],
  ];

  const sections = groups.map(([name, first, last]) => {
    let active = false;
    const links = [];
    for (const page of pages) {
      if (page.topic === first) active = true;
      if (active) links.push(`<li><a href="aulas/${page.file}">${escapeHtml(titleOf(page.topic))}</a></li>`);
      if (page.topic === last) break;
    }
    return `<section class="painel">
            <h2>${escapeHtml(name)}</h2>
            <ol class="lista-topicos">
                ${links.join("\n                ")}
            </ol>
        </section>`;
  });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curso prático de CSS</title>
    <link rel="stylesheet" href="assets/curso.css">
</head>
<body>
    <header class="cabecalho-site">
        <div class="hero-index">
            <div class="hero-conteudo">
                <span class="etiqueta-curso">CSS Quest</span>
                <h1>Atividades práticas de CSS</h1>
                <p>Aprenda no seu ritmo, complete as missões e acompanhe sua evolução.</p>
                <span class="professor">Professor Diogo Fragoso</span>
            </div>
            <div class="identificacao-aluno">
                <label for="nome-estudante-index">Como podemos chamar você?</label>
                <div class="controle-identificacao">
                    <input id="nome-estudante-index" maxlength="80" autocomplete="name" placeholder="Digite seu nome">
                    <button id="salvar-nome-index" type="button">Entrar na jornada</button>
                </div>
                <p>Olá, <strong id="saudacao-estudante">Estudante</strong>! Seu nome também aparecerá no relatório.</p>
                <span id="mensagem-nome-index" class="mensagem-identificacao" aria-live="polite"></span>
            </div>
        </div>
    </header>

    <main class="pagina-inicial">
        <section class="atalhos-index" aria-label="Ações principais">
            <a class="atalho destaque" href="relatorio-exercicios.html"><span>Progresso</span><strong>Ver dashboard e corrigir atividades</strong></a>
            <a class="atalho" href="aulas/css-sintaxe.html"><span>Começar</span><strong>Abrir a primeira aula</strong></a>
            <a class="atalho" href="atividades-layouts.html"><span>Projetos</span><strong>Praticar layouts completos</strong></a>
        </section>

        <section class="cabecalho-trilha">
            <div><span class="etiqueta-secao">Trilha de aprendizagem</span><h2>Escolha um módulo</h2><p>Os termos técnicos são apresentados em inglês, como usados na documentação.</p></div>
            <label class="busca-topicos" for="busca-topicos"><span>Buscar assunto</span><input id="busca-topicos" type="search" placeholder="Ex.: Grid, Colors, Flexbox…"></label>
        </section>

        <div class="legenda-status" aria-label="Legenda do progresso das atividades">
            <span class="legenda-status-item status-completed">✓ OK</span>
            <span class="legenda-status-item status-in-progress">Parcial</span>
            <span class="legenda-status-item status-not-started">Não iniciado</span>
            <span class="resumo-status" id="resumo-status" aria-live="polite">Carregando progresso…</span>
        </div>

        <div class="layout-indice" id="modulos-curso">
            ${sections.join("\n            ")}
        </div>
        <p id="nenhum-topico" class="nenhum-topico" hidden>Nenhum assunto encontrado.</p>
    </main>

    <script>
        const nameInput = document.querySelector("#nome-estudante-index");
        const studentGreeting = document.querySelector("#saudacao-estudante");
        const nameMessage = document.querySelector("#mensagem-nome-index");
        const savedName = localStorage.getItem("cssQuestStudentName");
        if (savedName) { nameInput.value = savedName; studentGreeting.textContent = savedName; }
        document.querySelector("#salvar-nome-index").addEventListener("click", async () => {
            const name = nameInput.value.trim();
            if (!name) { nameMessage.textContent = "Digite seu nome para continuar."; nameInput.focus(); return; }
            localStorage.setItem("cssQuestStudentName", name);
            studentGreeting.textContent = name;
            nameMessage.textContent = "Nome salvo. Boa jornada!";
            if (location.protocol !== "file:") {
                try {
                    const response = await fetch("/api/perfil", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
                    const result = await response.json();
                    if (!response.ok || !result.ok) throw new Error(result.message);
                    nameMessage.textContent = "Nome salvo no perfil e no relatório. Boa jornada!";
                } catch {
                    nameMessage.textContent = "Nome salvo neste navegador; não foi possível atualizar o JSON.";
                }
            }
        });
        const statusMeta = {
            completed: { label: "✓ OK", className: "status-completed" },
            "in-progress": { label: "Parcial", className: "status-in-progress" },
            "not-started": { label: "Não iniciado", className: "status-not-started" },
        };
        const topicItems = [...document.querySelectorAll("#modulos-curso .lista-topicos li")];
        const statusSummary = document.querySelector("#resumo-status");

        function applyTopicStatus(item, status) {
            const normalizedStatus = statusMeta[status] ? status : "not-started";
            const meta = statusMeta[normalizedStatus];
            item.classList.remove("status-completed", "status-in-progress", "status-not-started");
            item.classList.add(meta.className);
            item.dataset.status = normalizedStatus;
            const badge = item.querySelector(".status-atividade");
            badge.textContent = meta.label;
            badge.setAttribute("aria-label", "Estado da atividade: " + meta.label);
            item.title = "Estado da atividade: " + meta.label;
        }

        topicItems.forEach((item, index) => {
            const link = item.querySelector("a");
            const lessonFile = link.getAttribute("href").split("/").pop();
            item.dataset.exercise = String(index + 1).padStart(3, "0") + "-" + lessonFile;
            const badge = document.createElement("span");
            badge.className = "status-atividade";
            item.appendChild(badge);
            applyTopicStatus(item, "not-started");
        });

        async function loadTopicStatuses() {
            try {
                const response = await fetch("progresso-aluno.json?time=" + Date.now(), { cache: "no-store" });
                if (!response.ok) throw new Error("Progresso indisponível");
                const progress = await response.json();
                const snapshot = progress.snapshot || {};
                const counts = { completed: 0, "in-progress": 0, "not-started": 0 };
                for (const item of topicItems) {
                    const status = snapshot[item.dataset.exercise]?.status || "not-started";
                    applyTopicStatus(item, status);
                    counts[statusMeta[status] ? status : "not-started"]++;
                }
                statusSummary.textContent = counts.completed + " concluídas · " + counts["in-progress"] + " parciais · " + counts["not-started"] + " não iniciadas";
            } catch {
                statusSummary.textContent = location.protocol === "file:"
                    ? "Abra o curso pelo servidor local para carregar o progresso."
                    : "Não foi possível carregar o progresso.";
            }
        }

        loadTopicStatuses();
        window.addEventListener("focus", loadTopicStatuses);
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") loadTopicStatuses();
        });

        const topicSearch = document.querySelector("#busca-topicos");
        const modules = [...document.querySelectorAll("#modulos-curso .painel")];
        topicSearch.addEventListener("input", () => {
            const term = topicSearch.value.trim().toLowerCase();
            let visibleModules = 0;
            for (const module of modules) {
                let visibleLinks = 0;
                for (const item of module.querySelectorAll("li")) {
                    const visible = item.querySelector("a").textContent.toLowerCase().includes(term);
                    item.hidden = !visible;
                    if (visible) visibleLinks++;
                }
                module.hidden = visibleLinks === 0;
                if (visibleLinks) visibleModules++;
            }
            document.querySelector("#nenhum-topico").hidden = visibleModules > 0;
        });
    </script>
</body>
</html>
`;
}

const topics = Object.keys(portugueseFiles);
const pages = topics.map((topic, index) => ({
  topic,
  file: portugueseFiles[topic] || `${slugify(topic)}.html`,
  exerciseFile: `${String(index + 1).padStart(3, "0")}-${(portugueseFiles[topic] || `${slugify(topic)}.html`).replace(/\.html$/, "")}.html`,
}));

fs.mkdirSync(lessonDir, { recursive: true });
fs.mkdirSync(exerciseDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });

const courseCssFile = path.join(assetDir, "curso.css");
if (!fs.existsSync(courseCssFile)) fs.writeFileSync(courseCssFile, css + "\n", "utf8");
const indexFile = path.join(root, "index.html");
if (!fs.existsSync(indexFile)) fs.writeFileSync(indexFile, indexPage(pages), "utf8");

pages.forEach((current, index) => {
  const item = lesson(current.topic);

  fs.writeFileSync(
    path.join(lessonDir, current.file),
    page(current.topic, pages[index - 1], pages[index + 1], current.exerciseFile),
    "utf8"
  );

  fs.writeFileSync(
    path.join(exerciseDir, current.exerciseFile),
    exercisePage(current.topic, index + 1, item),
    "utf8"
  );
});

console.log(`Geradas ${pages.length} aulas em ${lessonDir}`);
console.log(`Gerados ${pages.length} exercícios em ${exerciseDir}`);

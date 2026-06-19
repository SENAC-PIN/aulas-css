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

function lesson(topic) {
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


function exerciseGuide(topic, item) {
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
  const snippet = `<div class="exemplo">
  ${item.html}
</div>

<style>
${item.css}
</style>`;
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
                ${item.html}
            </div>
        </section>
${videoLesson}

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

        /* STUDENT_CSS_START */
        /* Escreva seu CSS aqui. */
        /* STUDENT_CSS_END */
    </style>
</head>
<body>
    <main>
        <section class="orientacao">
            <h1>Exercício ${padded}: ${escapeHtml(title)}</h1>
            <p><strong>Objetivo:</strong> ${escapeHtml(guide.goal)}</p>
            <p><strong>Proposta:</strong> ${escapeHtml(item.activity)}</p>

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
        <span class="professor">Professor Diogo Fragoso</span>
        <h1>Curso prático de CSS</h1>
        <p>Um índice com links para estudar cada assunto e uma atividade prática em cada página.</p>
    </header>

    <section class="chamada-layouts">
        <div class="painel">
            <div>
                <h2>Atividades completas de layout</h2>
                <p>Projetos maiores para praticar Flexbox, Grid, responsividade e organização visual com CSS.</p>
            </div>
            <div class="acoes-indice">
                <a class="botao-layouts" href="relatorio-exercicios.html">Ver meu progresso</a>
                <a class="botao-layouts secundario" href="atividades-layouts.html">Abrir atividades</a>
            </div>
        </div>
    </section>

    <main class="layout-indice">
        ${sections.join("\n        ")}
    </main>
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

fs.writeFileSync(path.join(assetDir, "curso.css"), css + "\n", "utf8");
fs.writeFileSync(path.join(root, "index.html"), indexPage(pages), "utf8");

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

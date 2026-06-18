const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const exerciseDir = path.join(root, "exercicios");
const reportFile = path.join(root, "relatorio-exercicios.html");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const defaultText = [
  "Substitua este conteúdo pela sua resposta.",
  "Substitua este conteudo pela sua resposta.",
];

const checksByName = [
  {
    match: /cores/,
    label: "usar cores em CSS",
    tests: [/\b(background|color)\s*:/i, /#|rgb\(|hsl\(/i],
  },
  {
    match: /fundos|gradientes/,
    label: "configurar fundo",
    tests: [/\bbackground/i],
  },
  {
    match: /bordas/,
    label: "configurar bordas",
    tests: [/\bborder/i],
  },
  {
    match: /margens/,
    label: "usar margem",
    tests: [/\bmargin/i],
  },
  {
    match: /preenchimento/,
    label: "usar padding",
    tests: [/\bpadding/i],
  },
  {
    match: /altura-largura|largura-maxima/,
    label: "controlar tamanho",
    tests: [/\b(width|height|max-width|min-height)\s*:/i],
  },
  {
    match: /modelo-de-caixa|dimensionamento-de-caixa/,
    label: "trabalhar modelo de caixa",
    tests: [/\b(box-sizing|padding|border|margin)\s*:/i],
  },
  {
    match: /contorno/,
    label: "usar outline",
    tests: [/\boutline/i],
  },
  {
    match: /texto|fontes|fontes-personalizadas/,
    label: "estilizar texto",
    tests: [/\b(font|text-|line-height|letter-spacing)\b/i],
  },
  {
    match: /icones|botoes/,
    label: "criar ou estilizar botão",
    tests: [/<button\b/i, /\b(background|border|padding|cursor)\s*:/i],
  },
  {
    match: /links|navegacao|paginacao/,
    label: "estilizar links ou navegação",
    tests: [/<a\b/i, /:hover|\btext-decoration\b|\bdisplay\s*:\s*flex/i],
  },
  {
    match: /listas|contadores/,
    label: "trabalhar listas",
    tests: [/<(ul|ol|li)\b/i, /\blist-style|counter-/i],
  },
  {
    match: /tabelas/,
    label: "criar tabela",
    tests: [/<table\b/i, /<t[dh]\b/i],
  },
  {
    match: /display|bloco-em-linha/,
    label: "usar display",
    tests: [/\bdisplay\s*:/i],
  },
  {
    match: /posicionamento|deslocamentos-de-posicao|z-index/,
    label: "usar posicionamento",
    tests: [/\bposition\s*:/i],
  },
  {
    match: /transbordamento/,
    label: "usar overflow",
    tests: [/\boverflow/i],
  },
  {
    match: /flutuacao/,
    label: "usar float",
    tests: [/\bfloat\s*:/i],
  },
  {
    match: /alinhamento|flexbox|flex-|container-flex|itens-flex/,
    label: "usar flexbox",
    tests: [/\bdisplay\s*:\s*flex/i],
  },
  {
    match: /grid|grade/,
    label: "usar grid",
    tests: [/\bdisplay\s*:\s*grid/i],
  },
  {
    match: /pseudoclasses/,
    label: "usar pseudoclasse",
    tests: [/:hover|:focus|:active|:first-child|:nth-child/i],
  },
  {
    match: /pseudoelementos/,
    label: "usar pseudoelemento",
    tests: [/::before|::after|::first-letter|::first-line/i],
  },
  {
    match: /opacidade/,
    label: "usar opacity",
    tests: [/\bopacity\s*:/i],
  },
  {
    match: /menus-suspensos/,
    label: "criar menu suspenso",
    tests: [/:hover/i, /\bposition\s*:/i],
  },
  {
    match: /imagem|imagens|objeto|mascaras|sprites/,
    label: "trabalhar imagem",
    tests: [/<img\b|background-image|object-fit|filter|clip-path|mask/i],
  },
  {
    match: /formularios|atributo/,
    label: "trabalhar formulário",
    tests: [/<(form|input|label|button)\b/i],
  },
  {
    match: /unidades/,
    label: "usar unidades CSS",
    tests: [/\d+(px|%|rem|em|vw|vh)/i],
  },
  {
    match: /variaveis|property/,
    label: "usar variável CSS",
    tests: [/--[a-z0-9-]+\s*:/i, /var\(/i],
  },
  {
    match: /consultas-de-midia|responsivo|rwd/,
    label: "usar media query",
    tests: [/@media/i],
  },
  {
    match: /supports/,
    label: "usar @supports",
    tests: [/@supports/i],
  },
  {
    match: /transformacoes-2d|transformacoes-3d/,
    label: "usar transform",
    tests: [/\btransform\s*:/i],
  },
  {
    match: /transicoes/,
    label: "usar transition",
    tests: [/\btransition\s*:/i],
  },
  {
    match: /animacoes/,
    label: "usar animation",
    tests: [/\banimation\s*:|@keyframes/i],
  },
  {
    match: /sombras/,
    label: "usar sombra",
    tests: [/\b(box-shadow|text-shadow)\s*:/i],
  },
  {
    match: /sass/,
    label: "responder sobre SASS",
    tests: [/\$[a-z0-9_-]+|var\(|\.scss|sass/i],
  },
];

function listExerciseFiles() {
  if (!fs.existsSync(exerciseDir)) {
    console.error(`Pasta não encontrada: ${exerciseDir}`);
    process.exit(1);
  }

  return fs
    .readdirSync(exerciseDir)
    .filter((file) => file.endsWith(".html"))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function getSpecificCheck(fileName) {
  return checksByName.find((check) => check.match.test(fileName));
}

function evaluate(fileName) {
  const filePath = path.join(exerciseDir, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const problems = [];
  const passed = [];

  if (defaultText.some((text) => source.includes(text))) {
    problems.push("ainda contém o texto padrão do modelo");
  } else {
    passed.push("removeu o texto padrão");
  }

  if (!/<style[\s>]/i.test(source)) {
    problems.push("não possui bloco <style>");
  } else {
    passed.push("possui bloco <style>");
  }

  if (!/class\s*=\s*["'][^"']+["']/i.test(source)) {
    problems.push("não possui pelo menos uma classe HTML");
  } else {
    passed.push("possui classe HTML");
  }

  const specificCheck = getSpecificCheck(fileName);
  if (specificCheck) {
    const failedTests = specificCheck.tests.filter((test) => !test.test(source));
    if (failedTests.length > 0) {
      problems.push(`não atende ao requisito: ${specificCheck.label}`);
    } else {
      passed.push(`atende ao requisito: ${specificCheck.label}`);
    }
  }

  return {
    fileName,
    ok: problems.length === 0,
    problems,
    passed,
  };
}

function formatResult(result) {
  const status = result.ok ? "correto" : "precisa revisar";
  const lines = [`${result.fileName}: ${status}`];

  if (result.problems.length > 0) {
    for (const problem of result.problems) {
      lines.push(`  - ${problem}`);
    }
  }

  return lines.join("\n");
}

function renderList(items, emptyText) {
  if (items.length === 0) {
    return `<p class="vazio">${escapeHtml(emptyText)}</p>`;
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderHtmlReport(results, correct, review) {
  const generatedAt = new Date().toLocaleString("pt-BR");
  const rows = results
    .map((result) => {
      const statusClass = result.ok ? "correto" : "revisar";
      const statusText = result.ok ? "Correto" : "Precisa revisar";

      return `<article class="resultado ${statusClass}">
        <div class="linha-principal">
          <div>
            <h2>${escapeHtml(result.fileName)}</h2>
            <a href="exercicios/${encodeURIComponent(result.fileName)}">Abrir exercício</a>
          </div>
          <span class="status">${statusText}</span>
        </div>

        <div class="detalhes">
          <section>
            <h3>Pontos corretos</h3>
            ${renderList(result.passed, "Nenhum critério confirmado ainda.")}
          </section>
          <section>
            <h3>Precisa revisar</h3>
            ${renderList(result.problems, "Nada para revisar.")}
          </section>
        </div>
      </article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de exercícios</title>
    <style>
        :root {
            --texto: #24313f;
            --muted: #607080;
            --linha: #d7e0ea;
            --fundo: #f4f7fb;
            --papel: #ffffff;
            --azul: #355070;
            --verde: #2d8a5f;
            --vermelho: #b64b4b;
            --amarelo: #fff4d6;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: var(--texto);
            background: var(--fundo);
        }

        header {
            padding: 32px 24px;
            color: #ffffff;
            background: var(--azul);
        }

        header h1,
        header p {
            margin: 0;
        }

        header p {
            margin-top: 8px;
        }

        main {
            max-width: 1180px;
            margin: 0 auto;
            padding: 28px 20px 48px;
        }

        .resumo {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 14px;
            margin-bottom: 22px;
        }

        .cartao {
            padding: 18px;
            border: 1px solid var(--linha);
            border-radius: 8px;
            background: var(--papel);
        }

        .cartao strong {
            display: block;
            font-size: 28px;
        }

        .cartao span {
            color: var(--muted);
        }

        .resultado {
            margin-bottom: 16px;
            padding: 18px;
            border: 1px solid var(--linha);
            border-left: 7px solid var(--verde);
            border-radius: 8px;
            background: var(--papel);
        }

        .resultado.revisar {
            border-left-color: var(--vermelho);
        }

        .linha-principal {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: flex-start;
        }

        h2 {
            margin: 0 0 4px;
            font-size: 18px;
        }

        h3 {
            margin: 0 0 8px;
            font-size: 15px;
        }

        a {
            color: var(--azul);
        }

        .status {
            flex: 0 0 auto;
            padding: 6px 10px;
            border-radius: 999px;
            color: #ffffff;
            background: var(--verde);
            font-weight: bold;
            font-size: 13px;
        }

        .revisar .status {
            background: var(--vermelho);
        }

        .detalhes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }

        ul {
            margin: 0;
            padding-left: 20px;
        }

        .vazio {
            margin: 0;
            color: var(--muted);
        }

        .aviso {
            margin-bottom: 22px;
            padding: 14px 16px;
            border: 1px solid #efd58b;
            border-radius: 8px;
            background: var(--amarelo);
        }

        @media (max-width: 640px) {
            .linha-principal {
                display: grid;
            }

            .status {
                width: max-content;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Relatório de exercícios</h1>
        <p>Gerado em ${escapeHtml(generatedAt)}</p>
    </header>

    <main>
        <section class="resumo">
            <div class="cartao">
                <strong>${results.length}</strong>
                <span>Total de exercícios</span>
            </div>
            <div class="cartao">
                <strong>${correct}</strong>
                <span>Corretos</span>
            </div>
            <div class="cartao">
                <strong>${review}</strong>
                <span>Precisam revisar</span>
            </div>
        </section>

        <section class="aviso">
            Este corretor verifica requisitos objetivos no HTML/CSS. Ele ajuda na triagem, mas a revisão do professor ainda é importante.
        </section>

        ${rows}
    </main>
</body>
</html>
`;
}

const results = listExerciseFiles().map(evaluate);
const correct = results.filter((result) => result.ok).length;
const review = results.length - correct;

const report = [
  "Relatório de exercícios",
  `Total: ${results.length}`,
  `Corretos: ${correct}`,
  `Precisam revisar: ${review}`,
  "",
  ...results.map(formatResult),
  "",
].join("\n");

fs.writeFileSync(reportFile, renderHtmlReport(results, correct, review), "utf8");
console.log(report);
console.log(`Relatório salvo em: ${reportFile}`);

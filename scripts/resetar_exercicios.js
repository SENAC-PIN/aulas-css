const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexFile = path.join(root, "index.html");
const lessonDir = path.join(root, "aulas");
const exerciseDir = path.join(root, "exercicios");
const shouldWrite = process.argv.includes("--confirmar");

function decodeBasicHtml(value) {
  return String(value)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function extractFirst(source, pattern, label, fileName) {
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Não encontrei ${label} em ${fileName}`);
  }

  return decodeBasicHtml(match[1].trim());
}

function getLessonFilesFromIndex() {
  const source = fs.readFileSync(indexFile, "utf8");
  return [...source.matchAll(/href="aulas\/([^"]+\.html)"/g)].map((match) => match[1]);
}

function getLessonInfo(fileName) {
  const lessonPath = path.join(lessonDir, fileName);
  const source = fs.readFileSync(lessonPath, "utf8");
  const title = extractFirst(source, /<h1>([\s\S]*?)<\/h1>/, "título", fileName);
  const activityBlock = extractFirst(
    source,
    /<section class="painel atividade">([\s\S]*?)<\/section>/,
    "bloco de atividade",
    fileName
  );
  const activity = extractFirst(activityBlock, /<p>([\s\S]*?)<\/p>/, "texto da atividade", fileName);
  const exerciseFile = extractFirst(
    source,
    /href="\.\.\/exercicios\/([^"]+\.html)"/,
    "link do exercício",
    fileName
  );

  return {
    title,
    activity,
    exerciseFile,
  };
}

function renderExercisePage({ title, activity, exerciseFile }) {
  const number = exerciseFile.match(/^(\d+)/)?.[1] || "000";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercício ${number} - ${escapeHtml(title)}</title>
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

        .area-do-aluno {
            min-height: 260px;
            padding: 20px;
            border: 2px dashed #aebdcc;
        }
    </style>
</head>
<body>
    <main>
        <section class="orientacao">
            <h1>Exercício ${number}: ${escapeHtml(title)}</h1>
            <p>${escapeHtml(activity)}</p>
            <p>Edite esta página para completar a tarefa.</p>
        </section>

        <section class="area-do-aluno">
            <!-- Área do estudante: escreva o HTML aqui. -->
            <h2>Minha solução</h2>
            <p>Substitua este conteúdo pela sua resposta.</p>
        </section>
    </main>
</body>
</html>
`;
}

if (!fs.existsSync(indexFile)) {
  console.error(`Arquivo não encontrado: ${indexFile}`);
  process.exit(1);
}

if (!fs.existsSync(lessonDir)) {
  console.error(`Pasta não encontrada: ${lessonDir}`);
  process.exit(1);
}

fs.mkdirSync(exerciseDir, { recursive: true });

const lessonFiles = getLessonFilesFromIndex();
const exercises = lessonFiles.map(getLessonInfo);

if (!shouldWrite) {
  console.log("Modo prévia: nenhum arquivo foi alterado.");
  console.log(`Exercícios que seriam resetados: ${exercises.length}`);
  console.log("Para resetar de verdade, rode:");
  console.log("node scripts/resetar_exercicios.js --confirmar");
  process.exit(0);
}

for (const exercise of exercises) {
  fs.writeFileSync(
    path.join(exerciseDir, exercise.exerciseFile),
    renderExercisePage(exercise),
    "utf8"
  );
}

console.log(`Exercícios resetados: ${exercises.length}`);
console.log(`Pasta atualizada: ${exerciseDir}`);

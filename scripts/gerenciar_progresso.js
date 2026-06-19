const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const progressFile = path.join(root, "progresso-aluno.json");
const backupFile = path.join(root, "progresso-aluno.backup.json");

function usage() {
  console.log(`Gerenciador de progresso

Comandos:
  node scripts/gerenciar_progresso.js status
  node scripts/gerenciar_progresso.js perfil "Nome do estudante"
  node scripts/gerenciar_progresso.js exportar [arquivo-de-destino.json]
  node scripts/gerenciar_progresso.js importar <arquivo-de-origem.json>
  node scripts/gerenciar_progresso.js dica <numero-ou-arquivo-do-exercicio>`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validateProgress(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    throw new Error("O backup não contém um objeto JSON válido.");
  }
  if (progress.version !== 1) {
    throw new Error(`Versão de progresso incompatível: ${progress.version ?? "ausente"}.`);
  }
  if (!progress.profile || typeof progress.profile.name !== "string") {
    throw new Error("O backup não contém um perfil válido.");
  }
  if (!progress.history || !Array.isArray(progress.history.activityDates)) {
    throw new Error("O backup não contém um histórico válido.");
  }
  return progress;
}

function loadProgress() {
  if (!fs.existsSync(progressFile)) {
    throw new Error("Execute node scripts/corrigir_exercicios.js para criar o progresso inicial.");
  }
  return validateProgress(readJson(progressFile));
}

function saveProgress(progress) {
  if (fs.existsSync(progressFile)) fs.copyFileSync(progressFile, backupFile);
  fs.writeFileSync(progressFile, `${JSON.stringify(progress, null, 2)}\n`, "utf8");
}

function dateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const [command = "status", ...args] = process.argv.slice(2);

try {
  if (command === "status") {
    const progress = loadProgress();
    const game = progress.derived || {};
    console.log(`Estudante: ${progress.profile.name}`);
    console.log(`Nível: ${game.level || 1}`);
    console.log(`XP: ${game.xp || 0}`);
    console.log(`Sequência: ${game.streak || 0} dia(s)`);
    console.log(`Exercícios concluídos: ${game.completed || 0}`);
  } else if (command === "perfil") {
    const name = args.join(" ").trim();
    if (!name) throw new Error("Informe o nome do estudante.");
    const progress = loadProgress();
    progress.profile.name = name;
    saveProgress(progress);
    console.log(`Perfil atualizado para: ${name}`);
  } else if (command === "exportar") {
    loadProgress();
    const destination = path.resolve(args[0] || path.join(root, `progresso-backup-${dateKey()}.json`));
    if (destination === progressFile) throw new Error("Escolha um destino diferente do arquivo de progresso ativo.");
    fs.copyFileSync(progressFile, destination);
    console.log(`Backup exportado para: ${destination}`);
  } else if (command === "importar") {
    if (!args[0]) throw new Error("Informe o caminho do backup que será importado.");
    const source = path.resolve(args[0]);
    if (!fs.existsSync(source)) throw new Error(`Arquivo não encontrado: ${source}`);
    const imported = validateProgress(readJson(source));
    saveProgress(imported);
    console.log("Progresso importado com sucesso.");
    console.log("Execute node scripts/corrigir_exercicios.js para recalcular XP e badges.");
  } else if (command === "dica") {
    const reference = args.join(" ").trim();
    if (!reference) throw new Error("Informe o exercício em que a dica foi usada.");
    const progress = loadProgress();
    progress.history.hintsUsed ||= {};
    progress.history.hintsUsed[reference] = (progress.history.hintsUsed[reference] || 0) + 1;
    saveProgress(progress);
    console.log(`Uso de dica registrado para: ${reference}`);
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
}

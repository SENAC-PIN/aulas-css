const http = require("http");
const fs = require("fs");
const path = require("path");
const { correctExercises } = require("./corrigir_exercicios");

const root = path.resolve(__dirname, "..");
const progressFile = path.join(root, "progresso-aluno.json");
const progressBackupFile = path.join(root, "progresso-aluno.backup.json");
const host = "127.0.0.1";
const port = Number(process.env.PORT || 3000);
let correctionRunning = false;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function runCorrection(response) {
  if (correctionRunning) {
    sendJson(response, 409, { ok: false, message: "A correção já está em andamento." });
    return;
  }

  correctionRunning = true;
  try {
    const { results } = correctExercises();
    correctionRunning = false;
    sendJson(response, 200, {
      ok: true,
      message: "Correção concluída. O relatório será atualizado.",
      exercises: results.length,
    });
  } catch (error) {
    correctionRunning = false;
    sendJson(response, 500, {
      ok: false,
      message: "Não foi possível corrigir os exercícios.",
      details: error.message,
    });
  }
}

function saveProfile(request, response) {
  let body = "";
  let tooLarge = false;
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 10000) tooLarge = true;
  });
  request.on("end", () => {
    if (tooLarge) {
      sendJson(response, 413, { ok: false, message: "Dados do perfil muito grandes." });
      return;
    }
    try {
      const name = String(JSON.parse(body).name || "").trim();
      if (!name || name.length > 80) {
        sendJson(response, 400, { ok: false, message: "Informe um nome com até 80 caracteres." });
        return;
      }
      if (!fs.existsSync(progressFile)) correctExercises();
      const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
      progress.profile ||= {};
      progress.profile.name = name;
      fs.copyFileSync(progressFile, progressBackupFile);
      fs.writeFileSync(progressFile, `${JSON.stringify(progress, null, 2)}\n`, "utf8");
      sendJson(response, 200, { ok: true, message: "Nome salvo no perfil do estudante.", name });
    } catch (error) {
      sendJson(response, 400, { ok: false, message: "Não foi possível salvar o perfil.", details: error.message });
    }
  });
}

function serveFile(request, response) {
  const requestUrl = new URL(request.url, `http://${host}:${port}`);
  let pathname;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    response.writeHead(400);
    response.end("Endereço inválido.");
    return;
  }

  if (pathname === "/") pathname = "/index.html";
  const filePath = path.resolve(root, `.${pathname}`);
  const insideRoot = filePath === root || filePath.startsWith(`${root}${path.sep}`);
  if (!insideRoot) {
    response.writeHead(403);
    response.end("Acesso negado.");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Arquivo não encontrado.");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/corrigir") {
    runCorrection(response);
    return;
  }
  if (request.method === "POST" && request.url === "/api/perfil") {
    saveProfile(request, response);
    return;
  }
  if (request.method === "GET" || request.method === "HEAD") {
    serveFile(request, response);
    return;
  }
  response.writeHead(405, { Allow: "GET, HEAD, POST" });
  response.end("Método não permitido.");
});

server.listen(port, host, () => {
  console.log("CSS Quest iniciado.");
  console.log(`Curso: http://${host}:${port}/`);
  console.log(`Relatório: http://${host}:${port}/relatorio-exercicios.html`);
  console.log("Pressione Ctrl+C para encerrar.");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`A porta ${port} já está em uso. Defina outra porta com a variável PORT.`);
  } else {
    console.error(`Erro ao iniciar o curso: ${error.message}`);
  }
  process.exitCode = 1;
});

# CSS Quest

CSS Quest é um ambiente local de aprendizagem com aulas, exercícios práticos, correção automática e gamificação. O curso possui uma trilha de assuntos de CSS, relatório de progresso, XP, níveis, badges, sequência de estudos e backup sem banco de dados.

## Requisitos

- Node.js 18 ou superior.
- Um navegador moderno.
- Um editor de código, como Visual Studio Code.

O projeto utiliza apenas recursos nativos do Node.js. Não é necessário executar `npm install`.

Confirme se o Node.js está disponível:

```powershell ou CMD
node --version
```

## Início rápido

Abra o terminal na pasta do projeto e execute:

```powershell ou CMD
node scripts/iniciar_curso.js
```

Depois, abra no navegador:

```text
http://127.0.0.1:3000
```

O relatório pode ser acessado diretamente em:

```text
http://127.0.0.1:3000/relatorio-exercicios.html
```

Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

> O Live Server ou XAMPP pode exibir as páginas, mas não consegue executar a correção. Para utilizar o botão **Corrigir atividades agora**, inicie o projeto com `scripts/iniciar_curso.js`.

### Usar outra porta

Se a porta `3000` estiver ocupada, no PowerShell ou CMD execute:

```powershell
$env:PORT=3001
node scripts/iniciar_curso.js
```

Nesse caso, acesse `http://127.0.0.1:3001`.

## Fluxo recomendado para o estudante

1. Abra o índice do curso pelo endereço local.
2. Digite seu nome e selecione **Entrar na jornada**.
3. Escolha um módulo ou utilize a busca por assunto.
4. Leia a aula e abra o exercício correspondente.
5. Edite o arquivo do exercício no editor de código.
6. Salve o arquivo.
7. Acesse **Ver dashboard e corrigir atividades**.
8. Selecione **Corrigir atividades agora**.
9. Consulte os critérios aprovados, dicas, XP e badges.

O nome informado no índice também aparece no relatório. Quando o curso é executado pelo servidor local, ele é salvo em `progresso-aluno.json`.

## Como responder aos exercícios

O corretor avalia somente o código escrito dentro das áreas do estudante. Não remova os marcadores.

### Student HTML

```html
<!-- STUDENT_HTML_START -->
<div class="card">Minha solução</div>
<!-- STUDENT_HTML_END -->
```

### Student CSS

```css
/* STUDENT_CSS_START */
.card {
    padding: 1rem;
    background: hsl(210, 70%, 50%);
}
/* STUDENT_CSS_END */
```

### Registro de autoria

```html
<!-- STUDENT_REFLECTION_START -->
<p>Explique com suas palavras uma decisão importante tomada na solução.</p>
<!-- STUDENT_REFLECTION_END -->
```

A reflexão deve ter pelo menos 40 caracteres e demonstrar compreensão da solução.

## Relatório e correção

O relatório apresenta:

- Estado de cada missão: **Não iniciado**, **Em andamento** ou **Concluído**.
- Pontuação por critérios objetivos.
- Dicas para os critérios pendentes.
- Busca e filtros por estado.
- Paginação com 12 exercícios por página.
- Dashboard de XP, nível, sequência e badges.
- Checkpoints de autoria para explicação do código.

Para corrigir pelo terminal, sem usar o botão:

```powershell
node scripts/corrigir_exercicios.js
```

Esse comando atualiza:

- `relatorio-exercicios.html`
- `progresso-aluno.json`
- `progresso-aluno.backup.json`

## Gamificação

A pontuação é reconstruída a partir dos arquivos dos exercícios:

- Cada critério aprovado concede `10 XP`.
- Cada missão concluída concede mais `50 XP`.
- Um novo nível é alcançado a cada `500 XP`.
- A atividade em dias consecutivos aumenta a sequência de estudos.
- Conjuntos de missões desbloqueiam badges, como **Flexbox Explorer** e **Grid Architect**.

Como o XP é recalculado, apagar o cache do navegador não elimina as respostas ou conquistas derivadas dos exercícios.

## Perfil, backup e transferência

Consultar o estado atual:

```powershell
node scripts/gerenciar_progresso.js status
```

Definir o nome pelo terminal:

```powershell
node scripts/gerenciar_progresso.js perfil "Nome do estudante"
```

Exportar um backup:

```powershell
node scripts/gerenciar_progresso.js exportar
```

Também é possível escolher o destino:

```powershell
node scripts/gerenciar_progresso.js exportar progresso-backup-turma.json
```

Importar em outro computador:

```powershell
node scripts/gerenciar_progresso.js importar caminho/do/progresso.json
node scripts/corrigir_exercicios.js
```

Para levar o curso completo a outro computador, copie também a pasta `exercicios`, pois os arquivos HTML são a fonte principal das respostas.

## Dicas utilizadas

O uso de uma dica pode ser registrado com:

```powershell
node scripts/gerenciar_progresso.js dica 006-css-cores.html
```

## Resetar os exercícios

Faça um backup antes de resetar:

```powershell
node scripts/gerenciar_progresso.js exportar
```

Veja primeiro uma prévia, sem alterar arquivos:

```powershell
node scripts/resetar_exercicios.js
```

Para confirmar o reset dos exercícios:

```powershell
node scripts/resetar_exercicios.js --confirmar
node scripts/corrigir_exercicios.js
```

> Atenção: o reset sobrescreve as respostas existentes nos arquivos da pasta `exercicios`.

## Gerar novamente aulas e exercícios

O script abaixo recria o índice, as aulas e os exercícios:

```powershell
node scripts/gerar_css_atividades.js
```

Esse comando é destinado à manutenção do curso. Ele pode sobrescrever soluções dos estudantes e não deve ser executado durante uma atividade sem um backup completo.

## Autoria e uso de IA

O projeto não utiliza detectores automáticos de IA, pois eles não são confiáveis. A autoria é trabalhada por meio de:

- Reflexão escrita sobre decisões do código.
- Critérios específicos para cada atividade.
- Perguntas de defesa da solução.
- Pequenas alterações do código realizadas ao vivo.

O estudante deve ser capaz de explicar o que escreveu e adaptar a solução sem ajuda externa.

## Estrutura principal

```text
aulas-css/
├── aulas/                         # Conteúdo das aulas
├── exercicios/                    # Respostas e exercícios individuais
├── layouts-exercicios/            # Projetos completos de layout
├── assets/curso.css               # Estilos compartilhados
├── scripts/
│   ├── iniciar_curso.js           # Servidor local e APIs
│   ├── corrigir_exercicios.js     # Correção, rubricas e relatório
│   ├── gerenciar_progresso.js     # Perfil, exportação e importação
│   ├── resetar_exercicios.js      # Restauração dos exercícios
│   └── gerar_css_atividades.js    # Geração completa do conteúdo
├── index.html                     # Página inicial
├── relatorio-exercicios.html      # Dashboard gerado
└── progresso-aluno.json           # Perfil e histórico persistente
```

## Solução de problemas

### O botão de correção não funciona

Confirme que o servidor está ativo e que a página foi aberta por `http://127.0.0.1:3000`, não diretamente por `file://` ou somente pelo Live Server.

### O exercício mudou visualmente, mas não pontuou

Verifique se o HTML, CSS e reflexão estão dentro dos respectivos marcadores `STUDENT_*`. Depois salve o arquivo e execute novamente a correção.

### O nome aparece no índice, mas não está no JSON

Abra o curso pelo servidor local ou execute:

```powershell
node scripts/gerenciar_progresso.js perfil "Nome do estudante"
```

### O relatório parece desatualizado

Selecione **Corrigir atividades agora** ou execute:

```powershell
node scripts/corrigir_exercicios.js
```

### A porta está ocupada

Encerre a outra aplicação ou defina uma porta diferente antes de iniciar o curso.

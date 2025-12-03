# Sistema de Faltas (simples)

Projeto didático muito simples para registrar faltas usando apenas HTML/CSS/JS e localStorage.

Principais pontos
- Sem backend, sem bibliotecas, sem classes, sem módulos.
- Usa localStorage para armazenar: alunos, histórico, usuário logado.
- Funções principais expostas no `assets/app.js` (nomes simples solicitados).

Páginas
- `login.html` — tela de login (usuários fixos para teste)
- `dashboard.html` — resumo, total de alunos e faltas
- `alunos.html` — listar, buscar, filtrar por turma e adicionar (somente coordenação)
- `faltas.html` — registrar faltas e ver histórico

Usuários de teste
- coord / coord123  (coordenação)
- prof / prof123    (professor)

Como usar
1. Abra `login.html` em um navegador (ex: arraste para o navegador ou use um servidor simples).
2. Faça login com uma das contas de teste.
3. Navegue entre Dashboard, Alunos e Faltas.

Observações de implementação
- Turmas aceitas: `DS 1`, `DS 2`, `DS 3`, `CTB 1`, `CTB 2`, `CTB 3`, `MULT 1`, `MULT 2`, `MULT 3`.
  - Abreviações como `ds1`, `DS1`, `ds 1` são normalizadas.
- Armazenamento:
  - `alunos` (array) — cada elemento: `{ nome, turma, faltas }`
  - `historico` (array) — registros de faltas simples
  - `loggedUser` — objeto `{username, role}`

Funções exigidas
- `loginUser()`, `logoutUser()`, `getLoggedUser()`
- `carregarAlunos()`, `salvarAlunos()`, `adicionarAluno()`, `buscarAluno()`, `filtrarAlunosPorTurma()`, `mostrarAlunosNaTela()`
- `registrarFalta()`, `mostrarHistorico()`

Licença e nota
Este projeto é intencionalmente simples e didático. Faça modificações conforme necessário.
# Sitema-de-faltas01
 

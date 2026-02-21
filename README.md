# Sistema de Faltas (Fila do Almoco)

Projeto didatico feito em HTML/CSS/JS puro (sem backend). Toda a logica roda no navegador e os dados ficam em memoria enquanto a pagina esta aberta.

Demonstracao (site)
- https://fila-do-almoco.vercel.app/

## Como usar
1. Abra `index.html` no navegador.
2. Clique em "Acessar Sistema" para ir para `login.html`.
3. Use o login definido no codigo (ver `login.html`).
4. No painel (`dashboard.html`), navegue entre as abas e interaja com turmas, alunos e faltas.

## Estrutura do projeto
- `index.html`: pagina inicial (hero + rodape).
- `login.html`: tela de login e validacao simples em JavaScript.
- `dashboard.html`: painel com fila, relatorios, turmas e registro de faltas.
- `estilos/style.css`: estilos globais, da pagina inicial, login e dashboard.

## Explicacao detalhada por arquivo

**`index.html`**
- `<!DOCTYPE html>` define que o documento usa HTML5.
- `<html lang="pt-br">` informa o idioma da pagina.
- `<head>` carrega metadados, titulo e o arquivo CSS.
- `<link rel="stylesheet" href="estilos/style.css">` aplica os estilos globais.
- `<link rel="shortcut icon" ...>` define o favicon.
- `<body class="index-html">` aplica estilos especificos da pagina inicial.
- `<header id="Central">` cria o bloco principal (hero).
- `<div class="hero">` agrupa o conteudo central.
- `<span class="hero-badge">` exibe um selo visual.
- `<h1>` mostra o titulo "Fila Do Almoco".
- `<p>` descreve o objetivo do sistema.
- `<a href="login.html" class="btn-acessar">` leva para a tela de login.
- `<footer id="footer">` cria o rodape com informacoes da escola.
- `<ul class="footer-links">` lista links (contato/suporte).
- `<p class="footer-copy">` mostra o copyright.

**`login.html`**
- O `<head>` define titulo, charset e carrega `estilos/style.css`.
- O `<body id="login-html">` ativa estilos da tela de login.
- O `<form onsubmit="entrar(); return false;">` chama a funcao `entrar()` e impede o envio tradicional.
- Os `<input>` possuem `required` e `minlength` para validar rapidamente.

**Funcao `entrar()` (linha a linha)**
- `const iemail = document.getElementById("iemail").value;`
  - Busca o valor digitado no campo de email.
- `const isenha = document.getElementById("isenha").value;`
  - Busca o valor digitado no campo de senha.
- `if (iemail === "adm@gmail.com" && isenha === "12345") {`
  - Verifica se o email e a senha batem com o par fixo.
- `alert("Bem-vindo, Matheus!");`
  - Mostra uma mensagem de boas-vindas.
- `location.href = "dashboard.html"`
  - Redireciona para o painel.
- `} else { alert("Email ou senha incorretos!"); }`
  - Se os dados nao batem, mostra erro.

**Como trocar o login**
- Altere os textos dentro do `if` na funcao `entrar()`.
- Exemplo: trocar `adm@gmail.com` e `12345` pelos dados desejados.

**`dashboard.html`**
- A pagina e dividida em duas areas: `aside.sidebar` (menu) e `.main-content` (conteudo).
- Cada item do menu tem `data-view` e cada secao tem `data-view-panel`.
- O JavaScript alterna as sessoes ligando/desligando a classe `active`.

**Dados principais (JS)**
- `turmasData` e um objeto que agrupa turmas e alunos:
  - Chave: nome da turma.
  - Valor: array de alunos `{ nome, faltas }`.

**Funcao `toggleSidebar()`**
- `document.querySelector('.sidebar').classList.toggle('active');`
  - Abre/fecha a sidebar adicionando/removendo a classe `active`.

**Funcao `preencherSelectsTurma()`**
- `const turmas = Object.keys(turmasData);`
  - Cria uma lista com os nomes das turmas.
- `turmas.forEach((turma) => { ... })`
  - Para cada turma, cria uma `<option>`.
- `turmaAlunosSelect.appendChild(optionAlunos);`
  - Adiciona a opcao no select de turmas da aba "Alunos".
- `turmaConfigSelect.appendChild(optionConfig);`
  - Adiciona a opcao no select da aba "Registrar".

**Funcao `preencherSelectAlunos(turma)`**
- `alunoConfigSelect.innerHTML = '';`
  - Limpa o select de alunos.
- `(turmasData[turma] || []).forEach((aluno) => { ... })`
  - Para cada aluno, cria uma opcao no select.
- `atualizarFaltasAtual();`
  - Atualiza o texto que mostra as faltas do aluno selecionado.

**Funcao `renderTabelaAlunos(turma)`**
- `tabelaAlunosBody.innerHTML = '';`
  - Limpa a tabela.
- `const alunos = turmasData[turma] || [];`
  - Garante um array mesmo se a turma nao existir.
- `alunos.forEach((aluno, index) => { ... })`
  - Monta uma linha com nome, faltas e botao de remover.

**Funcao `calcularTotalFaltas(turma)`**
- Usa `reduce()` para somar todas as faltas dos alunos da turma.

**Funcao `renderFila()`**
- Cria uma lista com `{ turma, faltas }` para cada turma.
- Ordena por menos faltas (`sort`).
- Preenche a lista `#fila-menos` com `<li>`.

**Funcao `atualizarFaltasAtual()`**
- Pega turma e aluno selecionados.
- Procura o aluno no array da turma.
- Se nao existir, limpa o texto.
- Se existir, mostra "Faltas atuais de X: Y".

**Funcao `sincronizarTurmaSelecionada(turma)`**
- Deixa os dois selects de turma com o mesmo valor.
- Recarrega alunos, tabela e fila com base na turma escolhida.

**Eventos principais**
- Clique no menu lateral:
  - Troca a aba ativa (`.view-panel`).
- Clique nas tabs de periodo (diario/semanal/mensal):
  - Alterna os paines com `.period-panel`.
- Mudanca no select de turmas:
  - Atualiza alunos, tabela e fila.
- Clique em "Adicionar aluno":
  - Insere novo aluno com 0 faltas.
- Clique em "Remover" na tabela:
  - Remove o aluno da turma atual.
- Clique em "Adicionar falta":
  - Soma a quantidade ao aluno escolhido.
- Clique em "Retirar falta":
  - Subtrai a quantidade (nunca fica negativo).

**Inicializacao (fim do script)**
- `preencherSelectsTurma();`
  - Prepara os selects com as turmas.
- `sincronizarTurmaSelecionada(Object.keys(turmasData)[0]);`
  - Seleciona a primeira turma e renderiza tudo.

## CSS (estilos/style.css) - explicacao por bloco
- `:root`: define variaveis de cor, sombras e superfices.
- `body`: define fonte, tamanho base e cor padrao.
- `body.index-html`: aplica fundo gradiente e cores da home.
- `#Central`, `.hero`, `.hero-badge`, `.btn-acessar`: layout e destaque do hero.
- `#footer` e classes `.footer-*`: estilos do rodape.
- `body#login-html`, `section#login`, `.campo`, `.btn-voltar`: layout do login.
- `body.dashboard-html`: layout geral do painel.
- `.sidebar`, `.sidebar.active`, `.sidebar-close`: menu lateral e estado aberto.
- `.view-panel` e `.view-panel.active`: controla exibicao das abas.
- `.tabs`, `.tab-btn`, `.period-panel`: tabs de periodo.
- `.alunos-toolbar`, `.data-table`, `.badge`: tabela de alunos.
- `.queue-list` e `.queue-card`: fila do almoco.
- `.topbar`, `.btn-menu`, `.btn-sair`: barra superior.

## O que editar quando quiser mudar algo
- Textos da pagina inicial: `index.html`.
- Credenciais de login: `login.html` (funcao `entrar()`).
- Turmas, alunos e faltas iniciais: `dashboard.html` (objeto `turmasData`).
- Cores, tipografia e layout: `estilos/style.css`.

## Observacoes importantes
- Nao ha banco de dados. Tudo e apenas em memoria.
- Ao recarregar a pagina, as alteracoes (alunos/faltas) se perdem.
- Se quiser salvar dados, precisa integrar com backend ou `localStorage`.


## Ainda será realizada atualizaçoes, o projeto está em evoluçao constante!!!
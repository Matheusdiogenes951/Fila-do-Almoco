# Sistema de Faltas (Fila do Almoco)

Projeto didatico feito com HTML, CSS e JavaScript puro, sem backend.

## Demo
- https://fila-do-almoco.vercel.app/

## Funcionalidades
- Login com perfis diferentes (`admin` e `aluno`).
- Dashboard com fila do almoco por ordem de menor numero de faltas por turma.
- Cadastro e remocao de alunos (admin).
- Registro e remocao de faltas (admin).
- Persistencia dos dados em `localStorage`.
- Atualizacao da fila entre abas abertas no mesmo navegador (evento `storage`).

## Perfis de acesso
- `adm@gmail.com` / `12345`
  - Acesso completo: Fila, Relatorios, Turmas e Registrar.
- `aluno@gmail.com` / `12345`
  - Acesso apenas a Fila.
  - Itens de menu nao permitidos ficam ocultos.

## Como executar localmente
1. Abra `index.html` no navegador.
2. Clique em "Acessar Sistema".
3. Faça login em `login.html`.
4. Use o `dashboard.html` conforme o perfil.

## Estrutura do projeto
- `index.html`: pagina inicial.
- `login.html`: formulario de login.
- `dashboard.html`: interface principal com menu lateral e paineis.
- `scripts/login.js`: autenticacao e definicao do perfil em sessao local.
- `scripts/dashboard.js`: regras de permissao, fila, turmas, faltas e sincronizacao.
- `estilos/style.css`: estilos globais.

## Persistencia de dados
- Chave de usuario logado: `usuarioLogado`
- Chave das turmas e faltas: `turmasData`
- Os dados ficam salvos no navegador (localStorage).
- Se limpar o armazenamento do navegador, os dados voltam para o padrao do codigo.

## Observacoes
- Nao existe banco de dados ou API.
- Como e um projeto front-end puro, os dados sao locais ao navegador/dispositivo.
- Para uso real em producao, o ideal e migrar autenticacao e dados para backend.

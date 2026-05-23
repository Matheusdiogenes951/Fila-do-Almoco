# Sistema de Faltas (Fila do Almoço)

Uma aplicação web didática para gerenciar a fila do almoço de turmas escolares com base no número de faltas dos alunos. O sistema permite cadastrar alunos, registrar faltas, gerar relatórios e ordenar a fila priorizando alunos com menos faltas — útil para simulações, treinamentos e como base para integrar uma persistência real (ex: Supabase).

## Propósito
- Priorizar atendimento na fila do almoço com base em faltas.
- Fornecer uma base simples para ensino de front-end + API em Flask.
- Servir como protótipo para migrar a persistência para um serviço como Supabase.

## Demo
- https://fila-do-almoco.vercel.app/

## Tecnologias
- Frontend: HTML, CSS, JavaScript
- Backend: Python 3 + Flask

## Funcionalidades
- Login com perfis diferentes (admin e aluno) validado pela API.
- Dashboard com fila do almoço por ordem de menor número de faltas por turma.
- Cadastro e remoção de alunos (admin).
- Registro e remoção de faltas (admin).
- Relatórios calculados a partir dos dados atuais da API.
- Estrutura preparada para migrar a persistência para Supabase.

## Perfis de acesso (exemplos)
- adm@gmail.com / 12345 — Acesso completo: Fila, Relatórios, Turmas e Registrar.
- aluno@gmail.com / 12345 — Acesso apenas à Fila (itens ocultos conforme permissão).

## Como executar localmente
1. Instale o Python 3 se ainda não estiver instalado.
2. Crie um ambiente virtual:

   - macOS / Linux:

     ```bash
     python3 -m venv .venv
     source .venv/bin\activate
     ```

   - Windows (PowerShell):

     ```powershell
     python -m venv .venv
     .\\.venv\\Scripts\\Activate.ps1
     ```

3. Instale as dependências:

   ```bash
   python -m pip install -r requeriments.txt
   ```

4. Rode a aplicação:

   ```bash
   python api/index.py
   ```

5. Abra `http://127.0.0.1:5000/` no navegador e faça login conforme perfil.

## Estrutura do projeto
- index.html — página inicial.
- login.html — formulário de login.
- dashboard.html — interface principal com menu lateral e painéis.
- scripts/login.js — autenticação contra a API.
- scripts/dashboard.js — consumo da API, regras de permissão e renderização do painel.
- estilos/style.css — estilos globais.
- api/index.py — backend Flask, rotas HTML e API.

## Persistência de dados
- Chave de sessão no navegador: `usuarioLogado`
- Atualmente os dados de turmas e faltas ficam em memória no backend Flask.
- Ao reiniciar o servidor, os dados voltam ao padrão definido em `index.py`.



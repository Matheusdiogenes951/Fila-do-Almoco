# Sistema de Faltas (Fila do Almoco)

Projeto didatico com frontend em HTML/CSS/JavaScript e backend Flask.

## Demo
- https://fila-do-almoco.vercel.app/

## Funcionalidades
- Login com perfis diferentes (`admin` e `aluno`) validado pela API.
- Dashboard com fila do almoco por ordem de menor numero de faltas por turma.
- Cadastro e remocao de alunos (admin).
- Registro e remocao de faltas (admin).
- Relatorios calculados a partir dos dados atuais da API.
- Estrutura pronta para migrar a persistencia para Supabase depois.

## Perfis de acesso
- `adm@gmail.com` / `12345`
  - Acesso completo: Fila, Relatorios, Turmas e Registrar.
- `aluno@gmail.com` / `12345`
  - Acesso apenas a Fila.
  - Itens de menu nao permitidos ficam ocultos.

## Como executar localmente
1. Instale o Flask se ainda nao estiver instalado: `pip install flask`
2. Rode a aplicacao: `python index.py`
3. Abra `http://127.0.0.1:5000/`
4. Faça login e use o dashboard conforme o perfil.

## Estrutura do projeto
- `index.html`: pagina inicial.
- `login.html`: formulario de login.
- `dashboard.html`: interface principal com menu lateral e paineis.
- `scripts/login.js`: autenticacao contra a API.
- `scripts/dashboard.js`: consumo da API, regras de permissao e renderizacao do painel.
- `estilos/style.css`: estilos globais.
- `index.py`: backend Flask, rotas HTML e API.

## Persistencia de dados
- Chave de sessao no navegador: `usuarioLogado`
- Os dados de turmas e faltas ficam em memoria no backend Flask.
- Ao reiniciar o servidor, os dados voltam para o padrao definido em `index.py`.
- O ponto de troca para Supabase fica centralizado no backend, sem precisar reescrever o front.

## Observacoes
- Ainda nao existe banco de dados real.
- Para producao, a proxima etapa natural e trocar a estrutura em memoria por Supabase.
- As credenciais continuam didaticas e nao devem ser usadas em ambiente real.

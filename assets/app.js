// Usuários fixos
var users = [
  {username: 'coord', password: 'coord123', role: 'coord'},
  {username: 'prof', password: 'prof123', role: 'prof'}
];

// --- Login (obrigatório: loginUser, logoutUser, getLoggedUser)
function loginUser(evt) {
  if (evt) evt.preventDefault && evt.preventDefault();
  var u = document.getElementById('username');
  var p = document.getElementById('password');
  var name = u ? u.value.trim() : '';
  var pass = p ? p.value : '';
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === name && users[i].password === pass) {
      found = users[i];
      break;
    }
  }
  if (found) {
    localStorage.setItem('loggedUser', JSON.stringify({username: found.username, role: found.role}));
    location.href = 'dashboard.html';
    return true;
  }
  alert('Credenciais inválidas');
  return false;
}

function logoutUser() {
  localStorage.removeItem('loggedUser');
  location.href = 'login.html';
}

function getLoggedUser() {
  var s = localStorage.getItem('loggedUser');
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}

// --- Alunos
function carregarAlunos() {
  var s = localStorage.getItem('alunos');
  if (!s) return [];
  try { return JSON.parse(s); } catch (e) { return []; }
}

function salvarAlunos(arr) {
  localStorage.setItem('alunos', JSON.stringify(arr));
}

function adicionarAluno(nome, turma) {
  if (!nome || !turma) return false;
  var alunos = carregarAlunos();
  // evitar duplicados simples
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].nome === nome) return false;
  }
  var t = normalizarTurma(turma);
  var novo = {nome: nome, turma: t, faltas: 0};
  alunos.push(novo);
  salvarAlunos(alunos);
  return true;
}

function buscarAluno(nome) {
  var alunos = carregarAlunos();
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].nome === nome) return alunos[i];
  }
  return null;
}

function filtrarAlunosPorTurma(turma) {
  if (!turma) return carregarAlunos();
  var t = normalizarTurma(turma);
  var alunos = carregarAlunos();
  var res = [];
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].turma === t) res.push(alunos[i]);
  }
  return res;
}

function normalizarTurma(input) {
  if (!input) return '';
  var s = input.trim();
  // remover espaços internos para comparar abreviações
  var noSpace = s.split(' ').join('').toUpperCase();
  // checar DS
  if (noSpace === 'DS1' || noSpace === 'DS01') return 'DS 1';
  if (noSpace === 'DS2' || noSpace === 'DS02') return 'DS 2';
  if (noSpace === 'DS3' || noSpace === 'DS03') return 'DS 3';
  // CTB
  if (noSpace === 'CTB1' || noSpace === 'CTB01') return 'CTB 1';
  if (noSpace === 'CTB2' || noSpace === 'CTB02') return 'CTB 2';
  if (noSpace === 'CTB3' || noSpace === 'CTB03') return 'CTB 3';
  // MULT
  if (noSpace === 'MULT1' || noSpace === 'MULT01') return 'MULT 1';
  if (noSpace === 'MULT2' || noSpace === 'MULT02') return 'MULT 2';
  if (noSpace === 'MULT3' || noSpace === 'MULT03') return 'MULT 3';
  // se não reconhece, retorna a entrada trimada em maiúsculas padronizada
  return s.toUpperCase();
}

function mostrarAlunosNaTela(containerId, lista) {
  var cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = '';
  for (var i = 0; i < lista.length; i++) {
    var a = lista[i];
    var div = document.createElement('div');
    div.innerHTML = '<strong>' + a.nome + '</strong> <span class="muted">(' + a.turma + ')</span> - Faltas: ' + a.faltas;
    cont.appendChild(div);
  }
}

// --- Faltas e histórico
function registrarFalta(nome, qtd) {
  if (!nome) return false;
  var alunos = carregarAlunos();
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].nome === nome) {
      var add = Number(qtd) || 1;
      alunos[i].faltas = (Number(alunos[i].faltas) || 0) + add;
      salvarAlunos(alunos);
      // salvar histórico
      var hist = carregarHistorico();
      hist.push({nome: nome, turma: alunos[i].turma, faltasAdded: add, date: new Date().toISOString(), by: (getLoggedUser() || {}).username || ''});
      localStorage.setItem('historico', JSON.stringify(hist));
      return true;
    }
  }
  return false;
}

function carregarHistorico() {
  var s = localStorage.getItem('historico');
  if (!s) return [];
  try { return JSON.parse(s); } catch (e) { return []; }
}

function mostrarHistorico(containerId) {
  var cont = document.getElementById(containerId);
  if (!cont) return;
  var hist = carregarHistorico();
  cont.innerHTML = '';
  var lu = getLoggedUser();
  // mostrar do mais recente para o mais antigo
  for (var i = hist.length - 1; i >= 0; i--) {
    var h = hist[i];
    var div = document.createElement('div');
    div.className = 'history-entry';
    var d = new Date(h.date).toLocaleString();
    var left = document.createElement('div');
    left.innerHTML = d + ' - <strong>' + h.nome + '</strong> (' + h.turma + ') faltas: +' + h.faltasAdded + ' por ' + (h.by || '');
    div.appendChild(left);
    // mostrar botão de apagar apenas para coord
    if (lu && lu.role === 'coord') {
      (function(idx){
        var btn = document.createElement('button');
        btn.className = 'del-btn';
        btn.textContent = 'Apagar';
        btn.addEventListener('click', function(){
          if (!confirm('Confirma apagar este registro de falta?')) return;
          apagarFalta(idx);
        });
        div.appendChild(btn);
      })(i);
    }
    cont.appendChild(div);
  }
}

// Apaga um registro de histórico de faltas pelo índice no array (index no localStorage)
function apagarFalta(index) {
  var hist = carregarHistorico();
  if (!hist || index < 0 || index >= hist.length) return false;
  var rec = hist[index];
  // ajustar faltas do aluno correspondente
  var alunos = carregarAlunos();
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].nome === rec.nome && alunos[i].turma === rec.turma) {
      var cur = Number(alunos[i].faltas) || 0;
      var sub = Number(rec.faltasAdded) || 0;
      var novo = cur - sub;
      if (novo < 0) novo = 0;
      alunos[i].faltas = novo;
      break;
    }
  }
  // remover do histórico
  hist.splice(index, 1);
  // salvar alterações
  salvarAlunos(alunos);
  localStorage.setItem('historico', JSON.stringify(hist));
  // atualizar UI
  mostrarHistorico('historicoList');
  updateFaltasList();
  updateAlunosList();
  // atualizar totals no dashboard se existir
  var totalFaltas = document.getElementById('totalFaltas');
  if (totalFaltas) {
    var sum = 0; var all = carregarAlunos();
    for (var j = 0; j < all.length; j++) sum += Number(all[j].faltas) || 0;
    totalFaltas.textContent = sum;
  }
  return true;
}

// --- Inicialização por página (liga eventos)
function initPages() {
  // login
  var lf = document.getElementById('loginForm');
  if (lf) lf.addEventListener('submit', loginUser);

  // logout
  var lb = document.getElementById('logoutBtn');
  if (lb) lb.addEventListener('click', logoutUser);

  // mostrar usuário em header
  var uinfo = document.getElementById('userInfo');
  var lu = getLoggedUser();
  if (uinfo) {
    if (lu) uinfo.textContent = lu.username + ' (' + lu.role + ')';
    else uinfo.textContent = '';
  }

  // dashboard
  var dashUser = document.getElementById('dashUser');
  var dashRole = document.getElementById('dashRole');
  var totalAlunos = document.getElementById('totalAlunos');
  var totalFaltas = document.getElementById('totalFaltas');
  if (dashUser) dashUser.textContent = lu ? lu.username : '';
  if (dashRole) dashRole.textContent = lu ? lu.role : '';
  if (totalAlunos) totalAlunos.textContent = carregarAlunos().length;
  if (totalFaltas) {
    var sum = 0; var all = carregarAlunos();
    for (var i = 0; i < all.length; i++) sum += Number(all[i].faltas) || 0;
    totalFaltas.textContent = sum;
  }

  // alunos page
  var addForm = document.getElementById('addAlunoForm');
  if (addForm) {
    // permissão: só coord pode ver o formulário
    if (!lu || lu.role !== 'coord') addForm.style.display = 'none';
    addForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var nome = document.getElementById('alunoNome').value.trim();
      var turma = document.getElementById('alunoTurma').value.trim();
      if (!nome || !turma) return alert('Preencha nome e turma');
      var ok = adicionarAluno(nome, turma);
      if (!ok) return alert('Aluno já existe ou dados inválidos');
      updateAlunosList();
      addForm.reset();
    });
  }

  var search = document.getElementById('searchName');
  var filter = document.getElementById('filterTurma');
  if (search) search.addEventListener('input', updateAlunosList);
  if (filter) filter.addEventListener('change', updateAlunosList);
  updateAlunosList();

  // faltas page
  updateFaltasList();
  mostrarHistorico('historicoList');
}

function updateAlunosList() {
  var search = document.getElementById('searchName');
  var filter = document.getElementById('filterTurma');
  var s = search ? search.value.trim().toLowerCase() : '';
  var t = filter ? filter.value : '';
  var list = carregarAlunos();
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (t && a.turma !== normalizarTurma(t)) continue;
    if (s && a.nome.toLowerCase().indexOf(s) === -1) continue;
    out.push(a);
  }
  mostrarAlunosNaTela('alunosList', out);
}

function updateFaltasList() {
  var cont = document.getElementById('faltasList');
  if (!cont) return;
  cont.innerHTML = '';
  var list = carregarAlunos();
  var lu = getLoggedUser();
  for (var i = 0; i < list.length; i++) {
    (function(a){
      var div = document.createElement('div');
      div.innerHTML = '<strong>' + a.nome + '</strong> <span class="muted">(' + a.turma + ')</span> - Faltas: ' + a.faltas;
      var input = document.createElement('input');
      input.type = 'number'; input.min = 1; input.value = 1; input.style.width = '80px';
      var btn = document.createElement('button');
      btn.textContent = 'Registrar falta';
      btn.style.marginLeft = '8px';
      btn.addEventListener('click', function(){
        var q = Number(input.value) || 1;
        // permissão: coord e prof podem registrar
        if (!lu) return alert('Faça login');
        if (lu.role !== 'coord' && lu.role !== 'prof') return alert('Sem permissão');
        var ok = registrarFalta(a.nome, q);
        if (ok) {
          updateFaltasList();
          mostrarHistorico('historicoList');
        }
      });
      div.appendChild(input);
      div.appendChild(btn);
      cont.appendChild(div);
    })(list[i]);
  }
}

// rodar init quando DOM pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPages);
} else { initPages(); }

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const btnMenu = document.querySelector('.btn-menu');
    const sidebarClose = document.querySelector('.sidebar-close');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
    }

    if (btnMenu) btnMenu.addEventListener('click', toggleSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', toggleSidebar);

    const turmasData = {
        "Redes 1": [
            { nome: "Ana Souza", faltas: 1 },
            { nome: "Bruno Alves", faltas: 0 },
            { nome: "Carlos Lima", faltas: 2 },
            { nome: "Daniela Rocha", faltas: 3 }
        ],
        "Des. Sistemas 1": [
            { nome: "Eduardo Santos", faltas: 1 },
            { nome: "Fernanda Castro", faltas: 0 },
            { nome: "Guilherme Pires", faltas: 2 },
            { nome: "Helena Silva", faltas: 1 }
        ],
        "Des. Sistemas 2": [
            { nome: "Igor Nunes", faltas: 3 },
            { nome: "Júlia Mendes", faltas: 1 },
            { nome: "Kaio Ramos", faltas: 2 },
            { nome: "Larissa Prado", faltas: 0 }
        ],
        "Des. Sistemas 3": [
            { nome: "Mateus Ferreira", faltas: 1 },
            { nome: "Natália Ribeiro", faltas: 2 },
            { nome: "Otávio Costa", faltas: 3 },
            { nome: "Patrícia Moura", faltas: 0 }
        ],
        "Multimídia 1": [
            { nome: "Rafaela Duarte", faltas: 1 },
            { nome: "Samuel Cardoso", faltas: 2 },
            { nome: "Tainá Barbosa", faltas: 0 },
            { nome: "Victor Rocha", faltas: 1 }
        ],
        "Multimídia 2": [
            { nome: "Wesley Moraes", faltas: 2 },
            { nome: "Yasmin Araújo", faltas: 1 },
            { nome: "Zeca Martins", faltas: 3 },
            { nome: "Ângela Farias", faltas: 0 }
        ],
        "Multimídia 3": [
            { nome: "Bianca Freitas", faltas: 1 },
            { nome: "Caio Teixeira", faltas: 2 },
            { nome: "Diego Braga", faltas: 0 },
            { nome: "Elisa Santana", faltas: 3 }
        ],
        "Contabilidade 1": [
            { nome: "Felipe Moreira", faltas: 2 },
            { nome: "Giovana Nogueira", faltas: 1 },
            { nome: "Henrique Lopes", faltas: 0 },
            { nome: "Isabela Dias", faltas: 3 }
        ],
        "Contabilidade 2": [
            { nome: "João Pedro", faltas: 1 },
            { nome: "Kelly Batista", faltas: 2 },
            { nome: "Lucas Cunha", faltas: 3 },
            { nome: "Marina Azevedo", faltas: 0 }
        ],
        "Contabilidade 3": [
            { nome: "Nicolas Gomes", faltas: 2 },
            { nome: "Olívia Moraes", faltas: 1 },
            { nome: "Pedro Henrique", faltas: 0 },
            { nome: "Quezia Lima", faltas: 3 }
        ]
    };

    const navLinks = document.querySelectorAll('.nav-link');
    const viewPanels = document.querySelectorAll('.view-panel');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const periodPanels = document.querySelectorAll('.period-panel');

    const turmaAlunosSelect = document.getElementById('turma-alunos');
    const turmaConfigSelect = document.getElementById('turma-config');
    const alunoConfigSelect = document.getElementById('aluno-config');
    const tabelaAlunosBody = document.querySelector('#tabela-alunos tbody');
    const novoAlunoInput = document.getElementById('novo-aluno');
    const btnAddAluno = document.getElementById('btn-add-aluno');
    const btnAddFalta = document.getElementById('btn-add-falta');
    const btnRemoveFalta = document.getElementById('btn-remove-falta');
    const faltasAtual = document.getElementById('faltas-atual');
    const filaMenos = document.getElementById('fila-menos');

    function preencherSelectsTurma() {
        const turmas = Object.keys(turmasData);
        turmas.forEach((turma) => {
            const optionAlunos = document.createElement('option');
            optionAlunos.value = turma;
            optionAlunos.textContent = turma;
            turmaAlunosSelect.appendChild(optionAlunos);

            const optionConfig = document.createElement('option');
            optionConfig.value = turma;
            optionConfig.textContent = turma;
            turmaConfigSelect.appendChild(optionConfig);
        });
    }

    function preencherSelectAlunos(turma) {
        alunoConfigSelect.innerHTML = '';
        (turmasData[turma] || []).forEach((aluno) => {
            const option = document.createElement('option');
            option.value = aluno.nome;
            option.textContent = aluno.nome;
            alunoConfigSelect.appendChild(option);
        });
        atualizarFaltasAtual();
    }

    function renderTabelaAlunos(turma) {
        tabelaAlunosBody.innerHTML = '';
        const alunos = turmasData[turma] || [];
        alunos.forEach((aluno, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td><span class="badge">${aluno.faltas}</span></td>
                <td><button class="btn-remove btn-inline" data-index="${index}">Remover</button></td>
            `;
            tabelaAlunosBody.appendChild(row);
        });
    }

    function calcularTotalFaltas(turma) {
        return (turmasData[turma] || []).reduce((total, aluno) => total + aluno.faltas, 0);
    }

    function renderFila() {
        const turmas = Object.keys(turmasData).map((turma) => ({
            turma,
            faltas: calcularTotalFaltas(turma)
        }));
        const menos = turmas.slice().sort((a, b) => a.faltas - b.faltas || a.turma.localeCompare(b.turma));

        filaMenos.innerHTML = '';

        menos.forEach((item) => {
            const row = document.createElement('li');
            row.innerHTML = `<span>${item.turma}</span><span class="badge">${item.faltas}</span>`;
            filaMenos.appendChild(row);
        });
    }

    function atualizarFaltasAtual() {
        const turma = turmaConfigSelect.value;
        const nomeAluno = alunoConfigSelect.value;
        const aluno = (turmasData[turma] || []).find((item) => item.nome === nomeAluno);
        if (!aluno) {
            faltasAtual.textContent = '';
            return;
        }
        faltasAtual.textContent = `Faltas atuais de ${aluno.nome}: ${aluno.faltas}`;
    }

    function sincronizarTurmaSelecionada(turma) {
        turmaAlunosSelect.value = turma;
        turmaConfigSelect.value = turma;
        preencherSelectAlunos(turma);
        renderTabelaAlunos(turma);
        renderFila();
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const view = link.dataset.view;
            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
            viewPanels.forEach((panel) => {
                panel.classList.toggle('active', panel.dataset.viewPanel === view);
            });
        });
    });

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const period = button.dataset.period;
            tabButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            periodPanels.forEach((panel) => {
                panel.classList.toggle('active', panel.dataset.periodPanel === period);
            });
        });
    });

    turmaAlunosSelect.addEventListener('change', () => {
        sincronizarTurmaSelecionada(turmaAlunosSelect.value);
    });

    turmaConfigSelect.addEventListener('change', () => {
        sincronizarTurmaSelecionada(turmaConfigSelect.value);
    });

    alunoConfigSelect.addEventListener('change', atualizarFaltasAtual);

    btnAddAluno.addEventListener('click', () => {
        const turma = turmaAlunosSelect.value;
        const nome = novoAlunoInput.value.trim();
        if (!nome) {
            return;
        }
        turmasData[turma].push({ nome, faltas: 0 });
        novoAlunoInput.value = '';
        preencherSelectAlunos(turma);
        renderTabelaAlunos(turma);
        renderFila();
    });

    tabelaAlunosBody.addEventListener('click', (event) => {
        if (!event.target.classList.contains('btn-inline')) {
            return;
        }
        const turma = turmaAlunosSelect.value;
        const index = Number(event.target.dataset.index);
        turmasData[turma].splice(index, 1);
        preencherSelectAlunos(turma);
        renderTabelaAlunos(turma);
        renderFila();
    });

    btnAddFalta.addEventListener('click', () => {
        const turma = turmaConfigSelect.value;
        const nomeAluno = alunoConfigSelect.value;
        const aluno = turmasData[turma].find((item) => item.nome === nomeAluno);
        if (!aluno) {
            return;
        }
        aluno.faltas += 1;
        atualizarFaltasAtual();
        renderTabelaAlunos(turma);
        renderFila();
    });

    btnRemoveFalta.addEventListener('click', () => {
        const turma = turmaConfigSelect.value;
        const nomeAluno = alunoConfigSelect.value;
        const aluno = turmasData[turma].find((item) => item.nome === nomeAluno);
        if (!aluno) {
            return;
        }
        aluno.faltas = Math.max(0, aluno.faltas - 1);
        atualizarFaltasAtual();
        renderTabelaAlunos(turma);
        renderFila();
    });

    preencherSelectsTurma();
    sincronizarTurmaSelecionada(Object.keys(turmasData)[0]);
});

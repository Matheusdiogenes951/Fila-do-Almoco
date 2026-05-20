document.addEventListener('DOMContentLoaded', () => {
    const SESSION_KEY = 'usuarioLogado';
    const isFileProtocol = window.location.protocol === 'file:';
    const navLinks = document.querySelectorAll('.nav-link');
    const viewPanels = document.querySelectorAll('.view-panel');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const periodPanels = document.querySelectorAll('.period-panel');
    const sidebar = document.querySelector('.sidebar');
    const btnMenu = document.querySelector('.btn-menu');
    const sidebarClose = document.querySelector('.sidebar-close');
    const userName = document.getElementById('user-name');
    const btnSair = document.getElementById('btn-sair');

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
    const relatorioTotais = document.getElementById('relatorio-totais');
    const relatorioMedias = document.getElementById('relatorio-medias');
    const relatorioRanking = document.getElementById('relatorio-ranking');
    const filaDestaqueNome = document.getElementById('fila-destaque-nome');
    const filaDestaqueFaltas = document.getElementById('fila-destaque-faltas');
    const filaTotal = document.getElementById('fila-total');
    const studentCount = document.getElementById('student-count');
    const emptyAlunos = document.getElementById('empty-alunos');
    const statusGeral = document.getElementById('status-geral');
    const statusGeralTexto = document.getElementById('status-geral-texto');
    const frequenciaMedia = document.getElementById('frequencia-media');
    const frequenciaBarra = document.getElementById('frequencia-barra');

    if (isFileProtocol) {
        Swal.fire({
            icon: 'warning',
            title: 'Servidor obrigatorio',
            text: 'Para carregar turmas, alunos e fila, rode "python3 api/index.py" e abra http://127.0.0.1:5000/.'
        });
        return;
    }

    const usuario = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    const state = {
        turmas: [],
        turmaSelecionada: null
    };

    function obterTurmaPorCodigo(codigo) {
        return state.turmas.find((turma) => turma.codigo === codigo) || null;
    }

    async function request(url, options = {}) {
        const resposta = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        const conteudo = await resposta.text();
        const dados = conteudo ? JSON.parse(conteudo) : {};

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Falha ao comunicar com a API.');
        }

        return dados;
    }

    async function carregarTurmas() {
        const dados = await request('/api/turmas');
        state.turmas = dados.turmas || [];
        if (!state.turmaSelecionada || !obterTurmaPorCodigo(state.turmaSelecionada)) {
            state.turmaSelecionada = state.turmas[0]?.codigo || null;
        }
    }

    function preencherSelectsTurma() {
        turmaAlunosSelect.innerHTML = '';
        turmaConfigSelect.innerHTML = '';

        state.turmas.forEach((turma) => {
            const optionAlunos = document.createElement('option');
            optionAlunos.value = turma.codigo;
            optionAlunos.textContent = turma.nome;
            turmaAlunosSelect.appendChild(optionAlunos);

            const optionConfig = document.createElement('option');
            optionConfig.value = turma.codigo;
            optionConfig.textContent = turma.nome;
            turmaConfigSelect.appendChild(optionConfig);
        });
    }

    function preencherSelectAlunos(codigoTurma) {
        const turma = obterTurmaPorCodigo(codigoTurma);
        alunoConfigSelect.innerHTML = '';

        if (!turma) {
            faltasAtual.textContent = '';
            return;
        }

        turma.alunos.forEach((aluno) => {
            const option = document.createElement('option');
            option.value = aluno.id;
            option.textContent = aluno.nome;
            alunoConfigSelect.appendChild(option);
        });

        atualizarFaltasAtual();
    }

    function renderTabelaAlunos(codigoTurma) {
        const turma = obterTurmaPorCodigo(codigoTurma);
        tabelaAlunosBody.innerHTML = '';

        if (!turma) {
            if (studentCount) {
                studentCount.textContent = '0 ALUNOS';
            }
            if (emptyAlunos) {
                emptyAlunos.classList.add('active');
            }
            return;
        }

        if (studentCount) {
            studentCount.textContent = `${turma.total_alunos} ALUNO${turma.total_alunos === 1 ? '' : 'S'}`;
        }

        if (emptyAlunos) {
            emptyAlunos.classList.toggle('active', turma.alunos.length === 0);
        }

        turma.alunos.forEach((aluno) => {
            const row = document.createElement('tr');
            const iniciais = aluno.nome
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((parte) => parte[0])
                .join('')
                .toUpperCase();

            row.innerHTML = `
                <td>
                    <span class="student-name">
                        <span class="avatar">${iniciais}</span>
                        <strong>${aluno.nome}</strong>
                    </span>
                </td>
                <td><span class="badge">${aluno.faltas}</span></td>
                <td><button class="btn-inline" data-id="${aluno.id}">Remover</button></td>
            `;
            tabelaAlunosBody.appendChild(row);
        });
    }

    function renderFila() {
        const fila = state.turmas
            .map((turma) => ({
                nome: turma.nome,
                total_faltas: turma.total_faltas
            }))
            .sort((a, b) => a.total_faltas - b.total_faltas || a.nome.localeCompare(b.nome));

        filaMenos.innerHTML = '';
        if (filaTotal) {
            filaTotal.textContent = `Exibindo ${fila.length} turma${fila.length === 1 ? '' : 's'}`;
        }

        if (fila[0]) {
            filaDestaqueNome.textContent = fila[0].nome;
            filaDestaqueFaltas.textContent = `${fila[0].total_faltas} falta${fila[0].total_faltas === 1 ? '' : 's'} registrada${fila[0].total_faltas === 1 ? '' : 's'}`;
        }

        fila.forEach((item, index) => {
            const row = document.createElement('li');
            row.innerHTML = `
                <span class="ranking-class">
                    <span class="ranking-position">${index + 1}º</span>
                    <span>
                        <span class="ranking-name">${item.nome}</span>
                        <span class="ranking-meta">Turma técnica</span>
                    </span>
                </span>
                <span class="badge">${item.total_faltas} falta${item.total_faltas === 1 ? '' : 's'}</span>
            `;
            filaMenos.appendChild(row);
        });
    }

    function renderRelatorios() {
        const turmasOrdenadas = [...state.turmas].sort((a, b) => a.nome.localeCompare(b.nome));
        relatorioTotais.innerHTML = '';
        relatorioMedias.innerHTML = '';
        relatorioRanking.innerHTML = '';

        const totalAlunos = state.turmas.reduce((total, turma) => total + turma.total_alunos, 0);
        const totalFaltas = state.turmas.reduce((total, turma) => total + turma.total_faltas, 0);
        const frequencia = totalAlunos ? Math.max(0, Math.round(((totalAlunos - totalFaltas) / totalAlunos) * 100)) : 100;

        if (statusGeral && statusGeralTexto) {
            statusGeral.textContent = totalFaltas === 0 ? 'Excelente' : totalFaltas <= 10 ? 'Atenção leve' : 'Revisar fila';
            statusGeralTexto.textContent = totalFaltas === 0
                ? 'Nenhuma falta acumulada detectada nas turmas monitoradas até o momento.'
                : `${totalFaltas} falta${totalFaltas === 1 ? '' : 's'} registrada${totalFaltas === 1 ? '' : 's'} nas turmas monitoradas.`;
        }

        if (frequenciaMedia && frequenciaBarra) {
            frequenciaMedia.textContent = `${frequencia}%`;
            frequenciaBarra.style.width = `${frequencia}%`;
        }

        turmasOrdenadas.forEach((turma) => {
            const totalCard = document.createElement('div');
            totalCard.className = 'turma-card';
            totalCard.innerHTML = `
                <div class="turma-card-icon"><span class="material-symbols-outlined">groups</span></div>
                <div>
                    <strong>${turma.nome}</strong>
                    <span>${turma.total_faltas} falta${turma.total_faltas === 1 ? '' : 's'} acumulada${turma.total_faltas === 1 ? '' : 's'}</span>
                </div>
            `;
            relatorioTotais.appendChild(totalCard);

            const media = turma.total_alunos ? (turma.total_faltas / turma.total_alunos).toFixed(2) : '0.00';
            const mediaCard = document.createElement('div');
            mediaCard.className = 'turma-card';
            mediaCard.innerHTML = `
                <div class="turma-card-icon"><span class="material-symbols-outlined">monitoring</span></div>
                <div>
                    <strong>${turma.nome}</strong>
                    <span>${media} faltas por aluno</span>
                </div>
            `;
            relatorioMedias.appendChild(mediaCard);
        });

        const ranking = state.turmas
            .flatMap((turma) => turma.alunos.map((aluno) => ({
                turma: turma.nome,
                nome: aluno.nome,
                faltas: aluno.faltas
            })))
            .sort((a, b) => b.faltas - a.faltas || a.nome.localeCompare(b.nome))
            .slice(0, 10);

        if (!ranking.length) {
            const card = document.createElement('div');
            card.className = 'turma-card';
            card.innerHTML = '<div class="turma-card-icon"><span class="material-symbols-outlined">group_off</span></div><div><strong>Sem dados</strong><span>Nenhum aluno cadastrado.</span></div>';
            relatorioRanking.appendChild(card);
            return;
        }

        ranking.forEach((item) => {
            const rankingCard = document.createElement('div');
            rankingCard.className = 'turma-card';
            rankingCard.innerHTML = `
                <div class="turma-card-icon"><span class="material-symbols-outlined">person</span></div>
                <div>
                    <strong>${item.nome}</strong>
                    <span>${item.turma} - ${item.faltas} falta${item.faltas === 1 ? '' : 's'}</span>
                </div>
            `;
            relatorioRanking.appendChild(rankingCard);
        });
    }

    function atualizarFaltasAtual() {
        const turma = obterTurmaPorCodigo(turmaConfigSelect.value);
        const alunoId = alunoConfigSelect.value;
        const aluno = turma?.alunos.find((item) => item.id === alunoId);

        if (!aluno) {
            faltasAtual.textContent = turma ? 'Selecione um aluno.' : '';
            return;
        }

        const situacao = aluno.faltas >= 3 ? 'Atenção na ordem da fila' : 'Regularizado';
        faltasAtual.innerHTML = `<strong>${aluno.faltas}</strong>${aluno.nome}<br>${situacao}`;
    }

    function sincronizarTurmaSelecionada(codigoTurma) {
        state.turmaSelecionada = codigoTurma;
        turmaAlunosSelect.value = codigoTurma;
        turmaConfigSelect.value = codigoTurma;
        preencherSelectAlunos(codigoTurma);
        renderTabelaAlunos(codigoTurma);
        renderFila();
        renderRelatorios();
    }

    function aplicarPermissoes() {
        userName.textContent = usuario.nome;

        if (usuario.perfil !== 'admin') {
            if (btnMenu) {
                btnMenu.style.display = 'none';
            }

            sidebar.classList.remove('active');

            navLinks.forEach((link) => {
                if (link.dataset.view !== 'home') {
                    link.style.display = 'none';
                }
            });
        }
    }

    function inicializarNavegacao() {
        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const view = link.dataset.view;

                navLinks.forEach((item) => {
                    item.classList.toggle('active', item.dataset.view === view);
                });

                viewPanels.forEach((panel) => {
                    panel.classList.toggle('active', panel.dataset.viewPanel === view);
                });

                sidebar.classList.remove('active');
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

        if (btnMenu) {
            btnMenu.addEventListener('click', () => sidebar.classList.toggle('active'));
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => sidebar.classList.remove('active'));
        }

        btnSair.addEventListener('click', () => {
            localStorage.removeItem(SESSION_KEY);
        });
    }

    async function adicionarAluno() {
        const codigoTurma = turmaAlunosSelect.value;
        const nome = novoAlunoInput.value.trim();
        if (!nome) {
            return;
        }

        await request(`/api/turmas/${codigoTurma}/alunos`, {
            method: 'POST',
            body: JSON.stringify({ nome })
        });

        novoAlunoInput.value = '';
        await carregarTurmas();
        sincronizarTurmaSelecionada(codigoTurma);
    }

    async function removerAluno(alunoId) {
        const codigoTurma = turmaAlunosSelect.value;
        await request(`/api/turmas/${codigoTurma}/alunos/${alunoId}`, {
            method: 'DELETE'
        });
        await carregarTurmas();
        sincronizarTurmaSelecionada(codigoTurma);
    }

    async function atualizarFalta(operacao) {
        const codigoTurma = turmaConfigSelect.value;
        const alunoId = alunoConfigSelect.value;
        if (!alunoId) {
            return;
        }

        await request(`/api/turmas/${codigoTurma}/alunos/${alunoId}/faltas`, {
            method: 'PATCH',
            body: JSON.stringify({ operacao })
        });

        await carregarTurmas();
        sincronizarTurmaSelecionada(codigoTurma);
    }

    function registrarEventos() {
        turmaAlunosSelect.addEventListener('change', () => {
            sincronizarTurmaSelecionada(turmaAlunosSelect.value);
        });

        turmaConfigSelect.addEventListener('change', () => {
            sincronizarTurmaSelecionada(turmaConfigSelect.value);
        });

        alunoConfigSelect.addEventListener('change', atualizarFaltasAtual);
        btnAddAluno.addEventListener('click', () => tratarAcao(adicionarAluno));
        btnAddFalta.addEventListener('click', () => tratarAcao(() => atualizarFalta('adicionar')));
        btnRemoveFalta.addEventListener('click', () => tratarAcao(() => atualizarFalta('remover')));

        tabelaAlunosBody.addEventListener('click', (event) => {
            if (!event.target.classList.contains('btn-inline')) {
                return;
            }

            tratarAcao(() => removerAluno(event.target.dataset.id));
        });
    }

    async function tratarAcao(acao) {
        try {
            await acao();
        } catch (erro) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: erro.message
            });
        }
    }

    async function init() {
        try {
            aplicarPermissoes();
            inicializarNavegacao();
            await carregarTurmas();
            preencherSelectsTurma();
            sincronizarTurmaSelecionada(state.turmaSelecionada);
            registrarEventos();
        } catch (erro) {
            Swal.fire({
                icon: 'error',
                title: 'Falha ao carregar o painel',
                text: erro.message
            });
        }
    }

    init();
});

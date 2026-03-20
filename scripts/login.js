document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const SESSION_KEY = 'usuarioLogado';
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        Swal.fire({
            icon: 'warning',
            title: 'Execute com o servidor',
            text: 'Abra o projeto por http://127.0.0.1:5000 rodando o arquivo index.py.'
        });
    }

    async function entrar() {
        const email = document.getElementById('iemail').value.trim();
        const senha = document.getElementById('isenha').value.trim();

        try {
            const resposta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || 'Nao foi possivel fazer login.');
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify(resultado.usuario));

            Swal.fire({
                title: `Bem-vindo, ${resultado.usuario.nome}!`,
                text: 'Login realizado com sucesso.',
                icon: 'success'
            }).then(() => {
                window.location.href = 'dashboard.html';
            });
        } catch (erro) {
            Swal.fire({
                icon: 'error',
                title: 'Falha no login',
                text: erro.message
            });
        }
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            entrar();
        });
    }
});

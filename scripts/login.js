// scripts/login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const SESSION_KEY = 'usuarioLogado';

    if (!form) {
        console.error('Formulário de login não encontrado!');
        return;
    }

    form.addEventListener('submit', async (event) => {
        // 🔥 IMPEDE O RECARREGAMENTO DA PÁGINA
        event.preventDefault();
        
        const email = document.getElementById('iemail').value.trim();
        const senha = document.getElementById('isenha').value.trim();

        // Validação básica
        if (!email || !senha) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vazios',
                text: 'Por favor, preencha email e senha.'
            });
            return;
        }

        try {
            // Mostra loading
            Swal.fire({
                title: 'Verificando...',
                text: 'Aguarde um momento',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const resposta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const textoResposta = await resposta.text();
            
            console.log('Status:', resposta.status);
            console.log('Resposta:', textoResposta);

            // Fecha o loading
            Swal.close();

            // Verifica se veio resposta vazia
            if (!textoResposta || textoResposta.trim() === '') {
                throw new Error('Servidor não retornou resposta. Verifique se o backend está rodando.');
            }

            // Tenta converter para JSON
            let resultado;
            try {
                resultado = JSON.parse(textoResposta);
            } catch (e) {
                console.error('Erro ao parsear JSON:', e);
                throw new Error(`Resposta inválida do servidor: ${textoResposta.substring(0, 100)}`);
            }

            // Verifica se houve erro na resposta
            if (!resposta.ok) {
                throw new Error(resultado.erro || 'Não foi possível fazer login.');
            }

            // Salva usuário no localStorage
            localStorage.setItem(SESSION_KEY, JSON.stringify(resultado.usuario));

            // Sucesso!
            await Swal.fire({
                title: `Bem-vindo, ${resultado.usuario.nome}!`,
                text: 'Login realizado com sucesso.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Redireciona para o dashboard
            window.location.href = '/dashboard';
            
        } catch (erro) {
            console.error('Erro completo:', erro);
            Swal.fire({
                icon: 'error',
                title: 'Falha no login',
                text: erro.message,
                footer: 'Use: adm@gmail.com / 12345'
            });
        }
    });
});
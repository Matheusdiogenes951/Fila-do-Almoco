document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    function entrar() {
        const iemail = document.getElementById('iemail').value;
        const isenha = document.getElementById('isenha').value;

        if (iemail === 'adm@gmail.com' && isenha === '12345') {
            localStorage.setItem('usuarioLogado', JSON.stringify({
                email: iemail,
                nome: 'Administrador',
                perfil: 'admin'
            }));
            Swal.fire({
                title: "Bem-vindo, ADM!",
                text: "Login realizado com sucesso!",
                icon: "success"

            }).then(() => {
                window.location.href = 'dashboard.html';
            });
        } else if (iemail === 'aluno@gmail.com' && isenha === '12345') {
            localStorage.setItem('usuarioLogado', JSON.stringify({
                email: iemail,
                nome: 'Aluno',
                perfil: 'aluno'
            }));
            Swal.fire({
                title: "Bem-vindo, Aluno!",
                text: "Acesso liberado para visualizar a fila do almoço.",
                icon: "success"
            }).then(() => {
                window.location.href = 'dashboard.html';
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email ou senha incorretos!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            entrar();
        });
    }
});




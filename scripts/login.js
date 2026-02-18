document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    function entrar() {
        const iemail = document.getElementById('iemail').value;
        const isenha = document.getElementById('isenha').value;

        if (iemail === 'adm@gmail.com' && isenha === '12345') {
            alert('Bem-vindo, Administrador!');
            location.href = 'dashboard.html';
        } else {
            alert('Email ou senha incorretos!');
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            entrar();
        });
    }
});

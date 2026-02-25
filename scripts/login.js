document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    function entrar() {
        const iemail = document.getElementById('iemail').value;
        const isenha = document.getElementById('isenha').value;

        if (iemail === 'adm@gmail.com' && isenha === '12345') {
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
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




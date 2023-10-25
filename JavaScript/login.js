document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    let token = localStorage.getItem('access_token');
    if (token!=null) {
        location.href="lotes.html"
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        let email = document.getElementById("usuario").value;
        let password = document.getElementById("password").value;

        let info = {
            "username": email,
            "password": password,
            "grant_type": "password",
            "client_id": 1,
            "client_secret": "x21mzlq0ijQMy6IewvJcp5X9pzxjo79rfrldaboD"
        }

        fetch("http://localhost:8000/oauth/token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(info).toString(),
        })
        .then((response) => {
            if (response.ok) {
                return response.json(); 
            } else {
                Swal.fire({
                    title: 'Credenciales inválidas',
                    text: 'Por favor, verifique su correo electrónico y contraseña.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        })
        .then((data) => {
            localStorage.setItem("access_token", data.access_token);
            location.href = "lotes.html";
        })
        .catch((error) => {
            console.error("Error de red: ", error);
        });
    }); 
});

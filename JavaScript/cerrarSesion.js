document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("access_token");
    if (token == null) {
        location.href = "index.html";
    } else {
        const headers = {
            "Authorization": "Bearer " + token
        };

        fetch("http://localhost:8000/api/validate", {
            method: "GET",
            headers: headers
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); 
                } 
            })
            .then((userData) => {
                if (userData.tipo != "chofer") {
                    localStorage.removeItem("access_token");
                    sessionStorage.removeItem("userData");
                    location.href = "index.html";
                } 
            })
            .catch((error) => {
                console.error("Error de red: ", error);
            });
    }

    const cerrarSesion = document.getElementById("logOut");

    cerrarSesion.addEventListener("click", () => {
        const headers = {
            "Authorization": "Bearer " + token 
        };

        fetch("http://localhost:8000/api/logout", {
            method: "GET",
            headers: headers
        })
            .then((response) => {
                if (response.ok) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("userData");
                    location.href = "index.html";
                } else {
                    console.error("Error en la solicitud de cierre de sesión.");
                }
            })
            .catch((error) => {
                console.error("Error de red: ", error);
            });
    });
});
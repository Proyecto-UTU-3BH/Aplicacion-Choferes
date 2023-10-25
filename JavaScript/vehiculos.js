function mostrarVehiculo(data) {
    
    const ul = document.getElementById("datos");

    let htmlToAppend = '';

    htmlToAppend = `
        <li><strong>Matrícula:</strong> ${data.matricula}</li> 
        <li><strong>Tipo:</strong> ${data.tipo}</li> 
        <li><strong>Capacidad:</strong> ${data.capacidad}</li> 
        `;


    ul.innerHTML = htmlToAppend;

}


document.addEventListener("DOMContentLoaded", function () {
    let idUsuario;
    const token = localStorage.getItem("access_token");
    const urlValidar = "http://localhost:8000/api/validate";
    const headers = {
        "Authorization": "Bearer " + token,
    };

    fetch(urlValidar, {
        method: "GET",
        headers: headers,
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error("Error en la solicitud");
        }
    })
    .then(data => {
        const userData = {
            primer_nombre: data.primer_nombre,
            primer_apellido: data.primer_apellido,
            segundo_apellido: data.segundo_apellido,
            usuario: data.usuario,
            idUsuario: data.id,
            tipo: data.tipo,
            calle: data.calle,
            ci: data.ci,
            numero_de_puerta: data.numero_de_puerta
        };

        sessionStorage.setItem("userData", JSON.stringify(userData));

        idUsuario = data.id;

        const urlVehiculo = "http://localhost:8001/api/manejar/"+idUsuario+"/vehiculo";
        return fetch(urlVehiculo, {
            method: "GET",
            headers: headers,
        });
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        } 
    })
    .then(data => {
        if (data.message === 'El usuario no tiene ningún vehículo asignado.') {
            Swal.fire({
                icon: 'info',
                title: 'No se le asignó ningún Vehículo',
                text: 'No tienes un vehículo asignado'
            });
        } else {
            mostrarVehiculo(data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
    
});
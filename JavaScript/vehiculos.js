function mostrarVehiculo(data) {
    
    const ul = document.getElementById("datos");

    const matricula = data.matricula.toUpperCase();

    const tipo = data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1);

    let htmlToAppend = '';

    htmlToAppend = `
        <li><strong>Matrícula:</strong> ${matricula}</li> 
        <li><strong>Tipo:</strong> ${tipo}</li> 
        <li><strong>Capacidad:</strong> ${data.capacidad}</li> 
        `;


    ul.innerHTML = htmlToAppend;

    mostrarBtnRedirigir(data.tipo);

}

function mostrarBtnRedirigir(tipoVehiculo) {

    const botonContainer = document.getElementById("boton-container");
            
        if (tipoVehiculo === 'reparto') {
            botonContainer.innerHTML = `
                <button onclick="window.location.href = '/Html/repartoProductos.html'">Ver Productos</button>
            `;
        } else if (tipoVehiculo === 'flete') {
            botonContainer.innerHTML = `
                <button onclick="window.location.href = '/Html/lotes.html'">Ver Lotes</button>
            `;
        }
}


document.addEventListener("DOMContentLoaded", function () {

    const loader = document.querySelector(".loader");
    const datosContainer = document.getElementById("datos");

    datosContainer.style.display = "none";
    loader.style.display = "block";

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
            numero_de_puerta: data.numero_de_puerta,
            telefono: data.telefono
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

        loader.style.display = "none";
        datosContainer.style.display = "block";

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
function mostrarLotes(data) {
    
    const tbody = document.getElementById("lotes");

    let htmlToAppend = '';

    data.forEach(lote => {
        htmlToAppend += `
            <tr>
                <td>${lote.IDLote}</td>
                <td>${lote.destino}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlToAppend;

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

        const urlLotes = "http://localhost:8001/api/usuarios/verLotes/"+idUsuario;
        return fetch(urlLotes, {
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
        if (data.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No hay lotes asignados',
                text: 'No tienes lotes asignados en este momento.'
            });
        } else {
            mostrarLotes(data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
    
});
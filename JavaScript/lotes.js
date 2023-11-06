function mostrarLotes(data) {
    
    const tbody = document.getElementById("lotes");

    let htmlToAppend = '';

    data.forEach(lote => {
        htmlToAppend += `
            <tr>
                <td>${lote.IDLote}</td>
                <td>${lote.destino}</td>
                <td>${lote.calle_almacen}</td>
                <td>${lote.numero_puerta_almacen}</td>
                <td>
                    <button class="ver-productos-btn" onclick="setCatID(${lote.IDLote})">Ver Productos</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlToAppend;

}

function setCatID(id) {
    sessionStorage.setItem("IDLote", id);
    location.href = "productosDeLote.html";
}


document.addEventListener("DOMContentLoaded", function () {

    const userData = JSON.parse(localStorage.getItem("userData"));
    let idUsuario = userData.idUsuario;

    const token = localStorage.getItem("access_token");
    const headers = {
        "Authorization": "Bearer " + token,
    };

    const urlLotes = "http://localhost:8001/api/usuarios/verLotes/" + idUsuario;

    fetch(urlLotes, {
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

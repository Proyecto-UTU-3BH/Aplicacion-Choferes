function mostrarPaquetes (data) {

    const tbody = document.getElementById("productos");

    let htmlToAppend = '';

    data.forEach(producto => {
        htmlToAppend += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.destino}</td>
                <td>${producto.estado}</td>
                <td>${producto.tipo}</td>
                <td>${producto.remitente}</td>
                <td>${producto.nombre_destinatario}</td>
                <td>${producto.calle}</td>
                <td>${producto.numero_puerta}</td>
                <td>${producto.forma_entrega}</td>
                <td>${producto.peso}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlToAppend;
}

document.addEventListener("DOMContentLoaded", function () {

    let idLote = sessionStorage.getItem('IDLote');
    document.getElementById('IDLote').innerHTML=idLote;
    const token = localStorage.getItem("access_token");
    const urlPaquetesLote = "http://localhost:8002/api/lotes/"+idLote+"/productos";
    const headers = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };

    fetch(urlPaquetesLote, {
        method: "GET",
        headers: headers,
      })
        .then(async (response) => {
          if (response.ok) {
            return response.json(); 
          } else {
            const errorMessage = await response.text();
            console.error("Error en la solicitud:", errorMessage);
            throw new Error("Error en la solicitud");
          }
        })
        .then((data) => {
          mostrarPaquetes(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
});

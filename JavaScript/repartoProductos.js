function mostrarPaquetes(data) {

  const tbody = document.getElementById("productos");

  let htmlToAppend = '';

  data.forEach(producto => {
    htmlToAppend += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.destino}</td>
                <td>${producto.calle}</td>
                <td>${producto.numero_puerta}</td>
                <td>${producto.remitente}</td>
                <td>${producto.nombre_destinatario}</td>
                <td>${producto.tipo}</td>
                <td>${producto.peso}</td>
                <td>${producto.forma_entrega}</td>
                <td>${producto.estado}</td>
            </tr>
        `;
  });

  tbody.innerHTML = htmlToAppend;
}

document.addEventListener("DOMContentLoaded", function () {

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  let idUsuario = userData.idUsuario;

  const token = localStorage.getItem("access_token");
  const urlRepartoPaquetes = "http://localhost:8001/api/usuarios/" + idUsuario + "/verProductos";
  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  };

  fetch(urlRepartoPaquetes, {
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
      if (data.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No hay productos para repartir',
          text: 'No se encontraron productos para repartir en esta fecha.',
        });
      } else {
        mostrarPaquetes(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
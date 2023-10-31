function mostrarPaquetes(data) {

  const tbody = document.getElementById("productos");

  let htmlToAppend = '';

  data.forEach(producto => {
    let estaEnDomicilio = producto.estado == "en domicilio";

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
                <td>
                  <input type="checkbox" class="marcarEntregado" value="${producto.id}" data-reparte-id="${producto.reparte.id}" ${estaEnDomicilio ? 'checked' : ''} />
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = htmlToAppend;

  preguntarConfirmacion();

}

function preguntarConfirmacion() {

  document.querySelectorAll(".marcarEntregado").forEach(function (casilla) {
    casilla.addEventListener("click", function () {
      let idProducto = this.value;
      let idReparte = this.dataset.reparteId;

      if (this.checked) {
        Swal.fire({
          title: "Confirmación de Paquete Entregado",
          text: "¿Este paquete ha sido entregado?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4CAF50",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, paquete en domicilio",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            marcarComoEntregado(idProducto,idReparte);
          } else {
            this.checked = false;
          }
        });
      }
    });
  });
}

function marcarComoEntregado(idProducto, idReparte) {
  const token = localStorage.getItem("access_token");
  const urlMarcarComoEntregado = "http://localhost:8001/api/productos/modificar/" + idProducto;

  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json",
  };

  fetch(urlMarcarComoEntregado, {
    method: "GET",
    headers: headers,
  })
    .then(async response => {
      if (response.ok) {
        modificarFechaRealizacion(idReparte);
      } else {
        const errorMessage = await response.text();
        console.error("Error en la solicitud:", errorMessage);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function modificarFechaRealizacion(idReparte) {
  const token = localStorage.getItem("access_token");
  const urlModificarFecha = `http://localhost:8001/api/reparte/${idReparte}`;
  const fechaRealizacion = obtenerFecha();

  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json",
  };

  fetch(urlModificarFecha, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ fechaRealizacion }),
  })
    .then(async response => {
      if (response.ok) {
        location.reload();
      } else {
        const errorMessage = await response.text();
        console.error("Error en la solicitud para modificar la fecha:", errorMessage);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function obtenerFecha() {
  const ahora = new Date();
  const year = ahora.getFullYear();
  const month = (ahora.getMonth() + 1).toString().padStart(2, '0'); 
  const day = ahora.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
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
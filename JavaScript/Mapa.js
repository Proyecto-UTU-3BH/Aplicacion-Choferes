var map;
var userLocation = null;

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    userLocation = e.latlng;
}

function onLocationError(e) {
    alert(e.message);
}

function calcularRuta(destinos) {
    if (destinos.length < 2) {
        return;
    }

    if (userLocation) {
        destinos.unshift(userLocation);
    }

    console.log(destinos);

    L.Routing.control({
      waypoints: destinos,
      routeWhileDragging: true
  }).addTo(map);
}

function formatearParadas(paradas) {

    const destinos = paradas.map(parada => ({
        lat: parseFloat(parada.latitud),
        lon: parseFloat(parada.longitud)
    }));

    console.log("Destinos Ruta: " + destinos)

    calcularRuta(destinos);
}


document.addEventListener("DOMContentLoaded", function () {

  const userData = JSON.parse(localStorage.getItem("userData"));
  let idUsuario = userData.idUsuario;

  const token = localStorage.getItem("access_token");
  const urlMostrarRuta = "http://localhost:8002/api/ruta/mostrarRuta/" + idUsuario;
  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  };

  fetch(urlMostrarRuta, {
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
     formatearParadas(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    
    map = L.map('map').setView([-33.431118, -56.013162], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', onLocationFound);
    
    map.on('locationerror', onLocationError);

});



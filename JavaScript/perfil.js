document.addEventListener("DOMContentLoaded", function () {
    
  let userData = JSON.parse(localStorage.getItem("userData"));
  
  document.getElementById("nombre").value = userData.primer_nombre;
  document.getElementById("apellido1").value = userData.primer_apellido;
  document.getElementById("apellido2").value = userData.segundo_apellido;
  document.getElementById("email").value = userData.usuario;
  document.getElementById("tel").value = userData.telefono;

  document.getElementById('imagen_perfil').addEventListener('change', function () {
   
      var profileImage = document.getElementById('profilePhoto');
      var inputImage = this;

      if (inputImage.files && inputImage.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              profileImage.src = e.target.result;
          };

          reader.readAsDataURL(inputImage.files[0]);
      }
  });
  document.getElementById("formularioModificacion").addEventListener("submit", function (event) {
      event.preventDefault(); 

      let usuario= document.getElementById("email").value;
      let primer_nombre= document.getElementById("nombre").value;
      let primer_apellido= document.getElementById("apellido1").value;
      let segundo_apellido= document.getElementById("apellido2").value;
      let password= document.getElementById("password").value;
      let telefono= document.getElementById("tel").value;
      
      let info= {
          "usuario": usuario,
          "password": password,
          "tipo": userData.tipo,
          "ci": userData.ci,
          "primer_nombre": primer_nombre,
          "primer_apellido": primer_apellido,
          "telefono": telefono,
          "segundo_apellido": segundo_apellido,
          "calle": userData.calle,
          "numero_de_puerta": userData.numero_de_puerta,
      };

      const token = localStorage.getItem("access_token");

      const urlModificar = "http://localhost:8001/api/usuarios/"+userData.idUsuario;
      fetch(urlModificar, {
          method: "POST",
          headers: {
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json",
          },
          body: JSON.stringify(info)
      })
      .then(async response => {
        if (response.ok) {
          console.log("Usuario modificado con éxito.");
          userData.telefono = telefono;
          localStorage.setItem("userData", JSON.stringify(userData));
          location.reload();
        } else {
          const errorMessage = await response.text(); 
          console.error("Error en la solicitud:", errorMessage);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
  

});
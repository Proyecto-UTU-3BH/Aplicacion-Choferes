document.addEventListener("DOMContentLoaded", function () {
    
    const token = localStorage.getItem("access_token");
  
    const urlValidar = "http://localhost:8000/api/validate";
  
    const headers = {
      "Authorization": "Bearer " + token,
    };

    let idUsuario;
    let tipo;
    let ci;
    let calle;
    let numero_de_puerta;
  
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
  
        document.getElementById("nombre").value = data.primer_nombre;
        document.getElementById("apellido1").value = data.primer_apellido;
        document.getElementById("apellido2").value = data.segundo_apellido;
        document.getElementById("email").value = data.usuario;
        idUsuario= data.id;
        tipo= data.tipo;
        calle= data.calle;
        ci= data.ci;
        numero_de_puerta= data.numero_de_puerta;
       // document.getElementById("tel").value = data.telefono;
  
        // Puedes cargar la imagen de perfil en el elemento "profilePhoto" si tienes la URL de la imagen en los datos devueltos
        // Ejemplo: document.getElementById("profilePhoto").src = data.imagenPerfilURL;
      })
      .catch(error => {
        console.error("Error:", error);
      });

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
        let imagen_perfil = document.getElementById("profilePhoto").src;
        
        let info= {
            "usuario": usuario,
            "password": password,
            "tipo": tipo,
            "ci": ci,
            "primer_nombre": primer_nombre,
            "primer_apellido": primer_apellido,
            "segundo_apellido": segundo_apellido,
            "calle": calle,
            "numero_de_puerta": numero_de_puerta,
        };

        console.log(JSON.stringify(info));

        const token = localStorage.getItem("access_token");

        const urlModificar = "http://localhost:8001/api/usuarios/"+idUsuario;
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
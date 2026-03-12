const btnCargar = document.getElementById("btnCargar");
const menu = document.getElementById("menu");
const datos = document.getElementById("datos");
const divPosts = document.getElementById("posts");

// Referencias al nuevo formulario en HTML
const seccionFormulario = document.getElementById("seccion-formulario");
const formComentario = document.getElementById("formulario-comentario");
const inputOcultoPostId = document.getElementById("form-postId");
const labelPostId = document.getElementById("label-postId");

// 1. Cargar Usuarios
btnCargar.addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(usuarios => {
        let opciones = `<option value="">-- Selecciona un usuario --</option>`;
        usuarios.forEach(usr => {
            opciones += `<option value="${usr.id}">${usr.name}</option>`;
        });
        menu.innerHTML = opciones;
        menu.disabled = false; 
        datos.innerHTML = "¡Usuarios cargados!";
    });
});

// 2. Cargar Posts
menu.addEventListener("change", () => {
    const userId = menu.value;
    cerrarFormulario(); // Si cambias de usuario, cerramos el form por si estaba abierto
    
    if(userId === "") {
        divPosts.innerHTML = "<p>Aquí aparecerán los posts...</p>";
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => response.json())
    .then(posts => {
        let htmlPosts = "";
        
        posts.forEach(post => {
            htmlPosts += `
                <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px;">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    
                    <button onclick="verComentarios(${post.id})">Ver Comentarios</button>
                    <button onclick="ocultarComentarios(${post.id})">Ocultar</button>
                    <button onclick="abrirFormulario(${post.id})">Agregar Comentario</button>
                    
                    <div id="comentarios-${post.id}" style="margin-top:10px;"></div>
                </div>
            `;
        });
        
        divPosts.innerHTML = htmlPosts;
    });
});

// 3. Ver comentarios
const verComentarios = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response => response.json())
    .then(comentarios => {
        let htmlComentarios = `<ul id="lista-comentarios-${postId}">`;
        
        comentarios.forEach(com => {
            htmlComentarios += `<li><strong>${com.email}:</strong> ${com.body}</li>`;
        });
        
        htmlComentarios += "</ul>";
        document.getElementById(`comentarios-${postId}`).innerHTML = htmlComentarios;
    });
};

// 4. Ocultar comentarios
const ocultarComentarios = (postId) => {
    document.getElementById(`comentarios-${postId}`).innerHTML = "";
};

// 5. Abrir el formulario y prepararlo
const abrirFormulario = (postId) => {
    // Le decimos al formulario para qué post es
    inputOcultoPostId.value = postId;
    labelPostId.innerText = postId; // Solo para que el usuario lo vea en el título
    
    // Mostramos la caja
    seccionFormulario.style.display = "block";
    
    // Hacemos que la pantalla se desplace hacia arriba donde está el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 6. Cerrar el formulario
const cerrarFormulario = () => {
    seccionFormulario.style.display = "none";
    formComentario.reset(); // Limpia todos los campos de texto
};

// 7. Evento para enviar el formulario
formComentario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Evita que la página se recargue al enviar el form

    // Obtenemos los valores de las cajas de HTML
    const postId = inputOcultoPostId.value;
    const nombre = document.getElementById("form-nombre").value;
    const email = document.getElementById("form-email").value;
    const texto = document.getElementById("form-texto").value;

    const nuevoComentario = {
        postId: postId,
        name: nombre,
        email: email,
        body: texto
    };

    // Petición POST
    fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify(nuevoComentario),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        const divComentarios = document.getElementById(`comentarios-${postId}`);
        const htmlNuevo = `<li><strong>${data.email}:</strong> ${data.body} <em style="color:green;">(Nuevo)</em></li>`;
        
        let ul = document.getElementById(`lista-comentarios-${postId}`);
        if (ul) {
            ul.innerHTML += htmlNuevo;
        } else {
            // Si no estaban abiertos los comentarios, los crea
            divComentarios.innerHTML = `<ul id="lista-comentarios-${postId}">${htmlNuevo}</ul>`;
        }

        alert("¡Comentario agregado con éxito!");
        cerrarFormulario(); // Escondemos el form de nuevo
    })
    .catch(error => console.error("Error:", error));
});

// 8. Exponer funciones al window
window.verComentarios = verComentarios;
window.ocultarComentarios = ocultarComentarios;
window.abrirFormulario = abrirFormulario;
window.cerrarFormulario = cerrarFormulario;
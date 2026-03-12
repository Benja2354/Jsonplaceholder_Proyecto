// Referencias al DOM
const btnCargar = document.getElementById("btnCargar");
const menu = document.getElementById("menu");
const datos = document.getElementById("datos");
const divPosts = document.getElementById("posts");

// 1. Cargar Usuarios en el <select>
btnCargar.addEventListener("click", () => {
    datos.innerHTML = "Cargando usuarios...";
    
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(usuarios => {
        // Limpiamos y preparamos el select
        let opciones = `<option value="">-- Selecciona un usuario --</option>`;
        
        usuarios.forEach(usr => {
            opciones += `<option value="${usr.id}">${usr.name}</option>`;
        });
        
        menu.innerHTML = opciones;
        menu.disabled = false; // Habilitamos el select
        datos.innerHTML = "Usuarios cargados correctamente.";
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => datos.innerHTML = "", 3000);
    })
    .catch(error => console.error("Error al cargar usuarios:", error));
});

// 2. Escuchar el cambio en el menú para cargar los posts
menu.addEventListener("change", () => {
    const userId = menu.value;
    
    // Si regresa a la opción por defecto, limpiamos los posts
    if(userId === "") {
        divPosts.innerHTML = `<p class="text-muted">Selecciona un usuario para ver sus publicaciones.</p>`;
        return;
    }

    divPosts.innerHTML = `<div class="spinner-border text-primary" role="status"></div>`;

    // Buscar posts del usuario especifico usando query parameters (?userId=)
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => response.json())
    .then(posts => {
        let htmlPosts = "";
        
        posts.forEach(post => {
            // Creamos una Card de Bootstrap por cada Post
            htmlPosts += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0 bg-light">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-capitalize text-primary">${post.title}</h5>
                            <p class="card-text flex-grow-1">${post.body}</p>
                            
                            <div class="d-flex gap-2 mt-3">
                                <button class="btn btn-sm btn-outline-success w-50" onclick="verComentarios(${post.id})">Ver Comentarios</button>
                                <button class="btn btn-sm btn-outline-danger w-50" onclick="ocultarComentarios(${post.id})">Ocultar</button>
                            </div>
                            
                            <div id="comentarios-${post.id}" class="mt-3"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        divPosts.innerHTML = htmlPosts;
    })
    .catch(error => console.error("Error al cargar posts:", error));
});

// 3. Función para buscar e inyectar comentarios
const verComentarios = (postId) => {
    const divComentarios = document.getElementById(`comentarios-${postId}`);
    divComentarios.innerHTML = `<span class="text-muted small">Cargando comentarios...</span>`;

    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response => response.json())
    .then(comentarios => {
        let htmlComentarios = `<ul class="list-group list-group-flush small border-top pt-2 mt-2">`;
        
        comentarios.forEach(com => {
            htmlComentarios += `
                <li class="list-group-item bg-transparent px-0 py-1">
                    <strong>${com.email}</strong>:<br> 
                    <span class="text-muted">${com.body}</span>
                </li>
            `;
        });
        
        htmlComentarios += `</ul>`;
        divComentarios.innerHTML = htmlComentarios;
    })
    .catch(error => console.error("Error al cargar comentarios:", error));
};

// 4. Función para vaciar (ocultar) el contenedor de comentarios
const ocultarComentarios = (postId) => {
    const divComentarios = document.getElementById(`comentarios-${postId}`);
    if(divComentarios) {
        divComentarios.innerHTML = "";
    }
};

// 5. Exponer funciones al entorno global (window)
// Al usar type="module", todo se vuelve de scope privado. 
// Esto permite que el atributo 'onclick' del HTML pueda encontrarlas.
window.verComentarios = verComentarios;
window.ocultarComentarios = ocultarComentarios;
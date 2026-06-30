// ==========================================================================
// 1. CONTROL DE ACCESO, CONTRASEÑA MAESTRA Y PERSISTENCIA (LocalStorage)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Definimos o recuperamos la contraseña del navegador
    if (!localStorage.getItem("password_maestra")) {
        localStorage.setItem("password_maestra", "ColegioSimonBolivar");
    }

    const formularioLogin = document.getElementById("formulario-login");
    const formularioCambiar = document.getElementById("formulario-cambiar-pass");
    
    const btnIrCambiar = document.getElementById("btn-ir-cambiar");
    const btnVolverLogin = document.getElementById("btn-volver-login");
    
    const pantallaRegistro = document.getElementById("pantalla-registro");
    const pantallaTablas = document.getElementById("pantalla-tablas");

    // Intercambios de formularios visuales
    if (btnIrCambiar) {
        btnIrCambiar.addEventListener("click", () => {
            formularioLogin.style.display = "none";
            formularioCambiar.style.display = "block";
        });
    }

    if (btnVolverLogin) {
        btnVolverLogin.addEventListener("click", () => {
            formularioCambiar.style.display = "none";
            formularioLogin.style.display = "block";
        });
    }

    // Lógica de Validación de Acceso
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const passwordIngresada = document.getElementById("password").value;
            const passwordCorrecta = localStorage.getItem("password_maestra");

            if (passwordIngresada === passwordCorrecta) {
                alert(`¡Bienvenido! Acceso concedido para: ${email}`);
                
                // Ocultamos la pantalla de login y mostramos las tablas
                pantallaRegistro.style.display = "none";
                pantallaTablas.style.display = "block";
                
                // Cambiamos el fondo
                document.body.style.backgroundImage = 'url("./Imagenes/logo del colegio Simon bolivar.jpg")';
                
                // Inicializamos las tablas
                inicializarSecciones();
                configurarBotonesAgregar();
            } else {
                alert("Contraseña incorrecta. Intente de nuevo.");
            }
        });
    }

    // Lógica para Cambiar la Contraseña en el Navegador
    if (formularioCambiar) {
        formularioCambiar.addEventListener("submit", (e) => {
            e.preventDefault();
            const passActual = document.getElementById("pass-actual").value;
            const passNueva = document.getElementById("pass-nueva").value;
            const passwordCorrecta = localStorage.getItem("password_maestra");

            if (passActual === passwordCorrecta) {
                if (passNueva.trim() === "") {
                    alert("La contraseña no puede estar vacía.");
                    return;
                }
                localStorage.setItem("password_maestra", passNueva);
                alert("¡Contraseña actualizada con éxito en este navegador!");
                formularioCambiar.reset();
                
                // Regresar al login automáticamente
                formularioCambiar.style.display = "none";
                formularioLogin.style.display = "block";
            } else {
                alert("La contraseña actual introducida es incorrecta.");
            }
        });
    }
});


// ==========================================================================
// 2. LÓGICA DE LAS TABLAS CON PERSISTENCIA Y MODIFICACIONES
// ==========================================================================

const secciones = [
    { selectorH1: ".encabezado-1", storageKey: "estudiantes_primero_a" },
    { selectorH1: ".encabezado-2", storageKey: "estudiantes_primero_b" },
    { selectorH1: ".encabezado-3", storageKey: "estudiantes_segundo_a" },
    { selectorH1: ".encabezado-4", storageKey: "estudiantes_segundo_b" }
];

function inicializarSecciones() {
    const contenedoresPadre = document.querySelectorAll(".contenedor-padre");

    secciones.forEach((seccion, index) => {
        const contenedor = contenedoresPadre[index];
        if (!contenedor) return;

        let estudiantes = JSON.parse(localStorage.getItem(seccion.storageKey)) || [];

        if (estudiantes.length === 0) {
            estudiantes = extraerEstudiantesDeHTML(contenedor);
            if (estudiantes.length > 0) {
                localStorage.setItem(seccion.storageKey, JSON.stringify(estudiantes));
            }
        }
        renderizarTablas(contenedor, estudiantes, seccion.storageKey);
    });
}

function extraerEstudiantesDeHTML(contenedor) {
    const lista = [];
    const filasCedula = contenedor.querySelectorAll(".columna-cedula tbody tr");
    const filasNombre = contenedor.querySelectorAll(".columna-izquierda tbody tr");
    const filasApellido = contenedor.querySelectorAll(".columna-centro tbody tr");
    const filasGenero = contenedor.querySelectorAll(".columna-derecha tbody tr");

    filasNombre.forEach((fila, i) => {
        const cedula = filasCedula[i] ? filasCedula[i].innerText.trim() : "V-00.000.000";
        const nombre = fila.innerText.trim();
        const apellido = filasApellido[i] ? filasApellido[i].innerText.trim() : "";
        const genero = filasGenero[i] ? filasGenero[i].innerText.trim() : "";
        
        if (nombre !== "") {
            lista.push({
                id: Date.now() + i,
                cedula: cedula,
                nombre: nombre,
                apellido: apellido,
                genero: genero
            });
        }
    });
    return lista;
}

function renderizarTablas(contenedor, listaEstudiantes, storageKey) {
    const tbodyCedula = contenedor.querySelector(".columna-cedula tbody");
    const tbodyNombre = contenedor.querySelector(".columna-izquierda tbody");
    const tbodyApellido = contenedor.querySelector(".columna-centro tbody");
    const tbodyGenero = contenedor.querySelector(".columna-derecha tbody");

    // Limpiar todos los cuerpos de tabla
    if (tbodyCedula) tbodyCedula.innerHTML = "";
    tbodyNombre.innerHTML = "";
    tbodyApellido.innerHTML = "";
    tbodyGenero.innerHTML = "";

    listaEstudiantes.forEach(estudiante => {
        const trC = document.createElement("tr");
        trC.innerHTML = `<td>${estudiante.cedula}</td>`;
        trC.style.cursor = "pointer";
        trC.title = "Doble clic para gestionar (Editar cédula / Eliminar)";

        const trN = document.createElement("tr");
        trN.innerHTML = `<td>${estudiante.nombre}</td>`;
        trN.style.cursor = "pointer";
        trN.title = "Doble clic para gestionar (Editar cédula / Eliminar)";

        const trA = document.createElement("tr");
        trA.innerHTML = `<td>${estudiante.apellido}</td>`;
        trA.style.cursor = "pointer";
        trA.title = "Doble clic para gestionar (Editar cédula / Eliminar)";

        const trG = document.createElement("tr");
        trG.innerHTML = `<td>${estudiante.genero}</td>`;
        trG.style.cursor = "pointer";
        trG.title = "Doble clic para gestionar (Editar cédula / Eliminar)";

        // Evento de doble clic compartido
        [trC, trN, trA, trG].forEach(tr => {
            tr.addEventListener("dblclick", () => {
                gestionarEstudiante(estudiante, storageKey, contenedor);
            });
        });

        if (tbodyCedula) tbodyCedula.appendChild(trC);
        tbodyNombre.appendChild(trN);
        tbodyApellido.appendChild(trA);
        tbodyGenero.appendChild(trG);
    });
}

function configurarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".btn-agregar-estudiante");

    botonesAgregar.forEach((boton, index) => {
        const clonBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(clonBoton, boton);
        
        clonBoton.addEventListener("click", () => {
            const seccion = secciones[index];
            const contenedoresPadre = document.querySelectorAll(".contenedor-padre");
            const contenedor = contenedoresPadre[index];

            if (!seccion || !contenedor) return;

            // 1. Pedir Cédula primero
            const cedula = prompt("Ingrese la Cédula del estudiante (Ejemplo: V-123.456.789):");
            if (!cedula || cedula.trim() === "") return;

            const nombre = prompt("Ingrese el Nombre del estudiante:");
            if (!nombre || nombre.trim() === "") return;

            const apellido = prompt("Ingrese el Apellido del estudiante:");
            if (!apellido || apellido.trim() === "") return;

            const genero = prompt("Ingrese el Género (Masculino / Femenino):");
            if (!genero || genero.trim() === "") return;

            let estudiantes = JSON.parse(localStorage.getItem(seccion.storageKey)) || [];
            
            const nuevoEstudiante = {
                id: Date.now(),
                cedula: cedula.trim(),
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                genero: genero.trim()
            };

            estudiantes.push(nuevoEstudiante);
            localStorage.setItem(seccion.storageKey, JSON.stringify(estudiantes));

            renderizarTablas(contenedor, estudiantes, seccion.storageKey);
        });
    });
}

// Nueva función interactiva para Editar o Eliminar
function gestionarEstudiante(estudiante, storageKey, contenedor) {
    const opcion = prompt(
        `Estudiante: ${estudiante.nombre} ${estudiante.apellido}\n` +
        `Cédula actual: ${estudiante.cedula}\n\n` +
        `Escriba "1" para EDITAR la cédula.\n` +
        `Escriba "2" para ELIMINAR al estudiante.\n` +
        `Deje vacío o cancele para salir.`
    );

    if (opcion === "1") {
        const nuevaCedula = prompt("Ingrese la nueva cédula (Ejemplo: V-123.456.789):", estudiante.cedula);
        if (nuevaCedula && nuevaCedula.trim() !== "") {
            let estudiantes = JSON.parse(localStorage.getItem(storageKey)) || [];
            estudiantes = estudiantes.map(est => {
                if (est.id === estudiante.id) {
                    est.cedula = nuevaCedula.trim();
                }
                return est;
            });
            localStorage.setItem(storageKey, JSON.stringify(estudiantes));
            renderizarTablas(contenedor, estudiantes, storageKey);
            alert("Cédula modificada con éxito.");
        }
    } else if (opcion === "2") {
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a "${estudiante.nombre} ${estudiante.apellido}" con Cédula ${estudiante.cedula}?`);
        if (confirmacion) {
            let estudiantes = JSON.parse(localStorage.getItem(storageKey)) || [];
            estudiantes = estudiantes.filter(est => est.id !== estudiante.id);
            localStorage.setItem(storageKey, JSON.stringify(estudiantes));
            renderizarTablas(contenedor, estudiantes, storageKey);
            alert("Estudiante eliminado con éxito.");
        }
    }
}
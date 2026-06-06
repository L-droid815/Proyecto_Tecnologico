// ==========================================================
// LÓGICA DE LAS TABLAS CON PERSISTENCIA (LocalStorage)
// ==========================================================

// Configuración de las secciones para mapear los títulos H1 con sus respectivos contenedores
const secciones = [
    { selectorH1: ".encabezado-1", storageKey: "estudiantes_primero_a" }, // Primero A
    { selectorH1: ".encabezado-2", storageKey: "estudiantes_primero_b" }, // Primero B
    { selectorH1: ".encabezado-3", storageKey: "estudiantes_segundo_a" }, // Segundo A
    { selectorH1: ".encabezado-2 ~ .encabezado-2", storageKey: "estudiantes_segundo_b" } // Segundo B (segundo h1 con esa clase)
];

// Función principal para inicializar todo el sistema al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    inicializarSecciones();
    configurarBotonesAgregar();
});

// 1. CARGAR Y RENDERIZAR LOS ESTUDIANTES GUARDADOS
function inicializarSecciones() {
    // Buscamos todos los contenedores de tablas en orden
    const contenedoresPadre = document.querySelectorAll(".contenedor-padre");

    secciones.forEach((seccion, index) => {
        const contenedor = contenedoresPadre[index];
        if (!contenedor) return;

        // Intentar obtener estudiantes desde LocalStorage
        let estudiantes = JSON.parse(localStorage.getItem(seccion.storageKey)) || [];

        // Si la sección está vacía en LocalStorage por primera vez, extraemos los que ya pusiste en el HTML base
        if (estudiantes.length === 0) {
            estudiantes = extraerEstudiantesDeHTML(contenedor);
            // Guardamos los predeterminados para que ya queden en el almacenamiento
            if (estudiantes.length > 0) {
                localStorage.setItem(seccion.storageKey, JSON.stringify(estudiantes));
            }
        }

        // Renderizar las tablas de esta sección con los datos actualizados
        renderizarTablas(contenedor, estudiantes, seccion.storageKey);
    });
}

// Función auxiliar para leer los datos que ya escribiste fijamente en el archivo .htm
function extraerEstudiantesDeHTML(contenedor) {
    const lista = [];
    const filasNombre = contenedor.querySelectorAll(".columna-izquierda tbody tr");
    const filasApellido = contenedor.querySelectorAll(".columna-centro tbody tr");
    const filasGenero = contenedor.querySelectorAll(".columna-derecha tbody tr");

    filasNombre.forEach((fila, i) => {
        const nombre = fila.innerText.trim();
        const apellido = filasApellido[i] ? filasApellido[i].innerText.trim() : "";
        const genero = filasGenero[i] ? filasGenero[i].innerText.trim() : "";
        
        if (nombre !== "") {
            lista.push({
                id: Date.now() + i, // Genera un ID único temporal
                nombre: nombre,
                apellido: apellido,
                genero: genero
            });
        }
    });
    return lista;
}

// 2. RENDERIZAR LAS TABLAS DINÁMICAMENTE
function renderizarTablas(contenedor, listaEstudiantes, storageKey) {
    const tbodyNombre = contenedor.querySelector(".columna-izquierda tbody");
    const tbodyApellido = contenedor.querySelector(".columna-centro tbody");
    const tbodyGenero = contenedor.querySelector(".columna-derecha tbody");

    // Limpiamos los contenidos anteriores para evitar duplicados
    tbodyNombre.innerHTML = "";
    tbodyApellido.innerHTML = "";
    tbodyGenero.innerHTML = "";

    // Insertamos fila por fila manteniendo la perfecta sincronía visual
    listaEstudiantes.forEach(estudiante => {
        const trN = document.createElement("tr");
        trN.innerHTML = `<td>${estudiante.nombre}</td>`;
        trN.style.cursor = "pointer";
        trN.title = "Haz doble clic para eliminar a este estudiante";

        const trA = document.createElement("tr");
        trA.innerHTML = `<td>${estudiante.apellido}</td>`;
        trA.style.cursor = "pointer";
        trA.title = "Haz doble clic para eliminar a este estudiante";

        const trG = document.createElement("tr");
        trG.innerHTML = `<td>${estudiante.genero}</td>`;
        trG.style.cursor = "pointer";
        trG.title = "Haz doble clic para eliminar a este estudiante";

        // Asignar el evento de eliminación por doble clic a las tres celdas por igual
        [trN, trA, trG].forEach(tr => {
            tr.addEventListener("dblclick", () => {
                eliminarEstudiante(estudiante.id, estudiante.nombre, estudiante.apellido, storageKey, contenedor);
            });
        });

        tbodyNombre.appendChild(trN);
        tbodyApellido.appendChild(trA);
        tbodyGenero.appendChild(trG);
    });
}

// 3. CONFIGURAR LOS BOTONES PARA AGREGAR ESTUDIANTES
function configurarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".btn-agregar-estudiante");

    botonesAgregar.forEach((boton, index) => {
        boton.addEventListener("click", () => {
            // Identificar qué sección estamos modificando según el orden del botón presionado
            const seccion = secciones[index];
            const contenedoresPadre = document.querySelectorAll(".contenedor-padre");
            const contenedor = contenedoresPadre[index];

            if (!seccion || !contenedor) return;

            // Solicitar datos al usuario
            const nombre = prompt("Ingrese el Nombre del estudiante:");
            if (!nombre || nombre.trim() === "") return;

            const apellido = prompt("Ingrese el Apellido del estudiante:");
            if (!apellido || apellido.trim() === "") return;

            const genero = prompt("Ingrese el Género (Masculino / Femenino):");
            if (!genero || genero.trim() === "") return;

            // Obtener lista actual, agregar el nuevo objeto y guardar
            let estudiantes = JSON.parse(localStorage.getItem(seccion.storageKey)) || [];
            
            const nuevoEstudiante = {
                id: Date.now(), // ID único basado en milisegundos
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                genero: genero.trim()
            };

            estudiantes.push(nuevoEstudiante);
            localStorage.setItem(seccion.storageKey, JSON.stringify(estudiantes));

            // Volver a renderizar la sección para reflejar los cambios de inmediato
            renderizarTablas(contenedor, estudiantes, seccion.storageKey);
        });
    });
}

// 4. SCRIPT/FUNCIÓN PARA ELIMINAR ESTUDIANTES
function eliminarEstudiante(id, nombre, apellido, storageKey, contenedor) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al estudiante "${nombre} ${apellido}"?`);
    
    if (confirmacion) {
        // Traer datos actuales
        let estudiantes = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // Filtrar la lista dejando fuera al estudiante que coincida con el ID seleccionado
        estudiantes = estudiantes.filter(estudiante => estudiante.id !== id);
        
        // Guardar la nueva lista en LocalStorage
        localStorage.setItem(storageKey, JSON.stringify(estudiantes));
        
        // Volver a dibujar las tablas de ese contenedor específico
        renderizarTablas(contenedor, estudiantes, storageKey);
    }
}
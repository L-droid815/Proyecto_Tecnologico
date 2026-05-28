// ==========================================
    // 2. LÓGICA DE LAS TABLAS (index2.htm)
    // ==========================================
    // Escuchar clics en los botones de "Agregar Estudiante"
    const botonesAgregar = document.querySelectorAll(".btn-agregar-estudiante");
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Buscamos el contenedor padre de la sección específica (Primero A o Segundo B)
            const contenedorPadre = e.target.closest("h1, div").nextElementSibling; 
            const filaTablas = contenedorPadre.querySelector(".fila-tablas");
            
            if (!filaTablas) return;

            // Pedir los datos al usuario
            const nombre = prompt("Ingrese el Nombre del estudiante:");
            if (!nombre || nombre.trim() === "") return;

            const apellido = prompt("Ingrese el Apellido del estudiante:");
            if (!apellido || apellido.trim() === "") return;

            const genero = prompt("Ingrese el Género (Masculino / Femenino):");
            if (!genero || genero.trim() === "") return;

            // Obtener los cuerpos (tbody) de las tres tablas correspondientes
            const tbodyNombre = filaTablas.querySelector(".columna-izquierda tbody");
            const tbodyApellido = filaTablas.querySelector(".columna-centro tbody");
            const tbodyGenero = filaTablas.querySelector(".columna-derecha tbody");

            // Crear las filas simultáneamente para mantener la sincronía
            const trNombre = document.createElement("tr");
            trNombre.innerHTML = `<td>${nombre}</td>`;

            const trApellido = document.createElement("tr");
            trApellido.innerHTML = `<td>${apellido}</td>`;

            const trGenero = document.createElement("tr");
            trGenero.innerHTML = `<td>${genero}</td>`;

            // Vincular de forma invisible las tres filas para eliminarlas juntas después
            trNombre.dataset.idCompuesto = trApellido.dataset.idCompuesto = trGenero.dataset.idCompuesto = Date.now();

            // Insertar los elementos a sus respectivas tablas
            tbodyNombre.appendChild(trNombre);
            tbodyApellido.appendChild(trApellido);
            tbodyGenero.appendChild(trGenero);
            
            // Volver a aplicar la lógica de eliminación para las nuevas celdas
            asignarEventosEliminar();
        });
    });

    // Función para eliminar filas de forma sincronizada
    function asignarEventosEliminar() {
        const todasLasFilas = document.querySelectorAll(".fila-tablas tbody tr");
        
        todasLasFilas.forEach(fila => {
            // Clonamos el nodo para evitar duplicar listeners viejos
            const filaNueva = fila.cloneNode(true);
            fila.parentNode.replaceChild(filaNueva, fila);

            // Añadir evento al pasar el cursor para avisar al usuario
            filaNueva.style.cursor = "pointer";
            filaNueva.title = "Haz doble clic para eliminar a este estudiante";

            // Evento: Al hacer doble clic se borra el registro completo en las 3 columnas
            filaNueva.addEventListener("dblclick", () => {
                const idUnico = filaNueva.dataset.idCompuesto;
                const confirmacion = confirm("¿Estás seguro de que deseas eliminar este estudiante?");
                
                if (confirmacion) {
                    if (idUnico) {
                        // Si es un alumno nuevo, borramos los tres campos que comparten id
                        const celdasRelacionadas = document.querySelectorAll(`[data-id-compuesto="${idUnico}"]`);
                        celdasRelacionadas.forEach(c => c.remove());
                    } else {
                        // Si es un alumno predeterminado por HTML, borramos el índice de la fila
                        const index = Array.from(filaNueva.parentNode.children).indexOf(filaNueva);
                        const contenedorFilaTablas = filaNueva.closest(".fila-tablas");
                        
                        const tbodyIzq = contenedorFilaTablas.querySelector(".columna-izquierda tbody");
                        const tbodyCen = contenedorFilaTablas.querySelector(".columna-centro tbody");
                        const tbodyDer = contenedorFilaTablas.querySelector(".columna-derecha tbody");

                        if(tbodyIzq.children[index]) tbodyIzq.children[index].remove();
                        if(tbodyCen.children[index]) tbodyCen.children[index].remove();
                        if(tbodyDer.children[index]) tbodyDer.children[index].remove();
                    }
                }
            });
        });
    }

    // Inicializar eventos de eliminación al cargar la página por primera vez
    asignarEventosEliminar();

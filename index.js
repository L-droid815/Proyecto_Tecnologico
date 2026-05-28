//Esta es la parte de las tablas de los estudiantes del simon Bolivar

// ==========================================
    // 1. LÓGICA DEL FORMULARIO DE REGISTRO / ACCESO
    // ==========================================
    const formularioRegistro = document.querySelector(".registro");
    
    if (formularioRegistro) {
        formularioRegistro.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            // Intentar obtener usuarios ya registrados en LocalStorage
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            
            // Verificar si el correo ya existe
            const usuarioExistente = usuarios.find(user => user.email === email);
            
            if (usuarioExistente) {
                // Si existe, validamos la contraseña (Simulación de Login)
                if (usuarioExistente.password === password) {
                    alert(`¡Bienvenido de nuevo! Acceso concedido para: ${email}`);
                    // Aquí puedes redireccionar a las tablas si lo deseas:
                    // window.location.href = "./index2.htm";
                } else {
                    alert("Contraseña incorrecta. Intente de nuevo.");
                }
            } else {
                // Si no existe, lo registramos (Simulación de Registro)
                usuarios.push({ email: email, password: password });
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                alert("¡Registro exitoso! Sus datos han sido guardados. Ya puede acceder.");
            }
            
            formularioRegistro.reset(); // Limpia los campos del formulario
        });
    }
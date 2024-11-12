document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    // Verificar si el usuario ya está registrado
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.some(user => user.correo === correo)) {
        document.getElementById('mensaje').textContent = 'El correo ya está registrado.';
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = { nombre, correo, contraseña };
    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    document.getElementById('mensaje').textContent = 'Registro exitoso. Redirigiendo...';
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

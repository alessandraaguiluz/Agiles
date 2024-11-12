document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si las credenciales son correctas
    const usuario = usuarios.find(user => user.correo === correo && user.contraseña === contraseña);

    if (usuario) {
        // Guardar token en localStorage
        localStorage.setItem('token', 'token_12345');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('mensaje').textContent = 'Credenciales incorrectas.';
    }
});

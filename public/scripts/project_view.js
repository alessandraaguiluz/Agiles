// Variables globales
let token;
let projectId;

document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
    }

    // Aquí ya no necesitamos el projectId para redirigir
    const addSprintBtn = document.getElementById('addSprintBtn');
    const sprintsBtn = document.getElementById('sprintsBtn');
    const reportsBtn = document.getElementById('reportsBtn');
    const kanbanBtn = document.getElementById('kanbanBtn');
    const miembrosBtn = document.getElementById('miembrosBtn');
    const plazBtn = document.getElementById('plazBtn');
    const backBtn = document.getElementById('backBtn');
    const projectTitle = document.getElementById('projectTitle');
    const projectDescription = document.getElementById('projectDescription');
    const projectMenu = document.getElementById('projectMenu');
    const miembrosSection = document.getElementById('miembrosSection');
    const miembrosList = document.getElementById('miembrosList');
    const emailInvitar = document.getElementById('emailInvitar');
    const invitarBtn = document.getElementById('invitarBtn');
    const volverMenuBtn = document.getElementById('volverMenuBtn');
    
    // Obtener detalles del proyecto
    async function loadProjectDetails() {
        const response = await fetch(`/api/projects/${projectId}`, {
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 403) {
            alert('No tienes acceso a este proyecto');
            window.location.href = '/dashboard';
            return;
        }

        const project = await response.json();

        projectTitle.textContent = project.nombre;
        projectDescription.textContent = project.descripcion;
    }

    loadProjectDetails();

    // Añadir evento al botón "Regresar"
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    // Redirigir a la página de añadir sprint
    addSprintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('PENDIENTE: añadir sprint no implementada todavía');
    });

    // Redirigir a la página de sprints
    sprintsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'H3_sprint_view.html';
    });

    // Redirigir a la página de reportes
    reportsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'H5_reporte.html';
    });

    // Redirigir a la página de Kanban
    kanbanBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'H4_kanban.html';
    });

    // Redirigir a la sección de miembros
    miembrosBtn.addEventListener('click', (e) => {
        e.preventDefault();
        projectMenu.style.display = 'none';
        miembrosSection.style.display = 'block';
        cargarMiembros();

        document.querySelectorAll('.project-menu ul li a').forEach(link => {
            link.classList.remove('active');
        });

        miembrosBtn.classList.add('active');
    });

    // Redirigir al menú de proyectos
    volverMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        miembrosSection.style.display = 'none';
        projectMenu.style.display = 'block';

        miembrosBtn.classList.remove('active');
    });

    // Función para cargar miembros del proyecto
    async function cargarMiembros() {
        const response = await fetch(`/api/projects/${projectId}`, {
            headers: {
                'Authorization': token
            }
        });

        if (!response.ok) {
            console.error('Error fetching project:', response.statusText);
            return;
        }

        const project = await response.json();

        miembrosList.innerHTML = '';
        for (const miembroId of project.miembros) {
            const miembroIdStr = miembroId.toString();

            const usuarioResponse = await fetch(`/api/users/${miembroIdStr}`, {
                headers: {
                    'Authorization': token
                }
            });

            if (!usuarioResponse.ok) {
                console.error(`Error fetching user ${miembroIdStr}:`, usuarioResponse.status, usuarioResponse.statusText);
                continue; // saltar al siguiente miembro
            }

            const usuario = await usuarioResponse.json();

            const li = document.createElement('li');
            li.innerHTML = `<span>${usuario.nombre} (${usuario.correo})</span>`;

            // Botón para eliminar miembro
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => eliminarMiembro(miembroIdStr));

            // Botón para asignar rol
            const esAdmin = project.admins && project.admins.includes(miembroIdStr);
            const rolBtn = document.createElement('button');
            rolBtn.textContent = esAdmin ? 'Quitar Admin' : 'Hacer Admin';
            rolBtn.addEventListener('click', () => asignarRol(miembroIdStr, esAdmin ? 'miembro' : 'admin'));

            li.appendChild(eliminarBtn);
            li.appendChild(rolBtn);
            miembrosList.appendChild(li);
        }
    }

    // Función para invitar miembro
    invitarBtn.addEventListener('click', async () => {
        const email = emailInvitar.value;
        if (!email) {
            alert('Por favor, ingresa un correo');
            return;
        }

        const response = await fetch(`/api/projects/${projectId}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ email })
        });

        const resultado = await response.json();
        if (response.ok) {
            alert('Invitación enviada');
            emailInvitar.value = '';
        } else {
            alert(resultado.mensaje || 'Error al invitar miembro');
        }
    });

    // Función para eliminar miembro
    async function eliminarMiembro(miembroId) {
        const confirmar = confirm('¿Estás seguro de eliminar este miembro?');
        if (!confirmar) return;

        const response = await fetch(`/api/projects/${projectId}/members/${miembroId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });

        const resultado = await response.json();
        if (response.ok) {
            alert('Miembro eliminado');
            cargarMiembros();
        } else {
            alert(resultado.mensaje || 'Error al eliminar miembro');
        }
    }

    // Función para asignar rol
    async function asignarRol(miembroId, rol) {
        const response = await fetch(`/api/projects/${projectId}/members/${miembroId}/role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ role: rol })
        });

        const resultado = await response.json();
        if (response.ok) {
            alert('Rol actualizado');
            cargarMiembros();
        } else {
            alert(resultado.mensaje || 'Error al actualizar rol');
        }
    }

    // Funcionalidad del modal
    const modal = document.getElementById('deadlineModal');
    const span = document.getElementsByClassName('close')[0];
    const saveDeadlineBtn = document.getElementById('saveDeadlineBtn');
    const deadlineInput = document.getElementById('deadline');

    plazBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    saveDeadlineBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const deadline = deadlineInput.value;
        if (!deadline) {
            alert('Por favor, selecciona una fecha.');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/deadline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ deadline })
            });

            if (!response.ok) {
                alert('Error al guardar la fecha límite');
                return;
            }

            alert('Fecha límite guardada con éxito');
            modal.style.display = 'none';
        } catch (error) {
            console.error('Error al guardar la fecha límite:', error);
            alert('Error al guardar la fecha límite');
        }
    });
});

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos simulados en memoria (reemplaza con una base de datos en producción)
let users = [
    { email: 'correo1@example.com', name: 'Usuario 1' },
    { email: 'correo2@example.com', name: 'Usuario 2' }
];
let projects = [];
let invitations = [];

// Ruta para crear un nuevo proyecto y asignar miembros
app.post('/api/projects', (req, res) => {
    const { nombre, descripcion, miembrosInvitados } = req.body;
    
    if (!nombre || !descripcion) {
        return res.status(400).json({ mensaje: 'Nombre y descripción son requeridos' });
    }

    const newProject = {
        id: Date.now().toString(), // Genera un ID único (en producción usa un ID generado por la base de datos)
        nombre,
        descripcion,
        members: []
    };

    // Invitar miembros al proyecto
    miembrosInvitados.forEach(email => {
        const user = users.find(u => u.email === email);
        if (user) {
            invitations.push({
                projectId: newProject.id,
                email,
                projectName: nombre
            });
        }
    });

    projects.push(newProject);
    res.status(201).json({ mensaje: 'Proyecto creado con éxito y miembros invitados' });
});

// Ruta para listar los proyectos
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

// Ruta para unirse a un proyecto mediante código de invitación
app.post('/api/projects/join', (req, res) => {
    const { projectCode } = req.body;
    const project = projects.find(p => p.id === projectCode);

    if (!project) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    // Agregar al usuario autenticado (simulado)
    const userEmail = req.headers['authorization']; // Suponiendo que el email está en el header de autorización

    if (!userEmail) {
        return res.status(401).json({ mensaje: 'Autorización requerida' });
    }

    if (!project.members.includes(userEmail)) {
        project.members.push(userEmail);
    }
    
    res.status(200).json({ mensaje: 'Unido al proyecto con éxito' });
});

// Ruta para obtener las invitaciones del usuario
app.get('/api/invites', (req, res) => {
    const userEmail = req.headers['authorization'];
    if (!userEmail) return res.status(401).json({ mensaje: 'Autorización requerida' });

    const userInvitations = invitations.filter(invite => invite.email === userEmail);
    res.json(userInvitations);
});

// Ruta para aceptar o rechazar una invitación
app.post('/api/invites/:projectId/:action', (req, res) => {
    const { projectId, action } = req.params;
    const userEmail = req.headers['authorization'];

    const inviteIndex = invitations.findIndex(invite => invite.projectId === projectId && invite.email === userEmail);
    if (inviteIndex === -1) return res.status(404).json({ mensaje: 'Invitación no encontrada' });

    // Si acepta la invitación, agrega al usuario al proyecto
    if (action === 'accept') {
        const project = projects.find(p => p.id === projectId);
        if (project && !project.members.includes(userEmail)) {
            project.members.push(userEmail);
        }
        invitations.splice(inviteIndex, 1); // Elimina la invitación
        return res.status(200).json({ mensaje: 'Has aceptado la invitación al proyecto' });
    } else if (action === 'decline') {
        invitations.splice(inviteIndex, 1); // Elimina la invitación
        return res.status(200).json({ mensaje: 'Has rechazado la invitación al proyecto' });
    } else {
        return res.status(400).json({ mensaje: 'Acción inválida' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

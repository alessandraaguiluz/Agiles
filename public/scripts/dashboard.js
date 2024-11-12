const addButton = document.querySelector('.add-btn');
const projectGrid = document.querySelector('.project-grid');
const modal = document.getElementById('projectModal');
const closeModal = modal.querySelector('.close');
const projectForm = document.getElementById('projectForm');
const projectNameInput = document.getElementById('projectName');
const projectDescriptionInput = document.getElementById('projectDescription');
const projectMembersInput = document.getElementById('projectMembers');
const projectStatusSelect = document.getElementById('projectStatus');

const joinProjectModal = document.getElementById('joinProjectModal');
const joinProjectForm = document.getElementById('joinProjectForm');
const joinModalClose = joinProjectModal.querySelector('.close');

let currentProjectId = null;

// abrir modal para crear proyecto
addButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    projectForm.reset();
    currentProjectId = null;
    document.getElementById('modal-title').textContent = 'Crear Proyecto';
});

// cerrar modales
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

joinModalClose.addEventListener('click', () => {
    joinProjectModal.style.display = 'none';
});

// Función para validar si una cadena es un correo electrónico válido
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

// Función para validar los correos ingresados
function validateEmails(emails) {
    const emailList = emails.split(',').map(email => email.trim());  // Limpiar espacios y separar por coma
    const invalidEmails = emailList.filter(email => !isValidEmail(email));  // Filtrar correos inválidos
    const duplicateEmails = emailList.filter((email, index, self) => self.indexOf(email) !== index); // Filtrar correos duplicados

    if (invalidEmails.length > 0) {
        return { valid: false, message: `Los siguientes correos son inválidos: ${invalidEmails.join(', ')}` };
    }
    if (duplicateEmails.length > 0) {
        return { valid: false, message: `Los siguientes correos están duplicados: ${duplicateEmails.join(', ')}` };
    }
    return { valid: true };
}

// cargar proyectos del usuario
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projectGrid.innerHTML = '';

    if (projects.length === 0) {
        const noProjectsMessage = document.createElement('div');
        noProjectsMessage.classList.add('no-projects-message');
        noProjectsMessage.innerHTML = `
            <p>No tienes proyectos actualmente.</p>
        `;
        projectGrid.appendChild(noProjectsMessage);

        document.getElementById('createProjectBtn').addEventListener('click', () => {
            modal.style.display = 'flex';
            projectForm.reset();
            currentProjectId = null;
            document.getElementById('modal-title').textContent = 'Crear Proyecto';
        });

        document.getElementById('joinProjectBtn').addEventListener('click', () => {
            joinProjectModal.style.display = 'flex';
        });
    } else {
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <div class="project-icon"></div>
                <h2>${project.name}</h2>
                <p>${project.description}</p>
                <p><strong>Estado:</strong> ${project.status}</p>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;
            projectCard.querySelector('.delete-btn').addEventListener('click', (event) => {
                deleteProject(event.target.dataset.index);
            });
            projectCard.addEventListener('click', () => {
                currentProjectId = index;
                projectNameInput.value = project.name;
                projectDescriptionInput.value = project.description;
                projectMembersInput.value = project.members.join(', ');
                projectStatusSelect.value = project.status;
                modal.style.display = 'flex';
                document.getElementById('modal-title').textContent = 'Editar Proyecto';
            });
            projectGrid.appendChild(projectCard);
        });
    }
}

// Función para eliminar un proyecto
function deleteProject(index) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.splice(index, 1); // Eliminar el proyecto
    localStorage.setItem('projects', JSON.stringify(projects)); // Guardar en localStorage
    loadProjects(); // Recargar proyectos
}

// manejar envío del formulario de crear o editar proyecto
projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const projectName = projectNameInput.value;
    const projectDescription = projectDescriptionInput.value;
    const projectMembers = projectMembersInput.value;
    const projectStatus = projectStatusSelect.value;

    // Validar los correos
    const emailValidation = validateEmails(projectMembers);
    if (!emailValidation.valid) {
        alert(emailValidation.message);  // Mostrar el mensaje de error
        return;  // Detener el proceso si los correos no son válidos
    }

    const newProject = {
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        members: projectMembers.split(',').map(email => email.trim())
    };

    const projects = JSON.parse(localStorage.getItem('projects')) || [];

    if (currentProjectId === null) {
        // Crear nuevo proyecto
        projects.push(newProject);
    } else {
        // Editar proyecto existente
        projects[currentProjectId] = newProject;
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    modal.style.display = 'none';
    loadProjects(); // Recargar proyectos
});

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar una invitación por correo
function enviarInvitacionCorreo(email, projectName, projectDescription) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Invitación al proyecto: ${projectName}`,
        text: `Has sido invitado al proyecto "${projectName}".\n\nDescripción: ${projectDescription}\n\nPor favor, accede a tu cuenta para aceptar o rechazar la invitación.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error al enviar correo a ${email}:`, error);
        } else {
            console.log(`Invitación enviada a ${email}:`, info.response);
        }
    });
}

// Ruta para crear un nuevo proyecto
app.post('/api/projects', (req, res) => {
    const { name, description, members } = req.body;
    
    // Guardar el proyecto en la base de datos (este paso se omite por simplicidad)
    
    // Enviar correos de invitación
    members.forEach(email => {
        enviarInvitacionCorreo(email, name, description);
    });
    
    res.status(201).json({ message: 'Proyecto creado y correos enviados a los miembros.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

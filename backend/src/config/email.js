const nodemailer = require('nodemailer');

// Configurar transporter de Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu email de Gmail
    pass: process.env.EMAIL_PASSWORD // App Password de Gmail
  }
});

/**
 * Enviar email de invitación
 */
const enviarInvitacion = async (email, token, nombreLocal, nombreContacto) => {
  const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register/${token}`;
  
  const mailOptions = {
    from: `"Menú Digital" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Invitación a ${nombreLocal} - Menú Digital`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Menú Digital!</h1>
          </div>
          <div class="content">
            <h2>Hola${nombreContacto ? ` ${nombreContacto}` : ''},</h2>
            <p>Has sido invitado a formar parte del equipo de <strong>${nombreLocal}</strong>.</p>
            <p>Para completar tu registro y comenzar a gestionar tu local, haz click en el siguiente enlace:</p>
            <center>
              <a href="${inviteUrl}" class="button">Completar Registro</a>
            </center>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="background: white; padding: 15px; border-radius: 5px; word-break: break-all;">
              ${inviteUrl}
            </p>
            <p><strong>Nota:</strong> Este enlace expirará en 7 días.</p>
          </div>
          <div class="footer">
            <p>© 2024 Menú Digital - Sistema de gestión para restaurantes</p>
            <p>Si no solicitaste esta invitación, puedes ignorar este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

/**
 * Enviar notificación al superadmin sobre nueva solicitud
 */
const notificarNuevaSolicitud = async (emailSuperadmin, solicitud) => {
  const mailOptions = {
    from: `"Menú Digital" <${process.env.EMAIL_USER}>`,
    to: emailSuperadmin,
    subject: `Nueva Solicitud: ${solicitud.nombreNegocio}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nueva Solicitud Recibida</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <p><span class="label">Negocio:</span> ${solicitud.nombreNegocio}</p>
              <p><span class="label">Contacto:</span> ${solicitud.nombreContacto}</p>
              <p><span class="label">Email:</span> ${solicitud.email}</p>
              <p><span class="label">Teléfono:</span> ${solicitud.telefono || 'No proporcionado'}</p>
              <p><span class="label">Tipo:</span> ${solicitud.tipoNegocio || 'No especificado'}</p>
              ${solicitud.mensaje ? `<p><span class="label">Mensaje:</span><br>${solicitud.mensaje}</p>` : ''}
            </div>
            <p>Revisa y aprueba esta solicitud desde tu dashboard de administración.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notificación enviada al superadmin');
  } catch (error) {
    console.error('❌ Error al notificar superadmin:', error);
    // No lanzar error para no bloquear la solicitud
  }
};

module.exports = {
  transporter,
  enviarInvitacion,
  notificarNuevaSolicitud
};

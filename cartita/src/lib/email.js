import nodemailer from 'nodemailer';

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verificar configuración (sin bloquear)
transporter.verify(function (error, success) {
  if (error) {
    console.warn('Advertencia: Configuración de email no disponible:', error.message);
    console.warn('Los emails no se enviarán, pero la app funcionará normalmente');
  } else {
    console.log('Servidor de email listo');
  }
});

/**
 * Enviar email de invitación para completar registro
 */
/**
 * Enviar email de recuperación de contraseña
 */
export async function enviarEmailRecuperacion(destinatario, resetUrl, nombreUsuario) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperar Contraseña</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 60px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
              
              <tr>
                <td style="padding: 48px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                    Cartita
                  </h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="margin: 0 0 24px 0; color: #000000; font-size: 20px; font-weight: 500;">
                    Recuperar contraseña
                  </h2>
                  
                  <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                    Hola${nombreUsuario ? ' ' + nombreUsuario : ''}, recibimos una solicitud para restablecer tu contraseña.
                  </p>
                  
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 15px; font-weight: 500;">
                      Restablecer contraseña
                    </a>
                  </div>
                  
                  <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #f0f0f0; color: #999999; font-size: 13px; line-height: 1.5;">
                    Este enlace expira en 1 hora. Si no solicitaste esto, ignora este email.
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cartita
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Cartita" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Recuperar Contraseña - Cartita',
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

export async function enviarEmailInvitacion(destinatario, token, nombreNegocio) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const enlaceRegistro = `${baseUrl}/registro/${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Cartita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 60px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
              
              <tr>
                <td style="padding: 48px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                    Cartita
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 20px; font-weight: 500;">
                    Bienvenido a Cartita
                  </h2>
                  
                  <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                    Tu solicitud para <strong>${nombreNegocio}</strong> ha sido aceptada. Completa tu registro para comenzar.
                  </p>

                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${enlaceRegistro}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 15px; font-weight: 500;">
                      Completar registro
                    </a>
                  </div>

                  <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #f0f0f0; color: #999999; font-size: 13px; line-height: 1.5;">
                    Este enlace es válido por 7 días.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cartita
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Cartita" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `Bienvenido a Cartita - ${nombreNegocio}`,
    html: htmlContent,
    text: `Bienvenido a Cartita\n\nTu solicitud para ${nombreNegocio} ha sido aceptada.\n\nCompleta tu registro: ${enlaceRegistro}\n\nEste enlace es válido por 7 días.\n\n© ${new Date().getFullYear()} Cartita`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de invitación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}

/**
 * Enviar email de confirmación de solicitud
 */
export async function enviarEmailConfirmacionSolicitud(destinatario, nombreNegocio) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud Recibida</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 60px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
              
              <tr>
                <td style="padding: 48px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                    Cartita
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 20px; font-weight: 500;">
                    Solicitud recibida
                  </h2>
                  
                  <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                    Hemos recibido tu solicitud para <strong>${nombreNegocio}</strong>. Te contactaremos pronto.
                  </p>

                  <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #f0f0f0; color: #999999; font-size: 13px; line-height: 1.5;">
                    Tiempo estimado de respuesta: 24-48 horas
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cartita
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Cartita" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `Solicitud recibida - ${nombreNegocio}`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}

export default transporter;

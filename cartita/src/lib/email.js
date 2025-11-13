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
      <title>Recuperar Contraseña - Cartita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    Recuperar Contraseña
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                    Cartita - Menú Digital
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                    Hola ${nombreUsuario || 'Usuario'},
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en Cartita.
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Haz clic en el botón de abajo para crear una nueva contraseña:
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(255, 107, 53, 0.3);">
                      Restablecer Contraseña
                    </a>
                  </div>
                  
                  <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                    O copia y pega este enlace en tu navegador:
                  </p>
                  <p style="margin: 10px 0 0 0; color: #FF6B35; font-size: 14px; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  
                  <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                      <strong>Este enlace expira en 1 hora</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 14px;">
                      Si no solicitaste restablecer tu contraseña, ignora este email.
                    </p>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                    © ${new Date().getFullYear()} Cartita - Menú Digital para Restaurantes
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Este es un email automático, por favor no respondas.
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
      <title>Invitación a Cartita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <!-- Container principal -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header con gradiente -->
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    Cartita
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                    Tu menú digital está listo
                  </p>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                    ¡Bienvenido a Cartita!
                  </h2>
                  
                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Hola,
                  </p>
                  
                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    ¡Excelentes noticias! Tu solicitud para <strong>${nombreNegocio}</strong> ha sido aceptada.
                  </p>
                  
                  <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Ahora puedes completar tu registro y comenzar a configurar tu menú digital. Haz clic en el botón de abajo para continuar:
                  </p>

                  <!-- Botón CTA -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${enlaceRegistro}" style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">
                          Completar Registro
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Info adicional -->
                  <div style="background-color: #FFF5F0; border-left: 4px solid #FF6B35; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px; font-weight: bold;">
                      Importante:
                    </p>
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                      Este enlace es válido por <strong>7 días</strong>. Si necesitas un nuevo enlace, contacta con nuestro equipo.
                    </p>
                  </div>

                  <!-- Características -->
                  <div style="margin: 30px 0;">
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                      ¿Qué puedes hacer con Cartita?
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #FF6B35; font-size: 20px; margin-right: 10px;">•</span>
                          <span style="color: #666666; font-size: 14px;">Menú digital con código QR</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #FF6B35; font-size: 20px; margin-right: 10px;">•</span>
                          <span style="color: #666666; font-size: 14px;">Recibe pedidos en tiempo real</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #FF6B35; font-size: 20px; margin-right: 10px;">•</span>
                          <span style="color: #666666; font-size: 14px;">Estadísticas de ventas</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #FF6B35; font-size: 20px; margin-right: 10px;">•</span>
                          <span style="color: #666666; font-size: 14px;">Actualiza tu menú al instante</span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Enlace alternativo -->
                  <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">
                      Si el botón no funciona, copia y pega este enlace en tu navegador:
                    </p>
                    <p style="margin: 0; color: #FF6B35; font-size: 12px; word-break: break-all;">
                      ${enlaceRegistro}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                    ¿Necesitas ayuda? Contáctanos en
                  </p>
                  <p style="margin: 0 0 20px 0;">
                    <a href="mailto:${process.env.EMAIL_USER}" style="color: #FF6B35; text-decoration: none; font-weight: bold;">
                      ${process.env.EMAIL_USER}
                    </a>
                  </p>
                  
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cartita. Todos los derechos reservados.
                  </p>
                  
                  <p style="margin: 10px 0 0 0; color: #cccccc; font-size: 11px;">
                    Armado con ♥ por el equipo de Ingeniería 2
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
    from: `"Cartita - Menú Digital" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `🎉 ¡Bienvenido a Cartita! - Completa tu registro`,
    html: htmlContent,
    text: `
¡Bienvenido a Cartita!

Tu solicitud para ${nombreNegocio} ha sido aceptada.

Completa tu registro en el siguiente enlace:
${enlaceRegistro}

Este enlace es válido por 7 días.

¿Necesitas ayuda? Contáctanos en ${process.env.EMAIL_USER}

© ${new Date().getFullYear()} Cartita. Todos los derechos reservados.
    `.trim()
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
      <title>Solicitud Recibida - Cartita</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    🍽️ Cartita
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                    ¡Solicitud Recibida! ✅
                  </h2>
                  
                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Hola,
                  </p>
                  
                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Hemos recibido tu solicitud para <strong>${nombreNegocio}</strong>.
                  </p>
                  
                  <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Nuestro equipo la revisará en breve y te contactaremos pronto con los siguientes pasos.
                  </p>

                  <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #2E7D32; font-size: 14px; line-height: 1.5;">
                      <strong>⏱️ Tiempo estimado de respuesta:</strong> 24-48 horas
                    </p>
                  </div>

                  <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px;">
                    Gracias por confiar en Cartita.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                    ¿Tienes preguntas? Contáctanos en
                  </p>
                  <p style="margin: 0 0 20px 0;">
                    <a href="mailto:${process.env.EMAIL_USER}" style="color: #FF6B35; text-decoration: none; font-weight: bold;">
                      ${process.env.EMAIL_USER}
                    </a>
                  </p>
                  
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cartita. Todos los derechos reservados.
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
    from: `"Cartita - Menú Digital" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `✅ Solicitud recibida - ${nombreNegocio}`,
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

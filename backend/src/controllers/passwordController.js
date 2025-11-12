const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');

// Configurar transporter de email
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // usar SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('✅ Transporter de email configurado en passwordController (puerto 465/SSL con timeouts)');
  } catch (error) {
    console.error('❌ Error al configurar email en passwordController:', error);
  }
} else {
  console.log('⚠️ EMAIL_USER o EMAIL_PASSWORD no están configurados');
}

// Solicitar recuperación de contraseña
exports.solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({ 
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' 
      });
    }

    console.log('👤 Usuario encontrado:', usuario.email);

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar token y expiración (1 hora)
    usuario.resetPasswordToken = resetTokenHash;
    usuario.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await usuario.save();

    console.log('🔑 Token generado y guardado');

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('🔗 URL de recuperación:', resetUrl);

    // Responder inmediatamente al cliente
    res.json({ 
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
      // Solo para desarrollo
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

    // Enviar email de forma asíncrona (sin bloquear la respuesta)
    console.log('📧 Intentando enviar email... Transporter:', transporter ? 'configurado' : 'NO configurado');
    if (transporter) {
      // Crear timeout para el envío de email
      const emailTimeout = setTimeout(() => {
        console.log('⏱️ Timeout de email alcanzado (15 segundos)');
      }, 15000);

      // Enviar email sin await para no bloquear
      transporter.sendMail({
        from: `"Cartita" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Cartita',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña - Cartita</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
                padding: 20px;
              }
              .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header p {
                margin-top: 10px;
                font-size: 16px;
                opacity: 0.95;
              }
              .content {
                padding: 40px 30px;
                background: white;
              }
              .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
              }
              .message {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 15px;
                line-height: 1.8;
              }
              .button-container {
                text-align: center;
                margin: 35px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white !important;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
                transition: transform 0.2s;
              }
              .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
              }
              .link-box {
                background: #f9fafb;
                border: 2px dashed #e5e7eb;
                padding: 20px;
                border-radius: 12px;
                margin: 25px 0;
                text-align: center;
              }
              .link-box p {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 10px;
                font-weight: 600;
              }
              .link-text {
                font-size: 12px;
                color: #ef4444;
                word-break: break-all;
                font-family: 'Courier New', monospace;
              }
              .warning-box {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 25px 0;
              }
              .warning-box p {
                font-size: 14px;
                color: #92400e;
                margin: 0;
              }
              .warning-box strong {
                color: #78350f;
              }
              .info-box {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 25px 0;
              }
              .info-box p {
                font-size: 14px;
                color: #1e40af;
                margin: 0;
              }
              .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
                margin: 30px 0;
              }
              .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              .footer-text {
                font-size: 13px;
                color: #6b7280;
                margin-bottom: 10px;
              }
              .footer-brand {
                font-size: 14px;
                color: #ef4444;
                font-weight: 700;
                margin-bottom: 5px;
              }
              .social-links {
                margin-top: 15px;
              }
              .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #9ca3af;
                text-decoration: none;
                font-size: 12px;
              }
              @media only screen and (max-width: 600px) {
                .email-wrapper { border-radius: 0; }
                .header { padding: 30px 20px; }
                .header h1 { font-size: 24px; }
                .content { padding: 30px 20px; }
                .greeting { font-size: 20px; }
                .button { padding: 14px 30px; font-size: 15px; }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <!-- Header -->
              <div class="header">
                <h1>🔐 Recuperación de Contraseña</h1>
                <p>Cartita - Tu menú digital</p>
              </div>

              <!-- Content -->
              <div class="content">
                <div class="greeting">¡Hola ${usuario.nombre}! 👋</div>
                
                <p class="message">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Cartita</strong>.
                </p>
                
                <p class="message">
                  Para crear una nueva contraseña, haz clic en el botón de abajo:
                </p>

                <!-- Button -->
                <div class="button-container">
                  <a href="${resetUrl}" class="button">
                    Restablecer mi Contraseña →
                  </a>
                </div>

                <!-- Alternative Link -->
                <div class="link-box">
                  <p>¿El botón no funciona? Copia y pega este enlace:</p>
                  <div class="link-text">${resetUrl}</div>
                </div>

                <!-- Warning -->
                <div class="warning-box">
                  <p>
                    <strong>⏰ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por seguridad.
                  </p>
                </div>

                <!-- Info -->
                <div class="info-box">
                  <p>
                    <strong>💡 ¿No solicitaste este cambio?</strong> Puedes ignorar este mensaje de forma segura. Tu contraseña no será modificada.
                  </p>
                </div>

                <div class="divider"></div>

                <p class="message" style="font-size: 14px; color: #9ca3af;">
                  Este es un correo automático, por favor no respondas a este mensaje.
                </p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-brand">Cartita</div>
                <p class="footer-text">
                  Sistema de gestión para restaurantes
                </p>
                <p class="footer-text">
                  © 2025 Cartita. Todos los derechos reservados.
                </p>
                <div class="social-links">
                  <a href="https://cartita.digital">Sitio Web</a> •
                  <a href="mailto:cartita.digitalok@gmail.com">Soporte</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      })
      .then(() => {
        clearTimeout(emailTimeout);
        console.log('✅ Email de recuperación enviado a:', email);
      })
      .catch((emailError) => {
        clearTimeout(emailTimeout);
        console.error('❌ Error al enviar email:', emailError.message || emailError);
        console.error('Código de error:', emailError.code);
        console.error('Comando:', emailError.command);
      });
    } else {
      console.log('⚠️ Email no configurado. Link de recuperación:', resetUrl);
    }

  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Resetear contraseña con token
exports.resetearPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Hash del token recibido
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const usuario = await Usuario.findOne({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Actualizar contraseña
    usuario.password = password;
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ error: 'Error al resetear la contraseña' });
  }
};

// Verificar si un token es válido
exports.verificarToken = async (req, res) => {
  try {
    const { token } = req.params;

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const usuario = await Usuario.findOne({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({ valid: false, error: 'Token inválido o expirado' });
    }

    res.json({ valid: true, email: usuario.email });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ valid: false, error: 'Error al verificar el token' });
  }
};

// Resetear contraseña directamente con email (sin token)
exports.resetearPasswordPorEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'No existe un usuario con ese email' });
    }

    // Actualizar contraseña
    usuario.password = password;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ error: 'Error al resetear la contraseña' });
  }
};

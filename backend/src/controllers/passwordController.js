const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');

// Configurar transporter de email
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('✅ Transporter de email configurado en passwordController');
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
      // Enviar email sin await para no bloquear
      transporter.sendMail({
        from: `"Cartita" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Cartita',
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
                <h1>Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <h2>Hola ${usuario.nombre},</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz click en el siguiente enlace para crear una nueva contraseña:</p>
                <center>
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </center>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="background: white; padding: 15px; border-radius: 5px; word-break: break-all;">
                  ${resetUrl}
                </p>
                <p><strong>Este enlace expirará en 1 hora.</strong></p>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
              </div>
              <div class="footer">
                <p>© 2025 Cartita - Sistema de gestión para restaurantes</p>
              </div>
            </div>
          </body>
          </html>
        `
      })
      .then(() => {
        console.log('✅ Email de recuperación enviado a:', email);
      })
      .catch((emailError) => {
        console.error('❌ Error al enviar email:', emailError);
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

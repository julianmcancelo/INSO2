const crypto = require('crypto');
const Usuario = require('../models/Usuario');

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

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar token y expiración (1 hora)
    usuario.resetPasswordToken = resetTokenHash;
    usuario.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await usuario.save();

    // En producción, aquí enviarías un email con el link
    // Por ahora, devolvemos el token para testing
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log('🔑 Token de recuperación generado:', resetUrl);

    res.json({ 
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
      // Solo para desarrollo - ELIMINAR EN PRODUCCIÓN
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

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

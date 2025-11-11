const { body, param, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: errors.array() 
    });
  }
  next();
};

/**
 * Validadores para autenticación
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

const validateRegister = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  handleValidationErrors
];

/**
 * Validadores para productos
 */
const validateProducto = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres')
    .escape(),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('categoriaId')
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no debe exceder 500 caracteres')
    .escape(),
  handleValidationErrors
];

/**
 * Validadores para categorías
 */
const validateCategoria = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .escape(),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('La descripción no debe exceder 300 caracteres')
    .escape(),
  handleValidationErrors
];

/**
 * Validadores para pedidos
 */
const validatePedido = [
  body('clienteNombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del cliente debe tener entre 2 y 100 caracteres')
    .escape(),
  body('clienteTelefono')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Teléfono inválido'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  body('items.*.productoId')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  body('items.*.cantidad')
    .isInt({ min: 1, max: 99 })
    .withMessage('Cantidad inválida'),
  handleValidationErrors
];

/**
 * Validador de ID numérico en parámetros
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido'),
  handleValidationErrors
];

/**
 * Validadores para locales
 */
const validateLocal = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres')
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Teléfono inválido'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateProducto,
  validateCategoria,
  validatePedido,
  validateId,
  validateLocal,
  handleValidationErrors
};

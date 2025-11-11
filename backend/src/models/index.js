const Local = require('./Local');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Pedido = require('./Pedido');
const PedidoItem = require('./PedidoItem');
const Invitacion = require('./Invitacion');
const Solicitud = require('./Solicitud');
const ConfiguracionPago = require('./ConfiguracionPago');
const ConfiguracionGlobal = require('./ConfiguracionGlobal');

// Definir relaciones

// Local tiene muchos Usuarios
Local.hasMany(Usuario, { foreignKey: 'localId', as: 'usuarios' });
Usuario.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

// Local tiene muchas Categorías
Local.hasMany(Categoria, { foreignKey: 'localId', as: 'categorias' });
Categoria.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

// Local tiene muchos Productos
Local.hasMany(Producto, { foreignKey: 'localId', as: 'productos' });
Producto.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

// Categoría tiene muchos Productos
Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// Local tiene muchos Pedidos
Local.hasMany(Pedido, { foreignKey: 'localId', as: 'pedidos' });
Pedido.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

// Pedido tiene muchos PedidoItems
Pedido.hasMany(PedidoItem, { foreignKey: 'pedidoId', as: 'items' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

// PedidoItem pertenece a un Producto
PedidoItem.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
Producto.hasMany(PedidoItem, { foreignKey: 'productoId', as: 'pedidoItems' });

// Invitacion pertenece a un Local
Invitacion.belongsTo(Local, { foreignKey: 'localId', as: 'local' });
Local.hasMany(Invitacion, { foreignKey: 'localId', as: 'invitaciones' });

// Invitacion creada por un Usuario
Invitacion.belongsTo(Usuario, { foreignKey: 'creadoPor', as: 'creador' });

// Invitacion usada por un Usuario
Invitacion.belongsTo(Usuario, { foreignKey: 'usadoPor', as: 'usuarioRegistrado' });

// Solicitud puede resultar en un Local
Solicitud.belongsTo(Local, { foreignKey: 'localCreado', as: 'local' });

// Solicitud revisada por un Usuario (superadmin)
Solicitud.belongsTo(Usuario, { foreignKey: 'revisadoPor', as: 'revisor' });

// Local tiene una ConfiguracionPago
Local.hasOne(ConfiguracionPago, { foreignKey: 'localId', as: 'configuracionPago' });
ConfiguracionPago.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

module.exports = {
  Local,
  Usuario,
  Categoria,
  Producto,
  Pedido,
  PedidoItem,
  Invitacion,
  Solicitud,
  ConfiguracionPago,
  ConfiguracionGlobal
};

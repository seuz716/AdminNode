const modelClientes = require("./model"); // Asegúrate de que la ruta al modelo sea correcta

// Función para manejar errores
function manejarError(error, mensaje) {
  console.error(mensaje, error);
  throw new Error(mensaje);
}

// Función para validar ID
function validarId(id) {
  return id && id.length === 24 && /^[0-9A-F]+$/i.test(id);
}

// Función para validar datos
function validarDatos(datos) {
  return datos && Object.keys(datos).length > 0;
}

// Servicio para manejar la lógica de negocio relacionada con los clientes

// Obtiene todos los clientes
async function obtenerClientes() {
  try {
    return await modelClientes.findAll();
  } catch (error) {
    manejarError(error, "Error al obtener clientes");
  }
}

// Obtiene un cliente por ID
async function obtenerCliente(id) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }
    return await modelClientes.findOne(id);
  } catch (error) {
    manejarError(error, `Error al buscar el cliente con id ${id}`);
  }
}

// Obtiene clientes por nombre
async function obtenerClientesPorNombre(nombre) {
  try {
    return await modelClientes.obtenerPorNombre(nombre);
  } catch (error) {
    manejarError(error, `Error al buscar clientes por nombre ${nombre}`);
  }
}

// Obtiene clientes por tamaño
async function obtenerClientesPorTamano() {
  try {
    return await modelClientes.obtenerPorTamano();
  } catch (error) {
    manejarError(error, "Error al obtener clientes por tamaño");
  }
}

// Crea un nuevo cliente
async function crearCliente(datos) {
  try {
    if (!validarDatos(datos)) {
      return { mensaje: "No se puede crear cliente, no hay datos" };
    }

    const resConsulta = await modelClientes.crearUno(datos);
    return resConsulta && resConsulta.acknowledged
      ? { mensaje: "Cliente creado exitosamente", datos: resConsulta.insertedId }
      : { mensaje: "Error al crear cliente", datos };
  } catch (error) {
    manejarError(error, "Error al crear el cliente");
  }
}

// Actualiza un cliente por ID
async function actualizarCliente(id, datos) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }
    if (!validarDatos(datos)) {
      return { mensaje: "No hay datos para actualizar" };
    }

    const resConsulta = await modelClientes.actualizarUna(id, datos);
    return resConsulta && resConsulta.acknowledged
      ? { mensaje: "Cliente actualizado exitosamente", datos: resConsulta }
      : { mensaje: "Error al actualizar cliente", datos: resConsulta };
  } catch (error) {
    manejarError(error, `Error al actualizar el cliente con id ${id}`);
  }
}

// Elimina un cliente por ID
async function eliminarCliente(id) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }

    const resultadoEliminar = await modelClientes.eliminarUna(id);
    return resultadoEliminar && resultadoEliminar.acknowledged
      ? { mensaje: "Cliente eliminado exitosamente", datos: resultadoEliminar }
      : { mensaje: "Error al eliminar cliente", datos: id };
  } catch (error) {
    manejarError(error, `Error al eliminar el cliente con id ${id}`);
  }
}

module.exports = {
  obtenerClientes,
  obtenerCliente,
  obtenerClientesPorNombre,
  obtenerClientesPorTamano,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};

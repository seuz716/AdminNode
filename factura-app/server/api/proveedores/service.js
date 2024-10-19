const basedatos = require("../../database/connection");
const { ObjectId } = require("mongodb");
const modelProveedores = require("./model"); // Asegúrate de que la ruta al modelo sea correcta

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

// Servicio para manejar la lógica de negocio relacionada con los proveedores

// Obtiene todos los proveedores
async function obtenerProveedores() {
  try {
    return await modelProveedores.findAll();
  } catch (error) {
    manejarError(error, "Error al obtener proveedores");
  }
}

// Obtiene un proveedor por ID
async function obtenerProveedor(id) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }
    return await modelProveedores.findOne(id);
  } catch (error) {
    manejarError(error, `Error al buscar el proveedor con id ${id}`);
  }
}

async function buscarProveedores(datosProveedor) {
  try {
    return await modelProveedores.obtenerTodosProveedores(datosProveedor);
  } catch (error) {
    manejarError(error, "Error al obtener proveedores por criterios");
  }
}

// Obtiene proveedores por nombre
async function obtenerProveedoresPorNombre(nombre) {
  try {
    return await modelProveedores.obtenerPorNombre(nombre);
  } catch (error) {
    manejarError(error, `Error al buscar proveedores por nombre ${nombre}`);
  }
}

// Crea un nuevo proveedor
async function crearProveedor(datos) {
  try {
    // Validar los datos
    if (!validarDatos(datos)) {
      return { mensaje: "No se puede crear proveedor, no hay datos" };
    }

    // Crear el proveedor
    const resConsulta = await modelProveedores.crearUno(datos);

    // Verificar si la creación fue exitosa
    if (resConsulta && resConsulta.acknowledged) {
      const nombreProveedor = datos.proveedor.informacion.nombre_completo;
      console.log("Proveedor", nombreProveedor, "creado exitosamente:", resConsulta.insertedId);

      return {
        mensaje: `Proveedor ${nombreProveedor} creado exitosamente`,
        id: resConsulta.insertedId,
        datos: resConsulta
      };
    } else {
      return { mensaje: "Error al crear proveedor", datos };
    }
  } catch (error) {
    manejarError(error, "Error al crear el proveedor");
    return { mensaje: "Error interno al crear proveedor", error };
  }
}

// Actualiza un proveedor por ID
async function actualizarProveedor(id, datos) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }
    if (!validarDatos(datos)) {
      return { mensaje: "No hay datos para actualizar" };
    }

    const resConsulta = await modelProveedores.actualizarUno(id, datos);
    return resConsulta && resConsulta.acknowledged
      ? { mensaje: "Proveedor actualizado exitosamente", datos: resConsulta }
      : { mensaje: "Error al actualizar proveedor", datos: resConsulta };
  } catch (error) {
    manejarError(error, `Error al actualizar el proveedor con id ${id}`);
  }
}

// Elimina un proveedor por ID
async function eliminarProveedor(id) {
  try {
    if (!validarId(id)) {
      return { mensaje: "ID inválido" };
    }

    const resultadoEliminar = await modelProveedores.eliminarUno(id);
    return resultadoEliminar && resultadoEliminar.acknowledged
      ? { mensaje: "Proveedor eliminado exitosamente", datos: resultadoEliminar }
      : { mensaje: "Error al eliminar proveedor", datos: id };
  } catch (error) {
    manejarError(error, `Error al eliminar el proveedor con id ${id}`);
  }
}

module.exports = {
  obtenerProveedores,
  obtenerProveedor,
  obtenerProveedoresPorNombre,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  buscarProveedores,
};

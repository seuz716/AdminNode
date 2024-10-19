const basedatos = require("../../database/connection");
const { ObjectId } = require("mongodb");

// Función para obtener todos los proveedores
async function findAll() {
  try {
    const db = basedatos.obtenerConexion();
    const proveedores = await db.collection("proveedores").find({}).toArray();

    if (proveedores.length === 0) {
      console.log("No se encontraron proveedores.");
      return [];
    }

    console.log("Proveedores encontrados:", proveedores.length);
    return proveedores;
  } catch (error) {
    console.error("Error al obtener todos los proveedores:", error);
    throw new Error("Error al obtener los proveedores.");
  }
}

// Función para obtener un proveedor por ID
async function findOne(id) {
  try {
    const db = basedatos.obtenerConexion();

    if (!ObjectId.isValid(id)) {
      console.log(`ID inválido: ${id}`);
      return null;
    }

    const proveedor = await db.collection("proveedores").findOne({ _id: new ObjectId(id) });

    if (!proveedor) {
      console.log(`Proveedor con id ${id} no encontrado.`);
      return null;
    }

    console.log("Proveedor encontrado:", proveedor);
    return proveedor;
  } catch (error) {
    console.error(`Error al buscar el proveedor con id ${id}:`, error);
    throw new Error("Error al buscar el proveedor.");
  }
}

// Función para obtener proveedores filtrados
async function obtenerTodosProveedores(datosProveedor) {
  try {
    const db = basedatos.obtenerConexion();
    const filtro = {};

    if (datosProveedor.nombre_completo) {
      filtro["informacion_empresa.nombre_completo"] = { $regex: new RegExp(datosProveedor.nombre_completo, "i") };
    }
    if (datosProveedor.numero_identificacion) {
      filtro["informacion_empresa.numero_identificacion"] = datosProveedor.numero_identificacion;
    }

    const proveedores = await db.collection("proveedores").find(filtro).toArray();
    return proveedores;
  } catch (error) {
    console.error("Error al obtener todos los proveedores:", error);
    throw error;
  }
}

// Función para obtener proveedores por nombre
async function obtenerPorNombre(nombre) {
  try {
    const db = basedatos.obtenerConexion();
    const proveedores = await db
      .collection("proveedores")
      .find({ "informacion_empresa.nombre_completo": new RegExp(nombre, "i") })
      .toArray();

    console.log(`Proveedores encontrados con el nombre ${nombre}:`, proveedores.length);
    return proveedores;
  } catch (error) {
    console.error(`Error al buscar proveedores por nombre ${nombre}:`, error);
    throw error;
  }
}

// Función para obtener proveedores por tamaño
async function obtenerPorTamano() {
  try {
    const db = basedatos.obtenerConexion();
    const proveedores = await db
      .collection("proveedores")
      .find({ capacidad_servicio: { $gte: 1000 } })
      .limit(20)
      .sort({ capacidad_servicio: -1 })
      .toArray();
    console.log(`Proveedores con capacidad mayor o igual a 1000 unidades:`, proveedores.length);
    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores por tamaño:", error);
    throw error;
  }
}

// Función para crear un nuevo proveedor
async function crearUno(datos) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("proveedores").insertOne(datos);
    const nombreProveedor = datos.proveedor.informacion_empresa.nombre_completo;
    console.log("Proveedor", nombreProveedor, "creado exitosamente:", resultado.insertedId);
    return resultado;
  } catch (error) {
    console.error("Error al crear un proveedor:", error);
    throw error;
  }
}

// Función para actualizar un proveedor por ID
async function actualizarUna(id, datos) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("proveedores").updateOne({ _id: ObjectId(id) }, { $set: datos });
    if (resultado.matchedCount === 0) {
      console.log(`No se encontró proveedor con id ${id} para actualizar.`);
      return null;
    }
    console.log(`Proveedor con id ${id} actualizado exitosamente.`);
    return resultado;
  } catch (error) {
    console.error(`Error al actualizar el proveedor con id ${id}:`, error);
    throw error;
  }
}

// Función para eliminar un proveedor por ID
async function eliminarUna(id) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("proveedores").deleteOne({ _id: ObjectId(id) });
    if (resultado.deletedCount === 0) {
      console.log(`No se encontró proveedor con id ${id} para eliminar.`);
      return null;
    }
    console.log(`Proveedor con id ${id} eliminado exitosamente.`);
    return resultado;
  } catch (error) {
    console.error(`Error al eliminar el proveedor con id ${id}:`, error);
    throw error;
  }
}

module.exports = {
  findAll,
  findOne,
  obtenerPorNombre,
  obtenerPorTamano,
  crearUno,
  actualizarUna,
  eliminarUna,
  obtenerTodosProveedores,
};

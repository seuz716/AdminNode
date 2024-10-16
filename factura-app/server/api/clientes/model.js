const basedatos = require("../../database/connection");
const { ObjectId } = require("mongodb");

// Función para obtener todos los clientes
async function findAll() {
  try {
    const db = basedatos.obtenerConexion();
    const clientes = await db.collection("clientes").find({}).toArray();
    console.log("Clientes encontrados:", clientes.length);
    return clientes;
  } catch (error) {
    console.error("Error al obtener todos los clientes:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en otro lugar si es necesario
  }
}

// Función para obtener un cliente por ID
async function findOne(id) {
  try {
    const db = basedatos.obtenerConexion();
    const cliente = await db.collection("clientes").findOne({ _id: ObjectId(id) });
    if (!cliente) {
      console.log(`Cliente con id ${id} no encontrado`);
      return null;
    }
    console.log(`Cliente encontrado:`, cliente);
    return cliente;
  } catch (error) {
    console.error(`Error al buscar el cliente con id ${id}:`, error);
    throw error;
  }
}

// Función para obtener clientes por nombre
async function obtenerPorNombre(nombre) {
  try {
    const db = basedatos.obtenerConexion();
    const clientes = await db
      .collection("clientes")
      .find({ name: new RegExp(nombre, "i") })
      .toArray();
    console.log(`Clientes encontrados con el nombre ${nombre}:`, clientes.length);
    return clientes;
  } catch (error) {
    console.error(`Error al buscar clientes por nombre ${nombre}:`, error);
    throw error;
  }
}

// Función para obtener clientes por tamaño
async function obtenerPorTamano() {
  try {
    const db = basedatos.obtenerConexion();
    const clientes = await db
      .collection("clientes")
      .find({ capacity_mw: { $gte: "900" } })
      .limit(20)
      .sort({ capacity_mw: -1 })
      .toArray();
    console.log(`Clientes encontrados con capacidad mayor o igual a 900 MW:`, clientes.length);
    return clientes;
  } catch (error) {
    console.error("Error al obtener clientes por tamaño:", error);
    throw error;
  }
}

// Función para crear un nuevo cliente
async function crearUno(datos) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("clientes").insertOne(datos);
    console.log("Cliente creado exitosamente:", resultado.insertedId);
    return resultado;
  } catch (error) {
    console.error("Error al crear un cliente:", error);
    throw error;
  }
}

// Función para actualizar un cliente por ID
async function actualizarUna(id, datos) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("clientes").updateOne({ _id: ObjectId(id) }, { $set: datos });
    if (resultado.matchedCount === 0) {
      console.log(`No se encontró cliente con id ${id} para actualizar.`);
      return null;
    }
    console.log(`Cliente con id ${id} actualizado exitosamente.`);
    return resultado;
  } catch (error) {
    console.error(`Error al actualizar el cliente con id ${id}:`, error);
    throw error;
  }
}

// Función para eliminar un cliente por ID
async function eliminarUna(id) {
  try {
    const db = basedatos.obtenerConexion();
    const resultado = await db.collection("clientes").deleteOne({ _id: ObjectId(id) });
    if (resultado.deletedCount === 0) {
      console.log(`No se encontró cliente con id ${id} para eliminar.`);
      return null;
    }
    console.log(`Cliente con id ${id} eliminado exitosamente.`);
    return resultado;
  } catch (error) {
    console.error(`Error al eliminar el cliente con id ${id}:`, error);
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
};

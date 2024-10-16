const basedatos = require("../../database/connection");
const { ObjectId } = require("mongodb"); // Asegúrate de importar ObjectId correctamente

// Modelo para manipular la base de datos
// Funciones para obtener, actualizar, guardar y eliminar

async function findAll() {
    try {
        // Obtener la conexión a la base de datos
        const db = basedatos.obtenerConexion();
        
        // Realizamos la consulta a la colección 'usuarios1'
        const usuarios = await db.collection("usuarios1").find({}).toArray();
        
        // Retornamos la lista de usuarios
        return usuarios;
    } catch (error) {
        console.error("Error al obtener todos los usuarios desde la base de datos:", error);
        throw new Error("No se pudo obtener la lista de usuarios");
    }
}



async function obtenerUna(id) {
    try {
        const db = basedatos.obtenerConexion();
        const usuario = await db.collection("usuarios1").findOne({ "_id": new ObjectId(id) }); // Usa 'new'
        return usuario;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw new Error("No se pudo obtener el usuario");
    }
}

async function buscarUsuario(nombre) {
    try {
        const db = basedatos.obtenerConexion();
        const usuario = await db.collection("usuarios1").findOne({ "usuario": nombre });
        return usuario;
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        throw new Error("No se pudo buscar el usuario");
    }
}

async function crearUno(datosUsuario) {
    try {
        const db = basedatos.obtenerConexion();
        const resultado = await db.collection("usuarios1").insertOne(datosUsuario);
        return resultado;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        throw new Error("No se pudo crear el usuario");
    }
}

async function actualizarUna(id, datos) {
    try {
        const db = basedatos.obtenerConexion();
        const resultado = await db.collection("usuarios1").updateOne(
            { "_id": new ObjectId(id) }, // Usa 'new'
            { "$set": datos }
        );
        console.log(resultado);
        return resultado;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw new Error("No se pudo actualizar el usuario");
    }
}

async function eliminarUna(id) {
    try {
        const db = basedatos.obtenerConexion();
        const resultado = await db.collection("usuarios1").deleteOne({ "_id": new ObjectId(id) }); // Usa 'new'
        console.log(resultado);
        return resultado;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw new Error("No se pudo eliminar el usuario");
    }
}

module.exports = {
    findAll,
    obtenerUna,
    crearUno,
    actualizarUna,
    eliminarUna,
    buscarUsuario,
};

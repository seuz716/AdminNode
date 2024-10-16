// IMPORTAR LOS MÓDULOS
const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;

// Función para conectar a la base de datos
const conectar = async () => {
    if (database) {
        // Si ya hay una conexión, resolvemos inmediatamente
        return database;
    }

    try {
        // Conectar a MongoDB sin opciones obsoletas
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        database = client.db(process.env.MONGODB_DB);
        console.log('Base de datos conectada todo right');
        return database;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw new Error('No se pudo conectar a la base de datos');
    }
};

// Función para obtener la conexión a la base de datos
const obtenerConexion = () => {
    if (!database) {
        throw new Error('No hay conexión a la base de datos. Por favor, conéctese primero.');
    }
    return database;
};

module.exports = { conectar, obtenerConexion };

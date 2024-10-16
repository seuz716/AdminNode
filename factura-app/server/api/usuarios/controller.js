const express = require("express");
const controladorUsuarios = express.Router();
const servicioUsuarios = require('./service');

/* datosUsuario
{
    "nombre": xxxxxx,
    "usuario": xxxxx,
    "password": xxxxx,
    "rol": ["A", "B", ..."n"]
} 
*/

// Ruta para iniciar sesión
controladorUsuarios.get("/iniciarSesion", async function (req, res) {
    try {
        let datosUsuario = req.body;
        let resultado = await servicioUsuarios.iniciarSesion(datosUsuario);
        res.send(resultado);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({ mensaje: "Error al iniciar sesión", error: error.message });
    }
});

// Ruta para crear un nuevo usuario
controladorUsuarios.post("/crearUsuario", async function (req, res) {
    try {
        let datosUsuario = req.body;
        let resultado = await servicioUsuarios.crearUsuario(datosUsuario);
        res.status(201).send({ resultado });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(400).send({ mensaje: error.message });
    }
});

// Ruta para actualizar un usuario
controladorUsuarios.put("/actualizarUsuario/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;

        // Llamar al servicio para actualizar el usuario
        const resultado = await servicioUsuarios.actualizarUsuario(id, datos);

        res.status(200).send({ resultado });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(400).send({ mensaje: error.message });
    }
});


// Ruta para eliminar un usuario
controladorUsuarios.delete("/eliminarUsuario/:id", async function (req, res) {
    try {
        let id = req.params.id;
        let resultado = await servicioUsuarios.eliminarUsuario(id);
        res.send({ mensaje: "Usuario eliminado exitosamente", resultado });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(400).send({ mensaje: error.message });
    }
});

controladorUsuarios.get("/usuarios", async (req, res) => {
    try {
        // Llamamos al servicio para obtener los usuarios
        const resultado = await servicioUsuarios.obtenerUsuarios();
        
        // Si obtenemos resultado, respondemos con éxito
        res.status(200).json({ usuarios: resultado });
    } catch (error) {
        // Capturamos y manejamos cualquier error
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error al obtener usuarios", error: error.message });
    }
});



module.exports = controladorUsuarios;

const express = require('express');
const bcrypt = require('bcrypt');
const modeloUsuarios = require('./model');
const jwt = require('../auth/jwt');
require('dotenv').config();

async function iniciarSesion(datosUsuario) {
    let resultado = {};
    try {
        if (datosUsuario && Object.keys(datosUsuario).length > 0 && datosUsuario.usuario && datosUsuario.clave) {
            let usuario = await modeloUsuarios.buscarUsuario(datosUsuario.usuario);
            if (usuario) {
                let claveEncriptada = usuario.clave;
                let esValida = bcrypt.compareSync(datosUsuario.clave, claveEncriptada);
                if (esValida) {
                    resultado.mensaje = "Inicio de sesión correcto";
                    let token = jwt.generarToken(usuario);
                    delete usuario.clave;
                    resultado.token = token;
                } else {
                    resultado.mensaje = "Usuario o Clave incorrectos";
                }
            } else {
                resultado.mensaje = "Usuario o Clave incorrectos";
            }
        } else {
            resultado.mensaje = "Datos Incorrectos";
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        resultado.mensaje = "Error en el servidor";
        resultado.error = error.message;
    }
    return resultado;
}

async function obtenerUsuarios() {
    try {
        // Llamamos al modelo para obtener todos los usuarios
        const resultado = await modeloUsuarios.findAll();
        
        // Validamos que haya resultados
        if (!resultado || resultado.length === 0) {
            throw new Error("No se encontraron usuarios");
        }

        // Retornamos el resultado al controlador
        return resultado;
    } catch (error) {
        console.error("Error en el servicio al obtener usuarios:", error);
        throw new Error("Error al obtener usuarios desde el servicio");
    }
}




async function crearUsuario(datosUsuario) {
    let resultado = {};
    try {
        if (datosUsuario && Object.keys(datosUsuario).length > 0) {
            if (datosUsuario.usuario && datosUsuario.clave) {
                // Verificar si el usuario ya existe
                let usuarioExistente = await modeloUsuarios.buscarUsuario(datosUsuario.usuario);
                if (usuarioExistente) {
                    // No lanzamos error, solo informamos que el usuario ya existe
                    resultado.mensaje = `Ya existe un usuario con el nombre: ${datosUsuario.usuario}`;
                    return resultado;
                }

                // Encriptar clave
                let claveEncriptada = bcrypt.hashSync(datosUsuario.clave, parseInt(process.env.ENC_SALTROUNDS));
                datosUsuario.clave = claveEncriptada;

                // Crear el usuario
                let resultadoCrear = await modeloUsuarios.crearUno(datosUsuario);
                if (resultadoCrear && resultadoCrear.acknowledged) {
                    resultado.mensaje = "Usuario creado correctamente";
                    resultado.datos = resultadoCrear;
                } else {
                    resultado.mensaje = "Usuario no pudo ser creado";
                }
            } else {
                resultado.mensaje = "Usuario y clave son requeridos";
            }
        } else {
            resultado.mensaje = "No hay datos proporcionados";
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
        resultado.mensaje = "Error en el servidor";
        resultado.error = error.message;
    }
    return resultado;
}


async function actualizarUsuario(id, datos) {
    let resultado = {};
    try {
        // Validar el ID (que sea un ObjectId válido de MongoDB)
        if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error("ID inválido");
        }

        // Validar los datos proporcionados
        if (!datos || Object.keys(datos).length === 0) {
            throw new Error("No hay datos proporcionados para actualizar");
        }

        // Validar el campo 'nombre'
        if (!datos.nombre || datos.nombre.trim() === "") {
            throw new Error("El nombre no puede estar vacío");
        }

        // Si se pasa una nueva clave, encriptarla antes de actualizar
        if (datos.clave) {
            datos.clave = bcrypt.hashSync(datos.clave, parseInt(process.env.ENC_SALTROUNDS));
        }

        // Realizar la actualización
        const resultadoActualizar = await modeloUsuarios.actualizarUna(id, datos);

        if (resultadoActualizar && resultadoActualizar.acknowledged) {
            resultado.mensaje = "Usuario actualizado correctamente";
            resultado.datos = resultadoActualizar;
        } else {
            throw new Error("Error al actualizar el usuario");
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        resultado.mensaje = error.message;
    }
    return resultado;
}




async function eliminarUsuario(id) {
    let resultado = {};
    try {
        if (id && id.length == 24 && /^[0-9A-F]+$/i.test(id)) {
            let resultadoEliminar = await modeloUsuarios.eliminarUna(id);
            if (resultadoEliminar && resultadoEliminar.acknowledged) {
                resultado.mensaje = "Usuario eliminado correctamente";
                resultado.datos = resultadoEliminar;
            } else {
                throw new Error("Error al eliminar el usuario");
            }
        } else {
            throw new Error("ID inválido");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        resultado.mensaje = error.message;
    }
    return resultado;
}

module.exports = {
    crearUsuario,
    iniciarSesion,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
};

const express = require("express");
const { body, param, validationResult } = require("express-validator");
const serviceProveedores = require("./serviceProveedores"); // Asumiendo que tienes un service de proveedores
const controladorProveedores = express.Router();

/* Middleware para manejo de errores */
const manejoErrores = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ mensaje: "Error interno del servidor", error: err.message });
};

const enviarRespuesta = (res, mensaje, data = null, status = 200) => {
  res.status(status).send({ mensaje, data });
};

/* Puntos de entrada a la Api. */

// Obtener todos los proveedores
controladorProveedores.get("/proveedores", async function (req, res, next) {
  try {
    let proveedores = await serviceProveedores.obtenerProveedores();
    enviarRespuesta(res, "Listado de Proveedores", proveedores);
  } catch (error) {
    next(error);
  }
});

// Obtener un proveedor por ID
controladorProveedores.get("/obtenerProveedor/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({ errores: errores.array() });
    }
    let id = req.params.id;
    try {
      let proveedor = await serviceProveedores.obtenerProveedor(id);
      if (proveedor) {
        enviarRespuesta(res, "Proveedor encontrado", proveedor);
      } else {
        enviarRespuesta(res, "Proveedor no encontrado", null, 404);
      }
    } catch (error) {
      next(error);
    }
});

// Obtener proveedores por nombre y NIT
controladorProveedores.post("/obtenerProveedoresPorNombreYNit", async function (req, res, next) {
    try {
        let datosProveedor = req.body;
        let resultado = await serviceProveedores.buscarProveedores(datosProveedor);
        res.status(201).send({ resultado });
    } catch (error) {
        console.error("Error al consultar el Proveedor:", error);
        res.status(400).send({ mensaje: error.message });
    }
});

// Crear un nuevo proveedor
controladorProveedores.post("/crearProveedor", async function (req, res) {
    try {
        let datosProveedor = req.body;
        let resultado = await serviceProveedores.crearProveedor(datosProveedor);
        res.status(201).send({ resultado });
    } catch (error) {
        console.error("Error al crear el Proveedor:", error);
        res.status(400).send({ mensaje: error.message });
    }
});

// Actualizar un proveedor por ID
controladorProveedores.put("/actualizarProveedor/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({ errores: errores.array() });
    }
    let id = req.params.id;
    let datos = req.body;
    try {
      let resultado = await serviceProveedores.actualizarProveedor(id, datos);
      enviarRespuesta(res, "Proveedor actualizado", resultado);
    } catch (error) {
      next(error);
    }
});

// Eliminar un proveedor por ID
controladorProveedores.delete("/eliminarProveedor/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let resultado = await serviceProveedores.eliminarProveedor(id);
      enviarRespuesta(res, "Proveedor eliminado", resultado);
    } catch (error) {
      next(error);
    }
});

// Uso del middleware de manejo de errores
controladorProveedores.use(manejoErrores);

module.exports = controladorProveedores;

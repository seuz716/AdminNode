const express = require("express");
const { body, param, validationResult } = require("express-validator");
const serviceClientes = require("./service"); 
const controladorClientes = express.Router();



/* Middleware para manejo de errores */
const manejoErrores = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ mensaje: "Error interno del servidor", error: err.message });
};

const enviarRespuesta = (res, mensaje, data = null, status = 200) => {
  res.status(status).send({ mensaje, data });
};

/* Puntos de entrada a la Api. */
controladorClientes.get("/clientes", async function (req, res, next) {
  try {
    let clientes = await serviceClientes.obtenerClientes();
    enviarRespuesta(res, "Listado de Clientes", clientes);
  } catch (error) {
    next(error);
  }
});

controladorClientes.get("/obtenerCliente/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({ errores: errores.array() });
    }
    let id = req.params.id;
    try {
      let cliente = await serviceClientes.obtenerCliente(id);
      if (cliente) {
        enviarRespuesta(res, "Cliente encontrado", cliente);
      } else {
        enviarRespuesta(res, "Cliente no encontrado", null, 404);
      }
    } catch (error) {
      next(error);
    }
});

controladorClientes.get("/obtenerClientesPorNombre/:nombre", async function (req, res, next) {
  let nombre = req.params.nombre;
  try {
    let clientes = await serviceClientes.obtenerClientesPorNombre(nombre);
    enviarRespuesta(res, "Clientes encontrados", clientes);
  } catch (error) {
    next(error);
  }
});

controladorClientes.post("/crearCliente",
  [
    body("nombre").isString().notEmpty(),
    body("email").isEmail(),
  ],
  async function (req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({ errores: errores.array() });
    }
    let datos = req.body;
    try {
      let resultado = await serviceClientes.crearCliente(datos);
      enviarRespuesta(res, resultado.mensaje, resultado.datos);
    } catch (error) {
      next(error);
    }
});

controladorClientes.put("/actualizarCliente/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({ errores: errores.array() });
    }
    let id = req.params.id;
    let datos = req.body;
    try {
      let resultado = await serviceClientes.actualizarCliente(id, datos);
      enviarRespuesta(res, "Cliente actualizado", resultado);
    } catch (error) {
      next(error);
    }
});

controladorClientes.delete("/eliminarCliente/:id", 
  param("id").isMongoId(), 
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let resultado = await serviceClientes.eliminarCliente(id);
      enviarRespuesta(res, "Cliente eliminado", resultado);
    } catch (error) {
      next(error);
    }
});

// Uso del middleware de manejo de errores
controladorClientes.use(manejoErrores);

module.exports = controladorClientes;

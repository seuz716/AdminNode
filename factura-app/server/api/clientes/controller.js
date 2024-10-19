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

controladorClientes.get("/obtenerClientesPorNombreYNit/:nombre?/:nit?", async function (req, res, next) {
    try {
        const { nombre, nit } = req.params; // Acceder a los parámetros de la URL
        let datosCliente = {
            "cliente.informacion_personal.nombre_completo": nombre || "", // Cambiado para reflejar la estructura anidada
            "cliente.informacion_personal.numero_identificacion": nit || "", // Cambiado para reflejar la estructura anidada
        };
        
        let resultado = await serviceClientes.buscarClientes(datosCliente);
        res.status(200).send({ resultado }); // Cambiado a 200 para GET
    } catch (error) {
        console.error("Error al consultar el Cliente:", error);
        res.status(400).send({ mensaje: error.message });
    }
});




// Ruta para crear un nuevo Cliente
controladorClientes.post("/crearCliente", async function (req, res) {
    try {
        let datosCliente = req.body;
        let resultado = await serviceClientes.crearCliente(datosCliente);
        res.status(201).send({ resultado });
    } catch (error) {
        console.error("Error al crear el Cliente:", error);
        res.status(400).send({ mensaje: error.message });
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

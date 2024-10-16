const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const controladorUsuarios = require('./api/usuarios/controller');
const controladorClientes = require('./api/clientes/controller');
const database = require('./database/connection');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3700;

const configurarMiddleware = () => {
    app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
    app.use(helmet());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan(process.env.MORGAN_MODE));
    }
};

const configurarRutas = () => {
    app.use("/api/usuarios", controladorUsuarios);  // Esto debe ser un router válido
    app.use("/api/clientes", controladorClientes);
};

const manejarErrores = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({ 
        error: err.message || 'Ocurrió un error en el servidor.'
    });
};

configurarMiddleware();
configurarRutas();
app.use(manejarErrores);

const iniciarServidor = async () => {
    try {
        await database.conectar();
        app.listen(port, () => {
            console.log("API Ejecutándose en el puerto " + port);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

iniciarServidor();

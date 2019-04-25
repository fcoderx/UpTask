const express = require('express');
const router = express.Router();

// Importar controladores
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// Importar express validator
const { body } = require('express-validator/check');


module.exports = function() {
    
    /*========================================================================================================= 
                                            RUTAS PARA EL HOME 
    =========================================================================================================*/
    router.get('/', authController.usuarioAutenticado, proyectosController.proyectoHome);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar proyectos
    router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);

    // Editar proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Eliminar proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);




    /*========================================================================================================= 
                                            RUTAS PARA LAS TAREAS 
    =========================================================================================================*/
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);

    // Actualizar tareas
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    // Eliminar tareas
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);





    /*========================================================================================================= 
                                            RUTAS PARA LOS USUARIOS 
    =========================================================================================================*/
    
    // Crear cuenta de usuarios
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);

    // Cerrar Sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);




    return router;

};

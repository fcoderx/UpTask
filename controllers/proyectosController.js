const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');

exports.proyectoHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    res.render('index', {
        tituloPagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    res.render('nuevoProyecto', {
        tituloPagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    // Leer los datos del formulario en la consola
    // console.log(req.body);
    // Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        // No hay errores
        // Insertar en la base de datos
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
};

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        /* include: [
            { model: Proyectos }
        ] */
    });


    if(!proyecto) return next();

    res.render('tareas', {
        tituloPagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

exports.formularioEditar = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        tituloPagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
};

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    // Leer los datos del formulario en la consola
    // console.log(req.body);
    // Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        // No hay errores
        // Insertar en la base de datos
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id}}
        );
        res.redirect('/');
    }
};

exports.eliminarProyecto = async (req, res, next) => {
    //
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if (!resultado) return next();

    res.status(200).send('Proyecto Eliminado Correctamente');
};
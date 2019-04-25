const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta', {
        tituloPagina: 'Crear cuenta en Uptask'
    });
};

exports.formIniciarSesion = (req, res, next) => {
    const { error } = res.locals.mensajes
    res.render('iniciarSesion', {
        tituloPagina: 'Iniciar Sesión en Uptask',
        error
    });
};

exports.crearCuenta = async (req, res, next) => {
    // Leer los datos
    const { email, password } = req.body;

    // Usar try catch cuando se tenga que enviar y mostrar los errores a la vista
    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmar
        const confirmarURL = `http://${req.headers.host}/confirmar/${email}`;

        // Crear el objeto de usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarURL,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            tituloPagina: 'Crear cuenta en Uptask',
            email,
            password
        });
    }
};

// Función para reestablecer contraseña
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        tituloPagina: 'Reestablecer tu contraseña'
    });
}

// Función para confirmar cuenta de usuario
exports.confirmarCuenta =  async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'NO valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}
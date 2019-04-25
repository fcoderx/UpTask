const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto'); // Generar un token automático con node
const enviarEmail = require('../handlers/email');

exports.autenticarUsuarios = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Función para verificar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }
    // Si el usuario no esta autenticado, redirigir a formulario
    return res.redirect('/iniciar-sesion');
};

// Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // Al cerrar sesion nos lleva al login
    });
};

// Genera un token si el usuario existe
exports.enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email }});

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // Si el usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardar token y expiración en la db
    usuario.save();

    // Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    // Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    // Terminar la ejecucion
    req.flash('correcto', 'Se ha enviado un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

};

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el nuevo password
    res.render('resetPassword', {
        tituloPagina: 'Reestablecer contraseña'
    });

};

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) =>{
    
    // Verificar el token y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

     // Si no existe el usuario
     if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // Encryptar el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
};

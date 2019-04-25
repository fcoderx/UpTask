const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser =  require('body-parser');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Crear la conexión a la db
const db = require('./config/db');

// Importar los modelos
require('./models/Proyectos');
require('./models/tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado con el servidor'))
    .catch( error => console.log(error));

// Crear app para express
const app = express();

// Crear variable del puerto
const port = process.env.PORT || 3000;

// Cargar archivos estáticos
app.use(express.static('public'));

// Habilitar el view engine pug
app.set('view engine', 'pug');

// Habilitar bodyparser para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Anadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

// Cookies
app.use(cookieParser());

// Sesiones - nos permite navegar entre distintas páginas sin volvernos a auténticar
app.use(session({
    secret: 'ultr4s3cr3t',
    resave: false,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Pasar variables locales  a toda la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


// Usar las rutas del proyecto
app.use('/', routes());

app.listen(port);


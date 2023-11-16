// Librerías externas
require('dotenv').config()
const express = require('express');

// Módulos internos
const { readFile } = require('./src/files');
const pets = require('./src/routes/pets');
const pets_api = require('./src/routes/pets_api');
const authRouter = require('./src/routes/users.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const FILE_NAME = './db/pets.txt';

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'ingenieria informatica', resave: true, saveUninitialized: true }));
require('./src/config/passport')(app);

//Usar el motor de plantillas de EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

//Rutas DE PRUEBA
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list = ['Juan', 'Pedro', 'María', 'José'];
    //res.send(`Hello ${formal ? 'Mr.' : ''} 
    //${name} ${type ? ' ' + type : ''}`);
    res.render('index', {
        name: name,
        students: students_list,
    }) //Enviar datos a la vista
});

app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

app.use('/pets', pets);

app.use('/api/pets', pets_api);

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});

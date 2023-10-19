// Librerías externas
require('dotenv').config()
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('./src/files');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const FILE_NAME = './db/pets.txt';

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Usar el motor de plantillas de EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

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

//WEB
// Listar Mascotas
app.get('/pets', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.render('pets/index', { pets: data });
});

//Crear Mascota
app.get('/pets/create', (req, res)=>{
    //Mostrar el formulario
    res.render('pets/create');
});

app.post('/pets', (req, res) => {
    try {
        //Leer el archivo de mascotas
        const data = readFile(FILE_NAME);
        //Agregar la nueva mascota (Agregar ID)
        const newPet = req.body;
        newPet.id = uuidv4();
        console.log(newPet)
        data.push(newPet);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/pets');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

//Eliminar una mascota
app.post('/pets/delete/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const pets = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const petIndex = pets.findIndex(pet => pet.id === id )
    if( petIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"});
        return;
    }
    //Eliminar la mascota que esté en la posición petIndex
    pets.splice(petIndex, 1);
    writeFile(FILE_NAME, pets)
    res.redirect('/pets');
})


// API
// Listar Mascotas
app.get('/api/pets', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.json(data);
})

//Crear Mascota
app.post('/api/pets', (req, res) => {
    try {
        //Leer el archivo de mascotas
        const data = readFile(FILE_NAME);
        //Agregar la nueva mascota (Agregar ID)
        const newPet = req.body;
        newPet.id = uuidv4();
        console.log(newPet)
        data.push(newPet);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ message: 'La mascota fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

//Obtener una sola mascota
app.get('/api/pets/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const pets = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const petFound = pets.find(pet => pet.id === id )
    if(!petFound){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"})
        return;
    }
    res.json({'ok': true, pet: petFound});
})

//Actualizar una mascota
app.put('/api/pets/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const pets = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const petIndex = pets.findIndex(pet => pet.id === id )
    if( petIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"});
        return;
    }
    let pet = pets[petIndex]; //Sacar del arreglo
    pet = { ...pet, ...req.body  };
    pets[petIndex] = pet; //Poner la mascota en el mismo lugar
    writeFile(FILE_NAME, pets);
    //Si la mascota existe, modificar sus datos y almacenarlo nuevamente
    res.json({'ok': true, pet: pet});
})

//Eliminar una mascota
app.delete('/api/pets/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const pets = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const petIndex = pets.findIndex(pet => pet.id === id )
    if( petIndex < 0 ){// Si no se encuentra la mascota con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"});
        return;
    }
    //Eliminar la mascota que esté en la posición petIndex
    pets.splice(petIndex, 1);
    writeFile(FILE_NAME, pets)
    res.json({'ok': true});
})

app.listen(PORT, () => {
    console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});

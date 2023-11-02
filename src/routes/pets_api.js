const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('../files');

const FILE_NAME = './db/pets.txt';

// Rutas de la API
// API
// Listar Mascotas
router.get('/', (req, res)=>{
    let pets = readFile(FILE_NAME);

    const {search} = req.query;
    if(search){
        pets = pets.filter(pet => pet.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json(pets);
})

//Crear Mascota
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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


module.exports = router;
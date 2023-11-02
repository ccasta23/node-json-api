const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('../files');

const FILE_NAME = './db/pets.txt';


//WEB
// Listar Mascotas
router.get('/', (req, res)=>{
    let pets = readFile(FILE_NAME);

    const {search} = req.query;

    if(search){
        pets = pets.filter(
            pet => pet.name.toLowerCase().includes(search.toLowerCase())
            );
    }

    res.render('pets/index', { pets: pets, search: search });
});

//Crear Mascota
router.get('/create', (req, res)=>{
    //Mostrar el formulario
    res.render('pets/create');
});

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
        res.redirect('/pets');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

//Eliminar una mascota
router.post('/delete/:id', (req, res) => {
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

module.exports = router;
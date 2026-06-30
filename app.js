const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'actividad_clases'
});

db.connect((error) => {
    if(error) {
        console.error('Error conectando a la base de datos', error);
    } else {
        console.log('¡Conexion exitosa a la base de datos!');
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/guardar-datos', (req, res) => {
    const { nombre, email, contrasena} = req.body;

    const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';

    db.query(query, [nombre, email, contrasena], (error, resultado) => {
        if(error) {
            console.error('Error al guardar en la BD:', error);
            return res.status(500).json({ error: 'Error interno del servidor'});
        }

        console.log('¡Dtos guardados! ID del usuario:', resultado.insertId);
        res.json({ mensaje: 'Dtos guardados exitosamente en la base de datos'});
    });
});

app.get('/cargar-ultimo', (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY id DESC LIMIT 1';

    db.query(query, (error, resultado) => {
        if(error) {
            console.error('Error al buscar en la bd:', error);
            return res.status(500).json({ error: 'Error al obtener los datos'});
        }

        if(resultado.length == 0) {
            return res.json({ mensaje: 'No hay usuarios guardados aun', datos: null});
        }

        res.json({ mensaje: 'Ultimo usuario encontrado', datos: resultado[0]});
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});


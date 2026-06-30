const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // Para hashear contraseñas

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


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
    res.sendFile(path.join(__dirname, '/public/views', 'index.html'));
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

app.post('/check-availability', (req, res) => {
    const { type, value } = req.body;
    let query = '';
    if (type === 'username') {
        query = 'SELECT * FROM usuarios WHERE nombre = ?';
    } else if (type === 'email') {
        query = 'SELECT * FROM usuarios WHERE email = ?';
    }
    db.query(query, [value], (err, results) => {
        if (err) throw err;
        res.json({ available: results.length === 0 });
    });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Usuario o correo electrónico ya existente' });
            }
            throw err;
        }
        res.json({ success: true });
    });
});

app.get("/ultimo", (req, res)=>{

        const sql = `SELECT * FROM usuarios ORDER BY id DESC LIMIT 1`;

        db.query(sql, (err, result) => {

            if(err) return res.status(500).json({ mensaje:"Error" });
            
            if (result.length === 0) {
                return res.json({ vacio: true });
            }
            
            res.json(result[0]);
        });
    });

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});




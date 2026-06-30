const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'actividad_clases'
});

db.connect(err => {
    if(error) {
        console.error('Error conectando a la base de datos', error);
        return;
    }
        console.log('¡Conexion exitosa a la base de datos!');
});

module.exports = db;
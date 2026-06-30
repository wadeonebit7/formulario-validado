const form = document.getElementById('miForm');

form.addEventListener('submit', function (evento) {
    evento.preventDefault()

    const Nombre = document.getElementById('Nombre').value;
    const Email = document.getElementById('Email').value;
    const Contra = document.getElementById('Contrasena').value;

    const errorNombre = document.getElementById('errorNombre');
    const errorEmail = document.getElementById('errorEmail');
    const errorContrasena = document.getElementById('errorContrasena');

    if (Nombre == '') {
        errorNombre.textContent = 'El campo nombre no puede estar vacio.';
    } else if (Nombre.length < 2) {
        errorNombre.textContent = 'Sabemos que tu nombre tiene más de una letra, ponlo bien Por favor.';
    } else if (Nombre.length > 30) {
        errorNombre.textContent = 'Creo que nadie tiene un nombre de más de 30 caracteres, corrigelo Por Favor.';
    } else {
        errorNombre.textContent = '';
    }

    if (Email == '') {
        errorEmail.textContent = 'El campo email no puede estar vacio.';
    } else if (!Email.includes('@') || !Email.includes('.')) {
        errorEmail.textContent = 'Por favor verifica el formato de el correo, algo@gmail.com';
    } else if (Email.includes(' ')) {
        errorEmail.textContent = 'Por favor verifica que no haya espacios';
    } else {
        errorEmail.textContent = '';
    }

    const simbolos = "!$%&/()=?¡¨*]Ñ¨[Ñ_:;:.,.Ñ[_]¨¨*";
    let tieneSimbolos = false;

    for (let simbolo of simbolos) {
        if (Contra.includes(simbolo)) {
            tieneSimbolos = true;
            break;
        }
    }

    if (Contra == '') {
        errorContrasena.textContent = 'La contraseña no puede estar vacia';
    } else if (Contra.length < 6) {
        errorContrasena.textContent = 'La contraseña debe tener al menos 6 caracteres';
    } else if (tieneSimbolos == false) {
        errorContrasena.textContent = 'La contraseña debe incluir al menos un simbolo especial';
    } else {
        errorContrasena.textContent = '';
    }

    if (errorNombre.textContent == '' && errorEmail.textContent == '' && errorContrasena.textContent == '') {

        const datosUsuario = {
            nombre: Nombre,
            email: Email,
            contrasena: Contra
        };

        fetch('/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        })
            .then(respuesta => respuesta.json())
            .then(datosRespuesta => {
                console.log('Servidor responde: ', datosRespuesta);
                alert('¡Formulario enviado con exito!');
                form.reset();
            })
            .catch(error => {
                console.error('Error al enviar: ', error);
                alert('Hubo un problema al enviar los datos.');
            })
    }
});

const btnCargar = document.getElementById('btnCargar');
const contenedorDatos = document.getElementById('contenedorDatos');

btnCargar.addEventListener('click', function () {

    fetch('/cargar-ultimo')
        .then(respuesta => respuesta.json())
        .then(info => {

            while (contenedorDatos.firstChild) {
                contenedorDatos.removeChild(contenedorDatos.firstChild);
            }

            if (info.datos) {

                const tarjeta = document.createElement('div');
                const titulo = document.createElement('h3');
                const textoEmail = document.createElement('p');

                titulo.textContent = `Nombre: ${info.datos.nombre}`;
                textoEmail.textContent = `Email: ${info.datos.email}`;

                tarjeta.style.border = '2px solid #333';
                tarjeta.style.padding = '15px';
                tarjeta.style.marginTop = '20px';
                tarjeta.style.borderRadius = '8px';
                tarjeta.style.backgroundColor = '#f9f9f9';
                tarjeta.style.color = '#000000';

                tarjeta.append(titulo, textoEmail);

                contenedorDatos.appendChild(tarjeta);
            } else {
                const mensajeVacio = document.createElement('p');
                mensajeVacio.textContent = info.mensaje;
                contenedorDatos.appendChild(mensajeVacio);
            }
        })
        .catch(error => {
            console.error('Error al traer los datos:', error);
            alert('Hubo un problema de conexion al buscar el ultimo registro.');
        });
});
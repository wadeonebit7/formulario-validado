

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formulario');

    const username = document.getElementById('username');
    const usernameError = document.getElementById('usernameError');

    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    const password = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');

    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');

    const btnCargar = document.getElementById("btnCargar");
    const ultimoRegistro = document.getElementById("ultimoRegistro");

    const validationRules = {
        username: /^[a-zA-Z0-9]{6,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    };




    function validateUsername() {
        const value = username.value;
        if (validationRules.username.test(value)) {
            username.classList.add('valid');
            username.classList.remove('invalid');
            checkAvailability(value, 'username');
        } else {
            username.classList.add('invalid');
            username.classList.remove('valid');
            usernameError.classList.add('error-message');
            usernameError.classList.remove('success-message');
            usernameError.textContent = 'El nombre de usuario debe tener al menos 6 caracteres y no contener caracteres especiales.';
            
        }
        checkFormValidity();
    }

    function validateEmail() {
        const value = email.value;
        if (validationRules.email.test(value)) {
            email.classList.add('valid');
            email.classList.remove('invalid');
            checkAvailability(value, 'email');
        } else {
            email.classList.add('invalid');
            email.classList.remove('valid');
            emailError.classList.add('error-message');
            emailError.classList.remove('success-message');
            emailError.textContent = 'La dirección de correo electrónico no es válida.';
        }
        checkFormValidity();
    }

    function validatePassword() {
        const value = password.value;
        if (validationRules.password.test(value)) {
            password.classList.add('valid');
            password.classList.remove('invalid');
            passwordError.textContent = '';
        } else {
            password.classList.add('invalid');
            password.classList.remove('valid');
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.';
        }
        checkFormValidity();
    }
    
    function checkAvailability(value, type) {
        fetch('http://localhost:3000/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, value })
        })
        .then(response => response.json())
        .then(data => {

            if (type === 'username') {
                usernameError.textContent = data.available ? 'Nombre de usuario disponible.' : 'Nombre de usuario no disponible.';
                if (data.available) {
                    username.classList.add('valid');
                    username.classList.remove('invalid');

                    usernameError.classList.add('success-message')
                    usernameError.classList.remove('error-message')
                } else {
                    username.classList.add('invalid');
                    username.classList.remove('valid');

                    usernameError.classList.add('error-message')
                    usernameError.classList.remove('success-message')
                }

            } else if (type === 'email') {
                emailError.textContent = data.available ? 'Correo electrónico disponible.' : 'Correo electrónico no disponible.';
                if (data.available) {
                    email.classList.add('valid');
                    email.classList.remove('invalid');

                    emailError.classList.add('success-message');
                    emailError.classList.remove('error-message');
                    
                } else {
                    email.classList.add('invalid');
                    email.classList.remove('valid');

                    emailError.classList.add('error-message');
                    emailError.classList.remove('success-message');
                }
            }
            checkFormValidity();
        })
        .catch(error => console.error('Error:', error));
    }

    function checkFormValidity() {
        const isFormValid = username.classList.contains('valid') &&
                            email.classList.contains('valid') &&
                            password.classList.contains('valid');
        submitButton.disabled = !isFormValid;
    }

    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);


    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
        // Validar los campos antes de enviar
        validateUsername();
        validateEmail();
        validatePassword();

        if (submitButton.disabled === false) {
            const respuesta = await fetch("/guardar",{
                method:"POST",
                headers:{ "Content-Type": "application/json" },
                body:JSON.stringify({
                    nombre: username.value,
                    email: email.value,
                    contrasena: password.value
                })
            });

            const dato = await respuesta.json(); // Respuesta del servidor

            alert(dato.mensaje); // Mostramos el mensaje como alerta
            
            if (dato.mensaje === "Guardado correctamente") {

                formulario.reset(); // Limpiamos los campos

                [username, email, password].forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                [usernameError, emailError, passwordError].forEach(status => {
                    status.textContent = '';
                    status.classList.remove('error-message', 'success-message');
                });

                submitButton.disabled = true;
            }
        }
    });

    btnCargar.addEventListener("click", async () => {
        const respuesta = await fetch("/ultimo");
        const dato = await respuesta.json();

        while( ultimoRegistro.firstChild){
            ultimoRegistro.removeChild(ultimoRegistro.firstChild);
        }

        if (!dato.datos) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.textContent = dato.mensaje;
            ultimoRegistro.appendChild(mensajeVacio);
        } else {
            const tarjeta = document.createElement('div');
            const titulo = document.createElement('h3');
            const textoEmail = document.createElement('p');

            tarjeta.style.border = '1px solid #333';
            tarjeta.style.padding = '20px';
            tarjeta.style.marginTop = '20px';
            tarjeta.style.borderRadius = '8px';
            tarjeta.style.backgroundColor = '#1a1a1e';
            tarjeta.style.color = '#ffffff';

            titulo.textContent = `Nombre: ${dato.datos.nombre}`;
            textoEmail.textContent = `Email: ${dato.datos.email}`;

            tarjeta.append(titulo, textoEmail);
            ultimoRegistro.appendChild(tarjeta);
        }
    });
});

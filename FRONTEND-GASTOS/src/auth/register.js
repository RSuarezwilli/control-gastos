import { apiFetch } from '../utils/api.js';

async function handRegister(event) {
    event.preventDefault();

    // Cambia 'registre' por 'register' (o como lo hayas puesto en el HTML)
const name = document.getElementById('registerName').value.trim();
const email = document.getElementById('registerEmail').value.trim();
const password = document.getElementById('registerPassword').value.trim();

    try {
        const response = await apiFetch('/auth/register', 'POST', { 
            name, 
            email, 
            password, });

            alert("Registro exitoso, ahora puedes iniciar sesión.");
            window.location.href = 'login.html';
    } catch (error) {
        alert(`Error al registro: ${error.message}`);
        console.log(error);
    }
}
 document.getElementById('registerForm').addEventListener('submit', handRegister);
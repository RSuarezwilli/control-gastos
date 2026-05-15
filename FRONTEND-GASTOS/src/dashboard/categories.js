import {apiFetch} from "../utils/api.js";
import {getToken} from "../utils/auth.js";

//Referencia a los elementos del DOM
const form = document.getElementById("categoryForm");
const inputName = document.getElementById("categoryName");
const inputId = document.getElementById("categoryId");
const btnSave = document.getElementById("saveCategory");
const btnUpdate = document.getElementById("updateCategory");
const btnCancel = document.getElementById("cancelUpdate");
const list = document.getElementById("categoryList")

//Función para cargar las categorías
async function loadCategories() {

  try {

    const token = getToken();
    const categories = await apiFetch("/categories/list", "GET", null, token);
    list.innerHTML = "";

    categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `

                <span>${category.name}</span>
                <button class="edit" >Editar</button>
`;

li.querySelector("button").addEventListener("click", () => {
    editCategory(category);
});
list.appendChild(li);
});

  } catch (error) {
console.error(error);
alert("No se pudieron cargar las categorias");
 }
}

//cargar las categorias cuando se haya  cargado el DOM
document.addEventListener("DOMContentLoaded", loadCategories);

//Función para agregar una nueva categoría
function editCategory(category) {
    inputId.value = category._id;
    inputName.value = category.name;
    btnSave.style.display = "none";
    btnUpdate.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
}
function cancelUpdate() {
    btnSave.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnCancel.style.display = "none";
    form.reset();
}
btnCancel.addEventListener("click", cancelUpdate);

async function saveCategory() {
    const name = inputName.value.trim();
    // Validar que el nombre no esté vacío con un if
    try {
        const token = getToken();
        await apiFetch("/categories/new", "POST", { name }, token);
        alert("Categoría guardada correctamente");
        form.reset();
        loadCategories();
    } catch (error) {
        alert("Error al guardar la categoría");
        console.error(error);
    }
}
btnSave.addEventListener("click", saveCategory);

async function updateCategory() {
    const id = inputId.value;
    const name = inputName.value.trim();
    if (!id || !name) {
        alert("Completa todos los campos");
        return;
    }
    try {
        const token = getToken();
        await apiFetch(`/categories/${id}`, "PUT", { name }, token);
        alert("Categoría actualizada correctamente");
        cancelUpdate();
        loadCategories();
    } catch (error) {
        console.error(error);
        alert("Error al actualizar la categoría");
    }
}
btnUpdate.addEventListener("click", updateCategory);
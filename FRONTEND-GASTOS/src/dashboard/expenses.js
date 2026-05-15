import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";

// Referencias a los objetos del DOM
const form = document.getElementById("expenseForm");
const inputTitle = document.getElementById("expenseTitle");
const inputAmount = document.getElementById("expenseAmount");
const selectCategory = document.getElementById("expenseCategory");
const inputId = document.getElementById("expenseId");
const inputDate = document.getElementById("expenseDate");
const expenseList = document.getElementById("expenseList");
const btnSave = document.getElementById("saveExpense");
const btnUpdate = document.getElementById("updateExpense");
const btnCancel = document.getElementById("cancelUpdate");

const token = getToken();

// 1. Cargar las categorías para el select
async function loadCategories() {
    try {
        const categories = await apiFetch("/categories/list", "GET", null, token);
        selectCategory.innerHTML = `<option value="">Seleccione una categoría</option>`;
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id; // Usamos _id de MongoDB
            option.textContent = category.name;
            selectCategory.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las categorias");
    }
}

// 2. LISTAR Gastos
async function loadExpenses() {
    try {
        const expenses = await apiFetch("/expenses/all", "GET", null, token);
        expenseList.innerHTML = ""; 

        expenses.forEach((expense) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${expense.title} - $${expense.amount} (${new Date(expense.date).toLocaleDateString()})</span>
                <div>
                    <button class="edit">Editar</button>
                    <button class="delete">Eliminar</button>
                </div>
            `;

            // Evento Editar
            li.querySelector(".edit").addEventListener("click", () => prepareEdit(expense));
            // Evento Eliminar
            li.querySelector(".delete").addEventListener("click", () => deleteExpense(expense._id));

            expenseList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}

// 3. GUARDAR un nuevo gasto
async function saveExpense() {
    const data = {
        title: inputTitle.value.trim(),
        amount: inputAmount.value.trim(),
        category: selectCategory.value,
        date: inputDate.value
    };

    if (!data.title || !data.amount || !data.category || !data.date) {
        alert("Por favor complete todos los campos");
        return;
    }

    try {
        await apiFetch("/expenses/new", "POST", data, token);
        alert("Gasto guardado correctamente");
        form.reset();
        loadExpenses(); 
    } catch (error) {
        alert("No se pudo guardar el gasto");
    }
}

// 4. PREPARAR Edición (Poner los datos en el formulario)
function prepareEdit(expense) {
    inputId.value = expense._id;
    inputTitle.value = expense.title;
    inputAmount.value = expense.amount;
    selectCategory.value = expense.category;
    inputDate.value = expense.date.split('T')[0]; // Ajuste para input type="date"

    btnSave.style.display = "none";
    btnUpdate.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
}

// 5. ACTUALIZAR Gasto
async function updateExpense() {
    const id = inputId.value;
    const data = {
        title: inputTitle.value,
        amount: inputAmount.value,
        category: selectCategory.value,
        date: inputDate.value
    };

    try {
        await apiFetch(`/expenses/${id}`, "PUT", data, token);
        alert("Gasto actualizado");
        cancelUpdate();
        loadExpenses();
    } catch (error) {
        alert("Error al actualizar");
    }
}

// 6. ELIMINAR Gasto
async function deleteExpense(id) {
    if (!confirm("¿Deseas eliminar este gasto?")) return;
    try {
        await apiFetch(`/expenses/${id}`, "DELETE", null, token);
        loadExpenses();
    } catch (error) {
        alert("Error al eliminar");
    }
}

// 7. CANCELAR Edición
function cancelUpdate() {
    form.reset();
    inputId.value = "";
    btnSave.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnCancel.style.display = "none";
}

// Eventos
btnSave.addEventListener("click", saveExpense);
btnUpdate.addEventListener("click", updateExpense);
btnCancel.addEventListener("click", cancelUpdate);

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadExpenses();
});
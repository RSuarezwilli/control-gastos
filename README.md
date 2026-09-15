# Control de Gastos

Aplicación full-stack para el control de gastos personales, con registro de
usuarios, autenticación con JWT, categorías personalizables y seguimiento de
gastos por categoría.

## Tecnologías

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**Frontend:** HTML, CSS, JavaScript (vanilla)

## Estructura del proyecto

```
control-gastos/
  BACKEND-GASTOS/     API REST (Node.js + Express + MongoDB)
  FRONTEND-GASTOS/    Interfaz de usuario (HTML/CSS/JS)
```

## Instalación

### Backend

```bash
cd BACKEND-GASTOS
npm install
```

Crea un archivo `.env` en `BACKEND-GASTOS` con las siguientes variables:

```
PORT=3000
MONGO_URI=tu_cadena_de_conexion_de_mongodb
JWT_SECRET=un_texto_secreto_largo_y_aleatorio
```

Inicia el servidor:

```bash
npm run dev
```

### Frontend

Abre los archivos `.html` de `FRONTEND-GASTOS` directamente en el navegador,
o sírvelos con una extensión como Live Server en VS Code.

## Endpoints principales

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/register | Registra un nuevo usuario |
| POST | /auth/login | Inicia sesión y devuelve un token JWT |

### Categorías (requieren autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /categories/new | Crea una nueva categoría |
| GET | /categories/list | Lista las categorías del usuario |
| PUT | /categories/:id | Actualiza una categoría |

### Gastos (requieren autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /expenses/new | Crea un nuevo gasto |
| GET | /expenses/all | Lista todos los gastos del usuario |
| PUT | /expenses/:id | Actualiza un gasto |
| DELETE | /expenses/:id | Elimina un gasto |
| GET | /expenses/category/:categoryId | Filtra gastos por categoría |

## Autenticación

Las rutas protegidas requieren un header `Authorization` con el token JWT
obtenido en el login:

```
Authorization: Bearer <token>
```

## Seguridad

- Contraseñas encriptadas con bcrypt
- Validación de email y longitud de contraseña con `validator`
- Cada usuario solo puede ver, editar o eliminar sus propios gastos y
  categorías (verificado por `user`/`User` en cada consulta)
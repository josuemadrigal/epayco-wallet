# 💳 ecoWallet – Sistema de Billetera Virtual (Prueba Técnica)

Sistema completo de **billetera virtual** desarrollado con **NestJS, React y MySQL** siguiendo una arquitectura modular de servicios.

---

## 🏗️ Arquitectura del Proyecto

El sistema está compuesto por 3 módulos principales:

1. **📦 wallet-db-service** (Puerto `3001`)  
   Servicio de acceso exclusivo a la base de datos, gestionado con Prisma.

2. **🌐 wallet-api-service** (Puerto `3000`)  
   API pública que actúa como puente entre el cliente y el servicio de base de datos.

3. **💻 wallet-client**  
   Cliente web desarrollado en **React + TypeScript + Tailwind CSS** para la interacción con los usuarios.

---

## 📋 Requisitos Previos

- [Node.js 18+](https://nodejs.org/)
- [MySQL 8+](https://dev.mysql.com/downloads/mysql/)
- npm o yarn

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/josuemadrigal/epayco-wallet.git
cd epayco-wallet
```

### 2. Crear la base de datos

Accede a MySQL y ejecuta:

```sql
CREATE DATABASE epayco_wallet;
```

### 3. Configurar **wallet-db-service**

```bash
cd apps/wallet-db-service
npm install
```

Crear el archivo `.env`:

```bash
echo 'DATABASE_URL="mysql://root:password@localhost:3306/epayco_wallet"' > .env
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Configurar **wallet-api-service**

```bash
cd ../wallet-api-service
npm install
```

Crear `.env`:

```bash
echo 'DB_SERVICE_URL=http://localhost:3001' > .env
```

### 5. Configurar **wallet-client**

```bash
cd ../wallet-client
npm install
```

Crear `.env`:

```bash
echo 'VITE_API_URL=http://localhost:3000/api' > .env
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **NestJS** – Framework para Node.js
- **Prisma ORM** – Gestión de base de datos
- **MySQL** – Base de datos relacional
- **TypeScript** – Lenguaje tipado
- **class-validator** – Validación de DTOs
- **axios** – Cliente HTTP
- **uuid** – Generación de identificadores únicos

### Frontend

- **React 18** – Biblioteca de UI
- **TypeScript** – Tipado estático
- **Vite** – Herramienta de compilación rápida
- **Tailwind CSS** – Framework CSS utilitario
- **Fetch API** – Peticiones HTTP nativas

---

## 📂 Estructura del Repositorio

```
epayco-wallet/
│
├── apps/
│   ├── wallet-db-service/     # Servicio de base de datos (Prisma + NestJS)
│   ├── wallet-api-service/    # API pública (NestJS)
│   └── wallet-client/         # Cliente web (React + Vite + Tailwind)
│
├── prisma/                    # Esquema y migraciones de base de datos
└── README.md                  # Documentación del proyecto
```

---

## 📌 Notas

- Asegúrate de tener MySQL corriendo en `localhost:3306`.
- Si usas otra contraseña/usuario de MySQL, ajusta el valor en el archivo `.env` del **wallet-db-service**.
- El cliente se conecta automáticamente al API configurado en su `.env`.

---

## ✨ Autor

👨‍💻 Desarrollado por **Josue Madrigal**  
📧 [Contacto](mailto:josuemadrigal12@gmail.com)

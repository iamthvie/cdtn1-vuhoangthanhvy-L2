# Mekong Mobile CRM - Deployment Guide

## 1. System Requirements
* **Docker Desktop** (version 24.0+ recommended)
* **Node.js** (v18+ for local testing if needed)
* **Git**

---

## 2. Quick Start & Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cdtn1-vuhoangthanhvy-L2
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and adjust if necessary:
   ```bash
   cp .env.example .env
   ```

3. **Launch with Docker Compose:**
   Run the following command to build and start both the application and PostgreSQL database containers in the background:
   ```bash
   docker compose up --build -d
   ```

---

## 3. Environment Variables Reference (`.env`)
| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_HOST` | Database host (Docker service name) | `db` |
| `DB_NAME` | Database name | `mekong_crm_l2` |
| `DB_PASSWORD` | PostgreSQL password | `1` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `PORT` | Application server port | `3000` |

---

## 4. Sample Data & Database Migration
* **Step 1 (Database Migration):** Run the following command in your terminal to initialize database tables inside the Docker container:
  ```bash
  Get-Content migrations/001_create_l2_tables.sql | docker exec -i cdtn1-vuhoangthanhvy-l2-db-1 psql -U postgres -d mekong_crm_l2
  ```
* **Step 2 (Import Sample Data):** Run the import script from the host machine to populate sample data into the database:
  ```bash
  node import_csv.js
  ```

---

## 5. Verification
* Open your browser and navigate to:
  `http://localhost:3000/index.html`
* Verify that customer lists, warranty tickets, and CRUD operations function seamlessly.
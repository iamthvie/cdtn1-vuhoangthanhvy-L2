# Deployment Guide - Mekong Mobile Smart CRM (Luồng L2)

## 1. Prerequisites

The following software is required:

- Node.js (v20+ recommended)
- PostgreSQL (v15+)
- Git

## 2. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=3000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/mekong_crm_l2
```

## 3. Database Initialization & Migration

Create the database in PostgreSQL:

```sql
CREATE DATABASE mekong_crm_l2;
```

Run the migration script to create core relational tables (customer, device, ticket, ticket_status_log):

```bash
psql -U postgres -d mekong_crm_l2 -f migrations/001_create_l2_tables.sql
```

## 4. Seeding Data (Idempotent CSV Import)

Run the automated script to read, clean, and insert the dataset into PostgreSQL with duplication prevention (`ON CONFLICT`):

```bash
node import_csv.js
```

## 5. Running the Application & Verification

### Start the server

```bash
npm run dev
```

### Run automated tests

```bash
npm test
```

### System Verification

1. Open your browser and navigate to http://localhost:3000.
2. Ensure the UI loads successfully and displays the initial connection status.
3. Enter the test serial number `35693803564380` and click **"Tra Cứu"**.
4. Verify that the system displays:
   - Device details
   - Owner name
   - Masked phone number (`076****885`)
   - Warranty status (`CON_BAO_HANH`)
   - Repair history table without errors

## 6. Security Checklist

The system implements the following 7 security measures:

1. **Environment Variable Security:** All sensitive database credentials and ports are stored in `.env` and excluded from version control via `.gitignore`.
2. **No Hardcoded Secrets:** The codebase contains no hardcoded API keys, passwords, or private tokens.
3. **Role-Based Access Control (RBAC):** Backend endpoints strictly validate user roles and center IDs to prevent cross-center data access (QT-14).
4. **Data Masking (Privacy):** Customer phone numbers are automatically masked in responses for standard staff roles (QT-15, e.g., `076****885`).
5. **Input Sanitization & Safe Casting:** Strict parameter parsing (`parseInt` with default fallbacks) prevents `NaN` errors and malformed SQL inputs.
6. **Idempotency Safeguards:** Database inserts utilize `Idempotency-Key` and `ON CONFLICT DO NOTHING` to prevent duplicate record creation during network retries.
7. **Public Repository Safety:** The repository is public for academic grading, with a clean commit history free of exposed secrets.
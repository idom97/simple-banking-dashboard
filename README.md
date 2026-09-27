# Banking Dashboard — Tutored Project

This project is a **banking dashboard connected to Plaid Sandbox**, a platform that provides generated banking data for testing purposes.

It was carried out by **Dominique ERIN** as part of the Algorithms and Data Structures course at **Université Paris 8**, and was graded by Professor **Philippe KISLIN-DUVAL**.

It allows the user to simulate a connection with fictitious data from a real French banking institution, retrieve demonstration accounts, display their balances, and calculate a financial summary.

The data used are entirely fictitious and come from the Plaid Sandbox testing environment. No real banking data are used.

---

## 1. Features currently available

The project currently allows the user to:

- launch a FastAPI API;
- start a MongoDB database with Docker Compose;
- open a fictitious banking connection with Plaid Link;
- exchange the `public_token` for an `access_token` on the backend;
- save the Plaid connection in MongoDB;
- retrieve fictitious accounts from Plaid Sandbox;
- display the number of accounts;
- calculate the total current balance;
- calculate the total available balance;
- display the accounts in a table;
- keep the Plaid connection after restarting the application, as long as the MongoDB volume is not deleted.

---

## 2. Technologies used

### Backend

- Python;
- FastAPI;
- MongoDB;
- PyMongo;
- Plaid Python SDK;
- Docker;
- Docker Compose.

### Frontend

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- `react-plaid-link`.

---

## 3. Requirements

Before installing the project, you need the following tools:

- Git;
- Python 3.12;
- Conda or another Python environment manager;
- Node.js and npm;
- Docker;
- Docker Compose;
- a Plaid Sandbox developer account;
- Visual Studio Code, recommended for reading and running the project.

---

## 4. Clone the repository

From a terminal, run:

```bash
git clone https://github.com/idom97/simple-banking-dashboard.git
```

Then move into the project directory:

```bash
cd simple-banking-dashboard
```

---

## 5. Install the Python requirements

The backend dependencies are listed in the `requirements.txt` file.

First, create a Conda environment with Python 3.12:

```bash
conda create -n dashboard_bancaire python=3.12
```

Then activate the environment:

```bash
conda activate dashboard_bancaire
```

Move to the backend directory:

```bash
cd backend
```

Install all the required Python packages:

```bash
pip install -r requirements.txt
```

You can check the installed packages with:

```bash
pip list
```

The `requirements.txt` file makes it easier to recreate the same Python environment on another computer without installing each dependency manually.

---

## 6. Configure the backend environment variables

The real file containing the secrets is not tracked by Git.

From the root directory of the project, copy the example file:

```bash
cp backend/.env.example backend/.env
```

Then complete the `backend/.env` file with your own MongoDB and Plaid Sandbox settings.

Example:

```env
MONGODB_URI=mongodb://USERNAME:PASSWORD@localhost:27017/
MONGO_DATABASE=dashboard_bancaire

PLAID_CLIENT_ID=YOUR_CLIENT_ID
PLAID_SECRET=YOUR_SANDBOX_SECRET
PLAID_ENV=sandbox
PLAID_COUNTRY_CODES=FR
PLAID_PRODUCTS=transactions
```

The `PLAID_CLIENT_ID` and `PLAID_SECRET` values are available in your Plaid developer account.

The `backend/.env` file contains sensitive information and must never be published in the GitHub repository.

---

## 7. Start MongoDB

From the root directory of the project, run:

```bash
docker compose up -d mongodb
```

Then check that the MongoDB container is running:

```bash
docker compose ps
```

You can also use:

```bash
docker ps
```

To stop MongoDB without deleting its data:

```bash
docker compose stop mongodb
```

To start it again later:

```bash
docker compose up -d mongodb
```

Do not use the following command if you want to keep the MongoDB volume:

```bash
docker compose down -v
```

The `-v` option removes volumes and may delete persistent MongoDB data.

---

## 8. Start the FastAPI backend

Move into the backend directory:

```bash
cd backend
```

Make sure the Conda environment is active:

```bash
conda activate dashboard_bancaire
```

Then start the API:

```bash
fastapi dev app/main.py
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

The interactive FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

The main available routes are:

```text
GET  /
GET  /health/database
POST /api/plaid/link-token
POST /api/plaid/exchange-public-token
GET  /api/plaid/accounts
```

---

## 9. Install and configure the frontend

Open a second terminal.

From the root directory of the project, move into the frontend directory:

```bash
cd frontend
```

Install the Node.js dependencies:

```bash
npm install
```

Then create the `frontend/.env.local` file:

```bash
nano .env.local
```

Add the following environment variable:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Save the file.

The `.env.local` file must not be published in the repository.

---

## 10. Start the frontend

From the `frontend` directory, run:

```bash
npm run dev
```

The application should be available at:

```text
http://localhost:3000
```

Open this address in a web browser to access the banking dashboard.

---

## 11. Test the Plaid Sandbox connection

On the dashboard home page, click:

```text
Connect a bank
```

Plaid Link opens and allows the user to simulate a connection with a banking institution.

Use the Plaid Sandbox test credentials:

```text
Username: user_good
Password: pass_good
```

When a verification code is requested, use:

```text
1234
```

These credentials give access to fictitious accounts provided by Plaid Sandbox.

After validation, the frontend sends the Plaid `public_token` to the FastAPI backend.

The backend exchanges this token for an `access_token` and stores the connection information in MongoDB.

---

## 12. Data persistence

The project stores the Plaid connection information in MongoDB.

The stored information includes:

- the Plaid `access_token`;
- the Plaid `item_id`;
- the institution identifier;
- the institution name;
- the information required to retrieve the connection.

The banking accounts and their balances are not permanently stored as static data in the dashboard.

They are retrieved again from Plaid Sandbox when the application requests the accounts.

The connection can remain available after:

- closing the browser;
- restarting the frontend;
- restarting the backend;
- stopping and restarting the MongoDB container.

This persistence remains available as long as the MongoDB volume containing the connection information is not deleted.

---

## 13. Technical checks

Before publishing or modifying the project, several checks can be performed.

### Backend syntax check

From the `backend` directory:

```bash
python -m py_compile \
  app/main.py \
  app/api/plaid.py \
  app/core/config.py \
  app/core/database.py \
  app/core/plaid_client.py
```

If the command does not display an error, the Python files pass the syntax check.

### TypeScript check

From the `frontend` directory:

```bash
npx tsc --noEmit
```

This command checks the TypeScript code without generating output files.

### Frontend build

Run:

```bash
npm run build
```

This command checks whether the Next.js application can be built correctly for production.

---

# Harcel

Harcel is a lightweight deployment platform that lets you publish static projects in seconds. It provides a modern React frontend and a Node.js/Express backend to support two deployment flows:

- **GitHub Deploy**: clone and deploy public repositories
- **Upload Deploy**: upload a static file and deploy instantly

## ✨ Features

- Deploy from **public GitHub repositories**
- Deploy via **direct file upload**
- Supports **HTML** and **React (Vite build)** project types
- Auto-generates a unique site ID and public URL
- Copy/open deployed URL from the UI
- Clean deployment progress experience in the frontend

## 🏗️ Project Structure

```text
harcel/
├── front/                 # React + Vite frontend
│   ├── src/App.jsx        # Main deployment UI
│   └── .env.example       # Frontend URL env vars
├── back/                  # Express backend
│   ├── server.js          # API entrypoint
│   ├── routes/deploy.js   # Deployment routes
│   ├── controllers/deployController.js
│   └── utils/builder.js   # clone/build/copy helpers
└── setup.sh               # Basic server setup helper
```

## ⚙️ Tech Stack

- **Frontend**: React, Vite, ESLint
- **Backend**: Node.js, Express, Multer, CORS, dotenv
- **Deployment Runtime**: Git + npm build pipeline + static site hosting directory

## 🚀 Quick Start

### 1) Clone and install dependencies

```bash
git clone https://github.com/haricharanbonam/harcel.git
cd harcel

cd back && npm install
cd ../front && npm install
```

### 2) Configure environment variables

Create environment files from examples:

```bash
cp back/.env.example back/.env
cp front/.env.example front/.env
```

Recommended values:

- `back/.env`
  - `PORT=3000`
  - `SITES_DIR=/var/www/sites`
  - `BASE_URL=http://localhost:3000`
- `front/.env`
  - `VITE_BACKEND_URL=http://localhost:3000`
  - `VITE_DEPLOYMENT_DOMAIN_SUFFIX=.haricharanbonam.tech`
  - `VITE_DEPLOYMENT_URL_PROTOCOL=http`

### 3) Run the app

Backend:

```bash
cd back
npm run dev
```

Frontend:

```bash
cd front
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3000/health`

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

- `GET /health` → backend status
- `POST /deploy/file` → deploy uploaded file (form-data key: `site`)
- `POST /deploy/github` → deploy from GitHub repository
  - Body fields: `repoUrl`, `type` (`html` or `react`)

## 🧪 Available Scripts

### Frontend (`front/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

### Backend (`back/package.json`)

- `npm run start`
- `npm run dev`

## 📸 Deployment Walkthrough

### 1) Select project type (HTML/React)
![Select project type](https://github.com/user-attachments/assets/0ff62165-cccd-40ee-855a-14e305026ba2)

### 2) Deployment in progress (clone/build)
![Deployment in progress](https://github.com/user-attachments/assets/7ec9e8c8-f89b-42e9-900b-8ee2dd08c4d1)

### 3) Deployment successful and URL generated
![Deployment successful](https://github.com/user-attachments/assets/3da162f6-d206-4ca7-bcea-a5b23173b4c4)

### 4) Open deployed website
![Open deployed website](https://github.com/user-attachments/assets/545b1606-b28d-48f1-a37a-32a9824251ef)

## 📝 Notes

- GitHub deployment currently accepts **public GitHub URLs**.
- React deployment runs a build and serves the generated `dist` output.
- For production usage, configure NGINX/static serving to map deployed site folders correctly.

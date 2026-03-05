# SignatureSense

SignatureSense is a **full-stack signature verification system** that combines a **modern React (Vite) frontend**, a **Node.js + Express backend**, **MongoDB as the primary database**, and a **Flask-based machine learning service** for signature similarity verification.

---

## 📁 Project Structure

```
SignatureSense/
│
├── frontend/                              # React + Vite frontend
│   │
│   ├── public/                            # Static assets
│   │
│   ├── src/
│   │   ├── components/                    # React UI components
│   │   ├── hooks/                         # Custom React hooks
│   │   ├── services/                      # API service layer (Axios)
│   │   ├── constants/                     # App-wide constants
│   │   ├── css/                           # Stylesheets
│   │   ├── App.js                         # Main app component & routing
│   │   └── main.jsx                       # Application entry point
│   │
│   ├── index.html                         # HTML template
│   ├── vite.config.js                     # Vite configuration
│   ├── package.json                       # Frontend dependencies & scripts
│   └── .env                               # Frontend environment variables
│
├── backend/                               # Backend + ML service
│   │
│   ├── config/
│   │   └── database.js                    # MongoDB connection configuration
│   │
│   ├── models/
│   │   ├── User.js                        # User schema (bcrypt hashing)
│   │   └── Session.js                     # Session schema (MongoDB TTL)
│   │
│   ├── routes/                            # Express API routes
│   │   ├── auth.routes.js                 # Login / Signup / Logout APIs
│   │   ├── profile.routes.js              # User profile APIs
│   │   └── verify.routes.js               # Signature verification APIs
│   │
│   ├── uploads/                           # Uploaded signature images
│   │
│   ├── sv-venv/                           # Python virtual environment (local only)
│   │
│   ├── model_weights33.h5                 # Trained ML model weights (local only)
│   ├── model_predict.py                   # Flask ML inference service
│   ├── requirements.txt                   # Python dependencies
│   │
│   ├── app.js                             # Express app configuration
│   ├── server.js                          # Node.js server entry point
│   ├── start-flask.sh                     # Flask startup script (macOS/Linux)
│   ├── start-flask.bat                    # Flask startup script (Windows)
│   ├── start-all.sh                       # Start Node.js + Flask together
│   ├── package.json                       # Backend dependencies & scripts
│   └── .env                               # Backend environment variables
│
├── .gitignore                             # Git ignore rules
└── README.md                              # Project documentation
```

---

## 🚀 How to Run the Application

### Prerequisites

* Node.js (v18+)
* Python 3.9+
* MongoDB (local or cloud)
* npm and pip

---

### 1️⃣ Start the Machine Learning Service (Flask) — **Required**

```bash
cd backend
python -m venv sv-venv
source sv-venv/bin/activate      # macOS / Linux
sv-venv\Scripts\activate         # Windows

pip install -r requirements.txt
python model_predict.py
```

**Must be running** for verification to work.

---

### 2️⃣ Start the Backend Server (Node.js)

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Start the Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Access the app at **http://localhost:5173**

---

## 🗄️ Database

Uses **MongoDB** to store user accounts, session data (with TTL-based expiration), and signature metadata.

---

## ⚙️ Environment Configuration

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend:** `MONGODB_URI`, `PORT=5051`, `NODE_ENV`, `FLASK_API_URL=http://localhost:7777`

**Frontend:** `VITE_API_BASE_URL=http://localhost:5051`, `VITE_APP_NAME=SignatureSense`

---

## 🧠 Machine Learning Service

* **Framework:** TensorFlow / Keras
* **Model File:** `model_weights33.h5`
* **Service:** `model_predict.py`
* **Purpose:** Signature similarity verification

⚠️ If you get `ECONNREFUSED`, the Flask server is not running.

---

## 🔐 Backend Features

* MongoDB integration
* bcrypt password hashing
* MongoDB session storage with TTL (24 hours)
* Multer file uploads
* RESTful API design
* Centralized error handling

---

## 📡 API Endpoints

### Authentication

* `POST /signup-form`
* `POST /login-account`
* `POST /logout`

### User

* `POST /profile`

### Verification

* `POST /verify`

---

## 🖥️ Frontend Features

* React 18 + Vite
* React Router v7
* Axios API abstraction
* Bootstrap UI
* Lazy loading and optimized builds
* Custom hooks (`useAuth`, `useVerification`, etc.)

---

## 🔄 Application Workflow

1. User signs up and uploads a reference signature
2. User logs in and receives a session ID
3. User uploads a signature for verification
4. Backend forwards image to Flask ML service
5. ML model computes similarity score
6. Result is returned and displayed in the UI

---

## 🔐 Security

* Password hashing with bcrypt
* Secure session handling with MongoDB TTL
* Input validation
* Controlled error responses

---

## 🧪 Testing

```bash
# Test MongoDB connection
node -e "require('./config/database')()"

# Health check
curl http://localhost:5051/health
```

---

## 🐛 Troubleshooting

**MongoDB not running:** Check with `mongosh --eval "db.adminCommand('ping')"`

**Port conflicts:** Check if ports 5051, 5173, or 7777 are already in use

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
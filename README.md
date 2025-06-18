# 📸 AI Image Analyzer

A full-stack AI-powered image analyzer built using **React**, **Node.js**, **TypeScript**, **MongoDB**, and the **LLaVA Vision 3.2 model** via **Ollama**. Users can upload images and get AI-generated descriptions.

---

## 🔧 Setup Instructions

### 1. ⚙️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- [Ollama](https://ollama.com/) (to run the LLaVA Vision model locally)

### 2. 📁 Clone the Repository

```bash
git clone https://github.com/your-username/ai-image-analyser.git
cd ai-image-analyser
```

### 3. 💪 Backend Setup (Node.js + Express)

```bash
cd ai_image_analysis_backend
npm install
```

#### ➕ Create a `.env` file

Inside `ai_image_analysis_backend`, create a `.env` file:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
```

> Replace `your_mongodb_connection_string` with your MongoDB Atlas URI or local MongoDB URI.

#### ▶️ Run Backend Server

```bash
npm start
```

Backend will run at: `http://localhost:5050`

### 4. 🌐 Frontend Setup (React + Vite)

```bash
cd ../ai_image_analyser
npm install
npm run dev
```

Frontend will run at: `http://localhost:8080`

### 5. 🧠 Start Ollama (LLaVA Model)

Install and run the LLaVA model via Ollama:

```bash
ollama pull llava
ollama run llava
```

> Keep this terminal running to allow the backend to query the model.

---

## 📄 Documentation

### 💡 Features

- Upload JPEG or PNG images (max 5MB)
- AI-generated description using LLaVA Vision 3.2
- Images and results saved in MongoDB
- Visual card layout of analyzed images
- Delete analyzed images
- Real-time upload validation
- Responsive UI and mobile-friendly

### ⚙️ Project Structure

```
ai-image-analyser/
|
├── ai_image_analyser/              # Frontend (React)
├── ai_image_analysis_backend/      # Backend (Node.js + Express)
│   ├── routes/
│   ├── uploads/                    # Stores uploaded images
│   ├── middleware/
│   └── index.ts
├── .env
└── README.md
```

### 🔌 API Endpoints

#### ➕ POST `/upload`

- Upload and analyze image
- Body: `multipart/form-data` with image
- Returns: fileName, description, status, etc.

#### 🗑 DELETE `/delete/:id`

- Deletes the image and MongoDB entry

### 🧠 AI Model: LLaVA Vision 3.2

- Powered by Ollama
- Local execution via `ollama run llava`
- Processes image and returns description in JSON

#### ⟳ Backend Flow:

1. Image uploaded via POST
2. Stored locally
3. Sent to `http://localhost:11434/api/generate`
4. AI responds with description
5. Saved to MongoDB and returned to client

---

## 🎥 Demo Video

> Please refer to the [Demo Video Link Here](#) for a walkthrough of:
>
> - Uploading an image
> - Running the LLaVA model
> - Viewing results
> - Code structure and explanation

---

## ✅ AI Tool Usage

See `AI_USAGE.md` for complete details on how Ollama and LLaVA were integrated for vision analysis.


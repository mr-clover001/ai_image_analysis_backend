# 🧠 AI_USAGE.md

## Overview

This application uses the **LLaVA Vision 3.2** model via **[Ollama](https://ollama.com/)** to generate AI-based descriptions of uploaded images. The LLaVA model is run entirely **locally**, ensuring data privacy and no dependence on external APIs.

---

## 🔧 Ollama Setup Instructions

### Step 1: Install Ollama Desktop

Download and install Ollama for your operating system:  
👉 https://ollama.com/download

### Step 2: Pull and Run LLaVA Model

Once installed, open your terminal and run:

```bash
ollama pull llava
ollama run llava
```

    •	The pull command downloads the required LLaVA resources.
    •	The run command launches the model locally on http://localhost:11434.

Keep this terminal running while the app is in use.

🧠 AI API Usage (Backend Code)

When an image is uploaded, the backend: 1. Converts the image to base64 2. Sends it to LLaVA via:

const llamaResponse = await axios.post(
"http://localhost:11434/api/generate",
{
model: "llava",
prompt: "Describe the content of this image in one sentence.",
images: [base64Image],
stream: false,
}
);

Request Breakdown:
• model: "llava" — model identifier
• prompt: Instruction for the AI
• images: An array of base64-encoded images
• stream: Set to false for a single full response

Example Response:
{
"response": "A cat sitting on a windowsill with sunlight streaming in."
}

This response is stored in MongoDB along with the uploaded image’s metadata.

⸻

✅ Notes
• Ollama must be running on localhost:11434
• Restart the LLaVA model if backend errors occur
• Ensure firewall or antivirus isn’t blocking port 11434

video link:
https://www.youtube.com/watch?v=UtSSMs6ObqY

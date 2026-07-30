# AI Job Tracker CRM

A modern, full-stack CRM built to help you track job applications and cold emails effortlessly. Instead of manually typing out job details, you can simply upload screenshots of job postings or application portals, and the system uses AI to extract all the relevant details automatically.

---

## 🧠 Core Technologies & Architecture
- **Frontend:** React + Vite + TailwindCSS + Zustand
- **Backend:** Node.js + Express
- **Database:** SQLite (managed via Prisma, easily switchable to PostgreSQL)
- **AI Extraction:** Tesseract.js (Local OCR) + Groq AI (Llama 3)

---

## 🔍 How the AI Extraction Works (OCR + Groq)

When you upload a job application screenshot, the system uses a two-step process to perfectly extract the data:

### 1. What is OCR? (Optical Character Recognition)
OCR is a technology that looks at an image and reads the text inside it, just like a human would read a book. 
In this project, we use **Tesseract.js**, which is an open-source OCR engine that runs entirely locally.
- **Why we need it:** We cannot send large raw images directly to text-based AI models quickly and for free. OCR first converts the pixels of text in your screenshot into an actual raw text string.
- **The Problem:** The text extracted by OCR from screenshots is often very messy, unformatted, and contains garbage characters.

### 2. The Groq AI Cleaning Phase
To fix the messy text produced by OCR, we send it to **Groq's `llama-3.3-70b-versatile` AI model**.
- Groq AI is an extremely fast and powerful Large Language Model (LLM).
- It looks at the messy OCR text, understands the context, and neatly extracts the exact **Company Name**, **Job Role**, **Date**, **Platform**, and **Location**.
- It returns this formatted data perfectly as JSON, which is then saved directly into your database.

By combining local OCR with Groq AI, the app extracts data incredibly fast, remains completely free, and avoids the quota limitations of image-based Vision models (like Gemini)!

---

## 🚀 Features
- **Smart Bulk Upload:** Drag and drop up to 50 screenshots. AI handles the rest.
- **Cold Email Tracking:** Dedicated section to track recruiter outreach and follow-ups.
- **Analytics Dashboard:** Visual charts and KPI cards to track your progress over time.
- **Data Table:** Search, filter, edit, and export your application data to CSV.

## 🛠️ How to Run Locally

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run start
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

Access the dashboard at `http://localhost:3000`.

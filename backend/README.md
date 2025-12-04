AI HEALTH ASSISTANT – BACKEND (TEXT README)

DESCRIPTION:
This backend project provides a smart medical intake system that uses AI and rule-based logic to help collect patient symptoms, generate a dynamic personal details form, produce a medical summary, and recommend the right doctor department. It uses:

Node.js + Express

Redis for session state

MongoDB for patient and appointment storage

Gemini AI for dynamic form and summary

FEATURES:

AI + Rule-based symptom chatbot

Automatically decides which personal fields to ask (safe whitelist)

Stores chat progress in Redis per session

Generates medical summary using AI

Provides recommended doctor/department

Saves patient data and appointment in MongoDB

SAFE PERSONAL DATA APPROACH (OPTION A):
AI can only ask from the following personal fields:

name

age

gender

city

chronic_conditions

allergies

emergency_contact

AI cannot ask: phone, address, Aadhaar, email, etc.

ARCHITECTURE FLOW:
User sends chat message →
Redis state machine interprets progress →
Rule-based symptom questions →
AI chooses allowed personal fields →
Backend sends dynamic form →
User submits form →
System generates summary + appointment →
MongoDB stores patient + appointment.

PROJECT STRUCTURE:

backend/
package.json
.env
src/
app.js
config/
db.js
redis.js
routes/
chat.routes.js
controller/
chat.controller.js
agents/
symptom.agent.js
summary.agent.js
appointment.agent.js
utils/
ai.js
state.js
validation.js
models/
patient.model.js
appointment.model.js
middleware/
session.middleware.js

PREREQUISITES:
Install:

Node.js (version 16 or newer)

Redis (local or via Docker)

MongoDB (local or Atlas Cloud)

Gemini API Key

INSTALLATION:

Clone:
git clone <your-repo>
cd backend

Install dependencies:
npm install

Create .env file:
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ai_health
REDIS_URL=redis://localhost:6379
SESSION_TTL_SECONDS=86400
GEMINI_API_KEY=YOUR_KEY_HERE
GEMINI_MODEL=gemini-2.0-flash

Run backend:
npm run dev

When it starts correctly, expected messages:
Server running on port 5000
MongoDB Connected
Redis Connected

TESTING API:

Endpoint:
POST http://localhost:5000/api/chat

Example Request (user with fever):
{"message":"I have fever"}

Next request must include sessionId (received in first response):
{"sessionId":"XXXX","message":"1-3 days"}

Form submission (AI-generated):
{"sessionId":"XXXX","message":{"name":"Ravi","age":25,"gender":"Male"}}

DATA SAVED IN MONGODB:

Patient data (symptoms + personal details + summary + risk)

Appointment recommendation (doctor + department + date + time)

SAFETY NOTES:

AI cannot collect private data except allowed fields

Symptom detection logic is rule-based to avoid hallucinations

AI is used for summary and choosing personal fields only
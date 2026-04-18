# 6:10 Assistant - Operations Intelligence Platform

**"Separating Noise from Genuine Threats Before the 8:00 AM Review."**

## 🚀 Overview
The **6:10 Assistant** is an AI-first tactical investigation platform designed for industrial facility operations. It bridges the gap between raw overnight sensor signals (fence alerts, badge failures, vehicle detections) and trusted morning decisions, helping Operations Leads uncover the truth faster.

## 🧠 The Problem
Industrial facilities operate 24/7, generating a flood of signals overnight. By 6:10 AM, the operations team has less than two hours to analyze these signals, differentiate between noise and genuine threats, and prepare a leadership-ready briefing for the 8:00 AM site review.

## ✨ Key Features
*   **Morning Investigation Workspace:** A high-performance dashboard featuring a prioritized findings queue, interactive spatial map, and evidence timeline.
*   **AI-First Investigation Workflow:** Automatically correlates raw data into evidence-backed hypotheses, open questions, and recommended next actions.
*   **Agentic Tool Usage:** Dynamic investigation agents that invoke digital tools (MCP-style) to refine confidence and resolve ambiguity.
*   **Drone Mission Simulation:** Proposes and visualizes lightweight drone follow-up missions to resolve high-uncertainty events.
*   **Human-in-the-Loop Governance:** A robust review layer allowing operators to approve, reject, or refine AI-generated findings before publication.
*   **Automated Briefing Generation:** Produces traceable, leadership-ready summaries grounded in human-approved evidence.

## 🛠️ Technical Stack
*   **Frontend:** React (Vite), TypeScript, Custom Tactical UI ("Font-Machine" aesthetic).
*   **Backend:** Fastify (Node.js), TypeScript.
*   **State Management:** React Hooks & Context.
*   **Testing:** Vitest.
*   **API:** Event-driven repository pattern with optional PostgreSQL event sourcing.

## 🏃 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abi11-11/6-10-assistant.git
   cd 6-10-assistant
   ```

2. Install dependencies for both UI and API:
   ```bash
   # Install UI dependencies
   cd 6-10-assistant-ui
   npm install

   # Install API dependencies
   cd ../6-10-assistant-api
   npm install
   ```

3. Run the application:
   ```bash
   # Start the API server (Port 3000)
   cd 6-10-assistant-api
   npm run dev

   # Start the UI dev server (Port 5173/5174)
   cd ../6-10-assistant-ui
   npm run dev
   ```

## 📂 Project Structure
*   `6-10-assistant-ui/`: React frontend application.
*   `6-10-assistant-api/`: Fastify backend service.
*   `6-10_prd.txt`: The original Product Requirements Document.

## ⚖️ License
MIT License - Copyright (c) 2026

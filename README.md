# 🍕 Pizzaria dos Rocha - Web Delivery System

A complete full-stack web delivery system designed for pizzerias, featuring a dynamic product catalog, real-time shopping cart management, and a robust database integration for persistent order tracking.

---

## 🛠️ Tech Stack

### **Frontend**
* **HTML5 & CSS3** (Semantic structure and responsive styling)
* **Tailwind CSS** (Utility-first styling injected via CDN)
* **JavaScript (ES6+)** (Asynchronous DOM manipulation, Fetch API, and cart state logic)
* **Netlify** (Production-ready static hosting and seamless deployment)

### **Backend & Database**
* **Node.js & Express** (RESTful API architecture)
* **Nodemon** (Automated hot-reloading for a productive development workflow)
* **CORS** (Cross-Origin Resource Sharing management for external requests)
* **MySQL** (Relational database for secure data persistence of products and orders)
* **Ngrok** (Secure HTTP tunneling for external global testing on a local machine)

---

## 📐 Project Architecture

The system is built decoupling the frontend from the backend (**Client-Server Architecture**). The frontend communicates asynchronously with the API endpoints, allowing for isolated scalability.

```text
 📱 User Mobile/Browser (Netlify) 
                │
                ▼ (HTTPS Requests)
       🌐 Ngrok Secure Tunnel
                │
                ▼ (Localhost:3000)
   🚀 Backend Node.js/Express ──▶ 🛢️ MySQL Database

⚡ How to Run Locally
1. Prerequisites
Ensure you have the following tools installed:

Node.js

MySQL Server

Ngrok (Optional: only needed for external device testing)

2. Database Setup
Create a MySQL database and execute the initialization queries found inside your schema.sql file (or use the structure below):

CREATE DATABASE rocha_pizzeria;
USE rocha_pizzeria;

-- Your product and order table structures go here

3. Spinning Up the Backend
Navigate to the server directory, install dependencies, and start the development environment:

Bash
cd backend
npm install
npm run dev
The local API server will boot up and listen on port 3000.

4. Running the Frontend
Since the frontend consists of static assets, you can open frontend/index.html directly in your web browser, or launch it utilizing the Live Server extension inside VS Code.

🌐 Live Deploy & Remote Testing
Live Frontend: Hosted on Netlify

Remote Testing Environment: Tunneled via Ngrok to route real-time HTTP traffic directly from external devices (such as smartphones connected to 4G/5G mobile networks) straight into the local development MySQL database.

Built with 🍕 by Erick Vinicius


---

### 🎨 The Finishing Touch (Commit & Push)

Once you save the file, replace `your-github-username` at the bottom with your actual GitHub username. Then, push it to your repository with a clean commit message:

```bash
git add README.md
git commit -m "docs: write comprehensive README in English with architecture and deployment data"
git push

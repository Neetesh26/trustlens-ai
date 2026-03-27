# 🔐 TrustLens AI

## 🚀 Overview

**TrustLens AI** is a full-stack security-focused web application that analyzes website trustworthiness using AI and cybersecurity techniques. It helps users detect malicious links, trackers, and potential threats in real time.

Built with the MERN stack, TrustLens AI integrates intelligent analysis, secure authentication, and modern UI to provide a powerful and user-friendly platform for safer browsing.

---

## ✨ Features

* 🔍 AI-powered website trust analysis
* 🛡️ Real-time threat detection (phishing, malicious links)
* 🍪 Tracker and cookie detection
* 🔐 Secure authentication (JWT, rate limiting, anti-brute-force)
* 📊 User-friendly dashboard with insights
* ⚡ Scalable backend architecture
* 🌐 RESTful APIs for analysis and reporting

---

## 🧠 Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Security & AI

* JWT Authentication
* Rate Limiting
* OWASP Best Practices
* AI-based threat analysis

---

## 🏗️ Project Structure

```
/client   → Frontend (React)
/server   → Backend (Node + Express)
/models   → Database schemas
/routes   → API routes
/middleware → Security & auth logic
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Neetesh26/trustlens-ai.git
cd trustlens-ai
```

### 2. Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the server folder:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run the Application

```bash
# Run backend
cd server
npm run dev

# Run frontend
cd client
npm start
```

---

## 🔐 Security Features

* Input validation & sanitization
* Rate limiting to prevent brute-force attacks
* Secure password hashing
* Protected routes using JWT

---

## 📈 Future Enhancements

* 🔎 Browser extension integration
* 🤖 Advanced AI threat scoring
* 🌍 Real-time global threat intelligence
* 📱 Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌟 Show Your Support

If you like this project, give it a ⭐ on GitHub and share it with others!

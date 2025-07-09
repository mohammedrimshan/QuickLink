🔗 ShortLink — URL Shortener & Analytics Platform
Tech Stack: Node.js · Express · React · TypeScript · MongoDB · TailwindCSS

ShortLink is a full-stack web application that enables users to shorten long URLs and track their analytics in real-time. With secure JWT-based authentication, personalized dashboards, and insightful charts, ShortLink helps users manage and monitor links effortlessly.

🌐 Live Deployment
Frontend: https://shortlink.razzz.site

Backend API: https://shortlink-api.razzz.site

✨ Features
🔐 Secure Authentication with JWT

✂️ Custom URL shortening

📊 Real-time analytics dashboard (clicks, devices, OS, etc.)

🧾 Detailed link insights (location, browser, platform)

🗂️ User-friendly dashboard for managing links

📱 Responsive design across all devices

🧰 Tech Stack
Frontend
Framework: React with TypeScript

UI: TailwindCSS + ShadCN + Framer Motion

Forms: React Hook Form + Zod

Charts: Recharts (Bar, Line, Pie)

State Management: React Query

Routing: React Router v6

Backend
Runtime: Node.js

Framework: Express.js

Language: TypeScript

Database: MongoDB + Mongoose

Authentication: JWT (Access & Refresh Tokens)

Validation: express-validator

Security: Helmet, CORS, Rate Limiting

Analytics: Mongo Aggregation, GeoIP

File Structure: Clean Architecture (Controllers, UseCases, Services, Repos)

⚙️ DevOps & Deployment
Server: Ubuntu (Nginx + PM2)

Process Manager: PM2

Reverse Proxy: NGINX

SSL: Let’s Encrypt with Certbot

CI/CD (Optional): GitHub Actions

📁 Directory Structure
bash
Copy
Edit
shortlink/
├── api/                 # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── usecases/
│   │   ├── services/
│   │   ├── models/
│   │   └── routes/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
├── .gitignore
└── README.md
🚀 Installation & Setup
Prerequisites
Node.js v18+

npm or yarn

MongoDB (local or Atlas)

📦 Backend Setup
bash
Copy
Edit
cd api
npm install
Create .env:

env
Copy
Edit
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token
CORS_ALLOWED_ORIGIN=http://localhost:5173
DOMAIN_URL=http://localhost:5173
Start the dev server:

bash
Copy
Edit
npm run dev
🖥️ Frontend Setup
bash
Copy
Edit
cd client
npm install
Create .env:

env
Copy
Edit
VITE_API_AUTH_URL=http://localhost:5000/api/auth
VITE_API_PVT_URL=http://localhost:5000/api/pvt
Start the dev server:

bash
Copy
Edit
npm run dev
Open your browser:
http://localhost:5173

🧑‍💻 Development Guidelines
Use ESLint & Prettier for clean code

Follow Clean Architecture principles

Use Zod for client-side validation

Commit messages using Conventional Commits

Optional: Document APIs using JSDoc or Swagger

🤝 Contributing
We welcome contributions!

bash
Copy
Edit
# 1. Fork the repository
# 2. Create a new branch
git checkout -b feature/amazing-feature

# 3. Make changes, then commit
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Create a Pull Request 🎉
📧 Contact
Project Maintainer: Mohammed Rimshan
Email: rimshan@example.com

🛠 Built with passion and precision.
Secure • Scalable • Insightful

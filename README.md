<div align="center">

# 🔗 QuickLink

### URL Shortener & Analytics Platform

*Secure • Scalable • Insightful*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://quicklink.rimshan.site)
[![API Status](https://img.shields.io/badge/🚀_API-Online-green?style=for-the-badge)](https://quicklink-api.rimshan.site)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=for-the-badge)](#)

</div>



## 🎯 About The Project

**QuickLink** is a full-stack web application that enables users to shorten long URLs and track their analytics in real-time. With secure JWT-based authentication, personalized dashboards, and insightful charts, QuickLink helps users manage and monitor links effortlessly.

### 🌟 Key Highlights

- **🔐 Secure Authentication** - JWT-based auth with refresh tokens
- **📊 Real-time Analytics** - Track clicks, devices, locations, and more
- **🎨 Modern UI/UX** - Built with TailwindCSS and Framer Motion
- **📱 Fully Responsive** - Works seamlessly across all devices
- **⚡ High Performance** - Optimized for speed and scalability

---

## ✨ Features

<table>
  <tr>
    <td width="25%">
      <h3>🔐 <strong>Authentication & Security</strong></h3>
      <ul>
        <li>JWT-based authentication</li>
        <li>Secure password hashing</li>
        <li>Rate limiting protection</li>
        <li>CORS & Helmet security</li>
      </ul>
    </td>
    <td width="25%">
      <h3>📊 <strong>Analytics Dashboard</strong></h3>
      <ul>
        <li>Real-time click tracking</li>
        <li>Device & OS analytics</li>
        <li>Geographic insights</li>
        <li>Browser statistics</li>
      </ul>
    </td>
    <td width="25%">
      <h3>✂️ <strong>URL Management</strong></h3>
      <ul>
        <li>Custom short URL creation</li>
        <li>Bulk URL operations</li>
        <li>Link expiration settings</li>
        <li>QR code generation</li>
      </ul>
    </td>
    <td width="25%">
      <h3>🎨 <strong>User Experience</strong></h3>
      <ul>
        <li>Intuitive dashboard</li>
        <li>Interactive charts</li>
        <li>Dark/Light mode</li>
        <li>Mobile-first design</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

</div>

<details>
<summary><b>📋 Detailed Tech Stack</b></summary>

#### Frontend Technologies
- **Framework:** React 18 with TypeScript
- **Styling:** TailwindCSS + ShadCN UI + Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (Bar, Line, Pie charts)
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Build Tool:** Vite

#### Backend Technologies
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access & Refresh Tokens)
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting
- **Analytics:** MongoDB Aggregation Pipeline
- **Architecture:** Clean Architecture Pattern

#### DevOps & Deployment
- **Server:** Ubuntu with Nginx + PM2
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt with Certbot
- **CI/CD:** GitHub Actions (Optional)

</details>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammedrimshan/QuickLink.git
   cd QuickLink


2. **Backend Setup**
   ```bash
   cd api
   npm install
 

Create **.env** file in the **api** directory:

       PORT=5000
       NODE_ENV=development
       MONGO_URI=your_mongodb_connection_string
       ACCESS_TOKEN_SECRET=your_super_secret_access_token
       REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
       CORS_ALLOWED_ORIGIN=http://localhost:5173
       DOMAIN_URL=http://localhost:5173


Start the backend server:
  
      npm run dev

3. **Frontend Setup**
   ```bash
      cd ../client
      npm install
  

Create **.env** file in the **client** tdirectory:
  
     VITE_API_AUTH_URL=http://localhost:5000/api/auth
     VITE_API_PVT_URL=http://localhost:5000/api/pvt


Start the frontend development server:

    npm run dev

4. **Access the Application**
   
   Open your browser and navigate to: **http://localhost:5173**

---

## 📁 Project Structure

    
    QuickLink/
    ├── 📁 api/                    # Express.js Backend
    │   ├── 📁 src/
    │   │   ├── 📁 controllers/    # Route controllers
    │   │   ├── 📁 usecases/       # Business logic
    │   │   ├── 📁 services/       # External services
    │   │   ├── 📁 models/         # Database models
    │   │   ├── 📁 routes/         # API routes
    │   │   ├── 📁 middleware/     # Custom middleware
    │   │   └── 📁 utils/          # Utility functions
    │   ├── 📄 .env.example
    │   └── 📄 package.json
    ├── 📁 client/                 # React Frontend
    │   ├── 📁 src/
    │   │   ├── 📁 pages/          # Page components
    │   │   ├── 📁 components/     # Reusable components
    │   │   ├── 📁 hooks/          # Custom React hooks
    │   │   ├── 📁 services/       # API services
    │   │   ├── 📁 utils/          # Utility functions
    │   │   └── 📁 types/          # TypeScript types
    │   ├── 📄 .env.example
    │   └── 📄 package.json
    ├── 📄 .gitignore
    └── 📄 README.md

---

## 🧑‍💻 Development Guidelines

### Code Style
- **ESLint & Prettier** for consistent code formatting
- **Conventional Commits** for commit messages
- **TypeScript** for type safety
- **Clean Architecture** principles

### Best Practices
- Use **Zod** for client-side validation
- Follow **RESTful API** conventions
- Implement proper **error handling**
- Write **meaningful commit messages**

### Commit Message Format

    feat: add new feature
    fix: resolve bug issue
    docs: update documentation
    style: format code
    refactor: restructure code
    test: add tests
    chore: update dependencies

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
 
3. **💻 Make your changes**
4. **✅ Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"

5. **🚀 Push to your branch**
   ```bash
   git push origin feature/amazing-feature
 
6. **📝 Create a Pull Request**

### 📋 Contribution Guidelines
- Ensure your code follows the existing style
- Add tests for new features
- Update documentation as needed
- Keep pull requests focused and small

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

<div align="center">

**Mohammed Rimshan**

[![Email](https://img.shields.io/badge/📧_Email-rimshanshanu55@gmail.com-red?style=for-the-badge)](mailto:rimshanshanu55@gmail.com)
[![LinkedIn](https://img.shields.io/badge/💼_LinkedIn-Connect-blue?style=for-the-badge)](https://www.linkedin.com/in/mohammed-rimshan-02986a225/)
[![Twitter](https://img.shields.io/badge/🐦_Twitter-Follow-lightblue?style=for-the-badge)](https://twitter.com/yourhandle)

</div>

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped make this project better
- Inspired by modern URL shortening services
- Built with love and passion for clean code

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ by Mohammed Rimshan**

*Secure • Scalable • Insightful*

</div>

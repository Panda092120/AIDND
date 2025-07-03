# 🐉 D&D Simulator

A full-stack web application that creates an immersive Dungeons & Dragons experience with AI-powered dungeon mastering using OpenAI's ChatGPT API.

## ⚔️ Features

- **User Authentication**: Secure login and signup system
- **Character Creation**: Complete D&D character sheet builder
- **Campaign Management**: Create and manage multiple campaigns
- **AI Dungeon Master**: ChatGPT-powered game master
- **Interactive Dice Roller**: Digital dice with modifiers
- **Real-time Chat**: Chat interface for game interactions
- **Campaign Persistence**: Save and resume campaigns

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript (ES6+)** - Programming language

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **OpenAI API** - AI dungeon master
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dnd-simulator.git
   cd dnd-simulator
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=dnd_simulator

   # JWT
   JWT_SECRET=your_super_secret_jwt_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Server
   PORT=5000
   NODE_ENV=development
   ```

5. **Database Setup**
   ```sql
   CREATE DATABASE dnd_simulator;
   
   USE dnd_simulator;
   
   CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE campaigns (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT,
     title VARCHAR(100) NOT NULL,
     character_data JSON,
     chat_history JSON,
     setting_description TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

6. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

   The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
dnd-simulator/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── campaigns.js    # Campaign management
│   │   └── openai.js       # ChatGPT integration
│   ├── middleware/
│   │   ├── auth.js         # JWT middleware
│   │   └── validation.js   # Input validation
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── server.js           # Express server
│   ├── package.json
│   └── .env
└── README.md
```

## 🎮 How to Use

1. **Sign Up / Login**: Create an account or log in
2. **Create Campaign**: Click "Begin New Campaign"
3. **Character Creation**: Fill out your D&D character sheet
4. **Setting Selection**: Describe your preferred adventure setting
5. **Play**: Interact with the AI dungeon master and roll dice
6. **Save Progress**: Campaigns are automatically saved

## 🔧 Configuration

### Tailwind CSS Setup

Create `tailwind.config.js` in the frontend directory:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🌟 Features in Development

- [ ] Multiple character support per campaign
- [ ] Campaign sharing between users
- [ ] Voice chat integration
- [ ] Advanced character sheet features
- [ ] Custom dice macros
- [ ] Campaign templates


## 🙏 Acknowledgments

- OpenAI for providing the ChatGPT API
- The D&D community for inspiration
- Wizards of the Coast for creating Dungeons & Dragons

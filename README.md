🏓 ft_transcendence

Welcome to ft_transcendence — a real-time multiplayer gaming platform built with a modern microservices architecture.
Play Pong and Chess online, challenge your friends, join tournaments, chat in real time, and track your stats — all inside one clean and interactive dashboard.
This project combines backend engineering, real-time systems, authentication security, and modern frontend development into one complete full-stack application.

✨ What You Can Do

🎮 Play Pong locally or online

♟ Play Chess with online matchmaking

🏆 Join and compete in tournaments

💬 Chat with friends in real time

👥 Send and receive friend requests

📊 Track your game statistics

🎨 Customize your game experience

🏗 Architecture

This project follows a microservices architecture where each domain is isolated into its own service.

🧩 Services

Auth Service

User Service

Chat Service

Pong Game Service

Chess Game Service

Notification Service

Each service runs independently and communicates using HTTP and WebSockets.

🌐 Reverse Proxy

We use NGINX as a reverse proxy to:

Route requests to the correct service

Act as a single entry point

Improve scalability

Manage security headers

Support load balancing

⚙️ Tech Stack
🖥 Backend

Node.js

Fastify

SQLite

WebSockets

JWT Authentication

OAuth2 (Google & Discord)

Microservices Architecture

🌐 Frontend

React

TypeScript

TailwindCSS

React Query (remote state management)

Zustand (UI state management)

WebSocket Client

🔐 Authentication

Authentication is handled by the Auth Service and includes:

User registration & login

Secure password hashing

JWT-based authentication

Token validation middleware

OAuth2 login via:

Google

Discord

Protected routes (frontend + backend)

🎮 Games
🏓 Pong

Local multiplayer

Online vs friend

Matchmaking system

Online tournaments

Real-time gameplay via WebSockets

Customizable game settings

♟ Chess

Online matchmaking

Real-time move synchronization

Turn-based validation

Match history tracking

💬 Social & Real-Time Features
Chat

Real-time messaging

Private conversations

Online/offline presence

WebSocket-powered system

Notifications

Friend requests

Game invitations

Tournament updates

Live alerts

User Profiles

Friend management

Avatar customization

Personal statistics dashboard

📊 Dashboard

A clean and modern dashboard that shows:

Match history

Win/Loss ratio

Tournament performance

Player statistics

Game customization options

🔄 Real-Time Communication

WebSockets power:
Pong gameplay
Chess matches
Chat messages
Matchmaking events
Tournament updates

This ensures:

⚡ Low latency
🔁 Instant updates
🎯 Synchronized game state

🚀 How to Run

1️⃣ Clone the repository
git clone https://github.com/Om7gh/ft_trancendance
cd ft_transcendence
2️⃣ Start the services
Using Docker
docker-compose up --build or make
Or run services manually
cd services/auth-service
npm install
npm run dev
Repeat for the other services.

🎯 Engineering Highlights

Microservices separation of concerns
Reverse proxy routing with NGINX
Stateless authentication with JWT
Real-time WebSocket architecture
OAuth integration
Matchmaking logic implementation
Tournament bracket system

🧠 Challenges We Solved

Synchronizing real-time multiplayer games
Handling distributed authentication across services
Secure OAuth implementation
Managing matchmaking queues
Preventing race conditions
Designing scalable WebSocket architecture

🔮 Future Improvements

ELO ranking system
Spectator mode
Horizontal scaling
Redis for caching & pub/sub
Centralized logging
Production HTTPS deployment

👨‍💻 Team

Omar – Frontend + Full Online Chess Game
Abdlhalim – Full Authentication System
Ilyas Aldidi – Friend System
Ayoub Lafdili – Chat (Backend + Frontend)
Ibrahim Amzil – Pong Game (Backend + Frontend)

# InterNexus - Virtual Research Collaboration Platform

> **TechTrove 2.0 Hackathon Project**  
> A cutting-edge virtual headquarters platform for national interdisciplinary research collaboration, featuring 3D office tours, real-time collaboration tools, and AI-powered insights.

---

## 🌟 Overview

InterNexus revolutionizes how research institutions and global partners collaborate by providing:

- **🏢 3D Virtual HQ Tours:** Immersive WebGL-powered virtual offices, labs, and meeting spaces
- **📊 Interactive Dashboards:** Real-time project tracking, resource management, and KPI visualization
- **🤝 Live Collaboration:** WebSocket-based chat, shared whiteboards, and co-coding environments
- **🌍 Global Partner Maps:** Interactive world map showcasing institutional partnerships
- **🤖 AI Recommendations:** Intelligent suggestions for tasks, collaborators, and project insights
- **📈 Impact Metrics:** Visual analytics for research publications, funding, and engagement

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Component-based UI framework
- **Three.js / React Three Fiber** - 3D rendering and WebGL scenes
- **Socket.IO Client** - Real-time bidirectional communication
- **Recharts / D3.js** - Data visualization and charts
- **React Simple Maps** - Interactive SVG world maps
- **Ant Design / Tailwind CSS** - UI component library and styling
- **Redux Toolkit** - Global state management
- **React Router** - Client-side routing

### Backend Stack
- **Node.js + Express** - REST API server
- **Socket.IO** - WebSocket server for real-time features
- **MongoDB / PostgreSQL** - Database (choose based on needs)
- **Firebase** - Authentication and real-time sync (optional)
- **TensorFlow.js / OpenAI API** - AI/ML integration
- **JWT** - Authentication tokens

### DevOps & Hosting
- **AWS / Google Cloud** - Cloud hosting and deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy and load balancing

---

## 📁 Project Structure

```
internexus/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── 3d/          # Three.js/R3F components
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── collaboration/ # Chat, whiteboard
│   │   │   ├── maps/        # Partner map components
│   │   │   └── common/      # Shared UI elements
│   │   ├── pages/           # Route-level components
│   │   ├── services/        # API clients and utilities
│   │   ├── store/           # Redux state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── styles/          # Global CSS and themes
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Root component
│   │   └── index.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js       # Vite bundler config
│
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.IO event handlers
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Helper functions
│   ├── tests/               # Unit and integration tests
│   ├── server.js            # Entry point
│   └── package.json
│
├── shared/                   # Shared code between client/server
│   └── constants/           # Common constants and types
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── API.md               # API documentation
│   └── DEPLOYMENT.md        # Deployment guide
│
├── scripts/                  # Utility scripts
│   ├── setup.sh             # Initial setup
│   └── deploy.sh            # Deployment script
│
├── docker-compose.yml        # Docker orchestration
├── .gitignore
├── .env.example             # Environment variables template
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn**
- **MongoDB** (local or Atlas) OR **PostgreSQL**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internexus
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example env files
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   
   # Edit .env files with your configurations
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start backend server (port 5000)
   cd server
   npm run dev

   # Terminal 2: Start frontend dev server (port 3000)
   cd client
   npm run dev
   ```

5. **Open application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

---

## 🎯 Core Features Implementation

### 1. 3D Virtual HQ Tours
- **Technology:** React Three Fiber (R3F) with Three.js
- **Features:** First-person camera controls, interactive hotspots, room transitions
- **Files:** `client/src/components/3d/VirtualHQ.jsx`, `client/src/components/3d/Room.jsx`

### 2. Project Dashboards
- **Technology:** React + Recharts/D3.js + Ant Design
- **Features:** KPI cards, trend charts, resource allocation, project timeline
- **Files:** `client/src/pages/Dashboard.jsx`, `client/src/components/dashboard/`

### 3. Real-time Collaboration
- **Technology:** Socket.IO (WebSockets)
- **Features:** Live chat, shared whiteboard, presence indicators, co-editing
- **Files:** `server/src/sockets/`, `client/src/components/collaboration/`

### 4. Global Partner Maps
- **Technology:** React Simple Maps + TopoJSON
- **Features:** Interactive markers, search/filter, partner details modal
- **Files:** `client/src/components/maps/PartnerMap.jsx`

### 5. AI-Powered Recommendations
- **Technology:** OpenAI GPT API (server-side) or TensorFlow.js (client-side)
- **Features:** Task suggestions, collaborator matching, content summarization
- **Files:** `server/src/services/aiService.js`

---

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test

# Run E2E tests
npm run test:e2e
```

---

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment (AWS/GCP)
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Development Guidelines

### Code Style
- **ESLint + Prettier** for consistent formatting
- **Airbnb JavaScript Style Guide** as base
- **Component-based architecture** - single responsibility principle
- **Meaningful comments** explaining *why*, not *what*
- **PropTypes/TypeScript** for type safety

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit with descriptive messages: `git commit -m "feat: add 3D room transitions"`
3. Push and create Pull Request
4. Code review required before merge

### Component Reusability
- Build small, focused components with clear props
- Use React hooks for logic reuse (`useAuth`, `useSocket`, etc.)
- Create shared UI components in `client/src/components/common/`
- Document props with JSDoc comments

---

## 🎨 Design Principles

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast ratios >= 4.5:1
- Alternative text for images

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (320px), tablet (768px), desktop (1024px+)
- CSS Grid and Flexbox for layouts
- Tailwind utility classes

### Performance
- Code splitting with React.lazy()
- Image optimization (WebP, lazy loading)
- Memoization for expensive computations
- WebSocket connection pooling

---

## 📚 Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Socket.IO Guide](https://socket.io/docs/v4/)
- [D3.js Examples](https://observablehq.com/@d3/)
- [Ant Design Components](https://ant.design/components/)

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

**TechTrove 2.0 Hackathon Submission**

- Development Team: [Ong Khai Sern]
- Project Lead: [Ong Khai Sern]
- Contact: [ongkhaisern@gmail.com]

---

## 🙏 Acknowledgments

- Taylor's University for hosting TechTrove 2.0
- Open source community for amazing tools and libraries
- Research institutions inspiring this collaboration platform

---

**Built with ❤️ for national interdisciplinary research collaboration**

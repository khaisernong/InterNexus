# InterNexus Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone and setup**
   ```powershell
   cd "TechTrove 2.0"
   ```

2. **Install dependencies**
   ```powershell
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment**
   ```powershell
   # Server
   cd ../server
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings

   # Client
   cd ../client
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Start development servers**
   ```powershell
   # Terminal 1: Start MongoDB (if local)
   mongod

   # Terminal 2: Start backend
   cd server
   npm run dev

   # Terminal 3: Start frontend
   cd client
   npm run dev
   ```

5. **Open application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
TechTrove 2.0/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── 3d/       # Three.js 3D components
│   │   │   ├── dashboard/ # Dashboard widgets
│   │   │   ├── collaboration/ # Chat & whiteboard
│   │   │   ├── maps/     # Partner map
│   │   │   └── common/   # Shared UI
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API clients
│   │   ├── store/        # Redux state
│   │   └── App.jsx       # Main component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── sockets/      # WebSocket handlers
│   │   └── middleware/   # Auth, validation
│   └── server.js         # Entry point
│
└── README.md
```

## 🎯 Key Features & Files

### 1. 3D Virtual HQ
**File:** `client/src/components/3d/VirtualHQ.jsx`
- Interactive 3D office tour
- First-person navigation
- Clickable hotspots

### 2. Project Dashboard
**File:** `client/src/components/dashboard/ProjectDashboard.jsx`
- Real-time KPIs
- Interactive charts
- Project tracking

### 3. Collaboration Hub
**File:** `client/src/components/collaboration/CollaborationHub.jsx`
- Live chat
- Shared whiteboard
- Presence indicators

### 4. Partner Map
**File:** `client/src/components/maps/PartnerMap.jsx`
- Interactive world map
- Partner directory
- Search & filter

## 🔧 Development Workflow

### Adding a New Feature

1. **Create component**
   ```powershell
   cd client/src/components
   # Create new component file
   ```

2. **Add route** (if needed)
   Edit `client/src/App.jsx` to add route

3. **Create API endpoint** (if needed)
   ```powershell
   cd server/src/routes
   # Create new route file
   ```

4. **Test**
   ```powershell
   npm test
   ```

## 🧪 Testing

```powershell
# Test frontend
cd client
npm test

# Test backend
cd server
npm test

# E2E tests
npm run test:e2e
```

## 📦 Building for Production

```powershell
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 🐛 Troubleshooting

### Port already in use
```powershell
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB connection error
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Ensure network access (if using Atlas)

### Module not found
```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Three.js Guide](https://threejs.org/docs/)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [MongoDB Manual](https://www.mongodb.com/docs/)

## 💡 Tips

1. **Hot Reload**: Save files to see changes instantly
2. **DevTools**: Use React DevTools and Redux DevTools
3. **Debugging**: Check browser console and server logs
4. **Code Style**: Run `npm run lint:fix` before committing

## 🤝 Getting Help

- Check README.md for detailed documentation
- Review code comments for implementation details
- Search GitHub issues for common problems

---

**Happy coding! 🚀**

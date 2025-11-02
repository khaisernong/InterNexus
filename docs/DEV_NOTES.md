# InterNexus Development Notes

## Project Overview
InterNexus is a virtual research collaboration platform built for the TechTrove 2.0 hackathon. It combines 3D visualization, real-time collaboration, and data analytics to revolutionize how research institutions work together globally.

## Tech Stack Summary

### Frontend
- **React 18** - UI framework
- **Three.js / React Three Fiber** - 3D rendering
- **Socket.IO Client** - Real-time communication
- **Recharts** - Data visualization
- **Ant Design** - UI components
- **Redux Toolkit** - State management
- **Vite** - Build tool

### Backend
- **Node.js + Express** - Server framework
- **Socket.IO** - WebSocket server
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Winston** - Logging

## Architecture Decisions

### Why React Three Fiber over vanilla Three.js?
- Declarative API (easier to maintain)
- React component model (reusability)
- Built-in hooks for animations
- Better integration with React ecosystem

### Why Socket.IO over native WebSockets?
- Automatic reconnection
- Room support for channels
- Fallback to polling
- Built-in broadcasting

### Why Node.js over Django?
- JavaScript throughout stack
- Better real-time support
- Non-blocking I/O
- Massive npm ecosystem

## Component Architecture

### 3D Components (`client/src/components/3d/`)
- `VirtualHQ.jsx` - Main 3D scene
- `Room.jsx` - Individual room component
- `Hotspot.jsx` - Interactive markers

### Dashboard (`client/src/components/dashboard/`)
- `ProjectDashboard.jsx` - Main dashboard
- `KPICard.jsx` - Metric cards
- Charts use Recharts for consistency

### Collaboration (`client/src/components/collaboration/`)
- `CollaborationHub.jsx` - Chat + whiteboard
- Socket.IO events for real-time sync
- Canvas API for drawing

### Maps (`client/src/components/maps/`)
- `PartnerMap.jsx` - World map with markers
- React Simple Maps (SVG-based)
- TopoJSON for country data

## Development Best Practices

### Code Organization
- One component per file
- Co-locate related files
- Use index.js for exports
- Keep components under 300 lines

### State Management
- Local state for UI-only data
- Redux for shared/persistent data
- Context for theme/auth
- Avoid prop drilling

### Styling
- Use Ant Design components
- CSS modules for custom styles
- Tailwind utilities for spacing
- CSS variables for theming

### Performance
- Lazy load routes
- Memoize expensive computations
- Use React.memo for pure components
- Debounce/throttle event handlers

## API Structure

### RESTful Endpoints
```
GET    /api/projects       - List projects
POST   /api/projects       - Create project
GET    /api/projects/:id   - Get project
PUT    /api/projects/:id   - Update project
DELETE /api/projects/:id   - Delete project
```

### WebSocket Events
```
Client -> Server:
- join-room
- chat-message
- draw
- typing

Server -> Client:
- chat-message
- draw-data
- user-joined
- user-left
- users-update
```

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  avatar: String,
  createdAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  team: String,
  status: String,
  progress: Number,
  deadline: Date,
  members: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Partner
```javascript
{
  _id: ObjectId,
  name: String,
  country: String,
  city: String,
  coordinates: [Number],
  type: String,
  collaboration: String,
  established: Date,
  projects: Number,
  researchers: Number
}
```

## Security Considerations

### Authentication
- JWT tokens with 7-day expiry
- Refresh token rotation
- HTTP-only cookies
- CORS configuration

### Data Validation
- Joi schemas for request validation
- MongoDB sanitization
- XSS prevention
- Rate limiting

### WebSocket Security
- Authenticate socket connections
- Validate room permissions
- Rate limit events
- Sanitize user input

## Testing Strategy

### Unit Tests
- Component rendering
- Utility functions
- Redux actions/reducers
- API endpoints

### Integration Tests
- API routes with database
- Socket.IO events
- Authentication flow

### E2E Tests
- Critical user flows
- Cross-browser testing
- Performance benchmarks

## Deployment Checklist

### Pre-deployment
- [ ] Set production env vars
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up database backups
- [ ] Enable monitoring
- [ ] Configure rate limiting
- [ ] Remove console.logs

### Production
- [ ] Use managed MongoDB (Atlas)
- [ ] Set up CDN for static assets
- [ ] Configure auto-scaling
- [ ] Set up health checks
- [ ] Enable error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up CI/CD pipeline

## Known Issues & TODOs

### High Priority
- [ ] Implement user authentication
- [ ] Add database models
- [ ] Create API routes
- [ ] Add error boundaries
- [ ] Implement proper error handling

### Medium Priority
- [ ] Add loading skeletons
- [ ] Implement dark mode
- [ ] Add unit tests
- [ ] Optimize bundle size
- [ ] Add PWA support

### Low Priority
- [ ] Add keyboard shortcuts
- [ ] Implement file uploads
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add analytics tracking

## Useful Commands

```powershell
# Development
npm run dev          # Start dev server
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run format       # Format code

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Building
npm run build        # Production build
npm run preview      # Preview build

# Database
mongod               # Start MongoDB
mongo                # Open MongoDB shell
```

## Resources

- [Project Requirements](./TechTrove%202%20-%20InterNexus.pdf)
- [Submission Details](./TechTrove%202_Submission%20Details.pdf)
- [README](./README.md)
- [Quick Start](./QUICKSTART.md)

---

**Last Updated:** November 1, 2025

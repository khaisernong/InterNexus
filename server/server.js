/**
 * InterNexus Backend Server
 * 
 * Node.js + Express server with Socket.IO for real-time features.
 * Provides REST API endpoints and WebSocket communication.
 * 
 * Architecture:
 * - Express: HTTP server and REST API routing
 * - Socket.IO: WebSocket server for real-time collaboration
 * - MongoDB/Mongoose: Database and ODM
 * - JWT: Authentication and authorization
 * - Winston: Logging
 * - Helmet: Security headers
 * 
 * Alternative backend approaches:
 * - Django (Python): Rapid development, great admin interface, Django Channels for WebSockets
 * - NestJS (Node.js): TypeScript-first, modular architecture, built-in decorators
 * - FastAPI (Python): High performance async, auto-generated API docs, modern Python features
 * - GraphQL (Apollo Server): Flexible querying, single endpoint, real-time subscriptions
 * 
 * Why Node.js + Express:
 * - Non-blocking I/O ideal for real-time apps
 * - JavaScript throughout stack (shared code with frontend)
 * - Massive npm ecosystem
 * - Excellent WebSocket support
 * - Easy scaling (horizontal and vertical)
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import projectRoutes from './src/routes/projectRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import partnerRoutes from './src/routes/partnerRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';

// Import socket handlers
import { handleCollaboration } from './src/sockets/collaborationHandler.js';
import { handleNotifications } from './src/sockets/notificationHandler.js';

// Import middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { authMiddleware } from './src/middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

/**
 * Environment Configuration
 * 
 * Required variables:
 * - PORT: Server port (default: 5000)
 * - MONGODB_URI: Database connection string
 * - JWT_SECRET: Secret key for JWT signing
 * - NODE_ENV: Environment (development/production)
 * - CORS_ORIGIN: Allowed frontend origins
 */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internexus';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express app
const app = express();

// Create HTTP server (required for Socket.IO)
const httpServer = createServer(app);

/**
 * Socket.IO Setup
 * 
 * Configures WebSocket server for real-time features.
 * Uses CORS to allow connections from frontend.
 * 
 * Connection flow:
 * 1. Client connects via Socket.IO client library
 * 2. Server authenticates connection (optional: JWT in handshake)
 * 3. Client joins rooms based on features (chat, whiteboard, etc.)
 * 4. Events broadcast to all clients in room
 * 5. Server manages presence and cleanup on disconnect
 */
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Increase max payload size for file transfers (default: 1MB)
  maxHttpBufferSize: 10e6, // 10MB
  // Ping-pong interval to keep connection alive
  pingInterval: 10000,
  pingTimeout: 5000,
});

/**
 * Middleware Configuration
 * 
 * Applied in order - earlier middleware runs first.
 * Security middleware should come early in the chain.
 */

// Security headers (XSS, clickjacking, etc.)
app.use(helmet());

// Enable CORS for frontend requests
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

// Request logging (dev: detailed, prod: combined)
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compress responses for better performance
app.use(compression());

/**
 * Rate Limiting
 * 
 * Prevents abuse by limiting requests per IP.
 * Adjust limits based on expected traffic patterns.
 * 
 * Alternative approaches:
 * - Redis-based rate limiting for distributed systems
 * - Token bucket algorithm for burst allowance
 * - User-based limits (after authentication)
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * Database Connection
 * 
 * MongoDB with Mongoose ODM for schema validation and queries.
 * 
 * Alternative databases:
 * - PostgreSQL: Relational, ACID compliance, complex queries
 * - Firebase Firestore: Managed NoSQL, real-time sync, easier scaling
 * - Redis: In-memory, ultra-fast, great for caching/sessions
 * - Cassandra: Distributed, high write throughput, complex setup
 * 
 * MongoDB chosen for:
 * - Flexible schema (good for evolving requirements)
 * - JSON-like documents (matches JavaScript objects)
 * - Horizontal scaling (sharding)
 * - Rich query language
 * - Strong Node.js ecosystem
 */
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1); // Exit if database connection fails
  });

/**
 * API Routes
 * 
 * RESTful endpoints for CRUD operations.
 * Protected routes require authentication middleware.
 * 
 * Route structure:
 * - /api/projects - Project management
 * - /api/users - User accounts and profiles
 * - /api/partners - Partner institutions
 * - /api/analytics - Metrics and reporting
 */
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', authMiddleware, partnerRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

/**
 * Health Check Endpoint
 * 
 * Used by load balancers and monitoring tools.
 * Returns 200 if server is healthy.
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

/**
 * Root Endpoint
 * 
 * Basic API information for developers.
 */
app.get('/', (req, res) => {
  res.json({
    name: 'InterNexus API',
    version: '1.0.0',
    description: 'Backend API for InterNexus virtual collaboration platform',
    endpoints: {
      projects: '/api/projects',
      users: '/api/users',
      partners: '/api/partners',
      analytics: '/api/analytics',
      health: '/health',
    },
  });
});

/**
 * Socket.IO Connection Handling
 * 
 * Manages WebSocket connections for real-time features.
 * Each connected client gets a unique socket instance.
 * 
 * Event architecture:
 * - Use rooms for logical grouping (e.g., project-specific chats)
 * - Broadcast to room: io.to(roomId).emit('event', data)
 * - Emit to specific socket: socket.emit('event', data)
 * - Broadcast to all: io.emit('event', data)
 */
io.on('connection', (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  // Optional: Authenticate socket connection
  // const token = socket.handshake.auth.token;
  // Verify JWT and attach user info to socket

  // Handle collaboration events (chat, whiteboard, etc.)
  handleCollaboration(io, socket);

  // Handle notification events
  handleNotifications(io, socket);

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`✗ User disconnected: ${socket.id} (Reason: ${reason})`);
    // Cleanup: Remove user from active rooms, notify others, etc.
  });
});

/**
 * Error Handling Middleware
 * 
 * Catches all errors and sends appropriate response.
 * Must be defined after all routes.
 * 
 * Error handling best practices:
 * - Use specific error classes (ValidationError, AuthError, etc.)
 * - Log errors with context (user, request, stack trace)
 * - Don't expose internal errors to client in production
 * - Use monitoring tools (Sentry, New Relic) for production
 */
app.use(errorHandler);

/**
 * 404 Handler
 * 
 * Catches requests to undefined routes.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

/**
 * Graceful Shutdown
 * 
 * Handles SIGTERM and SIGINT signals.
 * Ensures all connections close properly before exit.
 * 
 * Important for:
 * - Container orchestration (Kubernetes, Docker)
 * - Preventing data loss
 * - Finishing in-flight requests
 */
const gracefulShutdown = () => {
  console.log('\n⚠ Received shutdown signal, closing server gracefully...');

  // Stop accepting new requests
  httpServer.close(() => {
    console.log('✓ HTTP server closed');

    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('✓ MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('✗ Forced shutdown - some connections did not close in time');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Start Server
 * 
 * Binds to specified port and begins accepting connections.
 */
httpServer.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`🚀 InterNexus Server Running`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`📊 Database: ${MONGODB_URI}`);
  console.log('=================================\n');
});

/**
 * Unhandled Errors
 * 
 * Last resort error handling for uncaught exceptions.
 * Log and restart process (use PM2 or similar for auto-restart).
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, log to monitoring service and gracefully shutdown
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log and exit - let process manager restart
  process.exit(1);
});

export default app;

/**
 * Production Deployment Checklist:
 * 
 * 1. Environment Variables:
 *    - Set all required env vars in hosting platform
 *    - Use secrets management (AWS Secrets Manager, etc.)
 * 
 * 2. Database:
 *    - Use managed MongoDB (Atlas, AWS DocumentDB)
 *    - Set up backups and monitoring
 *    - Configure replica set for high availability
 * 
 * 3. Security:
 *    - Enable HTTPS (TLS certificates)
 *    - Configure firewall rules
 *    - Implement authentication on all sensitive endpoints
 *    - Use environment-specific CORS origins
 *    - Enable rate limiting and DDoS protection
 * 
 * 4. Performance:
 *    - Enable response caching (Redis)
 *    - Use CDN for static assets
 *    - Implement database indexing
 *    - Monitor and optimize slow queries
 * 
 * 5. Monitoring:
 *    - Set up application monitoring (New Relic, Datadog)
 *    - Configure error tracking (Sentry)
 *    - Enable health checks for load balancer
 *    - Set up alerts for critical errors
 * 
 * 6. Scaling:
 *    - Use load balancer (AWS ALB, Nginx)
 *    - Implement horizontal scaling (multiple instances)
 *    - Use Redis for session storage (for sticky sessions)
 *    - Consider microservices for large scale
 * 
 * 7. CI/CD:
 *    - Automate testing (unit, integration, E2E)
 *    - Set up deployment pipeline (GitHub Actions, Jenkins)
 *    - Use blue-green or canary deployments
 *    - Implement rollback strategy
 */

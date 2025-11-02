/**
 * Collaboration Socket Handler
 * 
 * Manages real-time collaboration features via Socket.IO.
 * Handles chat messages, whiteboard drawing, presence indicators, and typing events.
 * 
 * Event-driven architecture:
 * - Listen for client events (emit from client)
 * - Broadcast events to other clients in the same room
 * - Maintain state (active users, rooms, etc.)
 * 
 * Scalability considerations:
 * - Use Redis adapter for multi-server Socket.IO (horizontal scaling)
 * - Implement message queuing (Bull, RabbitMQ) for heavy processing
 * - Consider WebRTC for peer-to-peer data (reduces server load)
 */

// In-memory storage for active rooms and users
// In production, use Redis for persistence across server instances
const activeRooms = new Map();
const activeUsers = new Map();

/**
 * Room Data Structure:
 * {
 *   roomId: {
 *     users: Set<userId>,
 *     messages: Array<message>,
 *     createdAt: Date,
 *   }
 * }
 */

/**
 * Main collaboration handler
 * 
 * Registers all collaboration-related socket events.
 * Each event handler should validate data and handle errors gracefully.
 * 
 * @param {Server} io - Socket.IO server instance
 * @param {Socket} socket - Connected client socket
 */
export const handleCollaboration = (io, socket) => {
  
  /**
   * Join Room Event
   * 
   * When user enters a collaboration space, they join a Socket.IO room.
   * Rooms allow targeted broadcasting (only users in the room receive events).
   * 
   * Flow:
   * 1. User joins room
   * 2. Add user to room's user list
   * 3. Notify all users in room of new member
   * 4. Send room history to new user
   */
  socket.on('join-room', ({ roomId, user }) => {
    try {
      // Validate input
      if (!roomId || !user || !user.id) {
        socket.emit('error', { message: 'Invalid room or user data' });
        return;
      }

      // Join Socket.IO room
      socket.join(roomId);

      // Initialize room if it doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          users: new Set(),
          messages: [],
          createdAt: new Date(),
        });
      }

      const room = activeRooms.get(roomId);
      
      // Add user to room
      room.users.add(user.id);
      activeUsers.set(socket.id, { roomId, userId: user.id, userName: user.name });

      // Broadcast to room that new user joined
      io.to(roomId).emit('user-joined', {
        user,
        timestamp: new Date().toISOString(),
      });

      // Send updated user list to all clients in room
      const userList = Array.from(room.users).map(userId => {
        // In production, fetch user details from database
        return { id: userId, name: `User ${userId}` };
      });
      io.to(roomId).emit('users-update', userList);

      // Send room message history to new user (last 50 messages)
      const recentMessages = room.messages.slice(-50);
      socket.emit('message-history', recentMessages);

      console.log(`✓ User ${user.name} (${socket.id}) joined room ${roomId}`);

    } catch (error) {
      console.error('Error in join-room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  /**
   * Leave Room Event
   * 
   * Clean up when user leaves a collaboration space.
   * Important for presence indicators and resource cleanup.
   */
  socket.on('leave-room', ({ roomId, userId }) => {
    try {
      socket.leave(roomId);

      const room = activeRooms.get(roomId);
      if (room) {
        room.users.delete(userId);

        // Notify others that user left
        io.to(roomId).emit('user-left', {
          userId,
          timestamp: new Date().toISOString(),
        });

        // Update user list
        const userList = Array.from(room.users).map(id => ({ id, name: `User ${id}` }));
        io.to(roomId).emit('users-update', userList);

        // Clean up empty rooms (optional)
        if (room.users.size === 0) {
          activeRooms.delete(roomId);
          console.log(`✓ Room ${roomId} deleted (no users)`);
        }
      }

      activeUsers.delete(socket.id);
      console.log(`✓ User ${userId} left room ${roomId}`);

    } catch (error) {
      console.error('Error in leave-room:', error);
    }
  });

  /**
   * Chat Message Event
   * 
   * Broadcasts chat messages to all users in the room.
   * Stores message history for late joiners.
   * 
   * Message validation:
   * - Check message length (prevent spam)
   * - Sanitize content (prevent XSS)
   * - Rate limit per user (prevent flooding)
   */
  socket.on('chat-message', ({ roomId, message }) => {
    try {
      // Validate message
      if (!message || !message.text || message.text.trim().length === 0) {
        return;
      }

      // Enforce max message length
      if (message.text.length > 1000) {
        socket.emit('error', { message: 'Message too long (max 1000 chars)' });
        return;
      }

      // Add server timestamp
      const enrichedMessage = {
        ...message,
        serverTimestamp: new Date().toISOString(),
      };

      // Store in room history
      const room = activeRooms.get(roomId);
      if (room) {
        room.messages.push(enrichedMessage);

        // Limit message history size (prevent memory issues)
        if (room.messages.length > 500) {
          room.messages = room.messages.slice(-500);
        }
      }

      // Broadcast to all users in room (including sender for confirmation)
      io.to(roomId).emit('chat-message', enrichedMessage);

      console.log(`✓ Message in room ${roomId} from ${message.userName}`);

    } catch (error) {
      console.error('Error in chat-message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Typing Indicator Event
   * 
   * Shows when users are typing in chat.
   * Should be throttled on client-side to avoid excessive events.
   */
  socket.on('typing', ({ roomId, userId, userName }) => {
    try {
      // Broadcast to others in room (exclude sender)
      socket.to(roomId).emit('user-typing', userId);

      // Auto-stop typing after 3 seconds (handled on client side)

    } catch (error) {
      console.error('Error in typing event:', error);
    }
  });

  /**
   * Whiteboard Drawing Event
   * 
   * Broadcasts drawing data for collaborative whiteboard.
   * Optimizations:
   * - Batch multiple points to reduce event frequency
   * - Use binary format for smaller payload (Socket.IO supports binary)
   * - Implement undo/redo with command pattern
   */
  socket.on('draw', ({ roomId, drawData }) => {
    try {
      // Broadcast drawing data to others (exclude sender)
      socket.to(roomId).emit('draw-data', drawData);

      // Optional: Store drawing state for persistence
      // In production, periodically save canvas state to database

    } catch (error) {
      console.error('Error in draw event:', error);
    }
  });

  /**
   * Clear Canvas Event
   * 
   * Clears the whiteboard for all users.
   */
  socket.on('clear-canvas', ({ roomId }) => {
    try {
      // Broadcast clear command to all in room
      io.to(roomId).emit('canvas-cleared');

      console.log(`✓ Canvas cleared in room ${roomId}`);

    } catch (error) {
      console.error('Error in clear-canvas:', error);
    }
  });

  /**
   * Cursor Position Event (Advanced)
   * 
   * Shows cursor positions of other users for enhanced collaboration.
   * Should be heavily throttled (e.g., 10-20 updates per second max).
   */
  socket.on('cursor-move', ({ roomId, position }) => {
    try {
      const userData = activeUsers.get(socket.id);
      if (!userData) return;

      socket.to(roomId).emit('user-cursor', {
        userId: userData.userId,
        userName: userData.userName,
        position,
      });

    } catch (error) {
      console.error('Error in cursor-move:', error);
    }
  });

  /**
   * Disconnect Handling
   * 
   * Clean up user from all rooms when they disconnect.
   * Crucial for accurate presence indicators.
   */
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (!userData) return;

    const { roomId, userId, userName } = userData;

    // Remove user from room
    const room = activeRooms.get(roomId);
    if (room) {
      room.users.delete(userId);

      // Notify others
      io.to(roomId).emit('user-left', {
        userId,
        userName,
        timestamp: new Date().toISOString(),
      });

      // Update user list
      const userList = Array.from(room.users).map(id => ({ id, name: `User ${id}` }));
      io.to(roomId).emit('users-update', userList);

      // Clean up empty room
      if (room.users.size === 0) {
        activeRooms.delete(roomId);
      }
    }

    activeUsers.delete(socket.id);
    console.log(`✓ User ${userName} disconnected from room ${roomId}`);
  });
};

/**
 * Helper Functions
 */

/**
 * Get active room statistics
 * Useful for monitoring and analytics
 */
export const getRoomStats = () => {
  const stats = {
    totalRooms: activeRooms.size,
    totalUsers: activeUsers.size,
    rooms: [],
  };

  activeRooms.forEach((room, roomId) => {
    stats.rooms.push({
      roomId,
      userCount: room.users.size,
      messageCount: room.messages.length,
      createdAt: room.createdAt,
    });
  });

  return stats;
};

/**
 * Clean up old rooms (scheduled job)
 * Run periodically to remove inactive rooms
 */
export const cleanupInactiveRooms = (maxAgeHours = 24) => {
  const now = new Date();
  let cleaned = 0;

  activeRooms.forEach((room, roomId) => {
    const ageHours = (now - room.createdAt) / (1000 * 60 * 60);
    
    if (room.users.size === 0 && ageHours > maxAgeHours) {
      activeRooms.delete(roomId);
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`✓ Cleaned up ${cleaned} inactive rooms`);
  }

  return cleaned;
};

/**
 * Future Enhancements:
 * 
 * 1. Persistent Storage:
 *    - Save messages to database for history
 *    - Store whiteboard state as image/JSON
 *    - Use Redis for scalable session storage
 * 
 * 2. Advanced Features:
 *    - File sharing (integrate with S3 or similar)
 *    - Voice/video calls (WebRTC)
 *    - Screen sharing
 *    - Code editor with syntax highlighting
 *    - Polls and reactions
 * 
 * 3. Performance:
 *    - Implement message batching
 *    - Use binary protocols for drawing data
 *    - Add compression for large payloads
 *    - Implement P2P for video/large files
 * 
 * 4. Security:
 *    - Authenticate socket connections (JWT)
 *    - Validate user permissions per room
 *    - Rate limiting per user
 *    - Content moderation (profanity filter)
 * 
 * 5. Reliability:
 *    - Message acknowledgments
 *    - Automatic reconnection handling
 *    - Conflict resolution for concurrent edits
 *    - Event replay on reconnect
 */

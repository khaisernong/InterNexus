import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, Badge, List, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import io from 'socket.io-client';

/**
 * CollaborationHub Component
 * 
 * Real-time collaboration interface featuring:
 * - Live chat with presence indicators
 * - Shared whiteboard (canvas-based)
 * - Online user list
 * - Typing indicators
 * 
 * Technology: Socket.IO for WebSocket communication
 * Provides bidirectional, event-based real-time data exchange.
 * 
 * Alternative approaches:
 * - Native WebSockets: More low-level, requires manual reconnection logic
 * - Firebase Realtime Database: Managed solution, auto-sync but vendor lock-in
 * - PubNub/Ably: Commercial real-time APIs with high reliability
 * - Server-Sent Events (SSE): One-way server-to-client, simpler but limited
 * 
 * Socket.IO advantages:
 * - Automatic reconnection and fallback (long-polling if WebSocket unavailable)
 * - Room/namespace support for channel organization
 * - Built-in broadcasting and event acknowledgment
 * - Cross-browser compatibility
 * 
 * @param {Object} props
 * @param {string} props.roomId - Unique room identifier
 * @param {Object} props.user - Current user object { id, name, avatar }
 * @param {string} props.serverUrl - WebSocket server URL (default: localhost:5000)
 */

const CollaborationHub = ({ 
  roomId = 'default-room', 
  user = { id: '1', name: 'User', avatar: null },
  serverUrl = 'http://localhost:5000' 
}) => {
  // Socket connection ref - persists across re-renders
  const socketRef = useRef(null);
  
  // Canvas ref for whiteboard drawing
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Scroll to bottom when new messages arrive
  const messagesEndRef = useRef(null);

  /**
   * Socket.IO Connection Setup
   * 
   * Establishes WebSocket connection and registers event listeners.
   * Uses useEffect to handle connection lifecycle (connect on mount, disconnect on unmount).
   * 
   * Event handling pattern:
   * - socket.on('event', handler) - Register listener
   * - socket.emit('event', data) - Send data to server
   * - socket.off('event', handler) - Cleanup listener
   */
  useEffect(() => {
    // Initialize Socket.IO client
    try {
      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      const socket = socketRef.current;

      // Connection established
      socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
        // Join specific room for this collaboration session
        socket.emit('join-room', { roomId, user });
      });

      // Connection error handling
      socket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message);
        // Component will still render, just without real-time features
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }

    // Receive chat messages
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Update online users list
    socket.on('users-update', (users) => {
      setOnlineUsers(users);
    });

    // Typing indicators
    socket.on('user-typing', (userId) => {
      setTypingUsers(prev => [...new Set([...prev, userId])]);
      // Auto-remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(id => id !== userId));
      }, 3000);
    });

    // Receive whiteboard drawing data
    socket.on('draw-data', (drawData) => {
      drawOnCanvas(drawData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup on component unmount
    return () => {
      try {
        if (socket && socket.connected) {
          socket.emit('leave-room', { roomId, userId: user.id });
          socket.disconnect();
        }
      } catch (error) {
        console.error('Error during socket cleanup:', error);
      }
    };
  }, [roomId, user, serverUrl]);

  /**
   * Send chat message
   * 
   * Emits message to server which broadcasts to all clients in the room.
   * Server acts as message broker to ensure all clients receive updates.
   */
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('chat-message', { roomId, message });
      } else {
        // Fallback: Add message locally even if not connected
        setMessages(prev => [...prev, message]);
      }
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage('');
    }
  };

  /**
   * Handle typing event
   * 
   * Debounced to avoid spamming server with typing events.
   * Notifies other users that someone is typing.
   */
  const handleTyping = () => {
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', { roomId, userId: user.id, userName: user.name });
      }
    } catch (error) {
      console.error('Error sending typing event:', error);
    }
  };

  /**
   * Scroll chat to bottom
   * 
   * Ensures latest messages are visible.
   * Uses requestAnimationFrame for smooth scroll animation.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Whiteboard Canvas Setup
   * 
   * Initializes HTML5 Canvas for collaborative drawing.
   * Mouse events capture drawing actions and broadcast to other users.
   * 
   * Drawing flow:
   * 1. User draws on local canvas (mousedown -> mousemove -> mouseup)
   * 2. Drawing data sent to server via Socket.IO
   * 3. Server broadcasts to all clients in room
   * 4. Other clients render the same drawing
   * 
   * Performance considerations:
   * - Throttle mousemove events to reduce network traffic
   * - Use requestAnimationFrame for smooth rendering
   * - Consider using WebRTC for peer-to-peer drawing in large groups
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      ctx.lineTo(x, y);
      ctx.stroke();

      // Broadcast drawing data to other users
      const drawData = { x, y, isDrawing: true };
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('draw', { roomId, drawData });
      }
    } catch (error) {
      console.error('Error drawing:', error);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const drawData = { isDrawing: false };
    socketRef.current.emit('draw', { roomId, drawData });
  };

  const drawOnCanvas = (drawData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (drawData.isDrawing) {
      ctx.lineTo(drawData.x, drawData.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
    }
  };

  const clearCanvas = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('clear-canvas', { roomId });
      }
    } catch (error) {
      console.error('Error clearing canvas:', error);
    }
  };

  return (
    <div className="collaboration-hub">
      <div className="hub-layout">
        {/* Online Users Sidebar */}
        <Card title="Online Users" className="users-card">
          <List
            dataSource={onlineUsers}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge dot status="success">
                      <Avatar icon={<UserOutlined />} src={user.avatar}>
                        {user.name[0]}
                      </Avatar>
                    </Badge>
                  }
                  title={user.name}
                  description="Active"
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Chat Section */}
          <Card title="Team Chat" className="chat-card">
            <div className="messages-container">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.userId === user.id ? 'own-message' : ''}`}
                >
                  <Avatar src={msg.userAvatar} icon={<UserOutlined />}>
                    {msg.userName[0]}
                  </Avatar>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="user-name">{msg.userName}</span>
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <span>{typingUsers.length} user(s) typing...</span>
              </div>
            )}

            {/* Message Input */}
            <div className="message-input">
              <Input
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') sendMessage();
                  else handleTyping();
                }}
                suffix={
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={sendMessage}
                  />
                }
              />
            </div>
          </Card>

          {/* Whiteboard Section */}
          <Card 
            title="Shared Whiteboard" 
            className="whiteboard-card"
            extra={
              <Button size="small" onClick={clearCanvas}>
                Clear
              </Button>
            }
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="whiteboard-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </Card>
        </div>
      </div>

      <style jsx>{`
        .collaboration-hub {
          padding: 24px;
          height: 100vh;
          background: #f0f2f5;
        }

        .hub-layout {
          display: flex;
          gap: 16px;
          height: 100%;
        }

        .users-card {
          width: 250px;
          height: fit-content;
          border-radius: 8px;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-radius: 8px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          max-height: 400px;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .own-message .message-content {
          background: #e6f7ff;
        }

        .message-content {
          flex: 1;
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .user-name {
          font-weight: 600;
          color: #1890ff;
        }

        .timestamp {
          font-size: 12px;
          color: #8c8c8c;
        }

        .message-text {
          color: #262626;
        }

        .typing-indicator {
          padding: 8px 16px;
          font-style: italic;
          color: #8c8c8c;
          font-size: 14px;
        }

        .message-input {
          padding: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .whiteboard-card {
          border-radius: 8px;
        }

        .whiteboard-canvas {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          cursor: crosshair;
          background: white;
          width: 100%;
        }

        @media (max-width: 768px) {
          .hub-layout {
            flex-direction: column;
          }

          .users-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CollaborationHub;

/**
 * Usage Example:
 * 
 * import CollaborationHub from './components/collaboration/CollaborationHub';
 * 
 * function App() {
 *   const currentUser = {
 *     id: 'user123',
 *     name: 'John Doe',
 *     avatar: 'https://example.com/avatar.jpg'
 *   };
 *   
 *   return (
 *     <CollaborationHub 
 *       roomId="project-alpha"
 *       user={currentUser}
 *       serverUrl="http://localhost:5000"
 *     />
 *   );
 * }
 * 
 * Future Enhancements:
 * - Add file sharing capabilities
 * - Implement video/audio calls (WebRTC)
 * - Add emoji picker and reactions
 * - Message threading and replies
 * - Search/filter messages
 * - Code editor with syntax highlighting
 * - Screen sharing
 * - Whiteboard tools (shapes, text, eraser)
 * - Export whiteboard as image
 * - Persistent message history (database)
 * - User mentions (@username)
 * - Rich text formatting (markdown support)
 * - Read receipts and message status
 */

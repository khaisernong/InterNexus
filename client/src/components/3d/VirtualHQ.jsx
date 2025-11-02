import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  Sky,
  useGLTF,
  Html,
  useTexture
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * VirtualHQ Component
 * 
 * Main 3D scene component that renders an interactive virtual headquarters.
 * Uses React Three Fiber (R3F) for declarative Three.js rendering.
 * 
 * Features:
 * - First-person camera navigation
 * - Interactive room hotspots
 * - Dynamic lighting and shadows
 * - Post-processing effects (bloom, ambient occlusion)
 * 
 * Technology Stack:
 * - React Three Fiber: React renderer for Three.js
 * - @react-three/drei: Useful helpers and abstractions
 * - Three.js: 3D WebGL library
 * 
 * Alternative approaches:
 * - Babylon.js: More enterprise-focused, has built-in collision system
 * - A-Frame: HTML-based, easier for simple VR scenes but less flexible
 * - PlayCanvas: Game engine alternative with visual editor
 */

// Loading fallback component shown while 3D assets load
const LoadingFallback = () => (
  <Html center>
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading Virtual HQ...</p>
    </div>
  </Html>
);

/**
 * Interactive Hotspot Component
 * 
 * Clickable 3D marker that displays information when hovered/clicked.
 * Used for room labels, navigation points, or interactive elements.
 * 
 * @param {Object} props
 * @param {Array} props.position - [x, y, z] coordinates in 3D space
 * @param {string} props.label - Text displayed on hotspot
 * @param {Function} props.onClick - Callback when hotspot is clicked
 * @param {string} props.color - Hotspot color (default: #4f46e5)
 */
const Hotspot = ({ position, label, onClick, color = '#4f46e5' }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Animate hotspot on hover using requestAnimationFrame
  // This provides smooth 60fps animation without blocking the main thread
  React.useEffect(() => {
    if (!meshRef.current) return;
    
    const targetScale = hovered ? 1.3 : 1;
    const currentScale = meshRef.current.scale.x;
    const diff = targetScale - currentScale;
    
    if (Math.abs(diff) > 0.01) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* Glowing sphere mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* HTML label overlay - uses DOM rendering for text clarity */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="hotspot-label">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Furniture Components - Reusable 3D furniture pieces
 */
const Desk = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Desktop */}
    <mesh position={[0, 0.75, 0]} castShadow>
      <boxGeometry args={[2, 0.05, 1]} />
      <meshStandardMaterial color="#8b4513" roughness={0.6} />
    </mesh>
    {/* Legs */}
    {[[0.9, 0.35, 0.45], [0.9, 0.35, -0.45], [-0.9, 0.35, 0.45], [-0.9, 0.35, -0.45]].map((pos, i) => (
      <mesh key={i} position={pos} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    ))}
    {/* Monitor */}
    <mesh position={[0, 1.1, -0.3]} castShadow>
      <boxGeometry args={[0.6, 0.4, 0.05]} />
      <meshStandardMaterial color="#1a1a1a" emissive="#4f46e5" emissiveIntensity={0.3} />
    </mesh>
    {/* Monitor stand */}
    <mesh position={[0, 0.85, -0.1]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
);

const Chair = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Seat */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.5, 0.08, 0.5]} />
      <meshStandardMaterial color="#2563eb" roughness={0.7} />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.9, -0.22]} castShadow>
      <boxGeometry args={[0.5, 0.7, 0.08]} />
      <meshStandardMaterial color="#2563eb" roughness={0.7} />
    </mesh>
    {/* Base */}
    <mesh position={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.05]} />
      <meshStandardMaterial color="#333" metalness={0.8} />
    </mesh>
  </group>
);

const ConferenceTable = ({ position }) => (
  <group position={position}>
    {/* Table top */}
    <mesh position={[0, 0.75, 0]} castShadow>
      <boxGeometry args={[4, 0.08, 2]} />
      <meshStandardMaterial color="#654321" roughness={0.4} metalness={0.1} />
    </mesh>
    {/* Legs */}
    {[[1.8, 0.35, 0.9], [1.8, 0.35, -0.9], [-1.8, 0.35, 0.9], [-1.8, 0.35, -0.9]].map((pos, i) => (
      <mesh key={i} position={pos} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#4a3520" metalness={0.3} />
      </mesh>
    ))}
  </group>
);

const LabEquipment = ({ position }) => (
  <group position={position}>
    {/* Lab bench */}
    <mesh position={[0, 0.9, 0]} castShadow>
      <boxGeometry args={[3, 0.05, 1.5]} />
      <meshStandardMaterial color="#ddd" roughness={0.3} metalness={0.5} />
    </mesh>
    {/* Equipment boxes */}
    <mesh position={[-0.8, 1.15, 0]} castShadow>
      <boxGeometry args={[0.6, 0.4, 0.5]} />
      <meshStandardMaterial color="#4a5568" emissive="#10b981" emissiveIntensity={0.2} />
    </mesh>
    <mesh position={[0.8, 1.15, 0]} castShadow>
      <boxGeometry args={[0.5, 0.4, 0.4]} />
      <meshStandardMaterial color="#2d3748" emissive="#3b82f6" emissiveIntensity={0.2} />
    </mesh>
    {/* Legs */}
    {[[1.3, 0.45, 0.6], [1.3, 0.45, -0.6], [-1.3, 0.45, 0.6], [-1.3, 0.45, -0.6]].map((pos, i) => (
      <mesh key={i} position={pos} castShadow>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#718096" metalness={0.6} />
      </mesh>
    ))}
  </group>
);

const Bookshelf = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Frame */}
    <mesh castShadow>
      <boxGeometry args={[2, 2.5, 0.4]} />
      <meshStandardMaterial color="#8b7355" roughness={0.8} />
    </mesh>
    {/* Shelves */}
    {[0.6, 0, -0.6, -1.2].map((y, i) => (
      <mesh key={i} position={[0, y, 0]} castShadow>
        <boxGeometry args={[1.9, 0.05, 0.38]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    ))}
    {/* Books (decorative) */}
    {[0.8, 0.2, -0.4, -1.0].map((y, i) => (
      <mesh key={i} position={[0.5, y + 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.08]} />
        <meshStandardMaterial color={['#dc2626', '#2563eb', '#059669', '#d97706'][i]} />
      </mesh>
    ))}
  </group>
);

const Whiteboard = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow>
      <boxGeometry args={[3, 1.5, 0.05]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
    </mesh>
    {/* Frame */}
    <mesh position={[0, 0, -0.03]}>
      <boxGeometry args={[3.1, 1.6, 0.02]} />
      <meshStandardMaterial color="#333" metalness={0.8} />
    </mesh>
  </group>
);

/**
 * Office Room Component with Realistic Furniture
 */
const Room = ({ position, size = [10, 5, 10], roomType = 'office' }) => {
  const [width, height, depth] = size;

  return (
    <group position={position}>
      {/* Floor with tile pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
          color={roomType === 'lab' ? '#e8e8e8' : roomType === 'meeting' ? '#f5f5f0' : '#e5e5e0'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Walls with windows */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} castShadow>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.9} />
      </mesh>

      {/* Front wall with door opening */}
      <mesh position={[0, height / 2, depth / 2]} castShadow>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.9} />
      </mesh>

      {/* Right wall with window */}
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.9} />
      </mesh>
      {/* Window */}
      <mesh position={[width / 2 - 0.05, 2.5, 0]} castShadow>
        <boxGeometry args={[0.05, 2, 4]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling with lighting panels */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* Ceiling lights */}
      {[[0, 0], [width/3, 0], [-width/3, 0]].map((pos, i) => (
        <mesh key={i} position={[pos[0], height - 0.1, pos[1]]} castShadow>
          <boxGeometry args={[1.5, 0.05, 1.5]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.5}
          />
          <pointLight position={[0, -0.5, 0]} intensity={0.8} distance={8} color="#fff8e1" />
        </mesh>
      ))}

      {/* Room-specific furniture */}
      {roomType === 'office' && (
        <>
          <Desk position={[-3, 0, -3]} rotation={[0, Math.PI / 4, 0]} />
          <Chair position={[-3.8, 0, -2.3]} rotation={[0, Math.PI / 4, 0]} />
          
          <Desk position={[3, 0, -3]} rotation={[0, -Math.PI / 4, 0]} />
          <Chair position={[3.8, 0, -2.3]} rotation={[0, -Math.PI / 4, 0]} />
          
          <Desk position={[-3, 0, 3]} rotation={[0, -Math.PI / 4, 0]} />
          <Chair position={[-3.8, 0, 3.7]} rotation={[0, -Math.PI / 4, 0]} />
          
          <Bookshelf position={[-width/2 + 0.3, 1.25, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Bookshelf position={[width/2 - 0.3, 1.25, -depth/3]} rotation={[0, -Math.PI / 2, 0]} />
        </>
      )}

      {roomType === 'lab' && (
        <>
          <LabEquipment position={[0, 0, -3]} />
          <LabEquipment position={[0, 0, 3]} />
          <Desk position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Chair position={[-3.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Bookshelf position={[width/2 - 0.3, 1.25, 0]} rotation={[0, -Math.PI / 2, 0]} />
        </>
      )}

      {roomType === 'meeting' && (
        <>
          <ConferenceTable position={[0, 0, 0]} />
          <Chair position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <Chair position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Chair position={[1.2, 0, 1.3]} rotation={[0, Math.PI, 0]} />
          <Chair position={[-1.2, 0, 1.3]} rotation={[0, Math.PI, 0]} />
          <Chair position={[1.2, 0, -1.3]} />
          <Chair position={[-1.2, 0, -1.3]} />
          <Whiteboard position={[0, 2.5, -depth/2 + 0.15]} />
        </>
      )}

      {roomType === 'lobby' && (
        <>
          {/* Reception desk */}
          <mesh position={[0, 0.9, -5]} castShadow>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshStandardMaterial color="#8b4513" roughness={0.5} />
          </mesh>
          <Chair position={[0, 0, -4]} rotation={[0, Math.PI, 0]} />
          
          {/* Waiting area */}
          {[[-4, 0, 4], [-2, 0, 4], [2, 0, 4], [4, 0, 4]].map((pos, i) => (
            <Chair key={i} position={pos} rotation={[0, 0, 0]} />
          ))}
          
          {/* Coffee table */}
          <mesh position={[0, 0.4, 5]} castShadow>
            <cylinderGeometry args={[1, 1, 0.1]} />
            <meshStandardMaterial color="#654321" roughness={0.4} />
          </mesh>
          
          {/* Potted plants */}
          {[[-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6]].map((pos, i) => (
            <group key={i} position={pos}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.6]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              <mesh position={[0, 0.9, 0]} castShadow>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#22c55e" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </>
      )}
    </group>
  );
};

/**
 * Lighting Setup Component
 * 
 * Configures scene lighting for realistic rendering.
 * Uses a combination of ambient, directional, and point lights.
 * 
 * Lighting best practices:
 * - Ambient light provides base illumination (avoid pure black shadows)
 * - Directional light simulates sun/main light source with shadows
 * - Point lights for local illumination (lamps, screens, etc.)
 * - Keep shadow map resolution balanced (performance vs quality)
 */
const Lighting = () => {
  return (
    <>
      {/* Ambient light - soft overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light - simulates sunlight */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill lights - reduce harsh shadows */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Hemisphere light - gradient from sky to ground color */}
      <hemisphereLight args={['#87CEEB', '#8B4513', 0.6]} />
    </>
  );
};

/**
 * Main VirtualHQ Component Export
 * 
 * Orchestrates the entire 3D scene including:
 * - Canvas setup and renderer configuration
 * - Camera controls and positioning
 * - Scene lighting and environment
 * - Room geometry and hotspots
 * - Post-processing effects
 * 
 * Performance optimizations:
 * - Suspense for lazy loading 3D assets
 * - Shadow map optimization (limited resolution)
 * - Efficient state management (minimal re-renders)
 * - Use of instancing for repeated geometry (future enhancement)
 * 
 * @param {Object} props
 * @param {Function} props.onRoomEnter - Callback when user enters a room
 * @param {Function} props.onHotspotClick - Callback for hotspot interactions
 */
/**
 * Camera Animation Component
 * Smoothly animates camera to target position when room changes
 */
const CameraController = ({ targetRoom }) => {
  const controlsRef = useRef();
  
  // Define camera positions for each room
  const roomPositions = {
    lobby: { position: [0, 5, 15], target: [0, 0, 0] },
    office: { position: [25, 5, 15], target: [25, 0, 0] },
    lab: { position: [-25, 5, 15], target: [-25, 0, 0] },
    meeting: { position: [0, 5, 35], target: [0, 0, 25] }
  };

  React.useEffect(() => {
    if (!controlsRef.current) return;
    
    const targetPos = roomPositions[targetRoom];
    if (!targetPos) return;

    // Smooth camera animation using GSAP-like interpolation
    const startPos = {
      x: controlsRef.current.object.position.x,
      y: controlsRef.current.object.position.y,
      z: controlsRef.current.object.position.z
    };
    const startTarget = {
      x: controlsRef.current.target.x,
      y: controlsRef.current.target.y,
      z: controlsRef.current.target.z
    };

    let frame = 0;
    const totalFrames = 60; // 1 second at 60fps

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-in-out cubic easing
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate camera position
      controlsRef.current.object.position.x = startPos.x + (targetPos.position[0] - startPos.x) * eased;
      controlsRef.current.object.position.y = startPos.y + (targetPos.position[1] - startPos.y) * eased;
      controlsRef.current.object.position.z = startPos.z + (targetPos.position[2] - startPos.z) * eased;

      // Interpolate camera target (look-at point)
      controlsRef.current.target.x = startTarget.x + (targetPos.target[0] - startTarget.x) * eased;
      controlsRef.current.target.y = startTarget.y + (targetPos.target[1] - startTarget.y) * eased;
      controlsRef.current.target.z = startTarget.z + (targetPos.target[2] - startTarget.z) * eased;

      controlsRef.current.update();

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [targetRoom]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={50}
      maxPolarAngle={Math.PI / 2}
    />
  );
};

const VirtualHQ = ({ onRoomEnter, onHotspotClick }) => {
  const [currentRoom, setCurrentRoom] = useState('lobby');

  const handleHotspotClick = (roomId) => {
    setCurrentRoom(roomId);
    if (onRoomEnter) onRoomEnter(roomId);
    if (onHotspotClick) onHotspotClick(roomId);
  };

  return (
    <div className="virtual-hq-container" style={{ width: '100%', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 75 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera controls with smooth animation */}
          <CameraController targetRoom={currentRoom} />

          {/* Sky background - creates realistic outdoor lighting */}
          <Sky sunPosition={[100, 20, 100]} />

          {/* Lighting setup */}
          <Lighting />

          {/* Environment map for reflections */}
          <Environment preset="city" background={false} />

          {/* Room geometry */}
          <Room position={[0, 0, 0]} size={[20, 5, 20]} roomType="lobby" />
          <Room position={[25, 0, 0]} size={[15, 5, 15]} roomType="office" />
          <Room position={[-25, 0, 0]} size={[15, 5, 15]} roomType="lab" />
          <Room position={[0, 0, 25]} size={[12, 5, 12]} roomType="meeting" />

          {/* Interactive hotspots */}
          <Hotspot
            position={[8, 1.5, 0]}
            label="Office Wing →"
            onClick={() => handleHotspotClick('office')}
            color="#4f46e5"
          />
          <Hotspot
            position={[-8, 1.5, 0]}
            label="← Research Lab"
            onClick={() => handleHotspotClick('lab')}
            color="#10b981"
          />
          <Hotspot
            position={[0, 1.5, 8]}
            label="Meeting Room ↑"
            onClick={() => handleHotspotClick('meeting')}
            color="#f59e0b"
          />

          {/* Post-processing effects for visual polish */}
          <EffectComposer>
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.9} 
              luminanceSmoothing={0.9} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI overlay for room information */}
      <div className="room-info">
        <h3>Current Location: {currentRoom.toUpperCase()}</h3>
        <p>Click on glowing markers to navigate between rooms</p>
        {currentRoom !== 'lobby' && (
          <button 
            onClick={() => handleHotspotClick('lobby')}
            className="return-button"
          >
            ← Return to Lobby
          </button>
        )}
      </div>

      {/* Navigation menu */}
      <div className="navigation-menu">
        <h4>Quick Navigation</h4>
        <button 
          onClick={() => handleHotspotClick('lobby')}
          className={`nav-btn ${currentRoom === 'lobby' ? 'active' : ''}`}
        >
          🏛️ Lobby
        </button>
        <button 
          onClick={() => handleHotspotClick('office')}
          className={`nav-btn ${currentRoom === 'office' ? 'active' : ''}`}
        >
          💼 Office Wing
        </button>
        <button 
          onClick={() => handleHotspotClick('lab')}
          className={`nav-btn ${currentRoom === 'lab' ? 'active' : ''}`}
        >
          🔬 Research Lab
        </button>
        <button 
          onClick={() => handleHotspotClick('meeting')}
          className={`nav-btn ${currentRoom === 'meeting' ? 'active' : ''}`}
        >
          👥 Meeting Room
        </button>
      </div>

      <style jsx>{`
        .virtual-hq-container {
          position: relative;
          background: #000;
        }

        .room-info {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .room-info h3 {
          margin: 0 0 5px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .room-info p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }

        .return-button {
          margin-top: 12px;
          padding: 8px 16px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .return-button:hover {
          background: #4338ca;
          transform: translateX(-2px);
        }

        .navigation-menu {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          min-width: 180px;
        }

        .navigation-menu h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .nav-btn {
          display: block;
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          transition: all 0.3s;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateX(2px);
        }

        .nav-btn.active {
          background: #4f46e5;
          border-color: #4f46e5;
          font-weight: 600;
        }

        .hotspot-label {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          pointer-events: none;
        }

        .loading-container {
          text-align: center;
          color: white;
        }

        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VirtualHQ;

/**
 * Usage Example:
 * 
 * import VirtualHQ from './components/3d/VirtualHQ';
 * 
 * function App() {
 *   const handleRoomEnter = (roomId) => {
 *     console.log('Entered room:', roomId);
 *     // Update analytics, load room-specific data, etc.
 *   };
 *   
 *   return (
 *     <VirtualHQ 
 *       onRoomEnter={handleRoomEnter}
 *       onHotspotClick={(id) => console.log('Clicked:', id)}
 *     />
 *   );
 * }
 * 
 * Future Enhancements:
 * - Replace primitive geometries with GLTF models
 * - Add collision detection for realistic movement
 * - Implement minimap overlay
 * - Add multiplayer avatar system
 * - Integrate with WebXR for VR/AR support
 * - Add sound effects and spatial audio
 * - Implement LOD (Level of Detail) for performance
 */

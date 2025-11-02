import React from 'react';
import VirtualHQ from '../components/3d/VirtualHQ';

/**
 * Virtual HQ Page
 * 
 * Full-screen 3D virtual headquarters experience.
 */
const VirtualHQPage = () => {
  const handleRoomEnter = (roomId) => {
    console.log('Entered room:', roomId);
    // Track analytics, load room-specific data, etc.
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <VirtualHQ onRoomEnter={handleRoomEnter} />
    </div>
  );
};

export default VirtualHQPage;

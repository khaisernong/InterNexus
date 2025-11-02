import React from 'react';
import { Card, Avatar, Descriptions, Button } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

/**
 * Profile Page
 * 
 * User profile and settings.
 */
const ProfilePage = () => {
  // TODO: Get user from auth context
  const mockUser = {
    name: 'Demo User',
    email: 'demo@internexus.com',
    role: 'Researcher',
    institution: 'University of Tsukuba Malaysia',
    department: 'Transdisciplinary Science and Design',
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <h2 style={{ marginTop: '16px' }}>{mockUser.name}</h2>
          <p style={{ color: '#8c8c8c' }}>{mockUser.role}</p>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">
            <MailOutlined /> {mockUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Institution">
            {mockUser.institution}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {mockUser.department}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button type="primary">Edit Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

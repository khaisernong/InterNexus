import React from 'react';
import { Layout, Button, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/internexus-logo.png';

const { Header } = Layout;

/**
 * Application Header
 * 
 * Top navigation bar with user menu.
 */
const AppHeader = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => navigate('/login'),
    },
  ];

  return (
    <Header style={{
      padding: '0 24px',
      background: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={logo} 
            alt="InterNexus Logo" 
            style={{ height: '40px', width: 'auto' }}
          />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#0f4c81',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            InterNexus
          </span>
        </div>
      </div>

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Avatar
          style={{ cursor: 'pointer', backgroundColor: '#4f46e5' }}
          icon={<UserOutlined />}
        />
      </Dropdown>
    </Header>
  );
};

export default AppHeader;

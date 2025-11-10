import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  CommentOutlined,
  ReadOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

/**
 * Application Sidebar
 * 
 * Navigation menu for the application.
 */
const AppSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/virtual-hq',
      icon: <HomeOutlined />,
      label: 'Virtual HQ',
    },
    {
      key: '/collaborate',
      icon: <CommentOutlined />,
      label: 'Collaborate',
    },
    {
      key: '/partners',
      icon: <GlobalOutlined />,
      label: 'Partners',
    },
    {
      key: '/news-feed',
      icon: <ReadOutlined />,
      label: 'Research Feed',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{
        height: 64,
        margin: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
      }}>
        {collapsed ? 'IN' : 'InterNexus'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;

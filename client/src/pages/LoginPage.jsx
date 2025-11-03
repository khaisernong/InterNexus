import React from 'react';
import { Card, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/internexus-logo.png';

/**
 * Login Page
 * 
 * User authentication.
 */
const LoginPage = () => {
  const onFinish = (values) => {
    console.log('Login:', values);
    // TODO: Implement authentication
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card
        style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
      >
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          paddingBottom: '24px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <img 
            src={logo} 
            alt="InterNexus Logo" 
            style={{ height: '80px', width: 'auto', marginBottom: '16px' }}
          />
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px',
            fontWeight: '600',
            color: '#0f4c81',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            InterNexus
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: '14px' }}>
            National Interdisciplinary Research Collaboration Platform
          </p>
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

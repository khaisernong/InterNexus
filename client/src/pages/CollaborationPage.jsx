import React, { useState } from 'react';
import { Card, Input, Button, Avatar, List, Row, Col, Tag, Tabs, Table, Badge } from 'antd';
import { TeamOutlined, SendOutlined, UserOutlined, MessageOutlined, ExperimentOutlined, BookOutlined } from '@ant-design/icons';

/**
 * Collaboration Page
 * 
 * Simple collaboration workspace featuring:
 * - Team chat interface
 * - Mutual authors and collaborators
 * - Collaboration tools
 */

// Mutual authors data from all partner universities
// Updated to match the latest data from Partners page
const MUTUAL_AUTHORS = [
  // University of Malaya
  { university: "University of Malaya", name: "Prof. Dato' Dr. Adeeba Kamarulzaman", field: "Infectious Diseases & HIV Research", papers: 256, status: 'active' },
  { university: "University of Malaya", name: "Prof. Dr. Julia Patrick Engkasan", field: "Rehabilitation Medicine & Medical Ethics", papers: 178, status: 'active' },
  { university: "University of Malaya", name: "Prof. Dr. Umah Rani Kuppusamy", field: "Biomedical Science & Clinical Chemistry", papers: 198, status: 'active' },
  { university: "University of Malaya", name: "Dr. Rumana Akhter Saifi", field: "Epidemiology & Public Health", papers: 134, status: 'active' },
  
  // University of Tsukuba Malaysia
  { university: "University of Tsukuba Malaysia", name: "Prof. Tsujimura Maki", field: "Hydrology & Water Resources Management", papers: 89, status: 'active' },
  { university: "University of Tsukuba Malaysia", name: "Prof. Suzuki Iwane", field: "Plant Molecular Biology & Synthetic Biology", papers: 124, status: 'active' },
  { university: "University of Tsukuba Malaysia", name: "Prof. Tezuka Taro", field: "Machine Learning & Computational Neuroscience", papers: 78, status: 'active' },
  { university: "University of Tsukuba Malaysia", name: "Prof. Mochiyama Hiromi", field: "Robotics & Haptics Engineering", papers: 95, status: 'active' },
  
  // Taylor's University
  { university: "Taylor's University", name: "Prof. Dr. Neethiahnanthan Ari Ragavan", field: "Social Sciences & Management", papers: 145, status: 'active' },
  { university: "Taylor's University", name: "Prof. Dr. Anindita Dasgupta", field: "Liberal Arts & International Relations", papers: 128, status: 'active' },
  { university: "Taylor's University", name: "Prof. Dr. Rozainee Khairudin", field: "Psychology & Counselling", papers: 134, status: 'active' },
  { university: "Taylor's University", name: "Prof. Dr. Jatswan Singh", field: "Performing Arts & Cultural Studies", papers: 98, status: 'active' },
  
  // Universiti Sains Malaysia
  { university: "Universiti Sains Malaysia", name: "Prof. Dr. Ramona Ramli", field: "Computer Science & Software Engineering", papers: 145, status: 'active' },
  { university: "Universiti Sains Malaysia", name: "Prof. Dr. Zainab Abu Bakar", field: "Information Systems & Data Analytics", papers: 167, status: 'active' },
  { university: "Universiti Sains Malaysia", name: "Assoc. Prof. Dr. Hazrina Binti Abdullah", field: "Network Security & Computer Vision", papers: 128, status: 'active' },
  { university: "Universiti Sains Malaysia", name: "Dr. Chong Shin Horng", field: "Artificial Intelligence & Machine Learning", papers: 134, status: 'active' },
  
  // Universiti Putra Malaysia
  { university: "Universiti Putra Malaysia", name: "Prof. Dato' Dr. Abdul Shukor Juraimi", field: "Sustainable Agriculture & Weed Science", papers: 287, status: 'active' },
  { university: "Universiti Putra Malaysia", name: "Prof. Dr. Fatimah Md. Yusoff", field: "Aquaculture & Marine Biotechnology", papers: 194, status: 'active' },
  { university: "Universiti Putra Malaysia", name: "Prof. Dr. Mohd Yazid Abdul Manap", field: "Food Science & Nutrition", papers: 156, status: 'active' },
  { university: "Universiti Putra Malaysia", name: "Prof. Dr. Samsul Bahari Mohd Noor", field: "IoT & Precision Farming", papers: 78, status: 'active' },
  
  // Universiti Teknologi Malaysia
  { university: "Universiti Teknologi Malaysia", name: "Prof. Dr. Mohd Fadzil Hassan", field: "Computer Science & Software Engineering", papers: 142, status: 'active' },
  { university: "Universiti Teknologi Malaysia", name: "Prof. Ir. Dr. Azlan Abd Aziz", field: "Electronic Engineering & IoT", papers: 128, status: 'active' },
  { university: "Universiti Teknologi Malaysia", name: "Prof. Dr. Habibollah Haron", field: "Artificial Intelligence & Data Science", papers: 156, status: 'active' },
  { university: "Universiti Teknologi Malaysia", name: "Prof. Dr. Normaziah Abdul Aziz", field: "Information Systems & Digital Innovation", papers: 119, status: 'active' },
  
  // Sunway University
  { university: "Sunway University", name: "Prof. Dr. Sibrandes Poppema", field: "Medical Research & Healthcare Management", papers: 542, status: 'active' },
  { university: "Sunway University", name: "Prof. Dr. Elizabeth Lee", field: "Psychology & Mental Health", papers: 148, status: 'active' },
  { university: "Sunway University", name: "Dr. Wong Shaw Voon", field: "Pharmacy & Pharmaceutical Sciences", papers: 67, status: 'active' },
  { university: "Sunway University", name: "Prof. Dr. Puvaneswaran Kunasekaran", field: "Tourism & Hospitality Management", papers: 72, status: 'active' },
  
  // Monash University Malaysia
  { university: "Monash University Malaysia", name: "Prof. Andrew Walker", field: "Tropical Medicine & Global Health", papers: 218, status: 'active' },
  { university: "Monash University Malaysia", name: "Prof. Dr. Yam Mun Fei", field: "Pharmaceutical Sciences & Drug Development", papers: 178, status: 'active' },
  { university: "Monash University Malaysia", name: "Prof. Dr. Lee Soo Ying", field: "Chemistry & Material Science", papers: 145, status: 'active' },
  { university: "Monash University Malaysia", name: "Dr. Umapagan Ampikaipakan", field: "Medical Sciences & Genomics", papers: 98, status: 'active' },
  
  // University of Nottingham Malaysia
  { university: "University of Nottingham Malaysia", name: "Prof. Christine Ennew", field: "Marketing & Financial Services", papers: 98, status: 'active' },
  { university: "University of Nottingham Malaysia", name: "Prof. Graham Kendall", field: "Computer Science & Optimization", papers: 234, status: 'active' },
  { university: "University of Nottingham Malaysia", name: "Prof. Dr. Tsung-Cheng Lin", field: "Information Systems & Technology Management", papers: 145, status: 'active' },
  { university: "University of Nottingham Malaysia", name: "Dr. Jeya Chandra Sittampalam", field: "Business & Sustainability Management", papers: 89, status: 'active' },
  
  // Xiamen University Malaysia
  { university: "Xiamen University Malaysia", name: "Prof. Dr. Darren Ong Chung Lee", field: "Mathematics & Spectral Theory", papers: 134, status: 'active' },
  { university: "Xiamen University Malaysia", name: "Prof. Dr. Teo Lee Peng", field: "Mathematical Physics & Number Theory", papers: 145, status: 'active' },
  { university: "Xiamen University Malaysia", name: "Assoc. Prof. Dr. Peter Zeiner", field: "Mathematical Crystallography", papers: 98, status: 'active' },
  { university: "Xiamen University Malaysia", name: "Assoc. Prof. Dr. Chin Wen Cheong", field: "Applied Statistics & Financial Analysis", papers: 112, status: 'active' },
  
  // Multimedia University
  { university: "Multimedia University", name: "Dr. Alvis Chan Man Seong", field: "Management & Business Analytics", papers: 78, status: 'active' },
  { university: "Multimedia University", name: "Dr. Diyana Abdul Mahad", field: "Finance & Corporate Management", papers: 92, status: 'active' },
  { university: "Multimedia University", name: "Ms. Noor Shahaliza Othman", field: "Marketing & Consumer Behavior", papers: 65, status: 'active' },
  { university: "Multimedia University", name: "Dr. Nadira Mohamed Isa", field: "Economics & Business Strategy", papers: 84, status: 'active' },
  
  // Universiti Kebangsaan Malaysia
  { university: "Universiti Kebangsaan Malaysia", name: "Prof. Dato' Dr. Mazlan Othman", field: "Astrophysics & Space Science", papers: 145, status: 'active' },
  { university: "Universiti Kebangsaan Malaysia", name: "Prof. Dato' Dr. Asmah Haji Omar", field: "Malay Language & Linguistics", papers: 167, status: 'active' },
  { university: "Universiti Kebangsaan Malaysia", name: "Prof. Dr. Shamsul Amri Baharuddin", field: "Social Sciences & Ethnic Studies", papers: 198, status: 'active' },
  { university: "Universiti Kebangsaan Malaysia", name: "Prof. Dr. Siti Hajar Abdul Aziz", field: "Islamic Studies & Strategic Studies", papers: 134, status: 'active' },
  
  // Universiti Teknologi Petronas
  { university: "Universiti Teknologi Petronas", name: "Prof. Ir. Dr. Hilmi Mukhtar", field: "Chemical Engineering & Gas Separation", papers: 298, status: 'active' },
  { university: "Universiti Teknologi Petronas", name: "Prof. Dr. Mohamad Azmi Bustam", field: "Chemical Engineering & Green Technology", papers: 267, status: 'active' },
  { university: "Universiti Teknologi Petronas", name: "Assoc. Prof. Ir. Dr. Haslinda Zabiri", field: "Process Control & Automation", papers: 178, status: 'active' },
  { university: "Universiti Teknologi Petronas", name: "Assoc. Prof. Dr. Lam Man Kee", field: "Biomass & Renewable Energy", papers: 156, status: 'active' },
  
  // Universiti Tunku Abdul Rahman
  { university: "Universiti Tunku Abdul Rahman", name: "Prof. Ir. Dr. Lee Sze Wei", field: "Civil & Environmental Engineering", papers: 156, status: 'active' },
  { university: "Universiti Tunku Abdul Rahman", name: "Prof. Dr. Goi Bok Min", field: "Chemical Engineering & Wastewater Treatment", papers: 178, status: 'active' },
  { university: "Universiti Tunku Abdul Rahman", name: "Prof. Ts. Dr. Ewe Hong Tat", field: "Electrical & Electronic Engineering", papers: 134, status: 'active' },
  { university: "Universiti Tunku Abdul Rahman", name: "Prof. Dr. Tan Wooi Haw", field: "Computer Science & Data Analytics", papers: 145, status: 'active' },
  
  // INTI University
  { university: "INTI University", name: "Dr. Joseph Lee Yu Kuang", field: "Economics & Education Management", papers: 98, status: 'active' },
  { university: "INTI University", name: "Dr. Tan Ai Lean", field: "Business & Marketing Strategy", papers: 76, status: 'active' },
  { university: "INTI University", name: "Dr. Lim Chee Chong", field: "Engineering & Technology", papers: 82, status: 'active' },
  { university: "INTI University", name: "Dr. Wong Kok Sheik", field: "Computing & Information Technology", papers: 89, status: 'active' },
  
  // Asia Pacific University
  { university: "Asia Pacific University of Technology & Innovation", name: "Dr. Selvakumar Manickam", field: "Cybersecurity & Network Security", papers: 98, status: 'active' },
  { university: "Asia Pacific University of Technology & Innovation", name: "Prof. Dr. Anshu Sharma", field: "Information Technology & Innovation", papers: 112, status: 'active' },
  { university: "Asia Pacific University of Technology & Innovation", name: "Dr. Tan Soo Fun", field: "Software Engineering & Cloud Computing", papers: 67, status: 'active' },
  { university: "Asia Pacific University of Technology & Innovation", name: "Dr. Mazliham Mohd Su'ud", field: "Data Science & Business Intelligence", papers: 89, status: 'active' },
];

const CollaborationPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the collaboration workspace!', time: '10:00 AM' },
    { id: 2, user: 'Demo User', text: 'Hello team!', time: '10:05 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      user: 'Demo User',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const onlineUsers = [
    { id: 1, name: 'Demo User', status: 'online' },
    { id: 2, name: 'Team Member 1', status: 'online' },
    { id: 3, name: 'Team Member 2', status: 'away' },
  ];

  // Table columns for mutual authors
  const authorColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'University',
      dataIndex: 'university',
      key: 'university',
      filters: [...new Set(MUTUAL_AUTHORS.map(a => a.university))].map(u => ({ text: u, value: u })),
      onFilter: (value, record) => record.university === value,
    },
    {
      title: 'Research Field',
      dataIndex: 'field',
      key: 'field',
      ellipsis: true,
    },
    {
      title: 'Joint Papers',
      dataIndex: 'papers',
      key: 'papers',
      sorter: (a, b) => a.papers - b.papers,
      render: (papers) => (
        <Badge 
          count={papers} 
          style={{ backgroundColor: papers > 150 ? '#52c41a' : papers > 80 ? '#1890ff' : '#faad14' }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 600 }}>
        <TeamOutlined /> Collaboration Workspace
      </h1>

      {/* Tabs for different sections */}
      <Tabs
        defaultActiveKey="chat"
        items={[
          {
            key: 'chat',
            label: <span><MessageOutlined /> Team Chat</span>,
            children: (
              <Row gutter={16}>
        {/* Online Users Panel */}
        <Col xs={24} md={6}>
          <Card 
            title={<><UserOutlined /> Online Users</>}
            style={{ marginBottom: '16px' }}
          >
            <List
              dataSource={onlineUsers}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ 
                          backgroundColor: user.status === 'online' ? '#52c41a' : '#faad14' 
                        }}
                      />
                    }
                    title={user.name}
                    description={
                      <Tag color={user.status === 'online' ? 'green' : 'orange'}>
                        {user.status}
                      </Tag>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Chat Panel */}
        <Col xs={24} md={18}>
          <Card 
            title={<><MessageOutlined /> Team Chat</>}
            style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Messages Area */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '16px',
              background: '#fafafa',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{ 
                    marginBottom: '16px',
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  <Avatar icon={<UserOutlined />} />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <strong>{msg.user}</strong>
                      <span style={{ fontSize: '12px', color: '#999' }}>{msg.time}</span>
                    </div>
                    <div style={{ 
                      background: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onPressEnter={sendMessage}
                size="large"
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={sendMessage}
                size="large"
              >
                Send
              </Button>
            </div>
          </Card>
        </Col>
              </Row>
            ),
          },
          {
            key: 'authors',
            label: <span><ExperimentOutlined /> Mutual Authors ({MUTUAL_AUTHORS.length})</span>,
            children: (
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <h2><BookOutlined /> Research Collaborators</h2>
                  <p style={{ color: '#666' }}>
                    Distinguished researchers and faculty members from our partner universities 
                    actively collaborating with InterNexus on joint publications and research projects.
                  </p>
                  <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={6}>
                      <Card style={{ background: '#e6f7ff', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '32px', margin: 0, color: '#1890ff' }}>
                          {MUTUAL_AUTHORS.length}
                        </h3>
                        <p style={{ margin: 0, color: '#666' }}>Total Collaborators</p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card style={{ background: '#f6ffed', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '32px', margin: 0, color: '#52c41a' }}>
                          {MUTUAL_AUTHORS.reduce((sum, a) => sum + a.papers, 0)}
                        </h3>
                        <p style={{ margin: 0, color: '#666' }}>Joint Publications</p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card style={{ background: '#fff7e6', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '32px', margin: 0, color: '#faad14' }}>
                          {[...new Set(MUTUAL_AUTHORS.map(a => a.university))].length}
                        </h3>
                        <p style={{ margin: 0, color: '#666' }}>Partner Universities</p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card style={{ background: '#f9f0ff', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '32px', margin: 0, color: '#722ed1' }}>
                          {[...new Set(MUTUAL_AUTHORS.map(a => a.field))].length}
                        </h3>
                        <p style={{ margin: 0, color: '#666' }}>Research Fields</p>
                      </Card>
                    </Col>
                  </Row>
                </div>
                
                <Table
                  columns={authorColumns}
                  dataSource={MUTUAL_AUTHORS.map((author, index) => ({ ...author, key: index }))}
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} authors` }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Info Banner */}
      <Card style={{ marginTop: '16px', background: '#e6f7ff', borderColor: '#91d5ff' }}>
        <p style={{ margin: 0 }}>
          <strong>💡 Collaboration Features:</strong> Real-time chat, file sharing, 
          whiteboard, and video calls will be available when connected to the backend server.
        </p>
      </Card>
    </div>
  );
};

export default CollaborationPage;

import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Tabs, Table, Tag, Select } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  TrophyOutlined, 
  FileTextOutlined, 
  DollarOutlined, 
  TeamOutlined,
  RiseOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

/**
 * Analytics Page
 * 
 * Comprehensive analytics and impact metrics dashboard featuring:
 * - Research impact metrics (h-index, citations, impact factor)
 * - Publication statistics (by year, type, and discipline)
 * - Funding breakdown and trends
 * - Collaboration network analysis
 * - Trend analysis and forecasting
 * - Performance indicators
 */

// Mock data for analytics
const researchImpactData = {
  totalCitations: 15847,
  hIndex: 42,
  impactFactor: 8.7,
  citationsGrowth: 23.5,
  publicationsThisYear: 156,
  topCitedPaper: "AI Applications in Healthcare",
  averageCitationsPerPaper: 45.3
};

const publicationsByYear = [
  { year: '2019', publications: 98, citations: 2340 },
  { year: '2020', publications: 112, citations: 3120 },
  { year: '2021', publications: 134, citations: 4580 },
  { year: '2022', publications: 145, citations: 5890 },
  { year: '2023', publications: 162, citations: 7240 },
  { year: '2024', publications: 178, citations: 8965 },
];

const publicationsByType = [
  { name: 'Journal Articles', value: 425, color: '#1890ff' },
  { name: 'Conference Papers', value: 312, color: '#52c41a' },
  { name: 'Book Chapters', value: 87, color: '#faad14' },
  { name: 'Patents', value: 45, color: '#f5222d' },
  { name: 'Technical Reports', value: 62, color: '#722ed1' },
];

const fundingBySource = [
  { source: 'Government Grants', amount: 4.5, percentage: 35, color: '#1890ff' },
  { source: 'Industry Partners', amount: 3.8, percentage: 30, color: '#52c41a' },
  { source: 'International Funding', amount: 2.6, percentage: 20, color: '#faad14' },
  { source: 'University Research Fund', amount: 1.9, percentage: 15, color: '#722ed1' },
];

const fundingTrend = [
  { year: '2019', amount: 8.2 },
  { year: '2020', amount: 9.5 },
  { year: '2021', amount: 10.8 },
  { year: '2022', amount: 11.4 },
  { year: '2023', amount: 12.1 },
  { year: '2024', amount: 12.8 },
];

const collaborationData = [
  { subject: 'North America', A: 95, fullMark: 100 },
  { subject: 'Europe', A: 88, fullMark: 100 },
  { subject: 'Asia Pacific', A: 92, fullMark: 100 },
  { subject: 'Middle East', A: 65, fullMark: 100 },
  { subject: 'Latin America', A: 58, fullMark: 100 },
  { subject: 'Africa', A: 45, fullMark: 100 },
];

const topCollaborators = [
  { rank: 1, institution: 'MIT', country: 'USA', network: 'Ivy League', projects: 24, publications: 67 },
  { rank: 2, institution: 'Stanford University', country: 'USA', network: 'Ivy Plus', projects: 21, publications: 58 },
  { rank: 3, institution: 'University of Cambridge', country: 'UK', network: 'Russell Group', projects: 19, publications: 52 },
  { rank: 4, institution: 'ETH Zurich', country: 'Switzerland', network: 'IDEA League', projects: 17, publications: 48 },
  { rank: 5, institution: 'National University of Singapore', country: 'Singapore', network: 'APRU', projects: 16, publications: 45 },
  { rank: 6, institution: 'University of Melbourne', country: 'Australia', network: 'Group of Eight', projects: 15, publications: 42 },
  { rank: 7, institution: 'University of Toronto', country: 'Canada', network: 'U15', projects: 14, publications: 39 },
  { rank: 8, institution: 'Tsinghua University', country: 'China', network: 'C9 League', projects: 13, publications: 37 },
  { rank: 9, institution: 'University of Tokyo', country: 'Japan', network: 'RU11', projects: 12, publications: 35 },
  { rank: 10, institution: 'Imperial College London', country: 'UK', network: 'Russell Group', projects: 11, publications: 33 },
];

const universityNetworkStats = [
  { network: 'ASEAN University Network (AUN)', partners: 16, projects: 48, publications: 124 },
  { network: 'Russell Group', partners: 3, projects: 35, publications: 98 },
  { network: 'Group of Eight (Go8)', partners: 2, projects: 28, publications: 76 },
  { network: 'Ivy League / Ivy Plus', partners: 4, projects: 42, publications: 112 },
  { network: 'Universitas 21 (U21)', partners: 5, projects: 38, publications: 95 },
  { network: 'Association of Pacific Rim Universities (APRU)', partners: 6, projects: 44, publications: 108 },
  { network: 'Association of Commonwealth Universities (ACU)', partners: 12, projects: 52, publications: 136 },
  { network: 'C9 League (China)', partners: 2, projects: 25, publications: 68 },
];

const researchTrends = [
  { month: 'Jan', AI: 28, Robotics: 22, IoT: 18, Blockchain: 12 },
  { month: 'Feb', AI: 32, Robotics: 24, IoT: 20, Blockchain: 14 },
  { month: 'Mar', AI: 35, Robotics: 26, IoT: 22, Blockchain: 16 },
  { month: 'Apr', AI: 38, Robotics: 28, IoT: 24, Blockchain: 18 },
  { month: 'May', AI: 42, Robotics: 30, IoT: 26, Blockchain: 20 },
  { month: 'Jun', AI: 45, Robotics: 32, IoT: 28, Blockchain: 22 },
];

const AnalyticsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const collaboratorColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => <Tag color={rank <= 3 ? 'gold' : 'blue'}>#{rank}</Tag>
    },
    {
      title: 'Institution',
      dataIndex: 'institution',
      key: 'institution',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network) => <Tag color="purple">{network}</Tag>
    },
    {
      title: 'Joint Projects',
      dataIndex: 'projects',
      key: 'projects',
      sorter: (a, b) => a.projects - b.projects,
    },
    {
      title: 'Co-Publications',
      dataIndex: 'publications',
      key: 'publications',
      sorter: (a, b) => a.publications - b.publications,
    },
  ];

  const networkColumns = [
    {
      title: 'University Network',
      dataIndex: 'network',
      key: 'network',
      render: (network) => <strong>{network}</strong>
    },
    {
      title: 'Partner Institutions',
      dataIndex: 'partners',
      key: 'partners',
      sorter: (a, b) => a.partners - b.partners,
      render: (partners) => <Tag color="blue">{partners}</Tag>
    },
    {
      title: 'Active Projects',
      dataIndex: 'projects',
      key: 'projects',
      sorter: (a, b) => a.projects - b.projects,
    },
    {
      title: 'Collaborative Publications',
      dataIndex: 'publications',
      key: 'publications',
      sorter: (a, b) => a.publications - b.publications,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 600 }}>
        <LineChartOutlined /> Analytics Dashboard
      </h1>

      {/* Key Metrics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Citations"
              value={researchImpactData.totalCitations}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
              suffix={<ArrowUpOutlined style={{ fontSize: '14px' }} />}
            />
            <Progress 
              percent={researchImpactData.citationsGrowth} 
              size="small" 
              status="active"
              format={(percent) => `+${percent}% YoY`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="H-Index"
              value={researchImpactData.hIndex}
              valueStyle={{ color: '#1890ff' }}
              prefix={<RiseOutlined />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              Impact Factor: {researchImpactData.impactFactor}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Publications (2024)"
              value={researchImpactData.publicationsThisYear}
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
              suffix={<ArrowUpOutlined style={{ fontSize: '14px' }} />}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              Avg. Citations: {researchImpactData.averageCitationsPerPaper}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Funding"
              value={12.8}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="M MYR"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              +8.5% from last year
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Analytics Tabs */}
      <Tabs
        defaultActiveKey="1"
        size="large"
        items={[
          {
            key: '1',
            label: '📊 Research Impact',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Publications & Citations Trend" bordered={false}>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={publicationsByYear}>
                        <defs>
                          <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCites" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="publications" 
                          stroke="#1890ff" 
                          fillOpacity={1} 
                          fill="url(#colorPubs)" 
                          name="Publications"
                        />
                        <Area 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="citations" 
                          stroke="#52c41a" 
                          fillOpacity={1} 
                          fill="url(#colorCites)" 
                          name="Citations"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Publications by Type" bordered={false}>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={publicationsByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {publicationsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <Tag color="blue">Total: 931 Publications</Tag>
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            label: '💰 Funding Analysis',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Funding Trend (Million MYR)" bordered={false}>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={fundingTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#722ed1" 
                          strokeWidth={3}
                          name="Total Funding"
                          dot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Funding Sources Breakdown" bordered={false}>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={fundingBySource} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="source" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="amount" name="Amount (M MYR)">
                          {fundingBySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            label: '🤝 Collaboration Network',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Global Collaboration Coverage" bordered={false}>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={collaborationData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="Collaboration Strength" 
                          dataKey="A" 
                          stroke="#1890ff" 
                          fill="#1890ff" 
                          fillOpacity={0.6} 
                        />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card 
                    title="Top 10 Research Collaborators" 
                    bordered={false}
                    extra={<TeamOutlined style={{ fontSize: '20px' }} />}
                  >
                    <Table 
                      columns={collaboratorColumns} 
                      dataSource={topCollaborators} 
                      pagination={false}
                      rowKey="rank"
                      size="small"
                      scroll={{ y: 380 }}
                    />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card 
                    title="University Network Partnerships" 
                    bordered={false}
                    extra={<Tag color="purple">8 Major Networks</Tag>}
                  >
                    <Table 
                      columns={networkColumns} 
                      dataSource={universityNetworkStats} 
                      pagination={false}
                      rowKey="network"
                      size="middle"
                    />
                    <div style={{ marginTop: '16px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                      <h4 style={{ marginBottom: '12px' }}>Network Highlights:</h4>
                      <Row gutter={[16, 8]}>
                        <Col xs={24} md={8}>
                          <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                            <strong>🌏 ASEAN Focus:</strong> Leading regional collaboration with 16 partner institutions
                          </div>
                        </Col>
                        <Col xs={24} md={8}>
                          <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                            <strong>🇬🇧 Russell Group:</strong> Strong ties with UK's premier research universities
                          </div>
                        </Col>
                        <Col xs={24} md={8}>
                          <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                            <strong>🎓 Ivy League:</strong> Partnerships with top US institutions for research excellence
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '4',
            label: '📈 Research Trends',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card 
                    title="Research Activity by Domain (2024)" 
                    bordered={false}
                    extra={
                      <Select 
                        defaultValue="2024" 
                        style={{ width: 120 }}
                        onChange={setSelectedYear}
                      >
                        <Select.Option value="2024">2024</Select.Option>
                        <Select.Option value="2023">2023</Select.Option>
                        <Select.Option value="2022">2022</Select.Option>
                      </Select>
                    }
                  >
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={researchTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="AI" stroke="#1890ff" strokeWidth={2} />
                        <Line type="monotone" dataKey="Robotics" stroke="#52c41a" strokeWidth={2} />
                        <Line type="monotone" dataKey="IoT" stroke="#faad14" strokeWidth={2} />
                        <Line type="monotone" dataKey="Blockchain" stroke="#722ed1" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Key Insights & Forecasting" bordered={false}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <div className="insight-card">
                          <h4>🚀 AI Research Leading</h4>
                          <p>AI publications increased by 45% this year, with projected growth of 60% in 2025</p>
                        </div>
                      </Col>
                      <Col xs={24} md={8}>
                        <div className="insight-card">
                          <h4>🔗 Blockchain Emerging</h4>
                          <p>Blockchain research showing steady 15% quarterly growth, emerging as key focus area</p>
                        </div>
                      </Col>
                      <Col xs={24} md={8}>
                        <div className="insight-card">
                          <h4>🌍 Global Expansion</h4>
                          <p>Collaborations with 47 countries, targeting 60+ by end of 2025</p>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      <style jsx>{`
        .insight-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          height: 100%;
        }
        
        .insight-card h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: white;
        }
        
        .insight-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;

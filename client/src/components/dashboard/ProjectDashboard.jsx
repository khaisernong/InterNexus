import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, ProjectOutlined,
  TeamOutlined, DollarOutlined, RocketOutlined
} from '@ant-design/icons';

/**
 * ProjectDashboard Component
 * 
 * Comprehensive dashboard for tracking projects, resources, and KPIs.
 * Displays real-time metrics, charts, and project status information.
 * 
 * Design Principles:
 * - Information hierarchy: Most important KPIs at the top
 * - Visual grouping: Related metrics grouped together
 * - Interactive elements: Drill-down capabilities for detailed views
 * - Responsive design: Adapts to different screen sizes
 * - Accessibility: ARIA labels, keyboard navigation, high contrast
 * 
 * Technology Choices:
 * - Recharts: D3-based React charting library (simple API, good performance)
 * - Ant Design: Enterprise UI components with built-in accessibility
 * 
 * Alternatives considered:
 * - D3.js directly: More flexible but requires more code
 * - Chart.js: Canvas-based, slightly better performance but less React-friendly
 * - Victory: Similar to Recharts, slightly more customization options
 * - Plotly.js: Great for scientific/statistical charts but larger bundle size
 * 
 * State Management:
 * - Local state with useState for simple data
 * - Consider Redux/Zustand for complex cross-component state
 * - React Query/SWR for server state management and caching
 */

// Color palette for charts - ensures visual consistency and accessibility
const COLORS = {
  primary: '#4f46e5',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

// Chart color array for pie/donut charts
const CHART_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.info, COLORS.purple, COLORS.pink];

/**
 * KPI Card Component
 * 
 * Displays a single key performance indicator with trend indicator.
 * Reusable component following DRY principle.
 * 
 * @param {Object} props
 * @param {string} props.title - KPI title
 * @param {number} props.value - Current value
 * @param {number} props.trend - Percentage change (positive/negative)
 * @param {string} props.prefix - Value prefix (e.g., '$', '#')
 * @param {string} props.suffix - Value suffix (e.g., '%', 'K')
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.color - Theme color
 */
const KPICard = ({ title, value, trend, prefix, suffix, icon, color = COLORS.primary }) => {
  const isPositive = trend >= 0;
  
  return (
    <Card hoverable className="kpi-card">
      <Statistic
        title={title}
        value={value}
        precision={0}
        valueStyle={{ color }}
        prefix={icon}
        suffix={suffix}
      />
      <div className="kpi-trend">
        {isPositive ? (
          <ArrowUpOutlined style={{ color: COLORS.success }} />
        ) : (
          <ArrowDownOutlined style={{ color: COLORS.danger }} />
        )}
        <span style={{ color: isPositive ? COLORS.success : COLORS.danger }}>
          {Math.abs(trend)}%
        </span>
        <span style={{ marginLeft: 8, color: '#8c8c8c' }}>vs last month</span>
      </div>
    </Card>
  );
};

/**
 * Project Timeline Chart
 * 
 * Visualizes project progress over time using an area chart.
 * Shows multiple metrics in a single view for comparison.
 */
const ProjectTimelineChart = ({ data }) => {
  return (
    <Card title="Project Activity Timeline" className="chart-card">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#8c8c8c' }}
            label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tick={{ fill: '#8c8c8c' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="projects" 
            stroke={COLORS.primary} 
            fillOpacity={1} 
            fill="url(#colorProjects)" 
            name="Active Projects"
          />
          <Area 
            type="monotone" 
            dataKey="tasks" 
            stroke={COLORS.success} 
            fillOpacity={1} 
            fill="url(#colorTasks)" 
            name="Completed Tasks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

/**
 * Resource Allocation Chart
 * 
 * Displays how resources are distributed across projects.
 * Uses a bar chart for easy comparison.
 */
const ResourceAllocationChart = ({ data }) => {
  return (
    <Card title="Resource Allocation by Department" className="chart-card">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" tick={{ fill: '#8c8c8c' }} />
          <YAxis tick={{ fill: '#8c8c8c' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Bar dataKey="allocated" fill={COLORS.primary} name="Allocated" />
          <Bar dataKey="available" fill={COLORS.success} name="Available" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

/**
 * Project Status Distribution
 * 
 * Pie chart showing the distribution of project statuses.
 * Helps quickly identify bottlenecks or issues.
 */
const ProjectStatusChart = ({ data }) => {
  const RADIAN = Math.PI / 180;
  
  // Custom label rendering for better readability
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card title="Project Status Distribution" className="chart-card">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

/**
 * Active Projects Table
 * 
 * Displays detailed information about current projects.
 * Allows sorting, filtering, and drill-down into project details.
 * 
 * Accessibility features:
 * - Keyboard navigation (arrow keys, tab)
 * - Screen reader support via Ant Design's built-in ARIA labels
 * - High contrast mode support
 */
const ActiveProjectsTable = ({ projects, onProjectClick }) => {
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <a onClick={() => onProjectClick && onProjectClick(text)}>{text}</a>,
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      render: (team) => <Tag color="blue">{team}</Tag>,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      sorter: (a, b) => a.progress - b.progress,
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small"
          strokeColor={{
            '0%': COLORS.primary,
            '100%': COLORS.success,
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'On Track', value: 'on-track' },
        { text: 'At Risk', value: 'at-risk' },
        { text: 'Delayed', value: 'delayed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colorMap = {
          'on-track': 'success',
          'at-risk': 'warning',
          'delayed': 'error',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
  ];

  return (
    <Card title="Active Projects" className="table-card">
      <Table 
        columns={columns} 
        dataSource={projects}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

/**
 * Main ProjectDashboard Component
 * 
 * Orchestrates all dashboard widgets and manages data flow.
 * In production, data would come from API calls using React Query or similar.
 */
const ProjectDashboard = () => {
  // Mock data - replace with API calls in production
  // Consider using React Query: const { data } = useQuery('projects', fetchProjects);
  const [kpiData, setKpiData] = useState({
    activeProjects: 24,
    projectsTrend: 12.5,
    teamMembers: 156,
    membersTrend: 8.3,
    budget: 2450000,
    budgetTrend: -3.2,
    completion: 78,
    completionTrend: 15.7,
  });

  const [timelineData, setTimelineData] = useState([
    { month: 'Jan', projects: 15, tasks: 120 },
    { month: 'Feb', projects: 18, tasks: 145 },
    { month: 'Mar', projects: 20, tasks: 168 },
    { month: 'Apr', projects: 22, tasks: 189 },
    { month: 'May', projects: 24, tasks: 210 },
    { month: 'Jun', projects: 24, tasks: 225 },
  ]);

  const [resourceData, setResourceData] = useState([
    { department: 'Engineering', allocated: 45, available: 15 },
    { department: 'Research', allocated: 32, available: 8 },
    { department: 'Design', allocated: 28, available: 12 },
    { department: 'Marketing', allocated: 18, available: 7 },
    { department: 'Operations', allocated: 25, available: 10 },
  ]);

  const [statusData, setStatusData] = useState([
    { name: 'Completed', value: 12 },
    { name: 'In Progress', value: 18 },
    { name: 'Planning', value: 8 },
    { name: 'On Hold', value: 3 },
  ]);

  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'AI Research Platform', 
      team: 'Engineering', 
      progress: 85, 
      status: 'on-track',
      deadline: '2025-12-15'
    },
    { 
      id: 2, 
      name: 'Global Partnership Portal', 
      team: 'Research', 
      progress: 65, 
      status: 'at-risk',
      deadline: '2025-11-30'
    },
    { 
      id: 3, 
      name: 'Data Visualization Suite', 
      team: 'Design', 
      progress: 92, 
      status: 'on-track',
      deadline: '2025-11-15'
    },
    { 
      id: 4, 
      name: 'Collaboration Tools', 
      team: 'Engineering', 
      progress: 45, 
      status: 'delayed',
      deadline: '2025-12-01'
    },
    { 
      id: 5, 
      name: 'Impact Metrics Dashboard', 
      team: 'Analytics', 
      progress: 78, 
      status: 'on-track',
      deadline: '2025-11-20'
    },
  ]);

  // Simulate real-time data updates
  // In production, use WebSocket or polling for live data
  useEffect(() => {
    const interval = setInterval(() => {
      // Update random KPI to simulate real-time changes
      setKpiData(prev => ({
        ...prev,
        activeProjects: prev.activeProjects + Math.floor(Math.random() * 2) - 1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleProjectClick = (projectName) => {
    console.log('Project clicked:', projectName);
    // Navigate to project detail page or open modal
  };

  return (
    <div className="project-dashboard">
      {/* KPI Overview Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Projects"
            value={kpiData.activeProjects}
            trend={kpiData.projectsTrend}
            icon={<ProjectOutlined />}
            color={COLORS.primary}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Team Members"
            value={kpiData.teamMembers}
            trend={kpiData.membersTrend}
            icon={<TeamOutlined />}
            color={COLORS.success}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Budget"
            value={kpiData.budget / 1000}
            trend={kpiData.budgetTrend}
            prefix="$"
            suffix="K"
            icon={<DollarOutlined />}
            color={COLORS.warning}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Avg. Completion"
            value={kpiData.completion}
            trend={kpiData.completionTrend}
            suffix="%"
            icon={<RocketOutlined />}
            color={COLORS.info}
          />
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ProjectTimelineChart data={timelineData} />
        </Col>
        <Col xs={24} lg={12}>
          <ResourceAllocationChart data={resourceData} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ProjectStatusChart data={statusData} />
        </Col>
        <Col xs={24} lg={12}>
          {/* Placeholder for additional chart */}
          <Card title="Team Performance" className="chart-card">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#8c8c8c' }}>Performance metrics chart coming soon...</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Projects Table */}
      <Row>
        <Col span={24}>
          <ActiveProjectsTable projects={projects} onProjectClick={handleProjectClick} />
        </Col>
      </Row>

      <style jsx>{`
        .project-dashboard {
          padding: 24px;
          background: #f0f2f5;
          min-height: 100vh;
        }

        .kpi-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .kpi-trend {
          margin-top: 12px;
          font-size: 14px;
        }

        .chart-card,
        .table-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .project-dashboard {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDashboard;

/**
 * Usage Example:
 * 
 * import ProjectDashboard from './components/dashboard/ProjectDashboard';
 * 
 * function App() {
 *   return <ProjectDashboard />;
 * }
 * 
 * Future Enhancements:
 * - Add drill-down functionality to charts (click to filter)
 * - Implement export to PDF/Excel
 * - Add date range picker for historical data
 * - Integrate with backend API using React Query
 * - Add real-time WebSocket updates
 * - Implement dashboard customization (drag-and-drop widgets)
 * - Add dark mode support
 * - Create mobile-optimized view
 * - Add data refresh indicators
 * - Implement advanced filtering and search
 */

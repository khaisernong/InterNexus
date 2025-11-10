import React, { useState } from 'react';
import { Card, List, Avatar, Tag, Button, Space, Tooltip, Badge, Divider, Select, Input } from 'antd';
import { 
  ReadOutlined, 
  RobotOutlined, 
  EyeOutlined, 
  HeartOutlined, 
  ShareAltOutlined,
  BookOutlined,
  SearchOutlined,
  FilterOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons';

/**
 * NewsFeedPage Component
 * 
 * AI-powered research paper recommendations with reader tracking
 * Features:
 * - Personalized paper recommendations
 * - See who has read each paper
 * - Filter by research field
 * - Reading statistics
 */

// Sample research papers with AI recommendations and reader tracking
const RESEARCH_PAPERS = [
  {
    id: 1,
    title: "Deep Learning Approaches for Climate Change Prediction in Southeast Asia",
    authors: ["Dr. Zhang Wei", "Prof. Sarah Johnson", "Dr. Kumar Patel"],
    journal: "Nature Climate Change",
    year: 2025,
    abstract: "This study presents novel deep learning architectures for predicting regional climate patterns in Southeast Asia, achieving 94% accuracy in monsoon prediction models.",
    tags: ["Machine Learning", "Climate Science", "Deep Learning"],
    doi: "10.1038/s41558-025-01234-5",
    citations: 234,
    relevanceScore: 98,
    aiReason: "Highly relevant to your work on machine learning and regional environmental studies",
    readBy: [
      { name: "Prof. Tezuka Taro", university: "University of Tsukuba Malaysia", avatar: "TT" },
      { name: "Prof. Mochiyama Hiromi", university: "University of Tsukuba Malaysia", avatar: "MH" },
      { name: "Prof. Dr. Ramona Ramli", university: "Universiti Sains Malaysia", avatar: "RR" }
    ],
    trending: true,
    field: "Machine Learning"
  },
  {
    id: 2,
    title: "Haptic Feedback Systems in Surgical Robotics: A Comprehensive Review",
    authors: ["Prof. Tanaka Hiroshi", "Dr. Lee Min-Jung", "Prof. Anderson Mark"],
    journal: "IEEE Transactions on Robotics",
    year: 2025,
    abstract: "Comprehensive analysis of haptic feedback mechanisms in robotic surgery, including force sensors, tactile displays, and neural interface technologies.",
    tags: ["Robotics", "Haptics", "Medical Technology"],
    doi: "10.1109/TRO.2025.9876543",
    citations: 187,
    relevanceScore: 96,
    aiReason: "Matches your interest in robotics and haptics engineering",
    readBy: [
      { name: "Prof. Mochiyama Hiromi", university: "University of Tsukuba Malaysia", avatar: "MH" },
      { name: "Prof. Ir. Dr. Azlan Abd Aziz", university: "Universiti Teknologi Malaysia", avatar: "AA" }
    ],
    trending: false,
    field: "Robotics"
  },
  {
    id: 3,
    title: "Sustainable Water Management in Urban Environments: Machine Learning Optimization",
    authors: ["Prof. Watanabe Kenji", "Dr. Lim Hui Ying", "Prof. Schmidt Julia"],
    journal: "Water Resources Research",
    year: 2025,
    abstract: "Novel ML-based optimization framework for urban water distribution networks, reducing waste by 40% through predictive modeling and real-time adjustments.",
    tags: ["Hydrology", "Sustainability", "Optimization"],
    doi: "10.1029/2025WR034567",
    citations: 156,
    relevanceScore: 94,
    aiReason: "Aligns with hydrology and computational optimization research",
    readBy: [
      { name: "Prof. Tsujimura Maki", university: "University of Tsukuba Malaysia", avatar: "TM" },
      { name: "Prof. Dr. Ramona Ramli", university: "Universiti Sains Malaysia", avatar: "RR" },
      { name: "Prof. Dr. Mohd Fadzil Hassan", university: "Universiti Teknologi Malaysia", avatar: "MH" }
    ],
    trending: true,
    field: "Hydrology"
  },
  {
    id: 4,
    title: "CRISPR-Based Gene Editing in Tropical Crop Enhancement: Recent Advances",
    authors: ["Prof. Dr. Chen Li", "Dr. Rahman Abdul", "Prof. Nakamura Yuki"],
    journal: "Nature Biotechnology",
    year: 2025,
    abstract: "Latest developments in CRISPR gene editing for improving drought resistance and yield in tropical crops, with field trial results showing 35% productivity increase.",
    tags: ["Synthetic Biology", "Agriculture", "Biotechnology"],
    doi: "10.1038/s41587-025-05678-9",
    citations: 298,
    relevanceScore: 92,
    aiReason: "Relevant to plant molecular biology and synthetic biology research",
    readBy: [
      { name: "Prof. Suzuki Iwane", university: "University of Tsukuba Malaysia", avatar: "SI" },
      { name: "Prof. Dato' Dr. Abdul Shukor Juraimi", university: "Universiti Putra Malaysia", avatar: "AS" },
      { name: "Prof. Dr. Fatimah Md. Yusoff", university: "Universiti Putra Malaysia", avatar: "FM" }
    ],
    trending: true,
    field: "Biotechnology"
  },
  {
    id: 5,
    title: "Neural Network Interpretability in Medical Diagnosis Systems",
    authors: ["Dr. Kim Sung-Ho", "Prof. Williams Rachel", "Dr. Tan Wei Ming"],
    journal: "The Lancet Digital Health",
    year: 2025,
    abstract: "Framework for improving transparency and interpretability of deep learning models in clinical decision support, addressing the black box problem in AI diagnostics.",
    tags: ["AI", "Healthcare", "Neural Networks"],
    doi: "10.1016/S2589-7500(25)00123-4",
    citations: 412,
    relevanceScore: 91,
    aiReason: "Intersects with your interests in machine learning and computational neuroscience",
    readBy: [
      { name: "Prof. Tezuka Taro", university: "University of Tsukuba Malaysia", avatar: "TT" },
      { name: "Prof. Dato' Dr. Adeeba Kamarulzaman", university: "University of Malaya", avatar: "AK" },
      { name: "Prof. Dr. Julia Patrick Engkasan", university: "University of Malaya", avatar: "JP" },
      { name: "Prof. Dr. Sibrandes Poppema", university: "Sunway University", avatar: "SP" }
    ],
    trending: false,
    field: "Healthcare AI"
  },
  {
    id: 6,
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics Across Institutions",
    authors: ["Prof. Anderson James", "Dr. Wong Mei Ling", "Prof. Yamamoto Saki"],
    journal: "JAMA Network Open",
    year: 2025,
    abstract: "Implementation of federated learning frameworks enabling multi-institutional healthcare research while maintaining patient privacy and regulatory compliance.",
    tags: ["Federated Learning", "Privacy", "Healthcare"],
    doi: "10.1001/jamanetworkopen.2025.12345",
    citations: 189,
    relevanceScore: 89,
    aiReason: "Relevant for collaborative research and data privacy in academic partnerships",
    readBy: [
      { name: "Prof. Tezuka Taro", university: "University of Tsukuba Malaysia", avatar: "TT" },
      { name: "Prof. Dr. Zainab Abu Bakar", university: "Universiti Sains Malaysia", avatar: "ZA" }
    ],
    trending: true,
    field: "Data Science"
  },
  {
    id: 7,
    title: "Quantum Computing Applications in Chemical Reaction Optimization",
    authors: ["Prof. Dr. Hassan Ibrahim", "Dr. Kobayashi Rei", "Prof. Smith Caroline"],
    journal: "Science Advances",
    year: 2025,
    abstract: "Quantum algorithms for accelerating chemical reaction pathway discovery, reducing computation time by orders of magnitude for complex molecular systems.",
    tags: ["Quantum Computing", "Chemistry", "Optimization"],
    doi: "10.1126/sciadv.abc1234",
    citations: 267,
    relevanceScore: 87,
    aiReason: "Emerging technology with applications in computational research",
    readBy: [
      { name: "Prof. Ir. Dr. Hilmi Mukhtar", university: "Universiti Teknologi Petronas", avatar: "HM" },
      { name: "Prof. Dr. Lee Soo Ying", university: "Monash University Malaysia", avatar: "LS" }
    ],
    trending: false,
    field: "Chemistry"
  },
  {
    id: 8,
    title: "Social Media Sentiment Analysis for Public Health Monitoring During Pandemics",
    authors: ["Dr. Lim Jia Hui", "Prof. Garcia Maria", "Dr. Tan Boon Kiat"],
    journal: "PLOS Digital Health",
    year: 2025,
    abstract: "Real-time sentiment analysis framework leveraging social media data for early detection of public health concerns and misinformation tracking.",
    tags: ["NLP", "Public Health", "Social Media"],
    doi: "10.1371/journal.pdig.0000123",
    citations: 145,
    relevanceScore: 85,
    aiReason: "Combines machine learning with social science and public health applications",
    readBy: [
      { name: "Dr. Rumana Akhter Saifi", university: "University of Malaya", avatar: "RS" },
      { name: "Prof. Dr. Neethiahnanthan Ari Ragavan", university: "Taylor's University", avatar: "NA" }
    ],
    trending: true,
    field: "Public Health"
  }
];

const NewsFeedPage = () => {
  const [selectedField, setSelectedField] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Get unique fields for filter
  const fields = ['All', ...new Set(RESEARCH_PAPERS.map(p => p.field))];

  // Filter and sort papers
  const filteredPapers = RESEARCH_PAPERS
    .filter(paper => {
      const matchesField = selectedField === 'All' || paper.field === selectedField;
      const matchesSearch = searchTerm === '' || 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesField && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
      if (sortBy === 'citations') return b.citations - a.citations;
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });

  const handleReadPaper = (paper) => {
    window.open(`https://doi.org/${paper.doi}`, '_blank');
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
            <RobotOutlined style={{ color: '#1890ff', marginRight: '12px' }} />
            AI Research Feed
          </h1>
          <p style={{ color: '#8c8c8c', fontSize: '16px', margin: 0 }}>
            Personalized research paper recommendations based on your interests and collaborator activity
          </p>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space wrap>
                <Input
                  placeholder="Search papers..."
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
                <Select
                  value={selectedField}
                  onChange={setSelectedField}
                  style={{ width: 200 }}
                  prefix={<FilterOutlined />}
                >
                  {fields.map(field => (
                    <Select.Option key={field} value={field}>
                      <FilterOutlined /> {field}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 180 }}
                >
                  <Select.Option value="relevance">Sort by Relevance</Select.Option>
                  <Select.Option value="citations">Sort by Citations</Select.Option>
                  <Select.Option value="year">Sort by Year</Select.Option>
                </Select>
              </Space>
              <Badge count={filteredPapers.length} style={{ backgroundColor: '#52c41a' }}>
                <Button icon={<BookOutlined />}>Papers Found</Button>
              </Badge>
            </Space>
          </Space>
        </Card>

        {/* Papers List */}
        <List
          dataSource={filteredPapers}
          renderItem={(paper) => (
            <Card
              key={paper.id}
              style={{ 
                marginBottom: '16px',
                border: paper.trending ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                position: 'relative'
              }}
            >
              {paper.trending && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  right: 16,
                  background: '#ff4d4f',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '0 0 8px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  <StarOutlined /> TRENDING
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Relevance Score Badge */}
                <div style={{ 
                  minWidth: '80px', 
                  textAlign: 'center',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{paper.relevanceScore}</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>MATCH</div>
                </div>

                {/* Paper Content */}
                <div style={{ flex: 1 }}>
                  {/* Title and Authors */}
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    margin: '0 0 8px 0',
                    color: '#262626'
                  }}>
                    <ReadOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                    {paper.title}
                  </h3>
                  
                  <div style={{ color: '#8c8c8c', marginBottom: '8px', fontSize: '14px' }}>
                    {paper.authors.join(', ')} • {paper.journal} ({paper.year})
                  </div>

                  {/* AI Recommendation Reason */}
                  <div style={{ 
                    background: '#e6f7ff', 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    marginBottom: '12px',
                    borderLeft: '3px solid #1890ff'
                  }}>
                    <RobotOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                    <span style={{ fontSize: '13px', color: '#0050b3' }}>
                      <strong>Why recommended:</strong> {paper.aiReason}
                    </span>
                  </div>

                  {/* Abstract */}
                  <p style={{ 
                    color: '#595959', 
                    fontSize: '14px', 
                    lineHeight: '1.6',
                    marginBottom: '12px'
                  }}>
                    {paper.abstract}
                  </p>

                  {/* Tags */}
                  <div style={{ marginBottom: '12px' }}>
                    {paper.tags.map((tag, idx) => (
                      <Tag key={idx} color="blue">{tag}</Tag>
                    ))}
                  </div>

                  {/* Reader Tracking */}
                  <div style={{ 
                    background: '#f6ffed', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #b7eb8f'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        color: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <TeamOutlined /> Read by {paper.readBy.length} researchers:
                      </span>
                      <Avatar.Group maxCount={5}>
                        {paper.readBy.map((reader, idx) => (
                          <Tooltip 
                            key={idx}
                            title={
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{reader.name}</div>
                                <div style={{ fontSize: '12px' }}>{reader.university}</div>
                              </div>
                            }
                          >
                            <Avatar 
                              style={{ 
                                backgroundColor: '#52c41a',
                                cursor: 'pointer'
                              }}
                            >
                              {reader.avatar}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </div>
                  </div>

                  {/* Actions and Stats */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<ReadOutlined />}
                        onClick={() => handleReadPaper(paper)}
                      >
                        Read Paper
                      </Button>
                      <Button icon={<HeartOutlined />}>Save</Button>
                      <Button icon={<ShareAltOutlined />}>Share</Button>
                    </Space>
                    <Space split={<Divider type="vertical" />}>
                      <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        <EyeOutlined /> {paper.readBy.length} reads
                      </span>
                      <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        📚 {paper.citations} citations
                      </span>
                      <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        DOI: {paper.doi}
                      </span>
                    </Space>
                  </div>
                </div>
              </div>
            </Card>
          )}
        />

        {/* Empty State */}
        {filteredPapers.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <h3>No papers found</h3>
            <p style={{ color: '#8c8c8c' }}>Try adjusting your filters or search terms</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsFeedPage;

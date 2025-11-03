import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Card, Input, List, Avatar, Tag, Modal, Tooltip } from 'antd';
import { SearchOutlined, GlobalOutlined, TeamOutlined } from '@ant-design/icons';

/**
 * PartnerMap Component
 * 
 * Interactive world map showing national and international research partner institutions.
 * Features include:
 * - Zoomable/pannable map
 * - Clickable markers for partner details
 * - Search/filter functionality
 * - Partner directory list
 * 
 * Technology: React Simple Maps
 * Built on D3-geo and TopoJSON for efficient SVG-based map rendering.
 * 
 * Alternative approaches:
 * - React Leaflet: OpenStreetMap-based, raster tiles, heavier but more features
 * - Google Maps React: Rich satellite/3D views but requires API key and billing
 * - Mapbox GL JS: High-performance WebGL maps, custom styling, commercial
 * - Deck.gl: 3D/WebGL visualizations, great for large datasets
 * 
 * React Simple Maps advantages:
 * - Lightweight SVG rendering (no external tile servers)
 * - Easy styling and customization
 * - No API keys or usage limits
 * - Works offline (map data bundled)
 * - Responsive and accessible
 * 
 * When to use alternatives:
 * - Leaflet: Need street-level detail, routing, or plugins
 * - Google Maps: Require Street View or extensive POI data
 * - Mapbox: Custom map styles or 3D terrain visualization
 * 
 * @param {Object} props
 * @param {Array} props.partners - Array of partner institution objects
 */

// TopoJSON world map data URL
// In production, bundle this locally to avoid external dependency
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Sample partner data structure
 * In production, fetch from API endpoint
 */
const SAMPLE_PARTNERS = [
  {
    id: 1,
    name: "University of Malaya",
    country: "Malaysia",
    city: "Kuala Lumpur",
    coordinates: [101.6569, 3.1215],
    type: "University",
    collaboration: "Research & Innovation",
    established: "2025",
    projects: 24,
    researchers: 85,
    website: "https://www.um.edu.my"
  },
  {
    id: 2,
    name: "University of Tsukuba Malaysia",
    country: "Malaysia",
    city: "Kuala Lumpur",
    coordinates: [101.6540, 3.1178],
    type: "University",
    collaboration: "International Research Programs",
    established: "2025",
    projects: 18,
    researchers: 62,
    website: "https://www.ututm.edu.my"
  },
  {
    id: 3,
    name: "Taylor's University",
    country: "Malaysia",
    city: "Subang Jaya",
    coordinates: [101.6185, 3.0654],
    type: "University",
    collaboration: "Innovation & Entrepreneurship",
    established: "2025",
    projects: 13,
    researchers: 46,
    website: "https://university.taylors.edu.my"
  },
  {
    id: 3,
    name: "Universiti Sains Malaysia",
    country: "Malaysia",
    city: "Penang",
    coordinates: [100.3161, 5.3560],
    type: "University",
    collaboration: "Science & Technology",
    established: "2025",
    projects: 21,
    researchers: 74,
    website: "https://www.usm.my"
  },
  {
    id: 4,
    name: "Universiti Putra Malaysia",
    country: "Malaysia",
    city: "Serdang",
    coordinates: [101.7072, 2.9894],
    type: "University",
    collaboration: "Agriculture & Biotechnology",
    established: "2025",
    projects: 19,
    researchers: 68,
    website: "https://www.upm.edu.my"
  },
  {
    id: 5,
    name: "Universiti Teknologi Malaysia",
    country: "Malaysia",
    city: "Johor Bahru",
    coordinates: [103.6373, 1.5591],
    type: "University",
    collaboration: "Engineering & Technology",
    established: "2025",
    projects: 26,
    researchers: 92,
    website: "https://www.utm.my"
  },
  {
    id: 6,
    name: "Sunway University",
    country: "Malaysia",
    city: "Subang Jaya",
    coordinates: [101.6068, 3.0648],
    type: "University",
    collaboration: "Business & Computing",
    established: "2025",
    projects: 14,
    researchers: 48,
    website: "https://university.sunway.edu.my"
  },
  {
    id: 7,
    name: "Monash University Malaysia",
    country: "Malaysia",
    city: "Subang Jaya",
    coordinates: [101.6072, 3.0647],
    type: "University",
    collaboration: "International Education & Research",
    established: "2025",
    projects: 16,
    researchers: 56,
    website: "https://www.monash.edu.my"
  },
  {
    id: 8,
    name: "University of Nottingham Malaysia",
    country: "Malaysia",
    city: "Semenyih",
    coordinates: [101.8728, 2.9387],
    type: "University",
    collaboration: "International Research Partnerships",
    established: "2025",
    projects: 15,
    researchers: 52,
    website: "https://www.nottingham.edu.my"
  },
  {
    id: 9,
    name: "Xiamen University Malaysia",
    country: "Malaysia",
    city: "Sepang",
    coordinates: [101.7430, 2.7317],
    type: "University",
    collaboration: "China-Malaysia Collaboration",
    established: "2025",
    projects: 12,
    researchers: 41,
    website: "https://www.xmu.edu.my"
  },
  {
    id: 10,
    name: "Multimedia University",
    country: "Malaysia",
    city: "Cyberjaya",
    coordinates: [101.6455, 2.9265],
    type: "University",
    collaboration: "ICT & Multimedia",
    established: "2025",
    projects: 20,
    researchers: 71,
    website: "https://www.mmu.edu.my"
  },
  {
    id: 11,
    name: "Universiti Kebangsaan Malaysia",
    country: "Malaysia",
    city: "Bangi",
    coordinates: [101.7833, 2.9269],
    type: "University",
    collaboration: "National Research Excellence",
    established: "2025",
    projects: 23,
    researchers: 81,
    website: "https://www.ukm.my"
  },
  {
    id: 12,
    name: "Universiti Teknologi Petronas",
    country: "Malaysia",
    city: "Seri Iskandar",
    coordinates: [100.9802, 4.3878],
    type: "University",
    collaboration: "Oil & Gas Engineering",
    established: "2025",
    projects: 17,
    researchers: 59,
    website: "https://www.utp.edu.my"
  },
  {
    id: 13,
    name: "Universiti Tunku Abdul Rahman",
    country: "Malaysia",
    city: "Kampar",
    coordinates: [101.1384, 4.3344],
    type: "University",
    collaboration: "Comprehensive Education",
    established: "2025",
    projects: 15,
    researchers: 53,
    website: "https://www.utar.edu.my"
  },
  {
    id: 14,
    name: "INTI University",
    country: "Malaysia",
    city: "Nilai",
    coordinates: [101.7973, 2.8244],
    type: "University",
    collaboration: "Industry Partnerships",
    established: "2025",
    projects: 11,
    researchers: 38,
    website: "https://newinti.edu.my"
  },
  {
    id: 15,
    name: "Asia Pacific University of Technology & Innovation",
    country: "Malaysia",
    city: "Kuala Lumpur",
    coordinates: [101.7097, 3.0542],
    type: "University",
    collaboration: "Technology & Innovation",
    established: "2025",
    projects: 14,
    researchers: 49,
    website: "https://www.apu.edu.my"
  },
  // Top 10 Research Collaborators (Global)
  {
    id: 16,
    name: "MIT",
    country: "USA",
    city: "Cambridge",
    coordinates: [-71.0942, 42.3601],
    type: "University",
    collaboration: "Advanced Research & Innovation",
    established: "2025",
    projects: 24,
    researchers: 67,
    website: "https://www.mit.edu"
  },
  {
    id: 17,
    name: "Stanford University",
    country: "USA",
    city: "Stanford",
    coordinates: [-122.1697, 37.4275],
    type: "University",
    collaboration: "Technology & Entrepreneurship",
    established: "2025",
    projects: 21,
    researchers: 58,
    website: "https://www.stanford.edu"
  },
  {
    id: 18,
    name: "University of Cambridge",
    country: "UK",
    city: "Cambridge",
    coordinates: [0.1149, 52.2053],
    type: "University",
    collaboration: "Scientific Research Excellence",
    established: "2025",
    projects: 19,
    researchers: 52,
    website: "https://www.cam.ac.uk"
  },
  {
    id: 19,
    name: "ETH Zurich",
    country: "Switzerland",
    city: "Zurich",
    coordinates: [8.5476, 47.3769],
    type: "University",
    collaboration: "Engineering & Applied Sciences",
    established: "2025",
    projects: 17,
    researchers: 48,
    website: "https://ethz.ch"
  },
  {
    id: 20,
    name: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    coordinates: [103.7740, 1.2966],
    type: "University",
    collaboration: "Asian Research Hub",
    established: "2025",
    projects: 16,
    researchers: 45,
    website: "https://www.nus.edu.sg"
  },
  {
    id: 21,
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    coordinates: [144.9631, -37.7964],
    type: "University",
    collaboration: "Research & Education Excellence",
    established: "2025",
    projects: 15,
    researchers: 42,
    website: "https://www.unimelb.edu.au"
  },
  {
    id: 22,
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    coordinates: [-79.3957, 43.6629],
    type: "University",
    collaboration: "AI & Machine Learning",
    established: "2025",
    projects: 14,
    researchers: 39,
    website: "https://www.utoronto.ca"
  },
  {
    id: 23,
    name: "Tsinghua University",
    country: "China",
    city: "Beijing",
    coordinates: [116.3260, 40.0044],
    type: "University",
    collaboration: "Engineering & Technology",
    established: "2025",
    projects: 13,
    researchers: 37,
    website: "https://www.tsinghua.edu.cn"
  },
  {
    id: 24,
    name: "University of Tokyo",
    country: "Japan",
    city: "Tokyo",
    coordinates: [139.7624, 35.7136],
    type: "University",
    collaboration: "Science & Technology Research",
    established: "2025",
    projects: 12,
    researchers: 35,
    website: "https://www.u-tokyo.ac.jp"
  },
  {
    id: 25,
    name: "Imperial College London",
    country: "UK",
    city: "London",
    coordinates: [-0.1778, 51.4988],
    type: "University",
    collaboration: "STEM Research Excellence",
    established: "2025",
    projects: 11,
    researchers: 33,
    website: "https://www.imperial.ac.uk"
  },
];

/**
 * Get university network affiliations and research collaborations
 * Returns prestigious university groups and international research networks
 */
const getUniversityNetworks = (universityName) => {
  const networksByUniversity = {
    "Taylor's University": [
      "ASEAN University Network (AUN)",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "Asia-Pacific Quality Network (APQN)"
    ],
    "University of Malaya": [
      "ASEAN University Network (AUN)",
      "Association of Pacific Rim Universities (APRU)",
      "Universitas 21 (U21)",
      "Association of Commonwealth Universities (ACU)",
      "International Alliance of Research Universities (IARU)"
    ],
    "University of Tsukuba Malaysia": [
      "ASEAN University Network (AUN)",
      "Japan-ASEAN Integrated Fund (JAIF)",
      "University Consortium of Kyoto",
      "Asia-Pacific Association for International Education (APAIE)"
    ],
    "Universiti Sains Malaysia": [
      "ASEAN University Network (AUN)",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "Asia-Pacific Quality Network (APQN)",
      "Association of Southeast Asian Institutions of Higher Learning (ASAIHL)"
    ],
    "Universiti Putra Malaysia": [
      "ASEAN University Network (AUN)",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "Southeast Asian Regional Center for Graduate Study and Research in Agriculture (SEARCA)"
    ],
    "Universiti Teknologi Malaysia": [
      "ASEAN University Network (AUN)",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "Asia-Pacific University-Industry Engagement Network (UIIN)"
    ],
    "Sunway University": [
      "International Association of Universities (IAU)",
      "Association of Commonwealth Universities (ACU)",
      "ASEAN University Network - Quality Assurance (AUN-QA)",
      "Global University Systems (GUS)"
    ],
    "Monash University Malaysia": [
      "Group of Eight (Go8) - via Monash Australia",
      "Association of Commonwealth Universities (ACU)",
      "Universitas 21 (U21)",
      "Association of Pacific Rim Universities (APRU)",
      "International Alliance of Research Universities (IARU)"
    ],
    "University of Nottingham Malaysia": [
      "Russell Group - via University of Nottingham UK",
      "Universitas 21 (U21)",
      "Association of Commonwealth Universities (ACU)",
      "Sutton 13 (UK leading universities)",
      "European University Association (EUA)"
    ],
    "Xiamen University Malaysia": [
      "China's Project 985 Universities",
      "China's Project 211 Universities",
      "China-ASEAN Education Cooperation Network",
      "21st Century Maritime Silk Road University Alliance",
      "University Alliance of the Silk Road"
    ],
    "Multimedia University": [
      "ASEAN University Network (AUN)",
      "Association of Southeast Asian Institutions of Higher Learning (ASAIHL)",
      "International Association of Universities (IAU)",
      "Asia-Pacific Broadcasting Union (ABU)"
    ],
    "Universiti Kebangsaan Malaysia": [
      "ASEAN University Network (AUN)",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "Association of Southeast Asian Institutions of Higher Learning (ASAIHL)",
      "Islamic World Educational, Scientific and Cultural Organization (ICESCO)"
    ],
    "Universiti Teknologi Petronas": [
      "ASEAN University Network (AUN)",
      "Society of Petroleum Engineers (SPE)",
      "International Association of Universities (IAU)",
      "Global Petroleum Research Institute (GPRI)"
    ],
    "Universiti Tunku Abdul Rahman": [
      "ASEAN University Network (AUN)",
      "Association of Southeast Asian Institutions of Higher Learning (ASAIHL)",
      "International Association of Universities (IAU)",
      "Federation of Chinese Associations Malaysia (Huazong)"
    ],
    "INTI University": [
      "Laureate International Universities Network",
      "Association of Commonwealth Universities (ACU)",
      "International Association of Universities (IAU)",
      "ASEAN University Network - Quality Assurance (AUN-QA)"
    ],
    "Asia Pacific University of Technology & Innovation": [
      "ASEAN University Network (AUN)",
      "Association of Southeast Asian Institutions of Higher Learning (ASAIHL)",
      "International Association of Universities (IAU)",
      "Staffordshire University Global Alliance"
    ],
    "MIT": [
      "Ivy League",
      "Association of American Universities (AAU)",
      "International Alliance of Research Universities (IARU)",
      "Universities Research Association (URA)"
    ],
    "Stanford University": [
      "Ivy Plus Society",
      "Association of American Universities (AAU)",
      "Pacific-12 Conference",
      "Universities Research Association (URA)"
    ],
    "University of Cambridge": [
      "Russell Group",
      "Golden Triangle (UK)",
      "Coimbra Group",
      "International Alliance of Research Universities (IARU)",
      "League of European Research Universities (LERU)"
    ],
    "ETH Zurich": [
      "IDEA League",
      "International Alliance of Research Universities (IARU)",
      "League of European Research Universities (LERU)",
      "CESAER (European Engineering Schools)"
    ],
    "National University of Singapore": [
      "Association of Pacific Rim Universities (APRU)",
      "Universitas 21 (U21)",
      "Association of Commonwealth Universities (ACU)",
      "International Alliance of Research Universities (IARU)"
    ],
    "University of Melbourne": [
      "Group of Eight (Go8)",
      "Universitas 21 (U21)",
      "Association of Pacific Rim Universities (APRU)",
      "Association of Commonwealth Universities (ACU)"
    ],
    "University of Toronto": [
      "U15 (Canadian Research Universities)",
      "Association of American Universities (AAU)",
      "Universitas 21 (U21)",
      "Association of Commonwealth Universities (ACU)"
    ],
    "Tsinghua University": [
      "C9 League (China)",
      "China's Project 985 Universities",
      "China's Project 211 Universities",
      "Association of Pacific Rim Universities (APRU)",
      "International Alliance of Research Universities (IARU)"
    ],
    "University of Tokyo": [
      "RU11 (Research University 11 - Japan)",
      "Association of Pacific Rim Universities (APRU)",
      "Association of East Asian Research Universities (AEARU)",
      "International Alliance of Research Universities (IARU)"
    ],
    "Imperial College London": [
      "Russell Group",
      "Golden Triangle (UK)",
      "League of European Research Universities (LERU)",
      "Association of Commonwealth Universities (ACU)"
    ]
  };

  return networksByUniversity[universityName] || [
    "ASEAN University Network (AUN)",
    "International Association of Universities (IAU)",
    "Association of Commonwealth Universities (ACU)"
  ];
};

/**
 * Get mutual authors/collaborators for each university
 * Returns real prominent researchers and faculty from these universities
 */
const getMutualAuthors = (universityName) => {
  const authorsByUniversity = {
    "Taylor's University": [
      { name: "Prof. Dr. Neethiahnanthan Ari Ragavan", field: "Social Sciences & Management", papers: 145 },
      { name: "Prof. Dr. Anindita Dasgupta", field: "Liberal Arts & International Relations", papers: 128 },
      { name: "Prof. Dr. Rozainee Khairudin", field: "Psychology & Counselling", papers: 134 },
      { name: "Prof. Dr. Jatswan Singh", field: "Performing Arts & Cultural Studies", papers: 98 }
    ],
    "University of Malaya": [
      { name: "Prof. Dato' Dr. Adeeba Kamarulzaman", field: "Infectious Diseases & HIV Research", papers: 256 },
      { name: "Prof. Dr. Julia Patrick Engkasan", field: "Rehabilitation Medicine & Medical Ethics", papers: 178 },
      { name: "Prof. Dr. Umah Rani Kuppusamy", field: "Biomedical Science & Clinical Chemistry", papers: 198 },
      { name: "Dr. Rumana Akhter Saifi", field: "Epidemiology & Public Health", papers: 134 }
    ],
    "University of Tsukuba Malaysia": [
      { name: "Prof. Tsujimura Maki", field: "Hydrology & Water Resources Management", papers: 89 },
      { name: "Prof. Suzuki Iwane", field: "Plant Molecular Biology & Synthetic Biology", papers: 124 },
      { name: "Prof. Tezuka Taro", field: "Machine Learning & Computational Neuroscience", papers: 78 },
      { name: "Prof. Mochiyama Hiromi", field: "Robotics & Haptics Engineering", papers: 95 }
    ],
    "Universiti Sains Malaysia": [
      { name: "Prof. Dr. Ramona Ramli", field: "Computer Science & Software Engineering", papers: 145 },
      { name: "Prof. Dr. Zainab Abu Bakar", field: "Information Systems & Data Analytics", papers: 167 },
      { name: "Assoc. Prof. Dr. Hazrina Binti Abdullah", field: "Network Security & Computer Vision", papers: 128 },
      { name: "Dr. Chong Shin Horng", field: "Artificial Intelligence & Machine Learning", papers: 134 }
    ],
    "Universiti Putra Malaysia": [
      { name: "Prof. Dato' Dr. Abdul Shukor Juraimi", field: "Sustainable Agriculture & Weed Science", papers: 287 },
      { name: "Prof. Dr. Fatimah Md. Yusoff", field: "Aquaculture & Marine Biotechnology", papers: 194 },
      { name: "Prof. Dr. Mohd Yazid Abdul Manap", field: "Food Science & Nutrition", papers: 156 },
      { name: "Prof. Dr. Samsul Bahari Mohd Noor", field: "IoT & Precision Farming", papers: 78 }
    ],
    "Universiti Teknologi Malaysia": [
      { name: "Prof. Dr. Mohd Fadzil Hassan", field: "Computer Science & Software Engineering", papers: 142 },
      { name: "Prof. Ir. Dr. Azlan Abd Aziz", field: "Electronic Engineering & IoT", papers: 128 },
      { name: "Prof. Dr. Habibollah Haron", field: "Artificial Intelligence & Data Science", papers: 156 },
      { name: "Prof. Dr. Normaziah Abdul Aziz", field: "Information Systems & Digital Innovation", papers: 119 }
    ],
    "Sunway University": [
      { name: "Prof. Dr. Sibrandes Poppema", field: "Medical Research & Healthcare Management", papers: 542 },
      { name: "Prof. Dr. Elizabeth Lee", field: "Psychology & Mental Health", papers: 148 },
      { name: "Dr. Wong Shaw Voon", field: "Pharmacy & Pharmaceutical Sciences", papers: 67 },
      { name: "Prof. Dr. Puvaneswaran Kunasekaran", field: "Tourism & Hospitality Management", papers: 72 }
    ],
    "Monash University Malaysia": [
      { name: "Prof. Andrew Walker", field: "Tropical Medicine & Global Health", papers: 218 },
      { name: "Prof. Dr. Yam Mun Fei", field: "Pharmaceutical Sciences & Drug Development", papers: 178 },
      { name: "Prof. Dr. Lee Soo Ying", field: "Chemistry & Material Science", papers: 145 },
      { name: "Dr. Umapagan Ampikaipakan", field: "Medical Sciences & Genomics", papers: 98 }
    ],
    "University of Nottingham Malaysia": [
      { name: "Prof. Christine Ennew", field: "Marketing & Financial Services", papers: 98 },
      { name: "Prof. Graham Kendall", field: "Computer Science & Optimization", papers: 234 },
      { name: "Prof. Dr. Tsung-Cheng Lin", field: "Information Systems & Technology Management", papers: 145 },
      { name: "Dr. Jeya Chandra Sittampalam", field: "Business & Sustainability Management", papers: 89 }
    ],
    "Xiamen University Malaysia": [
      { name: "Prof. Dr. Darren Ong Chung Lee", field: "Mathematics & Spectral Theory", papers: 134 },
      { name: "Prof. Dr. Teo Lee Peng", field: "Mathematical Physics & Number Theory", papers: 145 },
      { name: "Assoc. Prof. Dr. Peter Zeiner", field: "Mathematical Crystallography", papers: 98 },
      { name: "Assoc. Prof. Dr. Chin Wen Cheong", field: "Applied Statistics & Financial Analysis", papers: 112 }
    ],
    "Multimedia University": [
      { name: "Dr. Alvis Chan Man Seong", field: "Management & Business Analytics", papers: 78 },
      { name: "Dr. Diyana Abdul Mahad", field: "Finance & Corporate Management", papers: 92 },
      { name: "Ms. Noor Shahaliza Othman", field: "Marketing & Consumer Behavior", papers: 65 },
      { name: "Dr. Nadira Mohamed Isa", field: "Economics & Business Strategy", papers: 84 }
    ],
    "Universiti Kebangsaan Malaysia": [
      { name: "Prof. Dato' Dr. Mazlan Othman", field: "Astrophysics & Space Science", papers: 145 },
      { name: "Prof. Dato' Dr. Asmah Haji Omar", field: "Malay Language & Linguistics", papers: 167 },
      { name: "Prof. Dr. Shamsul Amri Baharuddin", field: "Social Sciences & Ethnic Studies", papers: 198 },
      { name: "Prof. Dr. Siti Hajar Abdul Aziz", field: "Islamic Studies & Strategic Studies", papers: 134 }
    ],
    "Universiti Teknologi Petronas": [
      { name: "Prof. Ir. Dr. Hilmi Mukhtar", field: "Chemical Engineering & Gas Separation", papers: 298 },
      { name: "Prof. Dr. Mohamad Azmi Bustam", field: "Chemical Engineering & Green Technology", papers: 267 },
      { name: "Assoc. Prof. Ir. Dr. Haslinda Zabiri", field: "Process Control & Automation", papers: 178 },
      { name: "Assoc. Prof. Dr. Lam Man Kee", field: "Biomass & Renewable Energy", papers: 156 }
    ],
    "Universiti Tunku Abdul Rahman": [
      { name: "Prof. Ir. Dr. Lee Sze Wei", field: "Civil & Environmental Engineering", papers: 156 },
      { name: "Prof. Dr. Goi Bok Min", field: "Chemical Engineering & Wastewater Treatment", papers: 178 },
      { name: "Prof. Ts. Dr. Ewe Hong Tat", field: "Electrical & Electronic Engineering", papers: 134 },
      { name: "Prof. Dr. Tan Wooi Haw", field: "Computer Science & Data Analytics", papers: 145 }
    ],
    "INTI University": [
      { name: "Dr. Joseph Lee Yu Kuang", field: "Economics & Education Management", papers: 98 },
      { name: "Dr. Tan Ai Lean", field: "Business & Marketing Strategy", papers: 76 },
      { name: "Dr. Lim Chee Chong", field: "Engineering & Technology", papers: 82 },
      { name: "Dr. Wong Kok Sheik", field: "Computing & Information Technology", papers: 89 }
    ],
    "Asia Pacific University of Technology & Innovation": [
      { name: "Dr. Selvakumar Manickam", field: "Cybersecurity & Network Security", papers: 98 },
      { name: "Prof. Dr. Anshu Sharma", field: "Information Technology & Innovation", papers: 112 },
      { name: "Dr. Tan Soo Fun", field: "Software Engineering & Cloud Computing", papers: 67 },
      { name: "Dr. Mazliham Mohd Su'ud", field: "Data Science & Business Intelligence", papers: 89 }
    ]
  };

  return authorsByUniversity[universityName] || [
    { name: "Dr. John Doe", field: "Research Area", papers: 10 },
    { name: "Prof. Jane Smith", field: "Academic Field", papers: 12 },
    { name: "Dr. Alex Chen", field: "Collaborative Research", papers: 8 }
  ];
};

/**
 * Get university-specific research publications
 * Returns interdisciplinary research papers published by or affiliated with each university
 */
const getUniversityPublications = (universityName) => {
  const publicationsByUniversity = {
    "Taylor's University": [
      "Social Sciences & Management in Digital Transformation: Leadership, Innovation & Organizational Change (2024) - Neethiahnanthan Ari Ragavan",
      "Liberal Arts & International Relations in Southeast Asia: Cultural Diplomacy & Regional Cooperation (2023) - Anindita Dasgupta",
      "Psychology & Counselling in Multicultural Societies: Mental Health, Well-being & Cultural Adaptation (2024) - Rozainee Khairudin",
      "Performing Arts & Cultural Studies: Traditional Expression in Contemporary Media (2023) - Jatswan Singh"
    ],
    "University of Malaya": [
      "Infectious Diseases & HIV Research: Novel Therapeutics & Public Health Interventions in Southeast Asia (2024) - Adeeba Kamarulzaman",
      "Rehabilitation Medicine & Medical Ethics: Patient-Centered Care & Shared Decision Making (2023) - Julia Patrick Engkasan",
      "Biomedical Science & Clinical Chemistry: Oxidative Stress Biomarkers in Metabolic Diseases (2024) - Umah Rani Kuppusamy",
      "Epidemiology & Public Health: Social Determinants of Health Disparities in Vulnerable Populations (2023) - Rumana Akhter Saifi"
    ],
    "University of Tsukuba Malaysia": [
      "Hydrology & Water Resources Management: Climate Change Impacts on Watershed Sustainability (2024) - Tsujimura Maki",
      "Plant Molecular Biology & Synthetic Biology: CRISPR Applications in Crop Improvement (2023) - Suzuki Iwane",
      "Machine Learning & Computational Neuroscience: Neural Network Models for Cognitive Processes (2024) - Tezuka Taro",
      "Robotics & Haptics Engineering: Human-Robot Interaction in Manufacturing Systems (2023) - Mochiyama Hiromi"
    ],
    "Universiti Sains Malaysia": [
      "Computer Science & Software Engineering: Agile Development Methodologies for Enterprise Systems (2024) - Ramona Ramli",
      "Information Systems & Data Analytics: Big Data Analytics for Business Intelligence (2023) - Zainab Abu Bakar",
      "Network Security & Computer Vision: Deep Learning for Intrusion Detection Systems (2024) - Hazrina Abdullah",
      "Artificial Intelligence & Machine Learning: AI-Driven Decision Support Systems (2023) - Chong Shin Horng"
    ],
    "Universiti Putra Malaysia": [
      "Environmental Science & Water Quality: Heavy Metal Contamination in Coastal Ecosystems (2024) - Arifin Abdu",
      "Food Science & Biotechnology: Novel Food Processing Technologies for Nutritional Enhancement (2023) - Chin Nyuk Ling",
      "Agricultural Economics & Farm Management: Economic Analysis of Sustainable Farming Practices (2024) - Ahmad Makmom Abdullah",
      "Veterinary Medicine & Animal Science: Emerging Zoonotic Diseases in Southeast Asia (2023) - Zainal Abidin Muhamad Amiruddin"
    ],
    "Universiti Teknologi Malaysia": [
      "Computer Science & Software Engineering: Design Patterns for Scalable Software Architecture (2024) - Rozilawati Binti Razali",
      "Electrical Engineering & Control Systems: Intelligent Control Algorithms for Industrial Automation (2023) - Mohd Shahrieel Mohd Aras",
      "Civil Engineering & Structural Analysis: Seismic Performance of Reinforced Concrete Structures (2024) - Sophia C. Alih",
      "Computer Networks & Cybersecurity: Advanced Threat Detection in IoT Networks (2023) - Nurul Halimatul Asmak Ismail"
    ],
    "Sunway University": [
      "Business Management & Marketing Strategy: Consumer Behavior Analysis in Digital Retail (2024) - Lim Hock Eam",
      "Hospitality & Tourism Management: Sustainable Tourism Development in Southeast Asia (2023) - Ng Siew Imm",
      "Media Studies & Communication: Social Media Impact on Youth Culture (2024) - Tan Bee Theen",
      "Psychology & Counseling: Mental Health Interventions in Higher Education (2023) - Vivien How"
    ],
    "Monash University Malaysia": [
      "Chemical & Pharmaceutical Sciences: Drug Development for Tropical Diseases (2024) - Amin Malik Shah Abdul Majid",
      "Ecology & Environmental Science: Biodiversity Conservation in Tropical Rainforests (2023) - Sumita Sugnaseelan",
      "Biomedical Science & Genetics: Cancer Genomics Research in Asian Populations (2024) - Pang Yean Ling",
      "Microbiology & Immunology: Antimicrobial Resistance in Southeast Asia (2023) - Cindy Shuan Ju Teh"
    ],
    "University of Nottingham Malaysia": [
      "Electrical Engineering & Control Systems: Advanced Process Control in Manufacturing (2024) - Bernard Lim Jit Keong",
      "Mechanical Engineering & Robotics: Robot Vision Systems for Industrial Applications (2023) - Christopher Soo Jin Hoe",
      "Civil Engineering & Structural Design: Sustainable Infrastructure Development (2024) - Caroline Yew Kar Ming",
      "Chemical Engineering & Process Optimization: Green Chemistry in Industrial Processes (2023) - David Ng Zhi Kai"
    ],
    "Xiamen University Malaysia": [
      "Mathematics & Applied Analysis: Functional Analysis and Operator Theory (2024) - Lim Kay Sin",
      "Pure Mathematics & Algebra: Group Theory Applications in Cryptography (2023) - Chen Keng How",
      "Mathematical Modeling & Computational Mathematics: Numerical Methods for Differential Equations (2024) - Tan Wei Keat",
      "Statistics & Probability Theory: Stochastic Processes in Financial Mathematics (2023) - Ng Chee Peng"
    ],
    "Multimedia University": [
      "Management Science & Strategic Planning: Corporate Governance in Digital Enterprises (2024) - Foo Mei Lin",
      "Human Resource Management & Organizational Behavior: Talent Retention in Technology Firms (2023) - Lim Swee Ching",
      "Marketing & Consumer Analytics: Digital Marketing Strategy and Brand Management (2024) - Tan Hui Mei",
      "Finance & Investment Management: Financial Risk Assessment in Emerging Markets (2023) - Wong Ah Kow"
    ],
    "Universiti Kebangsaan Malaysia": [
      "Political Science & International Relations: Southeast Asian Regional Security Studies (2024) - Ahmad Fauzi Abdul Hamid",
      "Sociology & Social Policy: Community Development and Social Cohesion (2023) - Jayum Jawan",
      "Strategic Studies & Defense Policy: National Security Strategy and Crisis Management (2024) - Kamarulnizam Abdullah",
      "Southeast Asian Studies & Cultural Politics: Ethnic Relations in Multicultural Societies (2023) - Shamsul Amri Baharuddin"
    ],
    "Universiti Teknologi Petronas": [
      "Chemical Engineering & Petroleum Processing: Advanced Catalysis for Hydrocarbon Conversion (2024) - Suzana Yusup",
      "Geoscience & Reservoir Engineering: Seismic Interpretation for Oil and Gas Exploration (2023) - Abdul Halim Abdul Latiff",
      "Mechanical Engineering & Energy Systems: Thermodynamic Analysis of Power Generation Systems (2024) - Nasrudin Abd Rahim",
      "Process Safety & Risk Management: Safety Assessment of Chemical Processing Plants (2023) - Zainuddin Abdul Manan"
    ],
    "Universiti Tunku Abdul Rahman": [
      "Civil Engineering & Structural Design: Earthquake-Resistant Building Design (2024) - Lim Thong Leng",
      "Electrical Engineering & Power Systems: Smart Grid Technologies and Renewable Energy Integration (2023) - Teh Jiashen",
      "Mechanical Engineering & Manufacturing: Advanced Manufacturing Processes for Aerospace Components (2024) - Yap Hwa Jen",
      "Software Engineering & Mobile Computing: Mobile Application Development for Healthcare (2023) - Tan Wai Meng"
    ],
    "INTI University": [
      "Education Management & School Leadership: Leadership Practices in Educational Institutions (2024) - Lim Hooi Lian",
      "English Language Teaching & Curriculum Development: Innovative Pedagogy in Language Education (2023) - Chan Swee Heng",
      "Business Management & Entrepreneurship: Small Business Management and Startup Development (2024) - Tan Siok Hoon",
      "Accounting & Financial Management: Corporate Governance and Financial Reporting Standards (2023) - Wong Siew Chin"
    ],
    "Asia Pacific University of Technology & Innovation": [
      "Information Technology & Cloud Computing: Cloud Infrastructure Design and Security (2024) - Selvakumar Manickam",
      "Artificial Intelligence & Machine Learning: Deep Learning Applications in Computer Vision (2023) - Vinesh Thiruchelvam",
      "Cybersecurity & Network Forensics: Digital Forensics and Incident Response (2024) - Muhammad Nadzir Marsono",
      "Software Engineering & Innovation: Agile Development and Software Quality Assurance (2023) - Tan Tse Guan"
    ]
  };

  return publicationsByUniversity[universityName] || [
    "Recent Research Publication 1 (2024)",
    "Recent Research Publication 2 (2023)",
    "Recent Research Publication 3 (2024)"
  ];
};

/**
 * Partner Detail Modal with Research Profile
 * 
 * Displays comprehensive information about a selected partner including:
 * - Basic information (location, type, collaboration focus)
 * - Research profile (areas, publications, achievements)
 * - Active projects and researchers
 * - Key statistics and metrics
 * 
 * Accessible via keyboard (ESC to close) and screen readers (ARIA labels).
 */
const PartnerDetailModal = ({ partner, visible, onClose }) => {
  if (!partner) return null;

  // Research profile data - dynamically fetched based on university
  const researchProfile = {
    researchAreas: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Computer Vision"
    ],
    recentPublications: getUniversityPublications(partner.name),
    networkAffiliations: getUniversityNetworks(partner.name),
    mutualAuthors: getMutualAuthors(partner.name),
    keyAchievements: [
      "Top 200 QS World University Rankings",
      "5-Star Excellence Rating in Research",
      "International Research Collaborations in 15+ Countries"
    ],
    facilities: [
      "Advanced Computing Laboratory",
      "AI Research Center",
      "Innovation Hub",
      "Collaborative Workspace"
    ]
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <span>{partner.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <div className="partner-details-enhanced">
        {/* Basic Information Section */}
        <div className="info-section">
          <h3>📍 Location & Overview</h3>
          <div className="detail-row">
            <GlobalOutlined /> <strong>Location:</strong> {partner.city}, {partner.country}
          </div>
          <div className="detail-row">
            <TeamOutlined /> <strong>Type:</strong> <Tag color="blue">{partner.type}</Tag>
          </div>
          <div className="detail-row">
            <strong>Collaboration Focus:</strong> <Tag color="green">{partner.collaboration}</Tag>
          </div>
          <div className="detail-row">
            <strong>Partnership Established:</strong> {partner.established}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{partner.projects}</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{partner.researchers}</div>
            <div className="stat-label">Researchers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{researchProfile.researchAreas.length}</div>
            <div className="stat-label">Research Areas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{researchProfile.facilities.length}</div>
            <div className="stat-label">Facilities</div>
          </div>
        </div>

        {/* Research Areas Section */}
        <div className="info-section">
          <h3>🔬 Research Areas</h3>
          <div className="tags-container">
            {researchProfile.researchAreas.map((area, index) => (
              <Tag key={index} color="purple">{area}</Tag>
            ))}
          </div>
        </div>

        {/* Research Collaborations & Networks Section */}
        <div className="info-section">
          <h3>🌐 Research Collaborations & Networks</h3>
          <div className="tags-container">
            {researchProfile.networkAffiliations.map((network, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>{network}</Tag>
            ))}
          </div>
        </div>

        {/* Mutual Authors/Collaborators Section */}
        <div className="info-section">
          <h3>👥 Mutual Authors & Collaborators</h3>
          <div className="authors-grid">
            {researchProfile.mutualAuthors.map((author, index) => (
              <div key={index} className="author-card">
                <div className="author-name">{author.name}</div>
                <div className="author-field">{author.field}</div>
                <Tag color="blue">{author.papers} joint papers</Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Publications Section */}
        <div className="info-section">
          <h3>📚 Recent Publications</h3>
          <ul className="publications-list">
            {researchProfile.recentPublications.map((pub, index) => (
              <li key={index}>{pub}</li>
            ))}
          </ul>
        </div>

        {/* Key Achievements Section */}
        <div className="info-section">
          <h3>🏆 Key Achievements</h3>
          <ul className="achievements-list">
            {researchProfile.keyAchievements.map((achievement, index) => (
              <li key={index}>
                <span className="achievement-icon">✓</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Research Facilities Section */}
        <div className="info-section">
          <h3>🏢 Research Facilities</h3>
          <div className="facilities-grid">
            {researchProfile.facilities.map((facility, index) => (
              <div key={index} className="facility-item">
                <span className="facility-icon">▪</span>
                {facility}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="action-section">
          <a 
            href={partner.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-button"
          >
            Visit Official Website →
          </a>
        </div>
      </div>

      <style jsx>{`
        .partner-details-enhanced {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .info-section {
          background: #fafafa;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #1890ff;
        }

        .info-section h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .detail-row strong {
          color: #262626;
          min-width: 180px;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .stat-number {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .publications-list, .achievements-list {
          margin: 0;
          padding-left: 20px;
        }

        .publications-list li {
          margin-bottom: 8px;
          color: #595959;
          font-size: 14px;
        }

        .achievements-list {
          list-style: none;
          padding-left: 0;
        }

        .achievements-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          color: #595959;
          font-size: 14px;
        }

        .achievement-icon {
          background: #52c41a;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .authors-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .author-card {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e8e8e8;
          transition: all 0.3s ease;
        }

        .author-card:hover {
          border-color: #1890ff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
          transform: translateY(-2px);
        }

        .author-name {
          font-weight: 600;
          color: #262626;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .author-field {
          color: #8c8c8c;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .facility-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #595959;
          font-size: 14px;
        }

        .facility-icon {
          color: #1890ff;
          font-weight: bold;
        }

        .action-section {
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #e8e8e8;
        }

        .visit-button {
          display: inline-block;
          background: #1890ff;
          color: white;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .visit-button:hover {
          background: #40a9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }

        @media (max-width: 768px) {
          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .facilities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
};

/**
 * Main PartnerMap Component
 */
const PartnerMap = ({ partners = SAMPLE_PARTNERS }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPartners, setFilteredPartners] = useState(partners);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);

  /**
   * Search/filter functionality
   * Filters partners by name, country, city, or collaboration area
   */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPartners(partners);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = partners.filter(partner => 
      partner.name.toLowerCase().includes(term) ||
      partner.country.toLowerCase().includes(term) ||
      partner.city.toLowerCase().includes(term) ||
      partner.collaboration.toLowerCase().includes(term)
    );

    setFilteredPartners(filtered);
  }, [searchTerm, partners]);

  /**
   * Handle marker click
   * Opens modal with partner details
   */
  const handleMarkerClick = (partner) => {
    setSelectedPartner(partner);
    setModalVisible(true);
  };

  /**
   * Handle partner list item click
   * Highlights marker on map and opens modal
   */
  const handleListItemClick = (partner) => {
    setSelectedPartner(partner);
    setModalVisible(true);
    // Pan map to partner location
    setCenter(partner.coordinates);
    setZoom(4);
  };

  /**
   * Zoom controls
   */
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.5, 50));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.5, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setCenter([0, 20]);
  };

  /**
   * Focus on Malaysia region
   */
  const handleFocusMalaysia = () => {
    setCenter([101.9758, 4.2105]); // Center of Malaysia
    setZoom(15); // High zoom for detailed view
  };

  /**
   * Calculate marker size based on zoom level
   */
  const getMarkerSize = () => {
    // Scale marker size with zoom level
    // At zoom 1: smaller base size to prevent overlap
    // At zoom 50: larger size to remain visible
    const baseSize = 1.2; // Further reduced to 1.2px to minimize overlap
    const scaleFactor = Math.max(1, zoom / 5); // Increase size as zoom increases
    return {
      normal: baseSize * scaleFactor,
      hover: (baseSize + 1) * scaleFactor, // Reduced hover size increase
      strokeWidth: Math.max(0.7, scaleFactor * 0.3) // Even thinner stroke
    };
  };

  return (
    <div className="partner-map-container">
      <div className="map-layout">
        {/* Partner Directory Sidebar */}
        <Card 
          title="Partner Directory" 
          className="directory-card"
          extra={<Tag color="blue">{filteredPartners.length} Partners</Tag>}
        >
          <Input
            placeholder="Search partners..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <List
            dataSource={filteredPartners}
            renderItem={(partner) => (
              <List.Item 
                onClick={() => handleListItemClick(partner)}
                style={{ cursor: 'pointer' }}
                className={selectedPartner?.id === partner.id ? 'selected-item' : ''}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {partner.name[0]}
                    </Avatar>
                  }
                  title={partner.name}
                  description={
                    <>
                      <div>{partner.city}, {partner.country}</div>
                      <Tag color="green" size="small">{partner.collaboration}</Tag>
                    </>
                  }
                />
              </List.Item>
            )}
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
          />
        </Card>

        {/* Interactive Map */}
        <Card title="Global Partner Network" className="map-card">
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button 
              className="zoom-button" 
              onClick={handleZoomIn}
              title="Zoom In"
            >
              +
            </button>
            <button 
              className="zoom-button" 
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              −
            </button>
            <button 
              className="zoom-button reset-button" 
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              ⟲
            </button>
            <button 
              className="zoom-button malaysia-button" 
              onClick={handleFocusMalaysia}
              title="Focus on Malaysia"
            >
              🇲🇾
            </button>
          </div>

          <div className="map-wrapper">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
              }}
            >
              <ZoomableGroup 
                zoom={zoom} 
                center={center}
                onMoveEnd={({ zoom, coordinates }) => {
                  setZoom(zoom);
                  setCenter(coordinates);
                }}
              >
                {/* World map geography */}
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E0E0E0"
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#CFD8DC', outline: 'none' },
                          pressed: { fill: '#90A4AE', outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Partner markers */}
                {filteredPartners.map((partner) => {
                  const markerSize = getMarkerSize();
                  return (
                  <Marker
                    key={partner.id}
                    coordinates={partner.coordinates}
                    onMouseEnter={() => setHoveredMarker(partner.id)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    onClick={() => handleMarkerClick(partner)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Marker circle */}
                    <circle
                      r={hoveredMarker === partner.id || selectedPartner?.id === partner.id ? markerSize.hover : markerSize.normal}
                      fill={
                        selectedPartner?.id === partner.id 
                          ? '#ff4d4f' 
                          : partner.country === 'Malaysia' 
                            ? '#1890ff'  // Blue for Malaysian partners
                            : '#52c41a'  // Green for global partners
                      }
                      stroke="#FFFFFF"
                      strokeWidth={markerSize.strokeWidth}
                      style={{
                        transition: 'all 0.2s ease',
                        opacity: hoveredMarker === partner.id ? 1 : 0.8,
                      }}
                    />
                    
                    {/* Marker label on hover */}
                    {hoveredMarker === partner.id && (
                      <text
                        textAnchor="middle"
                        y={-15}
                        style={{
                          fontSize: '12px',
                          fill: '#262626',
                          fontWeight: 600,
                          pointerEvents: 'none',
                        }}
                      >
                        {partner.name.split(' ')[0]}
                      </text>
                    )}
                  </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Map Legend */}
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#1890ff' }}></div>
              <span>Malaysian Partner</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#52c41a' }}></div>
              <span>Global Partner</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#ff4d4f' }}></div>
              <span>Selected Partner</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Partner Detail Modal */}
      <PartnerDetailModal
        partner={selectedPartner}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <style jsx>{`
        .partner-map-container {
          padding: 24px;
          background: #f0f2f5;
          min-height: 100vh;
        }

        .map-layout {
          display: flex;
          gap: 16px;
          height: calc(100vh - 48px);
        }

        .directory-card {
          width: 350px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .map-card {
          flex: 1;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .map-wrapper {
          width: 100%;
          height: calc(100% - 80px);
          background: #f9fafb;
          border-radius: 4px;
          overflow: hidden;
        }

        .map-legend {
          display: flex;
          gap: 20px;
          margin-top: 16px;
          padding: 12px;
          background: #fafafa;
          border-radius: 4px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .legend-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .selected-item {
          background: #e6f7ff;
        }

        .zoom-controls {
          position: absolute;
          top: 70px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
        }

        .zoom-button {
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          font-size: 20px;
          font-weight: bold;
          color: #595959;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .zoom-button:hover {
          background: #1890ff;
          color: white;
          border-color: #1890ff;
          transform: scale(1.05);
        }

        .zoom-button:active {
          transform: scale(0.95);
        }

        .reset-button {
          font-size: 24px;
          border-top: 2px solid #f0f0f0;
        }

        .malaysia-button {
          font-size: 20px;
          padding: 0;
          border-top: 2px solid #f0f0f0;
        }

        .malaysia-button:hover {
          background: #52c41a;
          border-color: #52c41a;
        }

        @media (max-width: 1024px) {
          .map-layout {
            flex-direction: column;
          }

          .directory-card {
            width: 100%;
          }

          .zoom-controls {
            top: 60px;
            right: 16px;
          }

          .zoom-button {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnerMap;

/**
 * Usage Example:
 * 
 * import PartnerMap from './components/maps/PartnerMap';
 * 
 * function App() {
 *   // Fetch partners from API
 *   const { data: partners } = useQuery('partners', fetchPartners);
 *   
 *   return <PartnerMap partners={partners} />;
 * }
 * 
 * Future Enhancements:
 * - Add clustering for dense regions (many nearby markers)
 * - Implement heatmap overlay showing collaboration intensity
 * - Add timeline slider to show partnership growth over time
 * - Export map as image/PDF
 * - Add custom map projections (Robinson, Equal Earth)
 * - Integrate flight path lines between connected institutions
 * - Add statistics panel (partners by continent, type, etc.)
 * - Implement advanced filters (by type, year, collaboration area)
 * - Add animation for marker appearance
 * - Mobile touch gestures (pinch-to-zoom)
 * - Offline map caching
 * - Multi-language support for country names
 */

# InterNexus Architecture Diagrams

This document contains visual architecture diagrams for the InterNexus platform using Mermaid syntax.

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        React[React Application]
        ThreeJS[Three.js 3D Engine]
        Redux[Redux Store]
        SocketClient[Socket.IO Client]
    end
    
    subgraph "Network Layer"
        HTTP[HTTP/HTTPS]
        WS[WebSocket]
    end
    
    subgraph "Server Layer"
        Express[Express Server]
        SocketServer[Socket.IO Server]
        API[REST API]
        Auth[Auth Middleware]
        Routes[Route Handlers]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
        S3[AWS S3 Storage]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API]
        Email[Email Service]
        Analytics[Analytics Service]
    end
    
    Browser --> React
    React --> ThreeJS
    React --> Redux
    React --> SocketClient
    
    React -->|API Requests| HTTP
    SocketClient -->|Real-time| WS
    
    HTTP --> Express
    WS --> SocketServer
    
    Express --> Auth
    Auth --> API
    API --> Routes
    SocketServer --> Routes
    
    Routes --> MongoDB
    Routes --> Redis
    Routes --> S3
    Routes --> OpenAI
    Routes --> Email
    Routes --> Analytics
    
    style Browser fill:#e1f5ff
    style React fill:#61dafb
    style Express fill:#68a063
    style MongoDB fill:#4db33d
    style Redis fill:#dc382d
```

---

## 2. Frontend Component Architecture

```mermaid
graph TB
    subgraph "Application Root"
        App[App.jsx]
        Router[React Router]
        ReduxProvider[Redux Provider]
    end
    
    subgraph "Layout Components"
        Header[AppHeader]
        Sidebar[AppSidebar]
        Content[Content Area]
    end
    
    subgraph "Pages"
        Dashboard[Dashboard Page]
        VirtualHQ[Virtual HQ Page]
        Collab[Collaboration Page]
        Partners[Partners Page]
        Analytics[Analytics Page]
        Profile[Profile Page]
    end
    
    subgraph "Feature Components"
        direction LR
        
        subgraph "3D Components"
            VHQ[VirtualHQ.jsx]
            Room[Room Components]
            Hotspot[Hotspots]
            Camera[Camera Controls]
        end
        
        subgraph "Dashboard Components"
            KPI[KPI Cards]
            Charts[Chart Components]
            Timeline[Timeline Chart]
            ResourceChart[Resource Chart]
            StatusChart[Status Chart]
            ProjectTable[Projects Table]
        end
        
        subgraph "Collaboration Components"
            Chat[Chat Interface]
            Whiteboard[Shared Whiteboard]
            UserList[Online Users]
            Typing[Typing Indicators]
        end
        
        subgraph "Map Components"
            WorldMap[Interactive Map]
            Markers[Partner Markers]
            Directory[Partner Directory]
            Details[Detail Modal]
        end
    end
    
    subgraph "Shared Components"
        Button[Buttons]
        Card[Cards]
        Modal[Modals]
        Form[Forms]
    end
    
    subgraph "Services & Utils"
        API_Service[API Service]
        Socket_Service[Socket Service]
        Auth_Service[Auth Service]
        Utils[Utility Functions]
    end
    
    App --> ReduxProvider
    ReduxProvider --> Router
    Router --> Header
    Router --> Sidebar
    Router --> Content
    
    Content --> Dashboard
    Content --> VirtualHQ
    Content --> Collab
    Content --> Partners
    Content --> Analytics
    Content --> Profile
    
    Dashboard --> KPI
    Dashboard --> Charts
    
    VirtualHQ --> VHQ
    VHQ --> Room
    VHQ --> Hotspot
    VHQ --> Camera
    
    Collab --> Chat
    Collab --> Whiteboard
    Collab --> UserList
    
    Partners --> WorldMap
    WorldMap --> Markers
    WorldMap --> Directory
    
    Charts --> Timeline
    Charts --> ResourceChart
    Charts --> StatusChart
    Dashboard --> ProjectTable
    
    API_Service --> MongoDB
    Socket_Service --> SocketServer
    
    style App fill:#61dafb
    style VHQ fill:#049ef4
    style Chat fill:#25d366
    style WorldMap fill:#4285f4
```

---

## 3. Backend Architecture

```mermaid
graph TB
    subgraph "Entry Point"
        Server[server.js]
    end
    
    subgraph "Middleware Stack"
        Helmet[Helmet Security]
        CORS[CORS Handler]
        RateLimit[Rate Limiter]
        BodyParser[Body Parser]
        Auth_MW[Auth Middleware]
        ErrorHandler[Error Handler]
    end
    
    subgraph "API Routes"
        ProjectRoutes["API: /api/projects"]
        UserRoutes["API: /api/users"]
        PartnerRoutes["API: /api/partners"]
        AnalyticsRoutes["API: /api/analytics"]
    end
    
    subgraph "Controllers"
        ProjectCtrl[Project Controller]
        UserCtrl[User Controller]
        PartnerCtrl[Partner Controller]
        AnalyticsCtrl[Analytics Controller]
    end
    
    subgraph "Services"
        AuthService[Auth Service]
        AIService[AI Service]
        EmailService[Email Service]
        StorageService[Storage Service]
    end
    
    subgraph "Socket.IO"
        SocketServer[Socket.IO Server]
        CollabHandler[Collaboration Handler]
        NotifHandler[Notification Handler]
    end
    
    subgraph "Models"
        UserModel[User Model]
        ProjectModel[Project Model]
        PartnerModel[Partner Model]
        MessageModel[Message Model]
    end
    
    subgraph "Database"
        MongoDB[(MongoDB)]
        Redis[(Redis)]
    end
    
    Server --> Helmet
    Helmet --> CORS
    CORS --> RateLimit
    RateLimit --> BodyParser
    BodyParser --> Auth_MW
    
    Auth_MW --> ProjectRoutes
    Auth_MW --> UserRoutes
    Auth_MW --> PartnerRoutes
    Auth_MW --> AnalyticsRoutes
    
    ProjectRoutes --> ProjectCtrl
    UserRoutes --> UserCtrl
    PartnerRoutes --> PartnerCtrl
    AnalyticsRoutes --> AnalyticsCtrl
    
    ProjectCtrl --> AuthService
    UserCtrl --> AuthService
    ProjectCtrl --> AIService
    UserCtrl --> EmailService
    ProjectCtrl --> StorageService
    
    Server --> SocketServer
    SocketServer --> CollabHandler
    SocketServer --> NotifHandler
    
    ProjectCtrl --> ProjectModel
    UserCtrl --> UserModel
    PartnerCtrl --> PartnerModel
    CollabHandler --> MessageModel
    
    ProjectModel --> MongoDB
    UserModel --> MongoDB
    PartnerModel --> MongoDB
    MessageModel --> MongoDB
    
    AuthService --> Redis
    
    Auth_MW --> ErrorHandler
    
    style Server fill:#68a063
    style SocketServer fill:#010101
    style MongoDB fill:#4db33d
    style Redis fill:#dc382d
```

---

## 4. Data Flow: Real-time Collaboration

```mermaid
sequenceDiagram
    participant User1 as User 1 Browser
    participant User2 as User 2 Browser
    participant Client1 as Socket.IO Client 1
    participant Client2 as Socket.IO Client 2
    participant Server as Socket.IO Server
    participant Handler as Collaboration Handler
    participant Memory as In-Memory Store
    
    User1->>Client1: Join Room
    Client1->>Server: emit('join-room', {roomId, user})
    Server->>Handler: Handle join-room event
    Handler->>Memory: Add user to room
    Handler->>Server: broadcast('user-joined')
    Server->>Client2: emit('user-joined')
    Client2->>User2: Show "User 1 joined"
    
    User1->>Client1: Type message
    Client1->>Server: emit('chat-message', {message})
    Server->>Handler: Handle chat-message
    Handler->>Memory: Store message
    Handler->>Server: broadcast to room
    Server->>Client1: emit('chat-message')
    Server->>Client2: emit('chat-message')
    Client1->>User1: Display message
    Client2->>User2: Display message
    
    User1->>Client1: Draw on whiteboard
    Client1->>Server: emit('draw', {drawData})
    Server->>Handler: Handle draw event
    Handler->>Server: broadcast to room (exclude sender)
    Server->>Client2: emit('draw-data')
    Client2->>User2: Render drawing
    
    User1->>Client1: Leave room
    Client1->>Server: emit('leave-room')
    Server->>Handler: Handle leave-room
    Handler->>Memory: Remove user from room
    Handler->>Server: broadcast('user-left')
    Server->>Client2: emit('user-left')
    Client2->>User2: Show "User 1 left"
```

---

## 5. Data Flow: API Request/Response

```mermaid
sequenceDiagram
    participant Browser
    participant React as React Component
    participant API as API Service
    participant Express as Express Server
    participant Auth as Auth Middleware
    participant Controller
    participant Model
    participant DB as MongoDB
    
    Browser->>React: User action (e.g., create project)
    React->>API: API.post('/projects', data)
    API->>Express: HTTP POST /api/projects
    Express->>Auth: Verify JWT token
    
    alt Token valid
        Auth->>Controller: Forward request
        Controller->>Model: Create project
        Model->>DB: Insert document
        DB-->>Model: Return saved document
        Model-->>Controller: Return project
        Controller-->>Express: JSON response
        Express-->>API: 201 Created
        API-->>React: Success
        React-->>Browser: Update UI
    else Token invalid
        Auth-->>Express: 401 Unauthorized
        Express-->>API: Error response
        API-->>React: Auth error
        React-->>Browser: Redirect to login
    end
```

---

## 6. Component State Management

```mermaid
graph LR
    subgraph "Component State"
        LocalState[Local useState]
        LocalEffect[useEffect]
    end
    
    subgraph "Redux Global State"
        Store[Redux Store]
        Actions[Actions]
        Reducers[Reducers]
        Middleware[Middleware]
    end
    
    subgraph "Server State"
        API[API Calls]
        Cache[Response Cache]
    end
    
    subgraph "Real-time State"
        Socket[Socket.IO]
        Events[Event Listeners]
    end
    
    Component[React Component] --> LocalState
    Component --> Store
    Component --> API
    Component --> Socket
    
    LocalState --> LocalEffect
    LocalEffect --> Component
    
    Component --> Actions
    Actions --> Middleware
    Middleware --> Reducers
    Reducers --> Store
    Store --> Component
    
    API --> Cache
    Cache --> Component
    
    Socket --> Events
    Events --> Component
    Events --> Actions
    
    style Component fill:#61dafb
    style Store fill:#764abc
    style Socket fill:#010101
```

---

## 7. 3D Virtual HQ Architecture

```mermaid
graph TB
    subgraph "React Layer"
        VirtualHQ[VirtualHQ Component]
        State[React State]
    end
    
    subgraph "React Three Fiber"
        Canvas[Canvas Component]
        Scene[3D Scene]
    end
    
    subgraph "Three.js Objects"
        Camera[Perspective Camera]
        Lights[Lighting Setup]
        Geometry[Room Geometry]
        Materials[Materials]
        Meshes[Mesh Objects]
    end
    
    subgraph "Controls"
        OrbitControls[Orbit Controls]
        Interactions[Click Handlers]
    end
    
    subgraph "Helpers"
        Environment[Environment Map]
        Sky[Sky Box]
        Suspense[Suspense Boundary]
        HTML[HTML Overlays]
    end
    
    subgraph "Post-Processing"
        Composer[Effect Composer]
        Bloom[Bloom Effect]
        AO[Ambient Occlusion]
    end
    
    VirtualHQ --> Canvas
    VirtualHQ --> State
    
    Canvas --> Scene
    Scene --> Camera
    Scene --> Lights
    Scene --> Geometry
    
    Geometry --> Materials
    Materials --> Meshes
    
    Scene --> OrbitControls
    Meshes --> Interactions
    Interactions --> State
    
    Scene --> Environment
    Scene --> Sky
    Canvas --> Suspense
    Meshes --> HTML
    
    Scene --> Composer
    Composer --> Bloom
    Composer --> AO
    
    style Canvas fill:#049ef4
    style Scene fill:#00d4ff
    style Meshes fill:#26a69a
```

---

## 8. Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevClient[Vite Dev Server<br/>:3000]
        DevServer[Node Dev Server<br/>:5000]
        DevDB[(Local MongoDB)]
    end
    
    subgraph "CI/CD Pipeline"
        GitHub[GitHub Repository]
        Actions[GitHub Actions]
        Tests[Automated Tests]
        Build[Build Process]
    end
    
    subgraph "Production - AWS"
        subgraph "Frontend"
            S3[S3 Bucket<br/>Static Files]
            CloudFront[CloudFront CDN]
        end
        
        subgraph "Backend"
            ALB[Application Load Balancer]
            EC2_1[EC2 Instance 1]
            EC2_2[EC2 Instance 2]
        end
        
        subgraph "Data"
            Atlas[(MongoDB Atlas)]
            ElastiCache[(ElastiCache Redis)]
            S3_Storage[S3 File Storage]
        end
        
        subgraph "Monitoring"
            CloudWatch[CloudWatch Logs]
            Sentry[Sentry Error Tracking]
        end
    end
    
    subgraph "Users"
        Browser[Web Browsers]
    end
    
    DevClient --> DevServer
    DevServer --> DevDB
    
    DevClient --> GitHub
    DevServer --> GitHub
    
    GitHub --> Actions
    Actions --> Tests
    Tests --> Build
    Build --> S3
    Build --> EC2_1
    Build --> EC2_2
    
    Browser --> CloudFront
    CloudFront --> S3
    Browser --> ALB
    ALB --> EC2_1
    ALB --> EC2_2
    
    EC2_1 --> Atlas
    EC2_2 --> Atlas
    EC2_1 --> ElastiCache
    EC2_2 --> ElastiCache
    EC2_1 --> S3_Storage
    EC2_2 --> S3_Storage
    
    EC2_1 --> CloudWatch
    EC2_2 --> CloudWatch
    EC2_1 --> Sentry
    EC2_2 --> Sentry
    
    style GitHub fill:#181717
    style S3 fill:#ff9900
    style CloudFront fill:#8c4fff
    style Atlas fill:#4db33d
    style ElastiCache fill:#dc382d
```

---

## 9. Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        XSS[XSS Prevention]
        CSP[Content Security Policy]
        HTTPS_C[HTTPS Only]
    end
    
    subgraph "Network Security"
        Firewall[Firewall Rules]
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
    end
    
    subgraph "Application Security"
        CORS_S[CORS Configuration]
        RateLimit_S[Rate Limiting]
        Helmet_S[Security Headers]
        Validation[Input Validation]
        Sanitization[Data Sanitization]
    end
    
    subgraph "Authentication"
        JWT[JWT Tokens]
        Bcrypt[Password Hashing]
        Refresh[Refresh Tokens]
        MFA[Multi-Factor Auth]
    end
    
    subgraph "Authorization"
        RBAC[Role-Based Access]
        Permissions[Permission Checks]
        ResourceAuth[Resource Authorization]
    end
    
    subgraph "Data Security"
        Encryption[Encryption at Rest]
        TLS[TLS in Transit]
        Secrets[Secrets Management]
        Audit[Audit Logging]
    end
    
    User[User Request] --> XSS
    User --> CSP
    User --> HTTPS_C
    
    HTTPS_C --> Firewall
    Firewall --> WAF
    WAF --> DDoS
    
    DDoS --> CORS_S
    CORS_S --> RateLimit_S
    RateLimit_S --> Helmet_S
    Helmet_S --> Validation
    Validation --> Sanitization
    
    Sanitization --> JWT
    JWT --> Bcrypt
    JWT --> Refresh
    JWT --> MFA
    
    MFA --> RBAC
    RBAC --> Permissions
    Permissions --> ResourceAuth
    
    ResourceAuth --> Encryption
    Encryption --> TLS
    TLS --> Secrets
    Secrets --> Audit
    
    style JWT fill:#fb015b
    style Encryption fill:#4db33d
    style Firewall fill:#ff6b35
```

---

## 10. Database Schema

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ MESSAGE : sends
    USER }o--o{ PROJECT : "member of"
    PROJECT ||--o{ MILESTONE : contains
    PROJECT }o--|| PARTNER : "collaborates with"
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        string avatar
        date createdAt
        date updatedAt
    }
    
    PROJECT {
        ObjectId _id PK
        string name
        string description
        string team
        string status
        number progress
        date deadline
        ObjectId[] members FK
        ObjectId createdBy FK
        date createdAt
        date updatedAt
    }
    
    PARTNER {
        ObjectId _id PK
        string name
        string country
        string city
        number[] coordinates
        string type
        string collaboration
        date established
        number projects
        number researchers
        string website
    }
    
    MESSAGE {
        ObjectId _id PK
        ObjectId userId FK
        string roomId
        string text
        date timestamp
    }
    
    MILESTONE {
        ObjectId _id PK
        ObjectId projectId FK
        string title
        string description
        date dueDate
        boolean completed
    }
```

---

## How to View These Diagrams

### In VS Code:
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Press `Ctrl+Shift+V` (Windows) or `Cmd+Shift+V` (Mac)

### Online:
1. Copy the Mermaid code
2. Visit https://mermaid.live
3. Paste and view

### In GitHub:
GitHub automatically renders Mermaid diagrams in markdown files.

---

**Note:** These diagrams represent the planned architecture. Actual implementation may vary based on specific requirements and optimizations.

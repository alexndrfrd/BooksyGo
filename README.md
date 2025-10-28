# 🌍 BooksyGo - Smart Travel Platform

> AI-powered travel platform that helps you find and book the best vacation packages with gamification and intelligent recommendations.

## ✨ Features

- 🔍 **Smart Search**: Integrated flight & accommodation search (Skyscanner, Booking, Airbnb)
- 🤖 **AI Assistant**: Intelligent travel recommendations powered by GPT-4
- 📦 **Curated Packages**: Pre-made vacation experiences at competitive prices
- 🎮 **Gamification**: Earn points, unlock badges, complete challenges
- ⚡ **Lightning Fast**: Results in 10-15 seconds max with smart caching
- 📱 **Beautiful UI**: Modern, responsive design with smooth animations
- 🔒 **Secure**: Enterprise-grade security with encryption
- 📊 **Price Prediction**: ML-powered insights on when to book

## 🏗️ Architecture

```
BooksyGo/
├── frontend/              # Next.js 14+ App
├── services/
│   ├── api-gateway/      # Kong/Express Gateway
│   ├── user-service/     # NestJS - Auth & User Management
│   ├── search-service/   # FastAPI - Search Aggregation
│   ├── booking-service/  # NestJS - Booking Management
│   ├── ai-service/       # FastAPI - AI & ML
│   ├── package-service/  # NestJS - Curated Packages
│   └── notification-service/ # NestJS - Email/SMS/Push
├── infrastructure/
│   ├── k8s/             # Kubernetes manifests
│   ├── terraform/       # IaC for cloud resources
│   └── docker/          # Docker configurations
├── shared/
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Common utilities
└── docs/                # Documentation

```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React 18, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **API Client**: React Query

### Backend
- **Node.js**: NestJS (TypeScript)
- **Python**: FastAPI (async)
- **API Gateway**: Kong/Express
- **Message Queue**: RabbitMQ

### Databases
- **Primary**: PostgreSQL 16+
- **Cache**: Redis 7+
- **Search**: Elasticsearch 8+
- **Vector DB**: Pinecone/Qdrant

### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

### External APIs
- Skyscanner API
- Booking.com API
- Airbnb API
- OpenAI GPT-4
- Stripe Payments

## 📋 Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Kubernetes (minikube for local dev)
- PostgreSQL 16+
- Redis 7+

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/BooksyGo.git
cd BooksyGo
```

### 2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend service dependencies
cd ../services/user-service
npm install

# (Repeat for other services)
```

### 3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your API keys and configurations
```

### 4. Start infrastructure services
```bash
docker-compose up -d
```

### 5. Run migrations
```bash
npm run migrate
```

### 6. Start development servers
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend services
cd services
npm run dev:all
```

Visit `http://localhost:3000` 🎉

## 📚 Documentation

- [Project Plan](./PROJECT_PLAN.md) - Detailed project roadmap
- [Architecture](./docs/architecture.md) - System architecture
- [API Documentation](./docs/api.md) - API reference
- [Deployment Guide](./docs/deployment.md) - How to deploy

## 🗺️ Roadmap

- [x] Phase 1: MVP (Months 1-3)
  - [ ] User authentication
  - [ ] Flight search integration
  - [ ] Hotel search integration
  - [ ] Basic booking flow
  - [ ] Payment processing

- [ ] Phase 2: Enhancement (Months 4-6)
  - [ ] AI Travel Assistant
  - [ ] Gamification system
  - [ ] Price alerts
  - [ ] Pre-made packages

- [ ] Phase 3: Scale & Intelligence (Months 7-9)
  - [ ] Advanced ML recommendations
  - [ ] Performance optimization
  - [ ] Real-time updates
  - [ ] Social features

- [ ] Phase 4: Monetization (Months 10-12)
  - [ ] Premium subscriptions
  - [ ] Marketplace
  - [ ] Mobile app
  - [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📧 Contact

- Email: contact@booksygo.com
- Twitter: [@BooksyGo](https://twitter.com/booksygo)
- Discord: [Join our community](https://discord.gg/booksygo)

---

Made with ❤️ by the BooksyGo Team


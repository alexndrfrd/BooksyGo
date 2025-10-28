# 🏗️ BooksyGo System Architecture

## Overview

BooksyGo follows a modern microservices architecture with event-driven communication, designed for high scalability, performance, and maintainability.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client Layer                              │
├──────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App (React Native/Flutter)         │
│  PWA                │  iOS / Android                             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                 │
├──────────────────────────────────────────────────────────────────┤
│  Cloudflare CDN                                                   │
│  - Static Assets Caching                                          │
│  - DDoS Protection                                                │
│  - SSL/TLS Termination                                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Load Balancer                                │
├──────────────────────────────────────────────────────────────────┤
│  Kubernetes Ingress / AWS ALB                                     │
│  - SSL Termination                                                │
│  - Health Checks                                                  │
│  - Request Routing                                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       API Gateway                                 │
├──────────────────────────────────────────────────────────────────┤
│  Kong / Express Gateway                                           │
│  - Authentication & Authorization                                 │
│  - Rate Limiting                                                  │
│  - Request Validation                                             │
│  - API Versioning                                                 │
│  - Logging & Metrics                                              │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│User Service  │    │Search Service│    │Booking Svc   │
│              │    │              │    │              │
│- Auth        │    │- Aggregation │    │- Transactions│
│- Profile     │    │- Flights     │    │- Payments    │
│- Preferences │    │- Hotels      │    │- Invoices    │
│              │    │- Packages    │    │              │
│NestJS        │    │FastAPI       │    │NestJS        │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│AI Service    │    │Package Svc   │    │Payment Svc   │
│              │    │              │    │              │
│- Chat Bot    │    │- Curated     │    │- Stripe      │
│- Recommend.  │    │- Deals       │    │- PayPal      │
│- Itinerary   │    │- Experiences │    │- Refunds     │
│- Predictions │    │              │    │              │
│FastAPI       │    │NestJS        │    │NestJS        │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Notification  │    │Analytics Svc │    │Gamification  │
│Service       │    │              │    │Service       │
│              │    │- Events      │    │              │
│- Email       │    │- Metrics     │    │- Points      │
│- SMS         │    │- Reports     │    │- Badges      │
│- Push        │    │- Dashboards  │    │- Leaderboard │
│NestJS        │    │NestJS        │    │NestJS        │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Message Queue                                │
├──────────────────────────────────────────────────────────────────┤
│  RabbitMQ / Apache Kafka                                          │
│  - Event-Driven Communication                                     │
│  - Async Job Processing                                           │
│  - Service Decoupling                                             │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│PostgreSQL    │    │Redis Cache   │    │Elasticsearch │
│              │    │              │    │              │
│- User Data   │    │- API Cache   │    │- Package     │
│- Bookings    │    │- Sessions    │    │  Search      │
│- Packages    │    │- Rate Limit  │    │- Logs        │
│- Analytics   │    │- Pub/Sub     │    │- Analytics   │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ▼
┌──────────────┐
│Vector DB     │
│(Pinecone)    │
│              │
│- Embeddings  │
│- AI Search   │
└──────────────┘
        │
        └─────────────────────────────────────────┐
                                                  │
                                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                      External Services                            │
├──────────────────────────────────────────────────────────────────┤
│  Skyscanner  │  Booking.com  │  Airbnb  │  OpenAI  │  Stripe    │
└──────────────────────────────────────────────────────────────────┘
```

## Service Details

### 1. User Service (NestJS)
**Responsibility**: User management, authentication, authorization

**Endpoints**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/preferences` - Get travel preferences
- `PUT /api/users/preferences` - Update preferences

**Database**: PostgreSQL
- Users table
- Profiles table
- Preferences table
- Sessions table

**Events Published**:
- `user.registered`
- `user.logged_in`
- `user.profile_updated`

---

### 2. Search Service (FastAPI - Python)
**Responsibility**: Aggregate search from multiple travel APIs

**Endpoints**:
- `POST /api/search/flights` - Search flights
- `POST /api/search/hotels` - Search hotels
- `POST /api/search/packages` - Search complete packages
- `GET /api/search/suggestions` - Autocomplete destinations

**External Integrations**:
- Skyscanner API (flights)
- Amadeus API (flights backup)
- Booking.com API (hotels)
- Airbnb API (alternative accommodation)
- Kiwi.com API (budget flights)

**Caching Strategy**:
```python
# Cache key structure
flight_key = f"flight:{origin}:{dest}:{date}:{passengers}"
hotel_key = f"hotel:{dest}:{checkin}:{checkout}:{guests}"

# TTL
FLIGHT_CACHE_TTL = 600  # 10 minutes
HOTEL_CACHE_TTL = 900   # 15 minutes
```

**Performance**:
- Parallel API calls using `asyncio`
- Response streaming using SSE
- First results in 3-5 seconds
- Complete results in 10-15 seconds max

---

### 3. Booking Service (NestJS)
**Responsibility**: Handle booking transactions

**Endpoints**:
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings` - List user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/modify` - Modify booking

**Database**: PostgreSQL
- Bookings table
- Booking_items table (flights, hotels)
- Transactions table

**Events Published**:
- `booking.created`
- `booking.confirmed`
- `booking.cancelled`
- `booking.payment_completed`

**State Machine**:
```
PENDING → PAYMENT_PROCESSING → CONFIRMED → COMPLETED
    │           │                   │
    └─────────→ CANCELLED ←─────────┘
                    │
                    ▼
                REFUNDED
```

---

### 4. AI Service (FastAPI - Python)
**Responsibility**: AI-powered features

**Endpoints**:
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/recommend` - Get personalized recommendations
- `POST /api/ai/itinerary` - Generate itinerary
- `POST /api/ai/predict-price` - Predict price trends

**ML Models**:
1. **Recommendation Engine**
   - Collaborative filtering
   - Content-based filtering
   - Hybrid approach
   
2. **Price Prediction**
   - Time series forecasting (LSTM)
   - Historical price data
   - Seasonal patterns

3. **Itinerary Generation**
   - GPT-4 based generation
   - Constraint satisfaction
   - Route optimization

**Vector Database**: Pinecone
- Store user preference embeddings
- Semantic search for similar trips
- Fast similarity matching

---

### 5. Package Service (NestJS)
**Responsibility**: Curated vacation packages

**Endpoints**:
- `GET /api/packages` - List packages (filtered, sorted)
- `GET /api/packages/:id` - Get package details
- `GET /api/packages/featured` - Featured packages
- `GET /api/packages/deals` - Best deals
- `POST /api/packages` - Create package (admin)

**Database**: PostgreSQL + Elasticsearch
- Packages table
- Package_days table (itinerary)
- Package_includes table
- Elasticsearch index for fast search

**Features**:
- Full-text search
- Faceted filtering (price, duration, type)
- Dynamic pricing based on season
- Availability calendar

---

### 6. Payment Service (NestJS)
**Responsibility**: Payment processing

**Endpoints**:
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/:id` - Get payment status

**Integrations**:
- Stripe (primary)
- PayPal (alternative)
- Apple Pay / Google Pay

**Security**:
- PCI-DSS compliant (via Stripe)
- No card data stored
- Webhook signature verification
- Idempotency keys

---

### 7. Notification Service (NestJS)
**Responsibility**: Multi-channel notifications

**Channels**:
- Email (SendGrid)
- SMS (Twilio)
- Push notifications (FCM)
- In-app notifications

**Event Listeners**:
- `booking.confirmed` → Send confirmation email
- `payment.completed` → Send receipt
- `price_alert.triggered` → Send price alert
- `user.registered` → Send welcome email

**Templates**:
- Handlebars/Pug templates
- Multi-language support
- Personalization variables

---

### 8. Gamification Service (NestJS)
**Responsibility**: Points, badges, leaderboards

**Endpoints**:
- `GET /api/gamification/points` - Get user points
- `POST /api/gamification/points` - Award points
- `GET /api/gamification/badges` - Get user badges
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/challenges` - Active challenges

**Point System**:
```typescript
enum PointEvents {
  FIRST_BOOKING = 500,
  BOOKING_COMPLETED = 100,
  REVIEW_WRITTEN = 50,
  REFERRAL = 200,
  CHALLENGE_COMPLETED = 300,
}
```

**Badges**:
- First Traveler (first booking)
- Globe Trotter (10 bookings)
- Budget Master (saved €500+)
- Social Butterfly (5 reviews)

---

### 9. Analytics Service (NestJS)
**Responsibility**: Data analytics and reporting

**Endpoints**:
- `POST /api/analytics/events` - Track event
- `GET /api/analytics/dashboard` - Get metrics
- `GET /api/analytics/reports` - Generate reports

**Metrics Tracked**:
- User behavior (searches, clicks, conversions)
- Performance metrics (response times, errors)
- Business metrics (revenue, bookings, conversions)

**Tools**:
- Prometheus (metrics collection)
- Grafana (visualization)
- ELK Stack (log analysis)

---

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  verifiedEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  userId: string;
  favoriteDestinations: string[];
  budgetRange: { min: number; max: number };
  travelStyle: 'budget' | 'comfort' | 'luxury';
  interests: string[];
  dietaryRestrictions: string[];
}

interface UserPoints {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  level: number;
  badges: Badge[];
}
```

### Booking Model
```typescript
interface Booking {
  id: string;
  userId: string;
  status: BookingStatus;
  totalPrice: number;
  currency: string;
  flights: FlightBooking[];
  hotels: HotelBooking[];
  extras: ExtraBooking[];
  paymentId: string;
  confirmationCode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FlightBooking {
  bookingId: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: Passenger[];
  airline: string;
  flightNumber: string;
  price: number;
  pnr: string;
}
```

### Package Model
```typescript
interface Package {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  type: 'adventure' | 'luxury' | 'budget' | 'cultural';
  includes: string[];
  itinerary: PackageDay[];
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PackageDay {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
}
```

---

## Communication Patterns

### Synchronous Communication (REST)
- Client → API Gateway → Service
- Used for: Real-time requests (search, booking)
- Protocol: HTTP/HTTPS
- Format: JSON

### Asynchronous Communication (Events)
- Service → Message Queue → Service
- Used for: Background jobs, notifications
- Protocol: AMQP (RabbitMQ) / Kafka
- Format: JSON

**Event Structure**:
```typescript
interface Event {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  data: any;
  metadata?: any;
}
```

**Example Events**:
```typescript
// User registered event
{
  id: "evt_123",
  type: "user.registered",
  timestamp: "2024-01-15T10:30:00Z",
  source: "user-service",
  data: {
    userId: "usr_456",
    email: "user@example.com"
  }
}

// Booking created event
{
  id: "evt_789",
  type: "booking.created",
  timestamp: "2024-01-15T11:00:00Z",
  source: "booking-service",
  data: {
    bookingId: "bkg_101",
    userId: "usr_456",
    totalPrice: 1200.00,
    currency: "EUR"
  }
}
```

---

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. User Service validates credentials
3. Generate JWT (access token - 15 min)
4. Generate refresh token (7 days)
5. Store refresh token in HTTP-only cookie
6. Return access token to client
7. Client includes access token in Authorization header
8. API Gateway validates token
9. Extract user context and forward to services
```

### Authorization
- **RBAC (Role-Based Access Control)**
  - Roles: user, premium, admin, partner
  - Permissions: read, write, delete
  
- **Implemented at API Gateway level**
- **JWT claims include user roles**

### Data Encryption
- **At Rest**: PostgreSQL encryption
- **In Transit**: TLS 1.3
- **PII**: Encrypted columns (AES-256)
- **Passwords**: bcrypt (cost factor 12)

---

## Scalability Strategy

### Horizontal Scaling
```yaml
# Kubernetes HPA example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: search-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: search-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Scaling
- **Read Replicas**: 3+ replicas for read-heavy operations
- **Connection Pooling**: PgBouncer (max 1000 connections)
- **Sharding**: Geographic sharding (future)
- **CQRS**: Separate read/write models (future)

### Cache Scaling
- **Redis Cluster**: 3 master nodes, 3 replica nodes
- **Cache Hierarchy**: Browser → CDN → Redis → DB
- **Cache Warming**: Pre-populate popular searches

---

## Observability

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Alertmanager**: Alert notifications

### Logging
- **Structured Logging**: JSON format
- **Centralized**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Log Levels**: ERROR, WARN, INFO, DEBUG

### Tracing
- **Jaeger**: Distributed tracing
- **OpenTelemetry**: Instrumentation
- **Trace correlation**: Across all services

### Key Metrics
```
# Application Metrics
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Conversion rate (%)

# Infrastructure Metrics
- CPU utilization (%)
- Memory usage (MB)
- Network I/O (MB/s)
- Disk I/O (IOPS)

# Business Metrics
- Active users
- Bookings per day
- Revenue per day
- Average booking value
```

---

## Deployment Architecture

### Kubernetes Cluster
```
Production Cluster (AWS EKS / GKE)
├── Namespace: production
│   ├── Deployment: api-gateway (replicas: 3)
│   ├── Deployment: user-service (replicas: 3)
│   ├── Deployment: search-service (replicas: 5)
│   ├── Deployment: booking-service (replicas: 3)
│   ├── Deployment: ai-service (replicas: 2)
│   ├── Deployment: package-service (replicas: 3)
│   ├── Deployment: payment-service (replicas: 3)
│   ├── Deployment: notification-service (replicas: 2)
│   ├── Deployment: gamification-service (replicas: 2)
│   └── Deployment: analytics-service (replicas: 2)
│
├── Namespace: monitoring
│   ├── Deployment: prometheus
│   ├── Deployment: grafana
│   └── Deployment: jaeger
│
└── Namespace: databases
    ├── StatefulSet: postgresql-primary
    ├── StatefulSet: postgresql-replicas (replicas: 3)
    ├── StatefulSet: redis-cluster (replicas: 6)
    └── StatefulSet: elasticsearch (replicas: 3)
```

### CI/CD Pipeline
```
GitHub Push
    │
    ▼
GitHub Actions Triggered
    │
    ├──▶ Run Tests (Jest, Pytest)
    │
    ├──▶ Lint Code (ESLint, Black)
    │
    ├──▶ Security Scan (Snyk, Trivy)
    │
    ├──▶ Build Docker Images
    │
    ├──▶ Push to Container Registry
    │
    ├──▶ Update Helm Charts
    │
    └──▶ Deploy to K8s Cluster
         │
         ├──▶ Staging (auto)
         │
         └──▶ Production (manual approval)
```

---

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups (7-day retention)
- **Incremental backups**: Every 6 hours
- **Point-in-time recovery**: Up to 7 days
- **Cross-region replication**: Yes

### High Availability
- **Multi-AZ deployment**: Services across 3 availability zones
- **Database failover**: Automatic (< 30 seconds)
- **Service replicas**: Minimum 3 per service
- **Health checks**: Liveness and readiness probes

### Recovery Objectives
- **RTO (Recovery Time Objective)**: < 1 hour
- **RPO (Recovery Point Objective)**: < 15 minutes
- **Uptime SLA**: 99.9% (8.76 hours downtime/year)

---

This architecture is designed to be:
- ✅ **Scalable**: Horizontal scaling at every layer
- ✅ **Resilient**: Fault-tolerant with redundancy
- ✅ **Performant**: Optimized caching and async processing
- ✅ **Secure**: Defense in depth approach
- ✅ **Observable**: Comprehensive monitoring and logging
- ✅ **Maintainable**: Clean separation of concerns


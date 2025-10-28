#!/bin/bash

# BooksyGo Setup Script
# This script sets up the development environment

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌍 BooksyGo Setup Script${NC}\n"

# Check if required tools are installed
echo -e "${BLUE}Checking prerequisites...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    fi
}

MISSING_TOOLS=0

check_command node || MISSING_TOOLS=$((MISSING_TOOLS + 1))
check_command npm || MISSING_TOOLS=$((MISSING_TOOLS + 1))
check_command docker || MISSING_TOOLS=$((MISSING_TOOLS + 1))
check_command docker-compose || MISSING_TOOLS=$((MISSING_TOOLS + 1))

if [ $MISSING_TOOLS -gt 0 ]; then
    echo -e "\n${RED}Please install missing tools before continuing${NC}"
    echo -e "${YELLOW}Visit the following:${NC}"
    echo "  - Node.js: https://nodejs.org"
    echo "  - Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "\n${GREEN}All prerequisites met!${NC}\n"

# Create .env file from example
echo -e "${BLUE}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ Please edit .env with your API keys${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping${NC}"
fi

# Start infrastructure services
echo -e "\n${BLUE}Starting infrastructure services...${NC}"
docker-compose up -d postgres redis elasticsearch rabbitmq

echo -e "\n${BLUE}Waiting for services to be ready...${NC}"
sleep 10

# Check if PostgreSQL is ready
echo -e "${BLUE}Checking PostgreSQL...${NC}"
until docker exec booksygo-postgres pg_isready -U booksygo &> /dev/null; do
    echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Check if Redis is ready
echo -e "${BLUE}Checking Redis...${NC}"
until docker exec booksygo-redis redis-cli -a booksygo_redis_password ping &> /dev/null; do
    echo -e "${YELLOW}Waiting for Redis...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ Redis is ready${NC}"

# Check if Elasticsearch is ready
echo -e "${BLUE}Checking Elasticsearch...${NC}"
until curl -s http://localhost:9200/_cluster/health &> /dev/null; do
    echo -e "${YELLOW}Waiting for Elasticsearch...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ Elasticsearch is ready${NC}"

# Check if RabbitMQ is ready
echo -e "${BLUE}Checking RabbitMQ...${NC}"
until docker exec booksygo-rabbitmq rabbitmq-diagnostics ping &> /dev/null; do
    echo -e "${YELLOW}Waiting for RabbitMQ...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ RabbitMQ is ready${NC}"

echo -e "\n${GREEN}✅ Setup complete!${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo "  1. Edit .env file with your API keys"
echo "  2. Run 'make install' to install dependencies"
echo "  3. Run 'make dev-frontend' to start frontend"
echo "  4. Run 'make dev-backend' to start backend services"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  - make start         # Start all services"
echo "  - make stop          # Stop all services"
echo "  - make logs          # View logs"
echo "  - make check-health  # Check service health"
echo "  - make help          # See all commands"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"


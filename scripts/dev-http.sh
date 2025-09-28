#!/bin/bash

# Development HTTP Server Script
# Starts the frontend in HTTP mode to avoid mixed content issues

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Frontend in HTTP Mode for Development${NC}"
echo -e "${YELLOW}⚠️  This is for development only - production should use HTTPS${NC}"
echo ""

# Configuration
BACKEND_URL="https://44.194.207.22"
FRONTEND_PORT="3000"

echo -e "${BLUE}Configuration:${NC}"
echo "  📡 Backend API: $BACKEND_URL"
echo "  🌐 Frontend: http://localhost:$FRONTEND_PORT"
echo "  🔓 Protocol: HTTP (no mixed content issues)"
echo ""

# Create temporary .env.local for this session
echo -e "${BLUE}Creating temporary development environment...${NC}"
cat > .env.local << EOF
# Temporary development configuration
HTTPS=false
PORT=$FRONTEND_PORT
REACT_APP_API_URL=$BACKEND_URL
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=true
EOF

echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

# Test backend connectivity
echo -e "${BLUE}Testing backend connectivity...${NC}"
if curl -s --connect-timeout 5 "$BACKEND_URL/v1/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is reachable at $BACKEND_URL${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not reachable - make sure it's running${NC}"
fi
echo ""

# Start the development server
echo -e "${BLUE}Starting React development server...${NC}"
echo -e "${GREEN}🌐 Frontend will be available at: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${YELLOW}📝 Press Ctrl+C to stop the server${NC}"
echo ""

# Start with explicit environment variables
HTTPS=false \
PORT=$FRONTEND_PORT \
REACT_APP_API_URL=$BACKEND_URL \
npm start

# Cleanup on exit
cleanup() {
    echo ""
    echo -e "${BLUE}🧹 Cleaning up temporary files...${NC}"
    rm -f .env.local
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

trap cleanup EXIT

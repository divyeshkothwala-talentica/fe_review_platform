# Development Workarounds for Mixed Content Issue

## Problem
- **Frontend**: HTTPS via CloudFront (`https://d123456789.cloudfront.net`)
- **Backend**: HTTP on EC2 (`http://44.194.207.22:5000`)
- **Issue**: Browsers block HTTP API calls from HTTPS pages

## 🚀 Recommended Development Solutions

### 1. Serve Frontend Over HTTP (Easiest)

#### Option A: Disable HTTPS in React Development Server
```bash
# Method 1: Environment variable
HTTPS=false npm start

# Method 2: Update package.json
{
  "scripts": {
    "start": "HTTPS=false react-scripts start",
    "start:http": "HTTPS=false react-scripts start"
  }
}
```

#### Option B: Create Development Environment File
```bash
# Create .env.development.local
echo "HTTPS=false" > .env.development.local
echo "REACT_APP_API_URL=http://44.194.207.22:5000" >> .env.development.local

# Then run normally
npm start
```

**Result**: Frontend runs at `http://localhost:3000` → No mixed content issues!

---

### 2. Use Development Proxy (Cleanest Solution)

#### Setup Proxy in package.json
```json
{
  "name": "fe_review_platform",
  "proxy": "http://44.194.207.22:5000",
  "scripts": {
    "start": "react-scripts start"
  }
}
```

#### Update API Service for Development
```typescript
// src/services/api.ts
constructor() {
  // In development, use relative URLs (proxy handles routing)
  // In production, use full backend URL
  this.baseURL = process.env.NODE_ENV === 'development' 
    ? '' // Proxy handles this
    : (process.env.REACT_APP_API_URL || 'http://44.194.207.22:5000');
}
```

#### Update API Calls
```typescript
// Instead of: http://44.194.207.22:5000/v1/books
// Use: /v1/books (proxy forwards to backend)
```

**Result**: 
- Development: `http://localhost:3000/v1/books` → Proxy → `http://44.194.207.22:5000/v1/books`
- Production: Direct calls to backend

---

### 3. Browser Security Flags (Quick Testing Only)

#### Chrome with Disabled Security
```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --disable-web-security \
  --user-data-dir="/tmp/chrome_dev" \
  --disable-features=VizDisplayCompositor

# Linux
google-chrome \
  --disable-web-security \
  --user-data-dir="/tmp/chrome_dev" \
  --disable-features=VizDisplayCompositor

# Windows
chrome.exe \
  --disable-web-security \
  --user-data-dir="C:\temp\chrome_dev" \
  --disable-features=VizDisplayCompositor
```

#### Firefox with Disabled Security
```bash
# Create new Firefox profile for development
firefox -CreateProfile "dev-profile"

# Launch with relaxed security
firefox -profile ~/.mozilla/firefox/dev-profile \
  -pref security.tls.insecure_fallback_hosts=44.194.207.22
```

**⚠️ Warning**: Only use for development! Never browse other sites with these flags.

---

## 🛠 Development Scripts

### Create Development Helper Scripts

#### `scripts/dev-http.sh`
```bash
#!/bin/bash
echo "Starting frontend in HTTP mode for development..."
HTTPS=false REACT_APP_API_URL=http://44.194.207.22:5000 npm start
```

#### `scripts/dev-proxy.sh`
```bash
#!/bin/bash
echo "Starting frontend with proxy to backend..."
# Temporarily add proxy to package.json
npm config set proxy http://44.194.207.22:5000
npm start
```

#### `scripts/dev-chrome.sh`
```bash
#!/bin/bash
echo "Starting Chrome with disabled security for development..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --disable-web-security \
  --user-data-dir="/tmp/chrome_dev" \
  --new-window \
  http://localhost:3000
```

Make scripts executable:
```bash
chmod +x scripts/dev-*.sh
```

---

## 🔧 Environment-Specific Configuration

### Development Configuration
```bash
# .env.development
HTTPS=false
REACT_APP_API_URL=http://44.194.207.22:5000
REACT_APP_ENVIRONMENT=development
```

### Local Development Configuration
```bash
# .env.local (overrides other env files)
HTTPS=false
REACT_APP_API_URL=http://44.194.207.22:5000
```

### Production Configuration
```bash
# .env.production
HTTPS=true
REACT_APP_API_URL=https://your-secure-backend.com
REACT_APP_ENVIRONMENT=production
```

---

## 🧪 Testing Different Scenarios

### Test HTTP Frontend + HTTP Backend
```bash
# Terminal 1: Start frontend in HTTP mode
HTTPS=false npm start

# Terminal 2: Test API calls
curl http://localhost:3000
curl http://44.194.207.22:5000/v1/health
```

### Test Proxy Setup
```bash
# With proxy in package.json
npm start

# Test that proxy works
curl http://localhost:3000/v1/health
# Should return same as: curl http://44.194.207.22:5000/v1/health
```

### Test Production-like Setup
```bash
# Build for production
npm run build

# Serve with a simple HTTP server
npx serve -s build -p 3000

# Test mixed content (will fail)
curl https://localhost:3000  # If you have local HTTPS
```

---

## 🔍 Debugging Mixed Content Issues

### Check Browser Console
```javascript
// Open browser dev tools and look for:
// "Mixed Content: The page at 'https://...' was loaded over HTTPS, 
//  but requested an insecure XMLHttpRequest endpoint 'http://...'"
```

### Network Tab Analysis
1. Open browser dev tools
2. Go to Network tab
3. Try to make API calls
4. Look for:
   - ❌ **Blocked requests** (mixed content)
   - ✅ **Successful requests** (same protocol)

### Test API Connectivity
```bash
# Test direct backend access
curl -v http://44.194.207.22:5000/v1/health

# Test CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://44.194.207.22:5000/v1/health
```

---

## 📋 Quick Setup Guide

### For Immediate Development:

#### Option 1: HTTP Frontend (Recommended)
```bash
cd fe_review_platform
echo "HTTPS=false" > .env.local
npm start
# Visit: http://localhost:3000
```

#### Option 2: Proxy Setup
```bash
cd fe_review_platform
# Add to package.json: "proxy": "http://44.194.207.22:5000"
npm start
# Visit: http://localhost:3000
```

#### Option 3: Chrome with Disabled Security
```bash
# Start Chrome with security disabled
./scripts/dev-chrome.sh
# Visit: https://your-cloudfront-domain.cloudfront.net
```

---

## ⚖️ Pros and Cons

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **HTTP Frontend** | ✅ Simple, Safe, No browser changes | ❌ Not testing production setup | Daily development |
| **Proxy Setup** | ✅ Clean, Production-like URLs | ❌ Requires configuration changes | Integration testing |
| **Browser Flags** | ✅ Tests actual production URLs | ❌ Unsafe, Browser-specific | Quick testing only |

---

## 🚨 Security Warnings

### ❌ Never Do in Production:
- Browser security flags
- Disabled HTTPS
- Mixed content meta tags
- CORS wildcards

### ✅ Safe for Development:
- HTTP development server
- Proxy configuration
- Local environment variables
- Development browser profiles

---

## 🎯 Recommended Workflow

### Daily Development:
```bash
# Use HTTP frontend
HTTPS=false npm start
```

### Integration Testing:
```bash
# Use proxy setup
npm start  # with proxy in package.json
```

### Production Testing:
```bash
# Deploy to staging with proper SSL
# Or use browser flags for quick verification
```

This approach lets you develop efficiently while planning for proper SSL setup in production!

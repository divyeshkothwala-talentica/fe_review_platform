# Corrected Architecture: CloudFront + Direct EC2 API Calls

## Architecture Overview

```
┌─────────────────┐    HTTPS     ┌─────────────────┐
│                 │ ──────────── │                 │
│   Browser       │              │   CloudFront    │
│                 │ ◄──────────── │   (Static Files)│
└─────────────────┘              └─────────────────┘
         │                                │
         │ HTTP API Calls                 │ HTTPS Static Files
         │ (Mixed Content Issue!)         │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│                 │              │                 │
│   EC2 Backend   │              │   S3 Bucket     │
│ 44.194.207.22   │              │ (React Build)   │
│    Port 5000    │              │                 │
└─────────────────┘              └─────────────────┘
```

## Current Configuration

### CloudFront (HTTPS)
- **Purpose**: Serve static React files only
- **Origin**: S3 bucket with React build
- **Domain**: `https://d123456789.cloudfront.net`
- **SSL**: Automatic HTTPS via CloudFront

### EC2 Backend (HTTP)
- **Purpose**: API endpoints
- **IP**: `44.194.207.22:5000`
- **Endpoints**: `/v1/*` (e.g., `/v1/books`, `/v1/auth/login`)
- **Protocol**: HTTP only (no SSL)

### Frontend API Configuration
- **Base URL**: `http://44.194.207.22:5000`
- **API Path**: `/api/v1/*` → constructs `http://44.194.207.22:5000/api/v1/books`
- **Issue**: Frontend served over HTTPS, API calls over HTTP = Mixed Content Error

## The Mixed Content Problem

### What Happens
1. User visits: `https://d123456789.cloudfront.net`
2. Frontend loads over HTTPS (secure)
3. Frontend tries to call: `http://44.194.207.22:5000/api/v1/books` (insecure)
4. Browser blocks the request: **Mixed Content Error**

### Browser Error Message
```
Mixed Content: The page at 'https://d123456789.cloudfront.net' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://44.194.207.22:5000/api/v1/books'. 
This request has been blocked; the content must be served over HTTPS.
```

## Solutions

### ✅ Solution 1: Add SSL to EC2 Backend (Recommended)

#### Option A: Use Domain + Let's Encrypt
```bash
# 1. Point domain to EC2
api.yourapp.com → 44.194.207.22

# 2. Install SSL on EC2
sudo certbot --nginx -d api.yourapp.com

# 3. Update frontend
REACT_APP_API_URL=https://api.yourapp.com
```

#### Option B: Use AWS Application Load Balancer
```bash
# 1. Create ALB with SSL certificate
# 2. Point ALB to EC2 instance
# 3. Use ALB HTTPS endpoint
REACT_APP_API_URL=https://your-alb-domain.elb.amazonaws.com
```

### ✅ Solution 2: CloudFront API Proxy (Previous Approach)
Route API calls through CloudFront to avoid mixed content.

**Trade-offs:**
- ✅ No backend SSL setup needed
- ❌ Additional latency through CloudFront
- ❌ More complex routing configuration

### ❌ Solution 3: Disable Browser Security (Development Only)
```bash
# NEVER use in production
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

## Current Files Updated

### 1. Terraform Configuration
- **CloudFront**: Serves static files only (no API routing)
- **S3**: Hosts React build files
- **No backend origin**: API calls go directly to EC2

### 2. Frontend Configuration
```typescript
// src/services/api.ts
this.baseURL = process.env.REACT_APP_API_URL || 'http://44.194.207.22:5000';
//                                              ↑ Direct EC2 HTTP endpoint
```

### 3. Environment Variables
```bash
# Will cause mixed content errors when frontend served over HTTPS
REACT_APP_API_URL=http://44.194.207.22:5000
```

## Immediate Next Steps

### 1. Deploy Current Configuration
```bash
cd fe_review_platform/terraform
terraform apply
```
**Result**: CloudFront serves frontend, but API calls will be blocked by browsers.

### 2. Set Up SSL on Backend (Required for Production)
Choose one:
- **Domain + Let's Encrypt** (free, requires domain)
- **AWS ALB + ACM Certificate** (paid, managed)
- **Self-signed certificate** (development only)

### 3. Update Frontend After SSL Setup
```bash
# After backend has SSL
REACT_APP_API_URL=https://your-secure-api-domain.com
```

## Testing Steps

### 1. Deploy Current Configuration
```bash
terraform apply
```

### 2. Test Static Files
```bash
curl -I https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
# Should return 200 OK
```

### 3. Test API Calls (Will Fail)
Open browser console at `https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net`
- Look for mixed content errors
- API calls will be blocked

### 4. After SSL Setup
```bash
curl -I https://your-secure-api-domain.com/v1/health
# Should return 200 OK with HTTPS
```

## CORS Configuration Required

Backend must allow CloudFront domain:

```javascript
// Backend CORS setup
app.use(cors({
  origin: [
    'https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net',
    'http://localhost:3000' // for development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Summary

✅ **CloudFront**: Configured to serve static React files only  
✅ **Frontend**: Updated to call EC2 backend directly  
⚠️ **Mixed Content**: Will occur until backend has SSL  
🔧 **Next Step**: Set up SSL on EC2 backend for production use  

The current configuration is architecturally correct but requires SSL on the backend to work in production browsers.

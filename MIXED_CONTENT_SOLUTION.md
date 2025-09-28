# Mixed Content Issue Solution

## Problem
- **Frontend**: Served over HTTPS via CloudFront (`https://d123456789.cloudfront.net`)
- **Backend**: HTTP-only on EC2 (`http://44.194.207.22:5000`)
- **Issue**: Browsers block HTTP API calls from HTTPS pages (mixed content)

## Solutions

### Option 1: Enable HTTPS on Backend (Recommended)
Set up SSL certificate on your EC2 backend server.

#### Quick SSL Setup with Let's Encrypt
```bash
# On your EC2 instance
sudo apt update
sudo apt install certbot nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-api-domain.com

# Update your backend to use HTTPS
```

#### Update Frontend Configuration
```typescript
// src/services/api.ts
this.baseURL = process.env.REACT_APP_API_URL || 'https://your-api-domain.com';
```

### Option 2: Use CloudFront as API Proxy (Current Implementation)
Route API calls through CloudFront to avoid mixed content.

**Pros**: No backend SSL setup needed  
**Cons**: Additional latency, more complex routing  

### Option 3: Development Workaround
For development/testing only - not for production.

#### Browser Flags (Chrome)
```bash
# Launch Chrome with disabled security (DEVELOPMENT ONLY)
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

#### Meta Tag (Not Recommended)
```html
<!-- In public/index.html - INSECURE, avoid in production -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

## Current Configuration

### Frontend (CloudFront HTTPS)
- Domain: `https://d123456789.cloudfront.net`
- Serves: Static React files from S3
- Protocol: HTTPS (secure)

### Backend (EC2 HTTP)
- Domain: `http://44.194.207.22:5000`
- Serves: API endpoints at `/v1/*`
- Protocol: HTTP (insecure)

### API Calls
Frontend makes direct calls to EC2:
```javascript
// This will be blocked by browsers due to mixed content
fetch('http://44.194.207.22:5000/v1/books') // ❌ HTTP from HTTPS page
```

## Recommended Implementation

### Step 1: Set up SSL on EC2 Backend

#### Option A: Use a Domain with Let's Encrypt
1. Point a domain to your EC2 IP: `api.yourapp.com → 44.194.207.22`
2. Install SSL certificate
3. Update backend to serve HTTPS on port 443

#### Option B: Use AWS Application Load Balancer
1. Create ALB with SSL certificate
2. Point ALB to your EC2 instance
3. Use ALB's HTTPS endpoint

### Step 2: Update Frontend Configuration
```bash
# Update environment variables
REACT_APP_API_URL=https://api.yourapp.com

# Or update default in src/services/api.ts
this.baseURL = process.env.REACT_APP_API_URL || 'https://api.yourapp.com';
```

### Step 3: Update CORS on Backend
```javascript
// Backend CORS configuration
app.use(cors({
  origin: [
    'https://d123456789.cloudfront.net', // Your CloudFront domain
    'http://localhost:3000' // For local development
  ],
  credentials: true
}));
```

## Testing Mixed Content Issues

### Check Browser Console
```javascript
// Open browser dev tools and look for errors like:
// "Mixed Content: The page at 'https://...' was loaded over HTTPS, 
//  but requested an insecure XMLHttpRequest endpoint 'http://...'"
```

### Test API Connectivity
```bash
# Test direct API access
curl http://44.194.207.22:5000/v1/health

# Test CORS headers
curl -H "Origin: https://d123456789.cloudfront.net" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://44.194.207.22:5000/v1/health
```

## Temporary Development Solution

If you need to test immediately without SSL setup:

### 1. Use HTTP for Development
Serve frontend over HTTP for local testing:
```bash
# In package.json, add:
"scripts": {
  "start": "HTTPS=false react-scripts start"
}
```

### 2. Use Proxy for Local Development
```json
// In package.json
{
  "proxy": "http://44.194.207.22:5000"
}
```

Then update API calls to use relative URLs:
```javascript
// Instead of: http://44.194.207.22:5000/v1/books
// Use: /v1/books (proxy will forward to backend)
```

## Production Deployment Checklist

- [ ] Backend has SSL certificate and serves HTTPS
- [ ] Frontend configured with HTTPS backend URL
- [ ] CORS configured for CloudFront domain
- [ ] All API calls use HTTPS endpoints
- [ ] Test in browser without mixed content errors
- [ ] Update CI/CD pipelines with HTTPS URLs

## Next Steps

1. **Immediate**: Set up SSL on your EC2 backend
2. **Update**: Frontend configuration to use HTTPS backend URL
3. **Test**: Verify no mixed content errors in browser
4. **Deploy**: Apply changes to production environment

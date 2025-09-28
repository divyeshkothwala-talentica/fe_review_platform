# Self-Signed SSL Certificate Setup Guide

## Overview
With the backend now using HTTPS with a self-signed certificate, the frontend has been updated to make HTTPS API calls, eliminating mixed content issues.

## Frontend Configuration Updated

### 1. API Service Configuration
```typescript
// Updated in src/services/api.ts
this.baseURL = process.env.REACT_APP_API_URL || 'https://44.194.207.22:5000';
```

### 2. Action Files
All action files now construct URLs like:
```typescript
// Example: getBooksActions.ts
let getBooksUrl = getBase() + '/v1' + URLS.BOOKS_URL;
// Results in: https://44.194.207.22:5000/v1/books
```

## Current Architecture

### Request Flow
```
Browser (HTTPS) → CloudFront (HTTPS) → Direct HTTPS API calls → Backend (HTTPS)
```

### No Mixed Content Issues
- ✅ Frontend: HTTPS via CloudFront
- ✅ API Calls: HTTPS to backend
- ✅ Same protocol throughout

## Self-Signed Certificate Handling

### Browser Behavior
Self-signed certificates will cause browser security warnings. Here are the solutions:

### Option 1: Accept Certificate in Browser (Recommended for Development)

#### Step 1: Visit Backend Directly
1. Open browser to: `https://44.194.207.22:5000`
2. Browser will show security warning
3. Click "Advanced" → "Proceed to 44.194.207.22 (unsafe)"
4. This adds the certificate to browser's exception list

#### Step 2: Test API Endpoint
1. Visit: `https://44.194.207.22:5000/v1/books`
2. Should return JSON data without security warnings
3. Certificate is now trusted for this session

#### Step 3: Use Application
1. Visit: `https://d157ilt95f9lq6.cloudfront.net/`
2. API calls should now work without certificate errors

### Option 2: Chrome Flags for Development
```bash
# Launch Chrome with relaxed SSL verification
google-chrome \
  --ignore-certificate-errors \
  --ignore-ssl-errors \
  --ignore-certificate-errors-spki-list \
  --user-data-dir="/tmp/chrome_dev_ssl" \
  https://d157ilt95f9lq6.cloudfront.net/
```

### Option 3: Firefox Configuration
1. Open Firefox
2. Go to `about:config`
3. Search for `security.tls.insecure_fallback_hosts`
4. Add: `44.194.207.22`
5. Restart Firefox

## Environment Configuration

### Development Environment
```bash
# .env.development
REACT_APP_API_URL=https://44.194.207.22:5000
REACT_APP_ENVIRONMENT=development
HTTPS=true
```

### Production Environment
```bash
# .env.production
REACT_APP_API_URL=https://44.194.207.22:5000
REACT_APP_ENVIRONMENT=production
HTTPS=true
```

## Testing Steps

### 1. Test Backend SSL
```bash
# Test if backend HTTPS is working
curl -k https://44.194.207.22:5000/v1/books
# -k flag ignores certificate errors
```

### 2. Test Frontend Access
```bash
# Both should work without redirects now:
curl -I http://d157ilt95f9lq6.cloudfront.net/
curl -I https://d157ilt95f9lq6.cloudfront.net/
```

### 3. Browser Testing
1. **Accept Backend Certificate**: Visit `https://44.194.207.22:5000` and accept certificate
2. **Test Application**: Visit `https://d157ilt95f9lq6.cloudfront.net/`
3. **Check Network Tab**: API calls should succeed without certificate errors

## Troubleshooting

### Certificate Errors in Browser
```
Error: "NET::ERR_CERT_AUTHORITY_INVALID"
Solution: Accept certificate by visiting backend URL directly
```

### Mixed Content Errors (Should be resolved)
```
Error: "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'"
Solution: Already fixed - all calls now use HTTPS
```

### CORS Errors
```
Error: "Access to XMLHttpRequest at 'https://44.194.207.22:5000' from origin 'https://d157ilt95f9lq6.cloudfront.net' has been blocked by CORS policy"
Solution: Ensure backend CORS allows CloudFront domain
```

## Backend CORS Configuration

Ensure your backend allows the CloudFront domain:

```javascript
// Example Express.js CORS configuration
app.use(cors({
  origin: [
    'https://d157ilt95f9lq6.cloudfront.net',
    'http://d157ilt95f9lq6.cloudfront.net',
    'http://localhost:3000' // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Development Workflow

### Option 1: HTTPS CloudFront (Recommended)
```bash
# Now works without mixed content issues:
https://d157ilt95f9lq6.cloudfront.net/

# Steps:
# 1. Accept backend certificate: https://44.194.207.22:5000
# 2. Use application: https://d157ilt95f9lq6.cloudfront.net/
```

### Option 2: HTTP CloudFront (Also works)
```bash
# Still works, now with HTTPS API calls:
http://d157ilt95f9lq6.cloudfront.net/

# No certificate acceptance needed
```

### Option 3: Local Development
```bash
# Updated script now uses HTTPS backend:
./scripts/dev-http.sh
# Serves at: http://localhost:3000
# API calls to: https://44.194.207.22:5000
```

## Security Notes

### Development vs Production

#### Development (Current)
- ✅ Self-signed certificates acceptable
- ✅ Browser security warnings can be bypassed
- ✅ Focus on functionality over security

#### Production (Future)
- 🔒 Use proper SSL certificates (Let's Encrypt, commercial CA)
- 🔒 No browser security warnings
- 🔒 Full SSL/TLS security

## Summary

✅ **Frontend Updated**: All API calls now use HTTPS  
✅ **Mixed Content Resolved**: Same protocol throughout  
✅ **Self-Signed Support**: Browser can accept certificate exceptions  
✅ **Development Ready**: Multiple testing options available  
🔧 **Next Step**: Accept backend certificate in browser and test application  

The configuration is now properly set up for HTTPS backend with self-signed certificates!

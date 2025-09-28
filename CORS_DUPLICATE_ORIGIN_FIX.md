# CORS Duplicate Origin Fix

## Issue Identified
The backend CORS configuration has duplicate `Access-Control-Allow-Origin` values:
```
Access-Control-Allow-Origin: https://d157ilt95f9lq6.cloudfront.net, https://d157ilt95f9lq6.cloudfront.net
```

This causes the browser to block the request because only one origin value is allowed in the header.

## Root Cause
The backend CORS configuration is likely adding the CloudFront domain multiple times, possibly due to:
1. Multiple CORS middleware configurations
2. Duplicate entries in the allowed origins array
3. CORS configuration being applied multiple times

## Solution

### Backend CORS Configuration Fix

Update your backend CORS configuration to ensure the CloudFront domain is only listed once:

#### Express.js Example:
```javascript
const cors = require('cors');

// ✅ Correct - Single entry for each origin
app.use(cors({
  origin: [
    'https://d157ilt95f9lq6.cloudfront.net',  // CloudFront domain (once only)
    'http://localhost:3000'                   // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// ❌ Avoid - Multiple CORS configurations
// Don't have multiple app.use(cors(...)) calls
```

#### Check for Duplicate Configurations:
```javascript
// Look for multiple instances of:
app.use(cors({...}));

// Or multiple origin entries:
origin: [
  'https://d157ilt95f9lq6.cloudfront.net',
  'https://d157ilt95f9lq6.cloudfront.net',  // ❌ Duplicate
  'http://localhost:3000'
]
```

### Common Patterns to Fix:

#### Pattern 1: Multiple CORS Middleware
```javascript
// ❌ Wrong - Multiple CORS configurations
app.use(cors({ origin: 'https://d157ilt95f9lq6.cloudfront.net' }));
app.use(cors({ origin: 'http://localhost:3000' }));

// ✅ Correct - Single CORS configuration
app.use(cors({
  origin: [
    'https://d157ilt95f9lq6.cloudfront.net',
    'http://localhost:3000'
  ]
}));
```

#### Pattern 2: Duplicate Array Entries
```javascript
// ❌ Wrong - Duplicate entries
const allowedOrigins = [
  'https://d157ilt95f9lq6.cloudfront.net',
  'https://d157ilt95f9lq6.cloudfront.net',  // Duplicate
  'http://localhost:3000'
];

// ✅ Correct - Unique entries only
const allowedOrigins = [
  'https://d157ilt95f9lq6.cloudfront.net',
  'http://localhost:3000'
];
```

#### Pattern 3: Environment-Based Duplicates
```javascript
// ❌ Wrong - May cause duplicates
const origins = [];
if (process.env.CLOUDFRONT_DOMAIN) {
  origins.push(process.env.CLOUDFRONT_DOMAIN);
}
origins.push('https://d157ilt95f9lq6.cloudfront.net'); // Potential duplicate

// ✅ Correct - Use Set to ensure uniqueness
const origins = new Set([
  process.env.CLOUDFRONT_DOMAIN,
  'https://d157ilt95f9lq6.cloudfront.net',
  'http://localhost:3000'
]);

app.use(cors({
  origin: Array.from(origins).filter(Boolean)
}));
```

## Testing the Fix

### 1. Check Current CORS Headers
```bash
curl -H "Origin: https://d157ilt95f9lq6.cloudfront.net" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://44.194.207.22/v1/books
```

Look for the response headers:
```
Access-Control-Allow-Origin: https://d157ilt95f9lq6.cloudfront.net
```

Should be **single value**, not comma-separated duplicates.

### 2. Test API Call
```bash
curl -H "Origin: https://d157ilt95f9lq6.cloudfront.net" \
     -X GET \
     https://44.194.207.22/v1/books
```

Should return data without CORS errors.

### 3. Browser Test
After fixing the backend:
1. Visit: `https://d157ilt95f9lq6.cloudfront.net/`
2. Open browser dev tools
3. Check Network tab for successful API calls
4. Verify no CORS errors in Console

## Backend Files to Check

Look for CORS configuration in these common locations:

### Express.js:
- `app.js` or `server.js` - Main application file
- `middleware/cors.js` - Dedicated CORS middleware
- `routes/*.js` - Route-specific CORS
- `config/cors.js` - CORS configuration file

### Common File Patterns:
```javascript
// Search for these patterns in your backend:
app.use(cors(
cors({
corsOptions
Access-Control-Allow-Origin
```

## Quick Fix Commands

### Search for CORS Configuration:
```bash
# In your backend directory:
grep -r "cors" . --include="*.js"
grep -r "Access-Control-Allow-Origin" . --include="*.js"
grep -r "d157ilt95f9lq6.cloudfront.net" . --include="*.js"
```

### Find Duplicate Origins:
```bash
# Look for duplicate CloudFront domain entries
grep -r "d157ilt95f9lq6.cloudfront.net" . --include="*.js" | grep -v node_modules
```

## Expected Result After Fix

### Before (Error):
```
Access-Control-Allow-Origin: https://d157ilt95f9lq6.cloudfront.net, https://d157ilt95f9lq6.cloudfront.net
```

### After (Success):
```
Access-Control-Allow-Origin: https://d157ilt95f9lq6.cloudfront.net
```

## Summary

✅ **Frontend Fixed**: Now making correct HTTPS calls to `https://44.194.207.22/v1/*`  
⚠️ **Backend Issue**: CORS configuration has duplicate CloudFront domain  
🔧 **Next Step**: Remove duplicate origin entries from backend CORS configuration  

The frontend is working correctly now - this is purely a backend CORS configuration issue that needs to be fixed on the server side.

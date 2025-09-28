# CloudFront Infinite Redirect Fix

## Problem Identified
The CloudFront distribution at [https://d157ilt95f9lq6.cloudfront.net/](https://d157ilt95f9lq6.cloudfront.net/) is stuck in an infinite redirect loop between HTTPS and HTTP.

## Root Cause
1. **CloudFront Configuration**: `viewer_protocol_policy = "redirect-to-https"`
2. **Frontend Behavior**: Trying to make HTTP API calls from HTTPS page
3. **Browser Behavior**: Blocks mixed content, causing redirects
4. **Result**: Infinite HTTPS ↔ HTTP redirect loop

## Solution Applied

### 1. Updated CloudFront Configuration
Changed the viewer protocol policy to allow both HTTP and HTTPS:

```hcl
# Before (causing infinite redirects):
viewer_protocol_policy = "redirect-to-https"

# After (allows both protocols):
viewer_protocol_policy = "allow-all"
```

This change applies to:
- Default cache behavior
- Static assets cache behavior

### 2. Deploy the Fix
```bash
cd fe_review_platform/terraform
terraform plan
terraform apply
```

**Note**: CloudFront changes take 5-15 minutes to propagate globally.

## Development Options After Fix

### Option 1: HTTP CloudFront Access (Now Possible)
```bash
# After terraform apply, you can access:
http://d157ilt95f9lq6.cloudfront.net/
# No more infinite redirects!
```

### Option 2: HTTPS CloudFront with HTTP Backend
```bash
# This will work but with mixed content warnings:
https://d157ilt95f9lq6.cloudfront.net/
# API calls to http://44.194.207.22:5000 will be blocked by browser
```

### Option 3: Local HTTP Development (Still Recommended)
```bash
# For daily development:
./scripts/dev-http.sh
# Serves at: http://localhost:3000
```

## Testing the Fix

### 1. Wait for CloudFront Propagation
```bash
# Check if changes have propagated (may take 5-15 minutes)
curl -I http://d157ilt95f9lq6.cloudfront.net/
# Should return 200 OK without redirects
```

### 2. Test HTTP Access
```bash
# Should work without infinite redirects
curl -L http://d157ilt95f9lq6.cloudfront.net/
```

### 3. Test HTTPS Access
```bash
# Should work but API calls will be blocked (mixed content)
curl -L https://d157ilt95f9lq6.cloudfront.net/
```

## Browser Testing

### HTTP CloudFront (Recommended for Development)
1. Visit: `http://d157ilt95f9lq6.cloudfront.net/`
2. ✅ No infinite redirects
3. ✅ API calls to `http://44.194.207.22:5000` work
4. ✅ No mixed content issues

### HTTPS CloudFront (Production-like)
1. Visit: `https://d157ilt95f9lq6.cloudfront.net/`
2. ✅ No infinite redirects
3. ❌ API calls to `http://44.194.207.22:5000` blocked (mixed content)
4. 🔧 Need SSL on backend for this to work

## Security Considerations

### Development vs Production

#### Development (Current Setup)
- **CloudFront**: Allows both HTTP and HTTPS
- **Backend**: HTTP only
- **Use Case**: Testing and development

#### Production (Future Setup)
- **CloudFront**: Should redirect to HTTPS
- **Backend**: Should have SSL certificate
- **Use Case**: Live application

### Migration Path

#### Phase 1: Development (Current)
```hcl
viewer_protocol_policy = "allow-all"  # Allows HTTP for testing
```

#### Phase 2: Production (After Backend SSL)
```hcl
viewer_protocol_policy = "redirect-to-https"  # Forces HTTPS
```

## Updated Development Workflow

### 1. Apply CloudFront Fix
```bash
cd fe_review_platform/terraform
terraform apply
```

### 2. Wait for Propagation
```bash
# Wait 5-15 minutes, then test:
curl -I http://d157ilt95f9lq6.cloudfront.net/
```

### 3. Use HTTP CloudFront for Development
```bash
# Open browser to:
http://d157ilt95f9lq6.cloudfront.net/
# API calls to http://44.194.207.22:5000 will work!
```

### 4. Alternative: Local HTTP Development
```bash
# Still works as before:
./scripts/dev-http.sh
# Serves at: http://localhost:3000
```

## Verification Steps

### 1. Check CloudFront Distribution Status
- AWS Console → CloudFront → Distributions
- Status should be "Deployed"
- Last Modified should show recent timestamp

### 2. Test Both Protocols
```bash
# HTTP (should work without redirects)
curl -v http://d157ilt95f9lq6.cloudfront.net/ 2>&1 | grep "< HTTP"

# HTTPS (should work without redirects)
curl -v https://d157ilt95f9lq6.cloudfront.net/ 2>&1 | grep "< HTTP"
```

### 3. Test API Calls from Browser
1. Open: `http://d157ilt95f9lq6.cloudfront.net/`
2. Open browser dev tools
3. Try to use the application
4. Check Network tab for successful API calls

## Summary

✅ **Fixed**: Infinite redirect loop by changing `viewer_protocol_policy` to `"allow-all"`  
✅ **Enabled**: HTTP access to CloudFront for development  
✅ **Maintained**: HTTPS access for production-like testing  
⏳ **Waiting**: CloudFront propagation (5-15 minutes)  
🎯 **Next**: Test HTTP CloudFront access after propagation  

The infinite redirect issue should be resolved once the CloudFront changes propagate!

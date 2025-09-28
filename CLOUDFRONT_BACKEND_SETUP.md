# CloudFront Backend Integration Guide

This guide explains how to configure CloudFront to route API calls to your backend and resolve SSL/mixed content issues.

## Problem Statement

- **Backend**: Running at `http://44.194.207.22:5000` with API endpoints at `/v1/*`
- **Frontend**: Expects API endpoints at `/api/v1/*`
- **SSL Issue**: Frontend served over HTTPS (CloudFront) but backend is HTTP-only
- **Mixed Content**: Browser blocks HTTP API calls from HTTPS pages

## Solution Overview

Configure CloudFront to:
1. Route `/api/v1/*` requests to backend `/v1/*` endpoints
2. Handle HTTP-to-HTTPS conversion transparently
3. Eliminate mixed content issues

## Implementation Steps

### 1. Update CloudFront Configuration

The Terraform configuration has been updated with:

#### New Backend Origin
```hcl
# Backend API origin
origin {
  domain_name = "44.194.207.22"
  origin_id   = "Backend-API"
  
  custom_origin_config {
    http_port              = 5000
    https_port             = 443
    origin_protocol_policy = "http-only"
    origin_ssl_protocols   = ["TLSv1.2"]
  }
  
  origin_path = "/v1"
}
```

#### API Cache Behavior
```hcl
# Cache behavior for API requests - route /api/v1/* to backend /v1/*
ordered_cache_behavior {
  path_pattern     = "/api/v1/*"
  allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
  cached_methods   = ["GET", "HEAD"]
  target_origin_id = "Backend-API"

  forwarded_values {
    query_string = true
    headers      = ["Authorization", "Content-Type", "Accept", "Origin", "Referer"]
    cookies {
      forward = "all"
    }
  }

  min_ttl                = 0
  default_ttl            = 0
  max_ttl                = 0
  compress               = true
  viewer_protocol_policy = "redirect-to-https"
}
```

### 2. Apply Terraform Changes

```bash
cd fe_review_platform/terraform
terraform plan
terraform apply
```

### 3. Get CloudFront Domain

After applying Terraform:
```bash
terraform output cloudfront_domain_name
```

### 4. Update Frontend Configuration

Update the frontend to use CloudFront domain instead of direct backend IP:

```bash
# Run the automated script
./scripts/update-cloudfront-backend.sh

# Or manually update src/services/api.ts
# Replace: 'http://43.205.211.216:5000'
# With: 'https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net'
```

## Request Flow

### Before (Direct Backend Access)
```
Frontend (HTTPS) → Backend (HTTP) ❌ Mixed Content Error
```

### After (CloudFront Proxy)
```
Frontend (HTTPS) → CloudFront (HTTPS) → Backend (HTTP) ✅ No Mixed Content
```

### API Request Example

**Frontend Request:**
```
GET https://d123456789.cloudfront.net/api/v1/books
```

**CloudFront Routes To:**
```
GET http://44.194.207.22:5000/v1/books
```

## Configuration Details

### Path Mapping
- Frontend requests: `/api/v1/*`
- Backend serves: `/v1/*`
- CloudFront origin_path: `/v1` (strips `/api` prefix)

### Headers Forwarded
- `Authorization` (for JWT tokens)
- `Content-Type` (for POST/PUT requests)
- `Accept` (for content negotiation)
- `Origin` (for CORS)
- `Referer` (for security)

### Caching Strategy
- API requests: No caching (`default_ttl = 0`)
- Static assets: Long-term caching
- All requests: HTTPS redirect

## Testing

### 1. Test Static Content
```bash
curl -I https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
```

### 2. Test API Routing
```bash
curl -I https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net/api/v1/health
```

### 3. Test with Authentication
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net/api/v1/books
```

## Environment Variables

Update your environment files:

**.env.production**
```
REACT_APP_API_URL=https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

**.env.development**
```
REACT_APP_API_URL=https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=true
```

## Troubleshooting

### CloudFront Distribution Not Ready
- Wait 5-15 minutes for global propagation
- Check distribution status in AWS Console

### API Calls Failing
1. Verify backend is running: `curl http://44.194.207.22:5000/v1/health`
2. Check CloudFront logs in AWS Console
3. Verify CORS headers in backend responses

### Mixed Content Errors
- Ensure all requests use HTTPS CloudFront domain
- Check browser developer tools for specific errors
- Verify `viewer_protocol_policy = "redirect-to-https"`

### CORS Issues
Backend must allow CloudFront domain:
```javascript
app.use(cors({
  origin: ['https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net'],
  credentials: true
}));
```

## Benefits

✅ **No Mixed Content Issues**: All requests go through HTTPS  
✅ **SSL Termination**: CloudFront handles SSL, backend stays HTTP  
✅ **Global CDN**: Faster API responses via CloudFront edge locations  
✅ **Unified Domain**: Frontend and API on same domain  
✅ **Security**: HTTPS everywhere, proper header forwarding  

## Next Steps

1. Apply Terraform changes
2. Update frontend configuration
3. Test the application
4. Update CI/CD pipelines with new CloudFront URL
5. Monitor CloudFront metrics and logs

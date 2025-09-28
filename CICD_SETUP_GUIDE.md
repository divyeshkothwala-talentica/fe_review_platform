# CI/CD Pipeline Setup Guide

This guide will help you set up automated deployment for your Review Platform frontend using GitHub Actions, AWS S3, and CloudFront.

## 🎯 Overview

The CI/CD pipeline consists of:
- **Infrastructure Pipeline**: Deploys AWS resources (S3, CloudFront, IAM)
- **Frontend Pipeline**: Builds and deploys React application
- **Automated Triggers**: Deploys on push to main branch

## 📋 Prerequisites

Before starting, ensure you have:
1. ✅ AWS Account with appropriate permissions
2. ✅ GitHub repository for your project
3. ✅ AWS CLI configured locally
4. ✅ Terraform installed locally

## 🚀 Step-by-Step Setup

### Step 1: Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:

```hcl
# AWS Configuration
aws_region = "us-east-1"
environment = "dev"

# Project Configuration
project_name = "review-platform-frontend"
bucket_name = "review-platform-frontend-dev-YOUR-UNIQUE-SUFFIX"

# CloudFront Configuration
cloudfront_price_class = "PriceClass_100"

# GitHub Configuration (IMPORTANT: Use your actual repository)
github_repo = "YOUR_USERNAME/YOUR_REPO_NAME"

# Backend Configuration
backend_api_url = "http://43.205.211.216:5000"
```

**⚠️ Important Notes:**
- `bucket_name` must be globally unique across all AWS accounts
- `github_repo` must match your actual GitHub repository (format: `owner/repo-name`)
- Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with actual values

### Step 2: Deploy Infrastructure Manually (First Time)

```bash
cd scripts
./setup-infrastructure.sh
```

This will:
1. Validate your AWS credentials
2. Initialize Terraform
3. Create deployment plan
4. Deploy AWS resources
5. Display GitHub secrets to configure

**Expected Output:**
```
🚀 Infrastructure deployed successfully!

Please add the following secrets to your GitHub repository:
AWS_ROLE_ARN: arn:aws:iam::ACCOUNT:role/review-platform-frontend-github-actions-role
S3_BUCKET_NAME: your-unique-bucket-name
CLOUDFRONT_DISTRIBUTION_ID: E1234567890ABC
CLOUDFRONT_DOMAIN_NAME: d1234567890abc.cloudfront.net
BACKEND_API_URL: http://43.205.211.216:5000
ENVIRONMENT: dev
```

### Step 3: Configure GitHub Repository Secrets

1. **Go to your GitHub repository**
2. **Navigate to**: `Settings > Secrets and variables > Actions`
3. **Click**: "New repository secret"
4. **Add each secret** from the Terraform output:

| Secret Name | Value (from Terraform output) |
|-------------|-------------------------------|
| `AWS_ROLE_ARN` | `arn:aws:iam::ACCOUNT:role/...` |
| `S3_BUCKET_NAME` | Your unique bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `CLOUDFRONT_DOMAIN_NAME` | CloudFront domain name |
| `BACKEND_API_URL` | `http://43.205.211.216:5000` |
| `ENVIRONMENT` | `dev` |

### Step 4: Commit and Push Workflows

```bash
# Add the new files
git add .github/ terraform/ scripts/

# Commit the changes
git commit -m "Add CI/CD infrastructure and deployment workflows"

# Push to GitHub
git push origin main
```

### Step 5: Test the Pipeline

**Option A: Trigger Infrastructure Pipeline**
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Deploy Infrastructure" workflow
4. Click "Run workflow"
5. Choose action: "plan" or "apply"

**Option B: Trigger Frontend Deployment**
1. Make a small change to your frontend code
2. Commit and push to main branch
3. The deployment pipeline will automatically trigger

**Option C: Manual Workflow Trigger**
1. Go to Actions tab
2. Select "Deploy Frontend" workflow
3. Click "Run workflow"
4. Choose environment: "dev"

## 🔍 Pipeline Details

### Infrastructure Pipeline (`.github/workflows/infrastructure.yml`)

**Triggers:**
- Push to main (terraform files changed)
- Pull requests (terraform files changed)
- Manual workflow dispatch

**Jobs:**
- `terraform-plan`: Validates and plans changes
- `terraform-apply`: Applies infrastructure changes (main branch only)
- `terraform-destroy`: Destroys infrastructure (manual only, requires approval)

### Frontend Deployment Pipeline (`.github/workflows/deploy-frontend.yml`)

**Triggers:**
- Push to main (frontend files changed)
- Manual workflow dispatch

**Jobs:**
- `build-and-deploy`: Builds React app and deploys to S3/CloudFront
- `lighthouse-audit`: Runs performance audit

**Deployment Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Create environment file with backend URL
5. Run tests
6. Build React application
7. Deploy to S3 with optimized caching
8. Invalidate CloudFront cache
9. Run Lighthouse performance audit

## 🔧 Configuration Files

### Environment Variables (Auto-created during deployment)

The pipeline automatically creates `.env.production` with:
```env
REACT_APP_API_URL=http://43.205.211.216:5000
REACT_APP_ENVIRONMENT=dev
GENERATE_SOURCEMAP=false
```

### Caching Strategy

| File Type | Cache Duration | Purpose |
|-----------|----------------|---------|
| HTML files | No cache | Ensure latest version |
| Static assets (JS, CSS, images) | 1 year | Performance optimization |
| Service worker | No cache | Ensure updates |

## 🐛 Troubleshooting

### Common Issues

#### 1. GitHub Actions Permission Error
```
Error: Could not assume role with OIDC
```
**Solution:**
- Verify `github_repo` in `terraform.tfvars` matches your repository exactly
- Check that all GitHub secrets are configured correctly
- Ensure the repository is public or you have proper permissions

#### 2. S3 Bucket Already Exists
```
Error: BucketAlreadyExists
```
**Solution:**
- Change `bucket_name` in `terraform.tfvars` to a unique value
- Try adding a random suffix: `review-platform-frontend-dev-abc123`

#### 3. Build Failures
```
npm run build failed
```
**Solution:**
- Check that all dependencies are in `package.json`
- Verify there are no TypeScript errors locally
- Check the GitHub Actions logs for specific error details

#### 4. CloudFront Not Updating
**Solution:**
- Wait 5-15 minutes for cache invalidation
- Check CloudFront invalidation status in AWS Console
- Force refresh browser with Ctrl+F5

### Viewing Logs

1. **GitHub Actions Logs:**
   - Go to repository > Actions tab
   - Click on the failed workflow
   - Expand the failed job to see detailed logs

2. **AWS CloudWatch Logs:**
   - Check CloudFront access logs (if enabled)
   - Monitor S3 access patterns

## 🔄 Workflow Management

### Manual Deployments

**Deploy Infrastructure:**
```bash
cd scripts
./setup-infrastructure.sh
```

**Deploy Frontend:**
```bash
cd scripts
./deploy-frontend.sh --environment dev
```

### Updating Configuration

**Change Backend URL:**
1. Update `backend_api_url` in `terraform/terraform.tfvars`
2. Run `terraform apply`
3. Update `BACKEND_API_URL` secret in GitHub
4. Trigger frontend deployment

**Scale CloudFront:**
1. Update `cloudfront_price_class` in `terraform/terraform.tfvars`
2. Run `terraform apply`

### Rollback Procedures

**Application Rollback:**
```bash
git checkout <previous-commit>
git push --force-with-lease origin main
```

**Infrastructure Rollback:**
```bash
cd terraform
git checkout <previous-commit> -- .
terraform apply
```

## 🔐 Security Best Practices

### Implemented Security Measures
- ✅ GitHub Actions uses OIDC (no long-term AWS keys)
- ✅ IAM roles have minimal required permissions
- ✅ S3 bucket is private (CloudFront access only)
- ✅ HTTPS enforced for all traffic
- ✅ Secrets stored securely in GitHub

### Additional Recommendations
- [ ] Enable CloudTrail for audit logging
- [ ] Set up AWS Config for compliance monitoring
- [ ] Implement resource tagging strategy
- [ ] Regular security reviews and updates

## 📊 Monitoring and Alerts

### Built-in Monitoring
- ✅ GitHub Actions workflow status
- ✅ Lighthouse performance audits
- ✅ CloudFront access logs (optional)

### Recommended Additions
- [ ] AWS CloudWatch alarms
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Uptime monitoring (Pingdom)

## 🎯 Success Verification

### After Setup, Verify:

1. **Infrastructure Deployed:**
   ```bash
   cd terraform
   terraform output
   ```

2. **Website Accessible:**
   - Visit the CloudFront URL from Terraform output
   - Verify the site loads correctly

3. **Backend Integration:**
   - Open browser developer tools
   - Check Network tab for API calls to `http://43.205.211.216:5000`
   - Verify no CORS errors in console

4. **CI/CD Working:**
   - Make a small change to frontend
   - Push to main branch
   - Verify automatic deployment triggers

## 📞 Getting Help

### Resources
- **Terraform Documentation**: [terraform.io](https://terraform.io)
- **GitHub Actions Documentation**: [docs.github.com](https://docs.github.com/en/actions)
- **AWS S3 Documentation**: [aws.amazon.com/s3](https://aws.amazon.com/s3)
- **AWS CloudFront Documentation**: [aws.amazon.com/cloudfront](https://aws.amazon.com/cloudfront)

### Support Checklist
When seeking help, provide:
- [ ] GitHub Actions workflow logs
- [ ] Terraform error messages
- [ ] Browser console errors
- [ ] AWS CloudWatch logs (if applicable)

---

## 🎉 Next Steps After Setup

1. **Test Complete User Flow:**
   - User registration and login
   - Browse books and reviews
   - Add/remove favorites
   - Create reviews

2. **Performance Optimization:**
   - Review Lighthouse audit results
   - Optimize bundle size
   - Implement service worker caching

3. **Production Readiness:**
   - Set up custom domain (optional)
   - Configure SSL certificate
   - Implement error tracking
   - Set up monitoring and alerts

4. **Scaling Considerations:**
   - Multiple environments (staging, prod)
   - Blue-green deployments
   - A/B testing infrastructure

**🚀 Congratulations!** Your CI/CD pipeline is now set up for automated frontend deployment with AWS S3 and CloudFront.

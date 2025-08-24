# Frontend Deployment Guide

This guide provides comprehensive instructions for deploying the React frontend application to AWS using Terraform and GitHub Actions.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Infrastructure Components](#infrastructure-components)
- [Local Setup](#local-setup)
- [Infrastructure Deployment](#infrastructure-deployment)
- [GitHub Actions Setup](#github-actions-setup)
- [Deployment Pipeline](#deployment-pipeline)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)
- [Cost Optimization](#cost-optimization)

## 🎯 Overview

This deployment solution provides:

- **Static Site Hosting**: S3 + CloudFront for optimal performance
- **Infrastructure as Code**: Terraform for reproducible deployments
- **CI/CD Pipeline**: GitHub Actions for automated deployments
- **Security**: IAM roles with least privilege access
- **Performance**: CloudFront CDN with optimized caching
- **Monitoring**: Built-in AWS monitoring and Lighthouse audits

### Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │───▶│  GitHub Actions  │───▶│   AWS Cloud     │
│   (Git Push)    │    │   CI/CD Pipeline │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Build & Test    │    │  S3 Bucket      │
                       │  React App       │    │  (Static Files) │
                       └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  CloudFront     │
                                               │  (Global CDN)   │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   End Users     │
                                               │  (Global)       │
                                               └─────────────────┘
```

## 🛠 Prerequisites

### Required Tools

- **AWS Account**: With appropriate permissions
- **GitHub Repository**: For your React application
- **Local Development Environment**: macOS, Linux, or Windows

### Required Permissions

Your AWS user/role needs the following permissions:
- S3: Full access for bucket management
- CloudFront: Full access for distribution management
- IAM: Role and policy management
- DynamoDB: Table management (for Terraform state locking)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone your repository
git clone https://github.com/yourusername/fe_review_platform.git
cd fe_review_platform

# Run the setup script
./scripts/setup-local-env.sh
```

### 2. Configure AWS

```bash
# Configure AWS credentials
aws configure
```

### 3. Update Configuration

```bash
# Copy and edit Terraform variables
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Edit terraform.tfvars with your repository information
```

### 4. Deploy Infrastructure

```bash
# Validate configuration
./scripts/validate-infrastructure.sh

# Deploy infrastructure
./scripts/deploy-infrastructure.sh
```

### 5. Setup GitHub Actions

The deployment script will provide GitHub Actions secrets. Set them in your repository:

```bash
# Using GitHub CLI (recommended)
gh secret set AWS_ROLE_ARN --body "arn:aws:iam::ACCOUNT:role/ROLE_NAME"
gh secret set S3_BUCKET_NAME --body "your-bucket-name"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "your-distribution-id"
```

## 🏗 Infrastructure Components

### S3 Bucket
- **Purpose**: Static website hosting
- **Features**: Versioning, encryption, access controls
- **Configuration**: Optimized for React SPA routing

### CloudFront Distribution
- **Purpose**: Global content delivery network
- **Features**: HTTPS redirect, compression, caching
- **Configuration**: Optimized cache behaviors for static assets

### IAM Roles
- **GitHub Actions Role**: Secure deployment access
- **Permissions**: Minimal required permissions for deployment

### Backend Resources
- **S3 State Bucket**: Terraform state storage
- **DynamoDB Table**: State locking for team collaboration

## 💻 Local Setup

### Automated Setup

Run the setup script to install all required tools:

```bash
./scripts/setup-local-env.sh
```

### Manual Setup

If you prefer manual installation:

#### Install Terraform

**macOS:**
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

**Linux:**
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

#### Install AWS CLI

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### Install GitHub CLI

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh
```

## 🚀 Infrastructure Deployment

### Configuration

1. **Update terraform.tfvars:**

```hcl
# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "fe-review-platform"
environment  = "dev"

# GitHub Repository (REQUIRED)
github_repository = "yourusername/fe_review_platform"

# CloudFront Configuration
cloudfront_price_class = "PriceClass_100"
cache_default_ttl      = 3600
cache_max_ttl          = 86400

# Additional Tags
tags = {
  Owner       = "DevOps Team"
  CostCenter  = "Engineering"
  Application = "Review Platform"
}
```

### Validation

Before deployment, validate your configuration:

```bash
./scripts/validate-infrastructure.sh
```

This script checks:
- ✅ Required tools installation
- ✅ AWS credentials configuration
- ✅ Terraform syntax and validation
- ✅ Node.js project build process
- ✅ GitHub repository configuration

### Deployment

Deploy the infrastructure:

```bash
./scripts/deploy-infrastructure.sh
```

The script will:
1. Create Terraform backend resources (S3 bucket, DynamoDB table)
2. Initialize Terraform
3. Create and review deployment plan
4. Deploy infrastructure after confirmation
5. Output deployment information
6. Optionally set GitHub Actions secrets

### Deployment Output

After successful deployment, you'll receive:

```
=== DEPLOYMENT SUMMARY ===
✅ Infrastructure deployed successfully
✅ S3 Bucket: fe-review-platform-dev-abc12345
✅ CloudFront Distribution ID: E1234567890ABC
✅ Website URL: https://d1234567890abc.cloudfront.net
✅ GitHub Actions Role ARN: arn:aws:iam::123456789012:role/fe-review-platform-dev-github-actions-role
```

## 🔧 GitHub Actions Setup

### Required Secrets

Set these secrets in your GitHub repository:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ROLE_ARN` | IAM role for GitHub Actions | `arn:aws:iam::123456789012:role/fe-review-platform-dev-github-actions-role` |
| `S3_BUCKET_NAME` | S3 bucket for static files | `fe-review-platform-dev-abc12345` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E1234567890ABC` |

### Setting Secrets

**Using GitHub CLI:**
```bash
gh secret set AWS_ROLE_ARN --body "your-role-arn"
gh secret set S3_BUCKET_NAME --body "your-bucket-name"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "your-distribution-id"
```

**Using GitHub Web Interface:**
1. Go to your repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

## 🔄 Deployment Pipeline

### Infrastructure Pipeline

**Trigger:** Changes to `terraform/` directory or infrastructure workflow

**Workflow:** `.github/workflows/infrastructure.yml`

**Jobs:**
1. **Validate**: Terraform format, syntax, and validation checks
2. **Plan**: Create deployment plan for pull requests
3. **Apply**: Deploy infrastructure on main branch
4. **Destroy**: Manual destruction via workflow dispatch

### Application Deployment Pipeline

**Trigger:** Changes to application code (excluding infrastructure)

**Workflow:** `.github/workflows/deploy.yml`

**Jobs:**
1. **Build and Test**: Install dependencies, run tests, build application
2. **Deploy**: Upload to S3, invalidate CloudFront cache
3. **Lighthouse Audit**: Performance and quality checks
4. **Notify**: Deployment status notifications

### Pipeline Features

- ✅ **Automated Testing**: Unit tests run before deployment
- ✅ **Build Optimization**: Production-optimized React build
- ✅ **Cache Management**: Intelligent cache invalidation
- ✅ **Performance Monitoring**: Lighthouse audits
- ✅ **Deployment Notifications**: Success/failure notifications
- ✅ **Rollback Support**: Easy rollback via Git revert

## 📊 Monitoring and Maintenance

### AWS CloudWatch

Monitor your deployment through AWS CloudWatch:

- **S3 Metrics**: Storage usage, request metrics
- **CloudFront Metrics**: Cache hit ratio, origin requests
- **Cost Monitoring**: Daily/monthly cost tracking

### Lighthouse Audits

Automated performance audits run after each deployment:

- **Performance**: Load times, Core Web Vitals
- **Accessibility**: WCAG compliance
- **Best Practices**: Security, modern standards
- **SEO**: Search engine optimization

### Regular Maintenance

**Weekly:**
- Review CloudWatch metrics
- Check deployment pipeline health
- Monitor costs

**Monthly:**
- Update dependencies (`npm audit`)
- Review and rotate AWS credentials
- Optimize CloudFront cache settings

**Quarterly:**
- Update Terraform providers
- Review IAM permissions
- Conduct security audit

## 🔧 Troubleshooting

### Common Issues

#### 1. Terraform Backend Issues

**Problem:** "Backend configuration changed"

**Solution:**
```bash
cd terraform
terraform init -reconfigure
```

#### 2. S3 Bucket Already Exists

**Problem:** "BucketAlreadyExists" error

**Solution:** The random suffix should prevent this, but if it occurs:
```bash
# Update terraform.tfvars with a different project_name
project_name = "fe-review-platform-v2"
```

#### 3. GitHub Actions Permission Denied

**Problem:** "Access Denied" in GitHub Actions

**Solution:**
1. Verify AWS_ROLE_ARN secret is correct
2. Check IAM role trust policy includes your repository
3. Ensure role has required permissions

#### 4. CloudFront Deployment Slow

**Problem:** CloudFront distribution takes 15-20 minutes to deploy

**Solution:** This is normal AWS behavior. CloudFront distributions take time to propagate globally.

#### 5. Build Failures

**Problem:** React build fails in GitHub Actions

**Solution:**
```bash
# Test build locally
npm run build

# Check for environment-specific issues
# Ensure all environment variables are set
```

### Debug Commands

**Check AWS credentials:**
```bash
aws sts get-caller-identity
```

**Validate Terraform:**
```bash
cd terraform
terraform validate
terraform plan
```

**Test React build:**
```bash
npm run build
npm test
```

**Check GitHub Actions logs:**
```bash
gh run list
gh run view [run-id]
```

## 💰 Cost Optimization

### Current Costs (Estimated)

**Development Environment:**
- S3 Storage: ~$0.50/month (for typical React app)
- CloudFront: ~$1.00/month (first 1TB free)
- DynamoDB: ~$0.25/month (minimal usage)
- **Total: ~$1.75/month**

### Optimization Strategies

1. **CloudFront Price Class**: Use `PriceClass_100` for cost savings
2. **S3 Lifecycle Policies**: Archive old versions
3. **Monitoring**: Set up billing alerts
4. **Resource Cleanup**: Use cleanup script when not needed

### Cleanup Resources

When you no longer need the infrastructure:

```bash
./scripts/cleanup-infrastructure.sh
```

**Warning:** This will permanently delete all resources and data.

## 📚 Additional Resources

### Documentation Links

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

### Best Practices

- **Security**: Regularly rotate AWS credentials
- **Monitoring**: Set up CloudWatch alarms
- **Backup**: Terraform state is backed up in S3
- **Documentation**: Keep this guide updated with changes

### Support

For issues or questions:
1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Check GitHub Actions workflow logs
4. Consult AWS documentation

---

**Last Updated:** $(date)
**Version:** 1.0.0

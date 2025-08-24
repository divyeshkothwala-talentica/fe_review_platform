#!/bin/bash

# Infrastructure Deployment Script
# This script deploys the infrastructure using Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

print_status "Starting infrastructure deployment..."

# Check if validation script exists and run it
if [[ -f "scripts/validate-infrastructure.sh" ]]; then
    print_status "Running validation checks..."
    bash scripts/validate-infrastructure.sh
else
    print_warning "Validation script not found. Proceeding without validation."
fi

# Check required tools
if ! command_exists terraform; then
    print_error "Terraform is not installed. Please run './scripts/setup-local-env.sh'"
    exit 1
fi

if ! command_exists aws; then
    print_error "AWS CLI is not installed. Please run './scripts/setup-local-env.sh'"
    exit 1
fi

# Check AWS credentials
print_status "Checking AWS credentials..."
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    print_error "AWS credentials are not configured. Please run 'aws configure'"
    exit 1
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo "us-east-1")
print_status "Deploying to AWS Account: $AWS_ACCOUNT in region: $AWS_REGION"

cd terraform

# Check terraform.tfvars
if [[ ! -f "terraform.tfvars" ]]; then
    print_error "terraform.tfvars not found. Please create it from terraform.tfvars.example"
    exit 1
fi

# Extract project name and environment from tfvars
PROJECT_NAME=$(grep 'project_name' terraform.tfvars | cut -d'"' -f2 2>/dev/null || echo "fe-review-platform")
ENVIRONMENT=$(grep 'environment' terraform.tfvars | cut -d'"' -f2 2>/dev/null || echo "dev")

print_status "Project: $PROJECT_NAME"
print_status "Environment: $ENVIRONMENT"

# Create backend resources if they don't exist
print_status "Setting up Terraform backend..."

STATE_BUCKET="${PROJECT_NAME}-terraform-state"
LOCK_TABLE="${PROJECT_NAME}-terraform-locks"

# Create S3 bucket for state
print_status "Creating S3 bucket for Terraform state..."
if aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
    print_success "S3 bucket $STATE_BUCKET already exists"
else
    if aws s3api create-bucket --bucket "$STATE_BUCKET" --region "$AWS_REGION" 2>/dev/null; then
        print_success "Created S3 bucket: $STATE_BUCKET"
        
        # Enable versioning
        aws s3api put-bucket-versioning --bucket "$STATE_BUCKET" \
            --versioning-configuration Status=Enabled
        print_success "Enabled versioning on S3 bucket"
        
        # Enable server-side encryption
        aws s3api put-bucket-encryption --bucket "$STATE_BUCKET" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'
        print_success "Enabled encryption on S3 bucket"
    else
        print_error "Failed to create S3 bucket: $STATE_BUCKET"
        exit 1
    fi
fi

# Create DynamoDB table for locking
print_status "Creating DynamoDB table for state locking..."
if aws dynamodb describe-table --table-name "$LOCK_TABLE" >/dev/null 2>&1; then
    print_success "DynamoDB table $LOCK_TABLE already exists"
else
    if aws dynamodb create-table \
        --table-name "$LOCK_TABLE" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 >/dev/null 2>&1; then
        print_success "Created DynamoDB table: $LOCK_TABLE"
        
        # Wait for table to be active
        print_status "Waiting for DynamoDB table to be active..."
        aws dynamodb wait table-exists --table-name "$LOCK_TABLE"
        print_success "DynamoDB table is active"
    else
        print_error "Failed to create DynamoDB table: $LOCK_TABLE"
        exit 1
    fi
fi

# Initialize Terraform
print_status "Initializing Terraform..."
if terraform init; then
    print_success "Terraform initialized successfully"
else
    print_error "Terraform initialization failed"
    exit 1
fi

# Plan deployment
print_status "Creating Terraform plan..."
if terraform plan -out=tfplan; then
    print_success "Terraform plan created successfully"
else
    print_error "Terraform planning failed"
    exit 1
fi

# Confirm deployment
echo ""
print_warning "This will deploy infrastructure to AWS Account: $AWS_ACCOUNT"
print_warning "Project: $PROJECT_NAME, Environment: $ENVIRONMENT"
echo ""

if ! confirm "Do you want to proceed with the deployment?"; then
    print_status "Deployment cancelled by user"
    exit 0
fi

# Apply Terraform
print_status "Applying Terraform configuration..."
if terraform apply tfplan; then
    print_success "Infrastructure deployed successfully!"
else
    print_error "Terraform apply failed"
    exit 1
fi

# Get outputs
print_status "Retrieving deployment information..."
S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null || echo "")
GITHUB_ROLE_ARN=$(terraform output -raw github_actions_role_arn 2>/dev/null || echo "")

cd ..

# Display deployment summary
echo ""
print_success "=== DEPLOYMENT SUMMARY ==="
echo "✅ Infrastructure deployed successfully"
echo "✅ S3 Bucket: $S3_BUCKET"
echo "✅ CloudFront Distribution ID: $DISTRIBUTION_ID"
echo "✅ Website URL: $WEBSITE_URL"
echo "✅ GitHub Actions Role ARN: $GITHUB_ROLE_ARN"
echo ""

# Save deployment info to file
cat > deployment-info.json << EOF
{
  "s3_bucket": "$S3_BUCKET",
  "cloudfront_distribution_id": "$DISTRIBUTION_ID",
  "website_url": "$WEBSITE_URL",
  "github_actions_role_arn": "$GITHUB_ROLE_ARN",
  "aws_account": "$AWS_ACCOUNT",
  "aws_region": "$AWS_REGION",
  "project_name": "$PROJECT_NAME",
  "environment": "$ENVIRONMENT",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

print_success "Deployment information saved to deployment-info.json"

# GitHub Actions setup instructions
echo ""
print_status "=== NEXT STEPS ==="
echo "1. Set up GitHub Actions secrets:"
echo "   - AWS_ROLE_ARN: $GITHUB_ROLE_ARN"
echo "   - S3_BUCKET_NAME: $S3_BUCKET"
echo "   - CLOUDFRONT_DISTRIBUTION_ID: $DISTRIBUTION_ID"
echo ""
echo "2. You can set these secrets using GitHub CLI:"
echo "   gh secret set AWS_ROLE_ARN --body \"$GITHUB_ROLE_ARN\""
echo "   gh secret set S3_BUCKET_NAME --body \"$S3_BUCKET\""
echo "   gh secret set CLOUDFRONT_DISTRIBUTION_ID --body \"$DISTRIBUTION_ID\""
echo ""
echo "3. Push your code to trigger the deployment pipeline"
echo "4. Your website will be available at: $WEBSITE_URL"

# Offer to set GitHub secrets automatically
if command_exists gh; then
    echo ""
    if confirm "Do you want to set GitHub Actions secrets automatically?"; then
        print_status "Setting GitHub Actions secrets..."
        
        if gh secret set AWS_ROLE_ARN --body "$GITHUB_ROLE_ARN" && \
           gh secret set S3_BUCKET_NAME --body "$S3_BUCKET" && \
           gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "$DISTRIBUTION_ID"; then
            print_success "GitHub Actions secrets set successfully!"
        else
            print_warning "Failed to set some GitHub Actions secrets. Please set them manually."
        fi
    fi
fi

print_success "Infrastructure deployment completed!"

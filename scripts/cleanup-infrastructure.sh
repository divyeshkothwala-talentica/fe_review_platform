#!/bin/bash

# Infrastructure Cleanup Script
# This script destroys the infrastructure created by Terraform

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

print_warning "=== INFRASTRUCTURE CLEANUP ==="
print_warning "This script will DESTROY all infrastructure resources!"
print_warning "This action is IRREVERSIBLE!"

# Check required tools
if ! command_exists terraform; then
    print_error "Terraform is not installed"
    exit 1
fi

if ! command_exists aws; then
    print_error "AWS CLI is not installed"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    print_error "AWS credentials are not configured"
    exit 1
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
print_warning "This will destroy resources in AWS Account: $AWS_ACCOUNT"

cd terraform

# Check if Terraform state exists
if [[ ! -f ".terraform/terraform.tfstate" ]] && [[ ! -f "terraform.tfstate" ]]; then
    print_error "No Terraform state found. Nothing to destroy."
    exit 1
fi

# Get current resources
print_status "Checking current infrastructure..."
if terraform show >/dev/null 2>&1; then
    print_status "Current infrastructure found"
else
    print_error "Unable to read Terraform state"
    exit 1
fi

# Show what will be destroyed
print_status "Planning destruction..."
terraform plan -destroy

echo ""
print_warning "The following resources will be PERMANENTLY DELETED:"
echo "- S3 bucket and all its contents"
echo "- CloudFront distribution"
echo "- IAM roles and policies"
echo "- All associated data"
echo ""

if ! confirm "Are you absolutely sure you want to destroy all infrastructure?"; then
    print_status "Destruction cancelled by user"
    exit 0
fi

print_warning "Last chance to cancel!"
if ! confirm "Type 'yes' to confirm destruction"; then
    print_status "Destruction cancelled by user"
    exit 0
fi

# Empty S3 bucket first (required before destruction)
print_status "Emptying S3 bucket..."
S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")
if [[ -n "$S3_BUCKET" ]]; then
    print_status "Emptying S3 bucket: $S3_BUCKET"
    aws s3 rm s3://"$S3_BUCKET" --recursive 2>/dev/null || true
    print_success "S3 bucket emptied"
fi

# Destroy infrastructure
print_status "Destroying infrastructure..."
if terraform destroy -auto-approve; then
    print_success "Infrastructure destroyed successfully"
else
    print_error "Infrastructure destruction failed"
    print_warning "Some resources may still exist. Please check AWS console."
    exit 1
fi

cd ..

# Clean up local files
print_status "Cleaning up local files..."
if [[ -f "deployment-info.json" ]]; then
    rm deployment-info.json
    print_success "Removed deployment-info.json"
fi

# Optionally clean up Terraform backend resources
echo ""
print_warning "Terraform backend resources (S3 bucket and DynamoDB table) still exist."
print_warning "These contain the Terraform state and should be kept for recovery."

if confirm "Do you want to delete the Terraform backend resources as well? (This will make recovery impossible)"; then
    PROJECT_NAME=$(grep 'project_name' terraform/terraform.tfvars | cut -d'"' -f2 2>/dev/null || echo "fe-review-platform")
    STATE_BUCKET="${PROJECT_NAME}-terraform-state"
    LOCK_TABLE="${PROJECT_NAME}-terraform-locks"
    
    print_status "Deleting Terraform backend resources..."
    
    # Empty and delete S3 bucket
    if aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
        print_status "Emptying and deleting S3 bucket: $STATE_BUCKET"
        aws s3 rm s3://"$STATE_BUCKET" --recursive 2>/dev/null || true
        aws s3api delete-bucket --bucket "$STATE_BUCKET" 2>/dev/null || true
        print_success "Deleted S3 bucket: $STATE_BUCKET"
    fi
    
    # Delete DynamoDB table
    if aws dynamodb describe-table --table-name "$LOCK_TABLE" >/dev/null 2>&1; then
        print_status "Deleting DynamoDB table: $LOCK_TABLE"
        aws dynamodb delete-table --table-name "$LOCK_TABLE" >/dev/null 2>&1 || true
        print_success "Deleted DynamoDB table: $LOCK_TABLE"
    fi
fi

print_success "=== CLEANUP COMPLETED ==="
print_success "All infrastructure has been destroyed"
print_status "You may want to:"
echo "1. Remove GitHub Actions secrets if they're no longer needed"
echo "2. Clean up any local configuration files"
echo "3. Remove the terraform/ directory if starting fresh"

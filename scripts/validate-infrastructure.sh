#!/bin/bash

# Infrastructure Validation Script
# This script validates the Terraform configuration and AWS setup

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

print_status "Starting infrastructure validation..."

# Check required tools
print_status "Checking required tools..."

MISSING_TOOLS=()

if ! command_exists terraform; then
    MISSING_TOOLS+=("terraform")
fi

if ! command_exists aws; then
    MISSING_TOOLS+=("aws")
fi

if ! command_exists node; then
    MISSING_TOOLS+=("node")
fi

if ! command_exists npm; then
    MISSING_TOOLS+=("npm")
fi

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    print_error "Missing required tools: ${MISSING_TOOLS[*]}"
    print_status "Please run './scripts/setup-local-env.sh' to install missing tools"
    exit 1
fi

print_success "All required tools are installed"

# Check AWS credentials
print_status "Checking AWS credentials..."
if aws sts get-caller-identity >/dev/null 2>&1; then
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
    print_success "AWS credentials are configured"
    print_status "Account: $AWS_ACCOUNT"
    print_status "User/Role: $AWS_USER"
else
    print_error "AWS credentials are not configured"
    print_status "Please run 'aws configure' to set up your credentials"
    exit 1
fi

# Check Terraform configuration
print_status "Validating Terraform configuration..."

if [[ ! -d "terraform" ]]; then
    print_error "Terraform directory not found"
    exit 1
fi

cd terraform

# Check if terraform.tfvars exists
if [[ ! -f "terraform.tfvars" ]]; then
    print_warning "terraform.tfvars not found"
    if [[ -f "terraform.tfvars.example" ]]; then
        print_status "Creating terraform.tfvars from example..."
        cp terraform.tfvars.example terraform.tfvars
        print_warning "Please update terraform.tfvars with your actual values"
    else
        print_error "terraform.tfvars.example not found"
        exit 1
    fi
fi

# Validate Terraform syntax
print_status "Checking Terraform syntax..."
if terraform fmt -check -recursive .; then
    print_success "Terraform formatting is correct"
else
    print_warning "Terraform files need formatting. Run 'terraform fmt -recursive .'"
fi

# Initialize Terraform (without backend)
print_status "Initializing Terraform..."
if terraform init -backend=false >/dev/null 2>&1; then
    print_success "Terraform initialization successful"
else
    print_error "Terraform initialization failed"
    exit 1
fi

# Validate Terraform configuration
print_status "Validating Terraform configuration..."
if terraform validate >/dev/null 2>&1; then
    print_success "Terraform configuration is valid"
else
    print_error "Terraform configuration validation failed"
    terraform validate
    exit 1
fi

cd ..

# Check Node.js project
print_status "Validating Node.js project..."

if [[ ! -f "package.json" ]]; then
    print_error "package.json not found"
    exit 1
fi

# Check if node_modules exists
if [[ ! -d "node_modules" ]]; then
    print_status "Installing Node.js dependencies..."
    npm install
fi

# Run tests
print_status "Running tests..."
if npm test -- --watchAll=false >/dev/null 2>&1; then
    print_success "All tests passed"
else
    print_warning "Some tests failed. Please check your code."
fi

# Test build
print_status "Testing build process..."
if npm run build >/dev/null 2>&1; then
    print_success "Build process completed successfully"
    BUILD_SIZE=$(du -sh build 2>/dev/null | cut -f1 || echo "unknown")
    print_status "Build size: $BUILD_SIZE"
else
    print_error "Build process failed"
    exit 1
fi

# Check GitHub repository configuration
print_status "Checking GitHub repository configuration..."
if command_exists gh; then
    if gh auth status >/dev/null 2>&1; then
        REPO_INFO=$(gh repo view --json name,owner 2>/dev/null || echo "")
        if [[ -n "$REPO_INFO" ]]; then
            REPO_NAME=$(echo "$REPO_INFO" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
            REPO_OWNER=$(echo "$REPO_INFO" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
            print_success "GitHub repository: $REPO_OWNER/$REPO_NAME"
            
            # Check if the repository in terraform.tfvars matches
            TFVARS_REPO=$(grep 'github_repository' terraform/terraform.tfvars | cut -d'"' -f2 2>/dev/null || echo "")
            if [[ "$TFVARS_REPO" == "$REPO_OWNER/$REPO_NAME" ]]; then
                print_success "Repository configuration matches"
            else
                print_warning "Repository in terraform.tfvars ($TFVARS_REPO) doesn't match current repo ($REPO_OWNER/$REPO_NAME)"
            fi
        else
            print_warning "Could not determine GitHub repository information"
        fi
    else
        print_warning "GitHub CLI is not authenticated. Run 'gh auth login'"
    fi
else
    print_warning "GitHub CLI not found. Install it for better repository validation"
fi

print_success "Infrastructure validation completed successfully!"
print_status "Your environment is ready for deployment."
print_status ""
print_status "Next steps:"
echo "1. Review and update terraform/terraform.tfvars if needed"
echo "2. Run './scripts/deploy-infrastructure.sh' to deploy infrastructure"
echo "3. Set up GitHub Actions secrets after infrastructure deployment"

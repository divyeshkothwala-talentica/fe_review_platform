#!/bin/bash

# Quick CI/CD Setup Script for Frontend Deployment
# This script helps you quickly set up the CI/CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                Frontend CI/CD Quick Setup                    ║"
    echo "║              Review Platform Deployment                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log_error "This script must be run from the frontend project root directory"
        exit 1
    fi
    
    # Check required tools
    local required_tools=("git" "aws" "terraform" "node" "npm")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "$tool is not installed. Please install it first."
            exit 1
        fi
    done
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # Check if git repository is initialized
    if ! git rev-parse --git-dir &> /dev/null; then
        log_error "This is not a git repository. Please initialize git first."
        exit 1
    fi
    
    log_success "All prerequisites met"
}

get_user_input() {
    log_info "Gathering configuration information..."
    
    # Get GitHub repository info
    local git_remote=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ "$git_remote" =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
        local suggested_repo="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
        suggested_repo=${suggested_repo%.git}
    else
        local suggested_repo=""
    fi
    
    echo
    log_info "Please provide the following information:"
    
    # GitHub repository
    if [[ -n "$suggested_repo" ]]; then
        read -p "GitHub repository [$suggested_repo]: " github_repo
        github_repo=${github_repo:-$suggested_repo}
    else
        read -p "GitHub repository (owner/repo-name): " github_repo
    fi
    
    # Validate GitHub repo format
    if [[ ! "$github_repo" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
        log_error "Invalid GitHub repository format. Use: owner/repo-name"
        exit 1
    fi
    
    # S3 bucket name
    local suggested_bucket="review-platform-frontend-dev-$(date +%s)"
    read -p "S3 bucket name [$suggested_bucket]: " bucket_name
    bucket_name=${bucket_name:-$suggested_bucket}
    
    # Environment
    read -p "Environment [dev]: " environment
    environment=${environment:-dev}
    
    # AWS region
    read -p "AWS region [us-east-1]: " aws_region
    aws_region=${aws_region:-us-east-1}
    
    # Backend API URL
    read -p "Backend API URL [http://43.205.211.216:5000]: " backend_url
    backend_url=${backend_url:-http://43.205.211.216:5000}
    
    echo
    log_info "Configuration Summary:"
    echo "  GitHub Repository: $github_repo"
    echo "  S3 Bucket Name: $bucket_name"
    echo "  Environment: $environment"
    echo "  AWS Region: $aws_region"
    echo "  Backend API URL: $backend_url"
    echo
    
    read -p "Is this correct? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_info "Setup cancelled by user"
        exit 0
    fi
}

create_terraform_config() {
    log_info "Creating Terraform configuration..."
    
    cat > terraform/terraform.tfvars << EOF
# AWS Configuration
aws_region = "$aws_region"
environment = "$environment"

# Project Configuration
project_name = "review-platform-frontend"
bucket_name = "$bucket_name"

# CloudFront Configuration
cloudfront_price_class = "PriceClass_100"

# GitHub Configuration
github_repo = "$github_repo"

# Backend Configuration
backend_api_url = "$backend_url"
EOF
    
    log_success "Terraform configuration created"
}

deploy_infrastructure() {
    log_info "Deploying AWS infrastructure..."
    
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    # Create plan
    terraform plan -out=tfplan
    
    echo
    log_warning "Review the Terraform plan above."
    read -p "Do you want to apply these changes? (y/N): " apply_confirm
    
    if [[ "$apply_confirm" == "y" || "$apply_confirm" == "Y" ]]; then
        # Apply the plan
        terraform apply tfplan
        
        if [[ $? -eq 0 ]]; then
            log_success "Infrastructure deployed successfully!"
            
            # Get outputs for GitHub secrets
            echo
            log_info "GitHub Secrets Configuration:"
            echo "Add these secrets to your GitHub repository at:"
            echo "https://github.com/$github_repo/settings/secrets/actions"
            echo
            echo "AWS_ROLE_ARN=$(terraform output -raw github_actions_role_arn)"
            echo "S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)"
            echo "CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)"
            echo "CLOUDFRONT_DOMAIN_NAME=$(terraform output -raw cloudfront_domain_name)"
            echo "BACKEND_API_URL=$backend_url"
            echo "ENVIRONMENT=$environment"
            
            # Save outputs to file for reference
            cat > ../github-secrets.txt << EOF
# GitHub Repository Secrets
# Add these at: https://github.com/$github_repo/settings/secrets/actions

AWS_ROLE_ARN=$(terraform output -raw github_actions_role_arn)
S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
CLOUDFRONT_DOMAIN_NAME=$(terraform output -raw cloudfront_domain_name)
BACKEND_API_URL=$backend_url
ENVIRONMENT=$environment
EOF
            
            log_success "GitHub secrets saved to github-secrets.txt"
        else
            log_error "Infrastructure deployment failed"
            exit 1
        fi
    else
        log_info "Infrastructure deployment skipped"
        exit 0
    fi
    
    cd ..
}

commit_and_push() {
    log_info "Committing and pushing changes..."
    
    # Add all new files
    git add .github/ terraform/ scripts/ CICD_SETUP_GUIDE.md github-secrets.txt
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        log_warning "No changes to commit"
        return
    fi
    
    # Commit changes
    git commit -m "Add CI/CD infrastructure and deployment workflows

- Add GitHub Actions workflows for infrastructure and frontend deployment
- Add Terraform configuration for S3 and CloudFront
- Add deployment scripts and documentation
- Configure backend integration with $backend_url"
    
    # Push to GitHub
    log_info "Pushing to GitHub..."
    git push origin main
    
    if [[ $? -eq 0 ]]; then
        log_success "Changes pushed to GitHub successfully!"
    else
        log_error "Failed to push to GitHub"
        exit 1
    fi
}

show_next_steps() {
    log_success "Setup completed successfully!"
    echo
    log_info "Next Steps:"
    echo "1. 🔐 Configure GitHub Secrets:"
    echo "   - Go to: https://github.com/$github_repo/settings/secrets/actions"
    echo "   - Add the secrets from github-secrets.txt"
    echo
    echo "2. 🚀 Test Deployment:"
    echo "   - Go to: https://github.com/$github_repo/actions"
    echo "   - Run 'Deploy Frontend' workflow manually"
    echo "   - Or make a change and push to trigger automatic deployment"
    echo
    echo "3. 🌐 Access Your Application:"
    echo "   - Website will be available at the CloudFront URL"
    echo "   - Check terraform output for the exact URL"
    echo
    echo "4. 📖 Read Documentation:"
    echo "   - See CICD_SETUP_GUIDE.md for detailed instructions"
    echo "   - Check github-secrets.txt for secret values"
    echo
    log_info "Happy deploying! 🎉"
}

main() {
    show_banner
    check_prerequisites
    get_user_input
    create_terraform_config
    deploy_infrastructure
    commit_and_push
    show_next_steps
}

# Run main function
main "$@"

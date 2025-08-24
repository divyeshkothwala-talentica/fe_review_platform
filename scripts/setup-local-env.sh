#!/bin/bash

# Local Environment Setup Script for Frontend Deployment
# This script sets up the local development environment for infrastructure management

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

# Function to get OS type
get_os() {
    case "$(uname -s)" in
        Darwin*) echo "mac" ;;
        Linux*)  echo "linux" ;;
        CYGWIN*) echo "windows" ;;
        MINGW*)  echo "windows" ;;
        *) echo "unknown" ;;
    esac
}

print_status "Starting local environment setup..."

OS=$(get_os)
print_status "Detected OS: $OS"

# Check and install Homebrew (macOS) or package manager
if [[ "$OS" == "mac" ]]; then
    if ! command_exists brew; then
        print_status "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        print_success "Homebrew installed successfully"
    else
        print_success "Homebrew is already installed"
    fi
fi

# Install Terraform
print_status "Checking Terraform installation..."
if ! command_exists terraform; then
    print_status "Installing Terraform..."
    if [[ "$OS" == "mac" ]]; then
        brew tap hashicorp/tap
        brew install hashicorp/tap/terraform
    elif [[ "$OS" == "linux" ]]; then
        wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt update && sudo apt install terraform
    fi
    print_success "Terraform installed successfully"
else
    TERRAFORM_VERSION=$(terraform version | head -n1 | cut -d' ' -f2)
    print_success "Terraform is already installed (version: $TERRAFORM_VERSION)"
fi

# Install AWS CLI
print_status "Checking AWS CLI installation..."
if ! command_exists aws; then
    print_status "Installing AWS CLI..."
    if [[ "$OS" == "mac" ]]; then
        brew install awscli
    elif [[ "$OS" == "linux" ]]; then
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    print_success "AWS CLI installed successfully"
else
    AWS_VERSION=$(aws --version | cut -d' ' -f1 | cut -d'/' -f2)
    print_success "AWS CLI is already installed (version: $AWS_VERSION)"
fi

# Install GitHub CLI
print_status "Checking GitHub CLI installation..."
if ! command_exists gh; then
    print_status "Installing GitHub CLI..."
    if [[ "$OS" == "mac" ]]; then
        brew install gh
    elif [[ "$OS" == "linux" ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update && sudo apt install gh
    fi
    print_success "GitHub CLI installed successfully"
else
    GH_VERSION=$(gh --version | head -n1 | cut -d' ' -f3)
    print_success "GitHub CLI is already installed (version: $GH_VERSION)"
fi

# Install Node.js and npm (if not already installed)
print_status "Checking Node.js installation..."
if ! command_exists node; then
    print_status "Installing Node.js..."
    if [[ "$OS" == "mac" ]]; then
        brew install node@18
    elif [[ "$OS" == "linux" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    print_success "Node.js installed successfully"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is already installed (version: $NODE_VERSION)"
fi

# Create terraform.tfvars from example
print_status "Setting up Terraform configuration..."
if [[ ! -f "terraform/terraform.tfvars" ]]; then
    if [[ -f "terraform/terraform.tfvars.example" ]]; then
        cp terraform/terraform.tfvars.example terraform/terraform.tfvars
        print_warning "Created terraform.tfvars from example. Please update the values before running Terraform."
        print_warning "Especially update the 'github_repository' variable with your repository name."
    else
        print_error "terraform.tfvars.example not found!"
    fi
else
    print_success "terraform.tfvars already exists"
fi

# Create .env file for local development
print_status "Setting up environment variables..."
if [[ ! -f ".env.local" ]]; then
    cat > .env.local << EOF
# Local environment variables for development
# Copy this file to .env and update the values

# AWS Configuration
AWS_REGION=us-east-1
AWS_PROFILE=default

# Project Configuration
PROJECT_NAME=fe-review-platform
ENVIRONMENT=dev

# GitHub Configuration
GITHUB_REPOSITORY=yourusername/fe_review_platform

# Development URLs (will be updated after infrastructure deployment)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
EOF
    print_warning "Created .env.local file. Please update the values as needed."
else
    print_success ".env.local already exists"
fi

print_success "Local environment setup completed!"
print_status "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Update terraform/terraform.tfvars with your repository information"
echo "3. Update .env.local with your configuration"
echo "4. Run './scripts/validate-infrastructure.sh' to validate your setup"
echo "5. Run './scripts/deploy-infrastructure.sh' to deploy infrastructure"

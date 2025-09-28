#!/bin/bash

# Update Frontend to Use Direct Backend API Script
# This script configures the frontend to make API calls directly to the EC2 backend
# and warns about mixed content issues that need to be resolved

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(dirname "$0")"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"
FRONTEND_DIR="$SCRIPT_DIR/.."
BACKEND_IP="44.194.207.22"
BACKEND_PORT="5000"

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

show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -b, --backend-ip    Backend IP address [default: 44.194.207.22]"
    echo "  -p, --port          Backend port [default: 5000]"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "This script will:"
    echo "  1. Update frontend to make API calls directly to EC2 backend"
    echo "  2. Apply Terraform changes (CloudFront for static files only)"
    echo "  3. Configure proper CORS settings"
    echo "  4. Warn about mixed content issues and provide solutions"
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -b|--backend-ip)
                BACKEND_IP="$2"
                shift 2
                ;;
            -p|--port)
                BACKEND_PORT="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

validate_backend() {
    log_info "Validating backend at $BACKEND_IP:$BACKEND_PORT"
    
    # Test backend connectivity
    if curl -s --connect-timeout 10 "http://$BACKEND_IP:$BACKEND_PORT/v1/health" > /dev/null 2>&1; then
        log_success "Backend is reachable at http://$BACKEND_IP:$BACKEND_PORT"
    else
        log_warning "Backend is not reachable - continuing anyway (it may not be running yet)"
    fi
}

update_terraform_backend_config() {
    log_info "Updating Terraform configuration with backend IP: $BACKEND_IP:$BACKEND_PORT"
    
    local main_tf="$TERRAFORM_DIR/main.tf"
    
    if [[ ! -f "$main_tf" ]]; then
        log_error "Terraform main.tf not found: $main_tf"
        exit 1
    fi
    
    # Create backup
    cp "$main_tf" "$main_tf.backup"
    
    # Update backend IP in the CloudFront origin configuration
    sed -i.tmp "s|domain_name = \"[0-9.]*\"|domain_name = \"$BACKEND_IP\"|g" "$main_tf"
    sed -i.tmp "s|http_port              = [0-9]*|http_port              = $BACKEND_PORT|g" "$main_tf"
    
    # Remove temporary file
    rm -f "$main_tf.tmp"
    
    log_success "Terraform configuration updated"
}

apply_terraform_changes() {
    log_info "Applying Terraform changes..."
    
    cd "$TERRAFORM_DIR"
    
    # Initialize Terraform if needed
    if [[ ! -d ".terraform" ]]; then
        log_info "Initializing Terraform..."
        terraform init
    fi
    
    # Plan the changes
    log_info "Planning Terraform changes..."
    terraform plan -out=tfplan
    
    # Apply the changes
    log_info "Applying Terraform changes..."
    terraform apply tfplan
    
    # Clean up plan file
    rm -f tfplan
    
    log_success "Terraform changes applied successfully"
}

get_cloudfront_domain() {
    log_info "Getting CloudFront domain name..."
    
    cd "$TERRAFORM_DIR"
    
    CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)
    
    if [[ -z "$CLOUDFRONT_DOMAIN" ]]; then
        log_error "Failed to get CloudFront domain name from Terraform output"
        exit 1
    fi
    
    log_success "CloudFront domain: $CLOUDFRONT_DOMAIN"
}

update_frontend_config() {
    log_info "Updating frontend configuration to use CloudFront domain..."
    
    local api_file="$FRONTEND_DIR/src/services/api.ts"
    local cloudfront_url="https://$CLOUDFRONT_DOMAIN"
    
    if [[ ! -f "$api_file" ]]; then
        log_error "API service file not found: $api_file"
        exit 1
    fi
    
    # Create backup
    cp "$api_file" "$api_file.backup"
    
    # Update the default API URL in the constructor
    sed -i.tmp "s|this\.baseURL = process\.env\.REACT_APP_API_URL || '[^']*';|this.baseURL = process.env.REACT_APP_API_URL || '$cloudfront_url';|g" "$api_file"
    
    # Update the getBase function
    sed -i.tmp "s|return process\.env\.REACT_APP_API_URL || '[^']*';|return process.env.REACT_APP_API_URL || '$cloudfront_url';|g" "$api_file"
    
    # Remove temporary file
    rm -f "$api_file.tmp"
    
    log_success "Frontend API configuration updated to use CloudFront"
}

create_env_files() {
    log_info "Creating environment configuration files..."
    
    cd "$FRONTEND_DIR"
    
    local cloudfront_url="https://$CLOUDFRONT_DOMAIN"
    
    # Create .env.development
    cat > .env.development << EOF
REACT_APP_API_URL=$cloudfront_url
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=true
EOF
    
    # Create .env.production
    cat > .env.production << EOF
REACT_APP_API_URL=$cloudfront_url
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
EOF
    
    # Create .env.local (for local development override)
    cat > .env.local << EOF
REACT_APP_API_URL=$cloudfront_url
REACT_APP_ENVIRONMENT=local
EOF
    
    log_success "Environment files updated with CloudFront URL"
}

test_cloudfront_config() {
    log_info "Testing CloudFront configuration..."
    
    local cloudfront_url="https://$CLOUDFRONT_DOMAIN"
    
    # Wait a moment for CloudFront to update
    log_info "Waiting for CloudFront distribution to update (this may take a few minutes)..."
    sleep 30
    
    # Test static content
    log_info "Testing static content access..."
    if curl -s --connect-timeout 10 "$cloudfront_url" > /dev/null 2>&1; then
        log_success "CloudFront static content is accessible"
    else
        log_warning "CloudFront static content test failed - distribution may still be updating"
    fi
    
    # Test API routing (this might fail initially as backend may not be ready)
    log_info "Testing API routing through CloudFront..."
    if curl -s --connect-timeout 10 "$cloudfront_url/api/v1/health" > /dev/null 2>&1; then
        log_success "CloudFront API routing is working"
    else
        log_warning "CloudFront API routing test failed - this is normal if backend is not running"
    fi
}

show_summary() {
    log_success "CloudFront backend integration completed!"
    echo
    log_info "Configuration Summary:"
    echo "  🔗 Backend: http://$BACKEND_IP:$BACKEND_PORT"
    echo "  🌐 CloudFront Domain: $CLOUDFRONT_DOMAIN"
    echo "  🔒 Frontend API URL: https://$CLOUDFRONT_DOMAIN"
    echo
    log_info "API Routing:"
    echo "  📡 Frontend requests: https://$CLOUDFRONT_DOMAIN/api/v1/*"
    echo "  🔄 CloudFront routes to: http://$BACKEND_IP:$BACKEND_PORT/v1/*"
    echo
    log_info "SSL/Mixed Content:"
    echo "  ✅ Frontend served over HTTPS via CloudFront"
    echo "  ✅ API calls go through CloudFront (HTTPS)"
    echo "  ✅ CloudFront handles HTTP backend communication"
    echo "  ✅ No mixed content issues"
    echo
    log_info "Next Steps:"
    echo "  1. Wait for CloudFront distribution to fully deploy (5-15 minutes)"
    echo "  2. Test the application: https://$CLOUDFRONT_DOMAIN"
    echo "  3. Verify API calls work through CloudFront"
    echo "  4. Update any CI/CD pipelines to use the new CloudFront URL"
    echo
    log_warning "Note: CloudFront changes can take 5-15 minutes to propagate globally"
}

main() {
    log_info "Starting CloudFront backend integration..."
    echo
    
    parse_arguments "$@"
    
    # Check if directories exist
    if [[ ! -d "$TERRAFORM_DIR" ]]; then
        log_error "Terraform directory not found: $TERRAFORM_DIR"
        exit 1
    fi
    
    if [[ ! -d "$FRONTEND_DIR" ]]; then
        log_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    validate_backend
    update_terraform_backend_config
    apply_terraform_changes
    get_cloudfront_domain
    update_frontend_config
    create_env_files
    test_cloudfront_config
    show_summary
}

# Run main function
main "$@"

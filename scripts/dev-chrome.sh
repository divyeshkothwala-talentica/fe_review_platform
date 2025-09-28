#!/bin/bash

# Development Chrome Script
# Launches Chrome with disabled security for testing mixed content

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}⚠️  SECURITY WARNING ⚠️${NC}"
echo -e "${YELLOW}This script disables web security in Chrome for development testing only.${NC}"
echo -e "${YELLOW}DO NOT browse other websites with this Chrome instance!${NC}"
echo -e "${YELLOW}DO NOT use this in production!${NC}"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Configuration
CHROME_USER_DIR="/tmp/chrome_dev_$(date +%s)"
DEFAULT_URL="https://d123456789.cloudfront.net"  # Replace with your CloudFront domain

# Allow custom URL
if [ "$1" != "" ]; then
    URL="$1"
else
    echo -e "${BLUE}Enter the URL to test (or press Enter for default):${NC}"
    read -p "URL [$DEFAULT_URL]: " URL
    URL=${URL:-$DEFAULT_URL}
fi

echo ""
echo -e "${BLUE}🚀 Starting Chrome with disabled security...${NC}"
echo -e "${BLUE}Configuration:${NC}"
echo "  🌐 URL: $URL"
echo "  📁 User Data: $CHROME_USER_DIR"
echo "  🔓 Security: DISABLED (development only)"
echo ""

# Detect Chrome location
CHROME_PATH=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CHROME_PATH=$(which google-chrome || which chromium-browser || which chrome)
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    CHROME_PATH="chrome.exe"
fi

if [ ! -f "$CHROME_PATH" ] && [ "$OSTYPE" != "msys" ] && [ "$OSTYPE" != "cygwin" ]; then
    echo -e "${RED}❌ Chrome not found at expected location${NC}"
    echo "Please install Chrome or update the CHROME_PATH in this script"
    exit 1
fi

# Create user data directory
mkdir -p "$CHROME_USER_DIR"

echo -e "${YELLOW}📝 Chrome will open with disabled security features:${NC}"
echo "  • Web security disabled"
echo "  • CORS disabled"
echo "  • Mixed content allowed"
echo "  • Certificate errors ignored"
echo ""

# Launch Chrome with disabled security
echo -e "${GREEN}🌐 Launching Chrome...${NC}"

"$CHROME_PATH" \
    --disable-web-security \
    --disable-features=VizDisplayCompositor \
    --disable-ipc-flooding-protection \
    --disable-background-timer-throttling \
    --disable-backgrounding-occluded-windows \
    --disable-renderer-backgrounding \
    --disable-field-trial-config \
    --disable-back-forward-cache \
    --disable-background-networking \
    --disable-sync \
    --disable-translate \
    --disable-extensions \
    --disable-default-apps \
    --disable-component-extensions-with-background-pages \
    --user-data-dir="$CHROME_USER_DIR" \
    --new-window \
    --no-first-run \
    --no-default-browser-check \
    --ignore-certificate-errors \
    --ignore-ssl-errors \
    --ignore-certificate-errors-spki-list \
    --allow-running-insecure-content \
    --disable-component-update \
    "$URL" &

CHROME_PID=$!

echo -e "${GREEN}✅ Chrome launched with PID: $CHROME_PID${NC}"
echo ""
echo -e "${BLUE}📋 Testing Instructions:${NC}"
echo "1. Chrome should open with the specified URL"
echo "2. Open browser dev tools (F12)"
echo "3. Go to Network tab"
echo "4. Try using the application"
echo "5. Mixed content requests should now work"
echo "6. Check for any API call errors"
echo ""
echo -e "${YELLOW}📝 When finished testing:${NC}"
echo "• Close Chrome"
echo "• Press Ctrl+C to cleanup"
echo ""

# Wait for user to finish testing
echo -e "${BLUE}Press Ctrl+C when you're done testing...${NC}"
trap cleanup INT

cleanup() {
    echo ""
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Kill Chrome if still running
    if kill -0 $CHROME_PID 2>/dev/null; then
        echo -e "${YELLOW}Closing Chrome...${NC}"
        kill $CHROME_PID 2>/dev/null || true
        sleep 2
    fi
    
    # Remove temporary user data
    if [ -d "$CHROME_USER_DIR" ]; then
        echo -e "${YELLOW}Removing temporary Chrome data...${NC}"
        rm -rf "$CHROME_USER_DIR"
    fi
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    echo -e "${YELLOW}Remember: Never use disabled security flags in production!${NC}"
    exit 0
}

# Wait indefinitely
while true; do
    sleep 1
done

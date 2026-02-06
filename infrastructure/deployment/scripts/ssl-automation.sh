#!/bin/bash
# SSL Certificate Automation Script
# Automates Let's Encrypt certificate issuance and renewal

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domains
DOMAINS=("slidetheory.app" "www.slidetheory.app")
STAGING_DOMAINS=("staging.slidetheory.app")
EMAIL="admin@slidetheory.app"
CERTBOT_DIR="/etc/letsencrypt"
WEBROOT="/var/www/certbot"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Please run as root or with sudo"
        exit 1
    fi
}

# Install Certbot
install_certbot() {
    log_info "Installing Certbot..."
    
    if command -v certbot &> /dev/null; then
        log_success "Certbot already installed"
        return
    fi
    
    # Detect OS and install
    if [ -f /etc/debian_version ]; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    elif [ -f /etc/redhat-release ]; then
        yum install -y certbot python3-certbot-nginx
    elif [ -f /etc/arch-release ]; then
        pacman -S certbot certbot-nginx
    else
        log_error "Unsupported OS. Please install Certbot manually."
        exit 1
    fi
    
    log_success "Certbot installed"
}

# Create webroot directory
setup_webroot() {
    log_info "Setting up webroot directory..."
    mkdir -p $WEBROOT
    chown -R www-data:www-data $WEBROOT 2>/dev/null || true
    log_success "Webroot directory created at $WEBROOT"
}

# Issue certificates
issue_certificates() {
    log_info "Issuing certificates..."
    
    local domains_arg=""
    for domain in "${DOMAINS[@]}"; do
        domains_arg="$domains_arg -d $domain"
    done
    
    certbot certonly \
        --webroot \
        --webroot-path $WEBROOT \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        $domains_arg
    
    log_success "Certificates issued successfully"
}

# Issue staging certificates
issue_staging_certificates() {
    log_info "Issuing staging certificates..."
    
    local domains_arg=""
    for domain in "${STAGING_DOMAINS[@]}"; do
        domains_arg="$domains_arg -d $domain"
    done
    
    certbot certonly \
        --webroot \
        --webroot-path $WEBROOT \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        --staging \
        $domains_arg
    
    log_success "Staging certificates issued successfully"
}

# Setup auto-renewal
setup_renewal() {
    log_info "Setting up auto-renewal..."
    
    # Create renewal hook
    mkdir -p /etc/letsencrypt/renewal-hooks/deploy
    
    cat > /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh << 'EOF'
#!/bin/bash
# Reload Nginx after certificate renewal
nginx -t && systemctl reload nginx || docker-compose -f /opt/slidetheory/deployment/docker/docker-compose.yml exec nginx nginx -s reload
EOF
    
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
    
    # Add crontab entry
    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook '/etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh'") | crontab -
        log_success "Auto-renewal cron job added"
    else
        log_warn "Auto-renewal cron job already exists"
    fi
}

# Test renewal
test_renewal() {
    log_info "Testing certificate renewal..."
    certbot renew --dry-run
    log_success "Renewal test passed"
}

# Check certificate status
check_status() {
    log_info "Checking certificate status..."
    
    for domain in "${DOMAINS[@]}" "${STAGING_DOMAINS[@]}"; do
        if [ -d "$CERTBOT_DIR/live/$domain" ]; then
            local expiry=$(openssl x509 -enddate -noout -in $CERTBOT_DIR/live/$domain/cert.pem | cut -d= -f2)
            local days_until=$(echo $(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 )))
            
            if [ $days_until -lt 7 ]; then
                log_warn "$domain: Expires in $days_until days (RENEW SOON!)"
            elif [ $days_until -lt 30 ]; then
                log_warn "$domain: Expires in $days_until days"
            else
                log_success "$domain: Valid for $days_until days"
            fi
        else
            log_error "$domain: No certificate found"
        fi
    done
}

# Renew certificates now
renew_now() {
    log_info "Renewing certificates..."
    certbot renew --deploy-hook '/etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh'
    log_success "Certificates renewed"
}

# Main
main() {
    case "${1:-setup}" in
        setup)
            check_root
            install_certbot
            setup_webroot
            issue_certificates
            setup_renewal
            test_renewal
            check_status
            ;;
        staging)
            check_root
            install_certbot
            setup_webroot
            issue_staging_certificates
            setup_renewal
            ;;
        renew)
            check_root
            renew_now
            ;;
        status)
            check_status
            ;;
        test)
            check_root
            test_renewal
            ;;
        *)
            echo "Usage: $0 {setup|staging|renew|status|test}"
            echo ""
            echo "Commands:"
            echo "  setup   - Full setup for production"
            echo "  staging - Setup for staging environment"
            echo "  renew   - Renew certificates now"
            echo "  status  - Check certificate status"
            echo "  test    - Test renewal process"
            exit 1
            ;;
    esac
}

main "$@"

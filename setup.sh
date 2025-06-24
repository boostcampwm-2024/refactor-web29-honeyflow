#!/bin/bash

# ==========================================
# AWS EC2 서버 초기 설정 스크립트
# Ubuntu 22.04 LTS
# ==========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

log_info "🚀 AWS EC2 서버 초기 설정 시작..."

log_info "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip wget htop tree vim
log_success "✅ 시스템 업데이트 완료"

log_info "🐳 Docker 설치 중..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    sudo usermod -aG docker $USER
    
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log_success "✅ Docker 설치 완료"
else
    log_info "Docker가 이미 설치되어 있습니다."
fi

log_info "🔧 Docker Compose 설치 중..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log_success "✅ Docker Compose 설치 완료"
else
    log_info "Docker Compose가 이미 설치되어 있습니다."
fi

log_info "🔥 방화벽 설정 중..."

read -p "방화벽(UFW)을 설정하시겠습니까? (y/N): " -n 1 -r

echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    sudo ufw allow 22/tcp      # SSH
    sudo ufw allow 80/tcp      # HTTP
    sudo ufw allow 443/tcp     # HTTPS
    sudo ufw allow 3000/tcp    # API
    sudo ufw allow 4242/tcp    # Load Balancer
    sudo ufw allow 9001/tcp    # WebSocket
    
    sudo ufw --force enable
    log_success "✅ 방화벽 설정 완료"
else
    log_info "방화벽 설정을 건너뜁니다."
fi

log_info "💾 스왑 파일 생성 중..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    log_success "✅ 2GB 스왑 파일 생성 완료"
else
    log_info "스왑 파일이 이미 존재합니다."
fi

log_info "📝 Git 기본 설정..."
read -p "Git 사용자 이름을 입력하세요: " GIT_USERNAME
read -p "Git 이메일을 입력하세요: " GIT_EMAIL

if [ ! -z "$GIT_USERNAME" ] && [ ! -z "$GIT_EMAIL" ]; then
    git config --global user.name "$GIT_USERNAME"
    git config --global user.email "$GIT_EMAIL"
    log_success "✅ Git 설정 완료"
fi

log_info "📊 시스템 정보:"
echo "  • OS: $(lsb_release -d | cut -f2)"
echo "  • CPU: $(nproc) cores"
echo "  • Memory: $(free -h | awk '/^Mem:/{print $2}')"
echo "  • Disk: $(df -h / | awk 'NR==2{print $4}') available"
echo "  • Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo "  • Docker Compose: $(docker-compose --version 2>/dev/null || echo 'Not installed')"

log_info "⚡ 유용한 명령어 별칭 설정 중..."
cat >> ~/.bashrc << 'EOF'

alias dlogs='docker compose -f docker-compose.deploy.yml logs -f'
alias dps='docker compose -f docker-compose.deploy.yml ps'
alias dstop='docker compose -f docker-compose.deploy.yml down'
alias dstart='docker compose -f docker-compose.deploy.yml up -d'
alias drestart='docker compose -f docker-compose.deploy.yml restart'
alias dstats='docker stats'
alias dclean='docker system prune -af'
EOF

log_success "✅ 명령어 별칭 설정 완료"

log_success "🎉 EC2 서버 초기 설정 완료!"

echo ""
echo "==================================================================="
echo "📋 다음 단계 안내"
echo "==================================================================="
echo "1. 세션 재시작 (Docker 권한 적용):"
echo "   logout 후 재접속 또는 'newgrp docker' 실행"
echo ""
echo "2. 프로젝트 클론:"
echo "   git clone REPOSITORY_URL"
echo "   cd REPOSITORY_NAME"
echo ""
echo "3. 환경변수 설정:"
echo "   cp env.deploy.example .env"
echo "   vi .env  # 비밀번호들을 실제 값으로 변경!"
echo ""
echo "4. 배포 실행:"
echo "   chmod +x deploy.sh"
echo "   ./deploy.sh"
echo ""
echo "==================================================================="
echo "💡 유용한 명령어 (재접속 후 사용 가능):"
echo "   dlogs    - 로그 확인"
echo "   dps      - 컨테이너 상태"
echo "   dstop    - 서비스 중지"
echo "   dstart   - 서비스 시작"
echo "   drestart - 서비스 재시작"
echo "   dstats   - 리소스 모니터링"
echo "==================================================================="

log_warning "⚠️  중요: 세션을 재시작해야 Docker 명령어를 사용할 수 있습니다!"
log_info "logout 후 재접속하거나 'newgrp docker' 명령어를 실행하세요." 
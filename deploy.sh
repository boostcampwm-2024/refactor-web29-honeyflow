#!/bin/bash

# ==================================
# HoneyFlow 서버 배포용 스크립트
# ==================================

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

PROJECT_NAME="honeyflow"
COMPOSE_FILE="docker-compose.deploy.yml"
ENV_FILE=".env"
BACKUP_DIR="./backups/$(date +'%Y%m%d_%H%M%S')"

log_info "🚀 HoneyFlow 배포 시작..."

log_info "📋 배포 환경 체크 중..."

if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되어 있지 않습니다."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose가 설치되어 있지 않습니다."
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    log_warning "환경변수 파일이 없습니다. env.deploy.example을 복사하여 .env 파일을 만드세요."
    if [ -f "env.deploy.example" ]; then
        log_info "env.deploy.example을 .env로 복사합니다..."
        cp env.deploy.example .env
        log_warning "⚠️  .env 파일의 설정을 확인하고 수정하세요!"
        read -p "계속하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_error "env.deploy.example 파일이 없습니다."
        exit 1
    fi
fi

log_success "✅ 환경 체크 완료"

log_info "🗂️  기존 컨테이너 정리 중..."

mkdir -p "$BACKUP_DIR"

if docker compose -f "$COMPOSE_FILE" ps -q | grep -q .; then
    log_info "실행 중인 컨테이너 정보를 백업합니다..."
    docker compose -f "$COMPOSE_FILE" ps > "$BACKUP_DIR/containers_before.txt"
    docker compose -f "$COMPOSE_FILE" logs > "$BACKUP_DIR/logs_before.txt" 2>/dev/null || true
fi

log_info "기존 컨테이너 중지 중..."
docker compose -f "$COMPOSE_FILE" down --remove-orphans || true

log_info "사용하지 않는 Docker 이미지 정리 중..."
docker image prune -f --filter "dangling=true"

log_success "✅ 기존 컨테이너 정리 완료"

log_info "🔨 새 컨테이너 빌드 및 실행 중..."

log_info "Docker 이미지 빌드 중..."
docker compose -f "$COMPOSE_FILE" build

log_info "컨테이너 실행 중..."
docker compose -f "$COMPOSE_FILE" up -d

log_success "✅ 컨테이너 실행 완료"

docker compose -f "$COMPOSE_FILE" ps > "$BACKUP_DIR/containers_after.txt"

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

log_success "🎉 배포 완료!"
echo ""
echo "==================================================================="
echo "📋 서비스 접속 정보"
echo "==================================================================="
echo "🌐 Frontend:       http://$SERVER_IP"
echo "🔧 API:            http://$SERVER_IP:3000"
echo "🔄 Collaborative:  ws://$SERVER_IP:9001"
echo "⚖️  Load Balancer:  http://$SERVER_IP:4242"
echo "📊 Monitoring:     http://$SERVER_IP:8080/status"
echo "==================================================================="
echo ""

log_info "📝 도커 주요 명령어:"
echo "  • 로그 확인:       docker compose -f $COMPOSE_FILE logs -f"
echo "  • 상태 확인:       docker compose -f $COMPOSE_FILE ps"
echo "  • 재시작:         docker compose -f $COMPOSE_FILE restart"
echo "  • 중지:           docker compose -f $COMPOSE_FILE down"
echo "  • 리소스 모니터링: docker stats"
echo ""

log_success "✅ 배포 스크립트 실행 완료" 
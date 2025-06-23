#!/bin/bash

# =============================================================================
# HoneyFlow 빠른 배포 스크립트 (빌드 최적화)
# =============================================================================

set -e  # 오류 시 스크립트 중단

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Docker Buildx 설정
setup_buildx() {
    log_info "Docker Buildx 설정 중..."
    
    # Buildx 활성화
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    # Buildx 인스턴스 생성 (이미 존재하면 무시)
    docker buildx create --name honeyflow-builder --use 2>/dev/null || true
    
    log_success "Docker Buildx 설정 완료"
}

# 이전 이미지 정리
cleanup_old_images() {
    log_info "이전 이미지 정리 중..."
    
    # dangling 이미지 제거
    docker image prune -f
    
    # 기존 honeyflow 이미지를 cache용으로 태그
    docker images --format "table {{.Repository}}:{{.Tag}}" | grep honeyflow | while read image; do
        cache_tag=$(echo $image | sed 's/:latest/:cache/')
        docker tag $image $cache_tag 2>/dev/null || true
    done
    
    log_success "이미지 정리 완료"
}

# 빠른 빌드 함수
fast_build() {
    log_info "빠른 빌드 시작..."
    
    # 병렬 빌드 활성화
    docker-compose \
        -f docker-compose.deploy.yml \
        build \
        --parallel \
        --progress=plain
    
    log_success "빌드 완료"
}

# 증분 빌드 함수 (변경된 서비스만)
incremental_build() {
    log_info "변경된 서비스 감지 중..."
    
    # Git으로 변경된 파일 확인
    changed_files=$(git diff --name-only HEAD~1 2>/dev/null || echo "all")
    
    # 변경된 서비스 결정
    services_to_build=""
    
    if [[ $changed_files == *"packages/api"* ]] || [[ $changed_files == "all" ]]; then
        services_to_build="$services_to_build api"
    fi
    
    if [[ $changed_files == *"packages/collaborative"* ]] || [[ $changed_files == "all" ]]; then
        services_to_build="$services_to_build collaborative-server"
    fi
    
    if [[ $changed_files == *"packages/frontend"* ]] || [[ $changed_files == "all" ]]; then
        services_to_build="$services_to_build frontend"
    fi
    
    if [[ $changed_files == *"packages/loadbalancer"* ]] || [[ $changed_files == "all" ]]; then
        services_to_build="$services_to_build load-balancer"
    fi
    
    if [ -z "$services_to_build" ]; then
        log_warning "변경된 서비스가 없습니다. 전체 빌드를 수행합니다."
        services_to_build="api collaborative-server frontend load-balancer"
    else
        log_info "빌드할 서비스: $services_to_build"
    fi
    
    # 선택된 서비스만 빌드
    docker-compose -f docker-compose.deploy.yml build --parallel $services_to_build
}

# 메인 실행
main() {
    echo -e "${BLUE}"
    echo "🚀 HoneyFlow 빠른 배포"
    echo "======================"
    echo -e "${NC}"
    
    # 환경변수 파일 확인
    if [ ! -f .env ]; then
        log_error ".env 파일이 없습니다. env.deploy.example을 복사하세요."
        exit 1
    fi
    
    # Docker 설정
    setup_buildx
    
    # 이전 컨테이너 중지
    log_info "기존 컨테이너 중지 중..."
    docker-compose -f docker-compose.deploy.yml down
    
    # 빌드 방식 선택
    if [ "$1" = "--incremental" ]; then
        incremental_build
    else
        cleanup_old_images
        fast_build
    fi
    
    # 컨테이너 시작
    log_info "서비스 시작 중..."
    docker-compose -f docker-compose.deploy.yml up -d
    
    # 상태 확인
    sleep 5
    log_info "서비스 상태 확인 중..."
    docker-compose -f docker-compose.deploy.yml ps
    
    log_success "배포 완료!"
    echo ""
    echo -e "${GREEN}📋 서비스 접속 정보:${NC}"
    echo "• Frontend: http://localhost"
    echo "• API: http://localhost:3000"
    echo "• Load Balancer: http://localhost:4242"
    echo ""
    echo -e "${YELLOW}💡 팁:${NC}"
    echo "• 증분 빌드: ./deploy-fast.sh --incremental"
    echo "• 로그 확인: docker-compose -f docker-compose.deploy.yml logs -f"
}

# 스크립트 실행
main "$@" 
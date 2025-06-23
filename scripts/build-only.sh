#!/bin/bash

# Docker BuildKit 활성화
export DOCKER_BUILDKIT=1

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Docker 빌드 최적화 스크립트${NC}"
echo "==================================="

# 빌드 캐시 생성/사용 함수
build_with_cache() {
    local service=$1
    local context=$2
    local dockerfile=$3
    
    echo -e "${YELLOW}📦 Building ${service} with cache...${NC}"
    
    docker buildx build \
        --cache-from type=local,src=/tmp/.buildx-cache-${service} \
        --cache-to type=local,dest=/tmp/.buildx-cache-${service} \
        --tag honeyflow-${service}:latest \
        --file ${dockerfile} \
        --target production \
        ${context}
}

# 캐시 디렉토리 생성
mkdir -p /tmp/.buildx-cache-{api,collaborative,frontend,loadbalancer}

echo -e "${GREEN}🏗️  빌드 시작...${NC}"

# 병렬 빌드를 위한 백그라운드 프로세스
build_with_cache "api" "." "packages/api/Dockerfile" &
build_with_cache "collaborative" "." "packages/collaborative/Dockerfile" &
build_with_cache "loadbalancer" "." "packages/loadbalancer/Dockerfile" &

# Frontend는 용량이 크므로 별도 처리
build_with_cache "frontend" "." "packages/frontend/Dockerfile"

# 백그라운드 작업 완료 대기
wait

echo -e "${GREEN}✅ 모든 이미지 빌드 완료!${NC}"

# 이미지 목록 출력
echo -e "${BLUE}📋 빌드된 이미지들:${NC}"
docker images | grep honeyflow

echo -e "${GREEN}✅ 빌드 최적화 완료!${NC}" 
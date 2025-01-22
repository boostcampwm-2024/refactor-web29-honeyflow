# HoneyFlow

> Think Linked, Map Together
>
> 끈적끈적 꿀처럼 이루어지는 협업 지식 관리 툴

<div align="center">
  <img src="https://github.com/user-attachments/assets/bb536ea4-37c9-4436-b2a1-618f6caa491a" width="512px" />
</div>

<br/>

<div align="center">

### 🔗 바로가기

| [📜 노션](https://psychedelic-pumpkin-26b.notion.site/HoneyFlow-12a9594041ea80fc9ae3d4cff0b6cc3a) | [🎨 피그마](https://www.figma.com/design/Uewm0B9ooTzIyN1pY9ZFVl/HoneyFlow-UI?t=rGVV4Pe2usnsTZUp-1) | [📚 위키](https://github.com/boostcampwm-2024/refactor-web29-honeyflow/wiki) | [🍯 배포 주소](http://www.honeyflow.life/) |
| :-----------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :----------------------------------------: |

</div>

<br/>

<div align="center">

### 💻 기술 스택

[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![NCP](https://img.shields.io/badge/NCP-03C75A?logo=naver&logoColor=fff)](#)
[![Yjs](https://img.shields.io/badge/Y.js-646C80?)](#)

[![Nest](https://img.shields.io/badge/Nest.js-%23E0234E.svg?logo=nestjs&logoColor=white)](#)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?logo=typeorm&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000.svg?logo=shadcnui&logoColor=white)](#)
[![Milkdown](https://img.shields.io/badge/Milkdown-374151.svg?logo=markdown&logoColor=white)](#)

[![Notion](https://img.shields.io/badge/Notion-000000?logo=Notion)](#)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=Figma&logoColor=ffffff)](#)
[![Slack](https://img.shields.io/badge/Slack-4A154B?logo=Slack&logoColor=ffffff)](#)

</div>

<br/>

## 🐝 프로젝트 개요

<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/c4f6bd93-329c-4d42-b4bb-a02de0434d2b" width="512px" />
</div>

## 🐝 주요 기능 소개

**Honeyflow**는 자연스러운 인터랙션 및 애니메이션과 함께 문서를 그래프 형태로 구조화할 수 있는 협업 지식 관리 도구예요.

이제 Honeyflow의 주요 기능들이 실제로 어떻게 동작하는지, 동작 화면과 함께 소개할게요!

### 스페이스

> 문서들의 관계를 그래프 구조로 나타낼 수 있어요. 또, 간단히 드래그해서 새로운 문서를 생성하고 관계를 표시할 수 있어요.

<img alt="Space" src="https://github.com/user-attachments/assets/1b162643-d6a7-4d25-922f-5850c1981eb5" width="512" />

### 서브스페이스

> 각 그래프 구조는 다른 그래프 구조를 일종의 '폴더'처럼 관리할 수 있어요.

<img alt="Subspace" src="https://github.com/user-attachments/assets/f4150946-fa86-4175-aac7-a56bcfb32793" width="512" />

### 실시간 협업 기능

> 각 문서들 간의 구조와 그 속에 쓰이는 내용을 함께 편집할 수 있어요.

<img alt="Cowork-space" src="https://github.com/user-attachments/assets/430d49be-db25-447c-81ec-8465e78f2e18" width="384" height="218" />
<img alt="Cowork-note" src="https://github.com/user-attachments/assets/55628d20-5cc5-409a-ad68-8d44f275c642" width="384" height="218" />

<br/>

## 🐝 우리만의 해결 경험

### 기술 선택 근거

요구사항을 만족하기 위해 필요한 기술은 무엇인지, 적합한 라이브러리는 무엇인지 많은 고민을 거쳤어요. 어떤 선택을 하던지 선택은 근거가 명확히 존재하도록 했어요.

- [🎨 Canvas 라이브러리, 비교와 고민](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%8E%A8-Canvas-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC,-%EB%B9%84%EA%B5%90%EC%99%80-%EA%B3%A0%EB%AF%BC)
- [🐝 WebRTC, WebSocket, SocketIO 기술 선정의 근거와 이유](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/WebRTC,-WebSocket,-SocketIO-%EA%B8%B0%EC%88%A0-%EC%84%A0%EC%A0%95%EC%9D%98-%EA%B7%BC%EA%B1%B0%EC%99%80-%EC%9D%B4%EC%9C%A0)

### React Konva를 활용한 Canvas 개발

우리 팀은 React Konva를 사용해 Canvas 개발을 진행했어요. React 철학에 맞게 컴포넌트를 설계하고, 상태 관리를 효율적으로 처리하며, 재사용 가능한 구조를 고민했어요.

- [👩‍🚀 Konva.js로 스페이스 줌 기능 구현하기](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%91%A9%E2%80%8D%F0%9F%9A%80-Konva.js%EB%A1%9C-%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4-%EC%A4%8C-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
- [🔬 FPS 테스트로 성능 최적화 고민 해결하기](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%94%AC-FPS-%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%A1%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-%EA%B3%A0%EB%AF%BC-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0)

### Y.js로 실시간 동시편집 구현

CRDT(Conflict-free Replicated Data Type)를 기반으로 한 협업 라이브러리인 Y.js를 활용해 실시간 동시편집 기능을 구현했어요. 공유 데이터를 다루고 통신 구조를 최적화하기 위해 많은 논의를 거쳤어요.

- [🧑‍💻 React에서 Y.js를 사용하기](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/React%EC%97%90%EC%84%9C-Y.js%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)
- [🥛 동시편집 마크다운 에디터 구현기](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%A5%9B-%EB%8F%99%EC%8B%9C%ED%8E%B8%EC%A7%91-%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4-%EC%97%90%EB%94%94%ED%84%B0-%EA%B5%AC%ED%98%84%EA%B8%B0)

### 부드러운 인터랙션과 애니메이션

노트와 관계를 시각적으로 표현하는 과정에서 사용자가 긍정적인 경험을 할 수 있도록 노력했어요. 직관적이고 부드러운 인터랙션과 애니메이션을 구현하기 위해 세부적인 조정을 거쳤어요.

- [🤔 Palette메뉴 육각형 구현체에 대한 간단한 고민](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%A4%94-Palette-%EB%A9%94%EB%89%B4-%EC%9C%A1%EA%B0%81%ED%98%95-%EA%B5%AC%ED%98%84%EC%B2%B4%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B0%84%EB%8B%A8%ED%95%9C-%EA%B3%A0%EB%AF%BC)
- [💫 CSS, JS 없이도 SVG 모핑을 구현할 수 있다니](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%F0%9F%92%AB-CSS,-JS-%EC%97%86%EC%9D%B4%EB%8F%84-SVG-%EB%AA%A8%ED%95%91%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8B%A4%EB%8B%88)
- [✨ 인터랙션 구현기: 홀드, 그리고 이동](https://github.com/boostcampwm-2024/web29-honeyflow/wiki/%E2%9C%A8-%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98-%EA%B5%AC%ED%98%84%EA%B8%B0:-%ED%99%80%EB%93%9C,-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%EC%9D%B4%EB%8F%99)

### 생산성을 높이는 CI/CD 파이프라인

Docker를 활용해 환경을 동일하게 유지하며 CI/CD 파이프라인을 구성했어요. 개발 단계에서는 Docker-compose를 사용해 API 서버를 모의 운영했고, 이전 버전으로 복구할 수 있는 시스템을 만들어 안정성과 생산성을 높였어요.

<br/>

## 🐝 디렉토리 구조

```
📂 web29-honeyflow/
├── 📂 packages/            모노레포의 패키지들이 위치
│   ├── 📂 backend/         백엔드 관련 패키지
│   │   ├── 📂 src/
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   ├── 📂 frontend/        프론트엔드 관련 패키지
│   │   ├── 📂 src/
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   └── 📂 shared/          프론트엔드와 백엔드에서 공용으로 사용하는 패키지
├── 📄 eslint.config.mjs
├── 📄 pnpm-lock.yaml
├── 📄 package.json
└── 📄 tsconfig.json
```

<br/>

## 🐝 인프라 아키텍처 구조

<img width="747" alt="image" src="https://github.com/user-attachments/assets/4b66a3b3-2494-4a40-ad14-3674405424c5">

<br/>

## 🐝 팀 소개

### TEAM BUZZZZZ...✨

|                   J077 김현진                    |                 J082 나희진                  |                  J095 문지후                   |                J108 박병주                 |             J218 전호균              |
| :----------------------------------------------: | :------------------------------------------: | :--------------------------------------------: | :----------------------------------------: | :----------------------------------: |
| ![fru1tworld](https://github.com/fru1tworld.png) | ![heegenie](https://github.com/heegenie.png) | ![CatyJazzy](https://github.com/CatyJazzy.png) | ![parkblo](https://github.com/parkblo.png) | ![hoqn](https://github.com/hoqn.png) |
|                      **BE**                      |                    **FE**                    |                     **FE**                     |                   **FE**                   |                **FE**                |
|   [@fru1tworld](https://github.com/fru1tworld)   |   [@heegenie](https://github.com/heegenie)   |   [@CatyJazzy](https://github.com/CatyJazzy)   |   [@parkblo](https://github.com/parkblo)   |   [@hoqn](https://github.com/hoqn)   |

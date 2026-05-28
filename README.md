# 급할땐 — Admin

급할땐 서비스 관리자 대시보드 (Next.js 16 + TypeScript)

## 주요 기능

- 화장실 제보 목록 조회 및 승인/거절 처리
- 화장실 데이터 목록 조회 및 상세 확인
- 공공데이터 API 동기화 실행 및 상태 모니터링
- 관리자 로그인 (JWT)

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 서버 상태 | TanStack Query v5 |
| 폼 | React Hook Form + zod |
| 스타일 | Tailwind CSS v4 |
| HTTP | axios |
| 배포 | Cloudflare Pages (OpenNext) |

## 시작하기

### 환경 변수 설정

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 실행

```bash
pnpm install
pnpm dev
```

http://localhost:3000 접속

### 빌드

```bash
pnpm build
```

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/login` | 관리자 로그인 |
| `/dashboard` | 요약 통계 |
| `/reports` | 제보 목록 (승인/거절) |
| `/reports/[id]` | 제보 상세 |
| `/toilets` | 화장실 목록 |
| `/toilets/[id]` | 화장실 상세 |
| `/sync` | 공공데이터 동기화 |

## 관련 레포

- [geuphalttaen-server](../geuphalttaen-server) — Spring Boot 백엔드
- [geuphalttaen-app](../geuphalttaen-new-app) — React Native 앱

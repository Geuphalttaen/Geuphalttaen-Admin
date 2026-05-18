# 급할땐 Admin (Geuphalttaen Admin)

이 파일은 Claude Code가 이 저장소의 코드를 다룰 때 참고하는 전역 안내서입니다.

## 프로젝트 개요

**급할땐 Admin**은 급할땐 서비스의 관리자 웹 대시보드입니다.

- 사용자가 제보한 화장실 위치를 검토하고 승인/거절 처리
- 행정안전부 공공데이터 수동 동기화 트리거
- 화장실 목록 조회 및 정보 수정/삭제
- 관리자 전용 인증 (일반 사용자 Kakao/Apple 로그인과 별개, ROLE_ADMIN)
- 백엔드: geuphalttaen-server (Kotlin Spring Boot) Admin API 연동

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict mode) |
| 스타일링 | Tailwind CSS |
| 서버 상태 | TanStack Query (React Query) v5 |
| 폼 검증 | zod + react-hook-form |
| HTTP 클라이언트 | fetch (Next.js 내장) / axios |
| 패키지 매니저 | npm |

## 주요 기능

| 기능 | 설명 |
|------|------|
| 관리자 로그인 | 이메일+비밀번호 로그인, JWT 발급 |
| 제보 관리 | PENDING 제보 목록 조회, 승인(ACTIVE) / 거절(REJECTED) 처리 |
| 화장실 목록 | 전체 화장실 목록 조회, 상세 정보 수정, 삭제 |
| 공공데이터 동기화 | 수동 동기화 트리거 버튼, 마지막 동기화 시각 표시 |
| 대시보드 | 제보 현황(PENDING/ACTIVE/REJECTED 카운트), 최근 제보 목록 |

## 디렉토리 구조

```
src/
  app/                        # Next.js App Router 페이지
    (auth)/
      login/
        page.tsx              # 로그인 페이지
    (dashboard)/
      layout.tsx              # 인증 가드 레이아웃
      dashboard/
        page.tsx              # 대시보드 (현황 요약)
      reports/
        page.tsx              # 제보 목록 (PENDING 우선)
        [id]/
          page.tsx            # 제보 상세 / 승인·거절
      toilets/
        page.tsx              # 화장실 목록
        [id]/
          page.tsx            # 화장실 상세 / 수정
      sync/
        page.tsx              # 공공데이터 동기화
    page.tsx                  # / → /dashboard 리다이렉트
    layout.tsx                # 루트 레이아웃
  components/
    ui/                       # 공통 UI 컴포넌트 (Button, Badge, Table, Modal 등)
    reports/                  # 제보 관련 컴포넌트
    toilets/                  # 화장실 관련 컴포넌트
    layout/                   # 사이드바, 헤더 등 레이아웃 컴포넌트
  hooks/
    useReports.ts             # 제보 TanStack Query 훅
    useToilets.ts             # 화장실 TanStack Query 훅
    useSync.ts                # 동기화 TanStack Query 훅
    useAuth.ts                # 인증 상태 훅
  lib/
    api/
      client.ts               # fetch 래퍼 (Authorization 헤더 자동 주입)
      reports.ts              # 제보 API 함수
      toilets.ts              # 화장실 API 함수
      sync.ts                 # 동기화 API 함수
      auth.ts                 # 인증 API 함수
    utils.ts                  # 공통 유틸리티
    constants.ts              # 상수 (API_BASE_URL 등)
  types/
    report.ts                 # 제보 타입 정의
    toilet.ts                 # 화장실 타입 정의
    common.ts                 # ApiResponse 등 공통 타입
```

## Git Convention

- **브랜치**: `feature/{기능}` / `fix/{버그}` / `refactor/{기능}` / `chore/{작업}`
- **커밋 타입**: `feat` / `fix` / `refactor` / `style` / `test` / `docs` / `chore`
- **흐름**: feature → develop (PR) → main (릴리즈)
- develop에 직접 push 금지 — 반드시 PR로 머지

## 에이전트 위임 가이드

작업을 서브 에이전트에 위임할 때 다음 원칙을 따릅니다.

- **페이지/컴포넌트/UI 구현** → `agents/frontend.md`
  - Next.js App Router 페이지, Tailwind 스타일링, TanStack Query 훅
- **코드 리뷰** → `agents/reviewer.md`
  - PR 생성 직후 자동 실행, 블로커 + 개선권고 처리
- **QA/E2E 테스트** → `agents/qa.md`
  - Playwright E2E 시나리오, 로그인/제보 승인·거절/동기화 플로우 검증

## 실행 방법

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint
```

개발 서버: http://localhost:3000  
백엔드 서버: http://localhost:8080

## API 엔드포인트 (Admin)

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| POST | `/api/v1/admin/auth/login` | 없음 | 관리자 로그인 (email + password) |
| GET | `/api/v1/admin/reports` | Bearer JWT | 제보 목록 조회 (`status`, `page`, `size`) |
| GET | `/api/v1/admin/reports/{id}` | Bearer JWT | 제보 상세 조회 |
| PATCH | `/api/v1/admin/reports/{id}/approve` | Bearer JWT | 제보 승인 (PENDING → ACTIVE) |
| PATCH | `/api/v1/admin/reports/{id}/reject` | Bearer JWT | 제보 거절 (PENDING → REJECTED) |
| GET | `/api/v1/admin/toilets` | Bearer JWT | 화장실 목록 조회 (`page`, `size`, `keyword`) |
| GET | `/api/v1/admin/toilets/{id}` | Bearer JWT | 화장실 상세 조회 |
| PATCH | `/api/v1/admin/toilets/{id}` | Bearer JWT | 화장실 정보 수정 |
| DELETE | `/api/v1/admin/toilets/{id}` | Bearer JWT | 화장실 삭제 |
| POST | `/api/v1/admin/toilets/sync` | Bearer JWT | 공공데이터 수동 동기화 트리거 |
| GET | `/api/v1/admin/toilets/sync/status` | Bearer JWT | 마지막 동기화 시각 및 상태 조회 |

## 코드 규칙

- TypeScript strict mode 준수 — `any` 타입 사용 금지
- 서버 상태 관리는 TanStack Query 사용 (useState로 직접 fetch 금지)
- 폼은 zod 스키마 검증 + react-hook-form 사용
- Tailwind 유틸리티 클래스로만 스타일링 (인라인 style 금지)
- 인증 필요 페이지는 `(dashboard)/layout.tsx` 에서 인증 가드 처리
- API 함수는 `src/lib/api/` 에 모듈별로 분리
- 컴포넌트 파일명: PascalCase, 훅 파일명: camelCase (use 접두사)

## 공통 코드 언어

코드 주석·문서·커밋 메시지의 기본 언어는 **한국어**

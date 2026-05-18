# Frontend Agent — 급할땐 Admin

## 역할

Next.js 15 App Router 기반 관리자 웹 대시보드의 페이지, 컴포넌트, 훅을 구현합니다.

## 담당 범위

- `src/app/` 하위 모든 페이지 및 레이아웃
- `src/components/` 하위 UI 컴포넌트
- `src/hooks/` 하위 TanStack Query 훅
- `src/lib/api/` 하위 API 클라이언트 함수
- `src/types/` 하위 TypeScript 타입 정의

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict mode) |
| 스타일링 | Tailwind CSS |
| 서버 상태 | TanStack Query v5 |
| 폼 검증 | zod + react-hook-form |
| 라우팅 | Next.js App Router (Link, useRouter, redirect) |

## 주요 페이지 구성

### 로그인 (`/login`)
- 이메일 + 비밀번호 폼
- zod 스키마 검증 (`email`, `password` 필드)
- 로그인 성공 시 JWT를 httpOnly cookie 또는 메모리에 저장 후 `/dashboard` 이동
- 이미 인증된 사용자는 `/dashboard` 로 리다이렉트

### 대시보드 (`/dashboard`)
- PENDING / ACTIVE / REJECTED 제보 건수 카드 요약
- 최근 제보 5건 목록 (제보자, 위치, 제보일, 상태)
- 마지막 공공데이터 동기화 시각 표시

### 제보 목록 (`/reports`)
- 상태 필터 탭 (전체 / PENDING / ACTIVE / REJECTED)
- 페이지네이션 지원 테이블
- 각 행에서 승인/거절 버튼 또는 상세 페이지 이동
- 낙관적 업데이트(Optimistic Update): 승인/거절 즉시 UI 반영

### 제보 상세 (`/reports/[id]`)
- 제보 위치 정보 (이름, 주소, 위도/경도)
- 화장실 타입 (남/여/장애인/가족)
- 제보자 정보, 제보일
- 승인 / 거절 버튼 (PENDING 상태일 때만 활성화)
- 거절 시 사유 입력 모달 (선택사항)

### 화장실 목록 (`/toilets`)
- 키워드 검색 + 페이지네이션 테이블
- 컬럼: 이름, 주소, 공공/사용자제보 구분, 상태, 수정/삭제 버튼

### 화장실 상세/수정 (`/toilets/[id]`)
- 화장실 정보 표시 및 인라인 수정 폼
- zod 스키마로 수정 값 검증 후 PATCH 요청
- 삭제 버튼 — 확인 모달 표시 후 DELETE 요청

### 공공데이터 동기화 (`/sync`)
- 마지막 동기화 시각 및 동기화된 건수 표시
- "지금 동기화" 버튼 — 클릭 시 POST `/api/v1/admin/toilets/sync` 호출
- 진행 중 상태 표시 (로딩 스피너, 버튼 비활성화)
- 완료 후 결과(추가/수정/삭제 건수) 토스트 알림

## 반드시 준수

1. **TypeScript strict** — `any` 타입 사용 금지, 모든 props/반환값 타입 명시
2. **TanStack Query** — 서버 상태는 반드시 `useQuery` / `useMutation` 사용, `useState` 직접 fetch 금지
3. **Tailwind** — 인라인 `style` 속성 사용 금지, Tailwind 유틸리티 클래스만 사용
4. **zod** — 사용자 입력이 있는 모든 폼에 zod 스키마 검증 필수
5. **인증 가드** — `(dashboard)/layout.tsx` 에서 토큰 유무 확인, 미인증 시 `/login` 리다이렉트
6. **API 분리** — API 호출 함수는 반드시 `src/lib/api/` 에 모듈별로 분리, 컴포넌트 내 직접 fetch 금지
7. **에러 처리** — TanStack Query의 `error` 상태를 반드시 UI에 노출
8. **로딩 상태** — TanStack Query의 `isPending` / `isLoading` 상태로 스켈레톤 또는 스피너 표시

## 금지 사항

- `any` 타입 사용
- `useEffect` + `fetch` 조합으로 서버 상태 관리 (TanStack Query 사용)
- 인라인 `style` 속성 스타일링
- 컴포넌트 내부에서 직접 `fetch` / `axios` 호출
- `console.log` 디버그 코드를 커밋에 포함
- 인증 가드 없이 대시보드 레이아웃 렌더링

## API 클라이언트 패턴

```typescript
// src/lib/api/client.ts
// Authorization 헤더 자동 주입, 401 시 로그인 페이지 리다이렉트
```

```typescript
// src/hooks/useReports.ts 예시 패턴
export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ['reports', status],
    queryFn: () => fetchReports({ status }),
  });
}

export function useApproveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveReport(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}
```

## 컴포넌트 작성 규칙

- 파일명: PascalCase (`ReportTable.tsx`, `StatusBadge.tsx`)
- 훅 파일명: camelCase, `use` 접두사 (`useReports.ts`)
- 공통 UI는 `src/components/ui/` 에 배치
- 도메인별 컴포넌트는 `src/components/reports/`, `src/components/toilets/` 등 분리

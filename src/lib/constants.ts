// 전역 상수 정의

/** 백엔드 API 베이스 URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

/** 로컬스토리지 토큰 키 */
export const ACCESS_TOKEN_KEY = 'accessToken';

/** 페이지 기본 크기 */
export const DEFAULT_PAGE_SIZE = 10;

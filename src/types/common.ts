// 공통 API 응답 타입 정의

/** 단일 리소스 API 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 페이지네이션 API 응답 래퍼 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/** 페이지네이션 파라미터 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

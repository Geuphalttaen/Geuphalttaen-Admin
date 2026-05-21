// 화장실 관련 타입 정의

/** 화장실 상태 */
export type ToiletStatus = 'ACTIVE' | 'PENDING' | 'REJECTED';

/** 관리자용 화장실 응답 — AdminToiletResponse */
export interface Toilet {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isPublic: boolean;
  male: boolean;
  female: boolean;
  disabled: boolean;
  familyRoom: boolean;
  imageUrls: string[];
  reportedBy: number | null;
  status: ToiletStatus;
  createdAt: string;
  updatedAt: string;
}

/** 화장실 수정 요청 — AdminToiletUpdateRequest */
export interface ToiletUpdateRequest {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  isPublic?: boolean;
  male?: boolean;
  female?: boolean;
  disabled?: boolean;
  familyRoom?: boolean;
}

/** 화장실 목록 조회 파라미터 */
export interface ToiletListParams {
  page?: number;
  size?: number;
  keyword?: string;
}

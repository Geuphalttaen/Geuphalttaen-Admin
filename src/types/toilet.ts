// 화장실 관련 타입 정의

/** 화장실 상태 */
export type ToiletStatus = 'ACTIVE' | 'PENDING' | 'REJECTED';

/** 화장실 운영 정보 */
export interface ToiletOperatingHours {
  weekday?: string;
  weekend?: string;
  holiday?: string;
}

/** 화장실 상세 정보 */
export interface Toilet {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  operatingHours?: ToiletOperatingHours;
  status: ToiletStatus;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

/** 화장실 수정 요청 */
export interface ToiletUpdateRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  operatingHours?: ToiletOperatingHours;
}

/** 화장실 목록 조회 파라미터 */
export interface ToiletListParams {
  page?: number;
  size?: number;
  keyword?: string;
}

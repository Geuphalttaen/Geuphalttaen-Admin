// 제보 관련 타입 정의

/** 제보 상태 */
export type ReportStatus = 'ACTIVE' | 'PENDING' | 'REJECTED';

/** 제보 상세 정보 — AdminReportResponse */
export interface Report {
  id: number;
  reportedBy: number;
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
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

/** 제보 목록 아이템 (리스트 뷰용 간소화 타입) */
export interface ReportListItem {
  id: number;
  name: string;
  address: string;
  status: ReportStatus;
  createdAt: string;
}

/** 제보 목록 조회 파라미터 */
export interface ReportListParams {
  page?: number;
  size?: number;
  status?: ReportStatus | 'ALL';
}

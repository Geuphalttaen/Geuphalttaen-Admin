// 공공데이터 동기화 관련 API 함수

import apiClient from './client';
import type { ApiResponse } from '@/types/common';

/** 동기화 결과 단건 */
export interface SyncResult {
  id: number;
  status: 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  totalFetched: number;
  insertedCount: number;
  updatedCount: number;
  deletedCount: number;
  failedCount: number;
  errorMessage: string | null;
  syncedAt: string;
}

/**
 * 공공데이터 CSV 파일 업로드 → 동기화
 * axios 인스턴스 기본값(Content-Type: application/json)이 FormData를 JSON 직렬화하므로
 * fetch를 직접 사용 — 브라우저가 boundary 포함한 multipart/form-data를 자동 설정
 */
export async function uploadSyncCsv(file: File): Promise<SyncResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/v1/admin/toilets/sync/upload', {
    method: 'POST',
    body: formData,
  });

  const json = (await res.json()) as ApiResponse<SyncResult>;
  if (!res.ok) {
    throw new Error((json as { error?: { message?: string } }).error?.message ?? '동기화 실패');
  }
  return json.data;
}

/**
 * 동기화 결과 목록 조회 (최근 순)
 */
export async function getSyncStatus(): Promise<SyncResult[]> {
  const response = await apiClient.get<ApiResponse<SyncResult[]>>(
    '/api/v1/admin/toilets/sync/status'
  );
  return response.data.data;
}

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
 */
export async function uploadSyncCsv(file: File): Promise<SyncResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<ApiResponse<SyncResult>>(
    '/api/v1/admin/toilets/sync/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data;
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

// 공공데이터 동기화 관련 API 함수

import apiClient from './client';
import type { ApiResponse } from '@/types/common';

/** 동기화 결과 단건 */
export interface SyncResult {
  id: number;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  totalFetched: number;
  upsertedCount: number;
  failedCount: number;
  errorMessage: string | null;
  syncedAt: string;
}

/** 동기화 트리거 응답 */
export interface SyncTriggerResponse {
  message: string;
}

/**
 * 공공데이터 수동 동기화 트리거
 */
export async function triggerSync(): Promise<SyncTriggerResponse> {
  const response = await apiClient.post<ApiResponse<SyncTriggerResponse>>(
    '/api/v1/admin/toilets/sync'
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

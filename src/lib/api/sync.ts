// 공공데이터 동기화 관련 API 함수

import apiClient from './client';
import type { ApiResponse } from '@/types/common';

/** 동기화 상태 */
export interface SyncStatus {
  lastSyncAt: string | null;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  message?: string;
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
 * 동기화 상태 조회 (마지막 동기화 시각 포함)
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  const response = await apiClient.get<ApiResponse<SyncStatus>>(
    '/api/v1/admin/toilets/sync/status'
  );
  return response.data.data;
}

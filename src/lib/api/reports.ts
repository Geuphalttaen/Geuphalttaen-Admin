// 제보 관련 API 함수

import apiClient from './client';
import type { ApiResponse, PageResponse } from '@/types/common';
import type { Report, ReportListItem, ReportListParams } from '@/types/report';

/**
 * 제보 목록 조회
 */
export async function getReports(
  params: ReportListParams
): Promise<PageResponse<ReportListItem>> {
  // 'ALL' 상태는 파라미터에서 제외
  const { status, ...rest } = params;
  const queryParams = status && status !== 'ALL' ? { ...rest, status } : rest;

  const response = await apiClient.get<PageResponse<ReportListItem>>(
    '/api/v1/admin/reports',
    { params: queryParams }
  );
  return response.data;
}

/**
 * 제보 상세 조회
 */
export async function getReport(id: number): Promise<Report> {
  const response = await apiClient.get<ApiResponse<Report>>(
    `/api/v1/admin/reports/${id}`
  );
  return response.data.data;
}

/**
 * 제보 승인 (PENDING → ACTIVE)
 */
export async function approveReport(id: number): Promise<void> {
  await apiClient.patch(`/api/v1/admin/reports/${id}/approve`);
}

/**
 * 제보 거절 (PENDING → REJECTED)
 */
export async function rejectReport(id: number): Promise<void> {
  await apiClient.patch(`/api/v1/admin/reports/${id}/reject`);
}

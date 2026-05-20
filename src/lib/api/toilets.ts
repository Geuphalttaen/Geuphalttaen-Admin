// 화장실 관련 API 함수

import apiClient from './client';
import type { ApiResponse, PageResponse } from '@/types/common';
import type { Toilet, ToiletListParams, ToiletUpdateRequest } from '@/types/toilet';

/**
 * 화장실 목록 조회
 */
export async function getToilets(
  params: ToiletListParams
): Promise<PageResponse<Toilet>> {
  const response = await apiClient.get<PageResponse<Toilet>>(
    '/api/v1/admin/toilets',
    { params }
  );
  return response.data;
}

/**
 * 화장실 상세 조회
 */
export async function getToilet(id: number): Promise<Toilet> {
  const response = await apiClient.get<ApiResponse<Toilet>>(
    `/api/v1/admin/toilets/${id}`
  );
  return response.data.data;
}

/**
 * 화장실 정보 수정
 */
export async function updateToilet(
  id: number,
  data: ToiletUpdateRequest
): Promise<Toilet> {
  const response = await apiClient.patch<ApiResponse<Toilet>>(
    `/api/v1/admin/toilets/${id}`,
    data
  );
  return response.data.data;
}

/**
 * 화장실 삭제
 */
export async function deleteToilet(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/admin/toilets/${id}`);
}

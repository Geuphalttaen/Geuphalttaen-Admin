'use client';

// 제보 관련 TanStack Query 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReports,
  getReport,
  approveReport,
  rejectReport,
} from '@/lib/api/reports';
import type { ReportListParams } from '@/types/report';

/** 제보 쿼리 키 팩토리 */
const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (params: ReportListParams) => [...reportKeys.lists(), params] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: number) => [...reportKeys.details(), id] as const,
};

/**
 * 제보 목록 조회 훅
 */
export function useReports(params: ReportListParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => getReports(params),
  });
}

/**
 * 제보 상세 조회 훅
 */
export function useReport(id: number) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => getReport(id),
    enabled: Boolean(id),
  });
}

/**
 * 제보 승인 뮤테이션 훅
 */
export function useApproveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveReport(id),
    onSuccess: () => {
      // 제보 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

/**
 * 제보 거절 뮤테이션 훅
 */
export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rejectReport(id),
    onSuccess: () => {
      // 제보 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

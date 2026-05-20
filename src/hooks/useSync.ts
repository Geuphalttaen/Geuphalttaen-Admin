'use client';

// 공공데이터 동기화 관련 TanStack Query 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSyncStatus, triggerSync } from '@/lib/api/sync';

/** 동기화 쿼리 키 */
const syncKeys = {
  all: ['sync'] as const,
  status: () => [...syncKeys.all, 'status'] as const,
};

/**
 * 동기화 상태 조회 훅
 */
export function useSyncStatus() {
  return useQuery({
    queryKey: syncKeys.status(),
    queryFn: getSyncStatus,
    // 30초마다 자동 갱신
    refetchInterval: 30_000,
  });
}

/**
 * 동기화 트리거 뮤테이션 훅
 */
export function useTriggerSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerSync,
    onSuccess: () => {
      // 동기화 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: syncKeys.status() });
    },
  });
}

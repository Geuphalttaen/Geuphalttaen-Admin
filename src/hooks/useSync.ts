'use client';

// 공공데이터 동기화 관련 TanStack Query 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSyncStatus, uploadSyncCsv } from '@/lib/api/sync';

const syncKeys = {
  all: ['sync'] as const,
  status: () => [...syncKeys.all, 'status'] as const,
};

export function useSyncStatus() {
  return useQuery({
    queryKey: syncKeys.status(),
    queryFn: getSyncStatus,
    refetchInterval: 10_000,
  });
}

export function useUploadSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadSyncCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syncKeys.status() });
    },
  });
}

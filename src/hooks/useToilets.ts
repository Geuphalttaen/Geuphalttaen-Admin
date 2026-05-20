'use client';

// 화장실 관련 TanStack Query 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getToilets,
  getToilet,
  updateToilet,
  deleteToilet,
} from '@/lib/api/toilets';
import type { ToiletListParams, ToiletUpdateRequest } from '@/types/toilet';

/** 화장실 쿼리 키 팩토리 */
const toiletKeys = {
  all: ['toilets'] as const,
  lists: () => [...toiletKeys.all, 'list'] as const,
  list: (params: ToiletListParams) => [...toiletKeys.lists(), params] as const,
  details: () => [...toiletKeys.all, 'detail'] as const,
  detail: (id: number) => [...toiletKeys.details(), id] as const,
};

/**
 * 화장실 목록 조회 훅
 */
export function useToilets(params: ToiletListParams) {
  return useQuery({
    queryKey: toiletKeys.list(params),
    queryFn: () => getToilets(params),
  });
}

/**
 * 화장실 상세 조회 훅
 */
export function useToilet(id: number) {
  return useQuery({
    queryKey: toiletKeys.detail(id),
    queryFn: () => getToilet(id),
    enabled: Boolean(id),
  });
}

/**
 * 화장실 수정 뮤테이션 훅
 */
export function useUpdateToilet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ToiletUpdateRequest }) =>
      updateToilet(id, data),
    onSuccess: (_, { id }) => {
      // 수정된 화장실 상세 및 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: toiletKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: toiletKeys.lists() });
    },
  });
}

/**
 * 화장실 삭제 뮤테이션 훅
 */
export function useDeleteToilet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteToilet(id),
    onSuccess: () => {
      // 화장실 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: toiletKeys.lists() });
    },
  });
}

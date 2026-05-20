'use client';

// 인증 관련 TanStack Query 훅

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

/**
 * 인증 훅: 로그인 뮤테이션, 로그아웃, 인증 상태 확인
 */
export function useAuth() {
  const router = useRouter();

  /** 로컬스토리지 토큰 존재 여부로 인증 상태 확인 */
  const isAuthenticated =
    typeof window !== 'undefined'
      ? Boolean(localStorage.getItem(ACCESS_TOKEN_KEY))
      : false;

  /** 로그인 뮤테이션 */
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      // 토큰을 로컬스토리지에 저장 후 대시보드로 이동
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      router.push('/dashboard');
    },
  });

  /** 로그아웃: 토큰 제거 후 로그인 페이지로 이동 */
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    router.push('/login');
  };

  return {
    isAuthenticated,
    loginMutation,
    logout,
  };
}

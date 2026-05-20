'use client';

// 인증 관련 TanStack Query 훅

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * 인증 훅: 로그인 뮤테이션, 로그아웃
 * 토큰은 httpOnly 쿠키로 관리되며 클라이언트에서 직접 접근 불가
 */
export function useAuth() {
  const router = useRouter();

  /** 로그인 뮤테이션 — Next.js API 라우트를 통해 httpOnly 쿠키 발급 */
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? '로그인에 실패했습니다.');
      }

      return res.json();
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  /** 로그아웃: Next.js API 라우트를 통해 쿠키 제거 후 로그인 페이지로 이동 */
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return {
    loginMutation,
    logout,
  };
}

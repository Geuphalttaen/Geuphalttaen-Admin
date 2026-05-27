'use client';

// 대시보드 인증 가드 레이아웃
// 인증 엔드포인트 호출로 토큰 유효성 검증 후 미인증 시 /login으로 리다이렉트

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/api/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/** 경로별 페이지 타이틀 매핑 */
const pageTitles: Record<string, string> = {
  '/dashboard': '대시보드',
  '/reports': '제보 관리',
  '/toilets': '화장실 관리',
  '/sync': '공공데이터 동기화',
};

function getPageTitle(pathname: string): string {
  // 정확히 일치하는 경로 확인
  if (pageTitles[pathname]) return pageTitles[pathname];

  // 접두사 매칭 (예: /reports/123 → '제보 관리')
  const matched = Object.keys(pageTitles).find((key) =>
    pathname.startsWith(key + '/')
  );
  return matched ? pageTitles[matched] : '급할땐 Admin';
}

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 인증된 엔드포인트에 경량 요청으로 토큰 유효성 서버 검증
    apiClient
      .get('/api/v1/admin/reports/stats')
      .then(() => {
        setIsChecking(false);
      })
      .catch((err: { response?: { status?: number } }) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          router.replace('/login');
        } else {
          // 백엔드 일시 오류(500, 502 등) — 토큰 무효화가 아니므로 접근 허용
          setIsChecking(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 인증 확인 중 로딩 표시
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const title = getPageTitle(pathname);

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}

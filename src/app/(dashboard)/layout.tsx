'use client';

// 대시보드 인증 가드 레이아웃
// 토큰이 없으면 /login으로 리다이렉트

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';
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
    // 인증 토큰 확인
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

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

'use client';

// 헤더 컴포넌트 — 페이지 타이틀 + 로그아웃 버튼

import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 border-t-2 border-t-indigo-600">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <Button variant="secondary" size="sm" onClick={logout}>
        로그아웃
      </Button>
    </header>
  );
}

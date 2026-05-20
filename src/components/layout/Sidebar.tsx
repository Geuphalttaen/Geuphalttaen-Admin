'use client';

// 사이드바 네비게이션 컴포넌트

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** 네비게이션 메뉴 항목 */
const navItems = [
  { href: '/dashboard', label: '대시보드', icon: '📊' },
  { href: '/reports', label: '제보 관리', icon: '📋' },
  { href: '/toilets', label: '화장실 관리', icon: '🚻' },
  { href: '/sync', label: '공공데이터 동기화', icon: '🔄' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center border-b border-gray-700 px-6">
        <span className="text-xl font-bold text-white">급할땐 Admin</span>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  ].join(' ')}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

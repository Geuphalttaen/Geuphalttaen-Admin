// 페이지 헤더 컴포넌트 — 타이틀, 서브타이틀, 액션 버튼 영역

import React from 'react';

interface PageHeaderProps {
  /** 페이지 타이틀 */
  title: string;
  /** 서브타이틀 (선택) */
  subtitle?: string;
  /** 우측 액션 영역 (선택) */
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-4 border-b border-gray-200" />
    </div>
  );
}

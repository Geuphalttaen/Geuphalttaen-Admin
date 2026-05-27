// 상태 뱃지 컴포넌트

import type { ToiletStatus } from '@/types/toilet';
import type { ReportStatus } from '@/types/report';

/** 뱃지가 지원하는 상태 타입 */
type BadgeStatus = ToiletStatus | ReportStatus;

interface BadgeProps {
  status: BadgeStatus;
}

/** 상태별 Tailwind 클래스 — 토스 스타일: 컬러 최소화, 서브틀 배경 */
const statusClasses: Record<BadgeStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-gray-100 text-gray-400 line-through',
};

/** 상태별 한국어 라벨 */
const statusLabels: Record<BadgeStatus, string> = {
  PENDING: '대기',
  ACTIVE: '승인',
  REJECTED: '거절',
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

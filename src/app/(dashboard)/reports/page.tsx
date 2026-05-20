'use client';

// 제보 목록 페이지 — 상태 필터 탭 + 페이지네이션 + 승인/거절 처리

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReports } from '@/hooks/useReports';
import { useReportAction } from '@/hooks/useReportAction';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTableSection from '@/components/ui/DataTableSection';
import ReportActionModal from '@/components/reports/ReportActionModal';
import type { ReportListItem, ReportStatus } from '@/types/report';
import type { TableColumn } from '@/components/ui/Table';

/** 상태 필터 탭 목록 */
const STATUS_TABS = [
  { label: '전체', value: 'ALL' },
  { label: '대기', value: 'PENDING' },
  { label: '승인', value: 'ACTIVE' },
  { label: '거절', value: 'REJECTED' },
] as const;

type StatusFilter = 'ALL' | ReportStatus;

const PAGE_SIZE = 10;

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터로 초기 상태 설정
  const initialStatus = (searchParams.get('status') as StatusFilter) ?? 'ALL';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [currentPage, setCurrentPage] = useState(0);

  // 필터 변경 시 첫 페이지로 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [statusFilter]);

  const { data, isLoading } = useReports({
    page: currentPage,
    size: PAGE_SIZE,
    status: statusFilter,
  });

  const { modal, openModal, closeModal, handleConfirm, isPending } = useReportAction();

  /** 테이블 컬럼 정의 */
  const columns: TableColumn<ReportListItem>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span className="font-mono text-gray-500">#{row.id}</span>,
      className: 'w-20',
    },
    {
      key: 'name',
      header: '화장실명',
      render: (row) => row.name,
    },
    {
      key: 'address',
      header: '주소',
      render: (row) => (
        <span className="max-w-sm truncate block text-gray-600">{row.address}</span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => <Badge status={row.status} />,
      className: 'w-24',
    },
    {
      key: 'createdAt',
      header: '제보일시',
      render: (row) => new Date(row.createdAt).toLocaleString('ko-KR'),
      className: 'w-44',
    },
    {
      key: 'actions',
      header: '처리',
      render: (row) =>
        row.status === 'PENDING' ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => openModal(e, 'approve', row.id)}
              disabled={isPending}
            >
              승인
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => openModal(e, 'reject', row.id)}
              disabled={isPending}
            >
              거절
            </Button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">처리완료</span>
        ),
      className: 'w-36',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 상태 필터 탭 */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={[
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              statusFilter === tab.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 + 페이지네이션 */}
      <DataTableSection
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowClick={(row) => router.push(`/reports/${row.id}`)}
        getRowKey={(row) => row.id}
        emptyMessage="제보가 없습니다."
      />

      {/* 승인/거절 확인 모달 */}
      <ReportActionModal
        isOpen={modal.isOpen}
        type={modal.type}
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

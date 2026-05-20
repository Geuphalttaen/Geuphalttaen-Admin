'use client';

// 제보 목록 페이지 — 상태 필터 탭 + 페이지네이션 + 승인/거절 처리

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReports, useApproveReport, useRejectReport } from '@/hooks/useReports';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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

  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    reportId: number | null;
  }>({ isOpen: false, type: 'approve', reportId: null });

  const openModal = (
    e: React.MouseEvent,
    type: 'approve' | 'reject',
    reportId: number
  ) => {
    e.stopPropagation();
    setModal({ isOpen: true, type, reportId });
  };

  const handleConfirm = () => {
    if (!modal.reportId) return;
    const mutate =
      modal.type === 'approve' ? approveMutation.mutate : rejectMutation.mutate;
    mutate(modal.reportId, {
      onSuccess: () =>
        setModal({ isOpen: false, type: 'approve', reportId: null }),
    });
  };

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
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              승인
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => openModal(e, 'reject', row.id)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
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

      {/* 테이블 */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.content ?? []}
            emptyMessage="제보가 없습니다."
            onRowClick={(row) => router.push(`/reports/${row.id}`)}
          />

          {/* 페이지네이션 */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 0}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* 총 건수 */}
          <p className="text-center text-sm text-gray-500">
            총 {data?.totalElements ?? 0}건
          </p>
        </>
      )}

      {/* 승인/거절 확인 모달 */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.type === 'approve' ? '제보 승인' : '제보 거절'}
        message={
          modal.type === 'approve'
            ? '이 제보를 승인하시겠습니까?'
            : '이 제보를 거절하시겠습니까? 취소할 수 없습니다.'
        }
        confirmLabel={modal.type === 'approve' ? '승인' : '거절'}
        confirmVariant={modal.type === 'approve' ? 'primary' : 'danger'}
        loading={approveMutation.isPending || rejectMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() =>
          setModal({ isOpen: false, type: 'approve', reportId: null })
        }
      />
    </div>
  );
}

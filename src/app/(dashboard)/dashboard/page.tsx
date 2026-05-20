'use client';

// 대시보드 페이지 — 제보 현황 요약 카드 + 최근 PENDING 제보 목록

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReports, useApproveReport, useRejectReport } from '@/hooks/useReports';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { ReportListItem } from '@/types/report';
import type { TableColumn } from '@/components/ui/Table';

/** 현황 카드 컴포넌트 */
function StatusCard({
  label,
  count,
  colorClass,
}: {
  label: string;
  count: number;
  colorClass: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorClass}`}>{count}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // 모든 제보 조회 (통계용)
  const { data: allReports, isLoading: isLoadingAll } = useReports({
    page: 0,
    size: 1000,
  });

  // 최근 PENDING 제보 5건
  const { data: pendingReports, isLoading: isLoadingPending } = useReports({
    page: 0,
    size: 5,
    status: 'PENDING',
  });

  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    reportId: number | null;
  }>({ isOpen: false, type: 'approve', reportId: null });

  /** 상태별 카운트 계산 */
  const counts = {
    PENDING: allReports?.content.filter((r) => r.status === 'PENDING').length ?? 0,
    ACTIVE: allReports?.content.filter((r) => r.status === 'ACTIVE').length ?? 0,
    REJECTED: allReports?.content.filter((r) => r.status === 'REJECTED').length ?? 0,
  };

  /** 승인/거절 모달 열기 */
  const openModal = (
    e: React.MouseEvent,
    type: 'approve' | 'reject',
    reportId: number
  ) => {
    e.stopPropagation();
    setModal({ isOpen: true, type, reportId });
  };

  /** 모달 확인 처리 */
  const handleConfirm = () => {
    if (!modal.reportId) return;
    if (modal.type === 'approve') {
      approveMutation.mutate(modal.reportId, {
        onSuccess: () => setModal({ isOpen: false, type: 'approve', reportId: null }),
      });
    } else {
      rejectMutation.mutate(modal.reportId, {
        onSuccess: () => setModal({ isOpen: false, type: 'approve', reportId: null }),
      });
    }
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
        <span className="max-w-xs truncate block text-gray-600">{row.address}</span>
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
      className: 'w-40',
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
              loading={approveMutation.isPending && modal.reportId === row.id}
            >
              승인
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => openModal(e, 'reject', row.id)}
              loading={rejectMutation.isPending && modal.reportId === row.id}
            >
              거절
            </Button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">처리완료</span>
        ),
      className: 'w-36',
    },
  ];

  if (isLoadingAll) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 현황 요약 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard label="대기 중 제보" count={counts.PENDING} colorClass="text-yellow-600" />
        <StatusCard label="승인된 화장실" count={counts.ACTIVE} colorClass="text-green-600" />
        <StatusCard label="거절된 제보" count={counts.REJECTED} colorClass="text-red-600" />
      </div>

      {/* 최근 PENDING 제보 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">최근 대기 제보</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/reports?status=PENDING')}
          >
            전체 보기
          </Button>
        </div>

        {isLoadingPending ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={pendingReports?.content ?? []}
            emptyMessage="대기 중인 제보가 없습니다."
            onRowClick={(row) => router.push(`/reports/${row.id}`)}
          />
        )}
      </div>

      {/* 승인/거절 확인 모달 */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.type === 'approve' ? '제보 승인' : '제보 거절'}
        message={
          modal.type === 'approve'
            ? '이 제보를 승인하시겠습니까? 화장실이 서비스에 등록됩니다.'
            : '이 제보를 거절하시겠습니까? 취소할 수 없습니다.'
        }
        confirmLabel={modal.type === 'approve' ? '승인' : '거절'}
        confirmVariant={modal.type === 'approve' ? 'primary' : 'danger'}
        loading={approveMutation.isPending || rejectMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setModal({ isOpen: false, type: 'approve', reportId: null })}
      />
    </div>
  );
}

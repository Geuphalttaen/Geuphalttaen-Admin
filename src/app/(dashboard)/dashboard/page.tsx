'use client';

// 대시보드 페이지 — 제보 현황 요약 카드 + 최근 PENDING 제보 목록

import { useRouter } from 'next/navigation';
import { useReports, useReportStats } from '@/hooks/useReports';
import { useReportAction } from '@/hooks/useReportAction';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import StatusCard from '@/components/ui/StatusCard';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ReportActionModal from '@/components/reports/ReportActionModal';
import type { ReportListItem } from '@/types/report';
import type { TableColumn } from '@/components/ui/Table';

export default function DashboardPage() {
  const router = useRouter();

  // B-3: 통계 API 직접 호출
  const { data: stats, isLoading: isLoadingStats } = useReportStats();

  // 최근 PENDING 제보 5건
  const { data: pendingReports, isLoading: isLoadingPending } = useReports({
    page: 0,
    size: 5,
    status: 'PENDING',
  });

  const { modal, openModal, closeModal, handleConfirm, approvePending, rejectPending } =
    useReportAction();

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
              loading={approvePending && modal.reportId === row.id}
            >
              승인
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => openModal(e, 'reject', row.id)}
              loading={rejectPending && modal.reportId === row.id}
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

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="대시보드" subtitle="서비스 현황과 최근 제보를 확인하세요." />

      {/* 현황 요약 카드 — 통계 API 직접 사용 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard label="대기 중 제보" count={stats?.pending ?? 0} />
        <StatusCard label="승인된 화장실" count={stats?.active ?? 0} />
        <StatusCard label="거절된 제보" count={stats?.rejected ?? 0} />
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
            getRowKey={(row) => row.id}
          />
        )}
      </div>

      {/* 승인/거절 확인 모달 */}
      <ReportActionModal
        isOpen={modal.isOpen}
        type={modal.type}
        loading={approvePending || rejectPending}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

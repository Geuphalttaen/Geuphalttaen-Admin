'use client';

// 제보 상세 페이지 — 상세 정보 + 지도 좌표 + 승인/거절 처리

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReport, useApproveReport, useRejectReport } from '@/hooks/useReports';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 상세 정보 행 컴포넌트 */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <dt className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = use(params);
  const reportId = Number(id);
  const router = useRouter();

  const { data: report, isLoading } = useReport(reportId);
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
  }>({ isOpen: false, type: 'approve' });

  const handleConfirm = () => {
    if (modal.type === 'approve') {
      approveMutation.mutate(reportId, {
        onSuccess: () => {
          setModal({ isOpen: false, type: 'approve' });
        },
      });
    } else {
      rejectMutation.mutate(reportId, {
        onSuccess: () => {
          setModal({ isOpen: false, type: 'reject' });
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
        제보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          ← 목록으로
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">제보 상세</h2>
      </div>

      {/* 상세 정보 카드 */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{report.name}</h3>
          <Badge status={report.status} />
        </div>

        <dl className="divide-y divide-gray-100">
          <DetailRow label="제보 ID">#{report.id}</DetailRow>
          <DetailRow label="화장실명">{report.name}</DetailRow>
          <DetailRow label="주소">{report.address}</DetailRow>
          <DetailRow label="좌표">
            <span className="font-mono text-xs">
              위도: {report.latitude}, 경도: {report.longitude}
            </span>
            <a
              href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-blue-600 hover:underline text-xs"
            >
              지도에서 보기 ↗
            </a>
          </DetailRow>
          {report.description && (
            <DetailRow label="설명">{report.description}</DetailRow>
          )}
          <DetailRow label="제보자 ID">#{report.userId}</DetailRow>
          <DetailRow label="제보일시">
            {new Date(report.createdAt).toLocaleString('ko-KR')}
          </DetailRow>
          <DetailRow label="수정일시">
            {new Date(report.updatedAt).toLocaleString('ko-KR')}
          </DetailRow>
        </dl>
      </div>

      {/* 처리 버튼 (PENDING 상태일 때만 표시) */}
      {report.status === 'PENDING' && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setModal({ isOpen: true, type: 'approve' })}
            loading={approveMutation.isPending}
          >
            승인하기
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => setModal({ isOpen: true, type: 'reject' })}
            loading={rejectMutation.isPending}
          >
            거절하기
          </Button>
        </div>
      )}

      {/* 승인/거절 확인 모달 */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.type === 'approve' ? '제보 승인' : '제보 거절'}
        message={
          modal.type === 'approve'
            ? `"${report.name}" 제보를 승인하시겠습니까? 화장실이 서비스에 등록됩니다.`
            : `"${report.name}" 제보를 거절하시겠습니까? 이 작업은 취소할 수 없습니다.`
        }
        confirmLabel={modal.type === 'approve' ? '승인' : '거절'}
        confirmVariant={modal.type === 'approve' ? 'primary' : 'danger'}
        loading={approveMutation.isPending || rejectMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setModal({ isOpen: false, type: 'approve' })}
      />
    </div>
  );
}

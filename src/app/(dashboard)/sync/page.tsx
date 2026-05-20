'use client';

// 공공데이터 동기화 페이지 — 동기화 상태 카드 + 수동 트리거 버튼

import { useSyncStatus, useTriggerSync } from '@/hooks/useSync';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageHeader from '@/components/ui/PageHeader';
import type { SyncStatus } from '@/lib/api/sync';

/** 동기화 상태 배지 */
const syncStatusConfig: Record<
  SyncStatus['status'],
  { label: string; className: string }
> = {
  IDLE: { label: '대기', className: 'bg-gray-100 text-gray-700' },
  RUNNING: { label: '진행 중', className: 'bg-blue-100 text-blue-700' },
  SUCCESS: { label: '성공', className: 'bg-green-100 text-green-700' },
  FAILED: { label: '실패', className: 'bg-red-100 text-red-700' },
};

export default function SyncPage() {
  const { data: syncStatus, isLoading } = useSyncStatus();
  const triggerMutation = useTriggerSync();

  const statusConfig = syncStatus
    ? syncStatusConfig[syncStatus.status]
    : null;

  const handleTriggerSync = () => {
    triggerMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="공공데이터 동기화" subtitle="행정안전부 공공데이터와 화장실 정보를 동기화하세요." />

      {/* 동기화 상태 카드 */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          공공데이터 동기화 현황
        </h2>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <LoadingSpinner size="sm" />
            <span className="text-sm">상태를 불러오는 중...</span>
          </div>
        ) : syncStatus ? (
          <dl className="space-y-4">
            {/* 동기화 상태 */}
            <div className="flex items-center gap-3">
              <dt className="w-36 text-sm font-medium text-gray-500">동기화 상태</dt>
              <dd>
                {statusConfig && (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusConfig.className}`}
                  >
                    {syncStatus.status === 'RUNNING' && (
                      <LoadingSpinner size="sm" />
                    )}
                    {statusConfig.label}
                  </span>
                )}
              </dd>
            </div>

            {/* 마지막 동기화 시각 */}
            <div className="flex items-center gap-3">
              <dt className="w-36 text-sm font-medium text-gray-500">
                마지막 동기화
              </dt>
              <dd className="text-sm text-gray-900">
                {syncStatus.lastSyncAt
                  ? new Date(syncStatus.lastSyncAt).toLocaleString('ko-KR')
                  : '동기화 기록 없음'}
              </dd>
            </div>

            {/* 메시지 (있을 경우) */}
            {syncStatus.message && (
              <div className="flex items-start gap-3">
                <dt className="w-36 text-sm font-medium text-gray-500">메시지</dt>
                <dd className="text-sm text-gray-900">{syncStatus.message}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-gray-500">동기화 상태를 불러올 수 없습니다.</p>
        )}
      </div>

      {/* 수동 동기화 트리거 카드 */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          수동 동기화 실행
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          행정안전부 공공데이터 API와 화장실 데이터를 즉시 동기화합니다.
          동기화 중에는 버튼이 비활성화됩니다.
        </p>

        {/* 트리거 버튼 */}
        <Button
          variant="primary"
          size="md"
          onClick={handleTriggerSync}
          loading={triggerMutation.isPending}
          disabled={syncStatus?.status === 'RUNNING'}
        >
          {syncStatus?.status === 'RUNNING' ? '동기화 진행 중...' : '동기화 시작'}
        </Button>

        {/* 성공 메시지 */}
        {triggerMutation.isSuccess && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            동기화가 시작되었습니다. 완료까지 시간이 걸릴 수 있습니다.
          </p>
        )}

        {/* 오류 메시지 */}
        {triggerMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            동기화 요청에 실패했습니다. 다시 시도하세요.
          </p>
        )}
      </div>

      {/* 안내 */}
      <div className="bg-indigo-50 rounded-xl p-5 border-l-4 border-indigo-400 text-sm text-indigo-700">
        <p className="font-medium">동기화 안내</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>동기화는 30초마다 자동으로 상태가 갱신됩니다.</li>
          <li>대량의 데이터를 처리하므로 완료까지 수 분이 소요될 수 있습니다.</li>
          <li>동기화 중 기존 서비스 이용에는 영향이 없습니다.</li>
        </ul>
      </div>
    </div>
  );
}

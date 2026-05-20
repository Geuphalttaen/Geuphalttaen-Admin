'use client';

// 공공데이터 동기화 페이지 — 동기화 이력 테이블 + 수동 트리거 버튼

import { useSyncStatus, useTriggerSync } from '@/hooks/useSync';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageHeader from '@/components/ui/PageHeader';
import type { SyncResult } from '@/lib/api/sync';

const statusConfig: Record<
  SyncResult['status'],
  { label: string; className: string }
> = {
  RUNNING: { label: '진행 중', className: 'bg-gray-900 text-white' },
  SUCCESS: { label: '성공', className: 'bg-emerald-50 text-emerald-700' },
  FAILED: { label: '실패', className: 'bg-gray-100 text-gray-500' },
};

export default function SyncPage() {
  const { data: results, isLoading } = useSyncStatus();
  const triggerMutation = useTriggerSync();

  const latest = results?.[0];
  const isRunning = latest?.status === 'RUNNING';

  return (
    <div className="space-y-6">
      <PageHeader title="공공데이터 동기화" subtitle="행정안전부 공공데이터와 화장실 정보를 동기화하세요." />

      {/* 수동 동기화 트리거 카드 */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h2 className="mb-2 text-base font-semibold text-gray-900">수동 동기화 실행</h2>
        <p className="mb-4 text-sm text-gray-500">
          행정안전부 공공데이터 API와 화장실 데이터를 즉시 동기화합니다.
          동기화 중에는 버튼이 비활성화됩니다.
        </p>

        <Button
          variant="primary"
          size="md"
          onClick={() => triggerMutation.mutate()}
          loading={triggerMutation.isPending}
          disabled={isRunning}
        >
          {isRunning ? '동기화 진행 중...' : '동기화 시작'}
        </Button>

        {triggerMutation.isSuccess && (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            동기화가 시작되었습니다. 완료까지 시간이 걸릴 수 있습니다.
          </p>
        )}
        {triggerMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            동기화 요청에 실패했습니다. 다시 시도하세요.
          </p>
        )}
      </div>

      {/* 동기화 이력 */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">동기화 이력</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 px-6 py-8 text-gray-500">
            <LoadingSpinner size="sm" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        ) : !results || results.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500">동기화 이력이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
                <th className="px-6 py-3 text-left">시각</th>
                <th className="px-4 py-3 text-left">상태</th>
                <th className="px-4 py-3 text-right">조회</th>
                <th className="px-4 py-3 text-right">갱신</th>
                <th className="px-4 py-3 text-right">실패</th>
                <th className="px-6 py-3 text-left">메시지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r) => {
                const cfg = statusConfig[r.status];
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900 whitespace-nowrap">
                      {new Date(r.syncedAt).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
                        {r.status === 'RUNNING' && <LoadingSpinner size="sm" />}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.totalFetched.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.upsertedCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.failedCount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                      {r.errorMessage ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
        <p className="font-medium text-gray-700">동기화 안내</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>동기화는 30초마다 자동으로 상태가 갱신됩니다.</li>
          <li>대량의 데이터를 처리하므로 완료까지 수 분이 소요될 수 있습니다.</li>
          <li>동기화 중 기존 서비스 이용에는 영향이 없습니다.</li>
        </ul>
      </div>
    </div>
  );
}

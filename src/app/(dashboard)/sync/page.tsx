'use client';

// 공공데이터 동기화 페이지 — CSV 파일 업로드 + 동기화 이력 테이블

import { useRef } from 'react';
import { useSyncStatus, useUploadSync } from '@/hooks/useSync';
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
  PARTIAL: { label: '부분성공', className: 'bg-amber-50 text-amber-700' },
  FAILED: { label: '실패', className: 'bg-gray-100 text-gray-500' },
};

export default function SyncPage() {
  const { data: results, isLoading } = useSyncStatus();
  const uploadMutation = useUploadSync();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file, {
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="공공데이터 동기화" subtitle="행정안전부 공공데이터 CSV 파일을 업로드하여 화장실 정보를 동기화하세요." />

      {/* CSV 업로드 카드 */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h2 className="mb-2 text-base font-semibold text-gray-900">CSV 파일 업로드</h2>
        <p className="mb-4 text-sm text-gray-500">
          <a
            href="https://www.localdata.go.kr/datafile/each/07_04_02_P.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            공공데이터 포털
          </a>
          에서 다운받은 전국공중화장실표준데이터 CSV 파일을 선택하세요.
          업로드 후 바로 동기화가 실행되며 완료까지 수 분이 소요될 수 있습니다.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          variant="primary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          loading={uploadMutation.isPending}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? '동기화 중...' : 'CSV 파일 선택'}
        </Button>

        {uploadMutation.isSuccess && (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            동기화 완료. 아래 이력을 확인하세요.
          </p>
        )}
        {uploadMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            동기화 실패. 파일 형식을 확인하거나 다시 시도하세요.
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
                <th className="px-4 py-3 text-right">생성</th>
                <th className="px-4 py-3 text-right">수정</th>
                <th className="px-4 py-3 text-right">삭제</th>
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
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.insertedCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.updatedCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.deletedCount.toLocaleString()}</td>
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
          <li>공공데이터 포털에서 전국공중화장실표준데이터(EUC-KR) CSV를 다운받아 업로드하세요.</li>
          <li>대량의 데이터를 처리하므로 완료까지 수 분이 소요될 수 있습니다.</li>
          <li>동기화 중 기존 서비스 이용에는 영향이 없습니다.</li>
        </ul>
      </div>
    </div>
  );
}

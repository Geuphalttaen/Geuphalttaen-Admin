'use client';

// 화장실 목록 페이지 — 키워드 검색 + 페이지네이션 + 삭제

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToilets, useDeleteToilet } from '@/hooks/useToilets';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import DataTableSection from '@/components/ui/DataTableSection';
import Modal from '@/components/ui/Modal';
import type { Toilet } from '@/types/toilet';
import type { TableColumn } from '@/components/ui/Table';

const PAGE_SIZE = 10;

export default function ToiletsPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // 삭제 모달 상태
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    toiletId: number | null;
    toiletName: string;
  }>({ isOpen: false, toiletId: null, toiletName: '' });

  const { data, isLoading } = useToilets({
    page: currentPage,
    size: PAGE_SIZE,
    keyword: keyword || undefined,
  });

  const deleteMutation = useDeleteToilet();

  /** 검색 실행 */
  const handleSearch = useCallback(() => {
    setKeyword(searchInput);
    setCurrentPage(0);
  }, [searchInput]);

  /** 검색 초기화 */
  const handleReset = () => {
    setSearchInput('');
    setKeyword('');
    setCurrentPage(0);
  };

  /** 삭제 확인 */
  const handleDeleteConfirm = () => {
    if (!deleteModal.toiletId) return;
    deleteMutation.mutate(deleteModal.toiletId, {
      onSuccess: () =>
        setDeleteModal({ isOpen: false, toiletId: null, toiletName: '' }),
    });
  };

  /** 테이블 컬럼 정의 */
  const columns: TableColumn<Toilet>[] = [
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
      key: 'source',
      header: '출처',
      render: (row) => (
        <span className="text-xs text-gray-500">{row.source ?? '-'}</span>
      ),
      className: 'w-28',
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => <Badge status={row.status} />,
      className: 'w-24',
    },
    {
      key: 'actions',
      header: '관리',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/toilets/${row.id}`);
            }}
          >
            수정
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({
                isOpen: true,
                toiletId: row.id,
                toiletName: row.name,
              });
            }}
          >
            삭제
          </Button>
        </div>
      ),
      className: 'w-36',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 검색 바 */}
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        onReset={handleReset}
        placeholder="화장실명 또는 주소로 검색"
        showReset={!!keyword}
      />

      {/* 검색 결과 안내 */}
      {keyword && (
        <p className="text-sm text-gray-500">
          &quot;{keyword}&quot; 검색 결과: {data?.totalElements ?? 0}건
        </p>
      )}

      {/* 테이블 + 페이지네이션 */}
      <DataTableSection
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowClick={(row) => router.push(`/toilets/${row.id}`)}
        getRowKey={(row) => row.id}
        emptyMessage="화장실이 없습니다."
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="화장실 삭제"
        message={`"${deleteModal.toiletName}"을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
        confirmLabel="삭제"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteModal({ isOpen: false, toiletId: null, toiletName: '' })
        }
      />
    </div>
  );
}

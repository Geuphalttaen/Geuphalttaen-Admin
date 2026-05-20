// 테이블 + 페이지네이션 + 총 건수 패턴을 묶은 범용 컴포넌트

import Table, { type TableColumn } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DataTableSectionProps<T> {
  /** 테이블 컬럼 정의 */
  columns: TableColumn<T>[];
  /** 테이블 데이터 */
  data: T[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 전체 데이터 건수 */
  totalElements: number;
  /** 현재 페이지 (0-indexed) */
  currentPage: number;
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void;
  /** 행 클릭 핸들러 (선택) */
  onRowClick?: (row: T) => void;
  /** 행 고유 키 추출 함수 (선택) */
  getRowKey?: (row: T) => string | number;
  /** 빈 데이터일 때 표시할 메시지 (선택) */
  emptyMessage?: string;
}

export default function DataTableSection<T>({
  columns,
  data,
  isLoading,
  totalPages,
  totalElements,
  currentPage,
  onPageChange,
  onRowClick,
  getRowKey,
  emptyMessage,
}: DataTableSectionProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        data={data}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
        getRowKey={getRowKey}
      />

      {/* 페이지네이션 */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {/* 총 건수 */}
      <p className="text-center text-sm text-gray-500">총 {totalElements}건</p>
    </>
  );
}

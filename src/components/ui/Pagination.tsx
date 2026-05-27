'use client';

// 페이지네이션 컴포넌트

interface PaginationProps {
  /** 현재 페이지 (0-indexed) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 배열 계산 (최대 5개)
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="이전 페이지"
      >
        ‹ 이전
      </button>

      {/* 첫 페이지 및 생략 기호 */}
      {pageNumbers[0] > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            1
          </button>
          {pageNumbers[0] > 1 && (
            <span className="px-2 text-gray-400">…</span>
          )}
        </>
      )}

      {/* 페이지 번호 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={[
            'rounded-md px-3 py-2 text-sm font-medium',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100',
          ].join(' ')}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page + 1}
        </button>
      ))}

      {/* 마지막 페이지 및 생략 기호 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
            <span className="px-2 text-gray-400">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="다음 페이지"
      >
        다음 ›
      </button>
    </nav>
  );
}

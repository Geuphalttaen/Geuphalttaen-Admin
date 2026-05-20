// 범용 테이블 컴포넌트

import React from 'react';

/** 테이블 컬럼 설정 */
export interface TableColumn<T> {
  /** 헤더 텍스트 */
  header: string;
  /** 키 (고유 식별자용) */
  key: string;
  /** 셀 렌더 함수 */
  render: (row: T) => React.ReactNode;
  /** 열 너비 클래스 (선택) */
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** 빈 데이터일 때 표시할 메시지 */
  emptyMessage?: string;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: T) => void;
  /** I-4: 행 고유 키 추출 함수 — 배열 인덱스 대신 아이템 id 사용 */
  getRowKey?: (row: T) => string | number;
}

export default function Table<T>({
  columns,
  data,
  emptyMessage = '데이터가 없습니다.',
  onRowClick,
  getRowKey,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-14 text-center"
              >
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-sm">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey ? getRowKey(row) : rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-gray-100 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-4 text-sm text-gray-900 ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

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
}

export default function Table<T>({
  columns,
  data,
  emptyMessage = '데이터가 없습니다.',
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${col.className ?? ''}`}
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

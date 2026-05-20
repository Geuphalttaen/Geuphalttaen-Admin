'use client';

// 검색 입력 + 검색/초기화 버튼 컴포넌트

import Button from '@/components/ui/Button';

interface SearchBarProps {
  /** 현재 입력값 */
  value: string;
  /** 입력값 변경 핸들러 */
  onChange: (v: string) => void;
  /** 검색 실행 핸들러 */
  onSearch: () => void;
  /** 초기화 핸들러 (선택) */
  onReset?: () => void;
  /** 입력 placeholder */
  placeholder?: string;
  /** 초기화 버튼 표시 여부 */
  showReset?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onReset,
  placeholder = '검색',
  showReset = false,
}: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <Button variant="primary" size="md" onClick={onSearch}>
        검색
      </Button>
      {showReset && onReset && (
        <Button variant="secondary" size="md" onClick={onReset}>
          초기화
        </Button>
      )}
    </div>
  );
}

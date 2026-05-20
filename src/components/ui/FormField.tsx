// 폼 입력 필드 래퍼 컴포넌트

import { type ReactNode } from 'react';

interface FormFieldProps {
  /** 필드 레이블 텍스트 */
  label: string;
  /** label htmlFor 연결을 위한 id */
  id?: string;
  /** 검증 오류 메시지 */
  error?: string;
  children: ReactNode;
}

export default function FormField({ label, id, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

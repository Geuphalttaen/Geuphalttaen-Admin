// 현황 요약 카드 컴포넌트 — 토스 스타일: 모노크롬, 액센트 바 없음

interface StatusCardProps {
  /** 카드 레이블 */
  label: string;
  /** 표시할 숫자 */
  count: number;
}

export default function StatusCard({ label, count }: StatusCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}

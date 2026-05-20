// 현황 요약 카드 컴포넌트

interface StatusCardProps {
  /** 카드 레이블 */
  label: string;
  /** 표시할 숫자 */
  count: number;
  /** 숫자에 적용할 색상 클래스 */
  colorClass: string;
}

export default function StatusCard({ label, count, colorClass }: StatusCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorClass}`}>{count}</p>
    </div>
  );
}

// 현황 요약 카드 컴포넌트

interface StatusCardProps {
  /** 카드 레이블 */
  label: string;
  /** 표시할 숫자 */
  count: number;
  /** 숫자에 적용할 색상 클래스 */
  colorClass: string;
  /** 왼쪽 액센트 바 색상 클래스 (예: 'bg-yellow-400') */
  accent: string;
}

export default function StatusCard({ label, count, colorClass, accent }: StatusCardProps) {
  return (
    <div className="flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className={`w-1 flex-shrink-0 ${accent}`} />
      <div className="flex flex-col justify-between p-5 flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{count}</p>
      </div>
    </div>
  );
}

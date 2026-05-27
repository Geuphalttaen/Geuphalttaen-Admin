'use client';

// 제보 승인/거절 확인 모달 컴포넌트

import Modal from '@/components/ui/Modal';

interface ReportActionModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 처리 타입: 승인 또는 거절 */
  type: 'approve' | 'reject';
  /** 로딩 상태 */
  loading: boolean;
  /** 확인 콜백 */
  onConfirm: () => void;
  /** 취소 콜백 */
  onCancel: () => void;
}

const APPROVE_MESSAGE = '이 제보를 승인하시겠습니까? 화장실이 서비스에 등록됩니다.';
const REJECT_MESSAGE = '이 제보를 거절하시겠습니까? 취소할 수 없습니다.';

export default function ReportActionModal({
  isOpen,
  type,
  loading,
  onConfirm,
  onCancel,
}: ReportActionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={type === 'approve' ? '제보 승인' : '제보 거절'}
      message={type === 'approve' ? APPROVE_MESSAGE : REJECT_MESSAGE}
      confirmLabel={type === 'approve' ? '승인' : '거절'}
      confirmVariant={type === 'approve' ? 'primary' : 'danger'}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

'use client';

// 제보 승인/거절 모달 상태 + 뮤테이션 로직을 공유하는 훅

import { useState } from 'react';
import { useApproveReport, useRejectReport } from '@/hooks/useReports';

interface ModalState {
  isOpen: boolean;
  type: 'approve' | 'reject';
  reportId: number | null;
}

const INITIAL_MODAL: ModalState = { isOpen: false, type: 'approve', reportId: null };

export function useReportAction() {
  const [modal, setModal] = useState<ModalState>(INITIAL_MODAL);

  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  /** 승인/거절 모달 열기 */
  const openModal = (
    e: React.MouseEvent,
    type: 'approve' | 'reject',
    reportId: number
  ) => {
    e.stopPropagation();
    setModal({ isOpen: true, type, reportId });
  };

  /** 모달 닫기 */
  const closeModal = () => setModal(INITIAL_MODAL);

  /** 모달 확인 처리 */
  const handleConfirm = () => {
    if (!modal.reportId) return;
    if (modal.type === 'approve') {
      approveMutation.mutate(modal.reportId, {
        onSuccess: () => setModal({ isOpen: false, type: 'approve', reportId: null }),
      });
    } else {
      rejectMutation.mutate(modal.reportId, {
        onSuccess: () => setModal({ isOpen: false, type: 'reject', reportId: null }),
      });
    }
  };

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  return {
    modal,
    openModal,
    closeModal,
    handleConfirm,
    isPending,
    approvePending: approveMutation.isPending,
    rejectPending: rejectMutation.isPending,
  };
}

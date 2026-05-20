// Axios 인스턴스 설정 — Next.js 프록시 경유, 401 처리
// 브라우저 → Next.js /api/v1/admin/* → 백엔드 (프록시가 httpOnly 쿠키 → Authorization 헤더 변환)

import axios from 'axios';

const apiClient = axios.create({
  // 빈 베이스URL → 브라우저가 Next.js 서버(동일 오리진) /api/v1/admin/* 로 요청
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터: 401 응답 시 서버 에러 메시지 추출 후 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // I-5: 서버 에러 메시지 추출
    const serverMessage = error.response?.data?.error?.message;
    if (serverMessage) {
      error.message = serverMessage;
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

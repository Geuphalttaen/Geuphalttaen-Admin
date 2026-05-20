// Axios 인스턴스 설정 — httpOnly 쿠키 자동 전송 및 401 처리

import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // httpOnly 쿠키를 요청마다 자동으로 전송
  withCredentials: true,
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

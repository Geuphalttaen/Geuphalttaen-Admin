// Axios 인스턴스 설정 — Authorization 헤더 자동 주입 및 401 처리

import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN_KEY } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 로컬스토리지 토큰을 Authorization 헤더에 자동 주입
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터: 401 응답 시 토큰 제거 후 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

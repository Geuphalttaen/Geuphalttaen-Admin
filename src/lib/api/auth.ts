// 인증 관련 API 함수

import apiClient from './client';

/** 관리자 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
}

/**
 * 관리자 로그인
 * @param email 이메일
 * @param password 비밀번호
 * @returns accessToken
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/v1/admin/auth/login',
    { email, password }
  );
  return response.data;
}

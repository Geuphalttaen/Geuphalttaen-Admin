// 로그인 API 라우트 — 백엔드 인증 후 httpOnly 쿠키 발급

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  // 백엔드 로그인 API 호출
  const res = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, message: errorData?.error?.message ?? '로그인에 실패했습니다.' },
      { status: res.status }
    );
  }

  const data = (await res.json()) as { accessToken: string };

  // httpOnly 쿠키로 토큰 발급
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `access_token=${data.accessToken}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=3600',
    ...(isProduction ? ['Secure'] : []),
  ].join('; ');

  const response = NextResponse.json({ ok: true });
  response.headers.set('Set-Cookie', cookieOptions);
  return response;
}

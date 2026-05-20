// 로그인 API 라우트 — 백엔드 인증 후 httpOnly 쿠키 발급

import { NextRequest, NextResponse } from 'next/server';

// B-5: 서버 전용 환경변수 사용 — NEXT_PUBLIC_ 변수는 클라이언트 번들에 노출되므로 사용 금지
const BACKEND_URL =
  process.env.BACKEND_URL ?? 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  // 백엔드 로그인 API 호출
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: '백엔드 서버에 연결할 수 없습니다.' },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, message: errorData?.error?.message ?? '로그인에 실패했습니다.' },
      { status: res.status }
    );
  }

  // 백엔드는 ApiResponse<AdminTokenResponse> 구조: { success, data: { accessToken } }
  const resData = (await res.json()) as { data: { accessToken: string } };
  const accessToken = resData.data.accessToken;

  // httpOnly 쿠키로 토큰 발급
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `access_token=${accessToken}`,
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

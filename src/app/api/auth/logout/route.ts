// 로그아웃 API 라우트 — httpOnly 쿠키 제거

import { NextResponse } from 'next/server';

export async function POST() {
  // Max-Age=0 으로 쿠키 즉시 만료
  const response = NextResponse.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    'access_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
  );
  return response;
}

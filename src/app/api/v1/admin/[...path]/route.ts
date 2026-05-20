// Admin API 프록시 라우트 — httpOnly 쿠키에서 토큰을 읽어 백엔드로 전달
// 브라우저 → Next.js 프록시 → 백엔드 패턴으로 XSS 위험 없이 인증 처리

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

async function proxy(request: NextRequest, path: string[]): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // B-4: 토큰 없으면 백엔드 호출 없이 즉시 401 반환
  if (!token) {
    return NextResponse.json({ ok: false, message: '인증이 필요합니다.' }, { status: 401 });
  }

  const targetPath = `/api/v1/admin/${path.join('/')}`;
  const url = new URL(targetPath, BACKEND_URL);

  // 쿼리 파라미터 그대로 전달
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  const method = request.method;
  if (!['GET', 'HEAD'].includes(method)) {
    body = await request.text();
  }

  const res = await fetch(url.toString(), { method, headers, body });

  const responseText = await res.text();
  return new NextResponse(responseText || null, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return proxy(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return proxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  return proxy(request, path);
}

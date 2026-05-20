'use client';

// 관리자 로그인 페이지 — 스플릿 레이아웃 (브랜드 패널 + 폼 패널)

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력하세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력하세요.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽: 브랜드 패널 */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#0d0d0d] relative overflow-hidden px-16">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1a6dff] opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a6dff] opacity-5 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <Image
            src="/icon.png"
            alt="급할땐 아이콘"
            width={120}
            height={120}
            className="rounded-3xl shadow-2xl"
          />
          <div className="text-center">
            <h1 className="text-5xl font-black text-white tracking-tight">급할땐</h1>
            <p className="mt-3 text-lg text-gray-400 leading-relaxed">
              가장 가까운 화장실을<br />빠르게 찾아드립니다
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-[#1a6dff]" />
            <span className="text-xs text-gray-600 tracking-widest uppercase">Admin Console</span>
          </div>
        </div>
      </div>

      {/* 오른쪽: 폼 패널 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-8 py-16">
        <div className="w-full max-w-sm">
          {/* 모바일 로고 (lg 미만) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image src="/icon.png" alt="급할땐 로고" width={36} height={36} className="rounded-xl" />
            <span className="text-xl font-bold text-gray-900">급할땐 <span className="text-[#1a6dff]">Admin</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            <p className="mt-1 text-sm text-gray-500">관리자 계정으로 계속하세요.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@geuphalttaen.com"
                {...register('email')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#1a6dff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a6dff]/20"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#1a6dff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a6dff]/20"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {loginMutation.isError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                이메일 또는 비밀번호가 올바르지 않습니다.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loginMutation.isPending}
              className="w-full"
            >
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

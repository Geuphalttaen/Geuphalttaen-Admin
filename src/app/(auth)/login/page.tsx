'use client';

// 관리자 로그인 페이지

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

/** 로그인 폼 유효성 검사 스키마 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력하세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력하세요.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl border border-gray-100">
        {/* 로고 헤더 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/icon.png" alt="급할땐 로고" width={56} height={56} className="rounded-2xl" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              급할땐 <span className="text-indigo-600">Admin</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500 text-center">관리자 계정으로 로그인하세요.</p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 이메일 필드 */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register('email')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 필드 */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* API 오류 메시지 */}
          {loginMutation.isError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.
            </p>
          )}

          {/* 로그인 버튼 */}
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
  );
}

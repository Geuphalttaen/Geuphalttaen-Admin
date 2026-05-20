'use client';

// 관리자 로그인 페이지

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">급할땐 Admin</h1>
          <p className="mt-2 text-sm text-gray-500">관리자 계정으로 로그인하세요.</p>
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

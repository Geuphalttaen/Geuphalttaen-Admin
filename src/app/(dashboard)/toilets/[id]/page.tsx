'use client';

// 화장실 상세 + 인라인 수정 페이지

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToilet, useUpdateToilet } from '@/hooks/useToilets';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ToiletDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 화장실 수정 폼 스키마
 * I-2: 위경도는 z.coerce.number()로 HTML string input을 숫자로 자동 변환
 * (react-hook-form의 valueAsNumber 옵션과 함께 사용)
 */
const updateToiletSchema = z.object({
  name: z.string().min(1, '화장실명을 입력하세요.'),
  address: z.string().min(1, '주소를 입력하세요.'),
  /** I-2: z.number() + register({ valueAsNumber: true }) 로 string → number 변환 */
  latitude: z.number({ error: '숫자를 입력하세요.' }),
  /** I-2: z.number() + register({ valueAsNumber: true }) 로 string → number 변환 */
  longitude: z.number({ error: '숫자를 입력하세요.' }),
  description: z.string().optional(),
  weekdayHours: z.string().optional(),
  weekendHours: z.string().optional(),
  holidayHours: z.string().optional(),
});

type UpdateToiletFormValues = z.infer<typeof updateToiletSchema>;

/** 폼 입력 필드 컴포넌트 */
function FormField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  /** I-7: label htmlFor 연결을 위한 id */
  id?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ToiletDetailPage({ params }: ToiletDetailPageProps) {
  const { id } = use(params);
  const toiletId = Number(id);
  const router = useRouter();

  const { data: toilet, isLoading } = useToilet(toiletId);
  const updateMutation = useUpdateToilet();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateToiletFormValues>({
    resolver: zodResolver(updateToiletSchema),
  });

  // 데이터 로드 후 폼 초기값 설정
  useEffect(() => {
    if (toilet) {
      reset({
        name: toilet.name,
        address: toilet.address,
        latitude: toilet.latitude,
        longitude: toilet.longitude,
        description: toilet.description ?? '',
        weekdayHours: toilet.operatingHours?.weekday ?? '',
        weekendHours: toilet.operatingHours?.weekend ?? '',
        holidayHours: toilet.operatingHours?.holiday ?? '',
      });
    }
  }, [toilet, reset]);

  /** 폼 제출 처리 — z.coerce.number()로 위경도는 이미 number */
  const onSubmit = (values: UpdateToiletFormValues) => {
    updateMutation.mutate(
      {
        id: toiletId,
        data: {
          name: values.name,
          address: values.address,
          latitude: values.latitude,
          longitude: values.longitude,
          description: values.description || undefined,
          operatingHours: {
            weekday: values.weekdayHours || undefined,
            weekend: values.weekendHours || undefined,
            holiday: values.holidayHours || undefined,
          },
        },
      },
      {
        onSuccess: () => {
          alert('화장실 정보가 수정되었습니다.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!toilet) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
        화장실을 찾을 수 없습니다.
      </div>
    );
  }

  const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          ← 목록으로
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{toilet.name}</h2>
          <Badge status={toilet.status} />
        </div>
      </div>

      {/* 수정 폼 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
      >
        <h3 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">
          기본 정보
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* I-7: label htmlFor 연결 */}
          <FormField id="name" label="화장실명" error={errors.name?.message}>
            <input id="name" {...register('name')} className={inputClass} />
          </FormField>

          <FormField id="address" label="주소" error={errors.address?.message}>
            <input id="address" {...register('address')} className={inputClass} />
          </FormField>

          {/* I-2: valueAsNumber로 HTML input string → number 자동 변환 */}
          <FormField id="latitude" label="위도" error={errors.latitude?.message}>
            <input
              id="latitude"
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              className={inputClass}
            />
          </FormField>

          <FormField id="longitude" label="경도" error={errors.longitude?.message}>
            <input
              id="longitude"
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              className={inputClass}
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField id="description" label="설명 (선택)" error={errors.description?.message}>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className={inputClass}
              />
            </FormField>
          </div>
        </div>

        {/* 운영 시간 */}
        <h3 className="mb-4 mt-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">
          운영 시간 (선택)
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField id="weekdayHours" label="평일">
            <input
              id="weekdayHours"
              {...register('weekdayHours')}
              placeholder="예: 09:00~18:00"
              className={inputClass}
            />
          </FormField>
          <FormField id="weekendHours" label="주말">
            <input
              id="weekendHours"
              {...register('weekendHours')}
              placeholder="예: 10:00~17:00"
              className={inputClass}
            />
          </FormField>
          <FormField id="holidayHours" label="공휴일">
            <input
              id="holidayHours"
              {...register('holidayHours')}
              placeholder="예: 휴무"
              className={inputClass}
            />
          </FormField>
        </div>

        {/* 메타 정보 */}
        <div className="mt-6 rounded-md bg-gray-50 p-4 text-xs text-gray-500">
          <p>등록일시: {new Date(toilet.createdAt).toLocaleString('ko-KR')}</p>
          <p>수정일시: {new Date(toilet.updatedAt).toLocaleString('ko-KR')}</p>
          {toilet.source && <p>출처: {toilet.source}</p>}
        </div>

        {/* 저장 버튼 */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => reset()}
            disabled={!isDirty}
          >
            초기화
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={updateMutation.isPending}
            disabled={!isDirty}
          >
            저장하기
          </Button>
        </div>

        {/* 저장 오류 메시지 */}
        {updateMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            저장에 실패했습니다. 다시 시도하세요.
          </p>
        )}
      </form>
    </div>
  );
}

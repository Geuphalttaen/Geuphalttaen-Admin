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
import FormField from '@/components/ui/FormField';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ToiletDetailPageProps {
  params: Promise<{ id: string }>;
}

const updateToiletSchema = z.object({
  name: z.string().min(1, '화장실명을 입력하세요.'),
  address: z.string().min(1, '주소를 입력하세요.'),
  lat: z.number({ error: '숫자를 입력하세요.' }),
  lng: z.number({ error: '숫자를 입력하세요.' }),
  isPublic: z.boolean(),
  male: z.boolean(),
  female: z.boolean(),
  disabled: z.boolean(),
  familyRoom: z.boolean(),
});

type UpdateToiletFormValues = z.infer<typeof updateToiletSchema>;

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

  useEffect(() => {
    if (toilet) {
      reset({
        name: toilet.name,
        address: toilet.address,
        lat: toilet.lat,
        lng: toilet.lng,
        isPublic: toilet.isPublic,
        male: toilet.male,
        female: toilet.female,
        disabled: toilet.disabled,
        familyRoom: toilet.familyRoom,
      });
    }
  }, [toilet, reset]);

  const onSubmit = (values: UpdateToiletFormValues) => {
    updateMutation.mutate(
      { id: toiletId, data: values },
      { onSuccess: () => reset(values) },
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
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          ← 목록으로
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{toilet.name}</h2>
          <Badge status={toilet.status} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
      >
        <h3 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">
          기본 정보
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="name" label="화장실명" error={errors.name?.message}>
            <input id="name" {...register('name')} className={inputClass} />
          </FormField>

          <div className="sm:col-span-2">
            <FormField id="address" label="주소" error={errors.address?.message}>
              <input id="address" {...register('address')} className={inputClass} />
            </FormField>
          </div>

          <FormField id="lat" label="위도" error={errors.lat?.message}>
            <input
              id="lat"
              type="number"
              step="any"
              {...register('lat', { valueAsNumber: true })}
              className={inputClass}
            />
          </FormField>

          <FormField id="lng" label="경도" error={errors.lng?.message}>
            <input
              id="lng"
              type="number"
              step="any"
              {...register('lng', { valueAsNumber: true })}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* 시설 정보 */}
        <h3 className="mb-4 mt-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">
          시설 정보
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              { id: 'isPublic', label: '공용 화장실' },
              { id: 'male', label: '남성용' },
              { id: 'female', label: '여성용' },
              { id: 'disabled', label: '장애인용' },
              { id: 'familyRoom', label: '가족화장실' },
            ] as const
          ).map(({ id, label }) => (
            <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id={id}
                type="checkbox"
                {...register(id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {/* 메타 정보 */}
        <div className="mt-6 rounded-md bg-gray-50 p-4 text-xs text-gray-500 space-y-1">
          <p>등록일시: {new Date(toilet.createdAt).toLocaleString('ko-KR')}</p>
          <p>수정일시: {new Date(toilet.updatedAt).toLocaleString('ko-KR')}</p>
          {toilet.reportedBy && <p>제보자 ID: {toilet.reportedBy}</p>}
        </div>

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

        {updateMutation.isSuccess && (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            화장실 정보가 수정되었습니다.
          </p>
        )}
        {updateMutation.isError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            저장에 실패했습니다. 다시 시도하세요.
          </p>
        )}
      </form>

      {/* 첨부 사진 갤러리 (읽기 전용) */}
      {toilet.imageUrls.length > 0 && (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
          <h3 className="mb-4 font-semibold text-gray-900">
            첨부 사진 ({toilet.imageUrls.length}장)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {toilet.imageUrls.map((url, index) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg ring-1 ring-gray-200 hover:ring-indigo-400 transition-all"
              >
                <img
                  src={url}
                  alt={`화장실 사진 ${index + 1}`}
                  className="h-40 w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchemaType } from '@/schemas/auth';

export function useLogin() {
  const [globalError, setGlobalError] = useState('');
  const router = useRouter();
  const { status } = useSession();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onFormSubmit = async (data: LoginSchemaType) => {
    setGlobalError('');
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.error) {
      setGlobalError(result.error);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const submitHandler = handleSubmit(onFormSubmit);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return { globalError, register, errors, isSubmitting, submitHandler, status };
}
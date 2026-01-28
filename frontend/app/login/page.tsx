// frontend/app/login/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchemaType } from '@/schemas/auth';

export default function LoginPage() {
  const [globalError, setGlobalError] = useState('');
  const router = useRouter();
  const { status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setGlobalError('');

    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.error){
      setGlobalError(result.error);
    } else {
      console.log('Login exitoso');
      router.push('/dashboard');
      router.refresh();
    }
  };

  useEffect(() => {
    if (status === 'authenticated'){
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Iniciar Sesión
        </h2>

        {globalError && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-2 bg-gray-700 border rounded focus:outline-none text-white transition-colors
                ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'}
              `}
              placeholder="tu@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-2 bg-gray-700 border rounded focus:outline-none text-white transition-colors
                ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'}
              `}  
              placeholder="••••••"
              required
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
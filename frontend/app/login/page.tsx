'use client';

import { useLogin } from '@/hooks/useLogin';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const { globalError, register, errors, isSubmitting, submitHandler, status } = useLogin();

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4 md:p-6">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Bienvenido
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Ingresa tus credenciales para continuar
        </p>
        {globalError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            {globalError}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white transition-all
                ${errors.email
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
              `}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white transition-all
                ${errors.password
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
              `}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
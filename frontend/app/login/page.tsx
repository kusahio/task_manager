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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4 md:p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800/80 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">TaskFlow</h2>
            <p className="text-gray-500 text-xs">Inicia sesión para continuar</p>
          </div>
        </div>

        {globalError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {globalError}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white transition-all text-sm
                ${errors.email
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'}
              `}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contraseña</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white transition-all text-sm
                ${errors.password
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'}
              `}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
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
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

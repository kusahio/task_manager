'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SessionExpired(){
  useEffect(() => {signOut({callbackUrl: '/login'})}, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Sesión Expirada</h2>
        <p className="text-gray-400">Redirigiendo al login...</p>
      </div>
    </div>
  )
}
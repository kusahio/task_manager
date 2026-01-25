'use client';

import { signOut } from "next-auth/react";

export default function LogoutButton(){
  return (
    <button
    onClick={() => signOut({callbackUrl: '/login'})}
    className='text-sm text-red-400 hover:text-red-300 w-full text-left transition-colors cursor-pointer'>
      Cerrar Sessión
    </button>
  )
}
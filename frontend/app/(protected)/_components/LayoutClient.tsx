'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);


const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface Props{
  children: React.ReactNode;
  userEmail?: string | null;
}

export default function LayoutClient({ children, userEmail} : Props){
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
  const pathName = usePathname();

  const navItems = [
    {href: '/dashboard', label: 'Dashboard'},
    {href: '/tasks', label: 'Mis tareas'},
    {href: '/tags', label: 'Etiquetas'}
  ];

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 flex flex-col lg:flex-row'>
      <div className='lg:hidden bg-gray-800 p-4 flex intems-center justify-between border-b border-gray-700 sticky top-0 z-30'>
        <h1 className='font-bold text-xl text-blue-400'>Task Manager</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <MenuIcon />
        </button>
      </div>
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 flex flex-col
      `}>
        <div className='p-6 border-b border-gray-700 flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-blue-400'>Task Manager App</h2>
          <button onClick={() => setIsSidebarOpen(true)} className='lg:hidden text-gray-400 hover:text-white'>
            <CloseIcon />
          </button>
        </div>
        <nav className='felx-1 p-4 space-y-2 overflow-y-auto'>
          {navItems.map(item => {
            const isActive = pathName == item.href;

            return (
              <Link
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className='p-4 border-t border-gray-700 bg-gray-800/50'>
          <p className='text-sm font-medium text-gray-400 truncate mb-3 px-2' title={userEmail || ''}>
            {userEmail}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className='flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100dvw]'>
        {children}
      </main>
    </div>
  )
}
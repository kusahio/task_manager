'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

interface NavItem { href: string; label: string; }

interface SidebarProps {
  navItems: NavItem[];
  userEmail?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ navItems, userEmail, isOpen, onClose }: Readonly<SidebarProps>) {
  const pathName = usePathname();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 flex flex-col
    `}>
      <div className='p-6 border-b border-gray-700 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-blue-400'>Task Manager App</h2>
        <button onClick={onClose} className='lg:hidden text-gray-400 hover:text-white'>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {navItems.map(item => {
          const isActive = pathName === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className='p-4 border-t border-gray-700 bg-gray-800/50'>
        <p className='text-sm font-medium text-gray-400 truncate mb-3 px-2' title={userEmail || ''}>
          {userEmail}
        </p>
        <LogoutButton />
      </div>
    </aside>
  );
}
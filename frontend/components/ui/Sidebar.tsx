'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

interface NavItem { href: string; label: string; icon?: React.ReactNode; }

interface SidebarProps {
  navItems?: NavItem[];
  userEmail?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const iconClasses = 'w-5 h-5 shrink-0';

const defaultNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/tasks',
    label: 'Mis tareas',
    icon: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/tags',
    label: 'Etiquetas',
    icon: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
];

export default function Sidebar({ navItems = defaultNavItems, userEmail, isOpen, onClose }: Readonly<SidebarProps>) {
  const pathName = usePathname();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-gray-800/95 backdrop-blur-md border-r border-gray-700/60 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 flex flex-col
    `}>
      <div className='p-6 border-b border-gray-700/60 flex items-center justify-between'>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className='text-xl font-bold text-white'>TaskFlow</span>
        </Link>
        <button onClick={onClose} className='lg:hidden text-gray-400 hover:text-white transition-colors'>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
        {navItems.map(item => {
          const isActive = pathName === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-gray-700/60 bg-gray-800/30'>
        <div className='flex items-center gap-3 px-2 mb-3'>
          <div className='w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white'>
            {userEmail?.charAt(0).toUpperCase() || '?'}
          </div>
          <p className='text-sm text-gray-400 truncate flex-1' title={userEmail || ''}>
            {userEmail}
          </p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

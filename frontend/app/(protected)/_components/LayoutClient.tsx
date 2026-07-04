'use client';

import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import MobileHeader from '@/components/ui/MobileHeader';
import SidebarOverlay from '@/components/ui/SidebarOverlay';

interface Props {
  children: React.ReactNode;
  userEmail?: string | null;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks', label: 'Mis tareas' },
  { href: '/tags', label: 'Etiquetas' },
];

export default function LayoutClient({ children, userEmail }: Readonly<Props>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 flex flex-col lg:flex-row'>
      <MobileHeader onMenuOpen={() => setIsSidebarOpen(true)} />
      <Sidebar
        navItems={navItems}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <SidebarOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className='flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-dvw'>
        {children}
      </main>
    </div>
  );
}
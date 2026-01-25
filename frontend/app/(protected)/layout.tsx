import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LogoutButton from '@/components/LogoutButton';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      <aside className='w-64 bg-gray-800 border-r border-gray-700 flex flex-col'>
        <div className='p-6 border-b border-gray-700'>
          <h2 className='text-2xl font-bold text-blue-400'>
            Task Manager App
          </h2>
        </div>

        <nav className='flex-1 p-4 space-y-2'>
          <Link href={'/dashboard'} className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors'>
            Dashboard
          </Link>
          <Link href={'/tasks'} className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors'>
            Mis Tareas
          </Link>
          <Link href="/tags" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
            Etiquetas
          </Link>
        </nav>

        <div className='p-4 border-t border-gray-700'>
          <p className='text-sm font-medium truncate mb-2'>
            {session.user?.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      <main className='flex-1 overflow-y-auto p-8'>
        {children}
      </main>
    </div>
  )
}
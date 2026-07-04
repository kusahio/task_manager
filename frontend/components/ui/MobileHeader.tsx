'use client';

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export default function MobileHeader({ onMenuOpen }: Readonly<MobileHeaderProps>) {
  return (
    <div className='lg:hidden bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700 sticky top-0 z-30'>
      <h1 className='font-bold text-xl text-blue-400'>Task Manager</h1>
      <button
        onClick={onMenuOpen}
        className='p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
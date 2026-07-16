'use client';

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export default function MobileHeader({ onMenuOpen }: Readonly<MobileHeaderProps>) {
  return (
    <div className='lg:hidden bg-gray-800/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-700/60 sticky top-0 z-30'>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className='font-bold text-lg text-white'>TaskFlow</span>
      </div>
      <button
        onClick={onMenuOpen}
        className='p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}

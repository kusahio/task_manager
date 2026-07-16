'use client';

import { useEffect, memo } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className='relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up'>
        {title && (
          <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-700 shrink-0'>
            {title && <h3 className='text-lg font-bold text-white'>{title}</h3>}
            <button onClick={onClose} className='text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-colors cursor-pointer'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className='p-4 md:p-6 overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default memo(Modal);

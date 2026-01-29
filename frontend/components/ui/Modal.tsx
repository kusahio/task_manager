'use client';

import { useEffect } from 'react';

interface ModalProps{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children } : ModalProps){
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen){
      window.addEventListener('keydown', handleEsc)
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all'>
      <div className='bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden'>
        {title && (
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900/50'>
            {title && <h3 className='text-lg font-bold text-white'>{title}</h3>}
            <button onClick={onClose} className='text-gray-400 hover:text-white transition-colors cursor-pointer'>
              cerrar
            </button>
          </div>
        )}

        <div className='p-6'>
          {children}
        </div>
      </div>
    </div>
  )
}
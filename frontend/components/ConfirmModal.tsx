'use client';

interface ConfirmModal{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({
  isOpen, onClose, onConfirm, title, message
} : ConfirmModal){
  if(!isOpen) return null

  return(
    <div className='fixed inset-0 bg-black/60 background-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-sm w-full transition-all scale-100'>
        <div className='p-6'>
          <h3 className='text-xl font-bold text-white mb-2'>{title}</h3>
          <p className='text-gray-300 mb-6 text-sm leading-relaxed'>
            {message}
          </p>

          <div className='flex justify-end gap-3'>
            <button onClick={onClose}
            className='px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium'>
              Cancelar
            </button>
            <button onClick={()=> {
              onConfirm();
              onClose();
              }}
              className='px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium'>
                Si, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
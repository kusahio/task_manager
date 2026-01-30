'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading = false
}: ConfirmModalProps) {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="bg-red-500/10 p-3 rounded-full shrink-0">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-1">
            {message}
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
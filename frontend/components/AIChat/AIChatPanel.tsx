'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chat';
import Button from '@/components/ui/Button';

interface AIChatPanelProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isProcessing: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onClear: () => void;
}

export default function AIChatPanel({ isOpen, messages, isProcessing, onClose, onSend, onClear }: Readonly<AIChatPanelProps>) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    onSend(input.trim());
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-850'>
        <div className='flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse' />
          <h3 className='text-sm font-bold text-white'>Asistente IA</h3>
        </div>
        <div className='flex items-center gap-1'>
          {messages.length > 0 && (
            <button onClick={onClear} className='text-xs text-gray-500 hover:text-gray-300 px-2 py-1 transition cursor-pointer'>
              Limpiar
            </button>
          )}
          <button onClick={onClose} className='text-gray-500 hover:text-white p-1 transition cursor-pointer'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={listRef} className='flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center text-gray-500'>
            <svg className="w-10 h-10 mb-3 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <p className='text-sm'>Describe la tarea que</p>
            <p className='text-sm'>quieres crear</p>
            <p className='text-xs mt-2 text-gray-600'>Ej: Dentista pasado mañana a las 16hs #salud</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-700 text-gray-200 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className='flex justify-start'>
            <div className='bg-gray-700 rounded-xl rounded-bl-sm px-4 py-3'>
              <div className='flex gap-1'>
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='border-t border-gray-700 p-3'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='Describe tu tarea...'
            className='flex-1 bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500'
            disabled={isProcessing}
            autoComplete='off'
          />
          <Button
            type='button'
            variant='primary'
            onClick={handleSend}
            isLoading={isProcessing}
            disabled={!input.trim()}
            className='px-3 py-2'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
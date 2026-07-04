'use client';

import { useCallback, useState } from 'react';
import { ChatMessage } from '@/types/chat';

export function useAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const close = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(async (text: string, onParse: (text: string) => Promise<string>) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await onParse(text);
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Hubo un error al analizar el texto. Intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { isOpen, toggle, close, messages, isProcessing, sendMessage, clear };
}
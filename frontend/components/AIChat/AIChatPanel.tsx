'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAIChat } from '@/hooks/useAIChat';
import TagSelector from '@/app/(protected)/tasks/_components/TagSelector';
import Button from '@/components/ui/Button';
import { Tag } from '@/types/tag';

interface AIChatPanelProps {
  tags: Tag[];
  onTaskCreated?: () => void;
}

export default function AIChatPanel({ tags, onTaskCreated }: Readonly<AIChatPanelProps>) {
  const {
    isOpen, toggle, close,
    activeTab, setActiveTab,
    form, tagSuggestions, fetchSuggestions, setTagSuggestions,
    selectedNewSuggestionNames, setSelectedNewSuggestionNames,
    messages, isProcessing, pendingResponse,
    sendMessage, confirmTasks, cancelTasks, clear,
  } = useAIChat(onTaskCreated);

  const [input, setInput] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formTitle || formDescription) {
        fetchSuggestions(formTitle, formDescription);
      } else {
        setTagSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formTitle, formDescription, fetchSuggestions, setTagSuggestions]);

  const handleChatSend = () => {
    if (!input.trim() || isProcessing) return;
    sendMessage(input.trim());
    setInput('');
  };

  const toggleSuggestionTag = (suggestion: typeof tagSuggestions[0]) => {
    if (suggestion.exists && suggestion.tag_id != null) {
      const current = form.selectedTags;
      if (current.includes(suggestion.tag_id)) {
        form.setValue('tags', current.filter((id) => id !== suggestion.tag_id));
      } else {
        form.setValue('tags', [...current, suggestion.tag_id]);
      }
    } else if (!suggestion.exists) {
      const isSelected = selectedNewSuggestionNames.includes(suggestion.name);
      if (isSelected) {
        setSelectedNewSuggestionNames((prev) => prev.filter((n) => n !== suggestion.name));
      } else {
        setSelectedNewSuggestionNames((prev) => [...prev, suggestion.name]);
      }
    }
  };

  if (!isOpen) {
    return (
      <button onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        title="Gestión de Tareas"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-128 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-850">
        <h3 className="text-sm font-bold text-white">Gestión de Tareas</h3>
        <button onClick={close} className="text-gray-500 hover:text-white p-1 transition cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'manual'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
            }`}
        >
          ✍️ Manual
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'ai'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
            }`}
        >
          🤖 Asistente IA
        </button>
      </div>

      {activeTab === 'manual' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            className="w-full bg-transparent text-base font-medium text-white placeholder-gray-500 focus:outline-none border-b border-gray-600 focus:border-blue-500 pb-2 transition-colors"
            autoComplete="off"
          />

          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Detalles de la tarea (opcional)"
            rows={3}
            className="w-full bg-gray-900/50 text-sm text-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none border border-transparent focus:border-blue-500/30 transition-all"
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-gray-500">Fecha Límite</label>
            <input
              type="date"
              {...form.register('deadline')}
              className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 w-full cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-gray-500">Etiquetas</label>
            <TagSelector
              availableTags={tags}
              selectedTagIds={form.selectedTags}
              onChange={(ids) => form.setValue('tags', ids)}
            />
          </div>

          {tagSuggestions.length > 0 && (
            <div>
              <label className="text-xs uppercase font-bold text-gray-400 mb-1 block">
                Sugerencias IA
              </label>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions.map((s) => {
                  const isSelected = s.exists
                    ? s.tag_id != null && form.selectedTags.includes(s.tag_id)
                    : selectedNewSuggestionNames.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => toggleSuggestionTag(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${isSelected
                          ? 'bg-blue-600 text-white border-transparent'
                          : s.exists
                            ? 'bg-transparent text-gray-400 border-gray-600 hover:opacity-100 opacity-60'
                            : 'bg-transparent text-yellow-400 border-yellow-600/50 hover:bg-yellow-600/10'
                        }`}
                    >
                      {s.exists ? `${isSelected ? '✅' : ''} ${s.name}` : `${isSelected ? '✨' : ''} ${s.name}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={form.handleSubmit}
            isLoading={form.isSubmitting}
            className="w-full"
          >
            Crear Tarea
          </Button>
        </div>
      )}

      {activeTab === 'ai' && (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg className="w-10 h-10 mb-3 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <p className="text-sm">Pregúntame sobre tus tareas</p>
                <p className="text-xs mt-2 text-gray-600">Ej: ¿qué tengo pendiente hoy?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : msg.role === 'system'
                          ? 'bg-gray-800 text-gray-400 text-center italic rounded-lg w-full max-w-full'
                          : 'bg-gray-700 text-gray-200 rounded-bl-sm'
                      }`}>
                      {msg.role === 'system' ? (
                        msg.content
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>

                  {msg.role === 'assistant' &&
                    pendingResponse &&
                    messages.indexOf(msg) === messages.length - 1 &&
                    pendingResponse.action.type === 'create_tasks' &&
                    pendingResponse.action.data?.tasks && (
                      <div className="mt-2 bg-gray-700/50 rounded-xl p-3 border border-blue-500/30 space-y-2">
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Vista previa de tareas:
                        </p>
                        {pendingResponse.action.data.tasks.map((task, i) => (
                          <div key={i} className="bg-gray-800 rounded-lg p-2 text-sm text-gray-300 space-y-1">
                            <p className="font-medium text-white">📌 {task.title}</p>
                            {task.description && <p className="text-xs text-gray-400">📝 {task.description}</p>}
                            {task.deadline && <p className="text-xs text-gray-400">📅 {new Date(task.deadline).toLocaleDateString()}</p>}
                            {(task.existing_tag_ids.length > 0 || task.new_tag_names.length > 0) && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {task.existing_tag_ids.map((tid) => {
                                  const tag = tags.find((t) => t.id === tid);
                                  return tag ? (
                                    <span key={tid} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                                      ✅ {tag.name}
                                    </span>
                                  ) : null;
                                })}
                                {task.new_tag_names.map((name) => (
                                  <span key={name} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                                    ✨ {name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <Button type="button" variant="primary" onClick={confirmTasks} className="flex-1 text-xs py-1">
                            Confirmar
                          </Button>
                          <Button type="button" variant="ghost" onClick={cancelTasks} className="flex-1 text-xs py-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                </div>
              ))
            )}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleChatSend(); }}
                placeholder="Describe tu tarea o pregunta..."
                className="flex-1 bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                disabled={isProcessing}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleChatSend}
                isLoading={isProcessing}
                disabled={!input.trim()}
                className="px-3 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </Button>
            </div>

            {messages.length > 0 && (
              <button
                onClick={clear}
                className="text-xs text-gray-500 hover:text-gray-300 mt-2 transition cursor-pointer"
              >
                Limpiar conversación
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
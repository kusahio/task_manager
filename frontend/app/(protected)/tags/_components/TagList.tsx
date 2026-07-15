'use client';

import { memo } from 'react';
import { useTagEdit } from '@/hooks/useTagEdit';
import { Tag } from '@/types/tag';
import { DEFAULT_TAG_COLOR } from '@/constants';
import { TagCardSkeleton } from '@/components/ui/Skeleton';

interface TagListProps {
  readonly tags: Tag[];
  readonly onDelete: (id: number) => void;
  readonly onRefresh: () => void;
  readonly loading?: boolean;
}

function TagList({ tags, onDelete, onRefresh, loading }: TagListProps) {
  const { editing, startEditing, cancelEditing, updateField, handleSave, handleKeyDown } = useTagEdit(onRefresh);

  if (loading) {
    return (
      <div className="space-y-3 animate-fade-in">
        {Array.from({ length: 3 }).map((_, i) => (
          <TagCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className='bg-gray-800/50 p-5 md:p-6 rounded-xl border border-gray-700'>
      <h2 className='text-lg font-semibold text-green-400 mb-4 flex items-center gap-2'>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Mis etiquetas
      </h2>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
          <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 6h.008v.008H6V6z" />
          </svg>
          <p className='text-gray-500 font-medium'>No existen etiquetas aún</p>
          <p className='text-gray-600 text-sm mt-1'>Crea una etiqueta para empezar a organizar</p>
        </div>
      ) : (
        <div className='space-y-2 max-h-100 overflow-y-auto pr-2 custom-scrollbar animate-fade-in'>
          {tags.map(tag => {
            const isEditing = editing?.id === tag.id;

            return (
              <div key={tag.id}
                className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200
                ${isEditing ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-700/30 hover:bg-gray-700/50'}`}
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  {isEditing ? (
                    <>
                      <input
                        type="color"
                        value={editing.color}
                        onChange={(e) => updateField('color', e.target.value)}
                        className='w-6 h-6 bg-transparent cursor-pointer rounded overflow-hidden shrink-0'
                      />
                      <input
                        type="text"
                        value={editing.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='bg-gray-900 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none w-full max-w-[200px] text-sm'
                        autoFocus
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className='w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white/10 shrink-0'
                        style={{ backgroundColor: tag.color || DEFAULT_TAG_COLOR }}
                      />
                      <span className='text-white text-sm font-medium truncate'>{tag.name}</span>
                    </>
                  )}

                  <div className='flex gap-1.5 ml-auto pl-4 shrink-0'>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className='text-green-400 hover:text-green-300 text-xs font-medium px-2 py-1 bg-green-400/10 rounded hover:bg-green-400/20 transition cursor-pointer'
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className='text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-600 rounded transition cursor-pointer'
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(tag)}
                          className='text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1 rounded hover:bg-yellow-400/10 transition cursor-pointer'
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(tag.id)}
                          className='text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-400/10 transition cursor-pointer'
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(TagList);

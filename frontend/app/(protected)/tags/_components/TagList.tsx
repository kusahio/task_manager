'use client';

import { useState } from 'react';
import { Tag, tagService } from '@/services/tag';
import { toast } from 'sonner';

interface TagListProps{
  tags: Tag[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export default function TagList({tags, onDelete, onRefresh} : TagListProps){
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const startEditing = (tag : Tag) => {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color || '#3B82F6')
  }

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  }

  const handleSave = async (id: number) => {
    if(!editName){
      toast.error('El nombre del Tag no puede estar vacío');
      return;
    }

    try{
      await tagService.update(id, {name: editName, color: editColor});
      toast.success('El Tag se actualizó correctamente');
      onRefresh();
      cancelEditing();
    } catch (err: any){
      toast.error('No se pudo actualizar el Tag')
    }
  }

  const handleKeyDown = (e : React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') handleSave(id);
    if (e.key === 'Escape') cancelEditing();
  }

  return (
    <div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
      <h2 className='text-xl font-semibold text-green-400 mb-4'>Mis Tags</h2>

      {tags.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            No existen Tags
          </p>
        ) : (
          <div className='space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
            {tags.map(tag => {
              const isEditing = editingId === tag.id;

              return (
                <div key={tag.id}
                  className={`flex justify-between items-center p-3 rounded-lg transition-all
                  ${isEditing ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                >
                  <div className='flex items-center gap-3 flex-1'>
                    {isEditing ? (
                      <>
                        <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)}
                          className='w-6 h-6 bg-transparent cursor-pointer rounded overflow-hidden'
                        />
                        <input type="text" value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, tag.id)}
                          className='bg-gray-900 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none w-full max-w-[200px]'
                        />
                      </>
                    ) : (
                      <>
                        <span className='w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10'style={{backgroundColor: tag.color || '#ccc'}}></span>
                        <span className='text-white font-medium'>{tag.name}</span>
                      </>
                    )}

                    <div className='flex gap-2 ml-auto pl-4'>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(tag.id)}
                            className='text-green-400 hover:text-green-300 text-sm font-medium px-2 py-1 bg-green-400/10 rounded hover:bg-green-400/20 transition cursor-pointer'>
                              Confirmar
                          </button>
                          <button
                            onClick={cancelEditing}
                            className='text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-600 rounded transition cursor-pointer'
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(tag)}
                            className='text-yellow-400 hover:text-yellow-300 text-sm px-2 py-1 rounded hover:bg-yellow-400/10 transition cursor-pointer'
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(tag.id)}
                            className='text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-400/10 transition cursor-pointer'
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  )
}
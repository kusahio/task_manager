'use client'

import { memo } from 'react';
import { Tag } from '@/types/tag'

interface TagSelectorProps{
  readonly availableTags : Tag[];
  readonly selectedTagIds: number[];
  readonly onChange: (ids: number[]) => void
}

function TagSelector({
  availableTags,
  selectedTagIds,
  onChange
} : TagSelectorProps) {

  const toggleTag = (id: number) => {
    if (selectedTagIds.includes(id)){
      onChange(selectedTagIds.filter(tagId => tagId !== id));
    } else {
      onChange([...selectedTagIds, id])
    }
  }

  if (availableTags.length === 0){
    return <p className='text-gray-500 text-xs italic'>No existen etiquetas creadas aún</p>
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {availableTags.map(tag => {
        const isSelected = selectedTagIds.includes(tag.id);

        return (
          <button
            key={tag.id}
            type='button'
            onClick={() => toggleTag(tag.id)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer
              ${isSelected 
                ? 'brightness-110 shadow-md transform scale-105' 
                : 'bg-transparent text-gray-400 border-gray-600 opacity-60 hover:opacity-100'
              }
            `}
            style={{
              backgroundColor: isSelected ? tag.color || '#3b82f6' : undefined,
              borderColor: isSelected ? 'transparent' : tag.color || '#4b5563',
              color: isSelected ? '#fff' : undefined
            }}
          >
            {tag.name} {isSelected && '✓'}
          </button>
        )
      })}
    </div>
  )
}

export default memo(TagSelector);
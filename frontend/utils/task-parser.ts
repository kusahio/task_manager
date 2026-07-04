import { Tag } from '@/types/tag';

export function matchTagsFromAI(aiTags: string[], existingTags: Tag[]): number[] {
  return existingTags
    .filter(existingTag =>
      aiTags.some(aiTag => aiTag.toLowerCase() === existingTag.name.toLowerCase())
    )
    .map(t => t.id);
}
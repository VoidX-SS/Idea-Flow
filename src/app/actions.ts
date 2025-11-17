'use server';

import {
  rankIdeasByCreativity,
  type RankIdeasByCreativityInput,
} from '@/ai/flows/rank-ideas-by-creativity';
import type { Idea } from '@/app/page';

export async function submitIdeaAction(
  input: RankIdeasByCreativityInput
): Promise<Idea> {
  try {
    if (!input.idea) {
        throw new Error('Idea text cannot be empty.');
    }

    const result = await rankIdeasByCreativity(input);
    
    return {
      ...result,
      id: crypto.randomUUID(),
      idea: input.idea,
    };
  } catch (error) {
    console.error('Error in submitIdeaAction:', error);
    throw new Error('Failed to rank idea using AI.');
  }
}

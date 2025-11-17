'use server';

import {
  rankIdeasByCreativity,
  type RankIdeasByCreativityInput,
  type RankIdeasByCreativityOutput,
} from '@/ai/flows/rank-ideas-by-creativity';

export async function submitIdeaAction(
  input: RankIdeasByCreativityInput
): Promise<RankIdeasByCreativityOutput> {
  try {
    if (!input.idea) {
      throw new Error('Idea text cannot be empty.');
    }

    const result = await rankIdeasByCreativity(input);
    return result;
  } catch (error) {
    console.error('Error in submitIdeaAction:', error);
    throw new Error('Failed to rank idea.');
  }
}

'use server';

import {
  rankIdeasByCreativity,
  type RankIdeasByCreativityInput,
} from '@/ai/flows/rank-ideas-by-creativity';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export async function submitIdeaAction(
  input: RankIdeasByCreativityInput
): Promise<void> {
  try {
    if (!input.idea) {
      throw new Error('Idea text cannot be empty.');
    }

    const result = await rankIdeasByCreativity(input);
    
    // Initialize Firebase on the server-side to get Firestore instance
    const { firestore } = initializeFirebase();
    const ideasCollection = collection(firestore, 'ideas');

    await addDoc(ideasCollection, {
      ...result,
      idea: input.idea,
      createdAt: serverTimestamp(),
    });

  } catch (error) {
    console.error('Error in submitIdeaAction:', error);
    throw new Error('Failed to save or rank idea.');
  }
}

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
    // This is incorrect as initializeFirebase is a client-side function
    // We should use a different approach to interact with Firestore from the server
    const { firestore } = initializeFirebase();
    const ideasCollection = collection(firestore, 'ideas');

    // Using addDoc directly in a server action like this can be problematic
    // if not handled with proper error boundaries and context.
    await addDoc(ideasCollection, {
      ...result,
      idea: input.idea,
      createdAt: serverTimestamp(),
    });

  } catch (error) {
    console.error('Error in submitIdeaAction:', error);
    // The error is being re-thrown, which is caught by the client.
    // The issue is likely with the Firebase initialization on the server.
    throw new Error('Failed to save or rank idea.');
  }
}

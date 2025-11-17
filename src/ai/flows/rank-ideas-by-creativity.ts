'use server';
/**
 * @fileOverview Ranks ideas based on their creativity using Gemini AI.
 *
 * - rankIdeasByCreativity - A function that ranks ideas by creativity.
 * - RankIdeasByCreativityInput - The input type for the rankIdeasByCreativity function.
 * - RankIdeasByCreativityOutput - The return type for the rankIdeasByCreativity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankIdeasByCreativityInputSchema = z.object({
  idea: z.string().describe('The idea to be ranked for creativity.'),
});
export type RankIdeasByCreativityInput = z.infer<typeof RankIdeasByCreativityInputSchema>;

const RankIdeasByCreativityOutputSchema = z.object({
  creativityScore: z
    .number()
    .describe('A score from 0 to 1 representing the creativity of the idea.'),
  analysis: z.string().describe('The AI analysis of the idea.'),
});
export type RankIdeasByCreativityOutput = z.infer<typeof RankIdeasByCreativityOutputSchema>;

export async function rankIdeasByCreativity(input: RankIdeasByCreativityInput): Promise<RankIdeasByCreativityOutput> {
  return rankIdeasByCreativityFlow(input);
}

const rankIdeasByCreativityPrompt = ai.definePrompt({
  name: 'rankIdeasByCreativityPrompt',
  input: {schema: RankIdeasByCreativityInputSchema},
  output: {schema: RankIdeasByCreativityOutputSchema},
  prompt: `You are an AI assistant that analyzes ideas for their originality and creativity.

  Analyze the following idea and determine its creativity score on a scale of 0 to 1, where 0 is not creative at all and 1 is highly creative and original.  Also provide a short analysis.

  Idea: {{{idea}}}
  `,
});

const rankIdeasByCreativityFlow = ai.defineFlow(
  {
    name: 'rankIdeasByCreativityFlow',
    inputSchema: RankIdeasByCreativityInputSchema,
    outputSchema: RankIdeasByCreativityOutputSchema,
  },
  async input => {
    const {output} = await rankIdeasByCreativityPrompt(input);
    return output!;
  }
);

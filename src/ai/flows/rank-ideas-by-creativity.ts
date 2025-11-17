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
  source: z.string().describe('A markdown formatted string of sources to prove the existence of the idea. Can be empty.'),
});
export type RankIdeasByCreativityOutput = z.infer<typeof RankIdeasByCreativityOutputSchema>;

export async function rankIdeasByCreativity(input: RankIdeasByCreativityInput): Promise<RankIdeasByCreativityOutput> {
  return rankIdeasByCreativityFlow(input);
}

const rankIdeasByCreativityPrompt = ai.definePrompt({
  name: 'rankIdeasByCreativityPrompt',
  input: {schema: RankIdeasByCreativityInputSchema},
  output: {schema: RankIdeasByCreativityOutputSchema},
  prompt: `Bạn là một chuyên gia AI, có nhiệm vụ phân tích và đánh giá mức độ sáng tạo của các ý tưởng. Toàn bộ phân tích phải được viết bằng tiếng Việt.

  Hãy phân tích ý tưởng sau đây một cách khắt khe và cho điểm sáng tạo trên thang điểm từ 0 đến 1.
  
  Ý tưởng: {{{idea}}}

  Điểm sáng tạo (creativityScore) phải được đánh giá dựa trên các tiêu chí sau:
  1.  Tính mới (40%): Ý tưởng này chưa từng xuất hiện hoặc rất hiếm trên thế giới.
  2.  Chủ đề "Smart Life" (30%): Ý tưởng phải liên quan mật thiết đến việc cải thiện cuộc sống thông minh (nhà thông minh, thành phố thông minh, sức khỏe thông minh, v.v.).
  3.  Tính khả thi & Tác động (30%): Ý tưởng phải có tính khả thi về mặt công nghệ và có khả năng giải quyết một vấn đề thực tế của con người.

  Phần Phân tích (analysis) phải giải thích rõ ràng điểm số được cho dựa trên 3 tiêu chí trên.

  Phần Nguồn (source) phải bao gồm các liên kết (dưới dạng markdown) đến các bài báo, dự án, hoặc sản phẩm đã tồn tại để chứng minh cho lập luận của bạn về "Tính mới". Nếu không tìm thấy, hãy để trống.
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

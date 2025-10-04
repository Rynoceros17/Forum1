'use server';

/**
 * @fileOverview An AI-powered tool to automatically suggest relevant topic tags for user-submitted content.
 *
 * - automatedContentTagging - A function that suggests relevant topic tags for user-submitted content.
 * - AutomatedContentTaggingInput - The input type for the automatedContentTagging function.
 * - AutomatedContentTaggingOutput - The return type for the automatedContentTagging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedContentTaggingInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the post for which to suggest tags.'),
});
export type AutomatedContentTaggingInput = z.infer<typeof AutomatedContentTaggingInputSchema>;

const AutomatedContentTaggingOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested topic tags.'),
});
export type AutomatedContentTaggingOutput = z.infer<typeof AutomatedContentTaggingOutputSchema>;

export async function automatedContentTagging(
  input: AutomatedContentTaggingInput
): Promise<AutomatedContentTaggingOutput> {
  return automatedContentTaggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedContentTaggingPrompt',
  input: {schema: AutomatedContentTaggingInputSchema},
  output: {schema: AutomatedContentTaggingOutputSchema},
  prompt: `You are a topic tag suggestion AI.

  Given the following content, suggest relevant topic tags. Do not create new tags, only suggest existing tags.
  Return the tags in an array of strings.
  Content: {{{content}}}`,
});

const automatedContentTaggingFlow = ai.defineFlow(
  {
    name: 'automatedContentTaggingFlow',
    inputSchema: AutomatedContentTaggingInputSchema,
    outputSchema: AutomatedContentTaggingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

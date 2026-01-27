
'use server';

/**
 * @fileOverview An AI-powered tool that generates a personalized book introduction.
 *
 * - generatePersonalizedIntro - A function that takes a name and mortgage balance and returns a personalized book intro.
 * - PersonalizedIntroInput - The input type for the function.
 * - PersonalizedIntroOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedIntroInputSchema = z.object({
  name: z.string().describe('The first name of the user.'),
  mortgageBalance: z.number().describe('The user\'s current mortgage balance.'),
});

export type PersonalizedIntroInput = z.infer<typeof PersonalizedIntroInputSchema>;

const PersonalizedIntroOutputSchema = z.object({
  intro: z.string().describe('A personalized introduction for a book, incorporating the user\'s name and mortgage balance.'),
});

export type PersonalizedIntroOutput = z.infer<typeof PersonalizedIntroOutputSchema>;

export async function generatePersonalizedIntro(input: PersonalizedIntroInput): Promise<PersonalizedIntroOutput> {
  return personalizedIntroFlow(input);
}

const personalizedIntroPrompt = ai.definePrompt({
  name: 'personalizedIntroPrompt',
  input: {schema: PersonalizedIntroInputSchema},
  output: {schema: PersonalizedIntroOutputSchema},
  prompt: `You are a persuasive direct-response copywriter in the style of Jim Edwards and Russell Brunson.
Your task is to write a compelling, personalized first paragraph for a financial self-help book.
The book is about paying off a mortgage faster using a HELOC strategy.

You will be given the user's first name and their current mortgage balance.

Your response must:
1.  Address the user directly by their first name.
2.  Incorporate their specific mortgage balance into the narrative to make the problem feel real and personal.
3.  Agitate the pain of being "trapped" by this large debt.
4.  Hint at a "secret" or a "different way" that the book will reveal, without giving away the strategy.
5.  Be written in a conversational, slightly edgy, and highly engaging tone.
6.  The entire output should be a single block of text, formatted as the 'intro' field in the output schema.

Example tone: "Look, [Name], let's be blunt. That $XXX,XXX mortgage balance isn't just a number on a statement. It's a weight. It's the reason you..."

User Details:
Name: {{{name}}}
Mortgage Balance: {{{mortgageBalance}}}
`,
});

const personalizedIntroFlow = ai.defineFlow(
  {
    name: 'personalizedIntroFlow',
    inputSchema: PersonalizedIntroInputSchema,
    outputSchema: PersonalizedIntroOutputSchema,
  },
  async input => {
    const {output} = await personalizedIntroPrompt(input);
    return output!;
  }
);

    
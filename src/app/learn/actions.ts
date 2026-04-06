
'use server';
import { ai } from '@/ai/genkit';

export async function translateContent(text: string, targetLanguage: string) {
  if (!text || !targetLanguage || targetLanguage === 'en') return text;
  
  try {
    const { text: translated } = await ai.generate({
      prompt: `Translate the following text to ${targetLanguage}. 
      Keep numbers, currency symbols, bank names, and product names (HELOC, STEP, FlexLine, Offset Mortgage, Offset Account, etc.) unchanged. 
      Return ONLY the translated text, no preamble or quotes:
      
      ${text}`,
    });
    
    return translated || text;
  } catch (error) {
    console.error('Translation Action Error:', error);
    return text;
  }
}

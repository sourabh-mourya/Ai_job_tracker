import { createWorker } from 'tesseract.js';
import { z } from 'zod';
import { JOB_EXTRACTION_PROMPT } from '../utils/prompt.js';

export const jobDataSchema = z.object({
  company: z.string().min(1).catch('Unknown Company'),
  position: z.string().catch('Software Role'),
  applied_date: z.string().catch(new Date().toISOString().split('T')[0]),
  source: z.string().catch('LinkedIn'),
  status: z.string().catch('Applied'),
  location: z.string().nullable().catch('N/A'),
  recruiter: z.string().nullable().catch(null),
  confidence: z.number().min(0).max(100).catch(75),
});

async function runLocalOCR(imageBuffer) {
  try {
    // Use /tmp for serverless read-only filesystem compatibility
    const worker = await createWorker('eng', 1, {
      cachePath: '/tmp',
      // logger: (m) => console.log(`[OCR] ${m.status} - ${Math.round(m.progress * 100)}%`) // Disabled to reduce console spam
    });
    const { data } = await worker.recognize(imageBuffer);
    await worker.terminate();
    return data.text || '';
  } catch (err) {
    console.warn('[OCR] Local Tesseract error:', err.message);
    return '';
  }
}

async function cleanTextWithGroq(ocrText) {
  if (!process.env.GROQ_API_KEY) return null;
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: JOB_EXTRACTION_PROMPT + '\n\nThe user will provide messy OCR text extracted from a job application screenshot. Parse it and return ONLY the JSON object.'
          },
          {
            role: 'user',
            content: `Here is the messy OCR text:\n\n${ocrText}`
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('[Groq] API Error:', err.message);
    return null;
  }
}

function cleanAndParseJSON(raw) {
  if (!raw) return null;
  let text = raw.trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    text = text.substring(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function extractFromImage(imageBuffer, mimeType = 'image/png') {
  const startTime = Date.now();

  console.log('[Extract] Step 1: Running Local OCR...');
  const ocrText = await runLocalOCR(imageBuffer);
  
  if (!ocrText || ocrText.trim().length < 5) {
    console.log('[Extract] OCR found no text.');
    return jobDataSchema.parse({});
  }

  console.log(`[Extract] Step 2: Cleaning OCR text with Groq LLM... (${ocrText.length} chars)`);
  const groqRaw = await cleanTextWithGroq(ocrText);
  const groqParsed = cleanAndParseJSON(groqRaw);

  if (groqParsed && groqParsed.company) {
    console.log(`[Extract] ✅ Extraction succeeded in ${Date.now() - startTime}ms`);
    return jobDataSchema.parse(groqParsed);
  }

  // Final absolute fallback if API fails completely
  console.log('[Extract] ⚡ Groq failed, falling back to basic extraction...');
  return jobDataSchema.parse({
    company: 'Unknown Company',
    position: 'Job Application',
  });
}

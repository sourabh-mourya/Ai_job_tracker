import fs from 'fs';
import path from 'path';

let inMemorySheetId = process.env.GOOGLE_SHEET_ID || '';

/**
 * Get path to local JSON config file.
 */
function getConfigFilePath() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join('/tmp', 'sheet_config.json');
  }
  return path.join(process.cwd(), 'config', 'sheetConfig.json');
}

/**
 * Save Google Sheet ID to local JSON config file and memory.
 * @param {string} sheetId
 */
export function setStoredSheetId(sheetId) {
  inMemorySheetId = sheetId;
  const filePath = getConfigFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify({ sheetId, updatedAt: new Date().toISOString() }, null, 2));
  } catch (err) {
    console.warn('Could not persist sheet ID to disk, using in-memory store:', err.message);
  }
}

/**
 * Retrieve current Google Sheet ID from memory, config file, or environment variable.
 * @returns {string|null}
 */
export function getStoredSheetId() {
  if (inMemorySheetId) {
    return inMemorySheetId;
  }

  const filePath = getConfigFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data?.sheetId) {
        inMemorySheetId = data.sheetId;
        return data.sheetId;
      }
    }
  } catch (err) {
    // Ignore read errors
  }

  return process.env.GOOGLE_SHEET_ID || null;
}

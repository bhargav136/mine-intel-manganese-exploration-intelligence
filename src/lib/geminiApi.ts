/**
 * Utility functions for making calls to the backend Gemini AI endpoints,
 * automatically including any user-configured API key and model preferences.
 */

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('mine_intel_gemini_api_key') || '';
  const trimmed = stored.trim();
  // Validate that it looks like a legitimate Gemini key; otherwise discard it
  if (trimmed && (trimmed.startsWith('AIza') || trimmed.startsWith('AQ.')) && trimmed.length > 25 && !trimmed.includes('dummy')) {
    return trimmed;
  }
  if (trimmed) {
    // Clean up stale or dummy key
    try {
      localStorage.removeItem('mine_intel_gemini_api_key');
    } catch {
      // Ignore
    }
  }
  return '';
}

export function getSelectedModel(): string {
  if (typeof window === 'undefined') return 'gemini-3.6-flash';
  return localStorage.getItem('mine_intel_gemini_model') || 'gemini-3.6-flash';
}

export function getGeminiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const key = getCustomApiKey();
  if (key) {
    headers['x-gemini-api-key'] = key;
  }
  return headers;
}

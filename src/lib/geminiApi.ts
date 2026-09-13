/**
 * Utility functions for making calls to the backend Gemini AI endpoints,
 * automatically including any user-configured API key and model preferences.
 */

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('mine_intel_gemini_api_key') || '';
}

export function getSelectedModel(): string {
  if (typeof window === 'undefined') return 'gemini-3.8-flash';
  return localStorage.getItem('mine_intel_gemini_model') || 'gemini-3.8-flash';
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

/**
 * Times Tables Quest - PWA Prompt
 * 
 * Shows a prompt encouraging users to add the app to their home screen
 * for fullscreen experience on iOS.
 */

import { t } from '../i18n';

const STORAGE_KEY = 'pwa-prompt-dismissed';

/**
 * Check if running as standalone PWA (added to home screen)
 */
function isStandalone(): boolean {
  // Check iOS standalone mode
  if ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone) {
    return true;
  }
  // Check display-mode media query
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  return false;
}

/**
 * Check if running on iOS Safari
 */
function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isChrome = /CriOS/.test(ua);
  const isFirefox = /FxiOS/.test(ua);
  
  // iOS Safari: iOS + WebKit but not Chrome or Firefox
  return isIOS && isWebkit && !isChrome && !isFirefox;
}

/**
 * Check if prompt was previously dismissed
 */
function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark prompt as dismissed
 */
function setDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Create and show the PWA prompt
 */
function createPrompt(): HTMLElement {
  const prompt = document.createElement('div');
  prompt.className = 'pwa-prompt';
  prompt.setAttribute('role', 'dialog');
  prompt.setAttribute('aria-label', t('pwa.title'));

  // Share icon for iOS (box with arrow pointing up)
  const shareIcon = '⬆️';

  prompt.innerHTML = `
    <div class="pwa-prompt__text">${t('pwa.title')}</div>
    <div class="pwa-prompt__instructions">
      ${t('pwa.instructions', { icon: `<span class="pwa-prompt__icon">${shareIcon}</span>` })}
    </div>
    <div class="pwa-prompt__buttons">
      <button class="pwa-prompt__dismiss" id="pwa-dismiss">
        ${t('pwa.dismiss')}
      </button>
    </div>
  `;

  return prompt;
}

/**
 * Show PWA prompt if appropriate
 * 
 * Shows prompt if:
 * - Running on iOS Safari
 * - Not already running as standalone PWA
 * - User hasn't dismissed it before
 */
export function showPWAPromptIfNeeded(): void {
  // Don't show if already standalone
  if (isStandalone()) {
    console.log('[PWA] Already running as standalone');
    return;
  }

  // Only show on iOS Safari
  if (!isIOSSafari()) {
    console.log('[PWA] Not iOS Safari, skipping prompt');
    return;
  }

  // Don't show if previously dismissed
  if (wasDismissed()) {
    console.log('[PWA] Prompt was previously dismissed');
    return;
  }

  console.log('[PWA] Showing Add to Home Screen prompt');

  const prompt = createPrompt();
  document.body.appendChild(prompt);

  // Handle dismiss
  const dismissBtn = document.getElementById('pwa-dismiss');
  dismissBtn?.addEventListener('click', () => {
    setDismissed();
    prompt.remove();
  });
}

/**
 * Reset PWA prompt (for testing)
 */
export function resetPWAPrompt(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

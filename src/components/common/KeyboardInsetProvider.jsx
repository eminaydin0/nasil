import { useEffect } from 'react';

const KEYBOARD_THRESHOLD = 72;

function updateKeyboardInset() {
  const vv = window.visualViewport;
  if (!vv) return;

  const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  document.documentElement.style.setProperty('--keyboard-inset', `${inset}px`);

  if (inset > KEYBOARD_THRESHOLD) {
    document.documentElement.dataset.keyboardOpen = 'true';
  } else {
    delete document.documentElement.dataset.keyboardOpen;
  }
}

function scrollFocusedFieldIntoView(event) {
  const el = event.target;
  if (
    !(el instanceof HTMLInputElement) ||
    el.type === 'hidden' ||
    el.type === 'checkbox' ||
    el.type === 'radio' ||
    el.type === 'file' ||
    el.type === 'button' ||
    el.type === 'submit'
  ) {
    if (!(el instanceof HTMLTextAreaElement) && !(el instanceof HTMLSelectElement)) {
      return;
    }
  }

  if (window.innerWidth > 639) return;

  window.setTimeout(() => {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 320);
}

/** Mobilde klavye yüksekliğini CSS değişkeni olarak yazar; input focus scroll düzeltmesi. */
export default function KeyboardInsetProvider() {
  useEffect(() => {
    document.documentElement.style.setProperty('--keyboard-inset', '0px');

    const vv = window.visualViewport;
    if (!vv) return undefined;

    updateKeyboardInset();
    vv.addEventListener('resize', updateKeyboardInset);
    vv.addEventListener('scroll', updateKeyboardInset);
    document.addEventListener('focusin', scrollFocusedFieldIntoView);

    return () => {
      vv.removeEventListener('resize', updateKeyboardInset);
      vv.removeEventListener('scroll', updateKeyboardInset);
      document.removeEventListener('focusin', scrollFocusedFieldIntoView);
      document.documentElement.style.removeProperty('--keyboard-inset');
      delete document.documentElement.dataset.keyboardOpen;
    };
  }, []);

  return null;
}

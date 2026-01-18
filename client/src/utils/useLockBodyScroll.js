import { useEffect } from 'react';

const LOCK_COUNT_ATTR = 'data-modal-lock-count';
const ORIGINAL_OVERFLOW_ATTR = 'data-modal-lock-original-overflow';
const ORIGINAL_PADDING_RIGHT_ATTR = 'data-modal-lock-original-padding-right';

function getLockCount(body) {
  const raw = body.getAttribute(LOCK_COUNT_ATTR);
  const value = Number.parseInt(raw || '0', 10);
  return Number.isFinite(value) ? value : 0;
}

function setLockCount(body, count) {
  body.setAttribute(LOCK_COUNT_ATTR, String(Math.max(0, count)));
}

function lockBody(body) {
  if (!body.hasAttribute(ORIGINAL_OVERFLOW_ATTR)) {
    body.setAttribute(ORIGINAL_OVERFLOW_ATTR, body.style.overflow || '');
  }
  if (!body.hasAttribute(ORIGINAL_PADDING_RIGHT_ATTR)) {
    body.setAttribute(ORIGINAL_PADDING_RIGHT_ATTR, body.style.paddingRight || '');
  }

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockBody(body) {
  const originalOverflow = body.getAttribute(ORIGINAL_OVERFLOW_ATTR) || '';
  const originalPaddingRight = body.getAttribute(ORIGINAL_PADDING_RIGHT_ATTR) || '';

  body.style.overflow = originalOverflow;
  body.style.paddingRight = originalPaddingRight;

  body.removeAttribute(ORIGINAL_OVERFLOW_ATTR);
  body.removeAttribute(ORIGINAL_PADDING_RIGHT_ATTR);
}

export default function useLockBodyScroll(isLocked) {
  useEffect(() => {
    if (!isLocked) return;
    if (typeof document === 'undefined') return;

    const body = document.body;
    const previousCount = getLockCount(body);

    if (previousCount === 0) lockBody(body);
    setLockCount(body, previousCount + 1);

    return () => {
      const currentCount = getLockCount(body);
      const nextCount = Math.max(0, currentCount - 1);
      setLockCount(body, nextCount);

      if (nextCount === 0) unlockBody(body);
    };
  }, [isLocked]);
}

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../icons';

export interface ModalProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

/** Centered dialog. The library has a Drawer but no modal, so the page brings its own. */
export function Modal({ open, title, description, onClose, footer, size = 'md', children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>('input, textarea, select, button:not(.sa-modal__close)');
    (first ?? panelRef.current)?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  return createPortal(
    <div className="sa-modal" onKeyDown={onKeyDown}>
      <div className="sa-modal__backdrop" aria-hidden="true" onClick={onClose} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`sa-modal__panel sa-modal__panel--${size}`}>
        <header className="sa-modal__header">
          <div>
            <h2 id={titleId} className="sa-modal__title">{title}</h2>
            {description && <p className="sa-modal__description">{description}</p>}
          </div>
          <button type="button" className="sa-icon-btn sa-modal__close" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>
        <div className="sa-modal__body">{children}</div>
        {footer && <footer className="sa-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

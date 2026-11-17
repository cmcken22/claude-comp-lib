import type { Toast } from '../../hooks/useToasts';
import { AlertIcon, CheckCircleIcon, CloseIcon, InfoIcon } from '../../icons';

const ICONS = { success: CheckCircleIcon, info: InfoIcon, error: AlertIcon };

export function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="sa-toasts" role="status" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone];
        return (
          <div key={t.id} className={`sa-toast sa-toast--${t.tone}`}>
            <Icon className="sa-toast__icon" />
            <span>{t.message}</span>
            <button type="button" className="sa-icon-btn sa-icon-btn--sm" aria-label="Dismiss" onClick={() => onDismiss(t.id)}>
              <CloseIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

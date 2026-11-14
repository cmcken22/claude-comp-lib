import { Icon, type IconName } from '../icons';

const actions: Array<{ label: string; icon: IconName; tone?: 'alert' } | 'divider'> = [
  { label: 'Log safety incident', icon: 'alert', tone: 'alert' },
  { label: 'Add daily log', icon: 'clipboard' },
  { label: 'Schedule inspection', icon: 'calendarCheck' },
  { label: 'Request materials', icon: 'truck' },
  { label: 'Upload document', icon: 'upload' },
  'divider',
  { label: 'Generate report', icon: 'chart' },
  { label: 'Print dashboard', icon: 'printer' },
];

interface QuickActionsProps {
  onAction?: (label: string) => void;
}

/** Vertical toolbar on the right (a horizontal bar on small screens). */
export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <aside className="cd-rail" aria-label="Quick actions">
      {actions.map((action, i) =>
        action === 'divider' ? (
          <span key={`divider-${i}`} className="cd-rail__sep" aria-hidden="true" />
        ) : (
          <button
            key={action.label}
            type="button"
            className={action.tone === 'alert' ? 'cd-rail__btn cd-rail__btn--alert' : 'cd-rail__btn'}
            aria-label={action.label}
            data-tip={action.label}
            onClick={() => (action.label === 'Print dashboard' ? window.print() : onAction?.(action.label))}
          >
            <Icon name={action.icon} size={20} />
          </button>
        ),
      )}
    </aside>
  );
}

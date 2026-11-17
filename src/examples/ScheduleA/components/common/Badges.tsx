import { Badge } from '../../../../components/Badge';
import { FINDING_STATUS, ITEM_KIND, SCOPE_STATUS, SEVERITY } from '../../config';
import { SparkleIcon } from '../../icons';
import type { FindingStatus, ItemKind, ScopeStatus, Severity } from '../../types';

export const SeverityBadge = ({ severity, size = 'sm' }: { severity: Severity; size?: 'sm' | 'md' }) => (
  <Badge color={SEVERITY[severity].color} variant={severity === 'critical' ? 'solid' : 'subtle'} size={size}>
    {SEVERITY[severity].label}
  </Badge>
);

export const StatusBadge = ({ status }: { status: FindingStatus }) => (
  <Badge color={FINDING_STATUS[status].color} size="sm" dot>
    {FINDING_STATUS[status].label}
  </Badge>
);

export const KindBadge = ({ kind }: { kind: ItemKind }) => (
  <Badge color={ITEM_KIND[kind].color} size="sm">
    {ITEM_KIND[kind].label}
  </Badge>
);

export const ScopeStatusBadge = ({ status }: { status: ScopeStatus }) => (
  <Badge color={SCOPE_STATUS[status]} dot>
    {status}
  </Badge>
);

/** Marks AI output as a recommendation, never as accepted contract language. */
export const AiLabel = ({ children = 'AI recommendation' }: { children?: string }) => (
  <span className="sa-ai-label">
    <SparkleIcon size={14} />
    {children}
  </span>
);

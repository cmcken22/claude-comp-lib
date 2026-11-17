import { AGENTS, SEVERITY, sectionName } from '../../config';
import { formatRange } from '../../lib/format';
import { sortFindings } from '../../lib/review';
import type { AgentId, Finding } from '../../types';
import { StatusBadge } from '../common/Badges';

export interface FindingTableProps {
  agent: AgentId;
  findings: Finding[];
  selectedId: string | null;
  onOpen: (id: string) => void;
}

/** Findings of one agent as a scannable table. */
export function FindingTable({ agent, findings, selectedId, onOpen }: FindingTableProps) {
  const gap = agent === 'gap';
  const rows = sortFindings(findings);
  return (
    <div className="sa-table-wrap">
      <table className="sa-table sa-table--findings">
        <caption className="sa-table__caption">
          {AGENTS[agent].name} · {gap ? 'five most likely gaps' : `${rows.length} findings`}
        </caption>
        <thead>
          <tr>
            <th scope="col">Severity</th>
            <th scope="col">{gap ? 'Potential scope gap' : 'Finding'}</th>
            <th scope="col">Section</th>
            {gap && <th scope="col" className="sa-num">Confidence</th>}
            {gap && <th scope="col" className="sa-num">Est. pricing</th>}
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className={`${f.status !== 'open' ? 'sa-table__row--muted' : ''}${selectedId === f.id ? ' sa-table__row--current' : ''}`}>
              <td><span className={`sa-sev sa-sev--${f.severity}`}>{SEVERITY[f.severity].label}</span></td>
              <th scope="row">
                <button type="button" className="sa-table__link" onClick={() => onOpen(f.id)}>
                  <span className="sa-mono">{f.id}</span> {f.title}
                </button>
              </th>
              <td className="sa-nowrap">{sectionName(f.sectionKey)}</td>
              {gap && <td className="sa-num sa-mono">{f.confidence}%</td>}
              {gap && <td className="sa-num sa-mono sa-nowrap">{formatRange(f.priceLow!, f.priceHigh!)}</td>}
              <td>{f.status === 'open' ? <span className="sa-muted">Open</span> : <StatusBadge status={f.status} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

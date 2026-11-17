import { ITEM_KIND } from '../../config';
import { formatDate } from '../../lib/format';
import type { ScopeMeta, ScopeSection } from '../../types';

export interface DocumentPreviewProps {
  meta: ScopeMeta;
  sections: ScopeSection[];
  version: string;
  preparedBy: string;
  preparedAt: string;
  reviewStatus: string;
  watermark?: string;
}

/** Paper-style rendering of the Schedule A as it would be exported. */
export function DocumentPreview({ meta, sections, version, preparedBy, preparedAt, reviewStatus, watermark }: DocumentPreviewProps) {
  return (
    <div className="sa-paper" aria-label="Schedule A document preview">
      {watermark && <span className="sa-paper__watermark" aria-hidden="true">{watermark}</span>}
      <header className="sa-paper__head">
        <p className="sa-paper__kicker">Schedule A — Scope of Work</p>
        <h3 className="sa-paper__title">{meta.title.replace(/^Schedule A — /, '')}</h3>
        <dl className="sa-paper__facts">
          <div><dt>Project</dt><dd>{meta.projectNumber} · {meta.projectName}</dd></div>
          <div><dt>Subcontract</dt><dd>{meta.requisition}</dd></div>
          <div><dt>Subcontractor</dt><dd>{meta.subcontractor}</dd></div>
          <div><dt>Trade / Division</dt><dd>{meta.trade} · {meta.division}</dd></div>
          <div><dt>Version</dt><dd>{version}</dd></div>
          <div><dt>Prepared</dt><dd>{preparedBy} · {formatDate(preparedAt)}</dd></div>
          <div><dt>Review status</dt><dd>{reviewStatus}</dd></div>
        </dl>
      </header>
      {meta.description && <p className="sa-paper__intro">{meta.description}</p>}
      {sections.map((s, si) => (
        <section key={s.id} className="sa-paper__section">
          <h4>{si + 1}.0 {s.name}</h4>
          {s.items.length === 0 ? (
            <p className="sa-paper__none">No clauses.</p>
          ) : (
            <ol>
              {s.items.map((it, ii) => (
                <li key={it.id}>
                  <span className="sa-paper__num">{si + 1}.{ii + 1}</span>
                  <span>
                    {it.kind !== 'inclusion' && <em>{ITEM_KIND[it.kind].label}: </em>}
                    {it.text}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
      <footer className="sa-paper__foot">{meta.code} · {version} · Page 1 of {Math.max(1, Math.ceil(sections.length / 3))}</footer>
    </div>
  );
}

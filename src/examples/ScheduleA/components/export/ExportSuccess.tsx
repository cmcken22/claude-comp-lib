import { CheckCircleIcon } from '../../icons';
import type { ScopeMeta } from '../../types';

export type ExportKind = 'pdf' | 'word' | 'attach';

/** Confirmation after a simulated export. */
export function ExportSuccess({ kind, version, meta }: { kind: ExportKind; version: string; meta: ScopeMeta }) {
  const file = `${meta.code}_ScheduleA_${version}.${kind === 'word' ? 'docx' : 'pdf'}`;
  return (
    <div className="sa-success">
      <span className="sa-success__icon"><CheckCircleIcon size={36} /></span>
      <h3 className="sa-success__title">
        {kind === 'attach' ? `Attached to ${meta.requisition.split(' · ')[0]}` : `${kind === 'pdf' ? 'PDF' : 'Word document'} ready`}
      </h3>
      <p className="sa-mono">{file}</p>
      <p className="sa-muted">
        {kind === 'attach'
          ? `Schedule A ${version} is now listed under Attachments on the requisition in Gate Three. The requisition owner has been notified.`
          : `Schedule A ${version} was saved to the scope's export history. In production this downloads the file.`}
      </p>
    </div>
  );
}

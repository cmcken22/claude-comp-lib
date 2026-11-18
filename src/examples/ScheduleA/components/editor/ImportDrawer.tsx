import { useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '../../../../components/Button';
import { Drawer } from '../../../../components/Drawer';
import { TextArea } from '../../../../components/TextArea';
import { useSA } from '../../hooks/context';
import { parseClauses, SAMPLE_IMPORT, type ParsedClause } from '../../lib/importParser';
import { newId } from '../../lib/scope';
import { ImportIcon, UploadIcon } from '../../icons';
import { ImportPreview } from './ImportPreview';

const READABLE = /\.(txt|csv|md)$/i;

/** Bring in text from drawing and specification reviews: paste it or upload a file, then pick clauses. */
export function ImportDrawer() {
  const { ui, dispatch, toast } = useSA();
  const open = ui.dialog === 'import';
  const [text, setText] = useState('');
  const [source, setSource] = useState('Pasted text');
  const [note, setNote] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedClause[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (open) { setText(''); setParsed(null); setNote(null); setSource('Pasted text'); }
  }, [open]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSource(file.name);
    if (READABLE.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => { setText(String(reader.result ?? '')); setNote(null); };
      reader.readAsText(file);
    } else {
      // Word, PDF and Excel extraction is a server job; the prototype shows sample extracted text.
      setText(SAMPLE_IMPORT);
      setNote(`Text extraction from ${file.name.split('.').pop()?.toUpperCase()} files is simulated here, so sample specification text is shown. Plain text and CSV files are read as-is.`);
    }
    e.target.value = '';
  };

  const find = () => {
    const result = parseClauses(text);
    setParsed(result);
    setPicked(result.map((c) => c.id));
  };

  const importNow = () => {
    const chosen = (parsed ?? []).filter((c) => picked.includes(c.id));
    chosen.forEach((c) => dispatch({ type: 'addItemToKey', sectionKey: c.sectionKey, item: { id: newId('i'), text: c.text, kind: c.kind, critical: false, tags: [], origin: { type: 'import', ref: source } } }));
    ui.setDialog(null);
    toast.push(`${chosen.length} ${chosen.length === 1 ? 'clause' : 'clauses'} imported from ${source}. Review them in each section.`);
  };

  const footer = parsed ? (
    <div className="sa-drawer-actions">
      <Button variant="ghost" onClick={() => setParsed(null)}>Back to text</Button>
      <Button disabled={picked.length === 0} onClick={importNow}>Import {picked.length} {picked.length === 1 ? 'clause' : 'clauses'}</Button>
    </div>
  ) : (
    <div className="sa-drawer-actions">
      <Button variant="ghost" onClick={() => ui.setDialog(null)}>Cancel</Button>
      <Button disabled={text.trim().length < 20} onClick={find}>Find clauses</Button>
    </div>
  );

  return (
    <Drawer open={open} onClose={() => ui.setDialog(null)} title="Import from drawings and specifications" icon={<ImportIcon />} size="lg" footer={footer}>
      {parsed ? (
        <ImportPreview clauses={parsed} picked={picked} onPick={setPicked} onChange={setParsed} source={source} />
      ) : (
        <div className="sa-stack">
          <p className="sa-muted">Paste notes from your drawing and specification review, or upload a file. Numbered and bulleted lines become separate clauses, sorted into sections you can change before importing.</p>
          <div className="sa-import__source">
            <label className="sa-upload">
              <UploadIcon size={16} />
              <span>Upload file</span>
              <input type="file" accept=".txt,.csv,.md,.docx,.pdf,.xlsx" onChange={onFile} />
            </label>
            <span className="sa-muted">Word, PDF, Excel, CSV or text</span>
            <button type="button" className="sa-link" onClick={() => { setText(SAMPLE_IMPORT); setSource('Spec 23 05 00 (sample)'); setNote(null); }}>Use sample spec text</button>
          </div>
          {note && <p className="sa-banner sa-banner--info">{note}</p>}
          <TextArea
            aria-label="Text to import"
            className="sa-import__text"
            rows={16}
            value={text}
            placeholder={'Paste text here, for example:\n3.1 Install seismic restraints for all ductwork and piping…\n3.2 Provide sleeves and firestopping at rated penetrations…'}
            onChange={(e) => { setText(e.target.value); if (source !== 'Pasted text' && !e.target.value) setSource('Pasted text'); }}
          />
        </div>
      )}
    </Drawer>
  );
}

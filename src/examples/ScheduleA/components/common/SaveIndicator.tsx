import { TODAY } from '../../data/project';
import { formatTime } from '../../lib/format';
import { AlertIcon, CheckIcon } from '../../icons';
import type { SaveState } from '../../types';

/** Visible autosave state for the draft. */
export function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <span className={`sa-save sa-save--${state}`} aria-live="polite">
      {state === 'saving' && (
        <>
          <span className="sa-spinner" aria-hidden="true" /> Saving…
        </>
      )}
      {state === 'saved' && (
        <>
          <CheckIcon size={14} /> Saved {formatTime(TODAY)}
        </>
      )}
      {state === 'error' && (
        <>
          <AlertIcon size={14} /> Not saved — retrying
        </>
      )}
    </span>
  );
}

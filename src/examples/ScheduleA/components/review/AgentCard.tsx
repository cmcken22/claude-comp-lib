import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Button';
import { AGENTS, RUN_DURATION } from '../../config';
import { TODAY } from '../../data/project';
import { formatRelative } from '../../lib/format';
import { AlertIcon, CheckCircleIcon, RefreshIcon, SparkleIcon } from '../../icons';
import type { AgentId, AgentRun } from '../../types';

export interface AgentCardProps {
  agent: AgentId;
  run: AgentRun;
  outdated: boolean;
  disabled: boolean;
  onRun: () => void;
}

/** Run status, timestamp and findings count for one review agent. */
export function AgentCard({ agent, run, outdated, disabled, onRun }: AgentCardProps) {
  const info = AGENTS[agent];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (run.status !== 'running') return;
    setStage(0);
    const t = window.setInterval(() => setStage((s) => Math.min(s + 1, info.stages.length - 1)), RUN_DURATION / info.stages.length);
    return () => window.clearInterval(t);
  }, [run.status, info.stages.length]);

  const state = run.status === 'complete' && outdated ? 'outdated' : run.status;
  const label = { idle: 'Not run', running: 'Running', complete: 'Complete', failed: 'Failed', outdated: 'Out of date' }[state];

  return (
    <article className={`sa-agent sa-agent--${state}`} aria-busy={run.status === 'running'}>
      <header className="sa-agent__head">
        <span className="sa-agent__icon"><SparkleIcon size={18} /></span>
        <div>
          <h3 className="sa-agent__name">{info.name}</h3>
          <p className="sa-agent__desc">{info.description}</p>
        </div>
        <span className={`sa-run-status sa-run-status--${state}`}>{label}</span>
      </header>

      {run.status === 'running' ? (
        <div className="sa-agent__progress" role="status">
          <div className="sa-progress"><span style={{ width: `${((stage + 1) / info.stages.length) * 100}%` }} /></div>
          <span className="sa-muted">{info.stages[stage]}…</span>
        </div>
      ) : (
        <ul className="sa-agent__checks">
          {info.checks.map((c) => <li key={c}>{c}</li>)}
        </ul>
      )}

      {run.status === 'failed' && (
        <p className="sa-banner sa-banner--error" role="alert"><AlertIcon size={16} /> {run.error}</p>
      )}
      {state === 'outdated' && (
        <p className="sa-banner sa-banner--warning"><AlertIcon size={16} /> The scope changed after this run. Rerun to refresh findings.</p>
      )}

      <footer className="sa-agent__foot">
        <span className="sa-agent__stamp">
          {run.at ? (
            <>
              <CheckCircleIcon size={14} /> Last run {formatRelative(run.at, TODAY)} · {run.findingCount} findings
            </>
          ) : (
            'Never run on this scope'
          )}
        </span>
        <Button size="sm" variant={run.status === 'idle' ? 'primary' : 'outline'} loading={run.status === 'running'} disabled={disabled} startIcon={run.status === 'idle' ? <SparkleIcon size={16} /> : <RefreshIcon size={16} />} onClick={onRun}>
          {run.status === 'idle' ? 'Run agent' : run.status === 'running' ? 'Running' : 'Rerun'}
        </Button>
      </footer>
    </article>
  );
}

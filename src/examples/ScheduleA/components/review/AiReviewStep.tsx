import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { useSA } from '../../hooks/context';
import { isOutdated } from '../../lib/review';
import { SparkleIcon } from '../../icons';
import type { AgentId } from '../../types';
import { AgentCard } from './AgentCard';
import { FindingTable } from './FindingTable';
import { ReviewSummary } from './ReviewSummary';

const AGENT_IDS: AgentId[] = ['language', 'gap'];

/** Step 4: run both review agents and scan their findings. */
export function AiReviewStep() {
  const { ws, ui, can, runAgent } = useSA();
  const anyRunning = AGENT_IDS.some((a) => ws.runs[a].status === 'running');

  const open = (id: string) => {
    ui.openFinding(id);
    ui.setPanelOpen(true);
  };

  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">AI Review</h2>
          <p className="sa-step-head__sub">Agents compare the draft with {ws.selectedDocIds.length} reference documents. Results are deterministic in this prototype.</p>
        </div>
        <div className="sa-toolbar">
          <Button size="sm" startIcon={<SparkleIcon size={16} />} disabled={!can.edit || anyRunning} onClick={() => AGENT_IDS.forEach(runAgent)}>
            Run both agents
          </Button>
        </div>
      </div>

      <div className="sa-agents">
        {AGENT_IDS.map((a) => (
          <AgentCard key={a} agent={a} run={ws.runs[a]} outdated={isOutdated(ws, a)} disabled={!can.edit || ws.runs[a].status === 'running'} onRun={() => runAgent(a)} />
        ))}
      </div>

      <Card padding="lg" as="section" aria-label="Review summary">
        <ReviewSummary />
      </Card>

      {AGENT_IDS.map((a) => {
        const list = ws.findings.filter((f) => f.agent === a);
        if (ws.runs[a].status === 'running') {
          return (
            <Card key={a} padding="lg" className="sa-skeleton-card" aria-busy="true">
              <span className="sa-skeleton" /><span className="sa-skeleton" /><span className="sa-skeleton sa-skeleton--short" />
            </Card>
          );
        }
        if (!list.length) return null;
        return (
          <Card key={a} padding="none" as="section">
            <FindingTable agent={a} findings={list} selectedId={ui.selectedFindingId} onOpen={open} />
          </Card>
        );
      })}
    </div>
  );
}

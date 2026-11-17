import { AppShell } from './components/AppShell';
import { BudgetPanel } from './components/BudgetPanel';
import { ContractSummary } from './components/ContractSummary';
import { PageHeader } from './components/PageHeader';
import { budgetLines, type BudgetLine } from './data';
import { useBudgetTable } from './hooks/useBudgetTable';
import { downloadCsv } from './lib/csv';
import './ConstructionDashboard.scss';

export interface ConstructionDashboardProps {
  /** Project shown in the navbar picker and page title. */
  projectName?: string;
}

/** Example page: budget overview for one construction project, built from the library's components. */
export function ConstructionDashboard({ projectName = 'Harbor View Tower' }: ConstructionDashboardProps) {
  const table = useBudgetTable(budgetLines);

  const exportLines = (lines: BudgetLine[]) =>
    downloadCsv(lines, table.visibleColumns, `${projectName.toLowerCase().replace(/\W+/g, '-')}-budget.csv`);

  return (
    <AppShell projectName={projectName}>
      <div className="cd-page">
        <PageHeader projectName={projectName} onExport={() => exportLines(table.rows)} />
        <ContractSummary lines={budgetLines} />
        <BudgetPanel table={table} onExport={exportLines} />
      </div>
    </AppShell>
  );
}

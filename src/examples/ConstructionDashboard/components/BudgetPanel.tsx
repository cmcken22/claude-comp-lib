import { useId, useState } from 'react';
import { Card } from '../../../components/Card';
import type { DivisionTab as DivisionTabId, BudgetTableState } from '../hooks/useBudgetTable';
import { countActiveFilters } from '../views';
import { ActiveFiltersBar } from './ActiveFiltersBar';
import { BudgetTable } from './BudgetTable';
import { DivisionTabs, tabId } from './DivisionTabs';
import { FilterDrawer } from './FilterDrawer';
import { Pagination } from './Pagination';
import { TableToolbar } from './TableToolbar';

export interface BudgetPanelProps {
  table: BudgetTableState;
  /** Called with the lines to export (filtered or selected). */
  onExport: (lines: BudgetTableState['rows']) => void;
}

/** The card holding division tabs, toolbar, filter chips, table and pagination. */
export function BudgetPanel({ table, onExport }: BudgetPanelProps) {
  const panelId = useId();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Card as="section" padding="none" className="cd-panel" aria-label="Budget lines">
      <DivisionTabs
        tabs={table.tabs}
        value={table.division}
        onChange={(id) => table.setDivision(id as DivisionTabId)}
        panelId={panelId}
      />

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(panelId, table.division)} className="cd-panel__body">
        <TableToolbar
          view={table.view}
          onViewChange={table.setView}
          activeFilterCount={countActiveFilters(table.filters)}
          onOpenFilters={() => setFiltersOpen(true)}
          hiddenColumns={table.hidden}
          onToggleColumn={table.toggleColumn}
          onResetColumns={table.resetColumns}
          query={table.query}
          onQueryChange={table.setQuery}
        />

        <ActiveFiltersBar
          filters={table.filters}
          onFiltersChange={table.setFilters}
          selectedCount={table.selected.size}
          onExportSelected={() => onExport(table.selectedLines)}
          onClearSelection={table.clearSelection}
        />

        <BudgetTable
          columns={table.visibleColumns}
          rows={table.pageRows}
          totalRows={table.rows}
          sort={table.sort}
          onSort={table.toggleSort}
          selected={table.selected}
          onToggleRow={table.toggleRow}
          allSelected={table.allOnPageSelected}
          someSelected={table.someOnPageSelected}
          onTogglePage={table.togglePage}
          onReset={table.resetAll}
        />

        <Pagination
          page={table.currentPage}
          pageCount={table.pageCount}
          pageSize={table.pageSize}
          totalCount={table.rows.length}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      </div>

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={table.filters}
        onApply={table.setFilters}
      />
    </Card>
  );
}

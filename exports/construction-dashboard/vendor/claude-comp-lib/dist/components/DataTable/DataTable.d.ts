import { ReactNode } from 'react';
export type SortDirection = 'asc' | 'desc';
export type SortValue = string | number | Date | null | undefined;
export interface DataTableColumn<T> {
    /** Unique column id. */
    id: string;
    /** Header content. */
    header: ReactNode;
    /** Raw value used for sorting, searching and the default cell. */
    accessor?: (row: T) => SortValue;
    /** Custom cell renderer. Defaults to the accessor's value. */
    cell?: (row: T) => ReactNode;
    /** Allow sorting by this column. Needs an `accessor`. */
    sortable?: boolean;
    /** Include this column's accessor value in the search text. Default true. */
    searchable?: boolean;
    align?: 'start' | 'center' | 'end';
    /** CSS width, e.g. "12rem" or "20%". */
    width?: string;
}
export interface DataTableFilterOption {
    value: string;
    label: string;
}
export interface DataTableFilter<T> {
    id: string;
    /** Accessible label; also the "all" option text (e.g. "All statuses"). */
    label: string;
    allLabel?: string;
    options: DataTableFilterOption[];
    /** The value a row has for this filter; compared to the chosen option. */
    getValue: (row: T) => string;
}
export interface DataTableSort {
    columnId: string;
    direction: SortDirection;
}
export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    /** Stable id for each row. */
    getRowId: (row: T) => string;
    /** Accessible name for the table. */
    caption: string;
    /** Show the caption visibly above the table. Default false (screen readers only). */
    showCaption?: boolean;
    /** Show the search field. Default true. */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Text matched against the search query. Defaults to the searchable columns' accessor values. */
    getSearchText?: (row: T) => string;
    /** Dropdown filters shown in the toolbar. */
    filters?: DataTableFilter<T>[];
    /** Extra toolbar content at the end, e.g. an "Export" button. */
    toolbarActions?: ReactNode;
    /** Show row checkboxes. */
    selectable?: boolean;
    /** Actions shown when rows are selected. Receives the selected rows. */
    bulkActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode;
    initialSort?: DataTableSort;
    /** Rows per page. Set to 0 to disable pagination. */
    pageSize?: number;
    pageSizeOptions?: number[];
    /** Shown when no rows match. */
    emptyState?: ReactNode;
    /** Visual density of rows. */
    density?: 'compact' | 'comfortable';
    className?: string;
}
/**
 * A table with built-in search, dropdown filters, sortable columns,
 * row selection with bulk actions, and pagination. All client-side.
 */
export declare function DataTable<T>({ data, columns, getRowId, caption, showCaption, searchable, searchPlaceholder, getSearchText, filters, toolbarActions, selectable, bulkActions, initialSort, pageSize: initialPageSize, pageSizeOptions, emptyState, density, className, }: DataTableProps<T>): import("react").JSX.Element;

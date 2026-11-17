import { Select } from '../../../components/Select';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { PAGE_SIZES } from '../views';

export interface PaginationProps {
  /** Zero-based. */
  page: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/** Rows-per-page picker, range summary and previous/next buttons. */
export function Pagination({ page, pageCount, pageSize, totalCount, onPageChange, onPageSizeChange }: PaginationProps) {
  const first = page * pageSize + 1;
  const last = Math.min((page + 1) * pageSize, totalCount);

  return (
    <div className="cd-pagination">
      <label className="cd-pagination__size">
        Rows per page
        <Select size="sm" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </label>
      <span className="cd-pagination__range" aria-live="polite">
        {totalCount === 0 ? '0 lines' : `${first}–${last} of ${totalCount} lines`}
      </span>
      <div className="cd-pagination__nav">
        <button
          type="button"
          className="cd-icon-button"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          type="button"
          className="cd-icon-button"
          aria-label="Next page"
          disabled={page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

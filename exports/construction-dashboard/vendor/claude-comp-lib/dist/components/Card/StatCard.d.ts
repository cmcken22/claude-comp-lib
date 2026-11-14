import { HTMLAttributes, ReactNode } from 'react';
export type StatTrend = 'up' | 'down' | 'flat';
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
    /** What is being measured. */
    label: ReactNode;
    /** The headline figure, already formatted. */
    value: ReactNode;
    /** Change versus a previous period, already formatted (e.g. "+12%"). */
    delta?: ReactNode;
    /** Direction of the change; sets the arrow. */
    trend?: StatTrend;
    /**
     * Whether the change is good or bad. Defaults to "up is good"; set
     * `positive` explicitly for metrics where going down is the good outcome.
     */
    positive?: boolean;
    /** Context for the delta, e.g. "vs last month". */
    deltaLabel?: ReactNode;
    /** Decorative icon in the top corner. */
    icon?: ReactNode;
    /** Extra content under the value, e.g. a Progress bar. */
    footer?: ReactNode;
}
/** A single key metric with an optional change indicator. */
export declare function StatCard({ label, value, delta, trend, positive, deltaLabel, icon, footer, className, ...rest }: StatCardProps): import("react").JSX.Element;

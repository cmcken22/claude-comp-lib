import type { Meta, StoryObj } from '@storybook/react';
import { ConstructionDashboard } from './ConstructionDashboard';

const meta = {
  title: 'Examples/Construction Dashboard',
  component: ConstructionDashboard,
  parameters: { layout: 'fullscreen' },
  args: { projectName: 'Harbor View Tower' },
} satisfies Meta<typeof ConstructionDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Project budget overview built from the global Navbar and Sidebar plus library components:
 * stat cards, division tabs, saved views, a filter drawer, column chooser, search,
 * sortable columns, row selection with CSV export, totals and pagination.
 */
export const Default: Story = {};

/** Narrow the viewport: the sidebar becomes a drawer opened from the navbar menu button. */
export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

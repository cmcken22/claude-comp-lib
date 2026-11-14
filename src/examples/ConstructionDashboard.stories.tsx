import type { Meta, StoryObj } from '@storybook/react';
import { ConstructionDashboard } from './ConstructionDashboard';

const meta = {
  title: 'Examples/Construction Dashboard',
  component: ConstructionDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full page composed from library components: `AppShell` with `Sidebar` and `Navbar`, a row of `StatCard`s, and a `Card` holding a `DataTable` with search, filters, sorting, selection and pagination.',
      },
    },
  },
} satisfies Meta<typeof ConstructionDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile2' } },
};

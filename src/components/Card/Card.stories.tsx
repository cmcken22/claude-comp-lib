import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Progress } from '../Progress';
import { Card } from './Card';
import { StatCard } from './StatCard';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Site inspection',
    description: 'Scheduled for Thursday, 9:00 AM.',
    actions: <Button size="sm" variant="secondary">Reschedule</Button>,
    children: <p style={{ margin: 0 }}>Bring the updated structural drawings and the rebar delivery receipts.</p>,
  },
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    actions: { control: false },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StatCards: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: 16 }}>
      <StatCard label="Active projects" value="31" delta="+3" trend="up" deltaLabel="since last quarter" />
      <StatCard label="Change orders" value="14" delta="+5" trend="up" positive={false} deltaLabel="vs last month" />
      <StatCard label="Open RFIs" value="22" delta="-6" trend="down" positive deltaLabel="vs last month" />
      <StatCard
        label="Budget spent"
        value="58%"
        footer={<Progress value={58} tone="warning" size="sm" label="Budget spent" showValue />}
      />
    </div>
  ),
};

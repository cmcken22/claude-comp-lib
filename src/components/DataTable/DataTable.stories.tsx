import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { DataTable, type DataTableColumn } from './DataTable';

interface Crew {
  id: string;
  name: string;
  trade: string;
  site: string;
  size: number;
  certified: boolean;
}

const trades = ['Concrete', 'Electrical', 'Framing', 'Plumbing', 'Steel', 'Roofing'];
const sites = ['Riverside', 'Harbor View', 'Cedar Ridge', 'Summit Hub'];
const crews: Crew[] = Array.from({ length: 27 }, (_, i) => ({
  id: `C-${100 + i}`,
  name: `${trades[i % trades.length]} crew ${Math.floor(i / trades.length) + 1}`,
  trade: trades[i % trades.length],
  site: sites[(i * 7) % sites.length],
  size: 4 + ((i * 5) % 11),
  certified: i % 4 !== 0,
}));

const columns: DataTableColumn<Crew>[] = [
  { id: 'id', header: 'ID', accessor: (c) => c.id, sortable: true },
  { id: 'name', header: 'Crew', accessor: (c) => c.name, sortable: true },
  { id: 'trade', header: 'Trade', accessor: (c) => c.trade, sortable: true },
  { id: 'site', header: 'Site', accessor: (c) => c.site, sortable: true },
  { id: 'size', header: 'Size', accessor: (c) => c.size, sortable: true, align: 'end' },
  {
    id: 'certified',
    header: 'Safety cert.',
    accessor: (c) => (c.certified ? 'Current' : 'Expired'),
    cell: (c) => <Badge tone={c.certified ? 'success' : 'danger'} dot>{c.certified ? 'Current' : 'Expired'}</Badge>,
  },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Crew>,
  tags: ['autodocs'],
  args: {
    caption: 'Crews',
    data: crews,
    columns,
    getRowId: (c: Crew) => c.id,
    filters: [
      { id: 'trade', label: 'Trade', allLabel: 'All trades', options: trades.map((t) => ({ value: t, label: t })), getValue: (c: Crew) => c.trade },
      { id: 'site', label: 'Site', allLabel: 'All sites', options: sites.map((s) => ({ value: s, label: s })), getValue: (c: Crew) => c.site },
    ],
    pageSize: 10,
    density: 'comfortable',
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'comfortable'] },
    data: { control: false },
    columns: { control: false },
    filters: { control: false },
  },
  decorators: [(Story) => <Card padding="none"><Story /></Card>],
} satisfies Meta<typeof DataTable<Crew>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selectable: Story = {
  args: {
    selectable: true,
    bulkActions: (rows) => <Button size="sm" variant="secondary">Message {rows.length} crews</Button>,
  },
};

export const Compact: Story = {
  args: { density: 'compact', pageSize: 0 },
};

export const Empty: Story = {
  args: { data: [] },
};

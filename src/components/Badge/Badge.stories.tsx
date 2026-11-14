import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../stories/Stack';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'On track', tone: 'success', dot: true, size: 'md' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'accent', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap={8}>
      <Badge dot>On hold</Badge>
      <Badge tone="accent" dot>Completed</Badge>
      <Badge tone="success" dot>On track</Badge>
      <Badge tone="warning" dot>At risk</Badge>
      <Badge tone="danger" dot>Delayed</Badge>
      <Badge size="sm">12</Badge>
    </Stack>
  ),
};

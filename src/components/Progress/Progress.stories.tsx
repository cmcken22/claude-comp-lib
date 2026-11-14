import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../stories/Stack';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 62, label: 'Project progress', showValue: true, tone: 'accent', size: 'md' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <Stack gap={12}>
      <Progress value={45} label="Accent" showValue />
      <Progress value={80} tone="success" label="Success" showValue />
      <Progress value={60} tone="warning" label="Warning" showValue />
      <Progress value={95} tone="danger" size="sm" label="Danger" showValue />
    </Stack>
  ),
};

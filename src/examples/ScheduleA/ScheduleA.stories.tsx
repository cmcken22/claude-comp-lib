import type { Meta, StoryObj } from '@storybook/react';
import { ScheduleA } from './ScheduleA';

const meta = {
  title: 'Examples/Schedule A',
  component: ScheduleA,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScheduleA>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Scope Editor with the populated mechanical draft (default screen). */
export const Default: Story = {};

/** Step 1: scope details and the project's scope register. */
export const ScopeDetails: Story = { args: { initialStep: 'details' } };

/** Step 3: reference-document selection. */
export const ReferenceDocuments: Story = { args: { initialStep: 'references' } };

/** Step 4: both agents complete, with mixed finding statuses. */
export const AiReview: Story = { args: { initialStep: 'review' } };

/** Step 5: readiness checks and export confirmation dialog. */
export const ExportPreview: Story = { args: { initialStep: 'export', initialDialog: 'export' } };

/** Empty state for a brand-new scope. */
export const NewScope: Story = { args: { startNew: true } };

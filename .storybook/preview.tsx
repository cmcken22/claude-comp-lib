import type { Preview } from '@storybook/react';
import '../src/styles/index.scss';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Layout', 'Global', 'Examples'] },
    },
  },
};

export default preview;

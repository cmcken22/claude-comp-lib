import type { Decorator, Preview } from '@storybook/react';
import '../src/styles/index.scss';

const withTheme: Decorator = (Story, context) => {
  // Set synchronously so stories that read computed token values see the active theme.
  document.documentElement.dataset.theme = context.globals.theme ?? 'light';
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Layout', 'Examples'] },
    },
  },
};

export default preview;

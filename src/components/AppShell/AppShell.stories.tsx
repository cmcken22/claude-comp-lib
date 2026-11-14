import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Card } from '../Card';
import { BuildingIcon, CalendarIcon, HomeIcon, SettingsIcon, UsersIcon } from '../../stories/icons';
import { AppShell } from './AppShell';
import { Navbar } from './Navbar';
import { Sidebar, SidebarItem, SidebarSection } from './Sidebar';

const sidebar = (
  <Sidebar brand={<strong>◆ Acme</strong>} footer={<small>v1.0.0</small>}>
    <SidebarSection title="Workspace">
      <SidebarItem href="#" icon={<HomeIcon />} active>Home</SidebarItem>
      <SidebarItem href="#" icon={<BuildingIcon />}>Projects</SidebarItem>
      <SidebarItem href="#" icon={<CalendarIcon />}>Schedule</SidebarItem>
      <SidebarItem href="#" icon={<UsersIcon />}>Team</SidebarItem>
    </SidebarSection>
    <SidebarSection>
      <SidebarItem href="#" icon={<SettingsIcon />}>Settings</SidebarItem>
    </SidebarSection>
  </Sidebar>
);

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    sidebar,
    navbar: <Navbar title="Home" actions={<Button size="sm">New</Button>} />,
    children: (
      <Card title="Welcome" description="The sidebar pins at 1024px and up; below that, use the menu button.">
        <p style={{ margin: 0 }}>Main content goes here.</p>
      </Card>
    ),
    maxWidth: 'full',
  },
  argTypes: {
    maxWidth: { control: 'inline-radio', options: ['lg', 'xl', 'full'] },
    sidebar: { control: false },
    navbar: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DrawerOpen: Story = {
  args: { defaultSidebarOpen: true },
  parameters: { viewport: { defaultViewport: 'mobile2' } },
};

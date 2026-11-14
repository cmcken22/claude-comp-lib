import { Button, Input, Navbar } from 'claude-comp-lib';
import type { Theme } from '../hooks';
import { Icon } from '../icons';

interface TopNavbarProps {
  title: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export function TopNavbar({ title, theme, onToggleTheme }: TopNavbarProps) {
  return (
    <Navbar
      title={title}
      menuLabel="Toggle sidebar"
      actions={
        <>
          <Button
            variant="ghost"
            size="sm"
            className="cd-icon-button"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            startIcon={<Icon name={theme === 'dark' ? 'sun' : 'moon'} />}
            onClick={onToggleTheme}
          />
          <Button variant="ghost" size="sm" className="cd-icon-button cd-hide-sm" aria-label="Help" startIcon={<Icon name="help" />} />
          <span className="cd-bell">
            <Button variant="ghost" size="sm" className="cd-icon-button" aria-label="Notifications, 3 unread" startIcon={<Icon name="bell" />} />
            <span className="cd-bell__dot" aria-hidden="true" />
          </span>
          <span className="cd-avatar" role="img" aria-label="Jordan Reyes">
            JR
          </span>
        </>
      }
    >
      <Input
        className="cd-global-search"
        size="sm"
        type="search"
        placeholder="Search projects, crews, documents…"
        aria-label="Search everything"
        startAdornment={<Icon name="search" />}
      />
    </Navbar>
  );
}

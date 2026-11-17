import { ROLES } from '../config';
import { useSA } from '../hooks/context';
import type { Role } from '../types';

/** Prototype-only control for previewing permissions. Lives in the navbar, away from product UI. */
export function RoleSwitcher() {
  const { ui } = useSA();
  return (
    <label className="sa-role" title="Prototype only: preview what each role can do">
      <span className="sa-role__label">View as</span>
      <select className="sa-role__select" value={ui.role} onChange={(e) => ui.setRole(e.target.value as Role)}>
        {(Object.keys(ROLES) as Role[]).map((r) => (
          <option key={r} value={r}>{ROLES[r].label}</option>
        ))}
      </select>
    </label>
  );
}

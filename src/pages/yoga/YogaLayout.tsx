import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import styles from './YogaLayout.module.css';

const TABS = [
  { to: '/yoga/all', label: 'All Practices' },
  { to: '/yoga/my', label: 'My Practices' },
  { to: '/yoga/progress', label: 'Progress' },
] as const;

export default function YogaLayout() {
  const location = useLocation();
  if (location.pathname === '/yoga') {
    return <Navigate to="/yoga/my" replace />;
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.subNav} aria-label="Yoga sections">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `${styles.subTab} ${isActive ? styles.subTabActive : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

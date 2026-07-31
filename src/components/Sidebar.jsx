import { NavLink } from 'react-router-dom';
import { BookOpen, CheckSquare, Home, Package } from 'lucide-react';
import logoIcon from '../assets/logonobg.png';

export default function Sidebar() {
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Inventory', path: '/inventory', icon: Package },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src={logoIcon} alt="" />
        <h2>HubNotes</h2>
      </div>

      <nav className="sidebar-nav" aria-label="App navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

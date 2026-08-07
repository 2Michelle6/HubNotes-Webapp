import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className={`app-shell${pathname.startsWith('/courses/') ? ' app-shell--course' : ''}`}>
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

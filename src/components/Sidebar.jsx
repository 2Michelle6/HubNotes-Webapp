import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Layers, Home, LogOut, Package } from "lucide-react";
import logoIcon from "../assets/logonobg.png";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Decks", path: "/decks", icon: Layers },
    { name: "Inventory", path: "/inventory", icon: Package },
  ];

  const showLogout = ["/home", "/courses", "/decks", "/inventory"].includes(
    pathname,
  );

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
              className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link--active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      {showLogout && (
        <button
          className="sidebar-logout"
          type="button"
          onClick={() => navigate("/", { replace: true })}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      )}
    </aside>
  );
}

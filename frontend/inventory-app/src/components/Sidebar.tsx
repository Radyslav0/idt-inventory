import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-tag">IDT Team</div>
        <h1>Inventory</h1>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/users"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Users
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Inventory
        </NavLink>
      </nav>
      <div className="sidebar-footer">Present Connection UAB</div>
    </aside>
  );
}

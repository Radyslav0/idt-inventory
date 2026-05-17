interface SidebarProps {
    page: 'users' | 'inventory';
    onNavigate: (page: 'users' | 'inventory') => void;
}

export function Sidebar({ page, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-tag">IDT Team</div>
                <h1>Inventory</h1>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-link ${page === 'users' ? 'active' : ''}`}
                    onClick={() => onNavigate('users')}
                >
                    Users
                </button>
                <button
                    className={`nav-link ${page === 'inventory' ? 'active' : ''}`}
                    onClick={() => onNavigate('inventory')}
                >
                    Inventory
                </button>
            </nav>

            <div className="sidebar-footer">Present Connection UAB</div>
        </aside>
    );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { role } = useAuth();

  const managerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/supervisors', label: 'Supervisors' },
  ];

  const supervisorLinks = [
    { to: '/products', label: 'Products' },
    { to: '/supervisors', label: 'Supervisors' },
  ];

  const salesLinks = [
    { to: '/products', label: 'Products' },
  ];

  const getLinks = () => {
    switch (role) {
      case 'MANAGER':
        return managerLinks;
      case 'SUPERVISOR':
        return supervisorLinks;
      case 'SALES':
        return salesLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

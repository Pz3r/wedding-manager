import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import {
  HomeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">Gestor de Boda</span>
            </Link>

            <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
              <NavLink to="/dashboard" icon={HomeIcon}>
                Panel
              </NavLink>
              <NavLink to="/guests" icon={UserGroupIcon}>
                Invitados
              </NavLink>
              <NavLink to="/invitations" icon={EnvelopeIcon}>
                Invitaciones
              </NavLink>
              <NavLink to="/responses" icon={ClipboardDocumentCheckIcon}>
                Respuestas
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={signOut}>
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <MobileNavLink to="/dashboard" icon={HomeIcon}>
            Panel
          </MobileNavLink>
          <MobileNavLink to="/guests" icon={UserGroupIcon}>
            Invitados
          </MobileNavLink>
          <MobileNavLink to="/invitations" icon={EnvelopeIcon}>
            Invitaciones
          </MobileNavLink>
          <MobileNavLink to="/responses" icon={ClipboardDocumentCheckIcon}>
            Respuestas
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
    >
      <Icon className="h-5 w-5 mr-1.5" />
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-600"
    >
      <Icon className="h-5 w-5 mb-1" />
      {children}
    </Link>
  );
}

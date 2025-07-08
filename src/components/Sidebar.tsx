import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  ShoppingBag,
  UserCheck,
  FolderKanban,
  Calculator,
  Factory,
  BarChart3,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), path: '/dashboard', module: 'dashboard' },
    { icon: Users, label: t('navigation.customers'), path: '/customers', module: 'customers' },
    { icon: Truck, label: t('navigation.suppliers'), path: '/suppliers', module: 'suppliers' },
    { icon: Package, label: t('navigation.inventory'), path: '/inventory', module: 'inventory' },
    { icon: ShoppingCart, label: t('navigation.sales'), path: '/sales', module: 'sales' },
    { icon: ShoppingBag, label: t('navigation.purchases'), path: '/purchases', module: 'purchases' },
    { icon: UserCheck, label: t('navigation.hr'), path: '/hr', module: 'hr' },
    { icon: FolderKanban, label: t('navigation.projects'), path: '/projects', module: 'projects' },
    { icon: Calculator, label: t('navigation.accounting'), path: '/accounting', module: 'accounting' },
    { icon: Factory, label: t('navigation.production'), path: '/production', module: 'production' },
    { icon: BarChart3, label: t('navigation.reports'), path: '/reports', module: 'reports' }
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.module));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">{t('sidebar.erpSystem')}</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
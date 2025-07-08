import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PurchaseOverview from '../components/purchase/PurchaseOverview';
import InvoiceManagement from '../components/purchase/InvoiceManagement';
import PaymentManagement from '../components/purchase/PaymentManagement';
import WithholdingTaxManagement from '../components/purchase/WithholdingTaxManagement';
import { usePurchase } from '../contexts/PurchaseContext';

const Purchases: React.FC = () => {
  const { t } = useLanguage();
  const { paymentAlerts } = usePurchase();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'withholding'>('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'withholding', label: 'Retenues', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PurchaseOverview />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'withholding':
        return <WithholdingTaxManagement />;
      default:
        return <PurchaseOverview />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Achats</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau bon de commande</span>
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'overview' && paymentAlerts.filter(alert => !alert.acknowledged).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {paymentAlerts.filter(alert => !alert.acknowledged).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {renderTabContent()}
    </div>
  );
};

export default Purchases;
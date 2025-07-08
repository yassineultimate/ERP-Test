import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download
} from 'lucide-react';
import { usePurchase } from '../contexts/PurchaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Purchases: React.FC = () => {
  const { 
    supplierInvoices, 
    supplierPayments, 
    paymentAlerts, 
    withholdingTaxes,
    getOverdueInvoices,
    getUpcomingPayments,
    getSupplierBalance,
    acknowledgeAlert
  } = usePurchase();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'withholding' | 'alerts'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Calculs des métriques
  const totalUnpaid = supplierInvoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const overdueInvoices = getOverdueInvoices();
  const upcomingPayments = getUpcomingPayments(7);
  const totalWithholdingTax = withholdingTaxes
    .filter(wt => wt.status === 'calculated')
    .reduce((sum, wt) => sum + wt.taxAmount, 0);

  const avgPaymentDelay = 15; // Calculé dynamiquement en production

  // Données pour les graphiques
  const monthlyData = [
    { month: 'Jan', invoices: 45000, payments: 42000, withholding: 1350 },
    { month: 'Fév', invoices: 52000, payments: 48000, withholding: 1560 },
    { month: 'Mar', invoices: 48000, payments: 45000, withholding: 1440 },
    { month: 'Avr', invoices: 61000, payments: 58000, withholding: 1830 },
    { month: 'Mai', invoices: 55000, payments: 52000, withholding: 1650 },
    { month: 'Juin', invoices: 67000, payments: 63000, withholding: 2010 }
  ];

  const supplierDistribution = [
    { name: 'Global Supplies Inc', value: 35, color: '#3B82F6' },
    { name: 'Premium Materials Co', value: 25, color: '#10B981' },
    { name: 'Tech Components Ltd', value: 20, color: '#F59E0B' },
    { name: 'Office Depot Pro', value: 12, color: '#EF4444' },
    { name: 'Autres', value: 8, color: '#8B5CF6' }
  ];

  const handlePayInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Factures impayées</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnpaid.toLocaleString()} €</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+5.2% vs mois dernier</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Factures en retard</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices.length}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">{overdueInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0).toLocaleString()} €</span>
              </div>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Échéances 7 jours</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingPayments.length}</p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">{upcomingPayments.reduce((sum, inv) => sum + inv.remainingAmount, 0).toLocaleString()} €</span>
              </div>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retenues à la source</p>
              <p className="text-2xl font-bold text-gray-900">{totalWithholdingTax.toLocaleString()} €</p>
              <div className="flex items-center mt-2">
                <FileText className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">À déclarer</span>
              </div>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Alertes importantes */}
      {paymentAlerts.filter(alert => !alert.acknowledged).length > 0 && (
        <Card className="p-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Alertes de paiement</h3>
              <div className="space-y-2">
                {paymentAlerts.filter(alert => !alert.acknowledged).map(alert => (
                  <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {alert.type === 'overdue' ? 'Facture en retard' : 'Échéance proche'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {alert.amount.toLocaleString()} € - Échéance: {new Date(alert.dueDate).toLocaleDateString()}
                          {alert.daysOverdue && ` (${alert.daysOverdue} jours de retard)`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Marquer comme lu
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="invoices" fill="#3B82F6" name="Factures" />
              <Bar dataKey="payments" fill="#10B981" name="Paiements" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par fournisseur</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {supplierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {supplierDistribution.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tableaux de bord rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Factures en retard</h3>
            <span className="text-sm text-red-600 font-medium">{overdueInvoices.length} factures</span>
          </div>
          <div className="space-y-3">
            {overdueInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{invoice.supplierName}</p>
                  <p className="text-sm text-gray-600">{invoice.invoiceNumber} - {invoice.remainingAmount.toLocaleString()} €</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600 font-medium">
                    {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                  <button
                    onClick={() => handlePayInvoice(invoice)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Payer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Prochaines échéances</h3>
            <span className="text-sm text-blue-600 font-medium">{upcomingPayments.length} factures</span>
          </div>
          <div className="space-y-3">
            {upcomingPayments.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{invoice.supplierName}</p>
                  <p className="text-sm text-gray-600">{invoice.invoiceNumber} - {invoice.remainingAmount.toLocaleString()} €</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600 font-medium">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handlePayInvoice(invoice)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Programmer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInvoices = () => {
    const invoiceColumns = [
      {
        key: 'invoiceNumber',
        label: 'N° Facture',
        sortable: true,
        render: (value: string, row: any) => (
          <div>
            <p className="font-medium text-blue-600">{value}</p>
            <p className="text-sm text-gray-500">{row.supplierInvoiceNumber}</p>
          </div>
        )
      },
      {
        key: 'supplierName',
        label: 'Fournisseur',
        sortable: true
      },
      {
        key: 'invoiceDate',
        label: 'Date facture',
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString()
      },
      {
        key: 'dueDate',
        label: 'Échéance',
        sortable: true,
        render: (value: string, row: any) => {
          const isOverdue = new Date(value) < new Date() && row.remainingAmount > 0;
          return (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(value).toLocaleDateString()}
            </span>
          );
        }
      },
      {
        key: 'total',
        label: 'Montant TTC',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'remainingAmount',
        label: 'Reste à payer',
        sortable: true,
        render: (value: number) => (
          <span className={value > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
            {value.toLocaleString()} €
          </span>
        )
      },
      {
        key: 'status',
        label: 'Statut',
        sortable: true,
        render: (value: string) => {
          const statusConfig = {
            draft: { color: 'gray', label: 'Brouillon' },
            validated: { color: 'blue', label: 'Validée' },
            paid: { color: 'green', label: 'Payée' },
            partially_paid: { color: 'yellow', label: 'Partiellement payée' },
            overdue: { color: 'red', label: 'En retard' },
            cancelled: { color: 'gray', label: 'Annulée' }
          };
          const config = statusConfig[value as keyof typeof statusConfig];
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
              {config.label}
            </span>
          );
        }
      },
      {
        key: 'actions',
        label: 'Actions',
        render: (_: any, row: any) => (
          <div className="flex items-center space-x-2">
            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Edit className="w-4 h-4" />
            </button>
            {row.remainingAmount > 0 && (
              <button
                onClick={() => handlePayInvoice(row)}
                className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            )}
            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Factures fournisseurs</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvelle facture</span>
          </button>
        </div>

        <DataTable
          data={supplierInvoices}
          columns={invoiceColumns}
          onRowClick={(row) => console.log('View invoice:', row)}
        />
      </div>
    );
  };

  const renderPayments = () => {
    const paymentColumns = [
      {
        key: 'paymentNumber',
        label: 'N° Paiement',
        sortable: true
      },
      {
        key: 'supplierName',
        label: 'Fournisseur',
        sortable: true
      },
      {
        key: 'invoiceNumber',
        label: 'Facture',
        sortable: true
      },
      {
        key: 'paymentDate',
        label: 'Date paiement',
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString()
      },
      {
        key: 'amount',
        label: 'Montant brut',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'withholdingTax',
        label: 'Retenue',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'netAmount',
        label: 'Montant net',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'paymentMethod',
        label: 'Mode',
        sortable: true,
        render: (value: string) => {
          const methods = {
            bank_transfer: 'Virement',
            check: 'Chèque',
            cash: 'Espèces',
            credit_card: 'Carte'
          };
          return methods[value as keyof typeof methods] || value;
        }
      },
      {
        key: 'status',
        label: 'Statut',
        sortable: true,
        render: (value: string) => {
          const statusConfig = {
            pending: { color: 'yellow', label: 'En attente' },
            completed: { color: 'green', label: 'Effectué' },
            cancelled: { color: 'red', label: 'Annulé' }
          };
          const config = statusConfig[value as keyof typeof statusConfig];
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
              {config.label}
            </span>
          );
        }
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Paiements fournisseurs</h3>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau paiement</span>
          </button>
        </div>

        <DataTable
          data={supplierPayments}
          columns={paymentColumns}
          onRowClick={(row) => console.log('View payment:', row)}
        />
      </div>
    );
  };

  const renderWithholding = () => {
    const withholdingColumns = [
      {
        key: 'supplierName',
        label: 'Fournisseur',
        sortable: true
      },
      {
        key: 'period',
        label: 'Période',
        sortable: true
      },
      {
        key: 'taxableAmount',
        label: 'Base imposable',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'taxRate',
        label: 'Taux',
        sortable: true,
        render: (value: number) => `${value}%`
      },
      {
        key: 'taxAmount',
        label: 'Montant retenu',
        sortable: true,
        render: (value: number) => `${value.toLocaleString()} €`
      },
      {
        key: 'status',
        label: 'Statut',
        sortable: true,
        render: (value: string) => {
          const statusConfig = {
            calculated: { color: 'blue', label: 'Calculée' },
            paid: { color: 'green', label: 'Versée' },
            declared: { color: 'purple', label: 'Déclarée' }
          };
          const config = statusConfig[value as keyof typeof statusConfig];
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
              {config.label}
            </span>
          );
        }
      },
      {
        key: 'certificateGenerated',
        label: 'Attestation',
        render: (value: boolean) => (
          value ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )
        )
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Retenues à la source</h3>
          <div className="flex space-x-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Générer attestations</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Rapport mensuel</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total calculé</p>
                <p className="text-2xl font-bold text-gray-900">{totalWithholdingTax.toLocaleString()} €</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À verser</p>
                <p className="text-2xl font-bold text-gray-900">
                  {withholdingTaxes
                    .filter(wt => wt.status === 'calculated')
                    .reduce((sum, wt) => sum + wt.taxAmount, 0)
                    .toLocaleString()} €
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attestations générées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {withholdingTaxes.filter(wt => wt.certificateGenerated).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        <DataTable
          data={withholdingTaxes}
          columns={withholdingColumns}
          onRowClick={(row) => console.log('View withholding tax:', row)}
        />
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'withholding', label: 'Retenues', icon: FileText },
    { id: 'alerts', label: 'Alertes', icon: AlertTriangle }
  ];

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
              {tab.id === 'alerts' && paymentAlerts.filter(alert => !alert.acknowledged).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {paymentAlerts.filter(alert => !alert.acknowledged).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'invoices' && renderInvoices()}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'withholding' && renderWithholding()}

      {/* Modal de paiement */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Enregistrer un paiement"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Détails de la facture</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Fournisseur:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.supplierName}</span>
                </div>
                <div>
                  <span className="text-gray-500">N° Facture:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Montant total:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.total.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-gray-500">Reste à payer:</span>
                  <span className="ml-2 font-medium text-red-600">{selectedInvoice.remainingAmount.toLocaleString()} €</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant à payer *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={selectedInvoice.remainingAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de paiement *
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode de paiement *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="check">Chèque</option>
                    <option value="cash">Espèces</option>
                    <option value="credit_card">Carte de crédit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Référence du paiement"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes sur le paiement..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Calcul automatique</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Retenue à la source (3%):</span>
                    <span className="ml-2 font-medium">{(selectedInvoice.remainingAmount * 0.03).toFixed(2)} €</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Montant net à verser:</span>
                    <span className="ml-2 font-medium">{(selectedInvoice.remainingAmount * 0.97).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer le paiement
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Purchases;
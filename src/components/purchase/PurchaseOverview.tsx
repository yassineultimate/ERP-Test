import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Package
} from 'lucide-react';
import { usePurchase } from '../../contexts/PurchaseContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PurchaseOverview: React.FC = () => {
  const { 
    supplierInvoices, 
    supplierPayments, 
    paymentAlerts, 
    withholdingTaxes,
    getOverdueInvoices,
    getUpcomingPayments,
    acknowledgeAlert
  } = usePurchase();
  const { t } = useLanguage();

  // Calculs des métriques
  const totalUnpaid = supplierInvoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const overdueInvoices = getOverdueInvoices();
  const upcomingPayments = getUpcomingPayments(7);
  const totalWithholdingTax = withholdingTaxes
    .filter(wt => wt.status === 'calculated')
    .reduce((sum, wt) => sum + wt.taxAmount, 0);

  const totalPaid = supplierPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.netAmount, 0);

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

  const stats = [
    {
      title: 'Factures impayées',
      value: `${totalUnpaid.toLocaleString()} €`,
      change: '+5.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Factures en retard',
      value: overdueInvoices.length.toString(),
      change: `${overdueInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0).toLocaleString()} €`,
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Échéances 7 jours',
      value: upcomingPayments.length.toString(),
      change: `${upcomingPayments.reduce((sum, inv) => sum + inv.remainingAmount, 0).toLocaleString()} €`,
      trend: 'neutral',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Retenues à la source',
      value: `${totalWithholdingTax.toLocaleString()} €`,
      change: 'À déclarer',
      trend: 'neutral',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500 mr-1" />}
                  {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500 mr-1" />}
                  {stat.trend === 'neutral' && <Clock className="w-4 h-4 text-blue-500 mr-1" />}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-red-600' : 
                    stat.trend === 'down' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alertes importantes */}
      {paymentAlerts.filter(alert => !alert.acknowledged).length > 0 && (
        <Card className="p-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Alertes de paiement ({paymentAlerts.filter(alert => !alert.acknowledged).length})
              </h3>
              <div className="space-y-2">
                {paymentAlerts.filter(alert => !alert.acknowledged).slice(0, 3).map(alert => (
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
                  <button className="text-sm text-blue-600 hover:text-blue-800">
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
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Programmer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance paiements</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Délai moyen de paiement</span>
              <span className="font-medium">15 jours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Taux de retard</span>
              <span className="font-medium text-red-600">8.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Économies escompte</span>
              <span className="font-medium text-green-600">2,450 €</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Retenues fiscales</h3>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ce mois</span>
              <span className="font-medium">{totalWithholdingTax.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Attestations générées</span>
              <span className="font-medium">{withholdingTaxes.filter(wt => wt.certificateGenerated).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Prochaine déclaration</span>
              <span className="font-medium text-orange-600">15 jours</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Fournisseurs actifs</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total fournisseurs</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Factures ce mois</span>
              <span className="font-medium">{supplierInvoices.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nouveau fournisseur</span>
              <span className="font-medium text-green-600">+2</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOverview;
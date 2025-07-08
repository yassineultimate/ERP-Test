import React, { useState } from 'react';
import { Plus, CreditCard, Eye, Download, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { usePurchase } from '../../contexts/PurchaseContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DataTable from '../DataTable';
import Modal from '../Modal';
import Card from '../Card';
import { useForm } from 'react-hook-form';

interface PaymentForm {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'credit_card';
  reference: string;
  notes: string;
}

const PaymentManagement: React.FC = () => {
  const { 
    supplierPayments, 
    supplierInvoices,
    addSupplierPayment, 
    updateSupplierPayment 
  } = usePurchase();
  const { t } = useLanguage();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PaymentForm>();

  const unpaidInvoices = supplierInvoices.filter(inv => 
    inv.status === 'validated' && inv.remainingAmount > 0
  );

  const totalPaid = supplierPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.netAmount, 0);

  const pendingPayments = supplierPayments.filter(payment => payment.status === 'pending');

  const handleAddPayment = (invoice?: any) => {
    setSelectedPayment(null);
    setSelectedInvoice(invoice);
    reset({
      invoiceId: invoice?.id || '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'bank_transfer'
    });
    setShowModal(true);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    setSelectedInvoice(null);
    reset(payment);
    setShowModal(true);
  };

  const onSubmit = (data: PaymentForm) => {
    const invoice = supplierInvoices.find(inv => inv.id === data.invoiceId);
    if (!invoice) return;

    const withholdingTax = data.amount * 0.03; // 3% de retenue à la source
    const netAmount = data.amount - withholdingTax;

    const paymentData = {
      ...data,
      paymentNumber: `PAY-${new Date().getFullYear()}-${String(supplierPayments.length + 1).padStart(3, '0')}`,
      supplierId: invoice.supplierId,
      supplierName: invoice.supplierName,
      invoiceNumber: invoice.invoiceNumber,
      amount: data.amount,
      withholdingTax,
      netAmount,
      status: 'pending' as const,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    if (selectedPayment) {
      updateSupplierPayment(selectedPayment.id, paymentData);
    } else {
      addSupplierPayment(paymentData);
    }
    setShowModal(false);
    reset();
  };

  const watchedInvoiceId = watch('invoiceId');
  const watchedAmount = watch('amount');
  const selectedInvoiceForPayment = supplierInvoices.find(inv => inv.id === watchedInvoiceId);

  const columns = [
    {
      key: 'paymentNumber',
      label: 'N° Paiement',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
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
      label: 'Retenue (3%)',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} €`
    },
    {
      key: 'netAmount',
      label: 'Montant net',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-green-600">{value.toLocaleString()} €</span>
      )
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
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => console.log('View payment:', row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEditPayment(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Modifier"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button 
            onClick={() => console.log('Download payment:', row)}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques des paiements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total payé</p>
              <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString()} €</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paiements en attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Factures à payer</p>
              <p className="text-2xl font-bold text-gray-900">{unpaidInvoices.length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paiements effectués</p>
              <p className="text-2xl font-bold text-gray-900">
                {supplierPayments.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Factures à payer */}
      {unpaidInvoices.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Factures à payer ({unpaidInvoices.length})
            </h3>
          </div>
          <div className="space-y-3">
            {unpaidInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.supplierName}</p>
                      <p className="text-sm text-gray-600">
                        {invoice.invoiceNumber} - Échéance: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {invoice.remainingAmount.toLocaleString()} €
                      </p>
                      <p className="text-sm text-gray-500">
                        Retenue: {(invoice.remainingAmount * 0.03).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleAddPayment(invoice)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Payer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Liste des paiements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Historique des paiements</h3>
          <button
            onClick={() => handleAddPayment()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau paiement</span>
          </button>
        </div>

        <DataTable
          data={supplierPayments}
          columns={columns}
          onRowClick={(row) => console.log('View payment:', row)}
        />
      </Card>

      {/* Modal de paiement */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPayment ? 'Modifier le paiement' : 'Nouveau paiement'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {selectedInvoice && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Facture sélectionnée</h3>
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!selectedInvoice && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facture à payer *
                </label>
                <select
                  {...register('invoiceId', { required: 'Facture requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une facture</option>
                  {unpaidInvoices.map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.supplierName} - {invoice.invoiceNumber} ({invoice.remainingAmount.toLocaleString()} €)
                    </option>
                  ))}
                </select>
                {errors.invoiceId && (
                  <p className="text-red-500 text-xs mt-1">{errors.invoiceId.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant à payer *
              </label>
              <input
                {...register('amount', { 
                  required: 'Montant requis',
                  min: { value: 0.01, message: 'Montant doit être positif' },
                  max: { 
                    value: selectedInvoiceForPayment?.remainingAmount || selectedInvoice?.remainingAmount || 999999, 
                    message: 'Montant supérieur au reste à payer' 
                  }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement *
              </label>
              <input
                {...register('paymentDate', { required: 'Date de paiement requise' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.paymentDate && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode de paiement *
              </label>
              <select
                {...register('paymentMethod', { required: 'Mode de paiement requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bank_transfer">Virement bancaire</option>
                <option value="check">Chèque</option>
                <option value="cash">Espèces</option>
                <option value="credit_card">Carte de crédit</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence
              </label>
              <input
                {...register('reference')}
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
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes sur le paiement..."
            />
          </div>

          {watchedAmount && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Calcul automatique</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Montant brut:</span>
                  <span className="ml-2 font-medium">{Number(watchedAmount).toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-blue-700">Retenue à la source (3%):</span>
                  <span className="ml-2 font-medium">{(Number(watchedAmount) * 0.03).toFixed(2)} €</span>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700">Montant net à verser:</span>
                  <span className="ml-2 font-bold text-lg">{(Number(watchedAmount) * 0.97).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedPayment ? 'Modifier' : 'Enregistrer'} le paiement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
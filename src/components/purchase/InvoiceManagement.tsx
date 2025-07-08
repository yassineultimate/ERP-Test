import React, { useState } from 'react';
import { Plus, Edit, Eye, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePurchase } from '../../contexts/PurchaseContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DataTable from '../DataTable';
import Modal from '../Modal';
import Card from '../Card';
import { useForm } from 'react-hook-form';

interface InvoiceForm {
  supplierInvoiceNumber: string;
  supplierId: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  notes: string;
}

const InvoiceManagement: React.FC = () => {
  const { 
    supplierInvoices, 
    addSupplierInvoice, 
    updateSupplierInvoice, 
    validateInvoice,
    getOverdueInvoices 
  } = usePurchase();
  const { t } = useLanguage();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceForm>();

  const overdueInvoices = getOverdueInvoices();
  const totalUnpaid = supplierInvoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    reset();
    setShowModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    reset(invoice);
    setShowModal(true);
  };

  const handleValidateInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowValidationModal(true);
  };

  const onSubmit = (data: InvoiceForm) => {
    const invoiceData = {
      ...data,
      invoiceNumber: `FINV-${new Date().getFullYear()}-${String(supplierInvoices.length + 1).padStart(3, '0')}`,
      supplierName: 'Fournisseur', // À récupérer depuis la liste des fournisseurs
      status: 'draft' as const,
      items: [],
      subtotal: 0,
      vatAmount: 0,
      withholdingTax: 0,
      total: 0,
      paidAmount: 0,
      remainingAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (selectedInvoice) {
      updateSupplierInvoice(selectedInvoice.id, invoiceData);
    } else {
      addSupplierInvoice(invoiceData);
    }
    setShowModal(false);
    reset();
  };

  const confirmValidation = () => {
    if (selectedInvoice) {
      validateInvoice(selectedInvoice.id);
      setShowValidationModal(false);
    }
  };

  const columns = [
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
          <div className="flex items-center space-x-2">
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(value).toLocaleDateString()}
            </span>
            {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
          </div>
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
          <button 
            onClick={() => console.log('View invoice:', row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEditInvoice(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'draft' && (
            <button 
              onClick={() => handleValidateInvoice(row)}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              title="Valider"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => console.log('Download invoice:', row)}
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
      {/* Statistiques des factures */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total factures</p>
              <p className="text-2xl font-bold text-gray-900">{supplierInvoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Montant impayé</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnpaid.toLocaleString()} €</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Validées</p>
              <p className="text-2xl font-bold text-gray-900">
                {supplierInvoices.filter(inv => inv.status === 'validated').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Alertes factures en retard */}
      {overdueInvoices.length > 0 && (
        <Card className="p-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Factures en retard ({overdueInvoices.length})
              </h3>
              <div className="space-y-2">
                {overdueInvoices.slice(0, 3).map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.supplierName}</p>
                      <p className="text-sm text-gray-600">
                        {invoice.invoiceNumber} - {invoice.remainingAmount.toLocaleString()} €
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">
                        {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des factures */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Factures fournisseurs</h3>
          <button
            onClick={handleAddInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle facture</span>
          </button>
        </div>

        <DataTable
          data={supplierInvoices}
          columns={columns}
          onRowClick={(row) => console.log('View invoice:', row)}
        />
      </Card>

      {/* Modal d'ajout/modification de facture */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedInvoice ? 'Modifier la facture' : 'Nouvelle facture fournisseur'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° Facture fournisseur *
              </label>
              <input
                {...register('supplierInvoiceNumber', { required: 'Numéro de facture requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="N° facture du fournisseur"
              />
              {errors.supplierInvoiceNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.supplierInvoiceNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur *
              </label>
              <select
                {...register('supplierId', { required: 'Fournisseur requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                <option value="1">Global Supplies Inc</option>
                <option value="2">Premium Materials Co</option>
              </select>
              {errors.supplierId && (
                <p className="text-red-500 text-xs mt-1">{errors.supplierId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de facture *
              </label>
              <input
                {...register('invoiceDate', { required: 'Date de facture requise' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'échéance *
              </label>
              <input
                {...register('dueDate', { required: 'Date d\'échéance requise' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions de paiement
              </label>
              <select
                {...register('paymentTerms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15 jours">15 jours</option>
                <option value="30 jours">30 jours</option>
                <option value="45 jours">45 jours</option>
                <option value="60 jours">60 jours</option>
              </select>
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
              placeholder="Notes sur la facture..."
            />
          </div>

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
              {selectedInvoice ? 'Modifier' : 'Créer'} la facture
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de validation */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Valider la facture"
        size="md"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Validation de la facture
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Êtes-vous sûr de vouloir valider cette facture ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Détails de la facture</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">N° Facture:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Fournisseur:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.supplierName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Montant:</span>
                  <span className="ml-2 font-medium">{selectedInvoice.total?.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-gray-500">Échéance:</span>
                  <span className="ml-2 font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmValidation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Valider la facture
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceManagement;
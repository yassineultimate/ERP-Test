import React, { useState } from 'react';
import { FileText, Download, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import { usePurchase } from '../../contexts/PurchaseContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DataTable from '../DataTable';
import Modal from '../Modal';
import Card from '../Card';

const WithholdingTaxManagement: React.FC = () => {
  const { withholdingTaxes, addWithholdingTax } = usePurchase();
  const { t } = useLanguage();
  
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const totalCalculated = withholdingTaxes
    .filter(wt => wt.status === 'calculated')
    .reduce((sum, wt) => sum + wt.taxAmount, 0);

  const totalPaid = withholdingTaxes
    .filter(wt => wt.status === 'paid')
    .reduce((sum, wt) => sum + wt.taxAmount, 0);

  const certificatesGenerated = withholdingTaxes.filter(wt => wt.certificateGenerated).length;

  const handleGenerateCertificate = (tax: any) => {
    setSelectedTax(tax);
    setShowCertificateModal(true);
  };

  const confirmGenerateCertificate = () => {
    if (selectedTax) {
      // Ici, on générerait le certificat PDF
      console.log('Generating certificate for:', selectedTax);
      setShowCertificateModal(false);
    }
  };

  const generateMonthlyReport = () => {
    const period = selectedPeriod;
    const periodTaxes = withholdingTaxes.filter(wt => wt.period === period);
    
    console.log('Generating monthly report for:', period, periodTaxes);
    // Ici, on générerait le rapport mensuel PDF
  };

  const columns = [
    {
      key: 'supplierName',
      label: 'Fournisseur',
      sortable: true
    },
    {
      key: 'period',
      label: 'Période',
      sortable: true,
      render: (value: string) => {
        const [year, month] = value.split('-');
        const monthNames = [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
      }
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
      render: (value: number) => (
        <span className="font-medium text-purple-600">{value.toLocaleString()} €</span>
      )
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
      render: (value: boolean, row: any) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          {!value && (
            <button
              onClick={() => handleGenerateCertificate(row)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Générer
            </button>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => console.log('View tax details:', row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Voir détails"
          >
            <FileText className="w-4 h-4" />
          </button>
          {row.certificateGenerated && (
            <button 
              onClick={() => console.log('Download certificate:', row)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Télécharger attestation"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  // Données pour le graphique mensuel
  const monthlyData = withholdingTaxes.reduce((acc, tax) => {
    const existing = acc.find(item => item.period === tax.period);
    if (existing) {
      existing.amount += tax.taxAmount;
    } else {
      acc.push({ period: tax.period, amount: tax.taxAmount });
    }
    return acc;
  }, [] as { period: string; amount: number }[]);

  return (
    <div className="space-y-6">
      {/* Statistiques des retenues */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total calculé</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalculated.toLocaleString()} €</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total versé</p>
              <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString()} €</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">À verser</p>
              <p className="text-2xl font-bold text-gray-900">{(totalCalculated - totalPaid).toLocaleString()} €</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attestations</p>
              <p className="text-2xl font-bold text-gray-900">{certificatesGenerated}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-900">Rapport mensuel</h4>
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="2024-01">Janvier 2024</option>
                <option value="2024-02">Février 2024</option>
                <option value="2024-03">Mars 2024</option>
                <option value="2024-04">Avril 2024</option>
                <option value="2024-05">Mai 2024</option>
                <option value="2024-06">Juin 2024</option>
              </select>
              <button
                onClick={generateMonthlyReport}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Générer
              </button>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-900">Attestations en lot</h4>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-700 mb-3">
              {withholdingTaxes.filter(wt => !wt.certificateGenerated).length} attestations à générer
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
              Générer toutes
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900">Déclaration fiscale</h4>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Prochaine échéance: 15 du mois
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Préparer déclaration
            </button>
          </div>
        </div>
      </Card>

      {/* Évolution mensuelle */}
      {monthlyData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des retenues</h3>
          <div className="space-y-3">
            {monthlyData.map((item) => {
              const [year, month] = item.period.split('-');
              const monthNames = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
              ];
              const monthName = `${monthNames[parseInt(month) - 1]} ${year}`;
              
              return (
                <div key={item.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{monthName}</span>
                  <span className="text-purple-600 font-bold">{item.amount.toLocaleString()} €</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Liste des retenues */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Retenues à la source</h3>
          <div className="flex space-x-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Générer attestations</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        <DataTable
          data={withholdingTaxes}
          columns={columns}
          onRowClick={(row) => console.log('View withholding tax:', row)}
        />
      </Card>

      {/* Modal de génération d'attestation */}
      <Modal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        title="Générer une attestation de retenue"
        size="md"
      >
        {selectedTax && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Détails de la retenue</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Fournisseur:</span>
                  <span className="ml-2 font-medium">{selectedTax.supplierName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Période:</span>
                  <span className="ml-2 font-medium">{selectedTax.period}</span>
                </div>
                <div>
                  <span className="text-gray-500">Base imposable:</span>
                  <span className="ml-2 font-medium">{selectedTax.taxableAmount.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-gray-500">Montant retenu:</span>
                  <span className="ml-2 font-medium text-purple-600">{selectedTax.taxAmount.toLocaleString()} €</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Génération d'attestation
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    L'attestation sera générée au format PDF et pourra être envoyée au fournisseur.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmGenerateCertificate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Générer l'attestation
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WithholdingTaxManagement;
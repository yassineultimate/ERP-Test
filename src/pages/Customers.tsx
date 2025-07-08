import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Phone, Building, Upload } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Card from '../components/Card';
import { useForm } from 'react-hook-form';

interface CustomerForm {
  name: string;
  customerCode: string;
  status: 'active' | 'inactive';
  
  // Adresse
  address: string;
  postalCode: string;
  city: string;
  country: string;
  region: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  email: string;
  
  // Identifiants professionnels
  vatNumber: string;
  professionalId1: string;
  professionalId2: string;
  professionalId3: string;
  professionalId4: string;
  
  // TVA
  subjectToVAT: 'yes' | 'no';
  
  // Type et structure
  thirdPartyType: 'particulier' | 'pme' | 'grand-compte' | 'autre' | 'administration';
  workforce: string;
  legalEntityType: 'groupe-societes' | 'gei' | 'sa' | 'suarl' | 'scs' | 'snc' | 'sarl' | 'societe-participation';
  
  // Conditions commerciales
  paymentTerms: 'a-reception' | '30-jours' | '30-jours-fin-mois' | '60-jours' | '60-jours-fin-mois' | 'a-commande' | 'a-livraison' | '50-50' | '14-jours';
  
  // Logo
  logo: string;
}

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CustomerForm>();

  const generateCustomerCode = () => {
    const maxCode = customers.reduce((max, customer) => {
      const codeNumber = parseInt(customer.customerCode.replace('CLI', ''));
      return Math.max(max, codeNumber);
    }, 0);
    return `CLI${String(maxCode + 1).padStart(3, '0')}`;
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    reset({
      customerCode: generateCustomerCode(),
      status: 'active',
      subjectToVAT: 'yes',
      thirdPartyType: 'pme',
      legalEntityType: 'sarl',
      paymentTerms: '30-jours'
    });
    setShowModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    reset(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm(t('customers.deleteConfirm'))) {
      deleteCustomer(customerId);
    }
  };

  const onSubmit = (data: CustomerForm) => {
    const customerData = {
      ...data,
      company: data.name, // Pour compatibilité
      lastContact: new Date().toISOString().split('T')[0],
      totalOrders: selectedCustomer?.totalOrders || 0,
      totalValue: selectedCustomer?.totalValue || 0
    };

    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setShowModal(false);
    reset();
  };

  const getDisplayValue = (value: any) => {
    if (!value || value === '') {
      return 'À renseigner';
    }
    return value;
  };

  const getSelectLabel = (value: string, options: Record<string, string>) => {
    return options[value] || 'À renseigner';
  };

  const thirdPartyTypeOptions = {
    'particulier': 'Particulier',
    'pme': 'PME',
    'grand-compte': 'Grand compte',
    'autre': 'Autre',
    'administration': 'Administration'
  };

  const legalEntityTypeOptions = {
    'groupe-societes': 'Groupe de sociétés',
    'gei': 'Groupement d\'intérêt économique (GEI)',
    'sa': 'Société Anonyme (SA)',
    'suarl': 'Société Unipersonnelle à Responsabilité Limitée (SUARL)',
    'scs': 'Société en Commandite Simple (SCS)',
    'snc': 'Société en Nom Collectif (SNC)',
    'sarl': 'Société à responsabilité limitée (SARL)',
    'societe-participation': 'Société en participation'
  };

  const paymentTermsOptions = {
    'a-reception': 'À réception',
    '30-jours': '30 jours',
    '30-jours-fin-mois': '30 jours fin de mois',
    '60-jours': '60 jours',
    '60-jours-fin-mois': '60 jours fin de mois',
    'a-commande': 'À commande',
    'a-livraison': 'À livraison',
    '50-50': '50/50',
    '14-jours': '14 jours'
  };

  const columns = [
    {
      key: 'name',
      label: t('common.name'),
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.customerCode}</p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: t('common.email'),
      sortable: true
    },
    {
      key: 'phone',
      label: t('common.phone'),
      sortable: true
    },
    {
      key: 'city',
      label: 'Ville',
      sortable: true
    },
    {
      key: 'thirdPartyType',
      label: 'Type',
      sortable: true,
      render: (value: string) => getSelectLabel(value, thirdPartyTypeOptions)
    },
    {
      key: 'status',
      label: t('common.status'),
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? t('customers.active') : t('customers.inactive')}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditCustomer(row);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCustomer(row.id);
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('customers.title')}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Building className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddCustomer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('customers.addCustomer')}</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <DataTable
          data={customers}
          columns={columns}
          onRowClick={(row) => console.log('View customer:', row)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">{customer.name.charAt(0)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {customer.status === 'active' ? t('customers.active') : t('customers.inactive')}
                </span>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-1">{customer.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{customer.customerCode}</p>
              <p className="text-sm text-gray-500 mb-4">{getSelectLabel(customer.thirdPartyType, thirdPartyTypeOptions)}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {getDisplayValue(customer.email)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {getDisplayValue(customer.phone)}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditCustomer(customer)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCustomer ? t('customers.editCustomer') : t('customers.addNewCustomer')}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client *
                </label>
                <input
                  {...register('name', { required: 'Le nom est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du client"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code client
                </label>
                <input
                  {...register('customerCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  placeholder="Auto-généré"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  État
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Non actif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  {...register('address')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  {...register('postalCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Code postal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ville"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  {...register('country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pays"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département / Région
                </label>
                <input
                  {...register('region')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Département / Région"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tél portable
                </label>
                <input
                  {...register('mobile')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Téléphone portable"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fax
                </label>
                <input
                  {...register('fax')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fax"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web
                </label>
                <input
                  {...register('website')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Site web"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', { 
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Identifiants professionnels */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Identifiants professionnels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de TVA
                </label>
                <input
                  {...register('vatNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Numéro de TVA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Id. prof. 1 (RC)
                </label>
                <input
                  {...register('professionalId1')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Registre de commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Id. prof. 2 (Matricule fiscal)
                </label>
                <input
                  {...register('professionalId2')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Matricule fiscal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Id. prof. 3 (Code en douane)
                </label>
                <input
                  {...register('professionalId3')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Code en douane"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Id. prof. 4 (BAN)
                </label>
                <input
                  {...register('professionalId4')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="BAN"
                />
              </div>
            </div>
          </div>

          {/* TVA */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">TVA</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assujetti à la TVA
              </label>
              <select
                {...register('subjectToVAT')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
          </div>

          {/* Type et structure */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Type et structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type du tiers
                </label>
                <select
                  {...register('thirdPartyType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="particulier">Particulier</option>
                  <option value="pme">PME</option>
                  <option value="grand-compte">Grand compte</option>
                  <option value="autre">Autre</option>
                  <option value="administration">Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effectifs
                </label>
                <input
                  {...register('workforce')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre d'employés"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'entité légale
                </label>
                <select
                  {...register('legalEntityType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="groupe-societes">Groupe de sociétés</option>
                  <option value="gei">Groupement d'intérêt économique (GEI)</option>
                  <option value="sa">Société Anonyme (SA)</option>
                  <option value="suarl">Société Unipersonnelle à Responsabilité Limitée (SUARL)</option>
                  <option value="scs">Société en Commandite Simple (SCS)</option>
                  <option value="snc">Société en Nom Collectif (SNC)</option>
                  <option value="sarl">Société à responsabilité limitée (SARL)</option>
                  <option value="societe-participation">Société en participation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditions commerciales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions commerciales</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions de règlement
              </label>
              <select
                {...register('paymentTerms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="a-reception">À réception</option>
                <option value="30-jours">30 jours</option>
                <option value="30-jours-fin-mois">30 jours fin de mois</option>
                <option value="60-jours">60 jours</option>
                <option value="60-jours-fin-mois">60 jours fin de mois</option>
                <option value="a-commande">À commande</option>
                <option value="a-livraison">À livraison</option>
                <option value="50-50">50/50</option>
                <option value="14-jours">14 jours</option>
              </select>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  {...register('logo')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="URL du logo"
                />
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedCustomer ? t('customers.updateCustomer') : t('customers.addCustomer')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
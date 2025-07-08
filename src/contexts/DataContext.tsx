import React, { createContext, useContext, useState } from 'react';

interface Customer {
  id: string;
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
  professionalId1: string; // RC
  professionalId2: string; // Matricule fiscal
  professionalId3: string; // Code en douane
  professionalId4: string; // BAN
  
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
  
  // Données existantes pour compatibilité
  company: string;
  lastContact: string;
  totalOrders: number;
  totalValue: number;
}

interface Supplier {
  id: string;
  name: string;
  supplierCode: string;
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
  professionalId1: string; // RC
  professionalId2: string; // Matricule fiscal
  professionalId3: string; // Code en douane
  professionalId4: string; // BAN
  
  // TVA
  subjectToVAT: 'yes' | 'no';
  
  // Type et structure
  thirdPartyType: 'industrie' | 'commerce' | 'services' | 'pme';
  legalEntityType: 'groupe-societes' | 'gei' | 'sa' | 'suarl' | 'scs' | 'snc' | 'sarl' | 'societe-participation';
  
  // Conditions commerciales
  paymentTerms: 'a-reception' | '30-jours' | '30-jours-fin-mois' | '60-jours' | '60-jours-fin-mois' | 'a-commande' | 'a-livraison' | '50-50' | '14-jours';
  
  // Logo
  logo: string;
  
  // Données existantes pour compatibilité
  company: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
}

interface Product {
  id: string;
  productRef: string;
  name: string;
  batchSerial: string;
  barcode: string;
  description: string;
  publicUrl: string;
  warehouseId: string;
  stockAlertLimit: number;
  optimalStock: number;
  productNature: 'finished-product' | 'raw-material' | 'consumable' | 'service';
  originCountry: string;
  supplierId: string;
  sellingPrice: number;
  minSellingPrice: number;
  vatRate: number;
  category: string;
  tags: string[];
  currentStock: number;
  
  // Données existantes pour compatibilité
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  status: 'active' | 'inactive';
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  totalCapacity: number; // m²
  storageCapacity: number; // m³
  warehouseType: 'dry' | 'temperate' | 'refrigerated' | 'outdoor';
  storedProducts: string[];
  zones: number;
  commissioningDate: string;
  lastInventoryDate: string;
  tags: string[];
}

interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  date: string;
  reference: string;
  reason: string;
  userId: string;
}

interface Shipment {
  id: string;
  shipmentNumber: string;
  customerId: string;
  warehouseId: string;
  products: { productId: string; quantity: number }[];
  status: 'pending' | 'prepared' | 'shipped' | 'delivered';
  shipmentDate: string;
  deliveryDate?: string;
  carrier: string;
  trackingNumber: string;
  totalValue: number;
}

interface Reception {
  id: string;
  receptionNumber: string;
  supplierId: string;
  warehouseId: string;
  products: { productId: string; quantity: number; receivedQuantity: number }[];
  status: 'pending' | 'partial' | 'completed';
  expectedDate: string;
  receivedDate?: string;
  purchaseOrderRef: string;
  totalValue: number;
}

interface DataContextType {
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  shipments: Shipment[];
  receptions: Reception[];
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  
  addStockMovement: (movement: Omit<StockMovement, 'id'>) => void;
  addShipment: (shipment: Omit<Shipment, 'id'>) => void;
  updateShipment: (id: string, shipment: Partial<Shipment>) => void;
  addReception: (reception: Omit<Reception, 'id'>) => void;
  updateReception: (id: string, reception: Partial<Reception>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      customerCode: 'CLI001',
      status: 'active',
      address: '123 Main St',
      postalCode: '10001',
      city: 'New York',
      country: 'États-Unis',
      region: 'New York',
      phone: '+1 555-0123',
      mobile: '+1 555-0124',
      fax: '',
      website: 'www.acmecorp.com',
      email: 'john@example.com',
      vatNumber: 'US123456789',
      professionalId1: 'RC123456',
      professionalId2: 'MF789012',
      professionalId3: '',
      professionalId4: 'BAN345678',
      subjectToVAT: 'yes',
      thirdPartyType: 'pme',
      workforce: '50-100',
      legalEntityType: 'sarl',
      paymentTerms: '30-jours',
      logo: '',
      company: 'Acme Corp',
      lastContact: '2024-01-15',
      totalOrders: 12,
      totalValue: 25000
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      customerCode: 'CLI002',
      status: 'active',
      address: '456 Tech Ave',
      postalCode: '94105',
      city: 'San Francisco',
      country: 'États-Unis',
      region: 'Californie',
      phone: '+1 555-0456',
      mobile: '+1 555-0457',
      fax: '+1 555-0458',
      website: 'www.techco.com',
      email: 'sarah@techco.com',
      vatNumber: 'US987654321',
      professionalId1: 'RC654321',
      professionalId2: 'MF210987',
      professionalId3: 'CD123456',
      professionalId4: 'BAN876543',
      subjectToVAT: 'yes',
      thirdPartyType: 'grand-compte',
      workforce: '500+',
      legalEntityType: 'sa',
      paymentTerms: '60-jours-fin-mois',
      logo: '',
      company: 'TechCo Solutions',
      lastContact: '2024-01-10',
      totalOrders: 8,
      totalValue: 18500
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Global Supplies Inc',
      supplierCode: 'FOU001',
      status: 'active',
      address: '789 Supply Chain Blvd',
      postalCode: '60601',
      city: 'Chicago',
      country: 'États-Unis',
      region: 'Illinois',
      phone: '+1 555-0789',
      mobile: '+1 555-0790',
      fax: '+1 555-0791',
      website: 'www.globalsupplies.com',
      email: 'contact@globalsupplies.com',
      vatNumber: 'US555666777',
      professionalId1: 'RC789012',
      professionalId2: 'MF345678',
      professionalId3: 'CD789012',
      professionalId4: 'BAN123789',
      subjectToVAT: 'yes',
      thirdPartyType: 'industrie',
      legalEntityType: 'sa',
      paymentTerms: '30-jours',
      logo: '',
      company: 'Global Supplies Inc',
      rating: 4.5,
      totalOrders: 45,
      totalValue: 125000
    },
    {
      id: '2',
      name: 'Premium Materials Co',
      supplierCode: 'FOU002',
      status: 'active',
      address: '321 Material St',
      postalCode: '48201',
      city: 'Detroit',
      country: 'États-Unis',
      region: 'Michigan',
      phone: '+1 555-0321',
      mobile: '+1 555-0322',
      fax: '',
      website: 'www.premiummaterials.com',
      email: 'info@premiummaterials.com',
      vatNumber: 'US888999000',
      professionalId1: 'RC456789',
      professionalId2: 'MF012345',
      professionalId3: '',
      professionalId4: 'BAN456012',
      subjectToVAT: 'yes',
      thirdPartyType: 'commerce',
      legalEntityType: 'sarl',
      paymentTerms: '60-jours',
      logo: '',
      company: 'Premium Materials Co',
      rating: 4.2,
      totalOrders: 32,
      totalValue: 89000
    }
  ]);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Entrepôt Principal Tunis',
      code: 'ENT-TUNIS-001',
      address: 'Zone Industrielle Ben Arous, Tunis',
      phone: '+216 71 123 456',
      email: 'tunis@warehouse.com',
      manager: 'Ahmed Ben Ali',
      totalCapacity: 5000,
      storageCapacity: 12000,
      warehouseType: 'dry',
      storedProducts: ['finished-product', 'raw-material'],
      zones: 4,
      commissioningDate: '2020-03-15',
      lastInventoryDate: '2024-01-01',
      tags: ['principal', 'tunis']
    },
    {
      id: '2',
      name: 'Entrepôt Réfrigéré Sfax',
      code: 'ENT-SFAX-002',
      address: 'Port de Sfax, Sfax',
      phone: '+216 74 987 654',
      email: 'sfax@warehouse.com',
      manager: 'Fatma Trabelsi',
      totalCapacity: 2000,
      storageCapacity: 6000,
      warehouseType: 'refrigerated',
      storedProducts: ['finished-product'],
      zones: 4,
      commissioningDate: '2021-06-10',
      lastInventoryDate: '2024-01-01',
      tags: ['réfrigéré', 'sfax']
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      productRef: 'PRD-LAP-001',
      name: 'Ordinateur Portable Dell Latitude',
      batchSerial: 'LOT-2024-001',
      barcode: '1234567890123',
      description: 'Ordinateur portable professionnel Dell Latitude 15" avec processeur Intel i7, 16GB RAM, SSD 512GB. Idéal pour les professionnels exigeants.',
      publicUrl: 'ordinateur-portable-dell-latitude',
      warehouseId: '1',
      stockAlertLimit: 5,
      optimalStock: 25,
      productNature: 'finished-product',
      originCountry: 'Chine',
      supplierId: '1',
      sellingPrice: 1299.99,
      minSellingPrice: 1099.99,
      vatRate: 19,
      category: 'Informatique',
      tags: ['ordinateur', 'portable', 'dell'],
      currentStock: 25,
      // Compatibilité
      sku: 'LAP-001',
      price: 1299.99,
      cost: 850.00,
      stock: 25,
      minStock: 5,
      supplier: 'Global Supplies Inc',
      status: 'active'
    },
    {
      id: '2',
      productRef: 'PRD-CHR-002',
      name: 'Chaise de Bureau Ergonomique',
      batchSerial: 'LOT-2024-002',
      barcode: '2345678901234',
      description: 'Chaise de bureau ergonomique avec support lombaire, accoudoirs réglables et roulettes. Confort optimal pour de longues heures de travail.',
      publicUrl: 'chaise-bureau-ergonomique',
      warehouseId: '1',
      stockAlertLimit: 3,
      optimalStock: 15,
      productNature: 'finished-product',
      originCountry: 'Italie',
      supplierId: '2',
      sellingPrice: 399.99,
      minSellingPrice: 329.99,
      vatRate: 19,
      category: 'Mobilier',
      tags: ['chaise', 'bureau', 'ergonomique'],
      currentStock: 15,
      // Compatibilité
      sku: 'CHR-001',
      price: 399.99,
      cost: 250.00,
      stock: 15,
      minStock: 3,
      supplier: 'Premium Materials Co',
      status: 'active'
    },
    {
      id: '3',
      productRef: 'PRD-MOU-003',
      name: 'Souris Sans Fil Logitech',
      batchSerial: 'LOT-2024-003',
      barcode: '3456789012345',
      description: 'Souris sans fil Logitech avec capteur optique haute précision, autonomie 12 mois, design ergonomique.',
      publicUrl: 'souris-sans-fil-logitech',
      warehouseId: '1',
      stockAlertLimit: 10,
      optimalStock: 50,
      productNature: 'finished-product',
      originCountry: 'Suisse',
      supplierId: '1',
      sellingPrice: 29.99,
      minSellingPrice: 24.99,
      vatRate: 19,
      category: 'Accessoires',
      tags: ['souris', 'sans-fil', 'logitech'],
      currentStock: 2,
      // Compatibilité
      sku: 'CBL-001',
      price: 29.99,
      cost: 15.50,
      stock: 2,
      minStock: 10,
      supplier: 'Global Supplies Inc',
      status: 'active'
    }
  ]);

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    {
      id: '1',
      productId: '1',
      warehouseId: '1',
      type: 'in',
      quantity: 50,
      date: '2024-01-15',
      reference: 'REC-001',
      reason: 'Réception commande fournisseur',
      userId: 'user1'
    },
    {
      id: '2',
      productId: '1',
      warehouseId: '1',
      type: 'out',
      quantity: 25,
      date: '2024-01-16',
      reference: 'EXP-001',
      reason: 'Expédition client',
      userId: 'user1'
    }
  ]);

  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: '1',
      shipmentNumber: 'EXP-2024-001',
      customerId: '1',
      warehouseId: '1',
      products: [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 1 }],
      status: 'shipped',
      shipmentDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      carrier: 'DHL Express',
      trackingNumber: 'DHL123456789',
      totalValue: 2999.97
    }
  ]);

  const [receptions, setReceptions] = useState<Reception[]>([
    {
      id: '1',
      receptionNumber: 'REC-2024-001',
      supplierId: '1',
      warehouseId: '1',
      products: [{ productId: '1', quantity: 50, receivedQuantity: 50 }],
      status: 'completed',
      expectedDate: '2024-01-15',
      receivedDate: '2024-01-15',
      purchaseOrderRef: 'PO-2024-001',
      totalValue: 42500.00
    }
  ]);

  // Fonctions utilitaires
  const generateCustomerCode = () => {
    const maxCode = customers.reduce((max, customer) => {
      const codeNumber = parseInt(customer.customerCode.replace('CLI', ''));
      return Math.max(max, codeNumber);
    }, 0);
    return `CLI${String(maxCode + 1).padStart(3, '0')}`;
  };

  const generateSupplierCode = () => {
    const maxCode = suppliers.reduce((max, supplier) => {
      const codeNumber = parseInt(supplier.supplierCode.replace('FOU', ''));
      return Math.max(max, codeNumber);
    }, 0);
    return `FOU${String(maxCode + 1).padStart(3, '0')}`;
  };

  const generateProductRef = () => {
    const maxCode = products.reduce((max, product) => {
      const codeNumber = parseInt(product.productRef.split('-')[2]);
      return Math.max(max, codeNumber);
    }, 0);
    return `PRD-GEN-${String(maxCode + 1).padStart(3, '0')}`;
  };

  const generateWarehouseCode = () => {
    const maxCode = warehouses.reduce((max, warehouse) => {
      const codeNumber = parseInt(warehouse.code.split('-')[2]);
      return Math.max(max, codeNumber);
    }, 0);
    return `ENT-GEN-${String(maxCode + 1).padStart(3, '0')}`;
  };

  // CRUD Customers
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { 
      ...customer, 
      id: Date.now().toString(),
      customerCode: customer.customerCode || generateCustomerCode()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // CRUD Suppliers
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { 
      ...supplier, 
      id: Date.now().toString(),
      supplierCode: supplier.supplierCode || generateSupplierCode()
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplier } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // CRUD Products
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { 
      ...product, 
      id: Date.now().toString(),
      productRef: product.productRef || generateProductRef()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // CRUD Warehouses
  const addWarehouse = (warehouse: Omit<Warehouse, 'id'>) => {
    const newWarehouse = { 
      ...warehouse, 
      id: Date.now().toString(),
      code: warehouse.code || generateWarehouseCode()
    };
    setWarehouses(prev => [...prev, newWarehouse]);
  };

  const updateWarehouse = (id: string, warehouse: Partial<Warehouse>) => {
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, ...warehouse } : w));
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(w => w.id !== id));
  };

  // Stock Movements
  const addStockMovement = (movement: Omit<StockMovement, 'id'>) => {
    const newMovement = { ...movement, id: Date.now().toString() };
    setStockMovements(prev => [...prev, newMovement]);
    
    // Mettre à jour le stock du produit
    if (movement.type === 'in') {
      updateProduct(movement.productId, { 
        currentStock: products.find(p => p.id === movement.productId)!.currentStock + movement.quantity 
      });
    } else if (movement.type === 'out') {
      updateProduct(movement.productId, { 
        currentStock: products.find(p => p.id === movement.productId)!.currentStock - movement.quantity 
      });
    }
  };

  // Shipments
  const addShipment = (shipment: Omit<Shipment, 'id'>) => {
    const newShipment = { ...shipment, id: Date.now().toString() };
    setShipments(prev => [...prev, newShipment]);
  };

  const updateShipment = (id: string, shipment: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...shipment } : s));
  };

  // Receptions
  const addReception = (reception: Omit<Reception, 'id'>) => {
    const newReception = { ...reception, id: Date.now().toString() };
    setReceptions(prev => [...prev, newReception]);
  };

  const updateReception = (id: string, reception: Partial<Reception>) => {
    setReceptions(prev => prev.map(r => r.id === id ? { ...r, ...reception } : r));
  };

  return (
    <DataContext.Provider value={{
      customers,
      suppliers,
      products,
      warehouses,
      stockMovements,
      shipments,
      receptions,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addProduct,
      updateProduct,
      deleteProduct,
      addWarehouse,
      updateWarehouse,
      deleteWarehouse,
      addStockMovement,
      addShipment,
      updateShipment,
      addReception,
      updateReception
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
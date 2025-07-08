import React, { createContext, useContext, useState } from 'react';
import { 
  PurchaseOrder, 
  DeliveryNote, 
  SupplierInvoice, 
  SupplierPayment, 
  WithholdingTax,
  PaymentAlert 
} from '../types/purchase';

interface PurchaseContextType {
  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  
  // Delivery Notes
  deliveryNotes: DeliveryNote[];
  addDeliveryNote: (note: Omit<DeliveryNote, 'id'>) => void;
  updateDeliveryNote: (id: string, note: Partial<DeliveryNote>) => void;
  
  // Supplier Invoices
  supplierInvoices: SupplierInvoice[];
  addSupplierInvoice: (invoice: Omit<SupplierInvoice, 'id'>) => void;
  updateSupplierInvoice: (id: string, invoice: Partial<SupplierInvoice>) => void;
  validateInvoice: (id: string) => void;
  
  // Payments
  supplierPayments: SupplierPayment[];
  addSupplierPayment: (payment: Omit<SupplierPayment, 'id'>) => void;
  updateSupplierPayment: (id: string, payment: Partial<SupplierPayment>) => void;
  
  // Withholding Tax
  withholdingTaxes: WithholdingTax[];
  addWithholdingTax: (tax: Omit<WithholdingTax, 'id'>) => void;
  
  // Alerts
  paymentAlerts: PaymentAlert[];
  acknowledgeAlert: (id: string) => void;
  
  // Utility functions
  getSupplierBalance: (supplierId: string) => number;
  getOverdueInvoices: () => SupplierInvoice[];
  getUpcomingPayments: (days: number) => SupplierInvoice[];
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      supplierId: '1',
      supplierName: 'Global Supplies Inc',
      date: '2024-01-15',
      expectedDeliveryDate: '2024-01-25',
      status: 'delivered',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Ordinateur Portable Dell',
          quantity: 10,
          unitPrice: 850.00,
          vatRate: 19,
          total: 8500.00,
          deliveredQuantity: 10,
          invoicedQuantity: 10
        }
      ],
      subtotal: 8500.00,
      vatAmount: 1615.00,
      total: 10115.00,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([
    {
      id: '1',
      deliveryNumber: 'BL-2024-001',
      purchaseOrderId: '1',
      supplierId: '1',
      supplierName: 'Global Supplies Inc',
      deliveryDate: '2024-01-20',
      receivedDate: '2024-01-20',
      status: 'received',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Ordinateur Portable Dell',
          orderedQuantity: 10,
          deliveredQuantity: 10,
          receivedQuantity: 10,
          unitPrice: 850.00,
          status: 'received'
        }
      ],
      receivedBy: 'admin',
      createdAt: '2024-01-20T14:00:00Z'
    }
  ]);

  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'FINV-2024-001',
      supplierInvoiceNumber: 'GSI-2024-0156',
      supplierId: '1',
      supplierName: 'Global Supplies Inc',
      purchaseOrderId: '1',
      deliveryNoteId: '1',
      invoiceDate: '2024-01-22',
      dueDate: '2024-02-21',
      status: 'validated',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Ordinateur Portable Dell',
          quantity: 10,
          unitPrice: 850.00,
          vatRate: 19,
          vatAmount: 1615.00,
          total: 8500.00
        }
      ],
      subtotal: 8500.00,
      vatAmount: 1615.00,
      withholdingTax: 255.00, // 3% de 8500
      total: 10115.00,
      paidAmount: 0,
      remainingAmount: 9860.00, // total - retenue à la source
      paymentTerms: '30 jours',
      validatedBy: 'admin',
      validatedAt: '2024-01-22T16:00:00Z',
      createdAt: '2024-01-22T15:00:00Z',
      updatedAt: '2024-01-22T16:00:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'FINV-2024-002',
      supplierInvoiceNumber: 'PMC-2024-0089',
      supplierId: '2',
      supplierName: 'Premium Materials Co',
      invoiceDate: '2024-01-10',
      dueDate: '2024-01-25',
      status: 'overdue',
      items: [
        {
          id: '1',
          productId: '2',
          productName: 'Chaise de Bureau',
          quantity: 5,
          unitPrice: 250.00,
          vatRate: 19,
          vatAmount: 237.50,
          total: 1250.00
        }
      ],
      subtotal: 1250.00,
      vatAmount: 237.50,
      withholdingTax: 37.50,
      total: 1487.50,
      paidAmount: 0,
      remainingAmount: 1450.00,
      paymentTerms: '15 jours',
      validatedBy: 'admin',
      validatedAt: '2024-01-10T10:00:00Z',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    }
  ]);

  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([]);

  const [withholdingTaxes, setWithholdingTaxes] = useState<WithholdingTax[]>([
    {
      id: '1',
      supplierId: '1',
      supplierName: 'Global Supplies Inc',
      invoiceId: '1',
      paymentId: '',
      taxRate: 3,
      taxableAmount: 8500.00,
      taxAmount: 255.00,
      period: '2024-01',
      status: 'calculated',
      certificateGenerated: false,
      createdAt: '2024-01-22T16:00:00Z'
    }
  ]);

  const [paymentAlerts, setPaymentAlerts] = useState<PaymentAlert[]>([
    {
      id: '1',
      type: 'overdue',
      invoiceId: '2',
      supplierId: '2',
      amount: 1450.00,
      dueDate: '2024-01-25',
      daysOverdue: 5,
      priority: 'high',
      acknowledged: false,
      createdAt: '2024-01-30T00:00:00Z'
    }
  ]);

  // Purchase Orders functions
  const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id'>) => {
    const newOrder = { ...order, id: Date.now().toString() };
    setPurchaseOrders(prev => [...prev, newOrder]);
  };

  const updatePurchaseOrder = (id: string, order: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, ...order } : po));
  };

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
  };

  // Delivery Notes functions
  const addDeliveryNote = (note: Omit<DeliveryNote, 'id'>) => {
    const newNote = { ...note, id: Date.now().toString() };
    setDeliveryNotes(prev => [...prev, newNote]);
  };

  const updateDeliveryNote = (id: string, note: Partial<DeliveryNote>) => {
    setDeliveryNotes(prev => prev.map(dn => dn.id === id ? { ...dn, ...note } : dn));
  };

  // Supplier Invoices functions
  const addSupplierInvoice = (invoice: Omit<SupplierInvoice, 'id'>) => {
    const newInvoice = { ...invoice, id: Date.now().toString() };
    setSupplierInvoices(prev => [...prev, newInvoice]);
  };

  const updateSupplierInvoice = (id: string, invoice: Partial<SupplierInvoice>) => {
    setSupplierInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...invoice } : inv));
  };

  const validateInvoice = (id: string) => {
    updateSupplierInvoice(id, {
      status: 'validated',
      validatedBy: 'admin',
      validatedAt: new Date().toISOString()
    });
  };

  // Payments functions
  const addSupplierPayment = (payment: Omit<SupplierPayment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setSupplierPayments(prev => [...prev, newPayment]);
    
    // Update invoice paid amount
    const invoice = supplierInvoices.find(inv => inv.id === payment.invoiceId);
    if (invoice) {
      const newPaidAmount = invoice.paidAmount + payment.netAmount;
      const newRemainingAmount = invoice.total - invoice.withholdingTax - newPaidAmount;
      const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partially_paid';
      
      updateSupplierInvoice(payment.invoiceId, {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        status: newStatus
      });
    }
  };

  const updateSupplierPayment = (id: string, payment: Partial<SupplierPayment>) => {
    setSupplierPayments(prev => prev.map(p => p.id === id ? { ...p, ...payment } : p));
  };

  // Withholding Tax functions
  const addWithholdingTax = (tax: Omit<WithholdingTax, 'id'>) => {
    const newTax = { ...tax, id: Date.now().toString() };
    setWithholdingTaxes(prev => [...prev, newTax]);
  };

  // Alerts functions
  const acknowledgeAlert = (id: string) => {
    setPaymentAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Utility functions
  const getSupplierBalance = (supplierId: string): number => {
    return supplierInvoices
      .filter(inv => inv.supplierId === supplierId && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + inv.remainingAmount, 0);
  };

  const getOverdueInvoices = (): SupplierInvoice[] => {
    const today = new Date();
    return supplierInvoices.filter(inv => 
      inv.status === 'validated' && 
      new Date(inv.dueDate) < today &&
      inv.remainingAmount > 0
    );
  };

  const getUpcomingPayments = (days: number): SupplierInvoice[] => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return supplierInvoices.filter(inv => 
      inv.status === 'validated' && 
      new Date(inv.dueDate) <= futureDate &&
      inv.remainingAmount > 0
    );
  };

  return (
    <PurchaseContext.Provider value={{
      purchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrder,
      deletePurchaseOrder,
      deliveryNotes,
      addDeliveryNote,
      updateDeliveryNote,
      supplierInvoices,
      addSupplierInvoice,
      updateSupplierInvoice,
      validateInvoice,
      supplierPayments,
      addSupplierPayment,
      updateSupplierPayment,
      withholdingTaxes,
      addWithholdingTax,
      paymentAlerts,
      acknowledgeAlert,
      getSupplierBalance,
      getOverdueInvoices,
      getUpcomingPayments
    }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDeliveryDate: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_delivered' | 'delivered' | 'invoiced' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
  deliveredQuantity?: number;
  invoicedQuantity?: number;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  purchaseOrderId: string;
  supplierId: string;
  supplierName: string;
  deliveryDate: string;
  receivedDate: string;
  status: 'pending' | 'received' | 'partially_received' | 'rejected';
  items: DeliveryNoteItem[];
  notes?: string;
  receivedBy: string;
  createdAt: string;
}

export interface DeliveryNoteItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
  status: 'pending' | 'received' | 'partial' | 'rejected';
  notes?: string;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderId?: string;
  deliveryNoteId?: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'validated' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  items: SupplierInvoiceItem[];
  subtotal: number;
  vatAmount: number;
  withholdingTax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  paymentTerms: string;
  notes?: string;
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  discrepancy?: {
    type: 'quantity' | 'price' | 'vat';
    expected: number;
    actual: number;
    difference: number;
  };
}

export interface SupplierPayment {
  id: string;
  paymentNumber: string;
  supplierId: string;
  supplierName: string;
  invoiceId: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  withholdingTax: number;
  netAmount: number;
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'credit_card';
  reference: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface WithholdingTax {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceId: string;
  paymentId: string;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
  period: string; // YYYY-MM
  status: 'calculated' | 'paid' | 'declared';
  certificateGenerated: boolean;
  createdAt: string;
}

export interface PaymentAlert {
  id: string;
  type: 'due_soon' | 'overdue' | 'discount_available';
  invoiceId: string;
  supplierId: string;
  amount: number;
  dueDate: string;
  daysOverdue?: number;
  priority: 'low' | 'medium' | 'high';
  acknowledged: boolean;
  createdAt: string;
}
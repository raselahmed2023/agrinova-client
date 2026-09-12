export type ProductCategory =
  | "crops"
  | "seeds"
  | "fertilizers"
  | "pesticides"
  | "equipment"
  | "poultry"
  | "farm_foods"
  | "by_products"
  | "other";

export type ProductionMethod =
  | "conventional"
  | "organic"
  | "natural";

export type TransactionType =
  | "sale"
  | "free";

/**
 * pending is retained only for legacy database records.
 * New farmer listings publish immediately.
 */
export type ProductStatus =
  | "pending"
  | "available"
  | "out_of_stock"
  | "disabled";

export interface IProduct {
  _id: string;

  title: string;

  description: string;

  price: number;

  category: ProductCategory;

  transactionType: TransactionType;

  productionMethod: ProductionMethod;

  quantity: number;

  unit: string;

  images?: string[];

  sellerId?: string;

  sellerName?: string;

  sellerEmail?: string;

  sellerContact?: string;

  location?: string;

  division?: string;

  district?: string;

  upazila?: string;

  status: ProductStatus;

  isFeatured?: boolean;

  poultryDetails?: {
    poultryType?: string;
    breed?: string;
    ageWeeks?: number;
    averageWeightKg?: number;
  };

  byProductUses?: string[];

  /**
   * Legacy field only.
   */
  rejectionReason?: string;

  /**
   * Current admin moderation fields.
   */
  moderationReason?: string;

  moderatedAt?: string;

  moderatedBy?: string;

  /**
   * Legacy approval fields kept so old records do not break.
   */
  approvedAt?: string;

  approvedBy?: string;

  isDeleted?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export interface ICreateProduct {
  title: string;

  description: string;

  price: number;

  category: ProductCategory;

  transactionType: TransactionType;

  productionMethod: ProductionMethod;

  quantity: number;

  unit: string;

  images?: string[];

  sellerContact?: string;

  location?: string;

  division?: string;

  district?: string;

  upazila?: string;

  poultryDetails?: {
    poultryType?: string;
    breed?: string;
    ageWeeks?: number;
    averageWeightKg?: number;
  };

  byProductUses?: string[];
}

export interface IProductListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: IProduct[];
}



export interface IOrderItem {
  productId: string;

  title: string;

  image?: string;

  sellerId: string;

  sellerName: string;

  sellerEmail: string;

  quantity: number;

  unit: string;

  price: number;

  subtotal: number;
}

export type FulfillmentStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pickup"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "partially_fulfilled"
  | "ready_for_pickup"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "card";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface IOrderFulfillment {
  sellerId: string;

  sellerName: string;

  sellerEmail: string;

  items: IOrderItem[];

  subtotal: number;

  commissionRate: number;

  commissionAmount: number;

  sellerPayout: number;

  status: FulfillmentStatus;

  pickupAddress?: string;

  deliveryPartner?: {
    name?: string;
    phone?: string;
  };
}

export interface IShippingAddress {
  fullName: string;

  phone: string;

  address: string;

  division: string;

  district: string;

  upazila?: string;

  postalCode?: string;
}

export interface IOrder {
  _id: string;

  orderNumber: string;

  customerId: string;

  customerName: string;

  customerEmail: string;

  items: IOrderItem[];

  fulfillments: IOrderFulfillment[];

  shippingAddress: IShippingAddress;

  subtotal: number;

  deliveryFee: number;

  commissionAmount: number;

  sellerPayoutAmount: number;

  totalAmount: number;

  status: OrderStatus;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  paymentReference?: string;

  stockRestored?: boolean;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface ICreateOrderPayload {
  items: {
    productId: string;
    quantity: number;
  }[];

  shippingAddress: IShippingAddress;

  paymentMethod: PaymentMethod;

  notes?: string;
}



export interface IStripeSession {
  sessionId: string;

  /**
   * Stripe Checkout redirect URL.
   */
  url: string | null;
}



export const PRODUCT_CATEGORIES = [
  {
    value: "crops",
    label: "Crops",
  },

  {
    value: "seeds",
    label: "Seeds",
  },

  {
    value: "fertilizers",
    label: "Fertilizers",
  },

  {
    value: "pesticides",
    label: "Pesticides",
  },

  {
    value: "equipment",
    label: "Equipment",
  },

  {
    value: "poultry",
    label: "Poultry",
  },

  {
    value: "farm_foods",
    label: "Farm Food",
  },

  {
    value: "by_products",
    label: "By Products",
  },

  {
    value: "other",
    label: "Other",
  },
] as const;

export const POULTRY_TYPE_OPTIONS = [
  {
    value: "chicken",
    label: "Chicken",
  },

  {
    value: "duck",
    label: "Duck",
  },

  {
    value: "other",
    label: "Other",
  },
] as const;

export const BY_PRODUCT_USE_OPTIONS = [
  {
    value: "biogas",
    label: "Biogas",
  },

  {
    value: "compost",
    label: "Compost",
  },

  {
    value: "animal_feed",
    label: "Animal Feed",
  },

  {
    value: "biomass",
    label: "Biomass",
  },

  {
    value: "bedding",
    label: "Bedding",
  },

  {
    value: "other",
    label: "Other",
  },
] as const;
/* ============================================================
   PRODUCT TYPES
============================================================ */

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

export type ProductStatus =
  | "pending"
  | "available"
  | "out_of_stock"
  | "disabled";

/* ============================================================
   PRODUCT
============================================================ */

export interface IProduct {
  _id: string;

  title: string;

  description: string;

  price: number;

  category:
    ProductCategory;

  transactionType:
    TransactionType;

  productionMethod:
    ProductionMethod;

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

  status:
    ProductStatus;

  isFeatured?: boolean;

  /* ==========================================================
     POULTRY
  ========================================================== */

  poultryDetails?: {
    poultryType?: string;

    breed?: string;

    ageWeeks?: number;

    averageWeightKg?: number;
  };

  /* ==========================================================
     BY-PRODUCT
  ========================================================== */

  byProductUses?: string[];

  /* ==========================================================
     MODERATION
  ========================================================== */

  rejectionReason?: string;

  moderationReason?: string;

  moderatedAt?: string;

  moderatedBy?: string;

  approvedAt?: string;

  approvedBy?: string;

  isDeleted?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   CREATE / UPDATE PRODUCT
============================================================ */

export interface ICreateProduct {
  title: string;

  description: string;

  price: number;

  category:
    ProductCategory;

  transactionType:
    TransactionType;

  productionMethod:
    ProductionMethod;

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

/* ============================================================
   PRODUCT LIST RESPONSE
============================================================ */

export interface IProductListResponse {
  meta: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };

  data:
    IProduct[];
}

/* ============================================================
   ORDER ITEM
============================================================ */

export interface IOrderItem {
  productId: string;

  title: string;

  image?: string;

  sellerId: string;

  sellerName: string;

  sellerEmail?: string;

  quantity: number;

  unit: string;

  price: number;

  subtotal: number;
}

/* ============================================================
   ORDER TYPES
============================================================ */

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

/* ============================================================
   ORDER FULFILLMENT
============================================================ */

export interface IOrderFulfillment {
  sellerId: string;

  sellerName: string;

  sellerEmail?: string;

  items:
    IOrderItem[];

  subtotal: number;

  /**
   * One delivery fee for this seller.
   *
   * Optional so old orders remain compatible.
   */
  deliveryFee?: number;

  commissionRate: number;

  commissionAmount: number;

  sellerPayout: number;

  status:
    FulfillmentStatus;

  pickupAddress?: string;

  deliveryPartner?: {
    name?: string;

    phone?: string;
  };
}

/* ============================================================
   SHIPPING ADDRESS
============================================================ */

export interface IShippingAddress {
  fullName: string;

  phone: string;

  address: string;

  division: string;

  district: string;

  upazila?: string;

  postalCode?: string;
}

/* ============================================================
   ORDER
============================================================ */

export interface IOrder {
  _id: string;

  /**
   * Prevents duplicate checkout.
   */
  idempotencyKey?: string;

  orderNumber: string;

  customerId: string;

  customerName: string;

  customerEmail: string;

  items:
    IOrderItem[];

  fulfillments:
    IOrderFulfillment[];

  shippingAddress:
    IShippingAddress;

  subtotal: number;

  /**
   * Total delivery fees from all seller fulfillments.
   */
  deliveryFee: number;

  commissionAmount: number;

  sellerPayoutAmount: number;

  totalAmount: number;

  status:
    OrderStatus;

  paymentMethod:
    PaymentMethod;

  paymentStatus:
    PaymentStatus;

  paymentReference?: string;

  stockRestored?: boolean;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   SELLER ORDER
============================================================ */

export interface ISellerOrderItem {
  productId: string;

  title: string;

  image?: string;

  quantity: number;

  unit: string;

  price: number;

  subtotal: number;
}

export interface ISellerOrderFulfillment {
  sellerId: string;

  sellerName: string;

  items:
    ISellerOrderItem[];

  subtotal: number;

  /**
   * One delivery fee for this seller.
   */
  deliveryFee?: number;

  commissionRate: number;

  commissionAmount: number;

  sellerPayout: number;

  status:
    FulfillmentStatus;

  pickupAddress?: string;

  deliveryPartner?: {
    name?: string;

    phone?: string;
  };
}

export interface ISellerOrder {
  _id: string;

  orderNumber: string;

  customerName: string;

  deliveryDistrict: string;

  paymentMethod:
    PaymentMethod;

  paymentStatus:
    PaymentStatus;

  status:
    OrderStatus;

  fulfillment:
    ISellerOrderFulfillment;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   CREATE ORDER
============================================================ */

export interface ICreateOrderPayload {
  /**
   * One checkout attempt must reuse the same key.
   *
   * Protects against:
   * - double click
   * - retry
   * - duplicate COD order
   */
  idempotencyKey: string;

  items: {
    productId: string;

    quantity: number;
  }[];

  shippingAddress:
    IShippingAddress;

  paymentMethod:
    PaymentMethod;

  notes?: string;
}

/* ============================================================
   STRIPE
============================================================ */

export interface IStripeSession {
  sessionId: string;

  /**
   * Current/older backend compatibility.
   */
  url?: string | null;

  /**
   * Newer client compatibility.
   */
  checkoutUrl?: string;

  sessionUrl?: string;
}

/* ============================================================
   PRODUCT CATEGORY OPTIONS
============================================================ */

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

/* ============================================================
   POULTRY TYPE OPTIONS
============================================================ */

/**
 * Must match backend:
 *
 * POULTRY_TYPES = [
 *   "chicken",
 *   "duck",
 *   "other"
 * ]
 */
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

/* ============================================================
   BY-PRODUCT USE OPTIONS
============================================================ */

/**
 * Must match backend:
 *
 * BY_PRODUCT_USES = [
 *   "biogas",
 *   "compost",
 *   "animal_feed",
 *   "biomass",
 *   "bedding",
 *   "other"
 * ]
 */
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
export type ProductStatus =
  | "available"
  | "out_of_stock"
  | "unavailable";

export type PurchaseRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface MarketplaceProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;

  images?: string[];

  sellerName?: string;
  sellerEmail?: string;
  sellerContact?: string;

  location?: string;

  status?: ProductStatus;
  isFeatured?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface MarketplaceMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  meta?: MarketplaceMeta;
  data: MarketplaceProduct[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: MarketplaceProduct;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;

  images?: string[];

  sellerName?: string;
  sellerEmail?: string;
  sellerContact?: string;

  location: string;

  status?: ProductStatus;
  isFeatured?: boolean;
}

export interface PurchaseRequest {
  _id: string;

  productId:
    | string
    | MarketplaceProduct;

  productTitle: string;
  productPrice: number;

  buyerId?: string;
  buyerName?: string;
  buyerEmail: string;

  sellerName?: string;
  sellerEmail: string;

  quantity: number;
  unit: string;

  deliveryLocation: string;
  note?: string;

  status: PurchaseRequestStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseRequestResponse {
  success: boolean;
  message: string;
  data: PurchaseRequest;
}

export interface PurchaseRequestsResponse {
  success: boolean;
  message: string;
  data: PurchaseRequest[];
}
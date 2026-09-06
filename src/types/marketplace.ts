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
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SOLD";

export interface IProduct {
  _id:string;
  productName:string;
  category:ProductCategory;
  description:string;
  price?:number;
  unit?:string;
  quantity:number;
  location:{
    division:string;
    district:string;
    upazila:string;
  };
  productionMethod:ProductionMethod;
  transactionType:TransactionType;
  images?:string[];
  status:ProductStatus;
  createdAt?:string;
  updatedAt?:string;
}

export interface ICreateProduct {
  productName:string;
  category:ProductCategory;
  description:string;
  price?:number;
  unit?:string;
  quantity:number;
  division:string;
  district:string;
  upazila:string;
  productionMethod:ProductionMethod;
  transactionType:TransactionType;
  images?:string[];
}

export type PurchaseRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface IPurchaseRequest {
  _id:string;
  productId:string;
  quantity:number;
  message?:string;
  status:PurchaseRequestStatus;
  createdAt?:string;
  updatedAt?:string;
}

export type PurchaseRequest = IPurchaseRequest;

export const PRODUCT_CATEGORIES = [
  {
    value:"crops",
    label:"Crops",
  },
  {
    value:"seeds",
    label:"Seeds",
  },
  {
    value:"fertilizers",
    label:"Fertilizers",
  },
  {
    value:"pesticides",
    label:"Pesticides",
  },
  {
    value:"equipment",
    label:"Equipment",
  },
  {
    value:"poultry",
    label:"Poultry",
  },
  {
    value:"farm_foods",
    label:"Farm Food",
  },
  {
    value:"by_products",
    label:"By Products",
  },
  {
    value:"other",
    label:"Other",
  },
] as const;
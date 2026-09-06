import { apiRequest } from "./api.client";
import {
  IProduct,
  ICreateProduct,
  IPurchaseRequest,
  PurchaseRequestStatus,
} from "@/types/marketplace";

interface ApiResponse<T>{
  success:boolean;
  message?:string;
  data:T;
}

export const getProducts=async(
  params?:{
    category?:string;
    search?:string;
    district?:string;
    page?:number;
    limit?:number;
  }
):Promise<IProduct[]>=>{

  const query=params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([,v])=>v!==undefined)
          .map(([k,v])=>[k,String(v)])
      ).toString()
    :"";

  const response=await apiRequest<ApiResponse<IProduct[]>>(
    `/products${query?`?${query}`:""}`
  );

  return response.data||[];
};


export const getProductById=async(id:string):Promise<IProduct>=>{
  const response=await apiRequest<ApiResponse<IProduct>>(
    `/products/${id}`
  );

  return response.data;
};


export const createProduct=async(
  data:ICreateProduct
):Promise<IProduct>=>{

  const response=await apiRequest<ApiResponse<IProduct>>(
    "/products",
    "POST",
    data
  );

  return response.data;
};


export const updateProduct=async(
  id:string,
  data:Partial<ICreateProduct>
)=>{

  const response=await apiRequest<ApiResponse<IProduct>>(
    `/products/${id}`,
    "PATCH",
    data
  );

  return response.data;
};


export const deleteProduct=async(id:string)=>{
  return apiRequest(
    `/products/${id}`,
    "DELETE"
  );
};


export const getMyProducts=async():Promise<IProduct[]>=>{

  const response=await apiRequest<ApiResponse<IProduct[]>>(
    "/products/my-products"
  );

  return response.data||[];
};


export const createPurchaseRequest=async(data:{
  productId:string;
  quantity:number;
  note?:string;
  message?:string;
})=>{

  const response=await apiRequest<ApiResponse<IPurchaseRequest>>(
    "/purchase-requests",
    "POST",
    {
      ...data,
      note:data.note||data.message,
    }
  );

  return response.data;
};


export const getReceivedPurchaseRequests=async():Promise<IPurchaseRequest[]>=>{

  const response=await apiRequest<ApiResponse<IPurchaseRequest[]>>(
    "/purchase-requests/received"
  );

  return response.data||[];
};


export const getSentPurchaseRequests=async():Promise<IPurchaseRequest[]>=>{

  const response=await apiRequest<ApiResponse<IPurchaseRequest[]>>(
    "/purchase-requests/sent"
  );

  return response.data||[];
};


export const getMyPurchaseRequests=async():Promise<IPurchaseRequest[]>=>{
  return getReceivedPurchaseRequests();
};


export const updatePurchaseRequestStatus=async(
  id:string,
  status:PurchaseRequestStatus
)=>{

  const response=await apiRequest<ApiResponse<IPurchaseRequest>>(
    `/purchase-requests/${id}/status`,
    "PATCH",
    {
      status,
    }
  );

  return response.data;
};


export const MarketplaceService={
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  createPurchaseRequest,
  getReceivedPurchaseRequests,
  getSentPurchaseRequests,
  getMyPurchaseRequests,
  updatePurchaseRequestStatus,
};
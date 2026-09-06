import { apiRequest } from "./api.client";

import {
  IProduct,
  ICreateProduct,
  IPurchaseRequest,
} from "@/types/marketplace";


interface ApiResponse<T>{
  success:boolean;
  message?:string;
  data:T;
}



export const getProducts = async(
  params?:{
    category?:string;
    search?:string;
    district?:string;
    page?:number;
    limit?:number;
  }
):Promise<IProduct[]>=>{

  const query =
    new URLSearchParams(
      params as Record<string,string>
    ).toString();


  const response =
    await apiRequest<ApiResponse<IProduct[]>>(
      "/products",
      "GET",
      undefined,
      query
    );


  return response.data || [];

};





export const getProductById = async(
  id:string
):Promise<IProduct>=>{


  const response =
    await apiRequest<ApiResponse<IProduct>>(
      `/products/${id}`
    );


  return response.data;

};







export const createProduct = async(
  payload:ICreateProduct
):Promise<IProduct>=>{


  const response =
    await apiRequest<ApiResponse<IProduct>>(
      "/products",
      "POST",
      payload
    );


  return response.data;

};







export const updateProduct = async(
  id:string,
  payload:Partial<ICreateProduct>
)=>{


  const response =
    await apiRequest<ApiResponse<IProduct>>(
      `/products/${id}`,
      "PATCH",
      payload
    );


  return response.data;

};

export const deleteProduct = async(
  id:string
)=>{


  return await apiRequest(
    `/products/${id}`,
    "DELETE"
  );

};


export const createPurchaseRequest = async(
  payload:{
    productId:string;
    quantity:number;
    message?:string;
  }
):Promise<IPurchaseRequest>=>{


  const response =
    await apiRequest<ApiResponse<IPurchaseRequest>>(
      "/purchase-requests",
      "POST",
      payload
    );


  return response.data;

};



export const getMyProducts = async()
:Promise<IProduct[]>=>{


  const response =
    await apiRequest<ApiResponse<IProduct[]>>(
      "/products/my-products"
    );


  return response.data || [];

};



export const getReceivedPurchaseRequests =
async()
:Promise<IPurchaseRequest[]>=>{


  const response =
    await apiRequest<ApiResponse<IPurchaseRequest[]>>(
      "/purchase-requests/received"
    );


  return response.data || [];

};




export const getSentPurchaseRequests =
async()
:Promise<IPurchaseRequest[]>=>{


  const response =
    await apiRequest<ApiResponse<IPurchaseRequest[]>>(
      "/purchase-requests/sent"
    );


  return response.data || [];

};

export const getMyPurchaseRequests = async()
:Promise<IPurchaseRequest[]>=>{

  const response =
    await apiRequest<ApiResponse<IPurchaseRequest[]>>(
      "/purchase-requests/received"
    );

  return response.data || [];

};


export const updatePurchaseRequestStatus =
async(
  id:string,
  status:
  "ACCEPTED" |
  "REJECTED"
)=>{


  const response =
    await apiRequest<ApiResponse<IPurchaseRequest>>(
      `/purchase-requests/${id}/status`,
      "PATCH",
      {
        status,
      }
    );


  return response.data;

};
export const MarketplaceService = {

  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createPurchaseRequest,
  getMyProducts,

  getMyPurchaseRequests,

  getReceivedPurchaseRequests,
  getSentPurchaseRequests,
  updatePurchaseRequestStatus,

};
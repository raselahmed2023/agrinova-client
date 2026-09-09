"use client";

import { useEffect,useState } from "react";
import { MarketplaceService } from "@/services/marketplace.service";
import {
  IPurchaseRequest,
  PurchaseRequestStatus,
} from "@/types/marketplace";
import RequestCard from "./RequestCard";


export default function PurchaseRequestsPanel(){

  const [requests,setRequests]=useState<IPurchaseRequest[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [updatingId,setUpdatingId]=useState<string|null>(null);


  const loadRequests=async()=>{

    try{

      setLoading(true);
      setError("");

      const data =
        await MarketplaceService.getMyPurchaseRequests();

      setRequests(data || []);

    }catch(err:any){

      setError(
        err.message || "Failed to load requests"
      );

    }finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    loadRequests();

  },[]);



  const handleStatusChange=async(
    id:string,
    status:PurchaseRequestStatus
  )=>{

    try{

      setUpdatingId(id);

      await MarketplaceService.updatePurchaseRequestStatus(
        id,
        status
      );


      setRequests(prev=>
        prev.map(item=>
          item._id===id
          ?
          {
            ...item,
            status,
          }
          :
          item
        )
      );


    }catch(err:any){

      alert(
        err.message || "Unable to update request"
      );

    }finally{

      setUpdatingId(null);

    }

  };



  return(
    <section className="mt-8">

      <div className="mb-5">

        <h2 className="text-xl font-bold text-gray-900">
          Purchase Requests
        </h2>

        <p className="text-sm text-gray-500">
          Review buyer requests for your products.
        </p>

      </div>


      {
        loading && (
          <div className="rounded-xl border bg-white p-6 text-gray-500">
            Loading requests...
          </div>
        )
      }


      {
        error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )
      }


      {
        !loading &&
        !error &&
        requests.length===0 &&
        (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
            No purchase requests found.
          </div>
        )
      }



      {
        requests.length>0 && (

          <div className="space-y-4">

            {
              requests.map(request=>(

                <RequestCard
                  key={request._id}
                  request={request}
                  type="received"
                  updatingId={updatingId}
                  onStatusChange={handleStatusChange}
                />

              ))
            }

          </div>

        )
      }


    </section>
  );

}
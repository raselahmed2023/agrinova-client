"use client";

import {useEffect,useState} from "react";
import {MarketplaceService} from "@/services/marketplace.service";
import {IPurchaseRequest} from "@/types/marketplace";

export default function PurchaseRequestsPage(){

  const [requests,setRequests]=useState<IPurchaseRequest[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const loadRequests=async()=>{

    try{

      setLoading(true);
      setError("");

      const data=await MarketplaceService.getMyPurchaseRequests();

      setRequests(data);

    }catch(err:any){

      setError(
        err.message||"Failed to load requests"
      );

    }finally{

      setLoading(false);

    }

  };


  useEffect(()=>{
    loadRequests();
  },[]);



  const updateStatus=async(
    id:string,
    status:"ACCEPTED"|"REJECTED"
  )=>{

    try{

      await MarketplaceService.updatePurchaseRequestStatus(
        id,
        status
      );

      setRequests(prev=>
        prev.map(item=>
          item._id===id
          ?{
            ...item,
            status
          }
          :item
        )
      );

    }catch(err:any){

      alert(
        err.message||"Status update failed"
      );

    }

  };


  return(

    <main className="min-h-screen bg-[#f8faf9] p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold">
          Purchase Requests
        </h1>

        <p className="mt-2 text-gray-600">
          Review buyer requests for your products.
        </p>


        {
          loading && (
            <p className="mt-8 text-gray-500">
              Loading requests...
            </p>
          )
        }


        {
          error && (
            <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )
        }


        {
          !loading &&
          !error &&
          requests.length===0 && (
            <div className="mt-8 rounded-xl bg-white border p-10 text-center">
              No purchase requests yet.
            </div>
          )
        }


        <div className="mt-8 space-y-5">

          {
            requests.map(request=>(

              <div
                key={request._id}
                className="rounded-2xl bg-white border p-5"
              >

                <div className="flex justify-between">

                  <h3 className="font-bold">
                    Product Request
                  </h3>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    {request.status}
                  </span>

                </div>


                <div className="mt-4 text-sm space-y-2">

                  <p>
                    Quantity:
                    {" "}
                    <b>
                      {request.quantity}
                    </b>
                  </p>


                  {
                    (request.message || request.note) && (
                      <p>
                        Message:
                        {" "}
                        {request.message || request.note}
                      </p>
                    )
                  }

                </div>



                {
                  request.status==="PENDING" && (

                    <div className="mt-5 flex gap-3">

                      <button
                        onClick={()=>
                          updateStatus(
                            request._id,
                            "ACCEPTED"
                          )
                        }
                        className="rounded-lg bg-[#0B513D] px-5 py-2 text-white text-sm"
                      >
                        Accept
                      </button>


                      <button
                        onClick={()=>
                          updateStatus(
                            request._id,
                            "REJECTED"
                          )
                        }
                        className="rounded-lg bg-red-50 px-5 py-2 text-red-600 text-sm"
                      >
                        Reject
                      </button>

                    </div>

                  )
                }

              </div>

            ))
          }

        </div>

      </div>

    </main>

  );

}
"use client";

import {useState} from "react";
import {MarketplaceService} from "@/services/marketplace.service";

interface PurchaseRequestModalProps{
  productId:string;
  onClose:()=>void;
}

export default function PurchaseRequestModal({
  productId,
  onClose,
}:PurchaseRequestModalProps){

  const [quantity,setQuantity]=useState(1);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");


  const handleSubmit=async()=>{

    if(quantity<=0){
      setError("Quantity must be greater than zero");
      return;
    }


    try{

      setLoading(true);
      setError("");

      await MarketplaceService.createPurchaseRequest({
        productId,
        quantity,
        note:message,
      });


      setSuccess(
        "Purchase request submitted successfully"
      );


      setTimeout(()=>{
        onClose();
      },1500);


    }catch(err:any){

      setError(
        err.message||"Failed to submit request"
      );

    }finally{

      setLoading(false);

    }

  };


  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-bold">
            Request Product
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>


        <div className="mt-6 space-y-4">

          <div>

            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e=>setQuantity(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-[#0B513D]"
            />

          </div>


          <div>

            <label className="text-sm font-medium text-gray-700">
              Message (optional)
            </label>

            <textarea
              value={message}
              onChange={e=>setMessage(e.target.value)}
              rows={4}
              placeholder="Write a message to farmer..."
              className="mt-2 w-full rounded-lg border px-3 py-2 resize-none outline-none focus:border-[#0B513D]"
            />

          </div>


          {
            error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )
          }


          {
            success && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </p>
            )
          }


          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#0B513D] py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading?"Submitting...":"Submit Request"}
          </button>

        </div>

      </div>

    </div>
  );
}
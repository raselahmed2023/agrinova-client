"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import PurchaseRequestModal from "./PurchaseRequestModal";
import { IProduct } from "@/types/marketplace";


interface ProductDetailsProps{
  product:IProduct;
}


export default function ProductDetails({product}:ProductDetailsProps){

  const {data:session}=useSession();

  const [openModal,setOpenModal]=useState(false);


  const handleRequest=()=>{

    if(!session?.user){

      window.location.href="/login";
      return;

    }

    setOpenModal(true);

  };


  return(

    <section className="min-h-screen bg-[#f8faf9] px-5 py-12 md:px-10">

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">


        <div className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-100">

          {
            product.images &&
            product.images.length>0
            ?
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
            :
            <div className="h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          }

        </div>



        <div className="bg-white rounded-2xl border p-7">

          <div className="flex justify-between gap-4">

            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            <span className="h-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {product.category}
            </span>

          </div>


          <p className="mt-5 text-gray-600 leading-relaxed">
            {product.description}
          </p>



          <div className="mt-8 space-y-4">

            <InfoRow
              label="Production Method"
              value={product.productionMethod}
            />

            <InfoRow
              label="Transaction"
              value={product.transactionType}
            />

            <InfoRow
              label="Quantity"
              value={`${product.quantity} ${product.unit || ""}`}
            />

            <InfoRow
              label="Location"
              value={
                `${product.location?.district || ""}, ${product.location?.division || ""}`
              }
            />

            <InfoRow
              label="Price"
              value={
                product.transactionType==="free"
                ?"Free"
                :`৳${product.price || 0}/${product.unit || "unit"}`
              }
            />

          </div>



          <button
            onClick={handleRequest}
            className="mt-8 w-full rounded-xl bg-[#0B513D] py-3 text-white font-semibold hover:bg-[#083c2d] transition"
          >
            Request Product
          </button>


        </div>

      </div>



      {
        openModal && (
          <PurchaseRequestModal
            productId={product._id}
            onClose={()=>setOpenModal(false)}
          />
        )
      }


    </section>

  );

}



function InfoRow({
  label,
  value,
}:{
  label:string;
  value:string;
}){

  return(

    <div className="flex justify-between border-b pb-3">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-900">
        {value}
      </span>

    </div>

  );

}
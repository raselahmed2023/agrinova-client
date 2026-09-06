"use client";

import Image from "next/image";

import {
  ICreateProduct,
} from "@/types/marketplace";


interface Props{
  product:ICreateProduct;
}



export default function ProductPreviewCard({
  product,
}:Props){


  return(

    <div
      className="
      rounded-2xl
      bg-white
      border
      overflow-hidden
      "
    >


      <div
        className="
        relative
        h-52
        bg-gray-100
        "
      >

        {
          product.images &&
          product.images.length>0
          ?

          <Image
            src={product.images[0]}
            alt={product.productName}
            fill
            className="object-cover"
          />

          :

          <div
            className="
            h-full
            flex
            items-center
            justify-center
            text-gray-400
            "
          >
            No Image
          </div>
        }


        {
          product.productionMethod==="organic" && (

            <span
              className="
              absolute
              top-3
              left-3
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              font-semibold
              text-green-700
              "
            >
              Organic
            </span>

          )
        }

      </div>





      <div
        className="
        p-5
        "
      >

        <div
          className="
          flex
          justify-between
          gap-3
          "
        >

          <h3
            className="
            font-bold
            text-lg
            "
          >
            {product.productName}
          </h3>


          <span
            className="
            rounded-full
            bg-gray-100
            px-2
            py-1
            text-xs
            "
          >
            {product.category}
          </span>


        </div>





        <p
          className="
          mt-3
          text-sm
          text-gray-600
          line-clamp-2
          "
        >
          {product.description}
        </p>





        <div
          className="
          mt-4
          space-y-2
          text-sm
          "
        >

          <Info
            label="Quantity"
            value={`${product.quantity} ${product.unit || ""}`}
          />


          <Info
            label="Location"
            value={`${product.district}, ${product.division}`}
          />


          <Info
            label="Price"
            value={
              product.transactionType==="free"
              ?
              "Free"
              :
              `৳${product.price || 0}/${product.unit || "unit"}`
            }
          />

        </div>


      </div>


    </div>

  );

}





function Info({
  label,
  value,
}:{
  label:string;
  value:string;
}){

  return(

    <div
      className="
      flex
      justify-between
      "
    >

      <span
        className="text-gray-500"
      >
        {label}
      </span>


      <span
        className="font-medium"
      >
        {value}
      </span>

    </div>

  );

}
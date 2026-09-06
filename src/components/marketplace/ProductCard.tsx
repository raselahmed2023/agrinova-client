"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IProduct,
} from "@/types/marketplace";



interface ProductCardProps {

  product:IProduct;

}



export default function ProductCard({

  product,

}:ProductCardProps){



  const isOrganic =
    product.productionMethod === "organic";



  const priceText =
    product.transactionType === "free"
      ? "Free"
      : product.price
        ? `৳${product.price}/${product.unit || "unit"}`
        : "Price not set";





  return (

    <div

      className="
      bg-white
      rounded-2xl
      border
      overflow-hidden
      shadow-sm
      hover:shadow-md
      transition
      "

    >




      {/* IMAGE */}

      <div

        className="
        relative
        h-52
        bg-gray-100
        "

      >

        {product.images &&
        product.images.length > 0 ? (


          <Image

            src={
              product.images[0]
            }

            alt={
              product.productName
            }

            fill

            className="
            object-cover
            "

          />


        ):(


          <div

            className="
            h-full
            flex
            items-center
            justify-center
            text-gray-400
            text-sm
            "

          >

            No Image

          </div>


        )}






        {isOrganic && (

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

        )}



      </div>









      {/* CONTENT */}

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
            text-lg
            font-bold
            text-gray-900
            line-clamp-1
            "

          >

            {
              product.productName
            }

          </h3>



          <span

            className="
            text-xs
            rounded-full
            bg-gray-100
            px-2
            py-1
            whitespace-nowrap
            "

          >

            {
              product.category
            }

          </span>


        </div>







        <p

          className="
          mt-2
          text-sm
          text-gray-600
          line-clamp-2
          "

        >

          {
            product.description
          }

        </p>








        <div

          className="
          mt-4
          space-y-2
          text-sm
          "

        >



          <div

            className="
            flex
            justify-between
            "

          >

            <span className="text-gray-500">

              Location

            </span>


            <span className="font-medium">

              {
                product.location.district
              }

            </span>


          </div>





          <div

            className="
            flex
            justify-between
            "

          >

            <span className="text-gray-500">

              Quantity

            </span>


            <span className="font-medium">

              {
                product.quantity
              }
              {" "}
              {
                product.unit || ""
              }

            </span>


          </div>





          <div

            className="
            flex
            justify-between
            "

          >

            <span className="text-gray-500">

              Price

            </span>


            <span

              className="
              font-bold
              text-[#0B513D]
              "

            >

              {
                priceText
              }

            </span>


          </div>



        </div>









        <Link

          href={`/marketplace/${product._id}`}

          className="
          mt-5
          block
          text-center
          rounded-xl
          bg-[#0B513D]
          py-2.5
          text-sm
          font-semibold
          text-white
          hover:bg-[#083c2d]
          transition
          "

        >

          View Details

        </Link>





      </div>


    </div>

  );

}
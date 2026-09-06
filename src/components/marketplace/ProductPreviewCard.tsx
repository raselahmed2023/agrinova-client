"use client";

import { ICreateProduct } from "@/types/marketplace";

interface ProductPreviewCardProps{
  product:ICreateProduct;
}

export default function ProductPreviewCard({
  product,
}:ProductPreviewCardProps){

  const price=
    product.transactionType==="free"
    ?"Free"
    :`৳${product.price || 0}/${product.unit || "unit"}`;


  return(
    <div className="rounded-2xl border bg-white p-5">

      <h3 className="text-xl font-bold text-gray-900">
        {product.title || "Product Name"}
      </h3>


      <p className="mt-2 text-sm text-gray-600">
        {product.description}
      </p>


      <div className="mt-4 space-y-2 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Category
          </span>

          <span className="font-medium">
            {product.category}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-gray-500">
            Quantity
          </span>

          <span className="font-medium">
            {product.quantity} {product.unit || ""}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-gray-500">
            Price
          </span>

          <span className="font-bold text-[#0B513D]">
            {price}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-gray-500">
            Location
          </span>

          <span className="font-medium">
            {product.location?.district || ""}
            {product.location?.division
              ? `, ${product.location.division}`
              : ""}
          </span>
        </div>


      </div>

    </div>
  );
}
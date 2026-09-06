"use client";

import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import MarketplaceFilters from "./MarketplaceFilters";

import {
  MarketplaceService,
} from "@/services/marketplace.service";

import {
  IProduct,
} from "@/types/marketplace";



export default function MarketplaceBrowse() {


  const [products,setProducts] =
    useState<IProduct[]>([]);


  const [loading,setLoading] =
    useState(true);


  const [error,setError] =
    useState("");



  const [filters,setFilters] =
    useState({

      category:"",
      search:"",
      district:"",

    });





  const fetchProducts =
    async()=>{


      try{


        setLoading(true);

        setError("");



        const data =
          await MarketplaceService.getProducts(
            filters
          );



        setProducts(data);



      }catch(err:any){


        setError(
          err.message ||
          "Failed to load products"
        );


      }finally{


        setLoading(false);

      }


    };






  useEffect(()=>{


    fetchProducts();


  },[
    filters.category,
    filters.search,
    filters.district
  ]);








  return (

    <section
      className="
      w-full
      min-h-screen
      px-5
      py-12
      md:px-10
      "
    >


      <div
        className="
        max-w-7xl
        mx-auto
        "
      >



        {/* HEADER */}

        <div
          className="
          mb-8
          "
        >


          <h1
            className="
            text-3xl
            md:text-4xl
            font-bold
            text-gray-900
            "
          >
            Agricultural Marketplace
          </h1>



          <p
            className="
            mt-2
            text-gray-600
            "
          >
            Explore products directly from farmers
            across Bangladesh.
          </p>


        </div>






        {/* FILTER */}

        <MarketplaceFilters

          filters={filters}

          setFilters={setFilters}

        />








        {/* CONTENT */}


        {loading && (

          <div
            className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            "
          >

            {[1,2,3].map((item)=>(

              <div

                key={item}

                className="
                h-72
                rounded-xl
                bg-gray-100
                animate-pulse
                "

              />

            ))}

          </div>

        )}








        {!loading && error && (

          <div
            className="
            mt-10
            rounded-xl
            bg-red-50
            p-5
            text-red-600
            "
          >

            {error}

          </div>

        )}








        {!loading &&
        !error &&
        products.length ===0 && (

          <div
            className="
            mt-10
            text-center
            rounded-xl
            bg-white
            border
            p-10
            "
          >

            <h3
              className="
              text-lg
              font-semibold
              "
            >
              No products found
            </h3>


            <p
              className="
              mt-2
              text-gray-500
              "
            >
              Try changing your filters.
            </p>


          </div>

        )}









        {!loading &&
        !error &&
        products.length>0 && (


          <div
            className="
            mt-10
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            "
          >


            {products.map(
              (product)=>(

                <ProductCard

                  key={
                    product._id
                  }

                  product={
                    product
                  }

                />

              )

            )}



          </div>


        )}





      </div>


    </section>

  );

}
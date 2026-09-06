"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {MarketplaceService} from "@/services/marketplace.service";
import {IProduct} from "@/types/marketplace";

export default function MyListingsPage(){

  const [products,setProducts]=useState<IProduct[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const loadProducts=async()=>{

    try{

      setLoading(true);
      setError("");

      const data=await MarketplaceService.getMyProducts();

      setProducts(data);

    }catch(err:any){

      setError(
        err.message||"Failed to load products"
      );

    }finally{

      setLoading(false);

    }

  };


  useEffect(()=>{
    loadProducts();
  },[]);



  const handleDelete=async(id:string)=>{

    const confirmDelete=window.confirm(
      "Are you sure you want to delete this product?"
    );

    if(!confirmDelete)return;

    try{

      await MarketplaceService.deleteProduct(id);

      setProducts(prev=>
        prev.filter(item=>item._id!==id)
      );

    }catch(err:any){

      alert(
        err.message||"Delete failed"
      );

    }

  };


  return(

    <main className="min-h-screen bg-[#f8faf9] p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              My Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your marketplace listings.
            </p>

          </div>


          <Link
            href="/dashboard/farmer/marketplace/sell"
            className="rounded-xl bg-[#0B513D] px-5 py-3 text-white font-semibold"
          >
            Add Product
          </Link>

        </div>



        {
          loading && (
            <div className="text-gray-500">
              Loading products...
            </div>
          )
        }



        {
          error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )
        }



        {
          !loading &&
          !error &&
          products.length===0 && (

            <div className="rounded-xl bg-white border p-10 text-center">

              <h3 className="text-lg font-semibold">
                No products yet
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first product to marketplace.
              </p>

            </div>

          )
        }



        {
          products.length>0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {
                products.map(product=>(

                  <div
                    key={product._id}
                    className="rounded-2xl bg-white border p-5"
                  >

                    <div className="flex justify-between gap-3">

                      <h3 className="font-bold">
                        {product.title}
                      </h3>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {product.status}
                      </span>

                    </div>


                    <p className="mt-3 text-sm text-gray-600">
                      {product.description}
                    </p>


                    <div className="mt-5 flex gap-3">

                      <Link
                        href={`/dashboard/farmer/marketplace/${product._id}`}
                        className="flex-1 rounded-lg border py-2 text-center text-sm"
                      >
                        View
                      </Link>


                      <button
                        onClick={()=>handleDelete(product._id)}
                        className="rounded-lg bg-red-50 px-4 text-sm text-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }


      </div>

    </main>

  );

}
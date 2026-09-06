"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceService } from "@/services/marketplace.service";
import { PRODUCT_CATEGORIES, ICreateProduct } from "@/types/marketplace";
import ProductImageUpload from "./ProductImageUpload";

const productionOptions=[
  {value:"conventional",label:"Conventional"},
  {value:"organic",label:"Organic"},
  {value:"natural",label:"Natural"},
];

const transactionOptions=[
  {value:"sale",label:"Sell Product"},
  {value:"free",label:"Give Free"},
];


export default function SellProductForm(){

  const router=useRouter();

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const [form,setForm]=useState<ICreateProduct>({
    title:"",
    category:"crops",
    description:"",
    price:0,
    unit:"kg",
    quantity:0,
    location:{
      division:"",
      district:"",
      upazila:"",
    },
    productionMethod:"conventional",
    transactionType:"sale",
    images:[],
  });


  const updateField=(key:keyof ICreateProduct,value:any)=>{
    setForm(prev=>({
      ...prev,
      [key]:value,
    }));
  };


  const updateLocation=(key:"division"|"district"|"upazila",value:string)=>{

    setForm(prev=>({
      ...prev,
      location:{
        ...prev.location,
        [key]:value,
      },
    }));

  };


  const handleSubmit=async(e:React.FormEvent)=>{

    e.preventDefault();

    if(
      !form.title ||
      !form.description ||
      !form.quantity ||
      !form.location.division ||
      !form.location.district ||
      !form.location.upazila
    ){
      setError("Please fill all required fields");
      return;
    }


    try{

      setLoading(true);
      setError("");

      await MarketplaceService.createProduct({
        ...form,
        price:
          form.transactionType==="free"
          ?0
          :Number(form.price),
        quantity:Number(form.quantity),
      });


      router.push(
        "/dashboard/farmer/marketplace"
      );


    }catch(err:any){

      setError(
        err.message ||
        "Failed to create product"
      );

    }finally{

      setLoading(false);

    }

  };


  return(

    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto rounded-2xl bg-white border p-6 space-y-5"
    >

      <h2 className="text-2xl font-bold">
        Add Product
      </h2>


      {
        error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )
      }


      <Input
        label="Product Name"
        value={form.title}
        onChange={v=>updateField("title",v)}
      />


      <Select
        label="Category"
        value={form.category}
        options={PRODUCT_CATEGORIES.map(x=>({
          value:x.value,
          label:x.label
        }))}
        onChange={v=>updateField("category",v)}
      />


      <Input
        label="Quantity"
        type="number"
        value={String(form.quantity)}
        onChange={v=>updateField("quantity",Number(v))}
      />


      <Input
        label="Unit"
        value={form.unit || ""}
        onChange={v=>updateField("unit",v)}
      />


      <Input
        label="Price"
        type="number"
        value={
          form.transactionType==="free"
          ?"0"
          :String(form.price || 0)
        }
        onChange={v=>updateField("price",Number(v))}
      />


      <Select
        label="Production Method"
        value={form.productionMethod}
        options={productionOptions}
        onChange={v=>updateField("productionMethod",v)}
      />


      <Select
        label="Transaction Type"
        value={form.transactionType}
        options={transactionOptions}
        onChange={v=>updateField("transactionType",v)}
      />


      <Input
        label="Division"
        value={form.location.division}
        onChange={v=>updateLocation("division",v)}
      />


      <Input
        label="District"
        value={form.location.district}
        onChange={v=>updateLocation("district",v)}
      />


      <Input
        label="Upazila"
        value={form.location.upazila}
        onChange={v=>updateLocation("upazila",v)}
      />


      <div>

        <label className="text-sm font-medium">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={e=>updateField("description",e.target.value)}
          rows={5}
          className="input"
        />

      </div>


      <ProductImageUpload
        images={form.images || []}
        setImages={images=>updateField("images",images)}
      />


      <button
        disabled={loading}
        className="w-full rounded-xl bg-[#0B513D] py-3 text-white font-semibold disabled:opacity-50"
      >
        {
          loading
          ?"Submitting..."
          :"Submit Product"
        }
      </button>

    </form>

  );

}



function Input({
  label,
  value,
  onChange,
  type="text"
}:{
  label:string;
  value:string;
  onChange:(v:string)=>void;
  type?:string;
}){

  return(

    <div>

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        className="input"
      />

    </div>

  );

}



function Select({
  label,
  value,
  options,
  onChange
}:{
  label:string;
  value:string;
  options:{value:string;label:string}[];
  onChange:(v:string)=>void;
}){

  return(

    <div>

      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={e=>onChange(e.target.value)}
        className="input"
      >

        {
          options.map(item=>(
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))
        }

      </select>

    </div>

  );

}
"use client";

import {
  PRODUCT_CATEGORIES,
} from "@/types/marketplace";


interface MarketplaceFiltersProps {


  filters:{
    category:string;
    search:string;
    district:string;
  };


  setFilters: React.Dispatch<
    React.SetStateAction<{
      category:string;
      search:string;
      district:string;
    }>
  >;


}



export default function MarketplaceFilters({

  filters,

  setFilters,

}:MarketplaceFiltersProps){



  const updateFilter = (

    key:
      | "category"
      | "search"
      | "district",

    value:string

  )=>{


    setFilters((prev)=>({

      ...prev,

      [key]:value,

    }));


  };




  return (

    <div

      className="
      bg-white
      border
      rounded-2xl
      p-5
      shadow-sm
      grid
      grid-cols-1
      md:grid-cols-3
      gap-4
      "

    >




      {/* SEARCH */}

      <input

        type="text"

        placeholder="Search products..."

        value={
          filters.search
        }

        onChange={(e)=>
          updateFilter(
            "search",
            e.target.value
          )
        }

        className="
        h-11
        rounded-lg
        border
        px-4
        text-sm
        outline-none
        focus:border-[#0B513D]
        "

      />






      {/* CATEGORY */}

      <select

        value={
          filters.category
        }

        onChange={(e)=>
          updateFilter(
            "category",
            e.target.value
          )
        }


        className="
        h-11
        rounded-lg
        border
        px-4
        text-sm
        bg-white
        outline-none
        focus:border-[#0B513D]
        "

      >


        <option value="">

          All Categories

        </option>


        {PRODUCT_CATEGORIES.map(

          (category)=>(

            <option

              key={
                category.value
              }

              value={
                category.value
              }

            >

              {
                category.label
              }

            </option>

          )

        )}


      </select>









      {/* DISTRICT */}

      <input

        type="text"

        placeholder="Filter by district..."

        value={
          filters.district
        }


        onChange={(e)=>

          updateFilter(
            "district",
            e.target.value
          )

        }


        className="
        h-11
        rounded-lg
        border
        px-4
        text-sm
        outline-none
        focus:border-[#0B513D]
        "

      />



    </div>

  );

}
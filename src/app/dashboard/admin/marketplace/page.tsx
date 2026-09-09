import Link from "next/link";

import PurchaseRequestsPanel from "@/components/marketplace/PurchaseRequestsPanel";


export default function FarmerMarketplacePage() {


  return (

    <main
      className="
      min-h-screen
      bg-[#f8faf9]
      p-6
      md:p-10
      "
    >


      <div
        className="
        max-w-7xl
        mx-auto
        "
      >



        <div
          className="
          flex
          flex-col
          md:flex-row
          justify-between
          gap-5
          mb-8
          "
        >


          <div>

            <h1
              className="
              text-3xl
              font-bold
              text-gray-900
              "
            >

              My Marketplace

            </h1>


            <p
              className="
              mt-2
              text-gray-600
              "
            >

              Manage your products and buyer requests.

            </p>


          </div>




          <Link

            href="/dashboard/farmer/marketplace/sell"

            className="
            rounded-xl
            bg-[#0B513D]
            px-5
            py-3
            text-center
            font-semibold
            text-white
            hover:bg-[#083c2d]
            "

          >

            Add Product

          </Link>



        </div>








        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          mb-10
          "
        >



          <DashboardCard

            title="My Products"

            value="Manage"

          />


          <DashboardCard

            title="Buyer Requests"

            value="Review"

          />


          <DashboardCard

            title="Orders"

            value="Track"

          />



        </div>









        <PurchaseRequestsPanel />




      </div>


    </main>

  );

}







function DashboardCard({

 title,

 value,

}:{

 title:string;

 value:string;

}){


 return (

  <div

    className="
    rounded-2xl
    bg-white
    border
    p-5
    "

  >

    <p
      className="
      text-sm
      text-gray-500
      "
    >

      {title}

    </p>


    <h3
      className="
      mt-2
      text-xl
      font-bold
      text-[#0B513D]
      "
    >

      {value}

    </h3>


  </div>

 );

}
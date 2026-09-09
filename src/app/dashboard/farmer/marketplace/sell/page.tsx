import SellProductForm from "@/components/marketplace/SellProductForm";

export default function SellProductPage(){

  return(
    <main className="min-h-screen bg-[#f8faf9] px-5 py-10 md:px-10">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Sell Your Product
          </h1>

          <p className="mt-2 text-gray-600">
            Add your agricultural products and connect with buyers through AgriNova Marketplace.
          </p>

        </div>

        <SellProductForm />

      </div>

    </main>
  );

}
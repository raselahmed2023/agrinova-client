import ProductDetails from "@/components/marketplace/ProductDetails";
import { MarketplaceService } from "@/services/marketplace.service";
import { notFound } from "next/navigation";


interface Props{
  params:{
    productId:string;
  };
}


export default async function ProductDetailsPage({
  params,
}:Props){

  const {productId}=params;


  try{

    const product =
      await MarketplaceService.getProductById(
        productId
      );


    if(!product){
      notFound();
    }


    return(
      <ProductDetails
        product={product}
      />
    );


  }catch(error){

    notFound();

  }

}
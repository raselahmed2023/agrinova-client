"use client";

import {
  useState,
} from "react";



interface ProductImageUploadProps {

  images:string[];

  setImages:
  React.Dispatch<
    React.SetStateAction<string[]>
  >;

}



export default function ProductImageUpload({

  images,

  setImages,

}:ProductImageUploadProps){



  const [uploading,setUploading] =
    useState(false);





  const handleUpload =
    async(
      e:React.ChangeEvent<HTMLInputElement>
    )=>{


      const files =
        e.target.files;


      if(!files)
        return;



      try{


        setUploading(true);



        /*
          Future:
          Cloudinary/S3 upload API here

          Currently creating local preview
        */



        const previewUrls =
          Array.from(files).map(

            file=>

            URL.createObjectURL(file)

          );



        setImages((prev)=>

          [
            ...prev,
            ...previewUrls,
          ]

        );



      }finally{


        setUploading(false);


      }


    };







  const removeImage =
    (index:number)=>{


      setImages((prev)=>

        prev.filter(
          (_,i)=>i!==index
        )

      );


    };








  return (

    <div className="space-y-4">


      <label

        className="
        text-sm
        font-medium
        "

      >

        Product Images

      </label>





      <input

        type="file"

        multiple

        accept="image/*"

        onChange={handleUpload}

        className="
        block
        w-full
        rounded-lg
        border
        p-2
        "

      />







      {
        uploading && (

          <p className="text-sm text-gray-500">

            Uploading...

          </p>

        )
      }








      {
        images.length>0 && (

          <div

            className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            "

          >

            {
              images.map(
                (image,index)=>(


                  <div

                    key={index}

                    className="
                    relative
                    h-32
                    rounded-xl
                    overflow-hidden
                    bg-gray-100
                    "

                  >



                    <img

                      src={image}

                      alt="product"

                      className="
                      h-full
                      w-full
                      object-cover
                      "

                    />




                    <button

                      type="button"

                      onClick={()=>
                        removeImage(index)
                      }

                      className="
                      absolute
                      top-2
                      right-2
                      rounded-full
                      bg-red-500
                      px-2
                      text-white
                      "

                    >

                      ×

                    </button>




                  </div>


                )

              )
            }


          </div>

        )
      }





    </div>

  );

}
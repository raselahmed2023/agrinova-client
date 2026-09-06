"use client";

import {
  PurchaseRequestStatus,
} from "@/types/marketplace";


const styles:Record<PurchaseRequestStatus,string>={

  PENDING:
    "bg-yellow-50 text-yellow-700",

  ACCEPTED:
    "bg-green-50 text-green-700",

  REJECTED:
    "bg-red-50 text-red-700",

  PROCESSING:
    "bg-blue-50 text-blue-700",

  COMPLETED:
    "bg-emerald-50 text-emerald-700",

  CANCELLED:
    "bg-gray-50 text-gray-600",

};


export default function RequestStatusBadge({
  status,
}:{
  status:PurchaseRequestStatus;
}){

  return(

    <span
      className={`
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      ${styles[status]}
      `}
    >
      {status}
    </span>

  );

}
"use client";

import {CheckCircle2,Loader2,Package,XCircle} from "lucide-react";
import RequestStatusBadge from "./RequestStatusBadge";
import type {PurchaseRequest,PurchaseRequestStatus} from "@/types/marketplace";

interface RequestCardProps{
  request:PurchaseRequest;
  type:"sent"|"received";
  updatingId:string|null;
  onStatusChange:(requestId:string,status:PurchaseRequestStatus)=>Promise<void>|void;
}

export default function RequestCard({
  request,
  type,
  updatingId,
  onStatusChange,
}:RequestCardProps){

  const isUpdating=updatingId===request._id;

  const message=request.message||request.note;

  return(
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex justify-between gap-4">

        <div>

          <RequestStatusBadge status={request.status}/>

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Product Request
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quantity: <b>{request.quantity}</b>
          </p>

        </div>

        <span className="text-xs text-slate-400">
          #{request._id.slice(-6)}
        </span>

      </div>


      {
        message && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-semibold text-slate-400">
              Message
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {message}
            </p>

          </div>
        )
      }


      <div className="mt-5 flex flex-wrap gap-3 border-t pt-5">


        {
          type==="received" &&
          request.status==="PENDING" && (
            <>

              <button
                disabled={isUpdating}
                onClick={()=>onStatusChange(request._id,"ACCEPTED")}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {
                  isUpdating
                  ?<Loader2 className="h-4 w-4 animate-spin"/>
                  :<CheckCircle2 className="h-4 w-4"/>
                }
                Accept
              </button>


              <button
                disabled={isUpdating}
                onClick={()=>onStatusChange(request._id,"REJECTED")}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
              >
                <XCircle className="h-4 w-4"/>
                Reject
              </button>

            </>
          )
        }


        {
          type==="sent" &&
          request.status==="PENDING" && (

            <button
              disabled={isUpdating}
              onClick={()=>onStatusChange(request._id,"CANCELLED")}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
            >
              <XCircle className="h-4 w-4"/>
              Cancel Request
            </button>

          )
        }


        {
          request.status!=="PENDING" && (

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <Package className="h-4 w-4"/>

              No further action

            </div>

          )
        }


      </div>

    </article>
  );
}
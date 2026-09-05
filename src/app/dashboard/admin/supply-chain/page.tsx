"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  CheckCircle2,
  MapPin,
  PackageCheck,
  RefreshCw,
  X,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

import {
  getAdminSupplyRequests,
  SupplyRequest,
  SupplyRequestStatus,
  updateSupplyRequestStatus,
} from "@/services/supply-chain.service";

const statusStyles: Record<
  SupplyRequestStatus,
  string
> = {
  SUBMITTED:
    "bg-amber-50 text-amber-700",

  ACCEPTED:
    "bg-emerald-50 text-emerald-700",

  REJECTED:
    "bg-rose-50 text-rose-700",

  RECEIVED:
    "bg-blue-50 text-blue-700",

  COMPLETED:
    "bg-slate-100 text-slate-700",
};

const branchNames: Record<
  string,
  string
> = {
  rajshahi: "Rajshahi",
  bogura: "Bogura",
  kushtia: "Kushtia",
  chattogram: "Chattogram",
  dhaka: "Dhaka",
};

export default function AdminSupplyChainPage() {
  const [
    requests,
    setRequests,
  ] = useState<
    SupplyRequest[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionId,
    setActionId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  const fetchRequests =
    async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: tokenData,
          error: tokenError,
        } =
          await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            "Authentication required."
          );
        }

        const response =
          await getAdminSupplyRequests(
            tokenData.token
          );

        setRequests(
          response.data
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load requests."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRequests();
  }, []);

  const changeStatus =
    async (
      requestId: string,
      status: SupplyRequestStatus
    ) => {
      try {
        setActionId(
          requestId
        );

        setError("");

        const {
          data: tokenData,
          error: tokenError,
        } =
          await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            "Authentication required."
          );
        }

        const response =
          await updateSupplyRequestStatus(
            requestId,
            status,
            tokenData.token
          );

        setRequests(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                requestId
                  ? response.data
                  : item
            )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update status."
        );
      } finally {
        setActionId(null);
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Supply Chain
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review farmer product
            submissions and manage
            their status.
          </p>
        </div>

        <button
          type="button"
          onClick={
            fetchRequests
          }
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          "SUBMITTED",
          "ACCEPTED",
          "REJECTED",
          "RECEIVED",
          "COMPLETED",
        ].map((status) => {
          const count =
            requests.filter(
              (request) =>
                request.status ===
                status
            ).length;

          return (
            <div
              key={status}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-medium text-slate-500">
                {status}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {count}
              </p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">
                  Product
                </th>

                <th className="px-5 py-3">
                  Farmer
                </th>

                <th className="px-5 py-3">
                  Quantity
                </th>

                <th className="px-5 py-3">
                  Location
                </th>

                <th className="px-5 py-3">
                  Branch
                </th>

                <th className="px-5 py-3">
                  Price
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    Loading supply
                    requests...
                  </td>
                </tr>
              ) : requests.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No supply requests
                    found.
                  </td>
                </tr>
              ) : (
                requests.map(
                  (request) => (
                    <tr
                      key={
                        request._id
                      }
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {request
                            .images?.[0] ? (
                            <img
                              src={
                                request
                                  .images[0]
                              }
                              alt={
                                request.productName
                              }
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                              <PackageCheck className="h-5 w-5" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-800">
                              {
                                request.productName
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {
                                request.category
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {
                            request.farmerName
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            request.phone
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {
                          request.quantity
                        }{" "}
                        {
                          request.unit
                        }
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1.5 text-slate-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                          <span>
                            {
                              request.upazila
                            }
                            ,{" "}
                            {
                              request.district
                            }
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-600">
                        {branchNames[
                          request.branch
                        ] ||
                          request.branch}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-700">
                        ৳
                        {
                          request.expectedPrice
                        }
                        /
                        {
                          request.unit
                        }
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[
                              request.status
                            ]
                          }`}
                        >
                          {
                            request.status
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {request.status ===
                            "SUBMITTED" && (
                            <>
                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  request._id
                                }
                                onClick={() =>
                                  changeStatus(
                                    request._id,
                                    "ACCEPTED"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Accept
                              </button>

                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  request._id
                                }
                                onClick={() =>
                                  changeStatus(
                                    request._id,
                                    "REJECTED"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}

                          {request.status ===
                            "ACCEPTED" && (
                            <button
                              type="button"
                              disabled={
                                actionId ===
                                request._id
                              }
                              onClick={() =>
                                changeStatus(
                                  request._id,
                                  "RECEIVED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                            >
                              <PackageCheck className="h-3.5 w-3.5" />
                              Mark Received
                            </button>
                          )}

                          {request.status ===
                            "RECEIVED" && (
                            <button
                              type="button"
                              disabled={
                                actionId ===
                                request._id
                              }
                              onClick={() =>
                                changeStatus(
                                  request._id,
                                  "COMPLETED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Complete
                            </button>
                          )}

                          {(request.status ===
                            "REJECTED" ||
                            request.status ===
                              "COMPLETED") && (
                            <span className="text-xs text-slate-400">
                              No action
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
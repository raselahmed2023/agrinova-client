"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Loader2,
  X,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

import FarmCoverImageField, {
  type FarmCoverImageFieldHandle,
} from "@/components/farm/FarmCoverImageField";

import type {
  FarmType,
  FarmUnit,
  IFarm,
  IFarmFormData,
} from "@/types/farm";

const BACKEND_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface Props {
  isOpen: boolean;

  onClose: () => void;

  onSuccess: () => void;

  farmData:
    | IFarm
    | null;
}

const FARM_TYPES: {
  value: FarmType;

  label: string;
}[] = [
  {
    value:
      "Crop",

    label:
      "Crop Farm",
  },
  {
    value:
      "Orchard",

    label:
      "Orchard / Horticulture",
  },
  {
    value:
      "Poultry",

    label:
      "Poultry Farm",
  },
  {
    value:
      "Livestock",

    label:
      "Livestock Farm",
  },
  {
    value:
      "Fishery",

    label:
      "Fish Farm",
  },
];

function createForm(
  farm?:
    | IFarm
    | null
): IFarmFormData {
  return {
    name:
      farm?.name ||
      "",

    farmType:
      farm?.farmType ||
      "",

    division:
      farm?.division ||
      "",

    district:
      farm?.district ||
      "",

    upazila:
      farm?.upazila ||
      "",

    landArea:
      farm?.landArea !=
      null
        ? String(
            farm.landArea
          )
        : "",

    unit:
      farm?.unit ||
      "Bigha",

    soilType:
      farm?.soilType ||
      "",

    status:
      farm?.status ||
      "Active",

    coverImage:
      farm?.coverImage ||
      "",

    description:
      farm?.description ||
      "",
  };
}

export default function EditFarmDrawer({
  isOpen,
  onClose,
  onSuccess,
  farmData,
}: Props) {
  const coverImageRef =
    useRef<FarmCoverImageFieldHandle>(
      null
    );

  const [
    form,
    setForm,
  ] =
    useState<IFarmFormData>(
      createForm()
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);
  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(() => {
    if (
      farmData
    ) {
      setForm(
        createForm(
          farmData
        )
      );

      setError(
        ""
      );
    }
  }, [
    farmData,
  ]);


  const districts =
    useMemo(
      () =>
        getDistrictsByDivision(
          form.division
        ),
      [
        form.division,
      ]
    );

  const upazilas =
    useMemo(
      () =>
        getUpazilasByDistrict(
          form.division,
          form.district
        ),
      [
        form.division,
        form.district,
      ]
    );

  if (
    !isOpen ||
    !farmData
  ) {
    return null;
  }

  const needsArea =
    [
      "Crop",
      "Orchard",
      "Fishery",
    ].includes(
      form.farmType
    );

  const needsSoil =
    [
      "Crop",
      "Orchard",
    ].includes(
      form.farmType
    );

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";


  const validate =
    () => {
      if (
        !form.name.trim()
      ) {
        return "Farm name is required.";
      }

      if (
        !form.farmType
      ) {
        return "Please select farm type.";
      }

      if (
        !form.division ||
        !form.district ||
        !form.upazila
      ) {
        return "Please select division, district and upazila.";
      }

      if (
        needsArea &&
        Number(
          form.landArea
        ) <=
          0
      ) {
        return "Farm area must be greater than 0.";
      }

      if (
        needsSoil &&
        !form.soilType
      ) {
        return "Please select soil type.";
      }

      return "";
    };


  const submit =
    async (
      event:
        | React.FormEvent<HTMLFormElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();

      if (
        loading ||
        uploading
      ) {
        return;
      }

      const validation =
        validate();

      if (
        validation
      ) {
        setError(
          validation
        );

        return;
      }

      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const ensuredCoverImage =
          await coverImageRef.current
            ?.ensureRemoteUrl();


        const {
          data:
            tokenData,

          error:
            tokenError,
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


        const payload = {
          name:
            form.name.trim(),

          farmType:
            form.farmType,

          division:
            form.division,

          district:
            form.district,

          upazila:
            form.upazila,

          ...(needsArea
            ? {
                landArea:
                  Number(
                    form.landArea
                  ),

                unit:
                  form.unit,
              }
            : {
                landArea:
                  undefined,

                unit:
                  undefined,
              }),

          ...(needsSoil
            ? {
                soilType:
                  form.soilType,
              }
            : {
                soilType:
                  undefined,
              }),

          status:
            form.status,

        
          coverImage:
            ensuredCoverImage ||
            form.coverImage
              ?.trim() ||
            undefined,

          description:
            form.description
              ?.trim() ||
            undefined,
        };



        const response =
          await fetch(
            `${BACKEND_URL}/farms/${farmData._id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${tokenData.token}`,
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const result =
          await response
            .json()
            .catch(
              () =>
                null
            );

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to update farm."
          );
        }

        coverImageRef.current
          ?.clearLocal();

        onSuccess();

        onClose();
      } catch (
        err
      ) {
        console.error(
          "Farm update failed:",
          err
        );

        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to update farm."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

 

  const handleClose =
    () => {
      if (
        loading ||
        uploading
      ) {
        return;
      }

      onClose();
    };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">

      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">


        <header className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Edit Farm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Update your farm information.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading ||
              uploading
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close Edit Farm"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

 

        <form
          onSubmit={
            submit
          }
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-600">
              {
                error
              }
            </div>
          )}

          {/* FARM NAME */}

          <Field label="Farm Name">
            <input
              value={
                form.name
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    name:
                      event
                        .target
                        .value,
                  })
                )
              }
              placeholder="Enter farm name"
              disabled={
                loading
              }
              className={
                inputClass
              }
            />
          </Field>

          {/* FARM TYPE */}

          <Field label="Farm Type">
            <select
              value={
                form.farmType
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    farmType:
                      event
                        .target
                        .value as
                        | FarmType
                        | "",
                  })
                )
              }
              className={
                inputClass
              }
            >
              <option value="">
                Select Farm Type
              </option>

              {FARM_TYPES.map(
                (
                  type
                ) => (
                  <option
                    key={
                      type.value
                    }
                    value={
                      type.value
                    }
                  >
                    {
                      type.label
                    }
                  </option>
                )
              )}
            </select>
          </Field>

          {/* DIVISION */}

          <Field label="Division">
            <select
              value={
                form.division
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    division:
                      event
                        .target
                        .value,

                    district:
                      "",

                    upazila:
                      "",
                  })
                )
              }
              className={
                inputClass
              }
            >
              <option value="">
                Select Division
              </option>

              {DIVISIONS.map(
                (
                  division
                ) => (
                  <option
                    key={
                      division
                    }
                    value={
                      division
                    }
                  >
                    {
                      division
                    }
                  </option>
                )
              )}
            </select>
          </Field>

        

          <div className="grid grid-cols-2 gap-3">

            <Field label="District">
              <select
                value={
                  form.district
                }
                disabled={
                  !form.division ||
                  loading
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      previous
                    ) => ({
                      ...previous,

                      district:
                        event
                          .target
                          .value,

                      upazila:
                        "",
                    })
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select District
                </option>

                {districts.map(
                  (
                    district
                  ) => (
                    <option
                      key={
                        district
                      }
                      value={
                        district
                      }
                    >
                      {
                        district
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Upazila">
              <select
                value={
                  form.upazila
                }
                disabled={
                  !form.district ||
                  loading
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      previous
                    ) => ({
                      ...previous,

                      upazila:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select Upazila
                </option>

                {upazilas.map(
                  (
                    upazila
                  ) => (
                    <option
                      key={
                        upazila
                      }
                      value={
                        upazila
                      }
                    >
                      {
                        upazila
                      }
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>

          {/* LAND/WATER AREA */}

          {needsArea && (
            <div className="grid grid-cols-2 gap-3">

              <Field label="Land / Water Area">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    form.landArea ??
                    ""
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        previous
                      ) => ({
                        ...previous,

                        landArea:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Unit">
                <select
                  value={
                    form.unit ||
                    "Bigha"
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        previous
                      ) => ({
                        ...previous,

                        unit:
                          event
                            .target
                            .value as FarmUnit,
                      })
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="Bigha">
                    Bigha
                  </option>

                  <option value="Decimal">
                    Decimal
                  </option>

                  <option value="Acre">
                    Acre
                  </option>

                  <option value="Hectare">
                    Hectare
                  </option>
                </select>
              </Field>
            </div>
          )}

          {/* SOIL TYPE */}

          {needsSoil && (
            <Field label="Soil Type">
              <select
                value={
                  form.soilType ||
                  ""
                }
                disabled={
                  loading
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      previous
                    ) => ({
                      ...previous,

                      soilType:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select Soil Type
                </option>

                <option value="Loamy">
                  Loamy
                </option>

                <option value="Clay">
                  Clay
                </option>

                <option value="Sandy">
                  Sandy
                </option>

                <option value="Silt">
                  Silt
                </option>
              </select>
            </Field>
          )}

          {/* STATUS */}

          <Field label="Status">
            <select
              value={
                form.status
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    status:
                      event
                        .target
                        .value as
                        | "Active"
                        | "Inactive",
                  })
                )
              }
              className={
                inputClass
              }
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </Field>

          {/* DESCRIPTION */}

          <Field label="Description">
            <textarea
              rows={
                3
              }
              value={
                form.description ||
                ""
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    description:
                      event
                        .target
                        .value,
                  })
                )
              }
              placeholder="Write a short description about this farm..."
              className={`${inputClass} h-auto resize-none`}
            />
          </Field>

   

          <FarmCoverImageField
            ref={
              coverImageRef
            }
            value={
              form.coverImage ||
              ""
            }
            purpose={`farm-edit-${farmData._id}`}
            disabled={
              loading
            }
            onBusyChange={
              setUploading
            }
            onChange={(
              coverImage
            ) =>
              setForm(
                (
                  previous
                ) => ({
                  ...previous,

                  coverImage,
                })
              )
            }
          />
        </form>

     

        <footer className="grid grid-cols-2 gap-3 border-t bg-slate-50 p-6">

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading ||
              uploading
            }
            className="rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              submit
            }
            disabled={
              loading ||
              uploading
            }
            className="flex items-center justify-center rounded-lg bg-[#0B513D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#084331] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Updating...
              </>
            ) : (
              "Update Farm"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}


function Field({
  label,
  children,
}: {
  label:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {
          label
        }
      </span>

      {
        children
      }
    </label>
  );
}
"use client";

import React, {
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
} from "@/types/farm";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface AddFarmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FarmFormState {
  name: string;
  farmType: FarmType | "";

  division: string;
  district: string;
  upazila: string;

  landArea: string;
  unit: FarmUnit;

  soilType: string;

  coverImage: string;
  description: string;
}

const initialFormData: FarmFormState = {
  name: "",
  farmType: "",

  division: "",
  district: "",
  upazila: "",

  landArea: "",
  unit: "Bigha",

  soilType: "",

  coverImage: "",
  description: "",
};

const FARM_TYPES: {
  value: FarmType;
  label: string;
}[] = [
  {
    value: "Crop",
    label: "Crop Farm",
  },
  {
    value: "Orchard",
    label:
      "Orchard / Horticulture",
  },
  {
    value: "Poultry",
    label: "Poultry Farm",
  },
  {
    value: "Livestock",
    label: "Livestock Farm",
  },
  {
    value: "Fishery",
    label: "Fish Farm",
  },
];

export default function AddFarmDrawer({
  isOpen,
  onClose,
  onSuccess,
}: AddFarmDrawerProps) {
  const coverImageRef =
    useRef<FarmCoverImageFieldHandle>(
      null
    );

  const [
    formData,
    setFormData,
  ] =
    useState<FarmFormState>(
      initialFormData
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    uploadingImg,
    setUploadingImg,
  ] =
    useState(false);

  const [
    errors,
    setErrors,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const districts =
    useMemo(
      () =>
        getDistrictsByDivision(
          formData.division
        ),
      [
        formData.division,
      ]
    );

  const upazilas =
    useMemo(
      () =>
        getUpazilasByDistrict(
          formData.division,
          formData.district
        ),
      [
        formData.division,
        formData.district,
      ]
    );

  const needsArea =
    formData.farmType ===
      "Crop" ||
    formData.farmType ===
      "Orchard" ||
    formData.farmType ===
      "Fishery";

  const needsSoil =
    formData.farmType ===
      "Crop" ||
    formData.farmType ===
      "Orchard";

  if (!isOpen) {
    return null;
  }

  const clearError =
    (
      field: string
    ) => {
      if (
        !errors[field]
      ) {
        return;
      }

      setErrors(
        (
          previous
        ) => ({
          ...previous,
          [field]:
            "",
        })
      );
    };

  const handleFarmTypeChange =
    (
      value:
        | FarmType
        | ""
    ) => {
      setFormData(
        (
          previous
        ) => ({
          ...previous,

          farmType:
            value,

          landArea:
            value ===
              "Poultry" ||
            value ===
              "Livestock"
              ? ""
              : previous.landArea,

          soilType:
            value ===
              "Crop" ||
            value ===
              "Orchard"
              ? previous.soilType
              : "",
        })
      );

      setErrors(
        (
          previous
        ) => ({
          ...previous,

          farmType:
            "",

          landArea:
            "",

          unit:
            "",

          soilType:
            "",
        })
      );
    };

  const validateForm =
    () => {
      const newErrors:
        Record<
          string,
          string
        > =
        {};

      if (
        !formData.name.trim()
      ) {
        newErrors.name =
          "Farm name is required";
      }

      if (
        !formData.farmType
      ) {
        newErrors.farmType =
          "Select a farm type";
      }

      if (
        !formData.division
      ) {
        newErrors.division =
          "Select a division";
      }

      if (
        !formData.district
      ) {
        newErrors.district =
          "Select a district";
      }

      if (
        !formData.upazila
      ) {
        newErrors.upazila =
          "Select an upazila";
      }

      if (
        needsArea
      ) {
        if (
          !formData.landArea
        ) {
          newErrors.landArea =
            formData.farmType ===
            "Fishery"
              ? "Pond or water area is required"
              : "Land area is required";
        } else if (
          Number(
            formData.landArea
          ) <=
          0
        ) {
          newErrors.landArea =
            "Area must be greater than 0";
        }
      }

      if (
        needsSoil &&
        !formData.soilType
      ) {
        newErrors.soilType =
          "Select a soil type";
      }

      setErrors(
        newErrors
      );

      return (
        Object.keys(
          newErrors
        ).length ===
        0
      );
    };

  const handleDivisionChange =
    (
      event:
        React.ChangeEvent<HTMLSelectElement>
    ) => {
      const division =
        event.target
          .value;

      setFormData(
        (
          previous
        ) => ({
          ...previous,

          division,

          district:
            "",

          upazila:
            "",
        })
      );

      setErrors(
        (
          previous
        ) => ({
          ...previous,

          division:
            "",

          district:
            "",

          upazila:
            "",
        })
      );
    };

  const handleDistrictChange =
    (
      event:
        React.ChangeEvent<HTMLSelectElement>
    ) => {
      const district =
        event.target
          .value;

      setFormData(
        (
          previous
        ) => ({
          ...previous,

          district,

          upazila:
            "",
        })
      );

      setErrors(
        (
          previous
        ) => ({
          ...previous,

          district:
            "",

          upazila:
            "",
        })
      );
    };

  const handleSubmit =
    async (
      event:
        | React.FormEvent<HTMLFormElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();

      if (
        loading ||
        uploadingImg
      ) {
        return;
      }

      if (
        !validateForm()
      ) {
        return;
      }

      try {
        setLoading(
          true
        );

        setErrors(
          (
            previous
          ) => ({
            ...previous,

            form:
              "",
          })
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
            "Authentication required"
          );
        }

        const payload = {
          name:
            formData.name.trim(),

          farmType:
            formData.farmType,

          division:
            formData.division,

          district:
            formData.district,

          upazila:
            formData.upazila,

          ...(needsArea
            ? {
                landArea:
                  Number(
                    formData.landArea
                  ),

                unit:
                  formData.unit,
              }
            : {}),

          ...(needsSoil
            ? {
                soilType:
                  formData.soilType,
              }
            : {}),

          coverImage:
            ensuredCoverImage ||
            formData.coverImage.trim() ||
            undefined,

          description:
            formData.description.trim() ||
            undefined,

          status:
            "Active" as const,
        };

        const response =
          await fetch(
            `${BACKEND_URL}/farms`,
            {
              method:
                "POST",

              headers: {
                Accept:
                  "application/json",

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

        const data =
          await response
            .json()
            .catch(
              () =>
                null
            );

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Failed to create farm"
          );
        }

        coverImageRef.current
          ?.clearLocal();

        setFormData(
          initialFormData
        );

        setErrors(
          {}
        );

        onSuccess();

        onClose();
      } catch (
        error
      ) {
        console.error(
          "Create farm error:",
          error
        );

        setErrors(
          (
            previous
          ) => ({
            ...previous,

            form:
              error instanceof
                Error
                ? error.message
                : "Failed to create farm",
          })
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
        uploadingImg
      ) {
        return;
      }

      setErrors(
        {}
      );

      onClose();
    };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">

      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">


        <div className="flex items-center justify-between border-b border-slate-100 p-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add New Farm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add information based on your farming activity.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading ||
              uploadingImg
            }
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close Add Farm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >

          {/* GENERAL ERROR */}

          {errors.form && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-600">
              {
                errors.form
              }
            </div>
          )}

          {/* FARM NAME */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Farm Name

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              placeholder="e.g. Green Valley Farm"
              value={
                formData.name
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) => {
                setFormData(
                  (
                    previous
                  ) => ({
                    ...previous,

                    name:
                      event.target
                        .value,
                  })
                );

                clearError(
                  "name"
                );
              }}
              className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500">
                {
                  errors.name
                }
              </p>
            )}
          </div>

          {/* FARM TYPE */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Farm Type

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={
                formData.farmType
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                handleFarmTypeChange(
                  event.target
                    .value as
                    | FarmType
                    | ""
                )
              }
              className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none ${
                errors.farmType
                  ? "border-red-500"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                Select farm type
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

            {errors.farmType && (
              <p className="mt-1 text-[11px] text-red-500">
                {
                  errors.farmType
                }
              </p>
            )}
          </div>

          {/* DIVISION */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Division

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={
                formData.division
              }
              disabled={
                loading
              }
              onChange={
                handleDivisionChange
              }
              className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none ${
                errors.division
                  ? "border-red-500"
                  : "border-slate-200"
              }`}
            >
              <option value="">
                Select division
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

            {errors.division && (
              <p className="mt-1 text-[11px] text-red-500">
                {
                  errors.division
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                District

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                value={
                  formData.district
                }
                onChange={
                  handleDistrictChange
                }
                disabled={
                  !formData.division ||
                  loading
                }
                className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  errors.district
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              >
                <option value="">
                  {formData.division
                    ? "Select district"
                    : "Select division first"}
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

              {errors.district && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.district
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Upazila

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                value={
                  formData.upazila
                }
                disabled={
                  !formData.district ||
                  loading
                }
                onChange={(
                  event
                ) => {
                  setFormData(
                    (
                      previous
                    ) => ({
                      ...previous,

                      upazila:
                        event.target
                          .value,
                    })
                  );

                  clearError(
                    "upazila"
                  );
                }}
                className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  errors.upazila
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              >
                <option value="">
                  {formData.district
                    ? "Select upazila"
                    : "Select district first"}
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

              {errors.upazila && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.upazila
                  }
                </p>
              )}
            </div>
          </div>

          {/* CONDITIONAL AREA */}

          {needsArea && (
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {formData.farmType ===
                  "Fishery"
                    ? "Pond / Water Area"
                    : "Land Area"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    formData.landArea
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) => {
                    setFormData(
                      (
                        previous
                      ) => ({
                        ...previous,

                        landArea:
                          event.target
                            .value,
                      })
                    );

                    clearError(
                      "landArea"
                    );
                  }}
                  className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.landArea
                      ? "border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                />

                {errors.landArea && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {
                      errors.landArea
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Unit

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={
                    formData.unit
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) =>
                    setFormData(
                      (
                        previous
                      ) => ({
                        ...previous,

                        unit:
                          event.target
                            .value as FarmUnit,
                      })
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none"
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
              </div>
            </div>
          )}

          {/* CONDITIONAL SOIL */}

          {needsSoil && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Soil Type

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                value={
                  formData.soilType
                }
                disabled={
                  loading
                }
                onChange={(
                  event
                ) => {
                  setFormData(
                    (
                      previous
                    ) => ({
                      ...previous,

                      soilType:
                        event.target
                          .value,
                    })
                  );

                  clearError(
                    "soilType"
                  );
                }}
                className={`w-full rounded-lg border bg-white p-2.5 text-sm outline-none ${
                  errors.soilType
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              >
                <option value="">
                  Select dominant soil type
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

              {errors.soilType && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.soilType
                  }
                </p>
              )}
            </div>
          )}

          {/* DESCRIPTION */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Description

              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              rows={
                3
              }
              placeholder="Add details about this farm..."
              value={
                formData.description
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setFormData(
                  (
                    previous
                  ) => ({
                    ...previous,

                    description:
                      event.target
                        .value,
                  })
                )
              }
              className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>


          <FarmCoverImageField
            ref={
              coverImageRef
            }
            value={
              formData.coverImage
            }
            purpose="farm-create"
            disabled={
              loading
            }
            onBusyChange={
              setUploadingImg
            }
            onChange={(
              coverImage
            ) =>
              setFormData(
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


        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 p-6">

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading ||
              uploadingImg
            }
            className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              loading ||
              uploadingImg
            }
            className="flex w-full items-center justify-center rounded-lg bg-[#0B513D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f30] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Saving...
              </>
            ) : (
              "Save Farm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

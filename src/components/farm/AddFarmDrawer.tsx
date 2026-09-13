"use client";

import React, {
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  Loader2,
  UploadCloud,
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

import type {
  FarmType,
  FarmUnit,
} from "@/types/farm";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
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

const INITIAL: FormState = {
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
    label:
      "Poultry Farm",
  },
  {
    value: "Livestock",
    label:
      "Livestock Farm",
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
}: Props) {
  const [form, setForm] =
    useState<FormState>(
      INITIAL
    );

  const [loading, setLoading] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  const districts =
    useMemo(
      () =>
        getDistrictsByDivision(
          form.division
        ),
      [form.division]
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

  if (!isOpen) return null;

  const needsArea =
    ["Crop", "Orchard", "Fishery"].includes(
      form.farmType
    );

  const needsSoil =
    ["Crop", "Orchard"].includes(
      form.farmType
    );

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const uploadImage =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target
          .files?.[0];

      event.target.value = "";

      if (!file) return;

      setUploadError("");

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(
          file.type
        )
      ) {
        setUploadError(
          "Only JPG, PNG or WEBP images are allowed."
        );

        return;
      }

      if (
        file.size >
        5 *
          1024 *
          1024
      ) {
        setUploadError(
          "Image must be 5MB or smaller."
        );

        return;
      }

      try {
        setUploading(true);

        const body =
          new FormData();

        body.append(
          "image",
          file
        );

        body.append(
          "purpose",
          "farm"
        );

        const response =
          await fetch(
            "/api/upload",
            {
              method:
                "POST",
              body,
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
          !result?.success ||
          !result?.url
        ) {
          throw new Error(
            result?.message ||
              "Failed to upload image."
          );
        }

        setForm(
          (prev) => ({
            ...prev,
            coverImage:
              String(
                result.url
              ),
          })
        );
      } catch (err) {
        setUploadError(
          err instanceof Error
            ? err.message
            : "Image upload failed."
        );
      } finally {
        setUploading(false);
      }
    };

  const validate =
    () => {
      if (!form.name.trim()) {
        return "Farm name is required.";
      }

      if (!form.farmType) {
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
        ) <= 0
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

      const validation =
        validate();

      if (validation) {
        setError(
          validation
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        const {
          data: tokenData,
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
            : {}),

          ...(needsSoil
            ? {
                soilType:
                  form.soilType,
              }
            : {}),

          coverImage:
            form.coverImage ||
            undefined,

          description:
            form.description.trim() ||
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
          await response.json();

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to create farm."
          );
        }

        setForm(INITIAL);

        onSuccess();
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create farm."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">
              Add New Farm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add your farm information.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form
          onSubmit={submit}
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              {error}
            </div>
          )}

          <Field label="Farm Name">
            <input
              value={
                form.name
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,
                    name:
                      e.target
                        .value,
                  })
                )
              }
              className={
                inputClass
              }
            />
          </Field>

          <Field label="Farm Type">
            <select
              value={
                form.farmType
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    farmType:
                      e.target
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
                (type) => (
                  <option
                    key={
                      type.value
                    }
                    value={
                      type.value
                    }
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>
          </Field>

          <Field label="Division">
            <select
              value={
                form.division
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    division:
                      e.target
                        .value,

                    district:
                      "",

                    upazila: "",
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
                  !form.division
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      district:
                        e.target
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
                  !form.district
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      upazila:
                        e.target
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

          {needsArea && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Land / Water Area">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    form.landArea
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,

                        landArea:
                          e.target
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
                    form.unit
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,

                        unit:
                          e.target
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

          {needsSoil && (
            <Field label="Soil Type">
              <select
                value={
                  form.soilType
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      soilType:
                        e.target
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

          <Field label="Description">
            <textarea
              rows={3}
              value={
                form.description
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    description:
                      e.target
                        .value,
                  })
                )
              }
              className={`${inputClass} h-auto resize-none`}
            />
          </Field>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Cover Image
            </p>

            <label className="relative flex min-h-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              ) : form.coverImage ? (
                <Image
                  src={
                    form.coverImage
                  }
                  alt="Farm"
                  fill
                  sizes="448px"
                  className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />

                  <p className="mt-2 text-xs text-slate-500">
                    Upload JPG, PNG or WEBP
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  uploadImage
                }
                className="hidden"
              />
            </label>

            {uploadError && (
              <p className="mt-2 text-xs text-red-600">
                {uploadError}
              </p>
            )}
          </div>
        </form>

        <footer className="grid grid-cols-2 gap-3 border-t bg-slate-50 p-6">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading ||
              uploading
            }
            className="rounded-lg border border-slate-300 py-2.5 text-sm font-semibold"
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
            className="flex items-center justify-center rounded-lg bg-[#0B513D] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Farm"
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
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}
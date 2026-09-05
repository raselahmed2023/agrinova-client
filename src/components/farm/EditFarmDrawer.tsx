'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';

import {
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from '@/constants/bangladeshLocations';

import type {
  FarmType,
  FarmUnit,
  IFarm,
  IFarmFormData,
} from '@/types/farm';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1';

const IMGBB_API_KEY =
  process.env
    .NEXT_PUBLIC_IMGBB_API_KEY;

interface EditFarmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farmData: IFarm | null;
}

const FARM_TYPES: {
  value: FarmType;
  label: string;
}[] = [
  {
    value: 'Crop',
    label: 'Crop Farm',
  },
  {
    value: 'Orchard',
    label: 'Orchard / Horticulture',
  },
  {
    value: 'Poultry',
    label: 'Poultry Farm',
  },
  {
    value: 'Livestock',
    label: 'Livestock Farm',
  },
  {
    value: 'Fishery',
    label: 'Fish Farm',
  },
];

const getInitialFormData = (
  farm?: IFarm | null
): IFarmFormData => ({
  name: farm?.name || '',
  farmType: farm?.farmType || '',
  division: farm?.division || '',
  district: farm?.district || '',
  upazila: farm?.upazila || '',
  landArea:
    farm?.landArea !== undefined &&
    farm?.landArea !== null
      ? String(farm.landArea)
      : '',
  unit:
    farm?.unit || 'Bigha',
  soilType:
    farm?.soilType || '',
  status:
    farm?.status || 'Active',
  coverImage:
    farm?.coverImage || '',
  description:
    farm?.description || '',
});

export default function EditFarmDrawer({
  isOpen,
  onClose,
  onSuccess,
  farmData,
}: EditFarmDrawerProps) {
  const [formData, setFormData] =
    useState<IFarmFormData>(
      getInitialFormData()
    );

  const [loading, setLoading] =
    useState(false);

  const [
    uploadingImg,
    setUploadingImg,
  ] = useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {}
    );

  const [
    uploadError,
    setUploadError,
  ] = useState('');

  useEffect(() => {
    if (!farmData) return;

    setFormData(
      getInitialFormData(farmData)
    );

    setErrors({});
    setUploadError('');
  }, [farmData]);

  const districts = useMemo(
    () =>
      getDistrictsByDivision(
        formData.division
      ),
    [formData.division]
  );

  const upazilas = useMemo(
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
    formData.farmType === 'Crop' ||
    formData.farmType ===
      'Orchard' ||
    formData.farmType ===
      'Fishery';

  const needsSoil =
    formData.farmType === 'Crop' ||
    formData.farmType ===
      'Orchard';

  if (
    !isOpen ||
    !farmData
  ) {
    return null;
  }

  const clearError = (
    field: string
  ) => {
    if (!errors[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleFarmTypeChange = (
    value: FarmType | ''
  ) => {
    setFormData((prev) => ({
      ...prev,
      farmType: value,

      landArea:
        value === 'Poultry' ||
        value === 'Livestock'
          ? ''
          : prev.landArea,

      soilType:
        value === 'Crop' ||
        value === 'Orchard'
          ? prev.soilType
          : '',
    }));

    setErrors((prev) => ({
      ...prev,
      farmType: '',
      landArea: '',
      soilType: '',
    }));
  };

  const handleDivisionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const division = e.target.value;

    setFormData((prev) => ({
      ...prev,
      division,
      district: '',
      upazila: '',
    }));

    setErrors((prev) => ({
      ...prev,
      division: '',
      district: '',
      upazila: '',
    }));
  };

  const handleDistrictChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const district = e.target.value;

    setFormData((prev) => ({
      ...prev,
      district,
      upazila: '',
    }));

    setErrors((prev) => ({
      ...prev,
      district: '',
      upazila: '',
    }));
  };

  const validateForm = () => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (!formData.name.trim()) {
      newErrors.name =
        'Farm name is required';
    }

    if (!formData.farmType) {
      newErrors.farmType =
        'Select a farm type';
    }

    if (!formData.division) {
      newErrors.division =
        'Select a division';
    }

    if (!formData.district) {
      newErrors.district =
        'Select a district';
    }

    if (!formData.upazila) {
      newErrors.upazila =
        'Select an upazila';
    }

    if (needsArea) {
      if (!formData.landArea) {
        newErrors.landArea =
          formData.farmType ===
          'Fishery'
            ? 'Pond or water area is required'
            : 'Land area is required';
      } else if (
        Number(formData.landArea) <= 0
      ) {
        newErrors.landArea =
          'Area must be greater than 0';
      }
    }

    if (
      needsSoil &&
      !formData.soilType
    ) {
      newErrors.soilType =
        'Select a soil type';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setUploadError('');

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setUploadError(
        'Image must be smaller than 5MB'
      );
      return;
    }

    if (!IMGBB_API_KEY) {
      setUploadError(
        'Image upload is not configured.'
      );
      return;
    }

    try {
      setUploadingImg(true);

      const imageFormData =
        new FormData();

      imageFormData.append(
        'image',
        file
      );

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: imageFormData,
        }
      );

      const data =
        await res.json();

      if (
        res.ok &&
        data?.success &&
        data?.data?.url
      ) {
        setFormData((prev) => ({
          ...prev,
          coverImage:
            data.data.url,
        }));
      } else {
        setUploadError(
          'Failed to upload image'
        );
      }
    } catch (err) {
      console.error(
        'Image upload failed:',
        err
      );

      setUploadError(
        'Failed to upload image'
      );
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      setErrors((prev) => ({
        ...prev,
        form: '',
      }));

      const {
        data: tokenData,
        error: tokenError,
      } = await authClient.token();

      if (
        tokenError ||
        !tokenData?.token
      ) {
        throw new Error(
          'Authentication required'
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
              landArea: Number(
                formData.landArea
              ),
              unit:
                formData.unit,
            }
          : {
              landArea: undefined,
              unit: undefined,
            }),

        ...(needsSoil
          ? {
              soilType:
                formData.soilType,
            }
          : {
              soilType: undefined,
            }),

        status:
          formData.status,

        coverImage:
          formData.coverImage
            ?.trim() ||
          undefined,

        description:
          formData.description
            ?.trim() ||
          undefined,
      };

      const res = await fetch(
        `${BACKEND_URL}/farms/${farmData._id}`,
        {
          method: 'PATCH',

          headers: {
            Accept:
              'application/json',

            'Content-Type':
              'application/json',

            Authorization: `Bearer ${tokenData.token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await res.json();

      if (
        !res.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
            'Failed to update farm'
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(
        'Update farm error:',
        err
      );

      setErrors((prev) => ({
        ...prev,

        form:
          err instanceof Error
            ? err.message
            : 'Failed to update farm',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (
      loading ||
      uploadingImg
    ) {
      return;
    }

    setErrors({});
    setUploadError('');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Edit Farm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Update information based on your farming activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {errors.form && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              {errors.form}
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
              value={formData.name}
              onChange={(e) => {
                setFormData(
                  (prev) => ({
                    ...prev,
                    name:
                      e.target.value,
                  })
                );

                clearError('name');
              }}
              className={`w-full rounded-lg border p-2.5 text-sm outline-none ${
                errors.name
                  ? 'border-red-500'
                  : 'border-slate-200 focus:border-emerald-500'
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.name}
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
              onChange={(e) =>
                handleFarmTypeChange(
                  e.target
                    .value as
                    | FarmType
                    | ''
                )
              }
              className={`w-full rounded-lg border bg-white p-2.5 text-sm ${
                errors.farmType
                  ? 'border-red-500'
                  : 'border-slate-200'
              }`}
            >
              <option value="">
                Select farm type
              </option>

              {FARM_TYPES.map(
                (type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
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
              onChange={
                handleDivisionChange
              }
              className={`w-full rounded-lg border bg-white p-2.5 text-sm ${
                errors.division
                  ? 'border-red-500'
                  : 'border-slate-200'
              }`}
            >
              <option value="">
                Select division
              </option>

              {DIVISIONS.map(
                (division) => (
                  <option
                    key={division}
                    value={division}
                  >
                    {division}
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

          {/* DISTRICT + UPAZILA */}
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
                  !formData.division
                }
                className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:bg-slate-100 ${
                  errors.district
                    ? 'border-red-500'
                    : 'border-slate-200'
                }`}
              >
                <option value="">
                  {formData.division
                    ? 'Select district'
                    : 'Select division first'}
                </option>

                {districts.map(
                  (district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
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
                onChange={(e) => {
                  setFormData(
                    (prev) => ({
                      ...prev,
                      upazila:
                        e.target.value,
                    })
                  );

                  clearError(
                    'upazila'
                  );
                }}
                disabled={
                  !formData.district
                }
                className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:bg-slate-100 ${
                  errors.upazila
                    ? 'border-red-500'
                    : 'border-slate-200'
                }`}
              >
                <option value="">
                  {formData.district
                    ? 'Select upazila'
                    : 'Select district first'}
                </option>

                {upazilas.map(
                  (upazila) => (
                    <option
                      key={upazila}
                      value={upazila}
                    >
                      {upazila}
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
                  'Fishery'
                    ? 'Pond / Water Area'
                    : 'Land Area'}

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.landArea ||
                    ''
                  }
                  onChange={(e) => {
                    setFormData(
                      (prev) => ({
                        ...prev,
                        landArea:
                          e.target.value,
                      })
                    );

                    clearError(
                      'landArea'
                    );
                  }}
                  className={`w-full rounded-lg border p-2.5 text-sm ${
                    errors.landArea
                      ? 'border-red-500'
                      : 'border-slate-200'
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
                </label>

                <select
                  value={
                    formData.unit
                  }
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        unit:
                          e.target
                            .value as FarmUnit,
                      })
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm"
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
                  formData.soilType ||
                  ''
                }
                onChange={(e) => {
                  setFormData(
                    (prev) => ({
                      ...prev,
                      soilType:
                        e.target.value,
                    })
                  );

                  clearError(
                    'soilType'
                  );
                }}
                className={`w-full rounded-lg border bg-white p-2.5 text-sm ${
                  errors.soilType
                    ? 'border-red-500'
                    : 'border-slate-200'
                }`}
              >
                <option value="">
                  Select soil type
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

          {/* STATUS */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Status
            </label>

            <select
              value={
                formData.status
              }
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    status:
                      e.target
                        .value as
                        | 'Active'
                        | 'Inactive',
                  })
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Description
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              rows={3}
              value={
                formData.description ||
                ''
              }
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    description:
                      e.target.value,
                  })
                )
              }
              placeholder="Add details about this farm..."
              className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm"
            />
          </div>

          {/* COVER IMAGE */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Cover Image
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <label className="relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 transition hover:bg-slate-50">
              {uploadingImg ? (
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              ) : formData.coverImage ? (
                <Image
                  src={
                    formData.coverImage
                  }
                  alt="Farm preview"
                  fill
                  sizes="448px"
                  className="object-cover"
                />
              ) : (
                <>
                  <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />

                  <span className="text-xs font-medium text-slate-600">
                    Change cover image
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageUpload
                }
                disabled={
                  uploadingImg
                }
                className="hidden"
              />
            </label>

            {uploadError && (
              <p className="mt-1 text-[11px] text-red-500">
                {uploadError}
              </p>
            )}
          </div>
        </form>

        {/* FOOTER */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={
              loading ||
              uploadingImg
            }
            className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              uploadingImg
            }
            className="flex w-full items-center justify-center rounded-lg bg-[#0B513D] py-2.5 text-sm font-semibold text-white hover:bg-[#083f30] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Update Farm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
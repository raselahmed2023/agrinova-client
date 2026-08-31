'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  '/api/v1';

interface AddFarmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFarmDrawer({
  isOpen,
  onClose,
  onSuccess,
}: AddFarmDrawerProps) {
  const [loading, setLoading] =
    useState(false);

  const [
    uploadingImg,
    setUploadingImg,
  ] = useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [uploadError, setUploadError] =
    useState<string>('');

  const [formData, setFormData] =
    useState({
      name: '',
      division: '',
      district: '',
      landArea: '',
      unit: 'Bigha',
      soilType: '',
      coverImage: '',
      description: '',
    });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (!formData.name.trim())
      newErrors.name =
        'Farm name is required';

    if (!formData.division)
      newErrors.division =
        'Select a division';

    if (!formData.district)
      newErrors.district =
        'Select a district';

    if (!formData.landArea)
      newErrors.landArea =
        'Land area is required';

    if (!formData.soilType)
      newErrors.soilType =
        'Select a soil type';

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setUploadError('');

    const apiKey =
      process.env
        .NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      setUploadError(
        'API Key is missing'
      );

      return;
    }

    try {
      setUploadingImg(true);

      const imgFormData =
        new FormData();

      imgFormData.append(
        'image',
        file
      );

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: 'POST',
          body: imgFormData,
        }
      );

      const data =
        await res.json();

      if (data.success) {
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
        'Image upload failed'
      );
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
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
          'Authentication required'
        );
      }

      const res = await fetch(
        `${BACKEND_URL}/farms`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization: `Bearer ${tokenData.token}`,
          },

          body: JSON.stringify({
            ...formData,

            landArea: Number(
              formData.landArea
            ),

            coverImage:
              formData.coverImage.trim() !==
              ''
                ? formData.coverImage
                : undefined,

            description:
              formData.description.trim() !==
              ''
                ? formData.description
                : undefined,
          }),
        }
      );

      const data =
        await res.json();

      if (
        res.ok &&
        data.success
      ) {
        onSuccess();
        onClose();

        setFormData({
          name: '',
          division: '',
          district: '',
          landArea: '',
          unit: 'Bigha',
          soilType: '',
          coverImage: '',
          description: '',
        });

        setErrors({});
      } else {
        setErrors((prev) => ({
          ...prev,

          form:
            data.message ||
            'Failed to create farm',
        }));
      }
    } catch (err) {
      console.error(err);

      setErrors((prev) => ({
        ...prev,
        form:
          err instanceof Error
            ? err.message
            : 'Something went wrong',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Add New Farm
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {errors.form && (
            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm Name
            </label>

            <input
              type="text"
              placeholder="e.g. Riverside Plot"
              value={formData.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                });

                if (errors.name)
                  setErrors(
                    (prev) => ({
                      ...prev,
                      name: '',
                    })
                  );
              }}
              className={`w-full border rounded-lg p-2.5 text-sm focus:outline-none transition ${
                errors.name
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
              }`}
            />

            {errors.name && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Division
              </label>

              <select
                value={
                  formData.division
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    division:
                      e.target.value,
                  });

                  if (
                    errors.division
                  )
                    setErrors(
                      (prev) => ({
                        ...prev,
                        division: '',
                      })
                    );
                }}
                className={`w-full border rounded-lg p-2.5 text-sm bg-white transition ${
                  errors.division
                    ? 'border-red-500'
                    : 'border-slate-200'
                }`}
              >
                <option value="">
                  Select...
                </option>

                <option value="Khulna">
                  Khulna
                </option>

                <option value="Rajshahi">
                  Rajshahi
                </option>

                <option value="Dhaka">
                  Dhaka
                </option>
              </select>

              {errors.division && (
                <p className="text-[11px] text-red-500 mt-1">
                  {
                    errors.division
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District
              </label>

              <select
                value={
                  formData.district
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    district:
                      e.target.value,
                  });

                  if (
                    errors.district
                  )
                    setErrors(
                      (prev) => ({
                        ...prev,
                        district: '',
                      })
                    );
                }}
                className={`w-full border rounded-lg p-2.5 text-sm bg-white transition ${
                  errors.district
                    ? 'border-red-500'
                    : 'border-slate-200'
                }`}
              >
                <option value="">
                  Select...
                </option>

                <option value="Kushtia Sadar">
                  Kushtia Sadar
                </option>

                <option value="Chuadanga">
                  Chuadanga
                </option>

                <option value="Rajshahi">
                  Rajshahi
                </option>
              </select>

              {errors.district && (
                <p className="text-[11px] text-red-500 mt-1">
                  {
                    errors.district
                  }
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Land Area
              </label>

              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={
                  formData.landArea
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    landArea:
                      e.target.value,
                  });

                  if (
                    errors.landArea
                  )
                    setErrors(
                      (prev) => ({
                        ...prev,
                        landArea: '',
                      })
                    );
                }}
                className={`w-full border rounded-lg p-2.5 text-sm focus:outline-none transition ${
                  errors.landArea
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                }`}
              />

              {errors.landArea && (
                <p className="text-[11px] text-red-500 mt-1">
                  {
                    errors.landArea
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit
              </label>

              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="Bigha">
                  Bigha
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil Type
            </label>

            <select
              value={
                formData.soilType
              }
              onChange={(e) => {
                setFormData({
                  ...formData,
                  soilType:
                    e.target.value,
                });

                if (
                  errors.soilType
                )
                  setErrors(
                    (prev) => ({
                      ...prev,
                      soilType: '',
                    })
                  );
              }}
              className={`w-full border rounded-lg p-2.5 text-sm bg-white transition ${
                errors.soilType
                  ? 'border-red-500'
                  : 'border-slate-200'
              }`}
            >
              <option value="">
                Select dominant soil
                type...
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
              <p className="text-[11px] text-red-500 mt-1">
                {errors.soilType}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
              (Optional)
            </label>

            <textarea
              rows={3}
              placeholder="Add details about this farm..."
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cover Image
              (Optional)
            </label>

            <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition relative">
              {uploadingImg ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              ) : formData.coverImage ? (
                <Image
                  src={
                    formData.coverImage
                  }
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />

                  <span className="text-xs text-slate-500 text-center">
                    Click to upload
                    SVG, PNG, JPG
                    (max. 5MB)
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />
            </label>

            {uploadError && (
              <p className="text-[11px] text-red-500 mt-1">
                {uploadError}
              </p>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              uploadingImg
            }
            className="w-full py-2.5 bg-emerald-950 text-white rounded-lg text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save Farm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
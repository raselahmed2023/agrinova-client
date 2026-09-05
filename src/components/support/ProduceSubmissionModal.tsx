"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  Building2,
  FileText,
  MapPin,
  Package,
  Sprout,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

import {
  createSupplyRequest,
} from "@/services/supply-chain.service";

interface ProductSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

interface ProductFormData {
  farmerName: string;
  phone: string;

  productName: string;
  category: string;

  quantity: string;
  unit: string;
  expectedPrice: string;

  division: string;
  district: string;
  upazila: string;
  location: string;

  branch: string;

  notes: string;
  images: File[];
}

interface CategoryOption {
  value: string;
  label: string;
}

interface UnitOption {
  value: string;
  label: string;
}

interface BranchOption {
  value: string;
  label: string;
}

interface ImgBBResponse {
  success: boolean;

  data?: {
    url?: string;
  };

  error?: {
    message?: string;
  };
}

const CATEGORIES: CategoryOption[] = [
  {
    value: "vegetables",
    label: "Vegetables",
  },
  {
    value: "fruits",
    label: "Fruits",
  },
  {
    value: "grains_cereals",
    label: "Grains & Cereals",
  },
  {
    value: "pulses_seeds",
    label: "Pulses & Seeds",
  },
  {
    value: "spices",
    label: "Spices",
  },
  {
    value: "agricultural_by_products",
    label:
      "Agricultural By-products",
  },
  {
    value: "other",
    label: "Other",
  },
];

const UNITS: UnitOption[] = [
  {
    value: "kg",
    label: "Kg",
  },
  {
    value: "maund",
    label: "Maund",
  },
  {
    value: "ton",
    label: "Ton",
  },
  {
    value: "bag",
    label: "Bag",
  },
  {
    value: "box",
    label: "Box",
  },
];

const BRANCHES: BranchOption[] = [
  {
    value: "rajshahi",
    label:
      "AgriNova Rajshahi Branch",
  },
  {
    value: "bogura",
    label:
      "AgriNova Bogura Branch",
  },
  {
    value: "kushtia",
    label:
      "AgriNova Kushtia Branch",
  },
  {
    value: "chattogram",
    label:
      "AgriNova Chattogram Branch",
  },
  {
    value: "dhaka",
    label:
      "AgriNova Dhaka Branch",
  },
];

const initialFormData: ProductFormData =
  {
    farmerName: "",
    phone: "",

    productName: "",
    category: "",

    quantity: "",
    unit: "kg",
    expectedPrice: "",

    division: "",
    district: "",
    upazila: "",
    location: "",

    branch: "",

    notes: "",
    images: [],
  };

export default function ProductSubmissionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: ProductSubmissionModalProps) {
  const [
    formData,
    setFormData,
  ] = useState<ProductFormData>(
    initialFormData
  );

  const [
    previews,
    setPreviews,
  ] = useState<string[]>([]);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const districts =
    getDistrictsByDivision(
      formData.division
    );

  const upazilas =
    getUpazilasByDistrict(
      formData.division,
      formData.district
    );

  if (!isOpen) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#0b5d42] focus:ring-2 focus:ring-[#0b5d42]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-gray-700";

  const clearPreviews = () => {
    previews.forEach((preview) => {
      URL.revokeObjectURL(
        preview
      );
    });
  };

  const resetForm = () => {
    clearPreviews();

    setFormData(
      initialFormData
    );

    setPreviews([]);
    setFormError("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormError("");
    setSuccessMessage("");

    if (name === "division") {
      setFormData((previous) => ({
        ...previous,
        division: value,
        district: "",
        upazila: "",
      }));

      return;
    }

    if (name === "district") {
      setFormData((previous) => ({
        ...previous,
        district: value,
        upazila: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    const remaining =
      5 - formData.images.length;

    if (remaining <= 0) {
      setFormError(
        "Maximum 5 product photos are allowed."
      );

      return;
    }

    const validFiles =
      selectedFiles
        .filter((file) =>
          file.type.startsWith(
            "image/"
          )
        )
        .filter(
          (file) =>
            file.size <=
            5 * 1024 * 1024
        )
        .slice(0, remaining);

    if (
      validFiles.length === 0
    ) {
      setFormError(
        "Please select valid images under 5 MB."
      );

      event.target.value = "";
      return;
    }

    const newPreviews =
      validFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setFormData((previous) => ({
      ...previous,
      images: [
        ...previous.images,
        ...validFiles,
      ],
    }));

    setPreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    if (
      selectedFiles.length >
      validFiles.length
    ) {
      setFormError(
        "Some files were skipped. Maximum 5 images, 5 MB each."
      );
    } else {
      setFormError("");
    }

    event.target.value = "";
  };

  const removeImage = (
    index: number
  ) => {
    URL.revokeObjectURL(
      previews[index]
    );

    setPreviews((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );

    setFormData((previous) => ({
      ...previous,

      images:
        previous.images.filter(
          (_, currentIndex) =>
            currentIndex !== index
        ),
    }));
  };

  const uploadSingleImage =
    async (
      file: File
    ): Promise<string> => {
      const apiKey =
        process.env
          .NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error(
          "Image upload is not configured."
        );
      }

      const imageFormData =
        new FormData();

      imageFormData.append(
        "image",
        file
      );

      const response =
        await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

      const result: ImgBBResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data?.url
      ) {
        throw new Error(
          result.error?.message ||
            "Image upload failed."
        );
      }

      return result.data.url;
    };

  const uploadImages =
    async (): Promise<
      string[]
    > => {
      if (
        formData.images.length === 0
      ) {
        return [];
      }

      return Promise.all(
        formData.images.map(
          uploadSingleImage
        )
      );
    };

  const validateForm = () => {
    const phoneRegex =
      /^01[3-9]\d{8}$/;

    if (
      !phoneRegex.test(
        formData.phone
      )
    ) {
      setFormError(
        "Please enter a valid Bangladeshi phone number."
      );

      return false;
    }

    if (
      Number(
        formData.quantity
      ) <= 0
    ) {
      setFormError(
        "Quantity must be greater than 0."
      );

      return false;
    }

    if (
      Number(
        formData.expectedPrice
      ) < 0
    ) {
      setFormError(
        "Expected price cannot be negative."
      );

      return false;
    }

    if (
      !formData.division ||
      !formData.district ||
      !formData.upazila
    ) {
      setFormError(
        "Please select division, district and upazila."
      );

      return false;
    }

    if (!formData.branch) {
      setFormError(
        "Please select an AgriNova branch."
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrls =
        await uploadImages();

      await createSupplyRequest({
        farmerName:
          formData.farmerName.trim(),

        phone:
          formData.phone.trim(),

        productName:
          formData.productName.trim(),

        category:
          formData.category,

        quantity: Number(
          formData.quantity
        ),

        unit:
          formData.unit,

        expectedPrice:
          Number(
            formData.expectedPrice
          ),

        division:
          formData.division,

        district:
          formData.district,

        upazila:
          formData.upazila,

        location:
          formData.location.trim(),

        branch:
          formData.branch,

        notes:
          formData.notes.trim(),

        images: imageUrls,
      });

      clearPreviews();

      setFormData(
        initialFormData
      );

      setPreviews([]);

      setSuccessMessage(
        "Your product has been submitted successfully for AgriNova review."
      );

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-[#053225] px-5 py-5 text-white sm:px-7">
          <button
            type="button"
            onClick={handleClose}
            disabled={
              isSubmitting
            }
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3 pr-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Sprout className="h-6 w-6 text-[#b2f2bb]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Sell Through AgriNova
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-5 text-white/75">
                Submit your farm product
                details for AgriNova supply
                chain review.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-7 p-5 sm:p-7">
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <section>
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <UserRound className="h-4 w-4 text-[#0b5d42]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Farmer Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Enter your contact
                    information.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Farmer Name *
                  </label>

                  <input
                    type="text"
                    name="farmerName"
                    required
                    value={
                      formData.farmerName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={11}
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="01XXXXXXXXX"
                    className={
                      inputClass
                    }
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <Package className="h-4 w-4 text-[#0b5d42]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Product Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Add details about the
                    product you want to
                    sell.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="productName"
                    required
                    value={
                      formData.productName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Rice, Potato, Tomato"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Category *
                  </label>

                  <select
                    name="category"
                    required
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select category
                    </option>

                    {CATEGORIES.map(
                      (category) => (
                        <option
                          key={
                            category.value
                          }
                          value={
                            category.value
                          }
                        >
                          {
                            category.label
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Quantity *
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0.01"
                    step="0.01"
                    value={
                      formData.quantity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 500"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Unit *
                  </label>

                  <select
                    name="unit"
                    required
                    value={
                      formData.unit
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    {UNITS.map(
                      (unit) => (
                        <option
                          key={
                            unit.value
                          }
                          value={
                            unit.value
                          }
                        >
                          {
                            unit.label
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Expected Price
                    (৳ / unit) *
                  </label>

                  <input
                    type="number"
                    name="expectedPrice"
                    required
                    min="0"
                    step="0.01"
                    value={
                      formData.expectedPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0 if free"
                    className={
                      inputClass
                    }
                  />

                  <p className="mt-1 text-[11px] text-gray-400">
                    Enter 0 for a free
                    product.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <MapPin className="h-4 w-4 text-[#0b5d42]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Farm Location
                  </h3>

                  <p className="text-xs text-gray-500">
                    Select your farm
                    location.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Division *
                  </label>

                  <select
                    name="division"
                    required
                    value={
                      formData.division
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select division
                    </option>

                    {DIVISIONS.map(
                      (division) => (
                        <option
                          key={
                            division
                          }
                          value={
                            division
                          }
                        >
                          {division}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    District *
                  </label>

                  <select
                    name="district"
                    required
                    disabled={
                      !formData.division
                    }
                    value={
                      formData.district
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      {formData.division
                        ? "Select district"
                        : "Select division first"}
                    </option>

                    {districts.map(
                      (district) => (
                        <option
                          key={
                            district
                          }
                          value={
                            district
                          }
                        >
                          {district}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Upazila *
                  </label>

                  <select
                    name="upazila"
                    required
                    disabled={
                      !formData.district
                    }
                    value={
                      formData.upazila
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      {formData.district
                        ? "Select upazila"
                        : "Select district first"}
                    </option>

                    {upazilas.map(
                      (upazila) => (
                        <option
                          key={
                            upazila
                          }
                          value={
                            upazila
                          }
                        >
                          {upazila}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label
                  className={
                    labelClass
                  }
                >
                  Village / Union /
                  Address *
                </label>

                <input
                  type="text"
                  name="location"
                  required
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Village, Union, Ward or specific address"
                  className={
                    inputClass
                  }
                />
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <Building2 className="h-4 w-4 text-[#0b5d42]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    AgriNova Branch
                  </h3>

                  <p className="text-xs text-gray-500">
                    Select the branch
                    where you can deliver
                    the product if it is
                    accepted.
                  </p>
                </div>
              </div>

              <label
                className={labelClass}
              >
                Preferred / Nearest
                Branch *
              </label>

              <select
                name="branch"
                required
                value={
                  formData.branch
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select an AgriNova
                  branch
                </option>

                {BRANCHES.map(
                  (branch) => (
                    <option
                      key={
                        branch.value
                      }
                      value={
                        branch.value
                      }
                    >
                      {
                        branch.label
                      }
                    </option>
                  )
                )}
              </select>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <FileText className="h-4 w-4 text-[#0b5d42]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Additional Details
                  </h3>

                  <p className="text-xs text-gray-500">
                    Add quality, harvest
                    date or any other
                    useful information.
                  </p>
                </div>
              </div>

              <textarea
                name="notes"
                rows={3}
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                placeholder="Mention product quality, harvest date, variety, condition, or other details..."
                className={`${inputClass} resize-none`}
              />
            </section>

            <section>
              <label
                className={labelClass}
              >
                Upload Product Photos
              </label>

              <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-[#0b5d42] hover:bg-green-50/30">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  disabled={
                    isSubmitting
                  }
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />

                <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />

                <p className="text-sm font-medium text-gray-600">
                  Click or drag product
                  photos here
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Maximum 5 images,
                  5 MB each
                </p>
              </div>

              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {previews.map(
                    (
                      source,
                      index
                    ) => (
                      <div
                        key={
                          source
                        }
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                      >
                        <img
                          src={
                            source
                          }
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-4 sm:px-7">
            <p className="hidden text-xs text-gray-400 sm:block">
              Your product will be
              reviewed by AgriNova.
            </p>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  isSubmitting
                }
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  Boolean(
                    successMessage
                  )
                }
                className="rounded-xl bg-[#053225] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b4a38] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit for Review"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
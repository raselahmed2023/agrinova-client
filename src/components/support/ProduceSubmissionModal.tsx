"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  FileText,
  ImagePlus,
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

const CATEGORIES = [
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
    label: "Agricultural By-products",
  },
  {
    value: "other",
    label: "Other",
  },
];

const UNITS = [
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

const BRANCHES = [
  {
    value: "rajshahi",
    label: "AgriNova Rajshahi Branch",
  },
  {
    value: "bogura",
    label: "AgriNova Bogura Branch",
  },
  {
    value: "kushtia",
    label: "AgriNova Kushtia Branch",
  },
  {
    value: "chattogram",
    label: "AgriNova Chattogram Branch",
  },
  {
    value: "dhaka",
    label: "AgriNova Dhaka Branch",
  },
];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialFormData: ProductFormData = {
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

interface UploadResponse {
  success?: boolean;
  url?: string;
  message?: string;
}

export default function ProduceSubmissionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: ProductSubmissionModalProps) {
  const [formData, setFormData] =
    useState<ProductFormData>(
      initialFormData
    );

  const [previews, setPreviews] =
    useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const [trackingCode, setTrackingCode] =
    useState("");

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

  useEffect(() => {
    return () => {
      previews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
    };
  }, [previews]);

  if (!isOpen) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#0b5d42] focus:ring-2 focus:ring-[#0b5d42]/15 disabled:cursor-not-allowed disabled:bg-gray-100";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-gray-700";

  const clearPreviewUrls = () => {
    previews.forEach((preview) =>
      URL.revokeObjectURL(preview)
    );
  };

  const resetForm = () => {
    clearPreviewUrls();

    setFormData(initialFormData);
    setPreviews([]);
    setFormError("");
    setTrackingCode("");
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

    event.target.value = "";

    if (!selectedFiles.length) {
      return;
    }

    const remaining =
      MAX_IMAGES -
      formData.images.length;

    if (remaining <= 0) {
      setFormError(
        `Maximum ${MAX_IMAGES} images are allowed.`
      );

      return;
    }

    const accepted: File[] = [];

    for (const file of selectedFiles) {
      if (
        accepted.length >=
        remaining
      ) {
        break;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        continue;
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        continue;
      }

      accepted.push(file);
    }

    if (!accepted.length) {
      setFormError(
        "Please select valid image files under 5 MB."
      );

      return;
    }

    const nextPreviews =
      accepted.map((file) =>
        URL.createObjectURL(file)
      );

    setFormData((previous) => ({
      ...previous,

      images: [
        ...previous.images,
        ...accepted,
      ],
    }));

    setPreviews((previous) => [
      ...previous,
      ...nextPreviews,
    ]);

    if (
      accepted.length <
      selectedFiles.length
    ) {
      setFormError(
        "Some files were skipped. Maximum 5 images are allowed and each image must be under 5 MB."
      );
    } else {
      setFormError("");
    }
  };

  const removeImage = (
    index: number
  ) => {
    const preview =
      previews[index];

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

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

  const uploadImage = async (
    file: File
  ): Promise<string> => {
    const body =
      new FormData();

    body.append(
      "image",
      file
    );

    
    const response =
      await fetch(
        "/api/upload",
        {
          method: "POST",
          body,
        }
      );

    let result:
      UploadResponse | null =
      null;

    try {
      result =
        (await response.json()) as UploadResponse;
    } catch {
      throw new Error(
        "Image upload returned an invalid response."
      );
    }

    if (
      !response.ok ||
      !result?.success ||
      !result.url
    ) {
      throw new Error(
        result?.message ||
          "Unable to upload product image."
      );
    }

    return result.url;
  };

  const uploadImages =
    async () => {
      const uploaded:
        string[] = [];

      
      for (
        const file of
        formData.images
      ) {
        uploaded.push(
          await uploadImage(
            file
          )
        );
      }

      return uploaded;
    };

  const validateForm =
    () => {
      const phoneRegex =
        /^01[3-9]\d{8}$/;

      if (
        formData.farmerName
          .trim()
          .length < 2
      ) {
        return "Please enter your full name.";
      }

      if (
        !phoneRegex.test(
          formData.phone.trim()
        )
      ) {
        return "Please enter a valid Bangladeshi phone number.";
      }

      if (
        formData.productName
          .trim()
          .length < 2
      ) {
        return "Please enter the product name.";
      }

      if (!formData.category) {
        return "Please select a product category.";
      }

      if (
        !Number.isFinite(
          Number(
            formData.quantity
          )
        ) ||
        Number(
          formData.quantity
        ) <= 0
      ) {
        return "Quantity must be greater than 0.";
      }

      if (
        !Number.isFinite(
          Number(
            formData.expectedPrice
          )
        ) ||
        Number(
          formData.expectedPrice
        ) < 0
      ) {
        return "Expected price cannot be negative.";
      }

      if (
        !formData.division ||
        !formData.district ||
        !formData.upazila
      ) {
        return "Please select division, district and upazila.";
      }

      if (
        formData.location
          .trim()
          .length < 2
      ) {
        return "Please enter your village, union or farm address.";
      }

      if (!formData.branch) {
        return "Please select an AgriNova branch.";
      }

      return "";
    };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validation =
      validateForm();

    if (validation) {
      setFormError(
        validation
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setTrackingCode("");

      const imageUrls =
        await uploadImages();

      const response =
        await createSupplyRequest({
          farmerName:
            formData.farmerName.trim(),

          phone:
            formData.phone.trim(),

          productName:
            formData.productName.trim(),

          category:
            formData.category,

          quantity:
            Number(
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
            formData.notes
              .trim() ||
            undefined,

          images:
            imageUrls,
        });

      const code =
        response.data
          .trackingCode;

      setTrackingCode(
        code
      );

      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.setItem(
          "agrinova:lastSupplyTrackingCode",
          code
        );
      }

      clearPreviewUrls();

      setPreviews([]);

      setFormData(
        initialFormData
      );

      onSubmitSuccess?.();
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
        <header className="relative bg-[#053225] px-5 py-5 text-white sm:px-7">
          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              isSubmitting
            }
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3 pr-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Sprout className="h-6 w-6 text-[#b2f2bb]" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Sell Through
                AgriNova
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-5 text-white/75">
                Submit your farm
                product for
                AgriNova supply
                chain review.
              </p>
            </div>
          </div>
        </header>

        {trackingCode ? (
          <div className="overflow-y-auto p-6 sm:p-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Submission Received
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                AgriNova will review
                your product before
                asking you to deliver
                it to the selected
                branch.
              </p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                Tracking Code
              </p>

              <div className="mx-auto mt-2 w-fit rounded-xl border border-emerald-200 bg-white px-6 py-3 font-mono text-xl font-black tracking-wider text-[#053225]">
                {trackingCode}
              </div>

              <p className="mx-auto mt-4 max-w-lg text-xs leading-5 text-slate-500">
                Save this code. You
                can use it on the
                B2B Support page to
                check whether the
                request is Submitted,
                Accepted, Rejected,
                Received or
                Completed.
              </p>

              <button
                type="button"
                onClick={
                  handleClose
                }
                className="mt-6 rounded-xl bg-[#053225] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4a38]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
            className="overflow-y-auto"
          >
            <div className="space-y-7 p-5 sm:p-7">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <SectionHeading
                icon={
                  <UserRound className="h-4 w-4" />
                }
                title="Farmer Information"
                description="Enter your contact information."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Farmer Name"
                  required
                >
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
                    className={
                      inputClass
                    }
                    placeholder="Enter your full name"
                  />
                </Field>

                <Field
                  label="Phone Number"
                  required
                >
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
                    className={
                      inputClass
                    }
                    placeholder="01XXXXXXXXX"
                  />
                </Field>
              </div>

              <SectionHeading
                icon={
                  <Package className="h-4 w-4" />
                }
                title="Product Information"
                description="Add details about the product you want to sell."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Product Name"
                  required
                >
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
                    className={
                      inputClass
                    }
                    placeholder="Rice, Potato, Tomato..."
                  />
                </Field>

                <Field
                  label="Category"
                  required
                >
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
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Quantity"
                  required
                >
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
                    className={
                      inputClass
                    }
                  />
                </Field>

                <Field
                  label="Unit"
                  required
                >
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
                </Field>

                <Field
                  label="Expected Price (৳ / unit)"
                  required
                >
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
                    className={
                      inputClass
                    }
                    placeholder="0 if free"
                  />
                </Field>
              </div>

              <SectionHeading
                icon={
                  <MapPin className="h-4 w-4" />
                }
                title="Farm Location"
                description="Tell AgriNova where the product is located."
              />

              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="Division"
                  required
                >
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
                </Field>

                <Field
                  label="District"
                  required
                >
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
                      Select district
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
                </Field>

                <Field
                  label="Upazila"
                  required
                >
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
                      Select upazila
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
                </Field>
              </div>

              <Field
                label="Village / Union / Address"
                required
              >
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
                  className={
                    inputClass
                  }
                  placeholder="Village, Union, Ward or specific address"
                />
              </Field>

              <SectionHeading
                icon={
                  <Building2 className="h-4 w-4" />
                }
                title="AgriNova Branch"
                description="Select where you could deliver the product after approval."
              />

              <Field
                label="Preferred / Nearest Branch"
                required
              >
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
                    Select branch
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
              </Field>

              <SectionHeading
                icon={
                  <FileText className="h-4 w-4" />
                }
                title="Additional Details"
                description="Optional harvest, quality or variety information."
              />

              <textarea
                name="notes"
                rows={3}
                maxLength={1000}
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                className={`${inputClass} resize-none`}
                placeholder="Harvest date, variety, quality, condition..."
              />

              <div>
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-[#0b5d42]" />

                  <label className="text-sm font-bold text-gray-900">
                    Product Photos
                  </label>
                </div>

                <label className="relative mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-7 text-center transition hover:border-[#0b5d42] hover:bg-green-50/40">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={
                      isSubmitting ||
                      formData.images
                        .length >=
                        MAX_IMAGES
                    }
                    onChange={
                      handleImageChange
                    }
                    className="sr-only"
                  />

                  <Upload className="mx-auto h-6 w-6 text-gray-400" />

                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Select product
                    photos
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maximum 5
                    images, 5 MB
                    each
                  </p>
                </label>

                {previews.length >
                  0 && (
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
                            disabled={
                              isSubmitting
                            }
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            aria-label="Remove image"
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <footer className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-4 sm:px-7">
              <p className="hidden text-xs text-gray-400 sm:block">
                Do not deliver the
                product until AgriNova
                accepts the request.
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
                    isSubmitting
                  }
                  className="rounded-xl bg-[#053225] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b4a38] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>
              </div>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon:
    React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#0b5d42]">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {title}
        </h3>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}
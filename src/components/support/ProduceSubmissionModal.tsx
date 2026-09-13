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

interface Props {
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
  ["vegetables", "Vegetables"],
  ["fruits", "Fruits"],
  ["grains_cereals", "Grains & Cereals"],
  ["pulses_seeds", "Pulses & Seeds"],
  ["spices", "Spices"],
  [
    "agricultural_by_products",
    "Agricultural By-products",
  ],
  ["other", "Other"],
];

const UNITS = [
  ["kg", "Kg"],
  ["maund", "Maund"],
  ["ton", "Ton"],
  ["bag", "Bag"],
  ["box", "Box"],
];

const BRANCHES = [
  ["rajshahi", "AgriNova Rajshahi Branch"],
  ["bogura", "AgriNova Bogura Branch"],
  ["kushtia", "AgriNova Kushtia Branch"],
  ["chattogram", "AgriNova Chattogram Branch"],
  ["dhaka", "AgriNova Dhaka Branch"],
];

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

const initialForm: ProductFormData = {
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

export default function ProduceSubmissionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: Props) {
  const [form, setForm] =
    useState<ProductFormData>(
      initialForm
    );

  const [previews, setPreviews] =
    useState<string[]>([]);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    trackingCode,
    setTrackingCode,
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

  useEffect(() => {
    return () => {
      previews.forEach(
        (preview) =>
          URL.revokeObjectURL(
            preview
          )
      );
    };
  }, [previews]);

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#0b5d42] focus:ring-2 focus:ring-[#0b5d42]/15 disabled:bg-gray-100";

  const clearPreviews =
    () => {
      previews.forEach(
        (preview) =>
          URL.revokeObjectURL(
            preview
          )
      );
    };

  const closeModal =
    () => {
      if (isSubmitting) {
        return;
      }

      clearPreviews();

      setForm(initialForm);
      setPreviews([]);
      setError("");
      setTrackingCode("");

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

    setError("");

    if (name === "division") {
      setForm((prev) => ({
        ...prev,
        division: value,
        district: "",
        upazila: "",
      }));

      return;
    }

    if (name === "district") {
      setForm((prev) => ({
        ...prev,
        district: value,
        upazila: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      Array.from(
        event.target.files ||
          []
      );

    event.target.value = "";

    const available =
      MAX_IMAGES -
      form.images.length;

    const accepted =
      selected
        .filter(
          (file) =>
            [
              "image/jpeg",
              "image/png",
              "image/webp",
            ].includes(
              file.type
            ) &&
            file.size <=
              MAX_SIZE
        )
        .slice(
          0,
          available
        );

    if (!accepted.length) {
      setError(
        "Please use JPG, PNG or WEBP images under 5MB."
      );

      return;
    }

    const newPreviews =
      accepted.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...accepted,
      ],
    }));

    setPreviews(
      (prev) => [
        ...prev,
        ...newPreviews,
      ]
    );
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

    setPreviews((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );

    setForm((prev) => ({
      ...prev,
      images:
        prev.images.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  const uploadImage =
    async (
      file: File
    ) => {
      const body =
        new FormData();

      body.append(
        "image",
        file
      );

      body.append(
        "purpose",
        "supply-chain"
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body,
          }
        );

      const result =
        await response
          .json()
          .catch(() => null);

      if (
        !response.ok ||
        !result?.success ||
        !result?.url
      ) {
        throw new Error(
          result?.message ||
            "Unable to upload product image."
        );
      }

      return String(
        result.url
      );
    };

  const validate = () => {
    if (
      form.farmerName
        .trim().length < 2
    ) {
      return "Please enter your full name.";
    }

    if (
      !/^01[3-9]\d{8}$/.test(
        form.phone.trim()
      )
    ) {
      return "Please enter a valid Bangladeshi phone number.";
    }

    if (
      !form.productName.trim()
    ) {
      return "Product name is required.";
    }

    if (!form.category) {
      return "Select a product category.";
    }

    if (
      Number(
        form.quantity
      ) <= 0
    ) {
      return "Quantity must be greater than 0.";
    }

    if (
      Number(
        form.expectedPrice
      ) < 0
    ) {
      return "Expected price cannot be negative.";
    }

    if (
      !form.division ||
      !form.district ||
      !form.upazila
    ) {
      return "Please select division, district and upazila.";
    }

    if (!form.location.trim()) {
      return "Farm location is required.";
    }

    if (!form.branch) {
      return "Please select an AgriNova branch.";
    }

    return "";
  };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
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
        setIsSubmitting(
          true
        );

        setError("");

        const imageUrls:
          string[] =
          [];

        for (
          const image of
          form.images
        ) {
          imageUrls.push(
            await uploadImage(
              image
            )
          );
        }

        const response =
          await createSupplyRequest(
            {
              farmerName:
                form.farmerName.trim(),

              phone:
                form.phone.trim(),

              productName:
                form.productName.trim(),

              category:
                form.category,

              quantity:
                Number(
                  form.quantity
                ),

              unit:
                form.unit,

              expectedPrice:
                Number(
                  form.expectedPrice
                ),

              division:
                form.division,

              district:
                form.district,

              upazila:
                form.upazila,

              location:
                form.location.trim(),

              branch:
                form.branch,

              notes:
                form.notes.trim() ||
                undefined,

              images:
                imageUrls,
            }
          );

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

        clearPreviews();

        setPreviews([]);
        setForm(initialForm);

        onSubmitSuccess?.();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Submission failed."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="relative bg-[#053225] px-6 py-5 text-white">
          <button
            type="button"
            onClick={
              closeModal
            }
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Sprout className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Sell Through AgriNova
              </h2>

              <p className="mt-1 text-sm text-white/75">
                Submit your farm product for AgriNova supply
                chain review.
              </p>
            </div>
          </div>
        </header>

        {trackingCode ? (
          <div className="overflow-y-auto p-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />

              <h3 className="mt-4 text-xl font-bold">
                Submission Received
              </h3>

              <p className="mt-4 text-xs font-bold uppercase text-emerald-700">
                Tracking Code
              </p>

              <div className="mx-auto mt-2 w-fit rounded-xl bg-white px-6 py-3 font-mono text-xl font-black text-[#053225]">
                {trackingCode}
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="mt-6 rounded-xl bg-[#053225] px-6 py-3 text-sm font-semibold text-white"
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
            <div className="space-y-6 p-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Title
                icon={
                  <UserRound className="h-4 w-4" />
                }
                title="Farmer Information"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Farmer Name">
                  <input
                    required
                    name="farmerName"
                    value={
                      form.farmerName
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    required
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={11}
                    placeholder="01XXXXXXXXX"
                    className={
                      inputClass
                    }
                  />
                </Field>
              </div>

              <Title
                icon={
                  <Package className="h-4 w-4" />
                }
                title="Product Information"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product Name">
                  <input
                    required
                    name="productName"
                    value={
                      form.productName
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>

                <Field label="Category">
                  <select
                    required
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    {CATEGORIES.map(
                      ([
                        value,
                        label,
                      ]) => (
                        <option
                          key={
                            value
                          }
                          value={
                            value
                          }
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Quantity">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="quantity"
                    value={
                      form.quantity
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>

                <Field label="Unit">
                  <select
                    name="unit"
                    value={
                      form.unit
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    {UNITS.map(
                      ([
                        value,
                        label,
                      ]) => (
                        <option
                          key={
                            value
                          }
                          value={
                            value
                          }
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field label="Expected Price">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="expectedPrice"
                    value={
                      form.expectedPrice
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>
              </div>

              <Title
                icon={
                  <MapPin className="h-4 w-4" />
                }
                title="Farm Location"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Division">
                  <select
                    name="division"
                    value={
                      form.division
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Division
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

                <Field label="District">
                  <select
                    name="district"
                    disabled={
                      !form.division
                    }
                    value={
                      form.district
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      District
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
                    name="upazila"
                    disabled={
                      !form.district
                    }
                    value={
                      form.upazila
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Upazila
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

              <Field label="Village / Address">
                <input
                  name="location"
                  value={
                    form.location
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Title
                icon={
                  <Building2 className="h-4 w-4" />
                }
                title="AgriNova Branch"
              />

              <Field label="Preferred Branch">
                <select
                  name="branch"
                  value={
                    form.branch
                  }
                  onChange={
                    handleChange
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    Select Branch
                  </option>

                  {BRANCHES.map(
                    ([
                      value,
                      label,
                    ]) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {label}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Title
                icon={
                  <FileText className="h-4 w-4" />
                }
                title="Additional Details"
              />

              <textarea
                name="notes"
                value={
                  form.notes
                }
                onChange={
                  handleChange
                }
                rows={3}
                maxLength={1000}
                className={`${inputClass} h-auto resize-none`}
              />

              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <ImagePlus className="h-4 w-4 text-[#0b5d42]" />
                  Product Photos
                </div>

                <label className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-7 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImages
                    }
                    className="hidden"
                  />

                  <Upload className="mx-auto h-6 w-6 text-gray-400" />

                  <p className="mt-2 text-sm font-medium">
                    Upload Product Photos
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maximum 5 images · 5MB each
                  </p>
                </label>

                {previews.length >
                  0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {previews.map(
                      (
                        preview,
                        index
                      ) => (
                        <div
                          key={
                            preview
                          }
                          className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                        >
                          <img
                            src={
                              preview
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
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white"
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

            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-5">
              <button
                type="button"
                onClick={
                  closeModal
                }
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="rounded-xl bg-[#053225] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit for Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Title({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b pb-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#0b5d42]">
        {icon}
      </div>

      <h3 className="text-sm font-bold text-gray-900">
        {title}
      </h3>
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
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>

      {children}
    </label>
  );
}
"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Building2,
  CheckCircle2,
  Copy,
  FileText,
  ImagePlus,
  Loader2,
  LogIn,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Sprout,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

import {
  createSupplyRequest,
} from "@/services/supply-chain.service";

import {
  getStoredLocalImage,
  listStoredLocalImages,
  removeStoredLocalImage,
  retryStoredImage,
  uploadImageWithFallback,
  type StoredLocalImage,
} from "@/lib/image-storage";

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

  images: string[];
}

interface Option {
  value: string;
  label: string;
}

const CATEGORIES: Option[] = [
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

const UNITS: Option[] = [
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

const BRANCHES: Option[] = [
  {
    value: "dhaka",
    label: "Dhaka Branch",
  },
  {
    value: "rajshahi",
    label: "Rajshahi Branch",
  },
  {
    value: "bogura",
    label: "Bogura Branch",
  },
  {
    value: "kushtia",
    label: "Kushtia Branch",
  },
  {
    value: "chattogram",
    label: "Chattogram Branch",
  },
];

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

export default function ProductSubmissionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: ProductSubmissionModalProps) {
  const {
    data: session,
    isPending,
  } = useSession();

  const [
    formData,
    setFormData,
  ] = useState<ProductFormData>(
    initialFormData
  );

  const [
    localImages,
    setLocalImages,
  ] = useState<
    StoredLocalImage[]
  >([]);

  const [
    uploadingImages,
    setUploadingImages,
  ] = useState(false);

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

  const [
    trackingCode,
    setTrackingCode,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const userId =
    session?.user?.id;

  const role =
    String(
      session?.user?.role ||
        ""
    ).toUpperCase();

  const isFarmer =
    role ===
    "FARMER";

  const imagePurpose =
    useMemo(
      () =>
        userId
          ? `supply-chain-${userId}`
          : "supply-chain",
      [
        userId,
      ]
    );

  const districts =
    getDistrictsByDivision(
      formData.division
    );

  const upazilas =
    getUpazilasByDistrict(
      formData.division,
      formData.district
    );

  const totalImages =
    formData.images.length +
    localImages.length;

  useEffect(() => {
    if (
      !isOpen ||
      !userId ||
      !isFarmer
    ) {
      setLocalImages(
        []
      );

      return;
    }

    const stored =
      listStoredLocalImages(
        imagePurpose
      );

    setLocalImages(
      stored.slice(
        0,
        5
      )
    );
  }, [
    imagePurpose,
    isOpen,
    userId,
    isFarmer,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      !session?.user?.name
    ) {
      return;
    }

    setFormData(
      (
        current
      ) => {
        if (
          current.farmerName
        ) {
          return current;
        }

        return {
          ...current,

          farmerName:
            session.user
              .name ||
            "",
        };
      }
    );
  }, [
    isOpen,
    session?.user?.name,
  ]);

  if (
    !isOpen
  ) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100";

  const labelClass =
    "mb-1.5 block text-[12px] font-bold text-slate-700";

  const resetForm =
    (
      removePendingImages =
        false
    ) => {
      if (
        removePendingImages
      ) {
        localImages.forEach(
          (
            image
          ) => {
            removeStoredLocalImage(
              image.localKey
            );
          }
        );

        setLocalImages(
          []
        );
      }

      setFormData(
        initialFormData
      );

      setFormError(
        ""
      );

      setSuccessMessage(
        ""
      );

      setTrackingCode(
        ""
      );

      setCopied(
        false
      );
    };

  const handleClose =
    () => {
      if (
        isSubmitting ||
        uploadingImages
      ) {
        return;
      }

      resetForm(
        false
      );

      onClose();
    };

  const handleChange =
    (
      event:
        ChangeEvent<
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
        >
    ) => {
      const {
        name,
        value,
      } =
        event.target;

      setFormError(
        ""
      );

      if (
        name ===
        "division"
      ) {
        setFormData(
          (
            previous
          ) => ({
            ...previous,

            division:
              value,

            district:
              "",

            upazila:
              "",
          })
        );

        return;
      }

      if (
        name ===
        "district"
      ) {
        setFormData(
          (
            previous
          ) => ({
            ...previous,

            district:
              value,

            upazila:
              "",
          })
        );

        return;
      }

      setFormData(
        (
          previous
        ) => ({
          ...previous,

          [name]:
            value,
        })
      );
    };

  const handleImageChange =
    async (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const selectedFiles =
        Array.from(
          event.target
            .files ||
            []
        );

      event.target.value =
        "";

      if (
        selectedFiles.length ===
          0 ||
        uploadingImages ||
        isSubmitting
      ) {
        return;
      }

      const remaining =
        5 -
        totalImages;

      if (
        remaining <=
        0
      ) {
        setFormError(
          "Maximum 5 product photos are allowed."
        );

        return;
      }

      const validFiles =
        selectedFiles
          .filter(
            (
              file
            ) =>
              [
                "image/jpeg",
                "image/png",
                "image/webp",
              ].includes(
                file.type
              )
          )
          .filter(
            (
              file
            ) =>
              file.size <=
              8 *
                1024 *
                1024
          )
          .slice(
            0,
            remaining
          );

      if (
        validFiles.length ===
        0
      ) {
        setFormError(
          "Please select JPG, PNG or WEBP images under 8 MB."
        );

        return;
      }

      try {
        setUploadingImages(
          true
        );

        setFormError(
          ""
        );

        const remoteUrls:
          string[] =
          [];

        const localFallbacks:
          StoredLocalImage[] =
          [];

        for (
          const file of validFiles
        ) {
          const result =
            await uploadImageWithFallback(
              file,
              {
                purpose:
                  imagePurpose,

                allowLocalFallback:
                  true,
              }
            );

          if (
            result.source ===
            "remote"
          ) {
            remoteUrls.push(
              result.url
            );

            continue;
          }

          const local =
            getStoredLocalImage(
              result.localKey
            );

          if (
            local
          ) {
            localFallbacks.push(
              local
            );
          }
        }

        if (
          remoteUrls.length >
          0
        ) {
          setFormData(
            (
              previous
            ) => ({
              ...previous,

              images: [
                ...previous.images,
                ...remoteUrls,
              ].slice(
                0,
                5
              ),
            })
          );
        }

        if (
          localFallbacks.length >
          0
        ) {
          setLocalImages(
            (
              previous
            ) => [
              ...previous,
              ...localFallbacks,
            ].slice(
              0,
              5
            )
          );
        }
      } catch (
        error
      ) {
        setFormError(
          error instanceof
            Error
            ? error.message
            : "Image upload failed."
        );
      } finally {
        setUploadingImages(
          false
        );
      }
    };

  const removeRemoteImage =
    (
      index:
        number
    ) => {
      setFormData(
        (
          previous
        ) => ({
          ...previous,

          images:
            previous.images.filter(
              (
                _,
                currentIndex
              ) =>
                currentIndex !==
                index
            ),
        })
      );
    };

  const removeLocalImage =
    (
      localKey:
        string
    ) => {
      removeStoredLocalImage(
        localKey
      );

      setLocalImages(
        (
          previous
        ) =>
          previous.filter(
            (
              image
            ) =>
              image.localKey !==
              localKey
          )
      );
    };

  const retryLocalImage =
    async (
      image:
        StoredLocalImage
    ) => {
      try {
        setUploadingImages(
          true
        );

        setFormError(
          ""
        );

        const remoteUrl =
          await retryStoredImage(
            image.localKey
          );

        setFormData(
          (
            previous
          ) => ({
            ...previous,

            images: [
              ...previous.images,
              remoteUrl,
            ].slice(
              0,
              5
            ),
          })
        );

        setLocalImages(
          (
            previous
          ) =>
            previous.filter(
              (
                item
              ) =>
                item.localKey !==
                image.localKey
            )
        );
      } catch (
        error
      ) {
        setFormError(
          error instanceof
            Error
            ? error.message
            : "Image service is unavailable."
        );
      } finally {
        setUploadingImages(
          false
        );
      }
    };

  const ensureRemoteImages =
    async () => {
      if (
        localImages.length ===
        0
      ) {
        return formData.images;
      }

      const uploadedUrls:
        string[] =
        [];

      for (
        const image of localImages
      ) {
        const remoteUrl =
          await retryStoredImage(
            image.localKey
          );

        uploadedUrls.push(
          remoteUrl
        );
      }

      const finalImages =
        [
          ...formData.images,
          ...uploadedUrls,
        ].slice(
          0,
          5
        );

      setLocalImages(
        []
      );

      return finalImages;
    };

  const validateForm =
    () => {
      if (
        !session?.user
      ) {
        setFormError(
          "Please sign in as a Farmer."
        );

        return false;
      }

      if (
        String(
          session.user
            .role ||
            ""
        ).toUpperCase() !==
        "FARMER"
      ) {
        setFormError(
          "Only Farmer accounts can submit products."
        );

        return false;
      }

      if (
        !formData.farmerName
          .trim()
      ) {
        setFormError(
          "Farmer name is required."
        );

        return false;
      }

      if (
        !/^01[3-9]\d{8}$/.test(
          formData.phone
            .trim()
        )
      ) {
        setFormError(
          "Enter a valid Bangladeshi phone number."
        );

        return false;
      }

      if (
        !formData.productName
          .trim()
      ) {
        setFormError(
          "Product name is required."
        );

        return false;
      }

      if (
        !formData.category
      ) {
        setFormError(
          "Select a product category."
        );

        return false;
      }

      if (
        Number(
          formData.quantity
        ) <=
        0
      ) {
        setFormError(
          "Quantity must be greater than 0."
        );

        return false;
      }

      if (
        !formData.expectedPrice
          .trim() ||
        Number(
          formData.expectedPrice
        ) <=
        0
      ) {
        setFormError(
          "Expected price must be greater than 0."
        );

        return false;
      }

      if (
        !formData.division ||
        !formData.district ||
        !formData.upazila
      ) {
        setFormError(
          "Select division, district and upazila."
        );

        return false;
      }

      if (
        !formData.location
          .trim()
      ) {
        setFormError(
          "Pickup location is required."
        );

        return false;
      }

      if (
        !formData.branch
      ) {
        setFormError(
          "Select an AgriNova branch."
        );

        return false;
      }

      return true;
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setFormError(
        ""
      );

      if (
        !validateForm()
      ) {
        return;
      }

      try {
        setIsSubmitting(
          true
        );

        const imageUrls =
          await ensureRemoteImages();

        const response =
          await createSupplyRequest(
            {
              farmerName:
                formData.farmerName
                  .trim(),

              phone:
                formData.phone
                  .trim(),

              productName:
                formData.productName
                  .trim(),

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
                formData.location
                  .trim(),

              branch:
                formData.branch,

              notes:
                formData.notes
                  .trim() ||
                undefined,

              images:
                imageUrls,
            }
          );

        setTrackingCode(
          response.data
            .trackingCode
        );

        setSuccessMessage(
          "Your product submission has been received and is waiting for AgriNova review. Save the tracking ID below to check its status."
        );

        setFormData(
          initialFormData
        );

        setLocalImages(
          []
        );

        onSubmitSuccess?.();
      } catch (
        error
      ) {
        setFormError(
          error instanceof
            Error
            ? error.message
            : "Submission failed."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const copyTrackingCode =
    async () => {
      try {
        await navigator
          .clipboard
          .writeText(
            trackingCode
          );

        setCopied(
          true
        );

        window.setTimeout(
          () =>
            setCopied(
              false
            ),
          1500
        );
      } catch {
        setCopied(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6">

      <div className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-[26px] border border-white/20 bg-white shadow-[0_30px_90px_rgba(0,0,0,.28)]">

        {/* HEADER */}

        <div className="shrink-0 bg-gradient-to-r from-[#063d2e] to-[#0b644b] px-5 py-4 text-white sm:px-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Sprout className="h-5 w-5 text-emerald-200" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-black sm:text-xl">
                  Submit Produce to AgriNova
                </h2>

                <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
                  Farmer-only supply submission for AgriNova review.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                isSubmitting ||
                uploadingImages
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ACCESS / SUCCESS / FORM */}

        {isPending ? (
          <div className="flex min-h-[320px] flex-1 items-center justify-center bg-slate-50 p-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                Checking your account...
              </p>
            </div>
          </div>
        ) : !session?.user ? (
          <div className="flex flex-1 items-center justify-center overflow-y-auto bg-slate-50 p-5 sm:p-8">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <LogIn className="h-7 w-7" />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Farmer Account Required
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Sign in to submit produce
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                AgriNova links every supply submission to a Farmer account so requests can be reviewed, tracked, and managed securely.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/login?redirect=%2Fsupport"
                  onClick={
                    handleClose
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b5d42] px-4 text-sm font-black text-white transition hover:bg-[#084a35]"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={
                    handleClose
                  }
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  Create Farmer Account
                </Link>
              </div>

              <button
                type="button"
                onClick={
                  handleClose
                }
                className="mt-4 text-xs font-bold text-slate-400 transition hover:text-slate-700"
              >
                Not now
              </button>
            </div>
          </div>
        ) : !isFarmer ? (
          <div className="flex flex-1 items-center justify-center overflow-y-auto bg-slate-50 p-5 sm:p-8">
            <div className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-sm sm:p-8">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                Farmer Access Only
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                This form is for Farmer accounts
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your current account role is not permitted to create supply-chain product submissions.
              </p>

              <button
                type="button"
                onClick={
                  handleClose
                }
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : trackingCode ? (
          <div className="flex flex-1 items-center justify-center overflow-y-auto bg-slate-50 p-6">

            <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-700" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                Submission Received
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {
                  successMessage
                }
              </p>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">

                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  Tracking ID
                </p>

                <p className="mt-2 font-mono text-2xl font-black tracking-wider text-slate-950">
                  {
                    trackingCode
                  }
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  Keep this ID private and use it when checking this submission&apos;s status.
                </p>

                <button
                  type="button"
                  onClick={
                    copyTrackingCode
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50"
                >
                  <Copy className="h-4 w-4" />

                  {copied
                    ? "Copied"
                    : "Copy Tracking ID"}
                </button>
              </div>

              <button
                type="button"
                onClick={
                  handleClose
                }
                className="mt-6 w-full rounded-xl bg-[#0b5d42] py-3 text-sm font-black text-white transition hover:bg-[#084a35]"
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
            className="flex min-h-0 flex-1 flex-col"
          >

            {/* BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f9f8] p-4 sm:p-5">

              <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                <div>
                  <p className="text-xs font-black text-emerald-900">
                    Farmer account verified
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-emerald-700">
                    This submission will be linked to{" "}
                    <span className="font-black">
                      {session.user.name ||
                        "your Farmer account"}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {formError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {
                    formError
                  }
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* LEFT */}

                <div className="space-y-4">

                  <FormCard
                    icon={
                      <UserRound className="h-4 w-4" />
                    }
                    title="Farmer Information"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      <Field
                        label="Farmer Name"
                        required
                      >
                        <input
                          name="farmerName"
                          value={
                            formData.farmerName
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            isSubmitting
                          }
                          className={
                            inputClass
                          }
                        />
                      </Field>

                      <Field
                        label="Phone Number"
                        required
                      >
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <input
                            type="tel"
                            name="phone"
                            inputMode="numeric"
                            autoComplete="tel"
                            value={
                              formData.phone
                            }
                            onChange={(
                              event
                            ) => {
                              const digitsOnly =
                                event.target.value.replace(
                                  /\D/g,
                                  ""
                                );

                              setFormData(
                                (
                                  previous
                                ) => ({
                                  ...previous,

                                  phone:
                                    digitsOnly.slice(
                                      0,
                                      11
                                    ),
                                })
                              );

                              setFormError(
                                ""
                              );
                            }}
                            maxLength={
                              11
                            }
                            pattern="01[3-9][0-9]{8}"
                            placeholder="01XXXXXXXXX"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </Field>
                    </div>
                  </FormCard>

                  <FormCard
                    icon={
                      <Package className="h-4 w-4" />
                    }
                    title="Product Information"
                  >
                    <div className="grid grid-cols-2 gap-3">

                      <div className="col-span-2 sm:col-span-1">
                        <Field
                          label="Product Name"
                          required
                        >
                          <input
                            name="productName"
                            value={
                              formData.productName
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="e.g. Fresh Tomato"
                            className={
                              inputClass
                            }
                          />
                        </Field>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <Field
                          label="Category"
                          required
                        >
                          <select
                            name="category"
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
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </Field>
                      </div>

                      <Field
                        label="Quantity"
                        required
                      >
                        <input
                          type="number"
                          name="quantity"
                          min="0.01"
                          step="0.01"
                          value={
                            formData.quantity
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="0"
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
                            (
                              item
                            ) => (
                              <option
                                key={
                                  item.value
                                }
                                value={
                                  item.value
                                }
                              >
                                {
                                  item.label
                                }
                              </option>
                            )
                          )}
                        </select>
                      </Field>

                      <div className="col-span-2">
                        <Field
                          label="Expected Price (৳)"
                          required
                        >
                          <input
                            type="number"
                            name="expectedPrice"
                            required
                            min="0.01"
                            step="0.01"
                            value={
                              formData.expectedPrice
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="Expected total price"
                            className={
                              inputClass
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </FormCard>

                  <FormCard
                    icon={
                      <FileText className="h-4 w-4" />
                    }
                    title="Additional Notes"
                  >
                    <textarea
                      name="notes"
                      rows={
                        3
                      }
                      value={
                        formData.notes
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Harvest date, quality, availability, etc."
                      className={`${inputClass} resize-none`}
                    />
                  </FormCard>
                </div>

                {/* RIGHT */}

                <div className="space-y-4">

                  <FormCard
                    icon={
                      <MapPin className="h-4 w-4" />
                    }
                    title="Product Location"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                      <Field
                        label="Division"
                        required
                      >
                        <select
                          name="division"
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

                      <Field
                        label="District"
                        required
                      >
                        <select
                          name="district"
                          value={
                            formData.district
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !formData.division
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

                      <Field
                        label="Upazila"
                        required
                      >
                        <select
                          name="upazila"
                          value={
                            formData.upazila
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !formData.district
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

                    <div className="mt-3">
                      <Field
                        label="Pickup Address"
                        required
                      >
                        <input
                          name="location"
                          value={
                            formData.location
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Village, road, market or exact pickup location"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>
                  </FormCard>

                  <FormCard
                    icon={
                      <Building2 className="h-4 w-4" />
                    }
                    title="AgriNova Branch"
                  >
                    <select
                      name="branch"
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
                        Select processing branch
                      </option>

                      {BRANCHES.map(
                        (
                          branch
                        ) => (
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
                  </FormCard>

                  <FormCard
                    icon={
                      <ImagePlus className="h-4 w-4" />
                    }
                    title={`Product Photos (${totalImages}/5)`}
                  >

                    <label
                      className={`flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center transition ${
                        totalImages >=
                          5
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                          : "border-emerald-200 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        disabled={
                          uploadingImages ||
                          totalImages >=
                            5
                        }
                        className="hidden"
                      />

                      <Upload className="h-5 w-5 text-emerald-700" />

                      <p className="mt-1 text-xs font-bold text-slate-700">
                        {uploadingImages
                          ? "Uploading..."
                          : "Add product photos"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        JPG, PNG, WEBP • max 8 MB
                      </p>
                    </label>

                    {(formData.images.length >
                      0 ||
                      localImages.length >
                        0) && (
                      <div className="mt-3 grid grid-cols-4 gap-2">

                        {formData.images.map(
                          (
                            source,
                            index
                          ) => (
                            <div
                              key={`${source}-${index}`}
                              className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                            >
                              <img
                                src={
                                  source
                                }
                                alt="Product"
                                className="h-full w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeRemoteImage(
                                    index
                                  )
                                }
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )
                        )}

                        {localImages.map(
                          (
                            image
                          ) => (
                            <div
                              key={
                                image.localKey
                              }
                              className="relative aspect-square overflow-hidden rounded-xl border-2 border-amber-300 bg-amber-50"
                            >
                              <img
                                src={
                                  image.dataUrl
                                }
                                alt="Local"
                                className="h-full w-full object-cover"
                              />

                              <span className="absolute bottom-1 left-1 rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                                LOCAL
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeLocalImage(
                                    image.localKey
                                  )
                                }
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void retryLocalImage(
                                    image
                                  )
                                }
                                className="absolute inset-x-1 bottom-7 rounded bg-amber-500 px-1 py-1 text-[8px] font-bold text-white"
                              >
                                Retry
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </FormCard>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">

              <div className="flex items-center justify-between gap-3">

                <p className="hidden text-xs text-slate-400 sm:block">
                  Fields marked * are required
                </p>

                <div className="ml-auto flex gap-2">

                  <button
                    type="button"
                    onClick={
                      handleClose
                    }
                    disabled={
                      isSubmitting ||
                      uploadingImages
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      uploadingImages
                    }
                    className="min-w-[145px] rounded-xl bg-[#0b5d42] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#084b35] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : uploadingImages
                        ? "Uploading..."
                        : "Submit for Review"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function FormCard({
  icon,
  title,
  children,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.04)]">

      <div className="mb-3 flex items-center gap-2">

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          {
            icon
          }
        </span>

        <h3 className="text-sm font-black text-slate-900">
          {
            title
          }
        </h3>
      </div>

      {
        children
      }
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label:
    string;

  required?:
    boolean;

  children:
    React.ReactNode;
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {
          label
        }

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {
        children
      }
    </label>
  );
}
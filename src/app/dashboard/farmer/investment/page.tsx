"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Clock3,
  Edit3,
  HandCoins,
  ImageIcon,
  Loader2,
  MapPin,
  Percent,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Sprout,
  Trash2,
  Upload,
  WalletCards,
  XCircle,
} from "lucide-react";

import {
  createInvestmentProject,
  deleteMyInvestmentProject,
  getMyInvestmentProjects,
  updateMyInvestmentProject,
} from "@/services/investment.service";

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

import type {
  CreateInvestmentProjectPayload,
  InvestmentCategory,
  InvestmentProject,
} from "@/types/investment";

import {
  uploadImageRemote,
} from "@/lib/image-storage";

/* ============================================================
   CATEGORY OPTIONS
============================================================ */

const categories: Array<{
  value: InvestmentCategory;
  label: string;
}> = [
  {
    value: "vegetable_farming",
    label: "Vegetable Farming",
  },
  {
    value: "organic_farming",
    label: "Organic Farming",
  },
  {
    value: "poultry",
    label: "Poultry",
  },
  {
    value: "livestock",
    label: "Livestock",
  },
  {
    value: "fishery",
    label: "Fishery",
  },
  {
    value: "greenhouse",
    label: "Greenhouse",
  },
  {
    value: "irrigation",
    label: "Irrigation",
  },
  {
    value: "equipment",
    label: "Equipment",
  },
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "other",
    label: "Other",
  },
];

/* ============================================================
   INITIAL FORM
============================================================ */

const initialForm:
  CreateInvestmentProjectPayload = {
  projectName: "",

  category:
    "vegetable_farming",

  requiredInvestment:
    100000,

  minimumInvestment:
    5000,

  durationMonths:
    6,

  expectedReturnPercent:
    15,

  division:
    "",

  district:
    "",

  upazila:
    "",

  address:
    "",

  description:
    "",

  useOfFunds:
    "",

  projectImage:
    "",

  supportingDocument:
    "",
};

/* ============================================================
   HELPERS
============================================================ */

const money = (
  value: number
) =>
  `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD"
  )}`;

const categoryLabel = (
  value: string
) =>
  value
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");

/* ============================================================
   PROJECT IMAGE UPLOAD
============================================================ */

const uploadToImgBB =
  async (
    file: File
  ): Promise<string> => {
    return uploadImageRemote(
      file,
      "investment-project"
    );
  };

/* ============================================================
   STATUS
============================================================ */

const getProjectStatus =
  (
    project:
      InvestmentProject
  ) => {
    if (
      project.status ===
      "APPROVED"
    ) {
      return {
        label:
          "Approved",

        Icon:
          CheckCircle2,

        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    }

    if (
      project.status ===
      "REJECTED"
    ) {
      return {
        label:
          "Rejected",

        Icon:
          XCircle,

        className:
          "border-red-200 bg-red-50 text-red-700",
      };
    }

    return {
      label:
        "Pending Review",

      Icon:
        Clock3,

      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    };
  };

/* ============================================================
   PAGE
============================================================ */

export default function FarmerInvestmentPage() {
  const [
    projects,
    setProjects,
  ] =
    useState<
      InvestmentProject[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState<
      CreateInvestmentProjectPayload
    >(
      initialForm
    );

  const [
    editingId,
    setEditingId,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState("");

  const [
    uploadingImage,
    setUploadingImage,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    imageError,
    setImageError,
  ] =
    useState("");

  /* ==========================================================
     LOCATION
  ========================================================== */

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

  /* ==========================================================
     PROJECTED RETURN EXAMPLE
  ========================================================== */

  const projectedProfit =
    useMemo(
      () =>
        Number(
          (
            Number(
              form.minimumInvestment ||
                0
            ) *
            (
              Number(
                form.expectedReturnPercent ||
                  0
              ) /
              100
            )
          ).toFixed(
            2
          )
        ),
      [
        form.minimumInvestment,
        form.expectedReturnPercent,
      ]
    );

  const projectedTotalReturn =
    useMemo(
      () =>
        Number(
          (
            Number(
              form.minimumInvestment ||
                0
            ) +
            projectedProfit
          ).toFixed(
            2
          )
        ),
      [
        form.minimumInvestment,
        projectedProfit,
      ]
    );

  /* ==========================================================
     LOAD PROJECTS
  ========================================================== */

  const loadProjects =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const data =
          await getMyInvestmentProjects();

        setProjects(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch (
        err
      ) {
        console.error(
          "Investment project load error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load investment projects."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void loadProjects();
  }, []);

  /* ==========================================================
     UPDATE FORM
  ========================================================== */

  const update =
    <
      K extends keyof CreateInvestmentProjectPayload,
    >(
      key:
        K,

      value:
        CreateInvestmentProjectPayload[K]
    ) => {
      setForm(
        (
          current
        ) => ({
          ...current,

          [key]:
            value,
        })
      );

      if (
        error
      ) {
        setError(
          ""
        );
      }

      if (
        success
      ) {
        setSuccess(
          ""
        );
      }
    };

  /* ==========================================================
     LOCATION HANDLERS
  ========================================================== */

  const changeDivision =
    (
      value:
        string
    ) => {
      setForm(
        (
          current
        ) => ({
          ...current,

          division:
            value,

          district:
            "",

          upazila:
            "",
        })
      );
    };

  const changeDistrict =
    (
      value:
        string
    ) => {
      setForm(
        (
          current
        ) => ({
          ...current,

          district:
            value,

          upazila:
            "",
        })
      );
    };

  /* ==========================================================
     IMAGE
  ========================================================== */

  const handleImageUpload =
    async (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[
          0
        ];

      event.target.value =
        "";

      if (
        !file
      ) {
        return;
      }

      setImageError(
        ""
      );

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(
          file.type
        )
      ) {
        setImageError(
          "Only JPG, PNG or WEBP images are allowed."
        );

        return;
      }

      if (
        file.size >
        8 *
          1024 *
          1024
      ) {
        setImageError(
          "Image must be 8MB or smaller."
        );

        return;
      }

      try {
        setUploadingImage(
          true
        );

        const url =
          await uploadToImgBB(
            file
          );

        update(
          "projectImage",
          url
        );
      } catch (
        err
      ) {
        setImageError(
          err instanceof Error
            ? err.message
            : "Project image upload failed."
        );
      } finally {
        setUploadingImage(
          false
        );
      }
    };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm =
    () => {
      if (
        !form.projectName
          .trim()
      ) {
        return "Project name is required.";
      }

      if (
        Number(
          form.requiredInvestment
        ) <=
        0
      ) {
        return "Funding goal must be greater than 0.";
      }

      if (
        Number(
          form.minimumInvestment
        ) <=
        0
      ) {
        return "Minimum investment must be greater than 0.";
      }

      if (
        Number(
          form.minimumInvestment
        ) >
        Number(
          form.requiredInvestment
        )
      ) {
        return "Minimum investment cannot exceed the funding goal.";
      }

      if (
        Number(
          form.durationMonths
        ) <
          1 ||
        Number(
          form.durationMonths
        ) >
          120
      ) {
        return "Investment term must be between 1 and 120 months.";
      }

      if (
        Number(
          form.expectedReturnPercent
        ) <=
        0
      ) {
        return "Projected ROI must be greater than 0%.";
      }

      if (
        Number(
          form.expectedReturnPercent
        ) >
        500
      ) {
        return "Projected ROI cannot exceed 500%.";
      }

      if (
        !form.division
      ) {
        return "Division is required.";
      }

      if (
        !form.district
      ) {
        return "District is required.";
      }

      if (
        !form.upazila
      ) {
        return "Upazila is required.";
      }

      if (
        form.description
          .trim()
          .length <
        20
      ) {
        return "Project description must be at least 20 characters.";
      }

      if (
        form.useOfFunds
          .trim()
          .length <
        10
      ) {
        return "Use of funds must be at least 10 characters.";
      }

      return "";
    };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        submitting ||
        uploadingImage
      ) {
        return;
      }

      const validationError =
        validateForm();

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      const payload:
        CreateInvestmentProjectPayload =
        {
          projectName:
            form.projectName
              .trim(),

          category:
            form.category,

          requiredInvestment:
            Number(
              form.requiredInvestment
            ),

          minimumInvestment:
            Number(
              form.minimumInvestment
            ),

          durationMonths:
            Number(
              form.durationMonths
            ),

          expectedReturnPercent:
            Number(
              form.expectedReturnPercent
            ),

          division:
            form.division,

          district:
            form.district,

          upazila:
            form.upazila,

          address:
            form.address
              ?.trim() ||
            "",

          description:
            form.description
              .trim(),

          useOfFunds:
            form.useOfFunds
              .trim(),

          projectImage:
            form.projectImage
              ?.trim() ||
            undefined,

          supportingDocument:
            form.supportingDocument
              ?.trim() ||
            undefined,
        };

      try {
        setSubmitting(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        if (
          editingId
        ) {
          await updateMyInvestmentProject(
            editingId,
            payload
          );

          setSuccess(
            "Project updated successfully. Rejected projects are sent back for Admin review."
          );
        } else {
          await createInvestmentProject(
            payload
          );

          setSuccess(
            "Investment project submitted. Admin will review it before publication."
          );
        }

        setEditingId(
          ""
        );

        setForm(
          initialForm
        );

        setImageError(
          ""
        );

        await loadProjects();
      } catch (
        err
      ) {
        console.error(
          "Investment project submit error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to save investment project."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  /* ==========================================================
     EDIT
  ========================================================== */

  const startEdit =
    (
      project:
        InvestmentProject
    ) => {
      if (
        project.status ===
        "APPROVED"
      ) {
        setError(
          "Approved projects cannot be edited while funding is active."
        );

        return;
      }

      setEditingId(
        project._id
      );

      setForm({
        projectName:
          project.projectName,

        category:
          project.category,

        requiredInvestment:
          project.requiredInvestment,

        minimumInvestment:
          project.minimumInvestment,

        durationMonths:
          project.durationMonths,

        expectedReturnPercent:
          project.expectedReturnPercent,

        division:
          project.division,

        district:
          project.district,

        upazila:
          project.upazila,

        address:
          project.address ||
          "",

        description:
          project.description,

        useOfFunds:
          project.useOfFunds,

        projectImage:
          project.projectImage ||
          "",

        supportingDocument:
          project.supportingDocument ||
          "",
      });

      setError(
        ""
      );

      setSuccess(
        ""
      );

      window.scrollTo({
        top:
          0,

        behavior:
          "smooth",
      });
    };

  /* ==========================================================
     CANCEL EDIT
  ========================================================== */

  const cancelEdit =
    () => {
      setEditingId(
        ""
      );

      setForm(
        initialForm
      );

      setError(
        ""
      );

      setImageError(
        ""
      );
    };

  /* ==========================================================
     WITHDRAW
  ========================================================== */

  const withdrawProject =
    async (
      project:
        InvestmentProject
    ) => {
      if (
        deletingId
      ) {
        return;
      }

      if (
        Number(
          project.fundedAmount ||
            0
        ) >
        0
      ) {
        setError(
          "A project with confirmed funding cannot be withdrawn."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Withdraw "${project.projectName}"?`
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setDeletingId(
          project._id
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await deleteMyInvestmentProject(
          project._id
        );

        if (
          editingId ===
          project._id
        ) {
          cancelEdit();
        }

        setSuccess(
          "Investment project withdrawn."
        );

        await loadProjects();
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to withdraw investment project."
        );
      } finally {
        setDeletingId(
          ""
        );
      }
    };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">

        <div className="text-center">

          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading investment workspace...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-5 lg:p-6">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#063d2e] via-[#07543d] to-[#087356] px-5 py-5 text-white shadow-xl sm:px-6">

        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-200">
              Farmer Care Investment
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Create Investment Project
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Set the funding goal,
              investment term and projected
              ROI investors should see before
              deciding to invest.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadProjects()
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />

            Refresh
          </button>
        </div>
      </section>

      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          {error}
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

          {success}
        </div>
      )}

      {/* ======================================================
          GRID
      ====================================================== */}

      <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={
            submit
          }
          className="h-fit rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >

          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                {editingId ? (
                  <Edit3 className="h-5 w-5" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
              </div>

              <div>

                <h2 className="text-lg font-black text-slate-950">
                  {editingId
                    ? "Edit Project"
                    : "Project Information"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingId
                    ? "Update the project and resubmit it for review."
                    : "Create clear terms investors can understand."}
                </p>
              </div>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={
                  cancelEdit
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />

                Cancel
              </button>
            )}
          </div>

          {/* ==================================================
              BASIC
          ================================================== */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <FieldLabel
              label="Project Name"
              className="sm:col-span-2"
            >
              <input
                required
                maxLength={
                  150
                }
                value={
                  form.projectName
                }
                onChange={(
                  event
                ) =>
                  update(
                    "projectName",
                    event.target.value
                  )
                }
                placeholder="Example: Commercial vegetable cultivation project"
                className={inputClass}
              />
            </FieldLabel>

            <FieldLabel
              label="Category"
            >
              <select
                value={
                  form.category
                }
                onChange={(
                  event
                ) =>
                  update(
                    "category",
                    event.target.value as InvestmentCategory
                  )
                }
                className={inputClass}
              >
                {categories.map(
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
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </FieldLabel>

            <FieldLabel
              label="Investment Term"
            >
              <div className="relative">

                <input
                  required
                  type="number"
                  min={
                    1
                  }
                  max={
                    120
                  }
                  value={
                    form.durationMonths
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "durationMonths",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className={`${inputClass} pr-20`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  months
                </span>
              </div>
            </FieldLabel>
          </div>

          {/* ==================================================
              INVESTMENT TERMS
          ================================================== */}

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">

            <div className="flex items-center gap-2">

              <WalletCards className="h-4 w-4 text-emerald-700" />

              <h3 className="text-sm font-black text-emerald-950">
                Investment Terms
              </h3>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <FieldLabel
                label="Funding Goal"
              >
                <MoneyInput
                  value={
                    form.requiredInvestment
                  }
                  onChange={(
                    value
                  ) =>
                    update(
                      "requiredInvestment",
                      value
                    )
                  }
                />
              </FieldLabel>

              <FieldLabel
                label="Minimum Investment"
              >
                <MoneyInput
                  value={
                    form.minimumInvestment
                  }
                  onChange={(
                    value
                  ) =>
                    update(
                      "minimumInvestment",
                      value
                    )
                  }
                />
              </FieldLabel>

              <FieldLabel
                label="Projected ROI"
              >
                <div className="relative">

                  <input
                    required
                    type="number"
                    min={
                      0.01
                    }
                    max={
                      500
                    }
                    step={
                      0.01
                    }
                    value={
                      form.expectedReturnPercent
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "expectedReturnPercent",
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className={`${inputClass} pr-10`}
                  />

                  <Percent className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                </div>
              </FieldLabel>
            </div>

            {/* ROI EXAMPLE */}

            <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-4">

              <div className="flex items-start gap-3">

                <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div className="min-w-0 flex-1">

                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                    Investor Return Example
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Based on the minimum investment
                    for the full{" "}
                    {form.durationMonths || 0}
                    -month term.
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2">

                    <ReturnValue
                      label="Investment"
                      value={
                        money(
                          form.minimumInvestment
                        )
                      }
                    />

                    <ReturnValue
                      label="Projected Profit"
                      value={`+${money(
                        projectedProfit
                      )}`}
                      active
                    />

                    <ReturnValue
                      label="Projected Total"
                      value={
                        money(
                          projectedTotalReturn
                        )
                      }
                    />
                  </div>

                  <p className="mt-3 text-[10px] leading-4 text-slate-400">
                    Projected ROI is an estimate,
                    not a guaranteed return.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              LOCATION
          ================================================== */}

          <div className="mt-6">

            <div className="flex items-center gap-2">

              <MapPin className="h-4 w-4 text-emerald-700" />

              <h3 className="text-sm font-black text-slate-900">
                Project Location
              </h3>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <FieldLabel
                label="Division"
              >
                <select
                  required
                  value={
                    form.division
                  }
                  onChange={(
                    event
                  ) =>
                    changeDivision(
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select division
                  </option>

                  {DIVISIONS.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </FieldLabel>

              <FieldLabel
                label="District"
              >
                <select
                  required
                  value={
                    form.district
                  }
                  disabled={
                    !form.division
                  }
                  onChange={(
                    event
                  ) =>
                    changeDistrict(
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select district
                  </option>

                  {districts.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </FieldLabel>

              <FieldLabel
                label="Upazila"
              >
                <select
                  required
                  value={
                    form.upazila
                  }
                  disabled={
                    !form.district
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "upazila",
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select upazila
                  </option>

                  {upazilas.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </FieldLabel>

              <FieldLabel
                label="Address"
                className="sm:col-span-3"
              >
                <input
                  value={
                    form.address ||
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="Village, road or project location"
                  className={inputClass}
                />
              </FieldLabel>
            </div>
          </div>

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="mt-6">

            <p className="text-xs font-black text-slate-700">
              Project Image
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              JPG, PNG or WEBP • max 8MB
            </p>

            <label className="mt-3 block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-emerald-300">

              {form.projectImage ? (
                <div className="relative h-[190px]">

                  <img
                    src={
                      form.projectImage
                    }
                    alt="Project preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">

                    <p className="text-xs font-black text-white">
                      Click to replace image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[150px] flex-col items-center justify-center text-center">

                  {uploadingImage ? (
                    <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}

                  <p className="mt-2 text-xs font-black text-slate-700">
                    {uploadingImage
                      ? "Uploading..."
                      : "Upload Project Image"}
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={
                  uploadingImage
                }
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />
            </label>

            {form.projectImage && (
              <button
                type="button"
                onClick={() =>
                  update(
                    "projectImage",
                    ""
                  )
                }
                className="mt-2 text-xs font-black text-red-600"
              >
                Remove image
              </button>
            )}

            {imageError && (
              <p className="mt-2 text-xs font-semibold text-red-600">
                {imageError}
              </p>
            )}
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div className="mt-6 space-y-4">

            <FieldLabel
              label="Project Description"
            >
              <textarea
                required
                rows={
                  4
                }
                maxLength={
                  3000
                }
                value={
                  form.description
                }
                onChange={(
                  event
                ) =>
                  update(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain the agricultural project, production plan and opportunity..."
                className={`${inputClass} h-auto resize-none py-3`}
              />
            </FieldLabel>

            <FieldLabel
              label="How Will the Investment Be Used?"
            >
              <textarea
                required
                rows={
                  4
                }
                maxLength={
                  1200
                }
                value={
                  form.useOfFunds
                }
                onChange={(
                  event
                ) =>
                  update(
                    "useOfFunds",
                    event.target.value
                  )
                }
                placeholder="Seeds, fertilizer, irrigation, equipment, livestock, labour..."
                className={`${inputClass} h-auto resize-none py-3`}
              />
            </FieldLabel>

            <FieldLabel
              label="Supporting Document URL"
            >
              <input
                type="url"
                value={
                  form.supportingDocument ||
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "supportingDocument",
                    event.target.value
                  )
                }
                placeholder="Optional https://..."
                className={inputClass}
              />
            </FieldLabel>
          </div>

          {/* ==================================================
              REMOVED FIELDS NOTICE
          ================================================== */}

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

            <p className="text-xs font-black text-blue-800">
              Farmer Care investment model
            </p>

            <p className="mt-1 text-[10px] leading-5 text-blue-700">
              You do not need to provide
              own contribution, estimated
              revenue, estimated profit,
              profit-sharing percentage or
              NID here.
            </p>
          </div>

          {/* ==================================================
              SUBMIT
          ================================================== */}

          <button
            type="submit"
            disabled={
              submitting ||
              uploadingImage
            }
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07583f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#064733] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Saving...
              </>
            ) : editingId ? (
              <>
                <Edit3 className="h-4 w-4" />

                Update & Submit for Review
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />

                Submit for Admin Review
              </>
            )}
          </button>
        </form>

        {/* ====================================================
            PROJECTS
        ==================================================== */}

        <section className="space-y-4">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Your Projects
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              Investment Requests
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Track approval and confirmed funding.
            </p>
          </div>

          {projects.length ===
          0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center">

              <HandCoins className="mx-auto h-7 w-7 text-emerald-700" />

              <h3 className="mt-3 text-sm font-black text-slate-800">
                No project yet
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Create your first investment project.
              </p>
            </div>
          ) : (
            projects.map(
              (
                project
              ) => (
                <ProjectCard
                  key={
                    project._id
                  }
                  project={
                    project
                  }
                  deleting={
                    deletingId ===
                    project._id
                  }
                  onEdit={() =>
                    startEdit(
                      project
                    )
                  }
                  onWithdraw={() =>
                    void withdrawProject(
                      project
                    )
                  }
                />
              )
            )
          )}
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   PROJECT CARD
============================================================ */

function ProjectCard({
  project,
  deleting,
  onEdit,
  onWithdraw,
}: {
  project:
    InvestmentProject;

  deleting:
    boolean;

  onEdit:
    () => void;

  onWithdraw:
    () => void;
}) {
  const status =
    getProjectStatus(
      project
    );

  const StatusIcon =
    status.Icon;

  const funded =
    Number(
      project.fundedAmount ||
        0
    );

  const goal =
    Number(
      project.requiredInvestment ||
        0
    );

  const progress =
    goal > 0
      ? Math.min(
          Math.round(
            (
              funded /
              goal
            ) *
              100
          ),
          100
        )
      : 0;

  const minimumProfit =
    Number(
      (
        Number(
          project.minimumInvestment
        ) *
        (
          Number(
            project.expectedReturnPercent ||
              0
          ) /
          100
        )
      ).toFixed(
        2
      )
    );

  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

      {project.projectImage && (
        <div className="h-[150px] overflow-hidden">

          <img
            src={
              project.projectImage
            }
            alt={
              project.projectName
            }
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-[9px] font-black uppercase tracking-[0.13em] text-emerald-700">
              {
                project.projectCode
              }
            </p>

            <h3 className="mt-1 truncate text-base font-black text-slate-950">
              {
                project.projectName
              }
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              {categoryLabel(
                project.category
              )}
              {" • "}
              {project.district}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black ${status.className}`}
          >
            <StatusIcon className="h-3 w-3" />

            {
              status.label
            }
          </span>
        </div>

        {/* TERMS */}

        <div className="mt-4 grid grid-cols-3 gap-2">

          <SmallStat
            label="Goal"
            value={
              money(
                project.requiredInvestment
              )
            }
          />

          <SmallStat
            label="Term"
            value={`${project.durationMonths} mo`}
          />

          <SmallStat
            label="Projected ROI"
            value={`${project.expectedReturnPercent}%`}
            active
          />
        </div>

        {/* RETURN */}

        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">

          <p className="text-[9px] font-black uppercase tracking-wide text-emerald-600">
            Minimum Investment Return Example
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">

            <span className="text-xs text-slate-600">
              {money(
                project.minimumInvestment
              )}{" "}
              investment
            </span>

            <span className="text-xs font-black text-emerald-800">
              +{money(
                minimumProfit
              )} projected profit
            </span>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-4">

          <div className="mb-1.5 flex justify-between text-[9px] font-bold text-slate-400">

            <span>
              Funded{" "}
              {money(
                funded
              )}
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-emerald-600"
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* ADMIN NOTE */}

        {project.adminNote && (
          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">

            <p className="text-[9px] font-black uppercase text-amber-700">
              Admin Note
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800">
              {
                project.adminNote
              }
            </p>
          </div>
        )}

        {/* ACTIONS */}

        {project.status !==
          "APPROVED" && (
          <div className="mt-4 flex gap-2">

            <button
              type="button"
              onClick={
                onEdit
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"
            >
              <Edit3 className="h-3.5 w-3.5" />

              Edit
            </button>

            {funded ===
              0 && (
              <button
                type="button"
                onClick={
                  onWithdraw
                }
                disabled={
                  deleting
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}

                Withdraw
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-400";

function FieldLabel({
  label,
  children,
  className = "",
}: {
  label:
    string;

  children:
    React.ReactNode;

  className?:
    string;
}) {
  return (
    <label
      className={`block space-y-2 ${className}`}
    >
      <span className="text-xs font-black text-slate-700">
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

function MoneyInput({
  value,
  onChange,
}: {
  value:
    number;

  onChange:
    (
      value:
        number
    ) => void;
}) {
  return (
    <div className="relative">

      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
        ৳
      </span>

      <input
        required
        type="number"
        min={
          1
        }
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            Number(
              event.target.value
            )
          )
        }
        className={`${inputClass} pl-8`}
      />
    </div>
  );
}

function ReturnValue({
  label,
  value,
  active = false,
}: {
  label:
    string;

  value:
    string;

  active?:
    boolean;
}) {
  return (
    <div className="min-w-0">

      <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
        {
          label
        }
      </p>

      <p
        className={`mt-1 truncate text-xs font-black ${
          active
            ? "text-emerald-700"
            : "text-slate-900"
        }`}
      >
        {
          value
        }
      </p>
    </div>
  );
}

function SmallStat({
  label,
  value,
  active = false,
}: {
  label:
    string;

  value:
    string;

  active?:
    boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        active
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <p
        className={`text-[8px] font-black uppercase tracking-wide ${
          active
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        {
          label
        }
      </p>

      <p
        className={`mt-1 truncate text-xs font-black ${
          active
            ? "text-emerald-800"
            : "text-slate-900"
        }`}
      >
        {
          value
        }
      </p>
    </div>
  );
}
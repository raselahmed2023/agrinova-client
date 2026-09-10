"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  FileImage,
  FileText,
  HandCoins,
  MapPin,
  Upload,
  XCircle,
} from "lucide-react";

import {
  createInvestmentProject,
  getMyInvestmentProjects,
} from "@/services/investment.service";

import type {
  CreateInvestmentProjectPayload,
  InvestmentProject,
} from "@/types/investment";

import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

const initialForm:
  CreateInvestmentProjectPayload = {
  projectName: "",
  category: "organic_farming",

  requiredInvestment: 0,
  ownContribution: 0,

  duration: "",
  expectedReturn: "",
  profitSharing: "",

  estimatedRevenue: 0,
  estimatedCost: 0,
  estimatedProfit: 0,

  division: "",
  district: "",
  upazila: "",
  address: "",

  description: "",

  projectImage: "",

  nidNumber: "",
  nidFrontImage: "",

  supportingDocument: "",
};

const uploadToImgBB =
  async (
    file: File
  ): Promise<string> => {
    const apiKey =
      process.env
        .NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ImgBB API key is not configured"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result?.success ||
      !result?.data?.url
    ) {
      throw new Error(
        "Failed to upload image"
      );
    }

    return result.data.url;
  };

const formatMoney = (
  value: number
) =>
  `৳${Number(value || 0).toLocaleString(
    "en-BD"
  )}`;

const getStatus = (
  project: InvestmentProject
) => {
  if (
    project.status ===
    "APPROVED"
  ) {
    return {
      label:
        "Approved",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700",
    };
  }

  if (
    project.status ===
    "REJECTED"
  ) {
    return {
      label:
        "Rejected",
      icon: XCircle,
      className:
        "bg-red-50 text-red-700",
    };
  }

  return {
    label:
      "Pending Review",
    icon: Clock3,
    className:
      "bg-amber-50 text-amber-700",
  };
};

export default function InvestmentPage() {
  const [
    formData,
    setFormData,
  ] =
    useState<CreateInvestmentProjectPayload>(
      initialForm
    );

  const [
    projects,
    setProjects,
  ] =
    useState<InvestmentProject[]>(
      []
    );

  const [
    loadingProjects,
    setLoadingProjects,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
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
    submitStatus,
    setSubmitStatus,
  ] =
    useState("");

  const [
    projectImageFile,
    setProjectImageFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    nidImageFile,
    setNidImageFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    supportingDocumentFile,
    setSupportingDocumentFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    projectImagePreview,
    setProjectImagePreview,
  ] =
    useState("");

  const districts =
    useMemo(
      () =>
        getDistrictsByDivision(
          formData.division
        ),
      [formData.division]
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

  const loadProjects =
    async () => {
      try {
        setLoadingProjects(
          true
        );

        const data =
          await getMyInvestmentProjects();

        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProjects(
          false
        );
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (
    e:
      React.ChangeEvent<
        HTMLInputElement |
          HTMLSelectElement |
          HTMLTextAreaElement
      >
  ) => {
    const {
      name,
      value,
    } = e.target;

    const numericFields = [
      "requiredInvestment",
      "ownContribution",
      "estimatedRevenue",
      "estimatedCost",
      "estimatedProfit",
    ];

    if (
      numericFields.includes(
        name
      )
    ) {
      setFormData(
        (prev) => ({
          ...prev,
          [name]:
            value === ""
              ? 0
              : Number(value),
        })
      );

      return;
    }

    if (
      name ===
      "division"
    ) {
      setFormData(
        (prev) => ({
          ...prev,
          division:
            value,
          district: "",
          upazila: "",
        })
      );

      return;
    }

    if (
      name ===
      "district"
    ) {
      setFormData(
        (prev) => ({
          ...prev,
          district:
            value,
          upazila: "",
        })
      );

      return;
    }

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  const validateFile = (
    file: File
  ) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !allowed.includes(
        file.type
      )
    ) {
      throw new Error(
        "Only JPG, JPEG or PNG files are allowed."
      );
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      throw new Error(
        "Each file must be less than 5MB."
      );
    }
  };

  const handleProjectImage =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        validateFile(file);

        setError("");

        setProjectImageFile(
          file
        );

        if (
          projectImagePreview
        ) {
          URL.revokeObjectURL(
            projectImagePreview
          );
        }

        setProjectImagePreview(
          URL.createObjectURL(
            file
          )
        );
      } catch (err) {
        setProjectImageFile(
          null
        );

        setError(
          err instanceof Error
            ? err.message
            : "Invalid image"
        );
      }
    };

  const handleFile =
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: (
        file: File | null
      ) => void
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        validateFile(file);

        setError("");

        setter(file);
      } catch (err) {
        setter(null);

        setError(
          err instanceof Error
            ? err.message
            : "Invalid file"
        );
      }
    };

  const resetForm =
    () => {
      if (
        projectImagePreview
      ) {
        URL.revokeObjectURL(
          projectImagePreview
        );
      }

      setFormData(
        initialForm
      );

      setProjectImageFile(
        null
      );

      setNidImageFile(
        null
      );

      setSupportingDocumentFile(
        null
      );

      setProjectImagePreview(
        ""
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (submitting) return;

      try {
        setSubmitting(true);

        setError("");
        setSuccess("");

        let projectImage =
          "";

        let nidFrontImage =
          "";

        let supportingDocument =
          "";

        if (
          projectImageFile
        ) {
          setSubmitStatus(
            "Uploading project image..."
          );

          projectImage =
            await uploadToImgBB(
              projectImageFile
            );
        }

        if (
          nidImageFile
        ) {
          setSubmitStatus(
            "Uploading NID image..."
          );

          nidFrontImage =
            await uploadToImgBB(
              nidImageFile
            );
        }

        if (
          supportingDocumentFile
        ) {
          setSubmitStatus(
            "Uploading supporting document..."
          );

          supportingDocument =
            await uploadToImgBB(
              supportingDocumentFile
            );
        }

        setSubmitStatus(
          "Submitting project for review..."
        );

        await createInvestmentProject(
          {
            ...formData,

            projectImage:
              projectImage ||
              undefined,

            nidFrontImage:
              nidFrontImage ||
              undefined,

            supportingDocument:
              supportingDocument ||
              undefined,
          }
        );

        setSuccess(
          "Investment project submitted successfully. It is now waiting for admin review."
        );

        resetForm();

        await loadProjects();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to submit project"
        );
      } finally {
        setSubmitting(false);
        setSubmitStatus("");
      }
    };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <section>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <HandCoins className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-950">
                Need Investment
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Submit your farming project to AgriNova. Approved projects can be displayed in the public investment section.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-semibold text-slate-950">
              Create Investment Project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All submitted projects are reviewed by AgriNova admin before publication.
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="p-5 sm:p-7"
          >
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Name
                </label>

                <input
                  name="projectName"
                  value={
                    formData.projectName
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Modern Vegetable Farming Project"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="organic_farming">
                    Organic Farming
                  </option>

                  <option value="poultry">
                    Poultry
                  </option>

                  <option value="vegetable_farming">
                    Vegetable Farming
                  </option>

                  <option value="greenhouse">
                    Greenhouse
                  </option>

                  <option value="irrigation">
                    Irrigation
                  </option>

                  <option value="equipment">
                    Equipment
                  </option>

                  <option value="technology">
                    Technology
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Required Investment
                </label>

                <input
                  type="number"
                  name="requiredInvestment"
                  min="1"
                  value={
                    formData.requiredInvestment ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="500000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Farmer's Own Contribution
                </label>

                <input
                  type="number"
                  name="ownContribution"
                  min="0"
                  value={
                    formData.ownContribution ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="100000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Duration
                </label>

                <input
                  name="duration"
                  value={
                    formData.duration
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="8 months"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Return
                </label>

                <input
                  name="expectedReturn"
                  value={
                    formData.expectedReturn
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Estimated 12%"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Profit Sharing
                </label>

                <input
                  name="profitSharing"
                  value={
                    formData.profitSharing
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Farmer 70% / Investor 30%"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Revenue
                </label>

                <input
                  type="number"
                  name="estimatedRevenue"
                  min="0"
                  value={
                    formData.estimatedRevenue ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="800000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Cost
                </label>

                <input
                  type="number"
                  name="estimatedCost"
                  min="0"
                  value={
                    formData.estimatedCost ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="500000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Profit
                </label>

                <input
                  type="number"
                  name="estimatedProfit"
                  min="0"
                  value={
                    formData.estimatedProfit ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="300000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Division
                </label>

                <select
                  name="division"
                  value={
                    formData.division
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="">
                    Select Division
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
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  District
                </label>

                <select
                  name="district"
                  value={
                    formData.district
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={
                    !formData.division
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50 focus:border-emerald-600"
                >
                  <option value="">
                    Select District
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
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Upazila
                </label>

                <select
                  name="upazila"
                  value={
                    formData.upazila
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={
                    !formData.district
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-50 focus:border-emerald-600"
                >
                  <option value="">
                    Select Upazila
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <input
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Village, Union, Road..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  NID Number
                </label>

                <input
                  name="nidNumber"
                  value={
                    formData.nidNumber
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Farmer NID number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Image
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={
                      handleProjectImage
                    }
                  />

                  {projectImagePreview ? (
                    <img
                      src={
                        projectImagePreview
                      }
                      alt="Project preview"
                      className="h-20 w-28 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Upload className="h-5 w-5" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Upload project image
                    </p>

                    <p className="text-xs text-slate-500">
                      JPG, JPEG or PNG · Max 5MB
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  NID Front Image
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) =>
                      handleFile(
                        e,
                        setNidImageFile
                      )
                    }
                  />

                  <FileImage className="h-5 w-5 text-slate-500" />

                  <span className="truncate text-sm text-slate-600">
                    {nidImageFile
                      ? nidImageFile.name
                      : "Upload NID image"}
                  </span>
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Supporting Document
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) =>
                      handleFile(
                        e,
                        setSupportingDocumentFile
                      )
                    }
                  />

                  <FileText className="h-5 w-5 text-slate-500" />

                  <span className="truncate text-sm text-slate-600">
                    {supportingDocumentFile
                      ? supportingDocumentFile.name
                      : "Upload supporting document"}
                  </span>
                </label>
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  required
                  rows={6}
                  placeholder="Describe the project, farming plan, investment need and expected outcome..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {submitStatus && (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {submitStatus}
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={
                  submitting
                }
                className="rounded-xl bg-emerald-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit for Admin Review"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-950">
              My Investment Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the review status of projects you have submitted.
            </p>
          </div>

          {loadingProjects ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading your projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-semibold text-slate-800">
                No investment projects yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Submit your first farming project above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map(
                (project) => {
                  const status =
                    getStatus(
                      project
                    );

                  const Icon =
                    status.icon;

                  return (
                    <article
                      key={
                        project._id
                      }
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      {project.projectImage ? (
                        <img
                          src={
                            project.projectImage
                          }
                          alt={
                            project.projectName
                          }
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-emerald-50 text-emerald-700">
                          <HandCoins className="h-12 w-12" />
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-slate-950">
                            {
                              project.projectName
                            }
                          </h3>

                          <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {
                              status.label
                            }
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                          <p>
                            Required:{" "}
                            <strong className="text-slate-800">
                              {formatMoney(
                                project.requiredInvestment
                              )}
                            </strong>
                          </p>

                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {
                              project.district
                            }
                            ,{" "}
                            {
                              project.division
                            }
                          </p>

                          <p>
                            Duration:{" "}
                            {
                              project.duration
                            }
                          </p>
                        </div>

                        {project.status ===
                          "REJECTED" &&
                          project.adminNote && (
                            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                              <strong>
                                Admin note:
                              </strong>{" "}
                              {
                                project.adminNote
                              }
                            </div>
                          )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
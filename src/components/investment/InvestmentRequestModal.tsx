"use client";

import { useState } from "react";
import {
  FileImage,
  FileText,
  Upload,
  X,
} from "lucide-react";

import { createInvestmentProject } from "@/services/investment.service";
import type { CreateInvestmentProjectPayload } from "@/types/investment";

type InvestmentRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialForm: CreateInvestmentProjectPayload = {
  projectTitle: "",
  nidNumber: "",
  category: "",
  requiredInvestment: 0,
  projectedProfit: 0,
  duration: "",
  location: "",
  projectImage: "",
  description: "",
  supportingDocument: "",
};

const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result?.success || !result?.data?.url) {
    throw new Error("Failed to upload image");
  }

  return result.data.url;
};

export default function InvestmentRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: InvestmentRequestModalProps) {
  const [formData, setFormData] =
    useState<CreateInvestmentProjectPayload>(initialForm);

  const [projectImageFile, setProjectImageFile] =
    useState<File | null>(null);

  const [supportingDocumentFile, setSupportingDocumentFile] =
    useState<File | null>(null);

  const [projectImagePreview, setProjectImagePreview] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingText, setUploadingText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      name === "requiredInvestment" ||
      name === "projectedProfit"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateImage = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Only JPG, JPEG or PNG files are allowed"
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "File size must be less than 5MB"
      );
    }
  };

  const handleProjectImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      validateImage(file);
      setError("");

      if (projectImagePreview) {
        URL.revokeObjectURL(projectImagePreview);
      }

      setProjectImageFile(file);
      setProjectImagePreview(
        URL.createObjectURL(file)
      );
    } catch (err) {
      setProjectImageFile(null);

      setError(
        err instanceof Error
          ? err.message
          : "Invalid project image"
      );
    }
  };

  const handleSupportingDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      validateImage(file);
      setError("");
      setSupportingDocumentFile(file);
    } catch (err) {
      setSupportingDocumentFile(null);

      setError(
        err instanceof Error
          ? err.message
          : "Invalid supporting document"
      );
    }
  };

  const resetForm = () => {
    if (projectImagePreview) {
      URL.revokeObjectURL(projectImagePreview);
    }

    setFormData(initialForm);
    setProjectImageFile(null);
    setSupportingDocumentFile(null);
    setProjectImagePreview("");
    setUploadingText("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!projectImageFile) {
      setError("Project image is required");
      return;
    }

    if (!supportingDocumentFile) {
      setError("Supporting document is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      setUploadingText(
        "Uploading project image..."
      );

      const projectImage =
        await uploadToImgBB(projectImageFile);

      setUploadingText(
        "Uploading supporting document..."
      );

      const supportingDocument =
        await uploadToImgBB(
          supportingDocumentFile
        );

      setUploadingText(
        "Submitting project..."
      );

      await createInvestmentProject({
        ...formData,
        projectImage,
        supportingDocument,
      });

      setSuccess(
        "Investment project submitted successfully for admin review."
      );

      onSuccess?.();

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit investment project"
      );
    } finally {
      setLoading(false);
      setUploadingText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Create Investment Project
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Submit your farming project for AgriNova review.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Title
                  </label>

                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                    placeholder="Tomato Cultivation Project"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Farmer NID Number
                  </label>

                  <input
                    type="text"
                    name="nidNumber"
                    value={formData.nidNumber}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    placeholder="10, 13 or 17 digit NID"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Only AgriNova admin can view this information.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Crop Farming">
                      Crop Farming
                    </option>

                    <option value="Fish Farming">
                      Fish Farming
                    </option>

                    <option value="Poultry">
                      Poultry
                    </option>

                    <option value="Livestock">
                      Livestock
                    </option>

                    <option value="Orchard">
                      Orchard
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Required Investment
                  </label>

                  <input
                    type="number"
                    name="requiredInvestment"
                    value={
                      formData.requiredInvestment === 0
                        ? ""
                        : formData.requiredInvestment
                    }
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="300000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Projected Profit
                  </label>

                  <input
                    type="number"
                    name="projectedProfit"
                    value={
                      formData.projectedProfit === 0
                        ? ""
                        : formData.projectedProfit
                    }
                    onChange={handleChange}
                    required
                    min={0}
                    placeholder="60000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    placeholder="5 Months"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Chuadanga, Bangladesh"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Image
                  </label>

                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-4 py-4 transition hover:bg-emerald-50">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleProjectImageChange}
                      className="hidden"
                    />

                    {!projectImageFile ? (
                      <div className="text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <Upload size={19} />
                        </div>

                        <p className="mt-2 text-sm font-medium text-gray-800">
                          Upload project image
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          JPG, JPEG or PNG · Max 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex w-full items-center gap-4">
                        {projectImagePreview && (
                          <img
                            src={projectImagePreview}
                            alt="Project preview"
                            className="h-16 w-20 rounded-lg object-cover"
                          />
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {projectImageFile.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Click to replace image
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Supporting Document
                  </label>

                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 transition hover:border-emerald-300 hover:bg-emerald-50/40">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleSupportingDocumentChange}
                      className="hidden"
                    />

                    {!supportingDocumentFile ? (
                      <div className="text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <FileText size={19} />
                        </div>

                        <p className="mt-2 text-sm font-medium text-gray-800">
                          Upload supporting document
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          JPG, JPEG or PNG · Max 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex w-full items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <FileImage size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {supportingDocumentFile.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Click to replace document
                          </p>
                        </div>
                      </div>
                    )}
                  </label>

                  <p className="mt-2 text-xs text-gray-500">
                    This document is visible only to AgriNova admin.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Short Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe your farming project and investment need..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>
              </div>

              {loading && uploadingText && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {uploadingText}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="min-w-[155px] rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
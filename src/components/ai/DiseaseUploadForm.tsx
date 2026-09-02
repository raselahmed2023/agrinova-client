"use client";

import {
  AlertCircle,
  Camera,
  FileImage,
  ImagePlus,
  Leaf,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

import DiseaseResult, {
  type DiseaseResultType,
} from "./DiseaseResult";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function DiseaseUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [cropName, setCropName] = useState("");
  const [result, setResult] =
    useState<DiseaseResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(
    null
  );

  const selectFile = (selectedFile: File) => {
    setError("");
    setResult(null);

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Only JPG, PNG and WEBP images are supported."
      );
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Image size must be 5MB or less.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile =
      event.dataTransfer.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const reset = () => {
    removeImage();
    setCropName("");
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!file) {
      setError("Please upload a crop or leaf image.");
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      if (cropName.trim()) {
        formData.append("cropName", cropName.trim());
      }

      const response = await fetch(
        `${API_URL}/ai/disease-detection`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to analyze the crop image."
        );
      }

      setResult(data.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F3EC] text-[#0B513D]">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-sm font-semibold text-[#477A5B]">
              AI Tools
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Disease Detection
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload a clear crop or leaf image to identify
            possible disease symptoms and receive practical
            guidance.
          </p>
        </div>

        {(file || result) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            New Analysis
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
              <Camera className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Upload Crop Image
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Clear, close-up images provide better results.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {!preview ? (
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
                  isDragging
                    ? "border-[#0B513D] bg-[#F0F7F2]"
                    : "border-slate-300 bg-[#FAFBFA] hover:border-[#8CB89A] hover:bg-[#F7FAF8]"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4ED] text-[#0B513D]">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  Drop your crop image here
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  or click to browse from your device
                </p>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400">
                  <FileImage className="h-4 w-4" />
                  JPG, PNG or WEBP · Maximum 5MB
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={preview}
                    alt="Uploaded crop"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 bg-white p-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {file?.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {file
                        ? `${(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Crop Name
              <span className="ml-1 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <div className="relative">
              <Leaf className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

              <input
                value={cropName}
                onChange={(e) =>
                  setCropName(e.target.value)
                }
                placeholder="e.g. Tomato"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs leading-5 text-red-600">
                {error}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={!file || isLoading}
            onClick={analyzeImage}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B513D] text-sm font-semibold text-white shadow-sm transition hover:bg-[#084330] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Disease
              </>
            )}
          </button>

          <div className="mt-4 flex gap-2 rounded-xl bg-[#F5F8F6] p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#477A5B]" />

            <p className="text-[11px] leading-5 text-slate-500">
              AI image analysis is advisory. Serious crop
              conditions should be verified by a qualified
              agricultural expert.
            </p>
          </div>
        </section>

        <section>
          {isLoading ? (
            <DiseaseSkeleton />
          ) : result ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Disease Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-generated observations and recommended
                  actions.
                </p>
              </div>

              <DiseaseResult result={result} />
            </>
          ) : (
            <div className="flex min-h-[600px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4ED] text-[#0B513D]">
                  <ImagePlus className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  Ready to analyze your crop
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Upload a clear photo of the affected leaf or
                  crop. Your disease analysis will appear here.
                </p>

                <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
                  {[
                    "Use good lighting",
                    "Focus affected area",
                    "Avoid blurry photos",
                  ].map((tip, index) => (
                    <div
                      key={tip}
                      className="rounded-xl border border-slate-100 bg-[#FAFBFA] p-3"
                    >
                      <span className="text-[10px] font-semibold text-[#477A5B]">
                        0{index + 1}
                      </span>

                      <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DiseaseSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-32 rounded-2xl bg-slate-200" />

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="h-4 w-32 rounded bg-slate-200" />

          <div className="mt-5 space-y-3">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-11/12 rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
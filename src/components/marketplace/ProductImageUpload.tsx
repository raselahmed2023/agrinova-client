"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  AlertTriangle,
  CheckCircle2,
  CloudOff,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  IMAGE_INPUT_MAX_BYTES,
  listStoredLocalImages,
  removeStoredLocalImage,
  retryStoredImage,
  uploadImageWithFallback,
  type StoredLocalImage,
} from "@/lib/image-storage";

const MAX_IMAGES =
  5;

const PURPOSE =
  "marketplace-product";

interface ProductImageUploadProps {
  images:
    string[];

  setImages:
    Dispatch<
      SetStateAction<
        string[]
      >
    >;
}

export default function ProductImageUpload({
  images,
  setImages,
}: ProductImageUploadProps) {
  const [
    uploading,
    setUploading,
  ] =
    useState(
      false
    );

  const [
    retryingKey,
    setRetryingKey,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    message,
    setMessage,
  ] =
    useState(
      ""
    );

  const [
    localImages,
    setLocalImages,
  ] =
    useState<
      StoredLocalImage[]
    >(
      []
    );

  /**
   * Restore recent locally saved images after refresh.
   *
   * image-storage.ts automatically removes
   * fallbacks older than 24 hours.
   */
  useEffect(
    () => {
      setLocalImages(
        listStoredLocalImages(
          PURPOSE
        )
      );
    },

    []
  );

  const totalImages =
    images.length +
    localImages.length;

  const handleFiles =
    async (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const files =
        Array.from(
          event.target
            .files ||
            []
        );

      if (
        !files.length
      ) {
        return;
      }

      const remainingSlots =
        Math.max(
          MAX_IMAGES -
            totalImages,

          0
        );

      if (
        remainingSlots ===
        0
      ) {
        setError(
          `You can upload up to ${MAX_IMAGES} product images.`
        );

        event.target.value =
          "";

        return;
      }

      const selectedFiles =
        files.slice(
          0,
          remainingSlots
        );

      setUploading(
        true
      );

      setError(
        ""
      );

      setMessage(
        ""
      );

      const remoteUrls:
        string[] =
        [];

      const localFallbacks:
        StoredLocalImage[] =
        [];

      try {
        for (
          const file of selectedFiles
        ) {
          if (
            file.size >
            IMAGE_INPUT_MAX_BYTES
          ) {
            throw new Error(
              `${file.name} must be 8 MB or smaller.`
            );
          }

          const result =
            await uploadImageWithFallback(
              file,
              {
                purpose:
                  PURPOSE,

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
          } else {
            const stored =
              listStoredLocalImages(
                PURPOSE
              ).find(
                (
                  item
                ) =>
                  item.localKey ===
                  result.localKey
              );

            if (
              stored
            ) {
              localFallbacks.push(
                stored
              );
            }
          }
        }

        if (
          remoteUrls.length
        ) {
          setImages(
            (
              current
            ) => [
              ...current,
              ...remoteUrls,
            ]
          );
        }

        if (
          localFallbacks.length
        ) {
          setLocalImages(
            (
              current
            ) => {
              const known =
                new Set(
                  current.map(
                    (
                      item
                    ) =>
                      item.localKey
                  )
                );

              return [
                ...current,

                ...localFallbacks.filter(
                  (
                    item
                  ) =>
                    !known.has(
                      item.localKey
                    )
                ),
              ];
            }
          );

          setMessage(
            `${localFallbacks.length} image${
              localFallbacks.length >
              1
                ? "s were"
                : " was"
            } saved safely in this browser because the image server was unavailable. Use Retry when the service is available.`
          );
        } else if (
          remoteUrls.length
        ) {
          setMessage(
            `${remoteUrls.length} image${
              remoteUrls.length >
              1
                ? "s"
                : ""
            } uploaded successfully.`
          );
        }
      } catch (
        err
      ) {
        console.error(
          "Product image processing failed:",
          err
        );

        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to process product image."
        );
      } finally {
        setUploading(
          false
        );

        event.target.value =
          "";
      }
    };

  const removeRemoteImage =
    (
      index: number
    ) => {
      setImages(
        (
          current
        ) =>
          current.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex !==
              index
          )
      );
    };

  const removeLocalImage =
    (
      localKey: string
    ) => {
      removeStoredLocalImage(
        localKey
      );

      setLocalImages(
        (
          current
        ) =>
          current.filter(
            (
              item
            ) =>
              item.localKey !==
              localKey
          )
      );

      setMessage(
        ""
      );
    };

  const retryLocal =
    async (
      image:
        StoredLocalImage
    ) => {
      try {
        setRetryingKey(
          image.localKey
        );

        setError(
          ""
        );

        setMessage(
          ""
        );

        const remoteUrl =
          await retryStoredImage(
            image.localKey
          );

        setImages(
          (
            current
          ) => [
            ...current,
            remoteUrl,
          ]
        );

        setLocalImages(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.localKey !==
                image.localKey
            )
        );

        setMessage(
          "Local image uploaded successfully."
        );
      } catch (
        err
      ) {
        console.error(
          "Local image retry failed:",
          err
        );

        setError(
          err instanceof
            Error
            ? err.message
            : "Image upload is still unavailable."
        );
      } finally {
        setRetryingKey(
          null
        );
      }
    };

  return (
    <div className="space-y-4">
      <label
        className={`group flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
          uploading ||
          totalImages >=
            MAX_IMAGES
            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
            : "cursor-pointer border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={
            uploading ||
            totalImages >=
              MAX_IMAGES
          }
          onChange={
            handleFiles
          }
          className="sr-only"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-transform duration-200 group-hover:scale-105">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <p className="mt-3 text-sm font-bold text-slate-800">
          {uploading
            ? "Processing images..."
            : "Upload product images"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Select up to
          {" "}
          {MAX_IMAGES}
          {" "}
          product photos,
          maximum 8 MB
          each
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          Images are compressed automatically before upload.
        </p>
      </label>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            {error}
          </span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            {message}
          </span>
        </div>
      )}

      {localImages.length >
        0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <p className="text-sm font-bold text-amber-900">
              {
                localImages.length
              }
              {" "}
              photo
              {localImages.length >
              1
                ? "s"
                : ""}
              {" "}
              saved locally
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800">
              These photos are safe in this browser, but they are not public yet. Retry them before publishing if you want buyers on other devices to see them.
            </p>
          </div>
        </div>
      )}

      {(images.length >
        0 ||
        localImages.length >
          0) && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map(
            (
              image,
              index
            ) => (
              <div
                key={`${image}-${index}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-40 bg-slate-100">
                  <Image
                    src={
                      image
                    }
                    alt={`Product image ${
                      index +
                      1
                    }`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />

                  <div className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Uploaded
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeRemoteImage(
                        index
                      )
                    }
                    disabled={
                      uploading
                    }
                    aria-label={`Remove image ${
                      index +
                      1
                    }`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3 py-2.5">
                  <ImagePlus className="h-4 w-4 shrink-0 text-emerald-600" />

                  <span className="truncate text-xs text-slate-500">
                    Product image
                    {" "}
                    {index +
                      1}
                  </span>
                </div>
              </div>
            )
          )}

          {localImages.map(
            (
              image,
              index
            ) => {
              const retrying =
                retryingKey ===
                image.localKey;

              return (
                <div
                  key={
                    image.localKey
                  }
                  className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm"
                >
                  <div className="relative h-40 bg-slate-100">
                    <Image
                      src={
                        image.dataUrl
                      }
                      alt={`Locally saved product image ${
                        index +
                        1
                      }`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                      className="object-cover"
                      unoptimized
                    />

                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                      <CloudOff className="h-3 w-3" />

                      Local
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeLocalImage(
                          image.localKey
                        )
                      }
                      disabled={
                        retrying
                      }
                      aria-label="Remove local image"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2 px-3 py-3">
                    <p className="truncate text-xs font-medium text-slate-600">
                      {
                        image.name
                      }
                    </p>

                    <button
                      type="button"
                      disabled={
                        retrying ||
                        uploading
                      }
                      onClick={() =>
                        retryLocal(
                          image
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {retrying ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}

                      {retrying
                        ? "Retrying..."
                        : "Retry upload"}
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {totalImages ===
        0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-400">
          No product images uploaded yet.
        </div>
      )}

      <div className="text-right text-[11px] font-medium text-slate-400">
        {totalImages}
        /
        {MAX_IMAGES}
        {" "}
        images selected
      </div>
    </div>
  );
}
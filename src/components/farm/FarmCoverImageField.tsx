"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import {
  CloudOff,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import {
  getStoredLocalImage,
  listStoredLocalImages,
  removeStoredLocalImage,
  retryStoredImage,
  uploadImageWithFallback,
  type StoredLocalImage,
} from "@/lib/image-storage";

export interface FarmCoverImageFieldHandle {
  /**
   * Before saving a Farm, call this.
   *
   * If there is a browser-only fallback image,
   * this tries to upload it and returns the real URL.
   */
  ensureRemoteUrl: () =>
    Promise<
      string | undefined
    >;

  /**
   * Remove pending browser fallback.
   */
  clearLocal: () =>
    void;
}

interface Props {
  value?: string;

  onChange: (
    value: string
  ) => void;

  /**
   * Example:
   *
   * farm-create
   * farm-edit-123456
   */
  purpose: string;

  disabled?: boolean;

  onBusyChange?: (
    busy: boolean
  ) => void;
}

const FarmCoverImageField =
  forwardRef<
    FarmCoverImageFieldHandle,
    Props
  >(function FarmCoverImageField(
    {
      value = "",
      onChange,
      purpose,
      disabled = false,
      onBusyChange,
    },
    ref
  ) {
    const {
      data: session,
    } =
      useSession();

    const [
      localImage,
      setLocalImage,
    ] =
      useState<
        StoredLocalImage | null
      >(null);

    const [
      uploading,
      setUploading,
    ] =
      useState(
        false
      );

    const [
      retrying,
      setRetrying,
    ] =
      useState(
        false
      );

    const [
      error,
      setError,
    ] =
      useState("");

    const [
      notice,
      setNotice,
    ] =
      useState("");

    const userId =
      session?.user?.id;

    /**
     * User-specific localStorage key.
     *
     * Farmer A's pending image will not appear
     * when Farmer B uses the same browser.
     */
    const storagePurpose =
      useMemo(
        () =>
          `${purpose}-${
            userId ||
            "unknown-user"
          }`,
        [
          purpose,
          userId,
        ]
      );

    const busy =
      uploading ||
      retrying;

    /**
     * Let parent drawer know that
     * image processing is happening.
     */
    useEffect(() => {
      onBusyChange?.(
        busy
      );
    }, [
      busy,
      onBusyChange,
    ]);

    /**
     * Restore pending image after refresh.
     */
    useEffect(() => {
      if (
        !userId
      ) {
        return;
      }

      const saved =
        listStoredLocalImages(
          storagePurpose
        );

      if (
        saved.length ===
        0
      ) {
        setLocalImage(
          null
        );

        return;
      }

      /**
       * Only one Farm cover is needed.
       * Keep newest fallback.
       */
      const newest =
        saved[
          saved.length -
            1
        ];

      for (
        const item of saved
      ) {
        if (
          item.localKey !==
          newest.localKey
        ) {
          removeStoredLocalImage(
            item.localKey
          );
        }
      }

      setLocalImage(
        newest
      );

      setNotice(
        "This Farm photo is saved locally and is waiting to upload."
      );
    }, [
      storagePurpose,
      userId,
    ]);

    /**
     * Delete browser-only image.
     */
    const clearLocal =
      useCallback(
        () => {
          if (
            localImage
          ) {
            removeStoredLocalImage(
              localImage.localKey
            );
          }

          setLocalImage(
            null
          );

          setNotice(
            ""
          );
        },
        [
          localImage,
        ]
      );

    /**
     * =========================================================
     * FILE SELECT
     * =========================================================
     */

    const handleFile =
      async (
        event:
          React.ChangeEvent<HTMLInputElement>
      ) => {
        const file =
          event.target
            .files?.[0];

        event.target.value =
          "";

        if (
          !file ||
          busy ||
          disabled
        ) {
          return;
        }

        try {
          setUploading(
            true
          );

          setError(
            ""
          );

          setNotice(
            ""
          );

          const result =
            await uploadImageWithFallback(
              file,
              {
                purpose:
                  storagePurpose,

                allowLocalFallback:
                  true,
              }
            );

          /**
           * ===================================================
           * REMOTE SUCCESS
           * ===================================================
           */
          if (
            result.source ===
            "remote"
          ) {
            /**
             * Remove old fallback if one existed.
             */
            if (
              localImage
            ) {
              removeStoredLocalImage(
                localImage.localKey
              );
            }

            setLocalImage(
              null
            );

            onChange(
              result.url
            );

            setNotice(
              "Farm image uploaded successfully."
            );

            return;
          }

          /**
           * ===================================================
           * LOCAL FALLBACK
           * ===================================================
           */

          const stored =
            getStoredLocalImage(
              result.localKey
            );

          if (
            !stored
          ) {
            throw new Error(
              "The image was saved locally but could not be restored."
            );
          }

          /**
           * Remove older pending cover images.
           */
          const existing =
            listStoredLocalImages(
              storagePurpose
            );

          for (
            const item of existing
          ) {
            if (
              item.localKey !==
              stored.localKey
            ) {
              removeStoredLocalImage(
                item.localKey
              );
            }
          }

          setLocalImage(
            stored
          );

          setNotice(
            "Image server is temporarily unavailable. Your Farm photo is saved safely in this browser."
          );
        } catch (
          err
        ) {
          console.error(
            "Farm image upload failed:",
            err
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to process Farm image."
          );
        } finally {
          setUploading(
            false
          );
        }
      };

    /**
     * =========================================================
     * ENSURE PUBLIC URL
     * =========================================================
     *
     * Called automatically before Add/Edit Farm submit.
     */
    const ensureRemoteUrl =
      useCallback(
        async () => {
          /**
           * Already uploaded.
           */
          if (
            !localImage
          ) {
            return (
              value ||
              undefined
            );
          }

          try {
            setRetrying(
              true
            );

            setError(
              ""
            );

            setNotice(
              "Uploading saved Farm image..."
            );

            const remoteUrl =
              await retryStoredImage(
                localImage.localKey
              );

            setLocalImage(
              null
            );

            onChange(
              remoteUrl
            );

            setNotice(
              "Farm image uploaded successfully."
            );

            return remoteUrl;
          } catch (
            err
          ) {
            console.error(
              "Farm image retry failed:",
              err
            );

            const message =
              err instanceof
                Error
                ? err.message
                : "Image service is still unavailable.";

            setError(
              message
            );

            setNotice(
              ""
            );

            /**
             * Throw so Farm creation/update stops.
             *
             * We do NOT silently create the Farm
             * without the photo the Farmer selected.
             */
            throw new Error(
              `Farm image could not be uploaded. ${message}`
            );
          } finally {
            setRetrying(
              false
            );
          }
        },
        [
          localImage,
          onChange,
          value,
        ]
      );

    useImperativeHandle(
      ref,
      () => ({
        ensureRemoteUrl,

        clearLocal,
      }),
      [
        ensureRemoteUrl,
        clearLocal,
      ]
    );

    /**
     * Manual Retry button.
     */
    const retry =
      async () => {
        try {
          await ensureRemoteUrl();
        } catch {
          /**
           * Error already shown by ensureRemoteUrl().
           */
        }
      };

    /**
     * Remove current selected cover.
     */
    const removeImage =
      () => {
        clearLocal();

        onChange(
          ""
        );

        setError(
          ""
        );

        setNotice(
          ""
        );
      };

    /**
     * Local preview has priority.
     */
    const preview =
      localImage?.dataUrl ||
      value;

    return (
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Cover Image
        </p>

        <label
          className={`relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
            localImage
              ? "border-amber-300 bg-amber-50"
              : "border-slate-200 bg-white"
          } ${
            busy ||
            disabled
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:border-emerald-400"
          }`}
        >
          {busy ? (
            <div className="text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-emerald-600" />

              <p className="mt-2 text-xs font-medium text-slate-500">
                {retrying
                  ? "Retrying upload..."
                  : "Processing image..."}
              </p>
            </div>
          ) : preview ? (
            <>
              <img
                src={
                  preview
                }
                alt="Farm cover"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              {localImage ? (
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  <CloudOff className="h-3 w-3" />

                  Local
                </div>
              ) : (
                <div className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  Uploaded
                </div>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                Click to change photo
              </div>
            </>
          ) : (
            <div className="text-center">
              <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-2 text-xs font-medium text-slate-500">
                Upload JPG, PNG or WEBP
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Maximum 8 MB
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleFile
            }
            disabled={
              busy ||
              disabled
            }
            className="hidden"
          />
        </label>

        {localImage && (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() =>
                void retry()
              }
              disabled={
                busy ||
                disabled
              }
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-200 disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              Retry Upload
            </button>

            <button
              type="button"
              onClick={
                removeImage
              }
              disabled={
                busy ||
                disabled
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />

              Remove
            </button>
          </div>
        )}

        {!localImage &&
          value && (
          <button
            type="button"
            onClick={
              removeImage
            }
            disabled={
              busy ||
              disabled
            }
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />

            Remove image
          </button>
        )}

        {notice && (
          <div
            className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
              localImage
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {
              notice
            }
          </div>
        )}

        {error && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {
              error
            }
          </div>
        )}
      </div>
    );
  });

export default FarmCoverImageField;
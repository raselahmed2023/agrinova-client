

export const IMAGE_INPUT_MAX_BYTES =
  8 * 1024 * 1024;

const REMOTE_TARGET_BYTES =
  3 * 1024 * 1024;

const LOCAL_TARGET_BYTES =
  240 * 1024;

const REMOTE_MAX_DIMENSION = 1920;

const LOCAL_MAX_DIMENSION = 1280;

const LOCAL_STORAGE_PREFIX =
  "agrinova:image-fallback:v1:";

const LOCAL_STORAGE_MAX_AGE =
  24 * 60 * 60 * 1000;

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

export type ImagePurpose =
  | "marketplace-product"
  | "community-post"
  | "community-profile"
  | "farm-cover"
  | "expert-profile"
  | "expert-registration"
  | "blog-cover"
  | "supply-chain"
  | "investment-proof"
  | string;

export interface StoredLocalImage {
  localKey: string;

  purpose: string;

  name: string;

  type: string;

  size: number;

  dataUrl: string;

  createdAt: number;
}

export interface RemoteImageResult {
  source: "remote";

  url: string;

  localKey?: never;

  previewUrl: string;
}

export interface LocalImageResult {
  source: "local";

  url: string;

  previewUrl: string;

  localKey: string;
}

export type ImageUploadResult =
  | RemoteImageResult
  | LocalImageResult;

interface UploadApiResponse {
  success?: boolean;

  url?: string;

  message?: string;

  provider?: string;
}

function createId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }
}

function normalizePurpose(
  purpose: string
) {
  return purpose
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]+/g,
      "-"
    );
}

function storageKeyFor(
  purpose: string
) {
  return `${LOCAL_STORAGE_PREFIX}${normalizePurpose(
    purpose
  )}:${createId()}`;
}

function hasBrowserStorage() {
  return (
    typeof window !==
      "undefined" &&
    Boolean(
      window.localStorage
    )
  );
}

export function validateImageFile(
  file: File
) {
  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    throw new Error(
      "Only JPG, PNG and WEBP images are allowed."
    );
  }

  if (
    file.size <= 0
  ) {
    throw new Error(
      "The selected image is empty."
    );
  }

  if (
    file.size >
    IMAGE_INPUT_MAX_BYTES
  ) {
    throw new Error(
      "Image must be 8 MB or smaller."
    );
  }
}

function loadImageElement(
  file: Blob
): Promise<HTMLImageElement> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const url =
        URL.createObjectURL(
          file
        );

      const image =
        new Image();

      image.onload =
        () => {
          URL.revokeObjectURL(
            url
          );

          resolve(
            image
          );
        };

      image.onerror =
        () => {
          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "Unable to read this image."
            )
          );
        };

      image.src =
        url;
    }
  );
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      canvas.toBlob(
        (
          blob
        ) => {
          if (!blob) {
            reject(
              new Error(
                "Unable to compress image."
              )
            );

            return;
          }

          resolve(
            blob
          );
        },

        "image/webp",

        quality
      );
    }
  );
}

async function compressImage(
  file: File,
  options: {
    targetBytes: number;

    maxDimension: number;
  }
): Promise<File> {
  validateImageFile(
    file
  );

  
  if (
    file.size <=
      options.targetBytes &&
    (
      file.type ===
        "image/jpeg" ||
      file.type ===
        "image/webp"
    )
  ) {
    return file;
  }

  const image =
    await loadImageElement(
      file
    );

  let width =
    image.naturalWidth ||
    image.width;

  let height =
    image.naturalHeight ||
    image.height;

  if (
    !width ||
    !height
  ) {
    throw new Error(
      "Unable to determine image dimensions."
    );
  }

  const initialScale =
    Math.min(
      1,

      options.maxDimension /
        Math.max(
          width,
          height
        )
    );

  width =
    Math.max(
      1,
      Math.round(
        width *
          initialScale
      )
    );

  height =
    Math.max(
      1,
      Math.round(
        height *
          initialScale
      )
    );

  let bestBlob:
    | Blob
    | null = null;

  const qualities = [
    0.86,
    0.78,
    0.7,
    0.62,
    0.54,
    0.46,
    0.38,
  ];

 
  for (
    let dimensionPass =
      0;
    dimensionPass <
    6;
    dimensionPass +=
      1
  ) {
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
        }
      );

    if (!context) {
      throw new Error(
        "Your browser cannot process this image."
      );
    }

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    for (
      const quality of qualities
    ) {
      const blob =
        await canvasToBlob(
          canvas,
          quality
        );

      if (
        !bestBlob ||
        blob.size <
          bestBlob.size
      ) {
        bestBlob =
          blob;
      }

      if (
        blob.size <=
        options.targetBytes
      ) {
        const baseName =
          file.name
            .replace(
              /\.[^.]+$/,
              ""
            )
            .slice(
              0,
              80
            ) ||
          "agrinova-image";

        return new File(
          [
            blob,
          ],

          `${baseName}.webp`,

          {
            type:
              "image/webp",

            lastModified:
              Date.now(),
          }
        );
      }
    }

    
    width =
      Math.max(
        320,
        Math.round(
          width *
            0.82
        )
      );

    height =
      Math.max(
        320,
        Math.round(
          height *
            0.82
        )
      );
  }

  if (!bestBlob) {
    throw new Error(
      "Unable to compress image."
    );
  }

  const baseName =
    file.name
      .replace(
        /\.[^.]+$/,
        ""
      )
      .slice(
        0,
        80
      ) ||
    "agrinova-image";

  return new File(
    [
      bestBlob,
    ],

    `${baseName}.webp`,

    {
      type:
        "image/webp",

      lastModified:
        Date.now(),
    }
  );
}

function blobToDataUrl(
  blob: Blob
): Promise<string> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () => {
          if (
            typeof reader.result ===
            "string"
          ) {
            resolve(
              reader.result
            );

            return;
          }

          reject(
            new Error(
              "Unable to read local image."
            )
          );
        };

      reader.onerror =
        () => {
          reject(
            new Error(
              "Unable to read local image."
            )
          );
        };

      reader.readAsDataURL(
        blob
      );
    }
  );
}

function parseStoredImage(
  value:
    | string
    | null
): StoredLocalImage | null {
  if (!value) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(
        value
      ) as StoredLocalImage;

    if (
      !parsed ||
      typeof parsed.localKey !==
        "string" ||
      typeof parsed.dataUrl !==
        "string" ||
      typeof parsed.createdAt !==
        "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getAllFallbackKeys() {
  if (
    !hasBrowserStorage()
  ) {
    return [];
  }

  const result:
    string[] = [];

  for (
    let index = 0;
    index <
    window.localStorage
      .length;
    index += 1
  ) {
    const key =
      window.localStorage.key(
        index
      );

    if (
      key?.startsWith(
        LOCAL_STORAGE_PREFIX
      )
    ) {
      result.push(
        key
      );
    }
  }

  return result;
}

function deleteExpiredImages() {
  if (
    !hasBrowserStorage()
  ) {
    return;
  }

  const now =
    Date.now();

  for (
    const key of getAllFallbackKeys()
  ) {
    const image =
      parseStoredImage(
        window.localStorage.getItem(
          key
        )
      );

    if (
      !image ||
      now -
        image.createdAt >
        LOCAL_STORAGE_MAX_AGE
    ) {
      window.localStorage.removeItem(
        key
      );
    }
  }
}

function removeOldestFallback() {
  if (
    !hasBrowserStorage()
  ) {
    return false;
  }

  const images =
    getAllFallbackKeys()
      .map(
        (
          key
        ) => {
          const image =
            parseStoredImage(
              window.localStorage.getItem(
                key
              )
            );

          return {
            key,
            image,
          };
        }
      )
      .filter(
        (
          item
        ) =>
          Boolean(
            item.image
          )
      )
      .sort(
        (
          a,
          b
        ) =>
          (
            a.image
              ?.createdAt ||
            0
          ) -
          (
            b.image
              ?.createdAt ||
            0
          )
      );

  const oldest =
    images[0];

  if (!oldest) {
    return false;
  }

  window.localStorage.removeItem(
    oldest.key
  );

  return true;
}

async function saveLocalFallback(
  file: File,
  purpose: string
): Promise<StoredLocalImage> {
  if (
    !hasBrowserStorage()
  ) {
    throw new Error(
      "Remote upload failed and browser storage is unavailable."
    );
  }

  deleteExpiredImages();

  const compressed =
    await compressImage(
      file,
      {
        targetBytes:
          LOCAL_TARGET_BYTES,

        maxDimension:
          LOCAL_MAX_DIMENSION,
      }
    );

  const dataUrl =
    await blobToDataUrl(
      compressed
    );

  const localKey =
    storageKeyFor(
      purpose
    );

  const record: StoredLocalImage =
    {
      localKey,

      purpose:
        normalizePurpose(
          purpose
        ),

      name:
        compressed.name,

      type:
        compressed.type,

      size:
        compressed.size,

      dataUrl,

      createdAt:
        Date.now(),
    };

  const serialized =
    JSON.stringify(
      record
    );

  
  for (
    let attempt = 0;
    attempt < 5;
    attempt += 1
  ) {
    try {
      window.localStorage.setItem(
        localKey,
        serialized
      );

      return record;
    } catch {
      const removed =
        removeOldestFallback();

      if (!removed) {
        break;
      }
    }
  }

  throw new Error(
    "Remote upload failed and browser image storage is full."
  );
}

export async function uploadImageRemote(
  file: File,
  purpose: ImagePurpose
): Promise<string> {
  validateImageFile(
    file
  );

  const compressed =
    await compressImage(
      file,
      {
        targetBytes:
          REMOTE_TARGET_BYTES,

        maxDimension:
          REMOTE_MAX_DIMENSION,
      }
    );

  const body =
    new FormData();

  body.append(
    "image",
    compressed
  );

  body.append(
    "purpose",
    normalizePurpose(
      purpose
    )
  );

  const controller =
    new AbortController();

  const timeout =
    window.setTimeout(
      () => {
        controller.abort();
      },
      25_000
    );

  let response:
    Response;

  try {
    response =
      await fetch(
        "/api/upload",
        {
          method:
            "POST",

          body,

          credentials:
            "include",

          cache:
            "no-store",

          signal:
            controller.signal,
        }
      );
  } catch (error) {
    if (
      error instanceof
        DOMException &&
      error.name ===
        "AbortError"
    ) {
      throw new Error(
        "Image upload timed out."
      );
    }

    throw new Error(
      "Unable to reach the image upload service."
    );
  } finally {
    window.clearTimeout(
      timeout
    );
  }

  let result:
    | UploadApiResponse
    | null = null;

  try {
    result =
      (await response.json()) as UploadApiResponse;
  } catch {
    throw new Error(
      `Image service returned an invalid response (${response.status}).`
    );
  }

  if (
    !response.ok ||
    !result?.success ||
    !result.url
  ) {
    throw new Error(
      result?.message ||
        "Image storage service rejected the upload."
    );
  }

  return result.url;
}


export async function uploadImageWithFallback(
  file: File,
  options: {
    purpose: ImagePurpose;

    allowLocalFallback?: boolean;
  }
): Promise<ImageUploadResult> {
  validateImageFile(
    file
  );

  try {
    const url =
      await uploadImageRemote(
        file,
        options.purpose
      );

    return {
      source:
        "remote",

      url,

      previewUrl:
        url,
    };
  } catch (remoteError) {
    console.warn(
      "Remote image upload failed. Saving browser fallback:",
      remoteError
    );

    if (
      options.allowLocalFallback ===
      false
    ) {
      throw remoteError;
    }

    const stored =
      await saveLocalFallback(
        file,
        options.purpose
      );

    return {
      source:
        "local",

      url:
        stored.dataUrl,

      previewUrl:
        stored.dataUrl,

      localKey:
        stored.localKey,
    };
  }
}

export function getStoredLocalImage(
  localKey: string
): StoredLocalImage | null {
  if (
    !hasBrowserStorage()
  ) {
    return null;
  }

  return parseStoredImage(
    window.localStorage.getItem(
      localKey
    )
  );
}

export function listStoredLocalImages(
  purpose?: ImagePurpose
): StoredLocalImage[] {
  if (
    !hasBrowserStorage()
  ) {
    return [];
  }

  deleteExpiredImages();

  const normalizedPurpose =
    purpose
      ? normalizePurpose(
          purpose
        )
      : null;

  return getAllFallbackKeys()
    .map(
      (
        key
      ) =>
        parseStoredImage(
          window.localStorage.getItem(
            key
          )
        )
    )
    .filter(
      (
        image
      ): image is StoredLocalImage =>
        Boolean(
          image
        )
    )
    .filter(
      (
        image
      ) =>
        !normalizedPurpose ||
        image.purpose ===
          normalizedPurpose
    )
    .sort(
      (
        a,
        b
      ) =>
        a.createdAt -
        b.createdAt
    );
}

export function removeStoredLocalImage(
  localKey: string
) {
  if (
    !hasBrowserStorage()
  ) {
    return;
  }

  window.localStorage.removeItem(
    localKey
  );
}


export async function retryStoredImage(
  localKey: string
): Promise<string> {
  const stored =
    getStoredLocalImage(
      localKey
    );

  if (!stored) {
    throw new Error(
      "Local image is no longer available."
    );
  }

  const dataResponse =
    await fetch(
      stored.dataUrl
    );

  const blob =
    await dataResponse.blob();

  const file =
    new File(
      [
        blob,
      ],

      stored.name ||
        "agrinova-image.webp",

      {
        type:
          stored.type ||
          blob.type ||
          "image/webp",
      }
    );

  const url =
    await uploadImageRemote(
      file,
      stored.purpose
    );

  removeStoredLocalImage(
    localKey
  );

  return url;
}
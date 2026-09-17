import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/lib/auth";

export const runtime =
  "nodejs";

<<<<<<< HEAD
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const PUBLIC_PURPOSES = new Set([
  "expert-registration",
  "supply-chain",
  "community",
  "farm",
  "marketplace",
  "general",
]);
=======
export const dynamic =
  "force-dynamic";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const IMGBB_TIMEOUT_MS =
  20_000;

const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

const PUBLIC_PURPOSES =
  new Set([
    "expert-registration",
    "supply-chain",
  ]);
>>>>>>> rasel

type RateEntry = {
  count: number;

  resetAt: number;
};

const globalRateStore =
  globalThis as typeof globalThis & {
    agrinovaUploadRate?: Map<
      string,
      RateEntry
    >;
  };

const rateStore =
  globalRateStore
    .agrinovaUploadRate ??
  new Map<
    string,
    RateEntry
  >();

globalRateStore.agrinovaUploadRate =
  rateStore;

function getClientIp(
  request: NextRequest
) {
  const forwarded =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwarded) {
    return (
      forwarded
        .split(
          ","
        )[0]
        ?.trim() ||
      "unknown"
    );
  }

  return (
    request.headers.get(
      "x-real-ip"
    ) ||
    "unknown"
  );
}

function checkRateLimit(
  key: string,
  limit: number
) {
  const now =
    Date.now();

  const windowMs =
    10 *
    60 *
    1000;

  const current =
    rateStore.get(
      key
    );

  if (
    !current ||
    current.resetAt <=
      now
  ) {
    rateStore.set(
      key,
      {
        count: 1,

        resetAt:
          now +
          windowMs,
      }
    );

    return true;
  }

  if (
    current.count >=
    limit
  ) {
    return false;
  }

  current.count +=
    1;

  rateStore.set(
    key,
    current
  );

  return true;
}

function cleanPurpose(
  value: unknown
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]+/g,
      "-"
    )
    .slice(
      0,
      80
    );
}

export async function POST(
  request: NextRequest
) {
  try {
    const origin =
      request.headers.get(
        "origin"
      );

    if (origin) {
      try {
        const originUrl =
          new URL(
            origin
          );

        if (
          originUrl.host !==
          request.nextUrl.host
        ) {
          return NextResponse.json(
            {
              success:
                false,

              message:
                "Cross-site uploads are not allowed.",
            },

            {
              status:
                403,
            }
          );
        }
      } catch {
        return NextResponse.json(
          {
            success:
              false,

            message:
              "Invalid request origin.",
          },

          {
            status:
              403,
          }
        );
      }
    }

    const formData =
      await request.formData();

    const file =
      formData.get(
        "image"
      );

    const purpose =
      cleanPurpose(
        formData.get(
          "purpose"
        )
      );

    if (
      !(
        file instanceof
        File
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "No image file provided.",
        },

        {
          status:
            400,
        }
      );
    }


    let session:
      | Awaited<
          ReturnType<
            typeof auth.api.getSession
          >
        >
      | null = null;

    try {
      session =
        await auth.api.getSession(
          {
            headers:
              request.headers,
          }
        );
    } catch (error) {
      if (
        !PUBLIC_PURPOSES.has(
          purpose
        )
      ) {
        console.error(
          "Unable to verify upload session:",
          error
        );

        return NextResponse.json(
          {
            success:
              false,

            message:
              "Unable to verify authentication.",
          },

          {
            status:
              503,
          }
        );
      }
    }

    const isAuthenticated =
      Boolean(
        session?.user
          ?.id
      );

    const isPublicPurpose =
      PUBLIC_PURPOSES.has(
        purpose
      );

    if (
      !isAuthenticated &&
      !isPublicPurpose
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Authentication required to upload images.",
        },

        {
          status:
            401,
        }
      );
    }

    const rateKey =
      isAuthenticated
        ? `user:${session!.user.id}`
        : `public:${getClientIp(
            request
          )}:${purpose}`;

    if (
      !checkRateLimit(
        rateKey,

        isAuthenticated
          ? 40
          : 6
      )
    ) {
      return NextResponse.json(
        {
<<<<<<< HEAD
          success: false,
          message: "Image must be 8 MB or smaller.",
=======
          success:
            false,

          message:
            "Too many image uploads. Please wait before trying again.",
>>>>>>> rasel
        },

        {
          status:
            429,
        }
      );
    }

<<<<<<< HEAD
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const apiKey =
      process.env.IMGBB_API_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (apiKey) {
      try {
        const base64 = buffer.toString("base64");

        const body = new URLSearchParams();
        body.set("image", base64);
        body.set(
          "name",
          `agrinova-${Date.now()}-${crypto
            .randomBytes(4)
            .toString("hex")}`
        );

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
            apiKey
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
            body: body.toString(),
            cache: "no-store",
          }
        );

        const result = await response.json().catch(() => null);
        const url =
          result?.data?.display_url ||
          result?.data?.url;

        if (response.ok && url) {
          return NextResponse.json({
            success: true,
            url: String(url),
          });
=======
   
    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Only JPG, PNG and WEBP images are allowed.",
        },

        {
          status:
            400,
        }
      );
    }

    if (
      file.size <=
      0
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "The image file is empty.",
        },

        {
          status:
            400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Processed image must be 5 MB or smaller.",
        },

        {
          status:
            413,
        }
      );
    }

  
    const apiKey =
      process.env
        .IMGBB_API_KEY;

    if (!apiKey) {
      console.error(
        "IMGBB_API_KEY is missing."
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Image upload service is temporarily unavailable.",
        },

        {
          status:
            503,
>>>>>>> rasel
        }

<<<<<<< HEAD
        console.warn("ImgBB upload failed, falling back to local storage:", result);
      } catch (imgbbError) {
        console.warn("ImgBB request error, falling back to local storage:", imgbbError);
      }
    }

    // Local storage fallback (for non-serverless environments with writable disk)
    if (!process.env.VERCEL) {
      try {
        const originalExt =
          typeof file.name === "string"
            ? path.extname(file.name).toLowerCase()
            : "";
        const allowed = [".jpg", ".jpeg", ".png", ".webp"];
        const extension = allowed.includes(originalExt)
          ? originalExt
          : file.type === "image/webp"
            ? ".webp"
            : file.type === "image/png"
              ? ".png"
              : ".jpg";

        const uploadDirectory = path.join(
          process.cwd(),
          "public",
          "uploads"
        );

        await mkdir(uploadDirectory, {
          recursive: true,
        });

        const fileName = `agrinova-${Date.now()}-${crypto
          .randomBytes(5)
          .toString("hex")}${extension}`;

        await writeFile(
          path.join(uploadDirectory, fileName),
          buffer
        );

        return NextResponse.json({
          success: true,
          url: `/uploads/${fileName}`,
        });
      } catch (storageError) {
        console.warn(
          "Filesystem write failed, falling back to data URL:",
          storageError
        );
      }
    }

    // Universal fallback: Base64 Data URL (always works on Vercel / read-only serverless environments)
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
    });
=======
    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const base64 =
      buffer.toString(
        "base64"
      );

    const body =
      new URLSearchParams();

    body.set(
      "image",
      base64
    );

    const safePurpose =
      purpose ||
      "image";

    body.set(
      "name",

      `agrinova-${safePurpose}-${Date.now()}-${crypto
        .randomBytes(
          4
        )
        .toString(
          "hex"
        )}`
    );

   
    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => {
          controller.abort();
        },

        IMGBB_TIMEOUT_MS
      );

    let response:
      Response;

    try {
      response =
        await fetch(
          `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
            apiKey
          )}`,

          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },

            body:
              body.toString(),

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
        console.error(
          "ImgBB upload timed out."
        );

        return NextResponse.json(
          {
            success:
              false,

            message:
              "Image storage service timed out.",
          },

          {
            status:
              504,
          }
        );
      }

      console.error(
        "ImgBB network error:",
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Unable to reach image storage service.",
        },

        {
          status:
            502,
        }
      );
    } finally {
      clearTimeout(
        timeout
      );
    }

   
    const result =
      await response
        .json()
        .catch(
          () =>
            null
        );

    const url =
      result?.data
        ?.display_url ||
      result?.data
        ?.url;

    if (
      !response.ok ||
      !url
    ) {
      console.error(
        "ImgBB upload rejected:",
        {
          status:
            response.status,

          purpose,

          fileType:
            file.type,

          fileSize:
            file.size,

          error:
            result?.error
              ?.message ||
            result?.error ||
            null,
        }
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Image storage service rejected the upload.",
        },

        {
          status:
            502,
        }
      );
    }

   
    return NextResponse.json(
      {
        success:
          true,

        url:
          String(
            url
          ),

        provider:
          "imgbb",
      },

      {
        status:
          200,
      }
    );
>>>>>>> rasel
  } catch (error) {
    console.error(
      "Upload route error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          "Image upload failed.",
      },

      {
        status:
          500,
      }
    );
  }
}
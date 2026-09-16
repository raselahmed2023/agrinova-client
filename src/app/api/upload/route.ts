import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

export const runtime = "nodejs";

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

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalRateStore = globalThis as typeof globalThis & {
  agrinovaUploadRate?: Map<string, RateEntry>;
};

const rateStore =
  globalRateStore.agrinovaUploadRate ??
  new Map<string, RateEntry>();

globalRateStore.agrinovaUploadRate = rateStore;

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string, limit: number) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;

  const current = rateStore.get(key);

  if (!current || current.resetAt <= now) {
    rateStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  rateStore.set(key, current);

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin) {
      try {
        const originUrl = new URL(origin);

        if (originUrl.host !== request.nextUrl.host) {
          return NextResponse.json(
            {
              success: false,
              message: "Cross-site uploads are not allowed.",
            },
            {
              status: 403,
            }
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid request origin.",
          },
          {
            status: 403,
          }
        );
      }
    }

    const formData = await request.formData();

    const file = formData.get("image");

    const purpose = String(
      formData.get("purpose") || ""
    )
      .trim()
      .toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file provided.",
        },
        {
          status: 400,
        }
      );
    }

    let session: Awaited<
      ReturnType<typeof auth.api.getSession>
    > | null = null;

    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (error) {
      if (!PUBLIC_PURPOSES.has(purpose)) {
        console.error("Unable to verify upload session:", error);

        return NextResponse.json(
          {
            success: false,
            message: "Unable to verify authentication.",
          },
          {
            status: 503,
          }
        );
      }
    }

    const isAuthenticated = Boolean(session?.user?.id);
    const isPublicPurpose = PUBLIC_PURPOSES.has(purpose);

    if (!isAuthenticated && !isPublicPurpose) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required to upload images.",
        },
        {
          status: 401,
        }
      );
    }

    const rateKey = isAuthenticated
      ? `user:${session!.user.id}`
      : `public:${getClientIp(request)}:${purpose}`;

    if (
      !checkRateLimit(
        rateKey,
        isAuthenticated ? 30 : 5
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many uploads. Please wait before trying again.",
        },
        {
          status: 429,
        }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WEBP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be 8 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

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
        }

        console.warn("ImgBB upload failed, falling back to local storage:", result);
      } catch (imgbbError) {
        console.warn("ImgBB request error, falling back to local storage:", imgbbError);
      }
    }

    // Local storage fallback using the already-read buffer
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
      console.error("Local storage upload fallback failed:", storageError);

      return NextResponse.json(
        {
          success: false,
          message:
            storageError instanceof Error
              ? storageError.message
              : "Failed to store image.",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}
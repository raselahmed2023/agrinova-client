import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  mkdir,
  writeFile,
} from "fs/promises";

import path from "path";

import crypto from "crypto";

export const runtime =
  "nodejs";

export async function POST(
  req: NextRequest
) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get(
        "image"
      );

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "No image file provided",
        },

        {
          status:
            400,
        }
      );
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Only image files are allowed",
        },

        {
          status:
            400,
        }
      );
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Image must be 8 MB or smaller",
        },

        {
          status:
            400,
        }
      );
    }

    /*
      Server-only key.
      DO NOT use NEXT_PUBLIC_IMGBB_API_KEY.
    */
    const apiKey =
      process.env
        .IMGBB_API_KEY;

    /* ==========================================================
       TRY IMGBB
    ========================================================== */

    if (apiKey) {
      try {
        const bytes =
          await file.arrayBuffer();

        const base64 =
          Buffer.from(
            bytes
          ).toString(
            "base64"
          );

        const body =
          new URLSearchParams();

        body.set(
          "image",
          base64
        );

        body.set(
          "name",
          `agrinova-${Date.now()}`
        );

        const response =
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
            }
          );

        if (
          response.ok
        ) {
          const data =
            await response.json();

          const url =
            data?.data
              ?.display_url ||
            data?.data?.url;

          if (url) {
            return NextResponse.json(
              {
                success:
                  true,

                url,
              }
            );
          }
        }
      } catch (
        error
      ) {
        console.warn(
          "ImgBB upload failed. Using local fallback.",
          error
        );
      }
    }

    /* ==========================================================
       LOCAL FALLBACK
    ========================================================== */

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(
        bytes
      );

    const originalExt =
      path
        .extname(
          file.name
        )
        .toLowerCase();

    const allowed = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const extension =
      allowed.includes(
        originalExt
      )
        ? originalExt
        : file.type ===
            "image/webp"
          ? ".webp"
          : file.type ===
              "image/png"
            ? ".png"
            : ".jpg";

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    await mkdir(
      uploadDirectory,

      {
        recursive:
          true,
      }
    );

    const fileName =
      `agrinova-${Date.now()}-${crypto
        .randomBytes(5)
        .toString(
          "hex"
        )}${extension}`;

    await writeFile(
      path.join(
        uploadDirectory,
        fileName
      ),

      buffer
    );

    return NextResponse.json({
      success: true,

      url:
        `/uploads/${fileName}`,
    });
  } catch (
    error
  ) {
    console.error(
      "Upload error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Image upload failed",
      },

      {
        status:
          500,
      }
    );
  }
}
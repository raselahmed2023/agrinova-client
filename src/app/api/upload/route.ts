import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    // First, try ImgBB if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (apiKey) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append("image", file);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imgbbForm,
          }
        );

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          if (imgbbData?.success && imgbbData?.data?.url) {
            return NextResponse.json({
              success: true,
              url: imgbbData.data.url,
            });
          }
        }
      } catch {
        // Fallback to local storage if ImgBB fails
      }
    }

    // Local file storage fallback in public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(
      ext.toLowerCase()
    )
      ? ext.toLowerCase()
      : ".png";

    const fileName = `expert-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${safeExt}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}

// // video upload route

// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
// });

// interface VideoUploadResult {
//   public_id: string;
//   bytes: number;
//   [key: string]: any;
//   duration?: number;
// }
// export async function POST(request: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     if (
//       !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
//       !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
//       !process.env.CLOUDINARY_API_SECRET
//     ) {
//       return NextResponse.json(
//         { error: "Cloudinary configuration missing" },
//         { status: 500 }
//       );
//     }

//     const data = await request.formData();
//     const file = data.get("file") as File | null;
//     if (!file) {
//       return NextResponse.json({ error: "File not found" }, { status: 400 });
//     }
//     const title = data.get("title") as string | null;
//     const description = data.get("description") as string | null;
//     const originalSize = data.get("originalSize") as string | null;

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const result = await new Promise<VideoUploadResult>((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           folder: "video-uploads",
//           transformation: [{ quality: "auto", fetch_format: "mp4" }],
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result as VideoUploadResult);
//         }
//       );
//       uploadStream.end(buffer);
//     });

//     const video = await prisma.video.create({
//       data: {
//         title: title || "Untitled",
//         description,
//         publicId: result.public_id,
//         originalSize: originalSize || String(result.bytes),
//         compressedSize: String(result.bytes),
//         url: result.secure_url || result.url || "",
//         duration: result.duration || 0,
//       },
//     });
//     return NextResponse.json(video);
//   } catch (error) {
//     console.log("Upload video failed", error);
//     return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// Force Node.js runtime (not Edge)
export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface VideoUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  secure_url?: string;
  url?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Check required ENV vars
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      );
    }

    // ✅ Read formData
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const title = form.get("title") as string | null;
    const description = form.get("description") as string | null;
    const originalSize = form.get("originalSize") as string | null;

    // ✅ Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary using upload_stream
    const result = await new Promise<VideoUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video-uploads",
          transformation: [{ quality: "auto", fetch_format: "mp4" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as VideoUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    // ✅ Save to Prisma DB
    const video = await prisma.video.create({
      data: {
        title: title || "Untitled",
        description,
        publicId: result.public_id,
        originalSize: originalSize || String(result.bytes),
        compressedSize: String(result.bytes),
        url: result.secure_url || result.url || "",
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(video, { status: 200 });
  } catch (error: any) {
    console.error("Upload video failed:", error);
    return NextResponse.json(
      { error: error.message || "Upload video failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

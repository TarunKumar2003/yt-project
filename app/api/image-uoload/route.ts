// We write the code in this file to handle the image upload functionality. to cloudnary
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface ImageUploadResponse {
  public_id: string;
  [key: string]: any;
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

export async function POST(request: NextRequest) {
  // check the user logged in or not
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    // convert this file into array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // upload this file to cloudinary
    // Create a promise
    const result = await new Promise<ImageUploadResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as ImageUploadResponse);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(
      {
        public_id: result.public_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Upload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}

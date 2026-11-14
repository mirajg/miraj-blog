
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
]);

export async function POST(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json(
            { error: "Unauthorized." },
            { status: 401 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No image file was provided." },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                {
                    error:
                        "Unsupported image type. Use JPG, PNG, WebP, or AVIF.",
                },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Image must be smaller than 5 MB." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise<{
            secure_url: string;
            public_id: string;
        }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "miraj-blog/covers",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error ?? new Error("Cloudinary upload failed."));
                        return;
                    }

                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            );

            uploadStream.end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        return NextResponse.json(
            { error: "Could not upload image." },
            { status: 500 }
        );
    }
}
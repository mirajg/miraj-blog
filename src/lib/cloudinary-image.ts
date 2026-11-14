
import cloudinary from "@/lib/cloudinary";

export async function deleteCloudinaryImage(
    publicId: string
) {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
    });
}
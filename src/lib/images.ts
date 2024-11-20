
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
interface CloudinaryUploadResults {
  public_id: string;
  [key: string]: any;
}

import { v2 as cloudinary } from 'cloudinary';

export async function deleteImage(imageUrl: string) {
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  const regex = /\/v\d+\/([^/]+)\.\w+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function handleImageUpload(file: File):Promise<string>{
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: "next-cloudinary-images", 
        timestamp: Math.floor(Date.now() / 1000) 
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(buffer);
  });
}
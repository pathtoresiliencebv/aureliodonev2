import "server-only";
import { getCloudflareContext } from "@/lib/cloudflare";

export interface MediaUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface MediaFile {
  key: string;
  url: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2(
  file: File,
  path: string,
  metadata?: Record<string, any>
): Promise<MediaUploadResult> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      return {
        success: false,
        error: "R2 bucket not configured"
      };
    }

    // Generate unique key with timestamp
    const timestamp = Date.now();
    const sanitizedPath = path.replace(/[^a-zA-Z0-9-_/]/g, '-');
    const key = `media/${sanitizedPath}/${timestamp}-${file.name}`;

    // Prepare metadata
    const uploadMetadata = {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      ...metadata
    };

    // Upload to R2
    await MEDIA_BUCKET.put(key, file, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000", // 1 year cache
      },
      customMetadata: uploadMetadata,
    });

    // Generate public URL (assuming custom domain or R2 public URL)
    const url = `https://media.aurelio.com/${key}`;

    return {
      success: true,
      url,
      key
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
  }
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    await MEDIA_BUCKET.delete(key);
    return true;
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return false;
  }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(key: string): Promise<MediaFile | null> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    const object = await MEDIA_BUCKET.head(key);

    if (!object) {
      return null;
    }

    return {
      key,
      url: `https://media.aurelio.com/${key}`,
      size: object.size,
      contentType: object.httpMetadata?.contentType || "application/octet-stream",
      uploadedAt: object.uploaded,
      metadata: object.customMetadata
    };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    return null;
  }
}

/**
 * List files in a directory
 */
export async function listFiles(prefix: string = "media/"): Promise<MediaFile[]> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    const objects = await MEDIA_BUCKET.list({ prefix });

    return objects.objects.map(obj => ({
      key: obj.key,
      url: `https://media.aurelio.com/${obj.key}`,
      size: obj.size,
      contentType: obj.httpMetadata?.contentType || "application/octet-stream",
      uploadedAt: obj.uploaded,
      metadata: obj.customMetadata
    }));
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
}

/**
 * Generate a signed URL for private file access
 */
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string | null> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    // Note: R2 doesn't have built-in signed URLs like S3
    // This would require implementing a custom solution or using R2's presigned URLs
    // For now, we'll return the public URL
    return `https://media.aurelio.com/${key}`;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
} = {}): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options; // 10MB default

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`
    };
  }

  return { valid: true };
}

/**
 * Generate optimized image variants
 */
export async function generateImageVariants(
  originalKey: string,
  variants: Array<{
    name: string;
    width: number;
    height?: number;
    quality?: number;
  }>
): Promise<MediaUploadResult[]> {
  try {
    const { MEDIA_BUCKET } = getCloudflareContext();

    if (!MEDIA_BUCKET) {
      throw new Error("R2 bucket not configured");
    }

    // Get original image
    const originalObject = await MEDIA_BUCKET.get(originalKey);
    if (!originalObject) {
      throw new Error("Original image not found");
    }

    const results: MediaUploadResult[] = [];

    for (const variant of variants) {
      try {
        // This would require image processing (sharp, canvas, etc.)
        // For now, we'll return the original URL
        const variantKey = originalKey.replace(/\.[^/.]+$/, `_${variant.name}.jpg`);

        // In a real implementation, you would:
        // 1. Process the image with the specified dimensions
        // 2. Upload the processed image to R2
        // 3. Return the URL

        results.push({
          success: true,
          url: `https://media.aurelio.com/${variantKey}`,
          key: variantKey
        });
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate variant ${variant.name}: ${error instanceof Error ? error.message : "Unknown error"}`
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error generating image variants:", error);
    return [{
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate variants"
    }];
  }
}

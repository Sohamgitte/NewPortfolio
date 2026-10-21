import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadOptions {
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
];

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates a file before upload
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = DEFAULT_ALLOWED_TYPES,
  maxSizeBytes: number = DEFAULT_MAX_SIZE
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type || 'unknown'}). Allowed formats: JPG, PNG, WEBP, SVG, PDF`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${maxMb}MB`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a file to Supabase Storage bucket 'portfolio-assets'
 * Supports mobile browser file picker, progress tracking, and fallback simulation
 */
export async function uploadAsset(
  file: File,
  options: UploadOptions = {}
): Promise<{ url: string; path: string; error?: string }> {
  const {
    folder = 'uploads',
    maxSizeBytes = DEFAULT_MAX_SIZE,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    onProgress,
  } = options;

  // 1. Client-side security validation
  const validation = validateFile(file, allowedTypes, maxSizeBytes);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Fallback simulation when Supabase is not yet configured with credentials
  if (!isSupabaseConfigured) {
    onProgress?.(25);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onProgress?.(75);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onProgress?.(100);

    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      path: `local-demo/${file.name}`,
    };
  }

  // 3. Clean and sanitize filename to prevent path traversal
  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .slice(0, 80);
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const uniquePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  onProgress?.(20);

  // 4. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('portfolio-assets')
    .upload(uniquePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  onProgress?.(80);

  // 5. Retrieve public URL
  const { data: urlData } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(data.path);

  onProgress?.(100);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

/**
 * Removes an asset from Supabase Storage
 */
export async function deleteAsset(path: string): Promise<boolean> {
  if (!isSupabaseConfigured || path.startsWith('local-demo/')) {
    return true;
  }

  try {
    const { error } = await supabase.storage.from('portfolio-assets').remove([path]);
    return !error;
  } catch {
    return false;
  }
}

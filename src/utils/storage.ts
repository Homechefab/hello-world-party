import { supabase } from '@/integrations/supabase/client';

/**
 * Get a signed URL for a document in the private 'documents' bucket.
 * Returns the signed URL or null if an error occurs.
 */
export async function getDocumentSignedUrl(documentPath: string): Promise<string | null> {
  // If it's already a full URL (legacy), return as-is
  if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
    return documentPath;
  }

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(documentPath, 3600); // 1 hour expiry

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Check if a document path points to an image file.
 */
export function isImageDocument(documentPath: string): boolean {
  const lower = documentPath.toLowerCase();
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
}

export interface UserVerification {
  id: string;
  user_id: string;
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
  business_verified: boolean;
  two_factor_enabled: boolean;
  identity_document_url: string | null;
  business_id: string | null;
  business_documents: string[] | null;
  created_at: string;
  updated_at: string;
}
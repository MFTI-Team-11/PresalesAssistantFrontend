export type RegisterRequest = {
  email: string;
  full_name: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  fingerprint: string;
  session_source?: string;
  device_type?: string;
  os_name?: string;
  os_version?: string;
  browser_name?: string;
  browser_version?: string;
  metadata?: Record<string, unknown>;
};

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string | null;
};

export type Role = {
  id: string;
  code: string;
  title: string;
  weight: number;
};

export type RoleCreate = {
  code: string;
  title: string;
  weight: number;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: Role[];
};

export type Session = {
  id: string;
  user_id: string;
  token_jti: string;
  ip_address: string | null;
  fingerprint: string | null;
  user_agent: string | null;
  session_source: string | null;
  device_type: string | null;
  os_name: string | null;
  os_version: string | null;
  browser_name: string | null;
  browser_version: string | null;
  session_metadata: Record<string, unknown>;
  expires_at: string;
  refresh_expires_at: string;
  revoked_at: string | null;
  created_at: string;
};

export type LoginType = 'phone' | 'email';

export interface LoginPayload {
  type: LoginType;
  email?: string;
  phoneNumber?: string;
  otp?: string;
}

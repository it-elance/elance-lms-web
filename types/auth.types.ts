export type SendOtpPayload =
  | { type: 'phone'; phoneNumber: string }
  | { type: 'email'; email: string };

export type VerifyOtpPayload =
  | { type: 'phone'; phoneNumber: string; otp: string }
  | { type: 'email'; email: string; otp: string };

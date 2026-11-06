export type SendOtpPayload =
  | { type: 'phone'; phoneNumber: string }
  | { type: 'email'; email: string };

export type VerifyOtpPayload =
  | { type: 'phone'; phoneNumber: string; otp: string }
  | { type: 'email'; email: string; otp: string };

export type SessionTokens = { token: string; refreshToken: string };

// A contact the student signs in with
export type ContactChannel = 'email' | 'phone';

// Whether the student must still verify a contact before using the app. Only
// a student's first login starts the check: the code they logged in with
// verifies that contact, and they verify the other one here.
export type ContactVerification = {
  complete: boolean;
  pending: ContactChannel[];
  email: { value: string; verified: boolean };
  phone: { value: string; verified: boolean };
};

export type LoginResponse = SessionTokens & {
  // Absent from a backend older than the check
  verification?: ContactVerification;
};

export type VerifyContactPayload = { type: ContactChannel; otp: string };

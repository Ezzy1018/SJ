interface PendingUser {
  id: string;
  phone: string;
  name: string;
  otp: string;
  otpCreatedAt: number;
  otpExpiresAt: number;
  otpUsed: boolean;
}

interface AttemptWindow {
  startedAt: number;
  attempts: number;
}

const pendingUsers = new Map<string, PendingUser>();
const otpAttemptsByPhone = new Map<string, AttemptWindow>();

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 5;

const generateOtp = (): string => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return String(random);
};

const getAttemptWindow = (phone: string): AttemptWindow => {
  const now = Date.now();
  const existing = otpAttemptsByPhone.get(phone);

  if (!existing || now - existing.startedAt > ATTEMPT_WINDOW_MS) {
    const fresh = { startedAt: now, attempts: 0 };
    otpAttemptsByPhone.set(phone, fresh);
    return fresh;
  }

  return existing;
};

const assertAttemptAllowed = (phone: string): void => {
  const window = getAttemptWindow(phone);
  if (window.attempts >= MAX_ATTEMPTS_PER_WINDOW) {
    throw new Error("OTP_RATE_LIMITED");
  }
};

const incrementAttempts = (phone: string): void => {
  const window = getAttemptWindow(phone);
  window.attempts += 1;
  otpAttemptsByPhone.set(phone, window);
};

const clearAttempts = (phone: string): void => {
  otpAttemptsByPhone.delete(phone);
};

export const registerUser = (
  phone: string,
  name: string,
): { requestId: string; status: string } => {
  const requestId = `req_${Math.random().toString(36).slice(2, 10)}`;
  const now = Date.now();

  pendingUsers.set(requestId, {
    id: requestId,
    phone,
    name,
    otp: generateOtp(),
    otpCreatedAt: now,
    otpExpiresAt: now + OTP_EXPIRY_MS,
    otpUsed: false,
  });

  return { requestId, status: "OTP_SENT" };
};

export const getPendingPhoneByUserId = (
  requestId: string,
): string | undefined => {
  return pendingUsers.get(requestId)?.phone;
};

export const verifyOtp = (
  requestId: string,
  otp: string,
): { verified: true; user: Pick<PendingUser, "id" | "phone" | "name"> } => {
  const user = pendingUsers.get(requestId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  assertAttemptAllowed(user.phone);

  if (user.otpUsed) {
    throw new Error("OTP_ALREADY_USED");
  }

  if (Date.now() > user.otpExpiresAt) {
    throw new Error("OTP_EXPIRED");
  }

  if (otp !== user.otp) {
    incrementAttempts(user.phone);
    throw new Error("INVALID_OTP");
  }

  user.otpUsed = true;
  pendingUsers.set(requestId, user);
  clearAttempts(user.phone);

  return {
    verified: true,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
    },
  };
};

export const deletePendingUser = (requestId: string): boolean => {
  return pendingUsers.delete(requestId);
};

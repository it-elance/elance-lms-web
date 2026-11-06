'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import toast from 'react-hot-toast';
import { logoutApi } from '@/services/api.service';
import { useContactVerification } from '@/hooks/useContactVerification';
import type { ContactChannel, ContactVerification } from '@/types/auth.types';

// Contact verification at signup. After their first login a student verifies
// the contact they didn't log in with, by a 4-digit code, before using the
// app. Shown over the app until it's done: it can't be closed, only left by
// logging out.

const CODE_LENGTH = 4;
// The server sends a new code no sooner than this
const RESEND_SECONDS = 30;

const CONTACT = {
  email: {
    title: 'Verify your email address',
    label: 'Email address',
    icon: '/mail.svg',
    sendLine: "We'll email a 4-digit code to",
    sentLine: 'Enter the code we emailed to',
    wrong: 'Not your email address?',
  },
  phone: {
    title: 'Verify your mobile number',
    label: 'Mobile number',
    icon: '/phone.svg',
    sendLine: "We'll text a 4-digit code to",
    sentLine: 'Enter the code we texted to',
    wrong: 'Not your mobile number?',
  },
} as const;

// The API client rejects with the backend body; a network failure with the
// AxiosError itself, whose message isn't for students
const errorMessage = (error: unknown, fallback: string): string => {
  const body = error as { message?: string; isAxiosError?: boolean } | null;
  if (!body || body.isAxiosError) return fallback;
  return body.message ?? fallback;
};

// +91 99614 72529 rather than +919961472529
const displayContact = (
  verification: ContactVerification,
  channel: ContactChannel
) =>
  channel === 'phone'
    ? (parsePhoneNumberFromString(
        verification.phone.value
      )?.formatInternational() ?? verification.phone.value)
    : verification.email.value;

const ContactVerificationModal = () => {
  const { verification, sendCode, verifyCode } = useContactVerification(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const isOpen = Boolean(verification && !verification.complete);

  // The page behind can't scroll while the step is shown
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !verification) return null;

  const channel = verification.pending[0];

  return createPortal(
    <AnimatePresence>
      {isOpen && channel && (
        <VerificationStep
          key={channel}
          channel={channel}
          verification={verification}
          sendCode={sendCode}
          verifyCode={verifyCode}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ContactVerificationModal;

interface StepProps {
  channel: ContactChannel;
  verification: ContactVerification;
  sendCode: ReturnType<typeof useContactVerification>['sendCode'];
  verifyCode: ReturnType<typeof useContactVerification>['verifyCode'];
}

// One contact's verification: send a code, then enter it
const VerificationStep = ({
  channel,
  verification,
  sendCode,
  verifyCode,
}: StepProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDivElement>(null);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const contact = CONTACT[channel];
  const value = displayContact(verification, channel);

  // The steps: the contacts verified already, then those still to verify
  const channels: ContactChannel[] = ['email', 'phone'];
  const steps = channels.filter(
    (item) => verification[item].verified || verification.pending.includes(item)
  );
  const stepNumber =
    steps.filter((item) => verification[item].verified).length + 1;

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Focus starts in the dialog and stays there: Tab cycles through its controls
  useEffect(() => {
    dialogRef.current?.focus();

    const keepFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', keepFocus);
    return () => document.removeEventListener('keydown', keepFocus);
  }, []);

  const handleSend = () => {
    setError('');
    sendCode.mutate(channel, {
      onSuccess: () => {
        setIsCodeSent(true);
        setCode(Array(CODE_LENGTH).fill(''));
        setSeconds(RESEND_SECONDS);
        toast.success(
          channel === 'email' ? 'Code sent to your email' : 'Code sent by SMS'
        );
        setTimeout(() => codeRefs.current[0]?.focus(), 50);
      },
      onError: (err) =>
        setError(
          errorMessage(err, "We couldn't send the code. Please try again.")
        ),
    });
  };

  const handleVerify = (digits: string[] = code) => {
    const otp = digits.join('');
    if (otp.length < CODE_LENGTH) {
      setError('Enter the 4-digit code.');
      return;
    }
    setError('');
    verifyCode.mutate(
      { type: channel, otp },
      {
        onSuccess: (next) => {
          if (next.complete)
            toast.success("You're all set. Welcome to Elance Learning!");
          else toast.success(`${contact.label} verified`);
        },
        onError: (err) => {
          setError(
            errorMessage(err, "We couldn't check the code. Please try again.")
          );
          setCode(Array(CODE_LENGTH).fill(''));
          codeRefs.current[0]?.focus();
        },
      }
    );
  };

  // Digits only. A full code, typed or pasted, is checked at once.
  const fillCode = (index: number, text: string) => {
    const digits = text.replace(/\D/g, '');
    if (!digits && text) return;

    const next = [...code];
    if (digits.length > 1) {
      digits
        .slice(0, CODE_LENGTH - index)
        .split('')
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
    } else {
      next[index] = digits;
    }
    setCode(next);
    setError('');

    const nextEmpty = next.findIndex((digit) => !digit);
    if (nextEmpty === -1) {
      codeRefs.current[CODE_LENGTH - 1]?.blur();
      handleVerify(next);
    } else if (digits) {
      codeRefs.current[
        Math.min(index + digits.length, CODE_LENGTH - 1)
      ]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') handleVerify();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutApi();
    localStorage.clear();
    queryClient.clear();
    router.replace('/login');
  };

  const isBusy = sendCode.isPending || verifyCode.isPending || isLoggingOut;

  return (
    <div className="fixed inset-0 z-99999 w-screen h-screen flex items-center justify-center p-4">
      {/* Backdrop: clicking it does nothing, the step can't be skipped */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full bg-black/60"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
        aria-describedby="verify-description"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-100 max-h-full overflow-y-auto bg-(--color-bg-secondary) rounded-2xl p-6 shadow-xl outline-none"
      >
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary-100)">
          <MaskIcon
            src={contact.icon}
            className="h-7 w-7 bg-(--color-primary-600)"
          />
        </div>

        {steps.length > 1 && (
          <p className="Caption-Small text-center text-(--color-text-tertiary) mb-1">
            Step {stepNumber} of {steps.length}
          </p>
        )}

        <h2
          id="verify-title"
          className="Heading-4 text-center text-(--color-text-primary) mb-2"
        >
          {contact.title}
        </h2>

        <p
          id="verify-description"
          className="Body-Small text-center text-(--color-text-secondary) mb-5"
        >
          One more step to finish setting up your account.{' '}
          {isCodeSent ? contact.sentLine : contact.sendLine}{' '}
          <span className="font-semibold text-(--color-text-primary) break-all">
            {value}
          </span>
        </p>

        {/* Progress: what's verified, what's left */}
        {steps.length > 1 && (
          <ol
            className="mb-5 flex flex-wrap justify-center gap-2"
            aria-label="Verification progress"
          >
            {steps.map((item) => {
              const isDone = verification[item].verified;
              const isCurrent = item === channel;
              return (
                <li
                  key={item}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 Caption-Small ${
                    isDone
                      ? 'bg-(--color-success-100) text-(--color-success-600)'
                      : isCurrent
                        ? 'bg-(--color-primary-100) text-(--color-primary-600)'
                        : 'bg-(--color-bg-tertiary) text-(--color-text-secondary)'
                  }`}
                >
                  {isDone && (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {CONTACT[item].label}
                  <span className="sr-only">
                    {isDone ? ', verified' : ', to verify'}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {isCodeSent ? (
          <div className="space-y-3">
            <label
              className="Caption-Small text-(--color-text-primary)"
              htmlFor="verify-code-0"
            >
              4-digit code
            </label>
            <div className="flex justify-between gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`verify-code-${index}`}
                  ref={(el) => {
                    codeRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                  aria-invalid={Boolean(error)}
                  maxLength={index === 0 ? CODE_LENGTH : 1}
                  value={digit}
                  disabled={verifyCode.isPending}
                  onChange={(e) => fillCode(index, e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    fillCode(index, e.clipboardData.getData('text'));
                  }}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className={`h-14 w-14 rounded-full border bg-(--color-bg-primary) text-center Heading-1 text-(--color-text-primary) outline-none focus:border-(--color-primary-500) ${
                    error
                      ? 'border-(--color-error-500)'
                      : 'border-(--color-border-medium)'
                  }`}
                />
              ))}
            </div>

            {error && (
              <p role="alert" className="Body-Small text-(--color-error-600)">
                {error}
              </p>
            )}

            <p className="Button-Small">
              {seconds > 0 ? (
                <span className="text-(--color-text-disabled)">
                  Resend code in 00:{String(seconds).padStart(2, '0')}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isBusy}
                  className="text-(--color-primary-500) cursor-pointer disabled:opacity-50"
                >
                  {sendCode.isPending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </p>

            <button
              type="button"
              onClick={() => handleVerify()}
              disabled={isBusy}
              className={`w-full flex items-center justify-center Button-Primary rounded-xl bg-(--color-primary-500) py-3 text-white ${isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {verifyCode.isPending ? <Spinner /> : 'Verify'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <p role="alert" className="Body-Small text-(--color-error-600)">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleSend}
              disabled={isBusy}
              className={`w-full flex items-center justify-center Button-Primary rounded-xl bg-(--color-primary-500) py-3 text-white ${isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {sendCode.isPending ? <Spinner /> : 'Send code'}
            </button>
          </div>
        )}

        {/* The contact is as the institute entered it: only they can correct it */}
        <p className="Body-Small text-(--color-text-secondary) mt-5 rounded-xl bg-(--color-bg-tertiary) p-3">
          {contact.wrong} Contact Elance Learning support to correct it, then
          come back and send a new code.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 w-full Button-Small text-(--color-text-secondary) underline underline-offset-2 cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </motion.div>
    </div>
  );
};

const Spinner = () => (
  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// A one-colour icon from an SVG file, coloured by its background
const MaskIcon = ({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);

'use client';

import Rive from '@rive-app/react-canvas';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Step = 'SPLASH' | 'MOBILE' | 'EMAIL' | 'OTP';

const Login = () => {
  const [step, setStep] = useState<Step>('SPLASH');
  const [previousStep, setPreviousStep] = useState<Step>('MOBILE');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('MOBILE');
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    if (step === 'OTP') {
      setStep(previousStep);
    } else {
      setStep('MOBILE');
    }
  };

  const handleLogin = () => {
    setPreviousStep(step);
    setStep('OTP');
  };

  // splash screen
  if (step === 'SPLASH') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--color-bg-primary)">
        <div className="h-150 w-150">
          <Rive src="/intro-animation.riv" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between md:justify-center bg-(--color-bg-primary) md:bg-(--color-bg-secondary) p-4 md:p-4">
      <div className="flex h-full w-full flex-col bg-transparent p-0 md:h-auto md:w-95 md:block md:rounded-lg md:bg-(--color-bg-primary) md:p-8">
        {/* back button */}
        {step !== 'MOBILE' && (
          <button
            onClick={handleBack}
            className="mb-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <ChevronLeft />
          </button>
        )}

        {/* content */}
        <div className="w-full">
          {/* heading */}
          <h2 className="Heading-4 text-(--color-text-primary)">
            {step === 'MOBILE' && 'Enter your mobile number'}
            {step === 'EMAIL' && 'Enter your email address'}
            {step === 'OTP' && 'Verification Code'}
          </h2>

          {/* subheading */}
          <p className="Body-Small text-(--color-text-secondary) mb-4">
            {step === 'MOBILE' && (
              <>
                We will send confirmation code to your <br /> phone number
              </>
            )}
            {step === 'EMAIL' &&
              'We will send confirmation code to your email address'}
            {step === 'OTP' &&
              'We will send confirmation code to your phone number'}
          </p>

          {/* form */}
          <div className="space-y-4">
            {step === 'MOBILE' && (
              <div className="space-y-3">
                {/* country code */}
                <div className="space-y-1">
                  <label className="Caption-Small text-(--color-text-primary)">
                    Country Code
                  </label>

                  <div className="flex w-full items-center gap-2 rounded-4xl border border-(--color-border-medium) bg-(--color-bg-secondary) p-3 mt-1">
                    <SvgIcon src="/globe.svg" className="h-6 w-6" />
                    <input
                      type="text"
                      value="India (+91)"
                      readOnly
                      className="w-full bg-(--color-bg-secondary) body-Small outline-none cursor-default"
                    />
                  </div>
                </div>

                {/* mobile number */}
                <div className="space-y-1 pb-4">
                  <label className="Caption-Small text-(--color-text-primary)">
                    Mobile Number
                  </label>

                  <div className="flex w-full items-center gap-2 rounded-4xl border border-(--color-border-medium) bg-(--color-bg-secondary) p-3 mt-1">
                    <SvgIcon src="/phone.svg" className="h-6 w-6" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      placeholder="Enter your mobile number"
                      className="w-full bg-(--color-bg-secondary) body-Small outline-none placeholder:text-(--color-text-disabled)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* email address */}
            {step === 'EMAIL' && (
              <div className="space-y-1">
                <label className="Caption-Small text-(--color-text-primary)">
                  E-mail Address
                </label>

                <div className="flex w-full items-center gap-2 rounded-4xl border border-(--color-border-medium) bg-(--color-bg-secondary) p-3 mt-1">
                  <SvgIcon src="/mail.svg" className="h-6 w-6" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-(--color-bg-secondary) body-Small outline-none placeholder:text-(--color-text-disabled)"
                  />
                </div>
              </div>
            )}

            {/* otp */}
            {step === 'OTP' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="Caption-Small text-(--color-text-primary)">
                    4 Digit OTP
                  </label>

                  {/* otp inputs */}
                  <div className="flex justify-between gap-4 mt-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="relative h-14 w-14 rounded-full border border-(--color-border-medium)"
                      >
                        <input
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={otp[index]}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="absolute inset-0 h-full w-full bg-(--color-bg-secondary) text-center Heading-1 text-(--color-text-primary) focus:outline-none rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* resend otp */}
                <div>
                  <p className="Button-Small text-(--color-text-disabled)">
                    Resend OTP{' '}
                    <span className="Caption-Small text-(--color-text-primary)">
                      in 30:00
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="w-full mt-auto pt-15">
          {step === 'OTP' ? (
            <button className="w-full Button-Primary rounded-xl bg-(--color-primary-500) py-3 text-(--color-white) cursor-pointer">
              Continue
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="w-full Button-Primary rounded-xl bg-(--color-primary-500) py-3 text-(--color-white) cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={() => setStep(step === 'MOBILE' ? 'EMAIL' : 'MOBILE')}
                className="mt-4 Button-Primary w-full rounded-xl Button-Primary border border-(--color-primary-500) py-3 text-(--color-text-primary) cursor-pointer"
              >
                {step === 'MOBILE'
                  ? 'Login with email address'
                  : 'Login with mobile number'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

const SvgIcon = ({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={`bg-(--color-text-primary) ${className}`}
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


import React, { useState, useEffect } from 'react';
import { ArrowRight, Smartphone, Lock, Edit2, ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'INPUT_MOBILE' | 'INPUT_OTP'>('INPUT_MOBILE');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer for Resend OTP
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 5) return; // Basic validation
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('INPUT_OTP');
      setTimer(30); // 30s cooldown
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gray-900 h-[100dvh]">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md mx-4 flex flex-col max-h-[90dvh]">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"></div>
        
        <div className="relative p-8 md:p-12 text-center overflow-y-auto no-scrollbar">
          {/* Paathner Logo */}
          <div className="w-32 h-32 mx-auto mb-4 relative shadow-2xl rounded-[28px] overflow-hidden flex items-center justify-center">
            <Logo className="w-full h-full" />
          </div>

          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Paathner</h1>
          <p className="text-gray-400 mb-8 text-sm">Your Ultimate Mall Companion</p>

          {step === 'INPUT_MOBILE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-fade-in">
               <div className="text-left ml-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Enter Mobile Number</div>
               <div className="relative group flex items-center">
                  <div className="absolute inset-y-0 left-0 flex items-center border-r border-white/10 h-full z-10">
                     <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-full bg-transparent text-white font-bold text-sm pl-3 pr-7 appearance-none outline-none cursor-pointer hover:bg-white/5 transition-colors rounded-l-xl"
                     >
                        <option value="+91" className="bg-gray-900 text-white">🇮🇳 +91</option>
                        <option value="+1" className="bg-gray-900 text-white">🇺🇸 +1</option>
                        <option value="+44" className="bg-gray-900 text-white">🇬🇧 +44</option>
                        <option value="+971" className="bg-gray-900 text-white">🇦🇪 +971</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
                  </div>
                  <input 
                    type="tel" 
                    required
                    value={mobile}
                    onChange={(e) => {
                       const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                       setMobile(val);
                    }}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-24 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-sm font-mono text-lg tracking-wide"
                    placeholder="Mobile Number"
                  />
                  <div className="absolute right-3 text-gray-500">
                    <Smartphone size={18} />
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={isLoading || mobile.length < 5}
                 className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,108,228,0.4)] hover:shadow-[0_0_30px_rgba(6,108,228,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
               >
                 {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     Get OTP <ArrowRight size={18} />
                   </>
                 )}
               </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-slide-in-right">
               <div className="flex justify-between items-center ml-1 mb-2">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enter Verification Code</div>
                 <button 
                   type="button" 
                   onClick={() => setStep('INPUT_MOBILE')}
                   className="text-[10px] text-primary hover:text-white flex items-center gap-1"
                 >
                   <Edit2 size={10} /> Change Number
                 </button>
               </div>
               
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-sm font-mono text-center text-2xl tracking-[0.5em]"
                    placeholder="••••"
                  />
               </div>
               
               <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-gray-500">Sent to {countryCode} {mobile}</span>
                  {timer > 0 ? (
                     <span className="text-gray-500">Resend in {timer}s</span>
                  ) : (
                     <button type="button" onClick={handleSendOtp} className="text-primary hover:text-white font-bold">Resend OTP</button>
                  )}
               </div>

               <button 
                 type="submit"
                 disabled={isLoading || otp.length < 4}
                 className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,108,228,0.4)] hover:shadow-[0_0_30px_rgba(6,108,228,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
               >
                 {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     Verify & Login <ArrowRight size={18} />
                   </>
                 )}
               </button>
            </form>
          )}

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-500 font-medium">OR CONTINUE WITH</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button 
             type="button"
             onClick={handleGoogleLogin}
             className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl transition-all hover:bg-gray-100 flex items-center justify-center gap-3 active:scale-95"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Sign in with Google
          </button>

          <p className="mt-6 text-xs text-gray-500">
            By continuing, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms</span> & <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

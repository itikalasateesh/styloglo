import React, { useState } from 'react';
import { Button } from './Button';
import { Logo } from './Logo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  mobile?: string;
  fullName?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10,15}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full Name is required.";
      }
      if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid mobile number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API call
      onLoginSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/3 translate-y-1/3 animate-pulse delay-700"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <Logo className="w-24 h-24 drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-black text-stone-900 mb-1 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            StyloGlo
          </h1>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 font-bold uppercase tracking-widest text-xs">
            Elevate your Style
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl mb-8">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            onClick={() => { setIsLogin(true); setErrors({}); }}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            onClick={() => { setIsLogin(false); setErrors({}); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div className="space-y-1 animate-fade-in">
               <label className="text-[10px] font-bold text-stone-400 uppercase ml-1">Full Name</label>
               <input 
                 name="fullName"
                 type="text" 
                 value={formData.fullName}
                 onChange={handleChange}
                 placeholder="John Doe" 
                 className={`w-full px-4 py-3 rounded-xl bg-stone-50 border ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-stone-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
               />
               {errors.fullName && <p className="text-red-500 text-xs ml-1">{errors.fullName}</p>}
             </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase ml-1">Email ID</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@styloglo.com" 
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border ${errors.email ? 'border-red-400 bg-red-50' : 'border-stone-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
            />
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
          </div>

          {!isLogin && (
             <div className="space-y-1 animate-fade-in">
               <label className="text-[10px] font-bold text-stone-400 uppercase ml-1">Mobile Number</label>
               <input 
                 name="mobile"
                 type="tel" 
                 value={formData.mobile}
                 onChange={handleChange}
                 placeholder="WhatsApp / Mobile No." 
                 className={`w-full px-4 py-3 rounded-xl bg-stone-50 border ${errors.mobile ? 'border-red-400 bg-red-50' : 'border-stone-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
               />
               {errors.mobile && <p className="text-red-500 text-xs ml-1">{errors.mobile}</p>}
               <p className="text-[10px] text-stone-400 ml-1">We'll send outfit alerts via WhatsApp</p>
             </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className={`w-full px-4 py-3 rounded-xl bg-stone-50 border ${errors.password ? 'border-red-400 bg-red-50' : 'border-stone-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
            />
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password}</p>}
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-xs text-purple-600 font-bold hover:underline">Forgot Password?</a>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full !bg-gradient-to-r from-purple-600 to-orange-500 hover:opacity-90 !text-white !font-bold !py-3.5 !shadow-lg !rounded-xl mt-6 transform hover:scale-[1.02] active:scale-[0.98] transition-all">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-stone-400 text-xs uppercase tracking-wider">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center py-2.5 border border-stone-200 rounded-xl hover:bg-white hover:shadow-md transition-all bg-white group">
            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
            </svg>
          </button>
          <button className="flex items-center justify-center py-2.5 border border-stone-200 rounded-xl hover:bg-white hover:shadow-md transition-all bg-white group">
            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.6 5.79.43 7.1-.75 1.73-1.8 3.48-3.13 4.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </button>
          <button className="flex items-center justify-center py-2.5 border border-stone-200 rounded-xl hover:bg-white hover:shadow-md transition-all bg-white text-pink-600 group">
            {/* Camera Icon - Replaces Instagram */}
            <svg className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
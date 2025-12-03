import React, { useState, useEffect } from 'react';
import { AppState, StyleProfile, StyleCategory } from './types';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { StyleEditor } from './components/StyleEditor';
import { WeeklyPlan } from './components/WeeklyPlan';
import { CameraCapture } from './components/CameraCapture';
import { Scanner } from './components/Scanner';
import { LoginPage } from './components/LoginPage';
import { SettingsPage } from './components/SettingsPage';
import { analyzeImageStyle } from './services/geminiService';
import { Button } from './components/Button';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOGIN);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'plan'>('edit');
  const [error, setError] = useState<string | null>(null);
  const [autoTriggerPrompt, setAutoTriggerPrompt] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = () => {
    setState(AppState.HOME);
  };

  const handleImageSelected = async (base64: string) => {
    setIsCameraOpen(false);
    setUserImage(base64);
    setState(AppState.ANALYZING);
    setError(null);

    const minScanTime = new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const [result] = await Promise.all([
        analyzeImageStyle(base64),
        minScanTime
      ]);
      setProfile(result);
      setState(AppState.DASHBOARD);
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze the image. Please try a different photo.");
      setState(AppState.HOME);
    }
  };

  const handleApplyStyle = (item: string, category: StyleCategory) => {
    let prompt = '';
    
    switch (category) {
      case 'hair':
        prompt = `Change the person's hairstyle to ${item}, keep the face and facial features exactly the same, photorealistic, high quality`;
        break;
      case 'beard':
        prompt = `Add a ${item} style beard to the person, naturally blended with skin, keep facial features same, photorealistic`;
        break;
      case 'color':
        prompt = `Change the person's clothing to be ${item} color/style, keep the face and body pose exactly the same, photorealistic`;
        break;
      case 'accessory':
        prompt = `Add ${item} to the person, naturally integrated, keep the face and hairstyle unchanged, photorealistic`;
        break;
      case 'makeup':
        prompt = `Apply ${item} makeup to the person's face, natural blend, keep identity same, photorealistic`;
        break;
      case 'tattoo':
        prompt = `Add a realistic tattoo of ${item}, naturally blended with skin, photorealistic`;
        break;
      case 'eyebrows':
        prompt = `Change the person's eyebrows to be ${item} shape, keep other facial features exactly the same, photorealistic`;
        break;
      case 'eyelashes':
        prompt = `Enhance the person's eyelashes to be ${item}, photorealistic, detailed eyes`;
        break;
    }

    if (prompt) {
      setAutoTriggerPrompt(prompt);
      if (activeTab !== 'edit') setActiveTab('edit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (state === AppState.LOGIN) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    if (state === AppState.SETTINGS) {
        return <SettingsPage onBack={() => setState(AppState.DASHBOARD)} onLogout={() => setState(AppState.LOGIN)} />;
    }

    if (isCameraOpen) {
      return (
        <CameraCapture 
          onCapture={handleImageSelected} 
          onClose={() => setIsCameraOpen(false)} 
        />
      );
    }

    if (state === AppState.ANALYZING && userImage) {
      return <Scanner image={userImage} />;
    }

    switch (state) {
      case AppState.HOME:
        return (
          <div className="min-h-[90vh] flex flex-col justify-center max-w-xl mx-auto text-center px-6 relative">
            <div className="mb-10 flex flex-col items-center">
                {/* Logo Placeholder */}
                <div className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
                    <Logo className="w-32 h-32" />
                </div>
                <h1 className="text-5xl font-black text-stone-900 mb-2 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                  StyloGlo
                </h1>
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
                    Elevate your Style
                </p>
            </div>
            
            <p className="text-stone-500 mb-12 leading-relaxed max-w-sm mx-auto font-medium">
              Ready for your transformation? Scan your face to unlock personalized hairstyles, makeup, and outfits.
            </p>
            
            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}
            
            <ImageUpload 
              onImageSelected={handleImageSelected} 
              onCameraStart={() => setIsCameraOpen(true)}
            />
          </div>
        );

      case AppState.DASHBOARD:
        return (
          <div className="max-w-6xl mx-auto px-4 pb-32 pt-4">
            {/* Dashboard Header */}
            <header className="flex justify-between items-center py-4 mb-6 sticky top-0 bg-stone-50/95 backdrop-blur z-20 border-b border-stone-100 md:border-none">
               <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center">
                      <Logo className="w-10 h-10 drop-shadow-md" />
                   </div>
                   <div>
                       <h1 className="text-lg font-black text-stone-900 tracking-tight leading-none" style={{ fontFamily: '"Playfair Display", serif' }}>StyloGlo</h1>
                       <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">Elevate your Style</p>
                   </div>
               </div>
               <div className="flex items-center gap-4">
                   <div className="hidden md:block text-right">
                       <p className="text-xl font-bold text-stone-800 font-mono leading-none">
                           {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                       <p className="text-xs text-stone-400 font-bold uppercase tracking-wide">
                           {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                       </p>
                   </div>
                   <button onClick={() => setState(AppState.SETTINGS)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
                     <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                   </button>
               </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Image Editor (Sticky on Desktop) */}
              <div className="lg:col-span-5">
                 <div className="lg:sticky lg:top-24 space-y-4">
                     {userImage && (
                        <StyleEditor 
                          originalImage={userImage} 
                          autoTriggerPrompt={autoTriggerPrompt}
                          onEditComplete={() => setAutoTriggerPrompt(null)}
                          profile={profile}
                        />
                     )}
                     
                     {/* Mobile Time Display */}
                     <div className="md:hidden flex justify-center items-center gap-3 py-2 opacity-70">
                        <span className="font-mono font-bold text-stone-900">
                           {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                 </div>
              </div>

              {/* Right Column: Analysis, Shopping & Plans */}
              <div className="lg:col-span-7">
                {/* Mode Toggle */}
                <div className="flex p-1 bg-white border border-stone-200 rounded-xl mb-6 shadow-sm">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'edit' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
                  >
                    Style & Shop
                  </button>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'plan' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
                  >
                    Weekly Planner
                  </button>
                </div>

                <div className="min-h-[500px]">
                  {activeTab === 'edit' && profile && (
                     <AnalysisResult 
                        profile={profile} 
                        onApplyStyle={handleApplyStyle}
                     />
                  )}
                  {activeTab === 'plan' && profile && (
                     <WeeklyPlan profile={profile} />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-purple-200 selection:text-purple-900">
      {renderContent()}
    </div>
  );
};

export default App;
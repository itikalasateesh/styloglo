import React from 'react';
import { Button } from './Button';
import { Logo } from './Logo';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout }) => {
  const handleAction = (action: string) => {
    alert(`${action} feature coming soon!`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors">
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold font-serif">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
               <Logo className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-lg">StyloGlo Member</h3>
              <p className="text-stone-500 text-sm">Free Plan</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center !text-xs !py-2 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200"
            onClick={() => handleAction("Manage Account")}
          >
            Manage Account
          </Button>
        </div>

        {/* Security & Privacy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security & Privacy
          </h3>
          <div className="space-y-4 text-sm text-stone-600">
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <span>Data Encryption</span>
              <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">ACTIVE</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-500">
              StyloGlo uses end-to-end encryption to process your images. Your photos are processed temporarily for analysis and are not stored permanently on our servers without your permission.
            </p>
            <div className="pt-2">
              <h4 className="font-bold text-stone-800 mb-2">Privacy Policy</h4>
              <p className="text-xs text-stone-500 mb-2">
                We respect your privacy. We do not sell your personal data to third parties. 
                Analysis data is used solely to provide style recommendations.
              </p>
              <button onClick={() => handleAction("Privacy Policy")} className="text-purple-600 text-xs font-bold hover:underline">Read full Privacy Policy</button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
           <h3 className="font-bold text-stone-900 mb-4">Support</h3>
           <div className="space-y-2">
             <button onClick={() => handleAction("Help Center")} className="w-full text-left py-3 px-4 rounded-xl hover:bg-stone-50 text-sm font-medium flex justify-between items-center">
               <span>Help Center</span>
               <span className="text-stone-300">›</span>
             </button>
             <button onClick={() => handleAction("Report a Bug")} className="w-full text-left py-3 px-4 rounded-xl hover:bg-stone-50 text-sm font-medium flex justify-between items-center">
               <span>Report a Bug</span>
               <span className="text-stone-300">›</span>
             </button>
             <button onClick={() => handleAction("Rate App")} className="w-full text-left py-3 px-4 rounded-xl hover:bg-stone-50 text-sm font-medium flex justify-between items-center">
               <span>Rate on App Store</span>
               <span className="text-stone-300">›</span>
             </button>
           </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={onLogout} 
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          Log Out
        </Button>
        
        <div className="text-center py-6 space-y-2">
          <p className="text-xs text-stone-400">Version 2.5.0 (Build 2025)</p>
          <p className="text-xs font-bold text-stone-500">© styloglo.com | 2025</p>
        </div>
      </div>
    </div>
  );
};
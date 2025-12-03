import React, { useEffect, useState } from 'react';
import { StyleProfile, WeeklyPlanDay } from '../types';
import { generateWeeklyStylePlan } from '../services/geminiService';

interface WeeklyPlanProps {
  profile: StyleProfile;
}

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ profile }) => {
  const [plan, setPlan] = useState<WeeklyPlanDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchPlan = async () => {
      try {
        const data = await generateWeeklyStylePlan(profile);
        if (mounted) setPlan(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPlan();
    return () => { mounted = false; };
  }, [profile]);

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-3/4 bg-stone-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-stone-200 rounded"></div>
          <div className="h-32 w-full bg-stone-100 rounded-xl mt-6"></div>
          <p className="mt-4 text-sm font-serif">Curating your StyloGlo weekly calendar...</p>
        </div>
      </div>
    );
  }

  // Helper to get a consistent aesthetic color/image based on index
  const getGradient = (index: number) => {
    const gradients = [
      'from-pink-100 to-rose-200',
      'from-blue-100 to-indigo-200',
      'from-green-100 to-emerald-200',
      'from-orange-100 to-amber-200',
      'from-purple-100 to-violet-200',
      'from-yellow-100 to-orange-100',
      'from-red-100 to-pink-200',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6 pb-20">
       <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 px-2">Your Weekly Style Calendar</h3>
       <div className="space-y-4">
         {plan.map((day, idx) => (
           <div key={idx} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-all">
             {/* Header with Day and Occasion */}
             <div className="px-4 py-3 flex justify-between items-center border-b border-stone-50 bg-stone-50/50">
               <span className="font-bold text-stone-900 text-lg">{day.day}</span>
               <span className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">{day.occasion}</span>
             </div>
             
             <div className="flex flex-row">
                {/* Visual Representation */}
                <div className={`w-1/3 min-h-[120px] bg-gradient-to-br ${getGradient(idx)} flex items-center justify-center relative overflow-hidden`}>
                     {/* Placeholder fashion illustration/icon */}
                     <span className="text-4xl drop-shadow-sm filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                        {idx % 2 === 0 ? '👔' : '👗'}
                     </span>
                     <div className="absolute inset-0 bg-black/5"></div>
                </div>

                {/* Details */}
                <div className="w-2/3 p-4 flex flex-col justify-center">
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                        {day.outfit}
                    </p>
                    <div className="mt-2 flex gap-2">
                        <button className="text-[10px] border border-stone-200 px-2 py-1 rounded hover:bg-stone-50 text-stone-500">
                           View Similar
                        </button>
                    </div>
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};
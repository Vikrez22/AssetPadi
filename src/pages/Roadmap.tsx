import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Share2, ClipboardList, Check } from 'lucide-react';
import RoadmapStep from '../components/roadmap/RoadmapStep';
import Button from '../components/ui/Button';

export default function Roadmap() {
  const navigate = useNavigate();
  const { user, roadmap } = useApp();
  const [copied, setCopied] = useState(false);

  // Guard route
  useEffect(() => {
    if (!user) {
      navigate('/onboard');
    } else if (!roadmap) {
      navigate('/chat');
    }
  }, [user, roadmap, navigate]);

  if (!user || !roadmap) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'AssetPadi Roadmap',
      text: `Check out my personalized CAC and NCR registration roadmap for my ${user.businessType} business!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\nGet yours at: ${shareData.url}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark px-4 py-8 max-w-2xl mx-auto flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-teal/5 blur-[100px] pointer-events-none -z-10 animate-float-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-yellow/5 blur-[100px] pointer-events-none -z-10 animate-float-2" />

      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1.5 text-brand-muted hover:text-brand-dark transition-colors font-bold text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </button>
          
          <span className="text-xs text-brand-success bg-green-50 font-bold px-3 py-1.5 rounded-xl border border-brand-success/20">
            Roadmap Generated
          </span>
        </div>

        {/* Title Block */}
        <div className="mb-8 glass-panel rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-tealLight text-brand-teal flex items-center justify-center rounded-2xl border border-brand-teal/10">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">
              Your Roadmap, {user.name}
            </h1>
          </div>
          
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            {user.language === 'pidgin'
              ? `Here is your step-by-step plan to register your ${user.businessType} and get capital using your assets. Keep checking off the steps as you complete them!`
              : `Here is your step-by-step plan to formalize your ${user.businessType} business in ${user.location} and qualify for asset-backed credit.`}
          </p>
        </div>

        {/* Qualifying Assets Section */}
        {roadmap.qualifyingAssets && roadmap.qualifyingAssets.length > 0 && (
          <div className="mb-6 bg-brand-yellowLight/30 border border-brand-yellow/10 rounded-3xl p-5">
            <h2 className="text-xs font-bold text-brand-yellow tracking-wider uppercase mb-3">
              Recognized Collateral Assets:
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {roadmap.qualifyingAssets.map((asset) => (
                <span
                  key={asset}
                  className="bg-white/60 text-brand-dark text-xs sm:text-sm font-bold border border-brand-yellow/20 px-3 py-2 rounded-2xl shadow-sm"
                >
                  ⚡ {asset}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap Steps */}
        <div className="space-y-4">
          {roadmap.steps.map((step, idx) => (
            <RoadmapStep key={step.id} step={step} index={idx} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50 relative z-10">
        <Button
          onClick={() => navigate('/chat')}
          variant="secondary"
          className="flex-1 py-3.5 rounded-2xl"
        >
          Ask AssetPadi More Questions
        </Button>
        
        <Button
          onClick={handleShare}
          variant="primary"
          className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied Link!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share Roadmap
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

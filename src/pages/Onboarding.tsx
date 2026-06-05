import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import { UserProfile, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser, setMessages } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('Shoemaker / Cobbler');
  const [otherBusiness, setOtherBusiness] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english');

  const businessOptions = [
    'Shoemaker / Cobbler',
    'Tailor / Fashion designer',
    'Bag / Leather goods maker',
    'Food vendor / Processor',
    'Electronics repair',
    'Building / Construction',
    'Farmer / Agro-processor',
    'Other'
  ];

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && businessType === 'Other' && !otherBusiness.trim()) return;
    if (step === 3 && !location.trim()) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      const finalBusiness = businessType === 'Other' ? otherBusiness.trim() : businessType;
      const profile: UserProfile = {
        name: name.trim(),
        businessType: finalBusiness,
        location: location.trim(),
        language
      };

      setUser(profile);

      const welcomeContent = language === 'pidgin'
        ? `Aba! Aego o, ${profile.name}! I be AssetPadi, your friend where know the way. I dey here to help you register your business as ${profile.businessType} for ${profile.location} so CAC and NCR go verify you. Correct credit flow go unlock! 

Make we start: which tools or machine you dey use for your business currently? Tell me (e.g. sewing machine, generator, leather cutter, inventory, etc.).`
        : `Welcome, ${profile.name}! I am AssetPadi, your guide. I am here to help you understand how to register your business as a ${profile.businessType} in ${profile.location} and unlock credit using the National Collateral Registry. 

Let's begin: what equipment or assets do you currently own and use in your business? (e.g., sewing machines, generators, tools, inventory, etc.)`;

      const welcomeMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date()
      };

      setMessages([welcomeMsg]);
      navigate('/chat');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] rounded-full bg-brand-teal/10 blur-[100px] sm:blur-[130px] animate-float-1 pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] rounded-full bg-brand-yellow/10 blur-[100px] sm:blur-[130px] animate-float-2 pointer-events-none -z-10" />

      <div className="w-full max-w-md glass-panel-heavy rounded-3xl shadow-xl p-8 flex flex-col justify-between min-h-[440px] relative z-10 transition-all">
        
        {/* Navigation & Progress Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="text-brand-muted hover:text-brand-dark p-2 rounded-2xl bg-black/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <span className="text-xs font-bold text-brand-teal bg-brand-tealLight px-3 py-1.5 rounded-xl border border-brand-teal/10">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-teal to-cyan-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 flex flex-col justify-center">
          {step === 1 && (
            <div className="message-enter">
              <h2 className="text-2xl font-bold mb-2 text-brand-dark">What is your name?</h2>
              <p className="text-sm text-brand-muted mb-4">We will use this to address you.</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emeka"
                className="w-full glass-input rounded-2xl px-4 py-3.5 text-base text-brand-dark"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="message-enter">
              <h2 className="text-2xl font-bold mb-2 text-brand-dark">What kind of business do you run?</h2>
              <p className="text-sm text-brand-muted mb-4">Choose from the list or write yours.</p>
              
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full glass-input bg-white rounded-2xl px-4 py-3.5 text-base mb-4 cursor-pointer text-brand-dark"
              >
                {businessOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-white text-brand-dark">
                    {opt}
                  </option>
                ))}
              </select>

              {businessType === 'Other' && (
                <input
                  type="text"
                  value={otherBusiness}
                  onChange={(e) => setOtherBusiness(e.target.value)}
                  placeholder="e.g. Barber / Hairdresser"
                  className="w-full glass-input rounded-2xl px-4 py-3.5 text-base text-brand-dark"
                  autoFocus
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="message-enter">
              <h2 className="text-2xl font-bold mb-2 text-brand-dark">Where are you based, and language?</h2>
              <p className="text-sm text-brand-muted mb-4">We customize options based on location.</p>
              
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Aba, Abia State"
                className="w-full glass-input rounded-2xl px-4 py-3.5 text-base mb-6 text-brand-dark"
                autoFocus
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-teal" />
                  Language Preference:
                </label>
                <div className="flex bg-gray-100/50 rounded-2xl p-1 border border-gray-200/50">
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      language === 'english'
                        ? 'bg-gradient-to-r from-brand-teal to-cyan-600 text-white shadow-sm border border-white/10'
                        : 'text-brand-muted hover:text-brand-dark'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('pidgin')}
                    className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      language === 'pidgin'
                        ? 'bg-gradient-to-r from-brand-teal to-cyan-600 text-white shadow-sm border border-white/10'
                        : 'text-brand-muted hover:text-brand-dark'
                    }`}
                  >
                    Nigerian Pidgin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !name.trim()) ||
              (step === 2 && businessType === 'Other' && !otherBusiness.trim()) ||
              (step === 3 && !location.trim())
            }
            variant="primary"
            className="w-full py-4 rounded-2xl"
          >
            {step === 3 ? 'Start Chat' : 'Continue'}
          </Button>
        </div>

      </div>
    </div>
  );
}

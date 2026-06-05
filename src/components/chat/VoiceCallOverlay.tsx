import { useEffect, useRef, useState } from 'react';
import { PhoneOff, Loader2, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../../hooks/useVoice';
import { cn } from '../../lib/utils';

interface VoiceCallOverlayProps {
  onClose: () => void;
  userName: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export default function VoiceCallOverlay({ onClose }: VoiceCallOverlayProps) {
  const { state, error, startCall, endCall, isUserTalking, isAgentTalking } = useVoice();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [duration, setDuration] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (audioRef.current) {
      startCall(audioRef.current);
    }
    return () => {
      endCall();
    };
  }, [startCall, endCall]);

  const handleEnd = () => {
    endCall();
    onClose();
  };

  // Generate particles for ambient effect
  useEffect(() => {
    const width = window.innerWidth || 400;
    const height = window.innerHeight || 400;
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        }
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const width = window.innerWidth || 400;
    const height = window.innerHeight || 400;
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + width) % width,
        y: (particle.y + particle.velocity.y + height) % height,
        opacity: Math.min(0.4, Math.max(0.05, particle.opacity + (Math.random() - 0.5) * 0.02))
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Timer and waveform simulation when connected
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let waveInterval: NodeJS.Timeout;

    if (state === 'connected') {
      timerInterval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      waveInterval = setInterval(() => {
        // Jitters active waveform if speaking, else stays relatively flat
        const isSpeakingOrListening = isUserTalking || isAgentTalking;
        const newWaveform = Array(32).fill(0).map(() => 
          isSpeakingOrListening 
            ? Math.random() * 80 + 20 
            : Math.random() * 8 + 4
        );
        setWaveformData(newWaveform);
      }, 100);
    } else {
      setWaveformData(Array(32).fill(0));
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(waveInterval);
    };
  }, [state, isUserTalking, isAgentTalking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const statusLabel = {
    idle: 'Starting...',
    connecting: 'Connecting...',
    connected: isUserTalking ? 'Listening...' : (isAgentTalking ? 'Speaking...' : 'Listening...'),
    ended: 'Call ended',
    error: 'Connection failed',
  }[state];

  const getStatusColorClass = () => {
    if (state === 'connecting') return "text-brand-yellow";
    if (state === 'error') return "text-brand-error";
    if (state === 'connected') {
      return isUserTalking ? "text-brand-teal" : (isAgentTalking ? "text-green-500" : "text-brand-teal");
    }
    return "text-gray-400";
  };

  const getWaveformColorClass = () => {
    if (state === 'connected') {
      return isUserTalking ? "bg-brand-teal" : (isAgentTalking ? "bg-green-500" : "bg-brand-teal");
    }
    if (state === 'connecting') return "bg-brand-yellow";
    if (state === 'error') return "bg-brand-error";
    return "bg-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-[#090D16] flex flex-col items-center justify-between py-12 px-6 z-50 selection:bg-brand-purple/30 selection:text-white">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-brand-teal/20 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity
            }}
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Background glow effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-96 h-96 rounded-full bg-gradient-to-r from-brand-teal/10 via-brand-purple/10 to-pink-500/10 blur-3xl"
          animate={{
            scale: state === 'connected' ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: state === 'connected' ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Spacer / Top branding */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        <motion.div
          className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span>AI Voice Assistant</span>
        </motion.div>
      </div>

      {/* Main center section */}
      <div className="relative z-10 flex flex-col items-center space-y-12 my-auto">
        {/* Main voice button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className={cn(
              "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 border-2",
              state === 'connected' ? (isUserTalking ? "border-brand-teal bg-brand-teal/10 shadow-lg shadow-brand-teal/20" : "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20") :
              state === 'connecting' ? "border-brand-yellow bg-brand-yellow/10 shadow-lg shadow-brand-yellow/20" :
              state === 'error' ? "border-brand-error bg-brand-error/10 shadow-lg shadow-brand-error/20" :
              "border-white/10 bg-white/5"
            )}
          >
            <AnimatePresence mode="wait">
              {state === 'connecting' || state === 'idle' ? (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
                </motion.div>
              ) : state === 'connected' ? (
                isUserTalking ? (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Mic className="w-12 h-12 text-brand-teal" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="speaking"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Volume2 className="w-12 h-12 text-green-500" />
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Mic className="w-12 h-12 text-gray-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pulse rings when connected */}
          <AnimatePresence>
            {state === 'connected' && (
              <>
                <motion.div
                  className={cn("absolute inset-0 rounded-full border-2", isUserTalking ? "border-brand-teal/30" : "border-green-500/30")}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className={cn("absolute inset-0 rounded-full border-2", isUserTalking ? "border-brand-teal/20" : "border-green-500/20")}
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Waveform visualizer */}
        <div className="flex items-center justify-center space-x-1.5 h-16 w-64">
          {waveformData.map((height, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                getWaveformColorClass()
              )}
              animate={{
                height: `${Math.max(4, height * 0.6)}px`,
                opacity: state === 'connected' ? 1 : 0.2
              }}
              transition={{
                duration: 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Status and timer */}
        <div className="text-center space-y-2">
          <motion.p
            className={cn("text-xl font-bold tracking-tight transition-colors", getStatusColorClass())}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{
              duration: 2,
              repeat: state !== 'idle' && state !== 'ended' ? Infinity : 0
            }}
          >
            {statusLabel}
          </motion.p>
          
          <p className="text-sm text-gray-500 font-mono">
            {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* Bottom control buttons */}
      <div className="relative z-10 flex flex-col items-center gap-2 mb-4">
        {/* End Call Button */}
        <button
          onClick={handleEnd}
          className="w-16 h-16 rounded-2xl bg-brand-error flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-lg shadow-brand-error/20 cursor-pointer border border-white/5"
          title="End call"
        >
          <PhoneOff className="text-white w-6 h-6" />
        </button>
        <p className="text-gray-500 text-xs font-semibold tracking-wide uppercase">Tap to end call</p>
      </div>

      {error && (
        <div className="absolute top-20 max-w-xs text-center px-5 py-3 bg-red-950/20 border border-brand-error/20 rounded-2xl shadow-lg z-20">
          <p className="text-brand-error text-xs leading-relaxed font-semibold">{error}</p>
        </div>
      )}

      {/* Hidden audio element for receiving WebRTC agent speech output */}
      <audio ref={audioRef} autoPlay playsInline className="hidden" />
    </div>
  );
}

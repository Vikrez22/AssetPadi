import { useState, useRef, useCallback } from 'react';

type VoiceState = 'idle' | 'connecting' | 'connected' | 'ended' | 'error';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export function useVoice() {
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);

  const userAudioCtxRef = useRef<AudioContext | null>(null);
  const agentAudioCtxRef = useRef<AudioContext | null>(null);
  const userFrameIdRef = useRef<number | null>(null);
  const agentFrameIdRef = useRef<number | null>(null);

  const isAvailable = true; // AethexAI is now integrated

  const cleanup = useCallback(() => {
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;

    // Close AudioContexts to release resources
    if (userAudioCtxRef.current) {
      userAudioCtxRef.current.close().catch(e => console.error('Error closing userAudioCtx:', e));
      userAudioCtxRef.current = null;
    }
    if (agentAudioCtxRef.current) {
      agentAudioCtxRef.current.close().catch(e => console.error('Error closing agentAudioCtx:', e));
      agentAudioCtxRef.current = null;
    }
    if (userFrameIdRef.current) {
      cancelAnimationFrame(userFrameIdRef.current);
      userFrameIdRef.current = null;
    }
    if (agentFrameIdRef.current) {
      cancelAnimationFrame(agentFrameIdRef.current);
      agentFrameIdRef.current = null;
    }
    setIsUserTalking(false);
    setIsAgentTalking(false);
  }, []);

  const startCall = useCallback(async (audioElement: HTMLAudioElement) => {
    audioRef.current = audioElement;
    setError(null);
    setState('connecting');

    try {
      // 1. Create session via proxy
      const sessionRes = await fetch(`${SERVER}/api/voice/session`, { method: 'POST' });
      if (!sessionRes.ok) throw new Error(`Session creation failed (Server status: ${sessionRes.status})`);
      const { session_id, ice_config } = await sessionRes.json();

      // 2. Set up WebRTC peer connection
      const pc = new RTCPeerConnection(ice_config);
      pcRef.current = pc;

      pc.onconnectionstatechange = () => {
        if (!pcRef.current) return;
        if (pc.connectionState === 'connected') setState('connected');
        if (['failed', 'closed'].includes(pc.connectionState)) {
          cleanup();
          setState('ended');
        }
      };

      // Play incoming agent audio and analyze agent volume
      pc.ontrack = (ev) => {
        if (audioRef.current) {
          audioRef.current.srcObject = ev.streams[0];
        }

        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass && ev.streams[0]) {
            const audioCtx = new AudioContextClass();
            agentAudioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(ev.streams[0]);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const checkVolume = () => {
              if (!pcRef.current || pcRef.current.connectionState !== 'connected') {
                return;
              }
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              setIsAgentTalking(average > 8); // threshold
              agentFrameIdRef.current = requestAnimationFrame(checkVolume);
            };
            
            if (pc.connectionState === 'connected') {
              checkVolume();
            } else {
              pc.addEventListener('connectionstatechange', function listener() {
                if (pc.connectionState === 'connected') {
                  checkVolume();
                  pc.removeEventListener('connectionstatechange', listener);
                }
              });
            }
          }
        } catch (err) {
          console.error('Failed to setup agent volume analyser:', err);
        }
      };

      // Add microphone track
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;
      micStream.getTracks().forEach(t => pc.addTrack(t, micStream));

      // Analyze user mic volume
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          userAudioCtxRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(micStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const checkVolume = () => {
            if (!pcRef.current || pcRef.current.connectionState !== 'connected') {
              return;
            }
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            setIsUserTalking(average > 8); // threshold
            userFrameIdRef.current = requestAnimationFrame(checkVolume);
          };

          pc.addEventListener('connectionstatechange', () => {
            if (pc.connectionState === 'connected') {
              checkVolume();
            }
          });
        }
      } catch (err) {
        console.error('Failed to setup mic volume analyser:', err);
      }

      // 3. Create and send SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete (timeout of 3s)
      if (pc.iceGatheringState !== 'complete') {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.warn('ICE gathering timed out, proceeding with gathered candidates');
            pc.onicegatheringstatechange = null;
            resolve();
          }, 3000);
          pc.onicegatheringstatechange = () => {
            if (pc.iceGatheringState === 'complete') {
              clearTimeout(timeout);
              pc.onicegatheringstatechange = null;
              resolve();
            }
          };
        });
      }

      // 4. Send offer to proxy, get SDP answer
      const { sdp, type } = pc.localDescription!;
      const answerRes = await fetch(`${SERVER}/api/voice/session/${session_id}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp, type }),
      });
      if (!answerRes.ok) throw new Error(`Offer negotiation failed (Server status: ${answerRes.status})`);
      const answer = await answerRes.json();

      // 5. Set remote description — connection established
      await pc.setRemoteDescription({ sdp: answer.sdp, type: 'answer' });

    } catch (err: any) {
      console.error('Voice WebRTC Error:', err);
      setError(err.message || 'Unknown voice connection error');
      setState('error');
      cleanup();
    }
  }, [cleanup]);

  const endCall = useCallback(() => {
    cleanup();
    setState('ended');
  }, [cleanup]);

  return {
    isAvailable,
    state,
    error,
    startCall,
    endCall,
    isConnected: state === 'connected',
    isConnecting: state === 'connecting',
    isUserTalking,
    isAgentTalking,
  };
}

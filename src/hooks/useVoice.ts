import { useState, useRef, useCallback } from 'react';

type VoiceState = 'idle' | 'connecting' | 'connected' | 'ended' | 'error';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export function useVoice() {
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isAvailable = true; // AethexAI is now integrated

  const cleanup = useCallback(() => {
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;
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

      // Play incoming agent audio
      pc.ontrack = (ev) => {
        if (audioRef.current) {
          audioRef.current.srcObject = ev.streams[0];
        }
      };

      // Add microphone track
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;
      micStream.getTracks().forEach(t => pc.addTrack(t, micStream));

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
  };
}

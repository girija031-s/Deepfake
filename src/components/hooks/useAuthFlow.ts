import { useState, useEffect } from 'react';

export type AuthStep = 'login' | 'facial' | 'voice' | 'behavioral' | 'risk' | 'architecture' | 'admin';

export interface BiometricScores {
  facial: number | null;
  voice: number | null;
  behavioral: number | null;
}

interface GlobalState {
  step: AuthStep;
  scores: BiometricScores;
  username: string;
}

const getInitialState = (): GlobalState => {
  try {
    const stored = localStorage.getItem('securebank_auth');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { step: 'login', scores: { facial: null, voice: null, behavioral: null }, username: '' };
};

let globalState: GlobalState = getInitialState();
const listeners: Set<() => void> = new Set();

function notify() {
  localStorage.setItem('securebank_auth', JSON.stringify(globalState));
  listeners.forEach(fn => fn());
}

export function setAuthStep(step: AuthStep) {
  globalState = { ...globalState, step };
  notify();
}

export function setAuthScore(type: keyof BiometricScores, score: number) {
  globalState = { ...globalState, scores: { ...globalState.scores, [type]: score } };
  notify();
}

export function setAuthUsername(username: string) {
  globalState = { ...globalState, username };
  notify();
}

export function resetAuth() {
  globalState = { step: 'login', scores: { facial: null, voice: null, behavioral: null }, username: '' };
  notify();
}

export function useAuthFlow() {
  const [state, setState] = useState<GlobalState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return {
    ...state,
    setStep: setAuthStep,
    setScore: setAuthScore,
    setUsername: setAuthUsername,
    reset: resetAuth,
  };
}

export function getRiskLevel(scores: BiometricScores): 'low' | 'medium' | 'high' | 'critical' {
  const vals = [scores.facial, scores.voice, scores.behavioral].filter((s): s is number => s !== null);
  if (vals.length === 0) return 'high';
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg >= 85) return 'low';
  if (avg >= 70) return 'medium';
  if (avg >= 50) return 'high';
  return 'critical';
}

export function getRiskScore(scores: BiometricScores): number {
  const vals = [scores.facial, scores.voice, scores.behavioral].filter((s): s is number => s !== null);
  if (vals.length === 0) return 75;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(100 - avg);
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ChevronRight, CheckCircle, AlertTriangle, Volume2, RotateCcw, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { AuthStepper } from '@/components/AuthStepper';
import { setAuthScore, setAuthStep, useAuthFlow } from '@/hooks/useAuthFlow';

const PASSPHRASES = [
  'mountain glacier silver echo drift',
  'cobalt thunder forest quiet bridge',
  'marble falcon rapid sunset hollow',
  'arctic prism velvet canyon ember',
  'cerulean harvest pillar dawn trace',
];

const NUM_BARS = 32;

function WaveformVisualizer({ isRecording }: { isRecording: boolean }) {
  const [bars, setBars] = useState(() => Array.from({ length: NUM_BARS }, () => 4));
  const animRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isRecording) {
      animRef.current = setInterval(() => {
        setBars(Array.from({ length: NUM_BARS }, (_, i) => {
          const center = Math.abs(i - NUM_BARS / 2) / (NUM_BARS / 2);
          const wave = Math.random() * (1 - center * 0.6) * 48 + 4;
          return Math.round(wave);
        }));
      }, 80);
    } else {
      clearInterval(animRef.current);
      setBars(Array.from({ length: NUM_BARS }, () => 4));
    }
    return () => clearInterval(animRef.current);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-0.5 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-75 ${
            isRecording
              ? i % 3 === 0 ? 'bg-emerald' : i % 3 === 1 ? 'bg-primary' : 'bg-emerald/60'
              : 'bg-border'
          }`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function VoiceBiometrics() {
  const navigate = useNavigate();
  const { scores } = useAuthFlow();
  const [passphrase] = useState(() => PASSPHRASES[Math.floor(Math.random() * PASSPHRASES.length)]);
  const [phase, setPhase] = useState<'init' | 'recording' | 'analysing' | 'done'>('init');
  const [voiceScore, setVoiceScore] = useState(0);
  const [voiceprintScore, setVoiceprintScore] = useState(0);
  const [replayScore, setReplayScore] = useState(0);
  const [syntheticScore, setSyntheticScore] = useState(0);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isAuthentic, setIsAuthentic] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const startRecording = () => {
    setPhase('recording');
    let prog = 0;

    intervalRef.current = setInterval(() => {
      prog += 2.5;
      setRecordProgress(prog);
      if (prog >= 100) {
        clearInterval(intervalRef.current);
        setPhase('analysing');
        analyseVoice();
      }
    }, 100);
  };

  const analyseVoice = () => {
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      const voice = Math.min(78 + Math.random() * 19, 97);
      const voiceprint = Math.min(80 + Math.random() * 17, 98);
      const replay = Math.max(2, 15 - Math.random() * 10);
      const synthetic = Math.max(1, 12 - Math.random() * 8);

      setVoiceScore(voice);
      setVoiceprintScore(voiceprint);
      setReplayScore(replay);
      setSyntheticScore(synthetic);

      if (step >= 15) {
        clearInterval(intervalRef.current);
        const final = Math.round(voice);
        setVoiceScore(final);
        setVoiceprintScore(Math.round(voiceprint));
        setReplayScore(Math.round(replay));
        setSyntheticScore(Math.round(synthetic));
        setIsAuthentic(final >= 72);
        setAuthScore('voice', final);
        setAuthStep('behavioral');
        setPhase('done');
      }
    }, 120);
  };

  const reset = () => {
    setPhase('init');
    setRecordProgress(0);
    setVoiceScore(0);
    setVoiceprintScore(0);
    setReplayScore(0);
    setSyntheticScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <AuthStepper currentStep="voice" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Step 2 — Voice Biometrics</h1>
          <p className="text-muted-foreground mt-1">Voiceprint authentication with synthetic voice & replay attack detection</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Passphrase Card */}
            <Card className="shadow-card border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Voice Challenge</p>
                    <p className="text-sm text-muted-foreground">Please read the passphrase clearly:</p>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
                  <p className="text-center text-lg font-bold text-primary tracking-wide leading-relaxed">
                    "{passphrase}"
                  </p>
                </div>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Speak naturally at a normal pace. Avoid background noise.
                </p>
              </CardContent>
            </Card>

            {/* Waveform Panel */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className={`rounded-xl p-6 transition-all duration-300 ${
                  phase === 'recording' ? 'bg-emerald/5 border border-emerald/30' :
                  phase === 'done' ? (isAuthentic ? 'bg-success-bg' : 'bg-danger-bg') :
                  'bg-muted/30'
                }`}>
                  {/* Waveform */}
                  <WaveformVisualizer isRecording={phase === 'recording'} />

                  {/* Status */}
                  <div className="text-center mt-3">
                    {phase === 'init' && (
                      <p className="text-sm text-muted-foreground">Microphone ready — Demo mode</p>
                    )}
                    {phase === 'recording' && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                        <p className="text-sm font-semibold text-foreground">Recording... {Math.round(recordProgress)}%</p>
                      </div>
                    )}
                    {phase === 'analysing' && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-semibold text-foreground">Analysing voiceprint...</p>
                      </div>
                    )}
                    {phase === 'done' && (
                      <div className="flex items-center justify-center gap-2">
                        {isAuthentic ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-danger" />
                        )}
                        <p className={`text-sm font-semibold ${isAuthentic ? 'text-success' : 'text-danger'}`}>
                          {isAuthentic ? 'Voice Verified' : 'Spoofed Voice Detected'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {phase === 'recording' && (
                  <div className="mt-3">
                    <Progress value={recordProgress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex gap-3">
              {phase === 'init' && (
                <Button onClick={startRecording} className="flex-1 bg-primary hover:bg-primary-light h-11 font-semibold">
                  <Mic className="w-4 h-4" />
                  Start Voice Capture
                </Button>
              )}
              {(phase === 'recording' || phase === 'analysing') && (
                <Button disabled className="flex-1 h-11 bg-primary/50">
                  {phase === 'recording' ? (
                    <><Square className="w-4 h-4" /> Recording...</>
                  ) : (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing...</>
                  )}
                </Button>
              )}
              {phase === 'done' && (
                <>
                  <Button variant="outline" onClick={reset} className="border-border">
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </Button>
                  <Button
                    onClick={() => navigate('/auth/behavioral')}
                    className="flex-1 bg-emerald hover:bg-emerald-light text-white h-11 font-semibold shadow-glow-emerald"
                    disabled={!isAuthentic}
                  >
                    Continue to Behavioral
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {!isAuthentic && (
                    <Button variant="outline" onClick={() => navigate('/auth/behavioral')} className="text-muted-foreground text-xs">
                      Override
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Voice Score Gauge */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Voice Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={voiceScore >= 72 ? 'hsl(var(--emerald))' : 'hsl(var(--danger))'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * voiceScore / 100)}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${voiceScore >= 72 ? 'text-emerald' : 'text-danger'}`}>
                        {Math.round(voiceScore)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Match</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Voiceprint Match', value: voiceprintScore, good: true },
                    { label: 'Replay Attack Risk', value: replayScore, good: false },
                    { label: 'Synthetic Voice Risk', value: syntheticScore, good: false },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={`font-bold ${
                          item.good
                            ? item.value >= 70 ? 'text-success' : 'text-danger'
                            : item.value <= 20 ? 'text-success' : 'text-danger'
                        }`}>
                          {Math.round(item.value)}%
                        </span>
                      </div>
                      <Progress
                        value={item.value}
                        className={`h-1.5 ${!item.good ? '[&>div]:bg-danger' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anti-Spoofing Checks */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Anti-Spoofing Checks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Frequency Analysis', done: phase === 'done' || phase === 'analysing' },
                  { label: 'Microphone Source', done: phase === 'done' || phase === 'analysing' },
                  { label: 'Spectrogram Match', done: phase === 'done' },
                  { label: 'Neural Voice Score', done: phase === 'done' },
                  { label: 'Temporal Patterns', done: phase === 'done' },
                ].map(check => (
                  <div key={check.label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{check.label}</span>
                    <span className={`text-xs font-semibold ${check.done ? 'text-success' : 'text-muted-foreground'}`}>
                      {check.done ? '✓ Pass' : '—'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {phase === 'done' && (
              <Card className={`shadow-card animate-fade-in ${isAuthentic ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg'}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  {isAuthentic
                    ? <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className={`font-bold text-sm ${isAuthentic ? 'text-success' : 'text-danger'}`}>
                      {isAuthentic ? 'Voice Authenticated' : 'Synthetic Voice Detected'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAuthentic
                        ? `Voiceprint matched at ${Math.round(voiceprintScore)}% confidence. No spoofing detected.`
                        : 'Audio analysis flagged AI-generated vocal patterns.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

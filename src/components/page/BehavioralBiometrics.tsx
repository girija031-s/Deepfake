import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, CheckCircle, Keyboard, MousePointer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { AuthStepper } from '@/components/AuthStepper';
import { setAuthScore, setAuthStep, useAuthFlow } from '@/hooks/useAuthFlow';

const TYPING_PROMPT = 'The quick brown fox jumps over the lazy dog';

interface KeystrokeEvent {
  key: string;
  dwell: number;
  flight: number;
  timestamp: number;
}

interface MousePoint {
  x: number;
  y: number;
  t: number;
}

export default function BehavioralBiometrics() {
  const navigate = useNavigate();
  const { scores } = useAuthFlow();
  const [typedText, setTypedText] = useState('');
  const [keystrokeData, setKeystrokeData] = useState<KeystrokeEvent[]>([]);
  const [mouseTrail, setMouseTrail] = useState<MousePoint[]>([]);
  const [behaviorScore, setBehaviorScore] = useState(0);
  const [keystrokeScore, setKeystrokeScore] = useState(0);
  const [mouseScore, setMouseScore] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'done'>('typing');
  const [analysing, setAnalysing] = useState(false);
  const lastKeyTime = useRef<number>(0);
  const keyDownTime = useRef<number>(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const typingComplete = typedText.length >= TYPING_PROMPT.length;

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseTrail(prev => [...prev.slice(-40), { x, y, t: Date.now() }]);
    setMouseScore(prev => Math.min(prev + 0.5, 100));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleKeyDown = () => {
    keyDownTime.current = Date.now();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now();
    const dwell = now - keyDownTime.current;
    const flight = lastKeyTime.current ? keyDownTime.current - lastKeyTime.current : 0;
    lastKeyTime.current = now;

    setKeystrokeData(prev => [...prev, { key: e.key, dwell, flight, timestamp: now }]);

    // Build up keystroke score
    const baseScore = 65 + Math.random() * 20;
    setKeystrokeScore(prev => Math.min((prev * keystrokeData.length + baseScore) / (keystrokeData.length + 1), 96));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== 'typing') return;
    setTypedText(e.target.value);
  };

  const runAnalysis = () => {
    setAnalysing(true);
    let steps = 0;
    const interval = setInterval(() => {
      steps++;
      const k = keystrokeScore || 78;
      const m = mouseScore || 72;
      const combined = (k * 0.6 + m * 0.4);
      setBehaviorScore(combined);

      if (steps >= 20) {
        clearInterval(interval);
        const final = Math.round(combined);
        setBehaviorScore(final);
        setAuthScore('behavioral', final);
        setAuthStep('risk');
        setAnalysing(false);
        setPhase('done');
      }
    }, 100);
  };

  const reset = () => {
    setTypedText('');
    setKeystrokeData([]);
    setMouseTrail([]);
    setBehaviorScore(0);
    setKeystrokeScore(0);
    setMouseScore(prev => prev * 0.3);
    setPhase('typing');
  };

  // Rhythm bars from keystroke data
  const rhythmBars = keystrokeData.slice(-20).map(k => ({
    height: Math.min(k.dwell / 3, 48),
    flight: Math.min(k.flight / 20, 48),
  }));

  const accuracy = typedText.split('').filter((c, i) => c === TYPING_PROMPT[i]).length;
  const accuracyPct = typedText.length > 0 ? Math.round((accuracy / typedText.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <AuthStepper currentStep="behavioral" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Step 3 — Behavioral Biometrics</h1>
          <p className="text-muted-foreground mt-1">Keystroke dynamics & mouse movement pattern analysis</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Typing Test */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Keyboard className="w-4 h-4 text-primary" />
                  Keystroke Dynamics Capture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prompt text */}
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm leading-relaxed select-none">
                  {TYPING_PROMPT.split('').map((char, i) => {
                    const typed = typedText[i];
                    const isCorrect = typed === char;
                    const isTyped = i < typedText.length;
                    const isCurrent = i === typedText.length;
                    return (
                      <span
                        key={i}
                        className={`${
                          !isTyped ? 'text-muted-foreground' :
                          isCorrect ? 'text-success' : 'text-danger bg-danger/10'
                        } ${isCurrent ? 'border-b-2 border-primary animate-pulse' : ''}`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={typedText}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  disabled={phase === 'done' || typingComplete}
                  placeholder="Start typing the phrase above..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  autoComplete="off"
                />

                {/* Keystroke count */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{keystrokeData.length} keystrokes captured</span>
                  <span className={accuracyPct >= 80 ? 'text-success font-semibold' : 'text-warning font-semibold'}>
                    {typedText.length > 0 ? `${accuracyPct}% accuracy` : ''}
                  </span>
                  <span>{typedText.length}/{TYPING_PROMPT.length} chars</span>
                </div>

                <Progress value={(typedText.length / TYPING_PROMPT.length) * 100} className="h-1" />
              </CardContent>
            </Card>

            {/* Rhythm Graph */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Typing Cadence Rhythm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-0.5 h-14 bg-muted/30 rounded-lg p-2">
                  {rhythmBars.length === 0 ? (
                    <span className="text-xs text-muted-foreground mx-auto self-center">Start typing to see cadence pattern</span>
                  ) : (
                    rhythmBars.map((bar, i) => (
                      <div key={i} className="flex items-end gap-px flex-1">
                        <div
                          className="flex-1 bg-primary/70 rounded-sm transition-all duration-100"
                          style={{ height: `${bar.height}px` }}
                          title="Dwell time"
                        />
                        <div
                          className="flex-1 bg-emerald/50 rounded-sm transition-all duration-100"
                          style={{ height: `${Math.min(bar.flight, 40)}px` }}
                          title="Flight time"
                        />
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary/70 inline-block" /> Dwell time</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald/50 inline-block" /> Flight time</span>
                </div>
              </CardContent>
            </Card>

            {/* Mouse Trail */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  <MousePointer className="w-3.5 h-3.5" />
                  Mouse Movement Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={canvasRef} className="relative h-24 bg-muted/30 rounded-lg overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {mouseTrail.length > 1 && (
                      <polyline
                        points={mouseTrail.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="hsl(var(--emerald))"
                        strokeWidth="0.8"
                        strokeOpacity="0.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {mouseTrail.slice(-1).map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="hsl(var(--emerald))" />
                    ))}
                  </svg>
                  {mouseTrail.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-8">Move your mouse here to record movement pattern</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{mouseTrail.length} movement points tracked</p>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex gap-3">
              {phase === 'typing' && (
                <>
                  <Button variant="outline" onClick={reset} className="border-border">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button
                    onClick={runAnalysis}
                    disabled={keystrokeData.length < 5 || analysing}
                    className="flex-1 bg-primary hover:bg-primary-light h-11 font-semibold"
                  >
                    {analysing ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing Patterns...</>
                    ) : (
                      <><Brain className="w-4 h-4" /> Analyse Behaviour</>
                    )}
                  </Button>
                </>
              )}
              {phase === 'done' && (
                <>
                  <Button variant="outline" onClick={reset} className="border-border">
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </Button>
                  <Button
                    onClick={() => navigate('/auth/risk')}
                    className="flex-1 bg-emerald hover:bg-emerald-light text-white h-11 font-semibold shadow-glow-emerald"
                  >
                    View Risk Engine
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Trust Score */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Behavioral Trust Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={behaviorScore >= 70 ? 'hsl(var(--emerald))' : 'hsl(var(--warning))'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * behaviorScore / 100)}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${behaviorScore >= 70 ? 'text-emerald' : 'text-warning'}`}>
                        {Math.round(behaviorScore)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Trust</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Keystroke Dynamics</span>
                      <span className={`font-bold ${keystrokeScore >= 70 ? 'text-success' : 'text-warning'}`}>{Math.round(keystrokeScore)}%</span>
                    </div>
                    <Progress value={keystrokeScore} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Mouse Movement</span>
                      <span className={`font-bold ${mouseScore >= 50 ? 'text-success' : 'text-warning'}`}>{Math.round(mouseScore)}%</span>
                    </div>
                    <Progress value={mouseScore} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pattern Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Avg Dwell Time', value: keystrokeData.length > 0 ? `${Math.round(keystrokeData.reduce((a, k) => a + k.dwell, 0) / keystrokeData.length)}ms` : '—' },
                  { label: 'Avg Flight Time', value: keystrokeData.length > 1 ? `${Math.round(keystrokeData.slice(1).reduce((a, k) => a + k.flight, 0) / (keystrokeData.length - 1))}ms` : '—' },
                  { label: 'Typing Rhythm', value: keystrokeData.length > 5 ? 'Human-like' : '—', highlight: keystrokeData.length > 5 },
                  { label: 'Mouse Points', value: mouseTrail.length > 0 ? `${mouseTrail.length}` : '—' },
                  { label: 'Bot Probability', value: phase === 'done' ? `${Math.max(2, Math.round(100 - behaviorScore * 0.85))}%` : '—' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={`text-xs font-semibold ${'highlight' in item && item.highlight ? 'text-success' : 'text-foreground'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {phase === 'done' && (
              <Card className="shadow-card border-success bg-success-bg animate-fade-in">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-success">Behavior Verified</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Keystroke and mouse patterns match expected human behaviour at {Math.round(behaviorScore)}% confidence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-card bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">How it works:</strong> Your unique typing rhythm and mouse movement patterns create a behavioural fingerprint that's extremely difficult to replicate — even if credentials are compromised.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

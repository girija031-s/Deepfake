import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronRight, AlertTriangle, CheckCircle, Camera, RotateCcw, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { AuthStepper } from '@/components/AuthStepper';
import { setAuthScore, setAuthStep, useAuthFlow } from '@/hooks/useAuthFlow';

const LIVENESS_CHALLENGES = [
  'Look straight at the camera',
  'Slowly turn your head left',
  'Slowly turn your head right',
  'Blink twice naturally',
  'Smile gently',
  'Return to centre position',
];

const FACIAL_LANDMARKS = [
  { x: 50, y: 30 }, { x: 35, y: 35 }, { x: 65, y: 35 },
  { x: 30, y: 48 }, { x: 70, y: 48 }, { x: 50, y: 55 },
  { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 50, y: 72 },
  { x: 38, y: 43 }, { x: 44, y: 43 }, { x: 56, y: 43 }, { x: 62, y: 43 },
];

export default function FacialLiveness() {
  const navigate = useNavigate();
  const { username, scores } = useAuthFlow();
  const [phase, setPhase] = useState<'init' | 'scanning' | 'done'>('init');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [deepfakeScore, setDeepfakeScore] = useState(0);
  const [livenessScore, setLivenessScore] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [isAuthentic, setIsAuthentic] = useState(true);
  const [landmarksVisible, setLandmarksVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startScan = () => {
    setPhase('scanning');
    setLandmarksVisible(true);
    let progress = 0;
    let challengeStep = 0;

    intervalRef.current = setInterval(() => {
      progress += 2;
      setScanProgress(progress);

      // Advance challenge every 16%
      const newChallengeStep = Math.floor(progress / 16);
      if (newChallengeStep !== challengeStep && newChallengeStep < LIVENESS_CHALLENGES.length) {
        challengeStep = newChallengeStep;
        setChallengeIdx(newChallengeStep);
      }

      // Animate scores
      const authenticity = 82 + Math.random() * 15;
      setLivenessScore(Math.min(authenticity, 98));
      setDeepfakeScore(Math.max(2, 18 - Math.random() * 10));

      if (progress >= 100) {
        clearInterval(intervalRef.current);
        const finalScore = Math.round(82 + Math.random() * 15);
        setLivenessScore(finalScore);
        setDeepfakeScore(Math.round(100 - finalScore));
        setIsAuthentic(finalScore >= 75);
        setAuthScore('facial', finalScore);
        setAuthStep('voice');
        setPhase('done');
      }
    }, 100);
  };

  const proceed = () => {
    navigate('/auth/voice');
  };

  const reset = () => {
    setPhase('init');
    setScanProgress(0);
    setChallengeIdx(0);
    setLivenessScore(0);
    setDeepfakeScore(0);
    setLandmarksVisible(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <AuthStepper currentStep="facial" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Step 1 — Facial Liveness Detection</h1>
          <p className="text-muted-foreground mt-1">AI-powered deepfake detection with 3D liveness analysis</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Camera Feed — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="shadow-card overflow-hidden">
              <CardContent className="p-0">
                {/* Camera Panel */}
                <div className="relative bg-navy-900 aspect-[4/3] flex items-center justify-center overflow-hidden">
                  {/* Simulated camera background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900" />

                  {/* Scan overlay */}
                  {phase === 'scanning' && (
                    <div className="absolute inset-0 z-10">
                      <div className="scan-line absolute w-full h-0.5 bg-emerald/60 shadow-glow-emerald" />
                      <div className="absolute inset-0 border-2 border-emerald/30 animate-pulse" />
                    </div>
                  )}

                  {/* Face oval guide */}
                  <div className={`absolute w-40 h-48 rounded-[50%] border-2 ${
                    phase === 'scanning' ? 'border-emerald animate-pulse' : 'border-white/30'
                  } transition-colors`} />

                  {/* Facial Landmarks */}
                  {landmarksVisible && FACIAL_LANDMARKS.map((pt, i) => (
                    <div
                      key={i}
                      className="landmark-dot absolute w-2 h-2 rounded-full bg-emerald shadow-glow-emerald"
                      style={{
                        left: `${pt.x}%`,
                        top: `${pt.y}%`,
                        animationDelay: `${i * 0.1}s`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}

                  {/* Corner brackets */}
                  {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 border-emerald/60 ${
                      i < 2 ? 'border-t-2' : 'border-b-2'
                    } ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'}`} />
                  ))}

                  {/* Status overlay */}
                  {phase === 'init' && (
                    <div className="relative z-20 text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-3 opacity-40" />
                      <p className="text-sm opacity-60">Camera ready</p>
                      <p className="text-xs opacity-40 mt-1">Demo mode — simulated feed</p>
                    </div>
                  )}

                  {phase === 'done' && (
                    <div className={`absolute inset-0 flex items-center justify-center z-20 ${
                      isAuthentic ? 'bg-emerald/20' : 'bg-danger/20'
                    }`}>
                      <div className="text-center text-white">
                        {isAuthentic ? (
                          <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-2 drop-shadow-lg" />
                        ) : (
                          <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-2" />
                        )}
                        <p className="font-bold text-lg">{isAuthentic ? 'Authentic Identity' : 'Spoofing Detected'}</p>
                        <p className="text-sm opacity-80">{Math.round(livenessScore)}% confidence</p>
                      </div>
                    </div>
                  )}

                  {/* Live indicator */}
                  {phase === 'scanning' && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1">
                      <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                      <span className="text-white text-xs font-semibold">LIVE</span>
                    </div>
                  )}

                  {/* AI label */}
                  <div className="absolute bottom-3 right-3 z-30 bg-black/50 rounded px-2 py-1 text-xs text-white/80">
                    DeepShield™ v2.1
                  </div>
                </div>

                {/* Progress bar */}
                {phase === 'scanning' && (
                  <div className="p-4 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Analysis progress</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenge prompt */}
            {phase === 'scanning' && (
              <Card className="border-primary/30 bg-primary/5 shadow-card animate-fade-in">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">LIVENESS CHALLENGE {challengeIdx + 1}/{LIVENESS_CHALLENGES.length}</p>
                    <p className="font-semibold text-foreground">{LIVENESS_CHALLENGES[challengeIdx]}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action button */}
            <div className="flex gap-3">
              {phase === 'init' && (
                <Button onClick={startScan} className="flex-1 bg-primary hover:bg-primary-light h-11 font-semibold">
                  <Camera className="w-4 h-4" />
                  Start Facial Analysis
                </Button>
              )}
              {phase === 'scanning' && (
                <Button disabled className="flex-1 h-11 bg-primary/50" >
                  <Scan className="w-4 h-4 animate-spin" />
                  Analysing...
                </Button>
              )}
              {phase === 'done' && (
                <>
                  <Button variant="outline" onClick={reset} className="border-border">
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </Button>
                  <Button onClick={proceed} className="flex-1 bg-emerald hover:bg-emerald-light text-white h-11 font-semibold shadow-glow-emerald" disabled={!isAuthentic}>
                    Continue to Voice
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {!isAuthentic && (
                    <Button variant="outline" onClick={proceed} className="text-muted-foreground">
                      Override (Demo)
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Panel — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {/* Deepfake Score */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Deepfake Confidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Circular score */}
                <div className="flex justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={livenessScore >= 75 ? 'hsl(var(--emerald))' : 'hsl(var(--danger))'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * livenessScore / 100)}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${livenessScore >= 75 ? 'text-emerald' : 'text-danger'}`}>
                        {Math.round(livenessScore)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Authentic</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Liveness Score</span>
                    <span className={`text-xs font-bold ${livenessScore >= 75 ? 'text-success' : 'text-danger'}`}>
                      {Math.round(livenessScore)}%
                    </span>
                  </div>
                  <Progress value={livenessScore} className="h-1.5" />

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Deepfake Probability</span>
                    <span className="text-xs font-bold text-danger">{Math.round(deepfakeScore)}%</span>
                  </div>
                  <Progress value={deepfakeScore} className="h-1.5 [&>div]:bg-danger" />
                </div>
              </CardContent>
            </Card>

            {/* Frame Analysis */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Frame Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: '3D Depth Map', value: phase === 'scanning' || phase === 'done' ? 'Active' : 'Standby', active: phase !== 'init' },
                  { label: 'Texture Authenticity', value: phase === 'done' ? `${Math.round(livenessScore)}%` : '—', active: phase === 'done' },
                  { label: 'Blink Detection', value: phase === 'done' ? 'Detected' : '—', active: phase === 'done' },
                  { label: 'Landmark Tracking', value: landmarksVisible ? `${FACIAL_LANDMARKS.length} pts` : '—', active: landmarksVisible },
                  { label: 'GAN Artifact Scan', value: phase === 'done' ? (isAuthentic ? 'Clean' : 'Found') : '—', active: phase === 'done' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.active ? 'text-emerald' : 'text-muted-foreground'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Result Card */}
            {phase === 'done' && (
              <Card className={`shadow-card border animate-fade-in ${isAuthentic ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg'}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  {isAuthentic ? (
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-bold text-sm ${isAuthentic ? 'text-success' : 'text-danger'}`}>
                      {isAuthentic ? 'Authentic Identity Verified' : 'Deepfake Attack Detected'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAuthentic
                        ? `Liveness confirmed at ${Math.round(livenessScore)}% confidence. No deepfake artifacts detected.`
                        : 'GAN-generated facial texture detected. Session flagged for review.'}
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

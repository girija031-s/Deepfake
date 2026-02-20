import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Smartphone, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { AuthStepper } from '@/components/AuthStepper';
import { useAuthFlow, getRiskLevel, getRiskScore, resetAuth } from '@/hooks/useAuthFlow';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

const RISK_CONFIG: Record<RiskLevel, {
  color: string; bg: string; border: string; label: string;
  icon: typeof CheckCircle; decision: string; action: string;
}> = {
  low: {
    color: 'text-success', bg: 'bg-success-bg', border: 'border-success',
    label: 'LOW RISK', icon: CheckCircle,
    decision: 'Access Granted',
    action: 'Authentication complete. No additional steps required. Proceeding to your banking dashboard.',
  },
  medium: {
    color: 'text-warning', bg: 'bg-warning-bg', border: 'border-warning',
    label: 'MEDIUM RISK', icon: AlertTriangle,
    decision: 'Step-Up Required',
    action: 'One-time passcode (OTP) sent to your registered mobile number. Please verify to continue.',
  },
  high: {
    color: 'text-danger', bg: 'bg-danger-bg', border: 'border-danger',
    label: 'HIGH RISK', icon: XCircle,
    decision: 'Session Flagged',
    action: 'This session has been flagged for human review. A security specialist will contact you within 10 minutes.',
  },
  critical: {
    color: 'text-danger', bg: 'bg-danger-bg', border: 'border-danger',
    label: 'CRITICAL RISK', icon: XCircle,
    decision: 'Account Locked',
    action: 'Your account has been temporarily locked due to suspected attack. Contact support to restore access.',
  },
};

const ATTACK_TYPES = ['Deepfake Face', 'Synthetic Voice', 'Bot Pattern', 'Replay Attack', 'Credential Stuffing'];

export default function RiskEngine() {
  const navigate = useNavigate();
  const { scores, username } = useAuthFlow();
  const [aggregating, setAggregating] = useState(true);
  const [displayRisk, setDisplayRisk] = useState(0);
  const [animatedScores, setAnimatedScores] = useState({ facial: 0, voice: 0, behavioral: 0 });
  const [done, setDone] = useState(false);

  const finalRiskScore = getRiskScore(scores);
  const riskLevel = getRiskLevel(scores);
  const config = RISK_CONFIG[riskLevel];
  const RiskIcon = config.icon;

  // Simulated risk factors
  const deviceTrust = 78 + Math.round(Math.random() * 15);
  const locationAnomaly = Math.round(Math.random() * 20);
  const timeRisk = new Date().getHours() < 6 || new Date().getHours() > 22 ? 35 : 8;
  const attackDetected = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  const attackProb = riskLevel === 'low' ? 2 : riskLevel === 'medium' ? 15 : riskLevel === 'high' ? 45 : 80;

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const t = Math.min(step / 30, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setAnimatedScores({
        facial: Math.round((scores.facial ?? 0) * eased),
        voice: Math.round((scores.voice ?? 0) * eased),
        behavioral: Math.round((scores.behavioral ?? 0) * eased),
      });
      setDisplayRisk(Math.round(finalRiskScore * eased));

      if (step >= 30) {
        clearInterval(interval);
        setAggregating(false);
        setDone(true);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <AuthStepper currentStep="risk" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Step 4 — Risk-Based Authentication Engine</h1>
          <p className="text-muted-foreground mt-1">Aggregating all biometric signals for final authentication decision</p>
        </div>

        {/* Main Risk Score */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Aggregate Score */}
          <Card className={`shadow-card-lg col-span-1 ${done ? `${config.border} border-2` : ''} transition-all duration-500`}>
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Overall Risk Score</p>

              <div className="relative w-36 h-36 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={
                      riskLevel === 'low' ? 'hsl(var(--success))' :
                      riskLevel === 'medium' ? 'hsl(var(--warning))' :
                      'hsl(var(--danger))'
                    }
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * displayRisk / 100)}
                    className="transition-all duration-100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {aggregating ? (
                    <span className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className={`text-3xl font-bold ${config.color}`}>{displayRisk}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </>
                  )}
                </div>
              </div>

              {done && (
                <div className={`w-full text-center rounded-lg py-2 px-3 ${config.bg} ${config.border} border animate-fade-in`}>
                  <RiskIcon className={`w-5 h-5 ${config.color} mx-auto mb-1`} />
                  <p className={`text-xs font-bold ${config.color} uppercase tracking-wide`}>{config.label}</p>
                  <p className="text-sm font-bold text-foreground mt-1">{config.decision}</p>
                </div>
              )}

              {aggregating && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Aggregating signals...</p>
                  <p className="text-xs text-muted-foreground mt-1">Running ML risk model</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Biometric Breakdown */}
          <Card className="shadow-card col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Biometric Signal Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: 'Facial Liveness', score: animatedScores.facial, icon: '👤', weight: '40%' },
                { label: 'Voice Biometrics', score: animatedScores.voice, icon: '🎤', weight: '35%' },
                { label: 'Behavioral Patterns', score: animatedScores.behavioral, icon: '⌨️', weight: '25%' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">weight {item.weight}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${item.score >= 75 ? 'text-success' : item.score >= 60 ? 'text-warning' : 'text-danger'}`}>
                        {item.score}%
                      </span>
                      {item.score >= 75 ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={item.score}
                    className={`h-2 ${item.score < 60 ? '[&>div]:bg-danger' : item.score < 75 ? '[&>div]:bg-warning' : ''}`}
                  />
                </div>
              ))}

              {/* Additional risk factors */}
              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
                {[
                  { icon: Smartphone, label: 'Device Trust', value: `${deviceTrust}%`, good: deviceTrust >= 70 },
                  { icon: MapPin, label: 'Location Risk', value: `${locationAnomaly}%`, good: locationAnomaly < 25 },
                  { icon: Clock, label: 'Time-of-Day Risk', value: `${timeRisk}%`, good: timeRisk < 20 },
                  { icon: TrendingUp, label: 'Session Pattern', value: 'Normal', good: true },
                ].map(factor => (
                  <div key={factor.label} className="flex items-center gap-2 bg-muted/40 rounded-lg p-2.5">
                    <factor.icon className={`w-4 h-4 flex-shrink-0 ${factor.good ? 'text-success' : 'text-warning'}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{factor.label}</p>
                      <p className={`text-xs font-bold ${factor.good ? 'text-success' : 'text-warning'}`}>{factor.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision + Attack Classifier */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Decision */}
          {done && (
            <Card className={`shadow-card ${config.border} border-2 animate-fade-in`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${config.color}`} />
                  Authentication Decision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-xl p-4 ${config.bg} ${config.border} border mb-4`}>
                  <p className={`text-lg font-bold ${config.color} mb-1`}>{config.decision}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{config.action}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => { resetAuth(); navigate('/'); }}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Session
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-primary hover:bg-primary-light"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attack Classifier */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Real-Time Threat Classifier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ATTACK_TYPES.map((attack, i) => {
                const prob = i === 0 && riskLevel !== 'low' ? attackProb :
                  i === 1 && riskLevel === 'high' ? attackProb * 0.7 :
                  Math.max(1, Math.round(Math.random() * 15));
                const isThreaten = prob > 30;

                return (
                  <div key={attack}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">{attack}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isThreaten ? 'text-danger' : 'text-success'}`}>
                          {done ? `${prob}%` : '—'}
                        </span>
                        {done && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isThreaten ? 'bg-danger' : 'bg-success'}`} />
                        )}
                      </div>
                    </div>
                    {done && (
                      <Progress value={prob} className={`h-1 ${isThreaten ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`} />
                    )}
                  </div>
                );
              })}

              {!done && (
                <div className="flex items-center gap-2 py-2">
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-xs text-muted-foreground">Running threat classification...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation to Architecture */}
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/architecture')} className="border-border">
            View System Architecture
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin')} className="border-border">
            Admin Security Panel
          </Button>
        </div>
      </div>
    </div>
  );
}

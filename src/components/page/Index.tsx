import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Mic, Brain, ChevronRight, CheckCircle, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { setAuthUsername, setAuthStep } from '@/hooks/useAuthFlow';

const FEATURES = [
  {
    icon: Eye,
    title: 'Facial Liveness Detection',
    desc: 'Real-time deepfake detection using 3D depth mapping and texture analysis. Detects AI-generated faces with 99.2% accuracy.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Mic,
    title: 'Voice Biometrics',
    desc: 'Voiceprint authentication with anti-spoofing. Detects synthetic voices, replay attacks, and audio deepfakes.',
    color: 'text-emerald',
    bg: 'bg-emerald/10',
  },
  {
    icon: Brain,
    title: 'Behavioral Biometrics',
    desc: 'Continuous identity verification through keystroke dynamics, mouse patterns, and touch cadence analysis.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Shield,
    title: 'Risk-Based Auth Engine',
    desc: 'Adaptive ML risk scoring that aggregates all signals for real-time threat classification and decision routing.',
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
];

const TRUST_STATS = [
  { value: '99.2%', label: 'Deepfake Detection Rate' },
  { value: '<0.1%', label: 'False Accept Rate' },
  { value: '2.3s', label: 'Avg Auth Time' },
  { value: 'ISO 27001', label: 'Certified' },
];

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    setLoading(true);
    setAuthUsername(username);
    setAuthStep('facial');
    setTimeout(() => {
      navigate('/auth/facial');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 40}px`,
                height: `${(i + 1) * 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 - i * 0.01,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald/20 border border-emerald/40 rounded-full px-4 py-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                AI-Powered Security — Active
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Deepfake-Resilient
                <span className="block text-emerald mt-1">Digital Authentication</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-lg">
                Protect your banking platform with multimodal biometrics that detect AI-generated deepfakes, synthetic voices, and bot behaviour in real time.
              </p>

              <div className="flex flex-wrap gap-3">
                {['PSD2 Compliant', 'GDPR Ready', 'FIDO2 Certified', 'NIST 800-63B'].map(badge => (
                  <span key={badge} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3 text-emerald" />
                    {badge}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {TRUST_STATS.map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-emerald">{stat.value}</div>
                    <div className="text-xs text-primary-foreground/70 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Login Card */}
            <div className="animate-slide-in">
              <Card className="shadow-card-lg border-white/10 bg-white">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-glow-navy">
                      <Lock className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Secure Sign In</h2>
                    <p className="text-muted-foreground text-sm mt-1">Multi-factor biometric authentication</p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
                      <Input
                        placeholder="john.smith"
                        value={username}
                        onChange={e => { setUsername(e.target.value); setError(''); }}
                        className="border-border focus-visible:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border-border focus-visible:ring-primary"
                      />
                    </div>

                    {error && (
                      <p className="text-danger text-sm bg-danger-bg rounded-md px-3 py-2">{error}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-light text-primary-foreground h-11 font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Initiating Biometric Auth...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Sign In Securely
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-3">Authentication flow includes:</p>
                    <div className="flex justify-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground"><Eye className="w-3.5 h-3.5" /> Face</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Mic className="w-3.5 h-3.5" /> Voice</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Brain className="w-3.5 h-3.5" /> Behavior</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Shield className="w-3.5 h-3.5" /> Risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">4-Layer Authentication Pipeline</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Every login runs through our adaptive security engine, combining multiple biometric signals for maximum protection.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <Card key={f.title} className="shadow-card hover:shadow-card-lg transition-shadow group border-border">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">STEP {i + 1}</div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald" />
            <span className="font-bold">SecureBank AI Auth Shield</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            Interactive prototype — simulated biometric AI scoring
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Globe className="w-3.5 h-3.5" />
            ISO 27001 · PSD2 · GDPR · FIDO2
          </div>
        </div>
      </footer>
    </div>
  );
}

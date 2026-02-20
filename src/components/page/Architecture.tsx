import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle, Server, Layers, Lock, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';

const PIPELINE_NODES = [
  { id: 'user', label: 'User', sublabel: 'Banking App', color: 'bg-primary', textColor: 'text-primary-foreground', icon: '👤' },
  { id: 'liveness', label: 'Facial Liveness', sublabel: 'DeepFace + 3D CNN', color: 'bg-emerald', textColor: 'text-white', icon: '🎭' },
  { id: 'voice', label: 'Voice Biometrics', sublabel: 'SpeakerNet + ASV', color: 'bg-emerald', textColor: 'text-white', icon: '🎤' },
  { id: 'behavioral', label: 'Behavioral', sublabel: 'LSTM + Keystroke', color: 'bg-emerald', textColor: 'text-white', icon: '⌨️' },
  { id: 'risk', label: 'Risk Engine', sublabel: 'XGBoost + Rules', color: 'bg-warning', textColor: 'text-white', icon: '🛡️' },
  { id: 'decision', label: 'Decision', sublabel: 'Grant / Flag / Block', color: 'bg-danger', textColor: 'text-white', icon: '✅' },
];

const TECH_STACK = [
  { category: 'Facial Analysis', items: ['DeepFace (MobileNet)', 'FaceSwap Detection CNN', '3D Depth Liveness (IR sensor)', 'OpenCV landmarks'] },
  { category: 'Voice Biometrics', items: ['ECAPA-TDNN speaker model', 'RawNet2 anti-spoofing', 'x-Vector embeddings', 'MFCC feature extraction'] },
  { category: 'Behavioral AI', items: ['LSTM keystroke model', 'Isolation Forest anomaly', 'Mouse dynamics SVM', 'Touch pattern clustering'] },
  { category: 'Risk Engine', items: ['XGBoost risk classifier', 'SHAP explainability', 'Rule-based SIEM', 'Real-time ML pipeline'] },
  { category: 'Infrastructure', items: ['Kubernetes + Docker', 'Redis session store', 'Kafka event streaming', 'HSM key management'] },
];

const COMPLIANCE = [
  { name: 'GDPR', desc: 'Biometric data minimisation, right to erasure, consent management', status: 'Compliant' },
  { name: 'PSD2 SCA', desc: 'Strong Customer Authentication — 2 of 3 factors required', status: 'Compliant' },
  { name: 'ISO 27001', desc: 'Information security management system certification', status: 'Certified' },
  { name: 'FIDO2 / WebAuthn', desc: 'Phishing-resistant passwordless authentication standard', status: 'Implemented' },
  { name: 'NIST 800-63B', desc: 'Digital identity guidelines for authentication assurance', status: 'AAL3 Ready' },
  { name: 'eIDAS', desc: 'EU electronic identification and trust services framework', status: 'Compliant' },
];

const FEASIBILITY = [
  {
    title: 'Real-World Deployment',
    points: [
      'Facial liveness APIs: AWS Rekognition, Microsoft Azure Face, FaceTec',
      'Voice: Nuance Gatekeeper, ID R&D VoiceKey, Pindrop',
      'Behavioral: BioCatch, TypingDNA, BehavioSec',
      'Risk Engine: NICE Actimize, ThreatMetrix, Sardine.ai',
    ],
  },
  {
    title: 'Technical Challenges',
    points: [
      'Cross-device biometric calibration (mobile vs desktop)',
      'Network latency for real-time ML inference (<300ms target)',
      'Edge cases: illness, aging, environmental noise',
      'Adversarial attacks on biometric models (GAN countermeasures)',
    ],
  },
  {
    title: 'Privacy Architecture',
    points: [
      'Biometric templates stored as encrypted hashes, never raw data',
      'On-device processing where possible (federated inference)',
      'Explicit consent + granular data lifecycle management',
      'Hardware Security Module (HSM) for key management',
    ],
  },
];

export default function Architecture() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-4">
            <Layers className="w-4 h-4" />
            System Architecture
          </div>
          <h1 className="text-3xl font-bold text-foreground">Authentication Pipeline Architecture</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Full technical architecture of the AI-powered deepfake-resilient authentication system, from user input to final decision.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <Card className="shadow-card-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Authentication Pipeline Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop flow */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-4">
              {PIPELINE_NODES.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`rounded-xl p-4 text-center ${node.color} shadow-card min-w-[100px]`}>
                    <div className="text-2xl mb-1">{node.icon}</div>
                    <p className={`text-xs font-bold ${node.textColor}`}>{node.label}</p>
                    <p className={`text-[10px] ${node.textColor} opacity-80 mt-0.5`}>{node.sublabel}</p>
                  </div>
                  {i < PIPELINE_NODES.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile flow */}
            <div className="md:hidden space-y-2">
              {PIPELINE_NODES.map((node, i) => (
                <div key={node.id} className="flex items-center gap-3">
                  <div className={`rounded-xl p-3 flex items-center gap-3 flex-1 ${node.color}`}>
                    <span className="text-xl">{node.icon}</span>
                    <div>
                      <p className={`text-sm font-bold ${node.textColor}`}>{node.label}</p>
                      <p className={`text-xs ${node.textColor} opacity-80`}>{node.sublabel}</p>
                    </div>
                  </div>
                  {i < PIPELINE_NODES.length - 1 && (
                    <div className="text-muted-foreground">↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Sub-components */}
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Data Collection Layer', items: ['Camera API (getUserMedia)', 'Web Audio API', 'Mouse/Touch Events', 'Keystroke listeners'], color: 'border-primary/30 bg-primary/5' },
                { label: 'Processing Layer', items: ['On-device pre-processing', 'Secure API transmission (TLS 1.3)', 'Model inference cluster', 'Fraud signal aggregation'], color: 'border-emerald/30 bg-emerald/5' },
                { label: 'Decision Layer', items: ['Risk score computation', 'Adaptive MFA trigger', 'Audit log write', 'Session token issuance'], color: 'border-warning/30 bg-warning/5' },
              ].map(layer => (
                <div key={layer.label} className={`rounded-xl border p-4 ${layer.color}`}>
                  <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">{layer.label}</p>
                  {layer.items.map(item => (
                    <p key={item} className="text-xs text-muted-foreground flex items-start gap-1.5 mb-1">
                      <span className="text-emerald mt-0.5">›</span> {item}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TECH_STACK.map(stack => (
            <Card key={stack.category} className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">{stack.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {stack.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Server className="w-3 h-3 text-emerald flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Latency card */}
          <Card className="shadow-card bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary">Performance Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Facial Analysis', value: '< 150ms' },
                { label: 'Voice Processing', value: '< 200ms' },
                { label: 'Behavioral Scoring', value: '< 50ms' },
                { label: 'Risk Aggregation', value: '< 100ms' },
                { label: 'Total Auth Latency', value: '< 2.5s' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-emerald">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Compliance */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Regulatory Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPLIANCE.map(item => (
                <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-success-bg border border-success/30">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-success bg-success/10 rounded px-1.5 py-0.5 uppercase">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feasibility */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {FEASIBILITY.map((section, i) => (
            <Card key={section.title} className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.points.map(point => (
                    <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className={`flex-shrink-0 mt-0.5 font-bold ${i === 1 ? 'text-warning' : 'text-emerald'}`}>
                        {i === 1 ? '⚠' : '✓'}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary-light">
            <Lock className="w-4 h-4" />
            Try Authentication Demo
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin')} className="border-border">
            Security Admin Panel
          </Button>
        </div>
      </div>
    </div>
  );
}

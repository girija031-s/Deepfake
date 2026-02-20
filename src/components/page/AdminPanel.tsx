import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, Users, Clock, TrendingDown, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/Header';

type RiskLabel = 'Low' | 'Medium' | 'High' | 'Critical';

interface SessionEntry {
  id: string;
  userId: string;
  time: string;
  facial: number;
  voice: number;
  behavioral: number;
  riskScore: number;
  decision: string;
  risk: RiskLabel;
}

const generateSession = (i: number): SessionEntry => {
  const facial = Math.round(60 + Math.random() * 38);
  const voice = Math.round(55 + Math.random() * 40);
  const behavioral = Math.round(60 + Math.random() * 36);
  const avg = (facial + voice + behavioral) / 3;
  const riskScore = Math.round(100 - avg);

  let risk: RiskLabel = 'Low';
  let decision = 'Access Granted';
  if (riskScore > 70) { risk = 'Critical'; decision = 'Account Locked'; }
  else if (riskScore > 50) { risk = 'High'; decision = 'Human Review'; }
  else if (riskScore > 30) { risk = 'Medium'; decision = 'OTP Required'; }

  const mins = Math.floor(Math.random() * 60);
  const secs = Math.floor(Math.random() * 60);
  const userId = `USR-${1000 + i}`;

  return { id: `SES-${7000 + i}`, userId, time: `${mins}m ${secs}s ago`, facial, voice, behavioral, riskScore, decision, risk };
};

const THREAT_ATTACKS = [
  { type: 'Deepfake Face', count: 14, severity: 'Critical', trend: 'up' },
  { type: 'Synthetic Voice', count: 9, severity: 'High', trend: 'down' },
  { type: 'Replay Attack', count: 6, severity: 'High', trend: 'down' },
  { type: 'Credential Stuffing', count: 23, severity: 'Medium', trend: 'up' },
  { type: 'Bot Pattern', count: 47, severity: 'Medium', trend: 'down' },
  { type: 'Account Takeover', count: 3, severity: 'Critical', trend: 'up' },
];

const RISK_COLOR: Record<RiskLabel, string> = {
  Low: 'text-success bg-success-bg',
  Medium: 'text-warning bg-warning-bg',
  High: 'text-danger bg-danger-bg',
  Critical: 'text-danger bg-danger-bg font-bold',
};

const SEVERITY_COLOR: Record<string, string> = {
  Critical: 'text-danger',
  High: 'text-warning',
  Medium: 'text-warning',
  Low: 'text-success',
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionEntry[]>(() =>
    Array.from({ length: 12 }, (_, i) => generateSession(i))
  );
  const [tick, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setSessions(prev => [generateSession(prev.length + 12), ...prev.slice(0, 11)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalSessions = sessions.length;
  const blocked = sessions.filter(s => s.decision === 'Account Locked' || s.decision === 'Human Review').length;
  const approved = sessions.filter(s => s.decision === 'Access Granted').length;
  const avgRisk = Math.round(sessions.reduce((a, s) => a + s.riskScore, 0) / sessions.length);

  const FAR = 0.08;
  const FRR = 1.2;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success uppercase tracking-wide">Live Monitoring</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Security Admin Overview</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Real-time authentication session monitoring and threat detection</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/architecture')} className="border-border text-sm">
              Architecture
            </Button>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary-light text-sm">
              <Shield className="w-4 h-4" />
              Auth Demo
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Sessions', value: '1,247', icon: Users, change: '+12', positive: true },
            { label: 'Threats Blocked', value: `${blocked + 47}`, icon: Shield, change: '+3', positive: false },
            { label: 'Avg Risk Score', value: `${avgRisk}/100`, icon: Activity, change: '-2', positive: true },
            { label: 'Auth Success Rate', value: '97.3%', icon: Eye, change: '+0.2%', positive: true },
          ].map(kpi => (
            <Card key={kpi.label} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                    <p className={`text-xs mt-1 flex items-center gap-0.5 ${kpi.positive ? 'text-success' : 'text-danger'}`}>
                      {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.change} today
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Threat Map Simulated */}
          <Card className="shadow-card col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Attack Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {THREAT_ATTACKS.map(attack => (
                <div key={attack.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${SEVERITY_COLOR[attack.severity]}`}>
                        {attack.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-foreground">{attack.count}</span>
                      {attack.trend === 'up'
                        ? <TrendingUp className="w-3 h-3 text-danger" />
                        : <TrendingDown className="w-3 h-3 text-success" />}
                    </div>
                  </div>
                  <Progress
                    value={(attack.count / 50) * 100}
                    className={`h-1.5 ${attack.severity === 'Critical' ? '[&>div]:bg-danger' : attack.severity === 'High' ? '[&>div]:bg-warning' : ''}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detection Accuracy Metrics */}
          <Card className="shadow-card col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Detection Accuracy Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'FAR', sublabel: 'False Accept Rate', value: `${FAR}%`, desc: 'Fraudsters granted access', good: true },
                  { label: 'FRR', sublabel: 'False Reject Rate', value: `${FRR}%`, desc: 'Legitimate users blocked', good: true },
                  { label: 'EER', sublabel: 'Equal Error Rate', value: '0.64%', desc: 'FAR = FRR crossover point', good: true },
                ].map(metric => (
                  <div key={metric.label} className="text-center p-4 bg-muted/30 rounded-xl">
                    <p className="text-3xl font-bold text-emerald">{metric.value}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Deepfake Detection Rate', value: 99.2 },
                  { label: 'Synthetic Voice Detection', value: 97.8 },
                  { label: 'Bot Pattern Recognition', value: 98.5 },
                  { label: 'Replay Attack Prevention', value: 99.7 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-emerald">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Session Feed */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Live Session Feed</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Auto-refreshes every 3 seconds</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              LIVE
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Session ID</TableHead>
                    <TableHead className="text-xs">User ID</TableHead>
                    <TableHead className="text-xs">Time</TableHead>
                    <TableHead className="text-xs text-center">Facial</TableHead>
                    <TableHead className="text-xs text-center">Voice</TableHead>
                    <TableHead className="text-xs text-center">Behavioral</TableHead>
                    <TableHead className="text-xs text-center">Risk</TableHead>
                    <TableHead className="text-xs">Decision</TableHead>
                    <TableHead className="text-xs">Threat Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session, i) => (
                    <TableRow key={session.id} className={`text-xs ${i === 0 ? 'bg-primary/5 animate-fade-in' : ''}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{session.id}</TableCell>
                      <TableCell className="font-semibold text-foreground">{session.userId}</TableCell>
                      <TableCell className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{session.time}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={session.facial >= 75 ? 'text-success font-bold' : 'text-warning font-bold'}>{session.facial}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={session.voice >= 75 ? 'text-success font-bold' : 'text-warning font-bold'}>{session.voice}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={session.behavioral >= 70 ? 'text-success font-bold' : 'text-warning font-bold'}>{session.behavioral}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={session.riskScore > 50 ? 'text-danger font-bold' : session.riskScore > 30 ? 'text-warning font-bold' : 'text-success font-bold'}>
                          {session.riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${
                          session.decision === 'Access Granted' ? 'text-success' :
                          session.decision === 'OTP Required' ? 'text-warning' : 'text-danger'
                        }`}>
                          {session.decision}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${RISK_COLOR[session.risk]}`}>
                          {session.risk}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

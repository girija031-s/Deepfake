import { Shield, Lock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { resetAuth } from '@/hooks/useAuthFlow';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    resetAuth();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-card-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-primary-foreground font-bold text-lg tracking-tight">SecureBank</span>
            <span className="text-emerald text-[10px] font-semibold tracking-widest uppercase">AI Auth Shield</span>
          </div>
        </button>

        {/* Desktop Nav */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-light" onClick={() => navigate('/architecture')}>
              Architecture
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-light" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
            <Button size="sm" className="bg-emerald hover:bg-emerald-light text-white ml-2 shadow-glow-emerald" onClick={handleLogoClick}>
              <Lock className="w-3.5 h-3.5" />
              Sign In
            </Button>
          </nav>
        )}

        {/* Mobile Menu */}
        {showNav && (
          <button
            className="md:hidden text-primary-foreground p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* Compliance badges */}
        <div className="hidden lg:flex items-center gap-2">
          {['PSD2', 'GDPR', 'FIDO2'].map(badge => (
            <span key={badge} className="text-[10px] font-bold px-2 py-0.5 rounded border border-emerald/40 text-emerald bg-emerald/10">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-light px-4 pb-4 flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="text-primary-foreground justify-start" onClick={() => { navigate('/architecture'); setMenuOpen(false); }}>
            Architecture
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground justify-start" onClick={() => { navigate('/admin'); setMenuOpen(false); }}>
            Admin Panel
          </Button>
          <Button size="sm" className="bg-emerald hover:bg-emerald-light text-white justify-start" onClick={() => { handleLogoClick(); setMenuOpen(false); }}>
            <Lock className="w-3.5 h-3.5" />
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}

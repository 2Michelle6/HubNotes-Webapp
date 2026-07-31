import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Gamepad2, Sparkles, UserCheck } from 'lucide-react';
import logoIcon from '../assets/logonobg.png';

export default function Landing() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showAuth = (signUp) => {
    setIsSignUp(signUp);
    document.querySelector('#account-access')?.scrollInto({ behavior: 'smooth', block: 'center' });
  };

  const goToHome = () => navigate('/home', { replace: true });

  const handleAuthenticationSubmit = (event) => {
    event.preventDefault();
    // Authentication will be added later; both successful paths enter the app at Home.
    goToHome();
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        
        <div className="nav-brand">
          <img className="nav-logo" src={logoIcon} alt="" />
          <h1 className="nav-title">HubNotes</h1>
        </div>
        <nav className="nav-actions" aria-label="Main navigation">
          <button type="button" className="nav-link" onClick={() => showAuth(false)}>Sign in</button>
          <button type="button" className="nav-link" onClick={() => showAuth(true)}>Create account</button>
          <button type="button" className="nav-link nav-link--accent" onClick={goToHome}>Get started</button>
        </nav>
      </header>

      <main className="landing-hero-grid">
        <section className="sign-in-card" aria-labelledby="hero-title">
          <p className="eyebrow-badge"><Sparkles size={15} /> Gamified active-recall study</p>
          <h2 id="hero-title" className="hero-title">Compile notes. Level up your study.</h2>
          <p className="hero-description">
            HubNotes brings active recall to life. Combine course material, PDFs, and custom flashcard decks into playable mini-games.
          </p>
          <div className="features-list">
            <span className="feature-item"><span className="feature-icon-box"><BookOpen size={16} /></span>Note compilation</span>
            <span className="feature-item"><span className="feature-icon-box"><Gamepad2 size={16} /></span>Game mode</span>
            <span className="feature-item"><span className="feature-icon-box"><UserCheck size={16} /></span>Guest mode</span>
          </div>
          <button type="button" className="btn-brutal btn-primary" onClick={goToHome}>
            Try as guest (no account required) <ArrowRight size={18} />
          </button>
        </section>

        <section id="account-access" className="auth-card" aria-labelledby="auth-title">
          <div className="auth-header">
            <h2 id="auth-title">{isSignUp ? 'Join HubNotes' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Create your profile to sync your progress.' : 'Sign in to access your saved courses.'}</p>
          </div>
          <div className="auth-tabs" aria-label="Account action">
            <button type="button" className={`tab-btn ${!isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(false)}>Sign in</button>
            <button type="button" className={`tab-btn ${isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(true)}>Create account</button>
          </div>
          <form className="auth-form" onSubmit={handleAuthenticationSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label><input className="brutal-input" id="email" type="email" placeholder="student@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div className="form-group"><label htmlFor="password">Password</label><input className="brutal-input" id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            <button type="submit" className="btn-brutal btn-primary btn-full">{isSignUp ? 'Create account' : 'Sign in'}</button>
          </form>
          <div className="guest-divider"><span>or</span></div>
          <button type="button" className="btn-brutal btn-secondary btn-full" onClick={goToHome}>Get started without an account</button>
        </section>
      </main>
    </div>
  );
}

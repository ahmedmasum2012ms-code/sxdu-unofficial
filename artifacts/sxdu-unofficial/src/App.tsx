import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Heart,
  Instagram,
  MapPin,
  Menu,
  Play,
  Share2,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type ArtTone = 'coral' | 'gold' | 'blue' | 'cream' | 'ink';

const highlights = [
  { id: 'annual-day', label: 'Annual day', short: 'AD', tone: 'coral' as ArtTone, count: '12 stories' },
  { id: 'sports', label: 'On the field', short: 'OF', tone: 'blue' as ArtTone, count: '08 stories' },
  { id: 'farewell', label: 'Farewell 25', short: '25', tone: 'gold' as ArtTone, count: '19 stories' },
  { id: 'campus', label: 'Campus life', short: 'CL', tone: 'cream' as ArtTone, count: '24 stories' },
  { id: 'voices', label: 'Student voices', short: 'SV', tone: 'ink' as ArtTone, count: '11 stories' },
];

const events = [
  { id: 'independence', date: '15 AUG', title: 'Independence Day', type: 'Campus moment', note: 'A courtyard full of flags, choir voices, and the kind of pride that travels home.', tone: 'coral' as ArtTone, mark: '01' },
  { id: 'sports-meet', date: '02 SEP', title: 'Inter-house sports meet', type: 'On the field', note: 'The long jump pit, the loudest stands, and a photo finish nobody stopped talking about.', tone: 'blue' as ArtTone, mark: '02' },
  { id: 'farewell', date: '18 FEB', title: 'Farewell, class of 2025', type: 'A last first day', note: 'Notes in uniform pockets, one more roll call, and an entire corridor saying goodbye.', tone: 'gold' as ArtTone, mark: '03' },
];

const community = [
  { name: 'The corridor crew', role: 'Student photographers', initials: 'CC', detail: 'Always first to the good light.', tone: 'coral' as ArtTone },
  { name: 'House captains', role: 'The energy department', initials: 'HC', detail: 'Turning friendly rivalry into school spirit.', tone: 'blue' as ArtTone },
  { name: 'The alumni desk', role: 'Memory keepers', initials: 'AD', detail: 'Connecting yesterday to what is next.', tone: 'gold' as ArtTone },
];

function Crest({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? 'crest crest-small' : 'crest'} aria-label="St. Xavier's Higher Secondary School crest">
      <svg viewBox="0 0 120 120" role="img">
        <circle cx="60" cy="60" r="56" fill="#f4f0e6" stroke="#172a4c" strokeWidth="3" />
        <path d="M18 34 Q6 53 20 82" fill="none" stroke="#b98b35" strokeWidth="5" />
        <path d="M102 34 Q114 53 100 82" fill="none" stroke="#b98b35" strokeWidth="5" />
        <path d="M23 36 l-7 -4 M20 45 l-8 -2 M20 55 l-8 1 M22 65 l-8 4 M27 74 l-7 6 M97 36 l7 -4 M100 45 l8 -2 M100 55 l8 1 M98 65 l8 4 M93 74 l7 6" stroke="#b98b35" strokeWidth="2" />
        <path d="M37 28 L83 28 L91 39 L87 78 L60 94 L33 78 L29 39 Z" fill="#172a4c" stroke="#b98b35" strokeWidth="3" />
        <path d="M60 32 V72 M42 52 H78" stroke="#cba654" strokeWidth="4" />
        <path d="M45 77 Q60 69 75 77 L75 86 Q60 78 45 86Z" fill="#f4f0e6" />
        <path d="M52 58 Q60 49 68 58" fill="none" stroke="#f4f0e6" strokeWidth="2" />
        <circle cx="60" cy="42" r="4" fill="#cba654" />
      </svg>
      {!small && <span>ST. XAVIER'S H.S. SCHOOL</span>}
    </div>
  );
}

function ArtBlock({ tone, label, compact = false }: { tone: ArtTone; label: string; compact?: boolean }) {
  return (
    <div className={`art-block art-${tone} ${compact ? 'art-compact' : ''}`} aria-label={label}>
      <div className="art-grid" />
      <span className="art-mark">{label}</span>
      <span className="art-orbit" />
    </div>
  );
}

function SectionIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy: string; action?: string }) {
  return (
    <div className="section-intro reveal">
      <div>
        <div className="mono eyebrow">{eyebrow}</div>
        <h2 className="display section-title">{title}</h2>
      </div>
      <div className="section-copy">
        <p>{copy}</p>
        {action && <button className="text-link" data-testid={`button-${eyebrow.toLowerCase().replaceAll(' ', '-')}`} onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>{action}<ArrowUpRight size={15} /></button>}
      </div>
    </div>
  );
}

function Home() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [shared, setShared] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState('annual-day');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const sections = ['home', 'story', 'events', 'community'];
      const y = window.scrollY + 180;
      let current = 'home';
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= y) current = id;
      });
      setActiveNav(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shareProfile = async () => {
    const shareData = { title: 'SXDU Unofficial', text: 'School memories, events, and student energy from St. Xavier’s Higher Secondary School, Dulijan.', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      setShared(false);
    }
  };

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={() => jumpTo('home')} data-testid="button-brand-home">
          <Crest small />
          <span className="brand-type"><strong>SXDU</strong><span>UNOFFICIAL</span></span>
        </button>
        <nav className={`topnav ${menuOpen ? 'topnav-open' : ''}`} aria-label="Main navigation">
          {[
            ['home', 'Profile'],
            ['story', 'Our story'],
            ['events', 'The feed'],
            ['community', 'Community'],
          ].map(([id, label]) => (
            <button key={id} className={activeNav === id ? 'nav-active' : ''} onClick={() => jumpTo(id)} data-testid={`button-nav-${id}`}>
              {label}<span />
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button className="icon-button desktop-only" onClick={shareProfile} aria-label="Share profile" data-testid="button-share-top"><Share2 size={17} /></button>
          <button className="outline-action desktop-only" onClick={() => setIsFollowing(!isFollowing)} data-testid="button-follow-top">{isFollowing ? 'Following' : 'Follow page'}</button>
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" data-testid="button-menu"><Menu size={20} /></button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section-wrap">
          <div className="hero-copy reveal">
            <div className="kicker"><CircleDot size={13} /> A student-run community presence <span>•</span> Dulijan, Assam</div>
            <h1 className="display">The school<br /><em>as we remember it.</em></h1>
            <p className="hero-lede">An unofficial archive of big days, small wins, familiar faces, and the electric in-between of St. Xavier’s Higher Secondary School.</p>
            <div className="hero-actions">
              <button className={`primary-action ${isFollowing ? 'is-following' : ''}`} onClick={() => setIsFollowing(!isFollowing)} data-testid="button-follow-hero">
                {isFollowing ? <><Check size={16} /> Following SXDU</> : <>Follow the story <ArrowDownRight size={17} /></>}
              </button>
              <button className="quiet-action" onClick={shareProfile} data-testid="button-share-hero"><Share2 size={16} /> {shared ? 'Link copied' : 'Share profile'}</button>
            </div>
          </div>
          <div className="hero-visual reveal delay-2">
            <div className="hero-stamp mono">VOL. 04<br />2025—26</div>
            <div className="hero-collage">
              <div className="collage-sky"><span>THE<br />XAVIER<br />CHRONICLE</span><Camera size={24} /></div>
              <div className="collage-paper"><Crest /><span className="mono">rooted / restless</span></div>
              <div className="collage-red"><span>STAY<br />CURIOUS</span><ArrowUpRight size={26} /></div>
            </div>
            <div className="floating-note mono">No official filter<br />just real school life</div>
          </div>
        </section>

        <div className="ticker" aria-label="Community updates">
          <div className="ticker-inner marquee-track">
            <span>MEMORIES WORTH KEEPING</span><i>✳</i><span>STUDENT ENERGY, UNEDITED</span><i>✳</i><span>DULIJAN IN FRAME</span><i>✳</i><span>MEMORIES WORTH KEEPING</span><i>✳</i><span>STUDENT ENERGY, UNEDITED</span><i>✳</i><span>DULIJAN IN FRAME</span><i>✳</i>
          </div>
        </div>

        <section className="profile-panel section-wrap reveal">
          <div className="profile-main">
            <div className="profile-avatar"><Crest /></div>
            <div className="profile-name-row">
              <div>
                <div className="handle">@sxdu_unofficial <span className="verified-dot">✓</span></div>
                <h2 className="display">SXDU Unofficial</h2>
                <p>St. Xavier’s Higher Secondary School, Dulijan</p>
              </div>
              <div className="profile-mobile-actions mobile-only">
                <button onClick={() => setIsFollowing(!isFollowing)} className="mini-follow" data-testid="button-follow-mobile">{isFollowing ? 'Following' : 'Follow'}</button>
                <button onClick={shareProfile} className="mini-share" aria-label="Share" data-testid="button-share-mobile"><Share2 size={16} /></button>
              </div>
            </div>
          </div>
          <div className="profile-description">
            <p>School memories, events &amp; student energy.<br />Camera-ready moments from the corridors of SXDU.</p>
            <div className="profile-meta"><MapPin size={14} /> Dulijan, Assam <span>•</span> <Instagram size={14} /> @sxdu_unofficial</div>
          </div>
          <div className="profile-stats">
            <div><strong>04</strong><span>years collecting</span></div>
            <div><strong>128</strong><span>moments shared</span></div>
            <div><strong>2.4k</strong><span>in the circle</span></div>
          </div>
          <div className="profile-tools desktop-only">
            <button className="primary-action small" onClick={() => setIsFollowing(!isFollowing)} data-testid="button-follow-profile">{isFollowing ? <><Check size={15} /> Following</> : <>Follow page <ArrowDownRight size={15} /></>}</button>
            <button className="quiet-action small" onClick={shareProfile} data-testid="button-share-profile"><Share2 size={15} /> {shared ? 'Link copied' : 'Share profile'}</button>
          </div>
        </section>

        <section id="story" className="section-wrap story-section">
          <SectionIntro eyebrow="01 / THE WHY" title={<>More than a<br /><em>school page.</em></>} copy="There are places you leave, and places you carry. SXDU Unofficial is a living scrapbook for the people who made this campus feel like ours." action="Read the full story" />
          <div className="story-grid">
            <div className="story-quote reveal delay-1">
              <span className="quote-mark">“</span>
              <p>Every batch leaves a little light behind. We’re here to keep the windows open.</p>
              <div className="quote-byline"><span className="avatar-initials">SU</span><span>From the student desk<br /><small>est. 2021 · Dulijan</small></span></div>
            </div>
            <div className="story-aside reveal delay-2">
              <div className="story-number">04<span>/</span></div>
              <p>years of candid frames, house colours, last benches, first prizes, and everything that happens before the bell.</p>
              <button className="circle-arrow" onClick={() => jumpTo('events')} aria-label="Go to the feed" data-testid="button-story-feed"><ArrowDownRight size={20} /></button>
            </div>
            <div className="story-photo reveal delay-3"><ArtBlock tone="blue" label="SXDU / 25" /><div className="photo-caption mono">Frame 093 — behind the auditorium</div></div>
          </div>
        </section>

        <section className="highlight-band section-wrap reveal">
          <div className="highlight-heading">
            <div className="mono eyebrow">SAVED MOMENTS</div>
            <h2 className="display">The highlights shelf</h2>
            <p>Tap a chapter. Stay for the feeling.</p>
          </div>
          <div className="highlight-list hide-scrollbar">
            {highlights.map((item) => (
              <button key={item.id} className={`highlight-item ${selectedHighlight === item.id ? 'selected' : ''}`} onClick={() => setSelectedHighlight(item.id)} data-testid={`button-highlight-${item.id}`}>
                <div className={`highlight-ring ring-${item.tone}`}><span>{item.short}</span><Play size={12} fill="currentColor" /></div>
                <strong>{item.label}</strong><small>{selectedHighlight === item.id ? item.count : 'view'}</small>
              </button>
            ))}
          </div>
          <div className="selected-story">
            <ArtBlock tone={highlights.find((item) => item.id === selectedHighlight)?.tone ?? 'coral'} label={highlights.find((item) => item.id === selectedHighlight)?.short ?? 'AD'} compact />
            <div><span className="mono">NOW PLAYING / {selectedHighlight.replace('-', ' ')}</span><h3 className="display">A little more of what made it ours.</h3><button className="text-link" onClick={() => jumpTo('events')} data-testid="button-open-highlight">Open highlight <ArrowUpRight size={15} /></button></div>
            <div className="selected-count"><strong>{highlights.find((item) => item.id === selectedHighlight)?.count.split(' ')[0]}</strong><span>frames<br />inside</span></div>
          </div>
        </section>

        <section id="events" className="events-section">
          <div className="section-wrap">
            <SectionIntro eyebrow="02 / THE FEED" title={<>Out there,<br /><em>together.</em></>} copy="The live-ish archive: what happened, who showed up, and why the group chat is still talking about it." />
            <div className="event-list">
              {events.map((event, index) => {
                const expanded = expandedEvent === event.id;
                return (
                  <article className={`event-card event-${event.tone} ${expanded ? 'expanded' : ''} reveal delay-${(index % 3) + 1}`} key={event.id} data-testid={`card-event-${event.id}`}>
                    <div className="event-art"><ArtBlock tone={event.tone} label={event.mark} compact /><span className="event-index mono">0{index + 1}</span></div>
                    <div className="event-date mono">{event.date}</div>
                    <div className="event-content"><span className="mono">{event.type}</span><h3 className="display">{event.title}</h3><p className={expanded ? 'visible' : ''}>{event.note}</p></div>
                    <button className="event-expand" onClick={() => setExpandedEvent(expanded ? null : event.id)} aria-label={`${expanded ? 'Collapse' : 'Expand'} ${event.title}`} data-testid={`button-expand-${event.id}`}>{expanded ? <X size={19} /> : <ChevronDown size={19} />}</button>
                    <div className="event-tail"><Heart size={15} /> {index === 0 ? '84' : index === 1 ? '61' : '109'} <span>hearts from the circle</span></div>
                  </article>
                );
              })}
            </div>
            <button className="load-more" onClick={() => setExpandedEvent(expandedEvent ? null : events[0].id)} data-testid="button-load-more">View the whole archive <ArrowUpRight size={16} /></button>
          </div>
        </section>

        <section className="achievement-section section-wrap">
          <div className="achievement-copy reveal">
            <div className="mono eyebrow">03 / THE GOOD STUFF</div>
            <h2 className="display">Small wins.<br /><em>Loud applause.</em></h2>
            <p>Not everything needs a stage. Sometimes a packed library, a personal best, or a brave first attempt is the headline.</p>
            <button className="dark-action" onClick={() => jumpTo('community')} data-testid="button-see-community">Meet the people <ArrowDownRight size={16} /></button>
          </div>
          <div className="achievement-board reveal delay-2">
            <div className="board-top"><span className="mono">SXDU NOTICE BOARD</span><Trophy size={20} /></div>
            <div className="achievement-row"><strong>01</strong><span><b>Quiz team, state round</b><small>Knowledge gets competitive.</small></span><ArrowUpRight size={17} /></div>
            <div className="achievement-row"><strong>02</strong><span><b>House athletics, 2025</b><small>Blue house ran the last lap home.</small></span><ArrowUpRight size={17} /></div>
            <div className="achievement-row"><strong>03</strong><span><b>The student art wall</b><small>One blank corridor, 28 new ideas.</small></span><ArrowUpRight size={17} /></div>
            <div className="board-stamp"><Star size={14} /> MADE BY STUDENTS</div>
          </div>
        </section>

        <section id="community" className="community-section">
          <div className="section-wrap">
            <SectionIntro eyebrow="04 / THE CIRCLE" title={<>Faces behind<br /><em>the frames.</em></>} copy="A school is its people first. These are the teams, crews, and quiet champions making the everyday worth remembering." />
            <div className="community-grid">
              {community.map((person) => (
                <button className="community-card hover-lift" key={person.name} onClick={() => setShared(true)} data-testid={`button-community-${person.initials.toLowerCase()}`}>
                  <div className={`community-avatar avatar-${person.tone}`}>{person.initials}</div>
                  <div className="community-card-copy"><span className="mono">{person.role}</span><h3 className="display">{person.name}</h3><p>{person.detail}</p></div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
            <div className="join-card reveal">
              <div className="join-icon"><Users size={25} /></div>
              <div><span className="mono">YOUR TURN</span><h3 className="display">Have a moment for the archive?</h3><p>Send us the frame, the result, the tiny story. We’ll give it a place here.</p></div>
              <button className="primary-action" onClick={() => { window.location.href = 'mailto:sxdu.unofficial@example.com'; }} data-testid="button-submit-moment">Submit a moment <ArrowUpRight size={16} /></button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer-inner">
          <div className="footer-brand"><Crest small /><span className="display">Keep the story<br /><em>in motion.</em></span></div>
          <div className="footer-links"><span className="mono">Find us where the students are</span><button onClick={shareProfile} data-testid="button-footer-share"><Instagram size={15} /> @sxdu_unofficial</button><button onClick={() => jumpTo('home')} data-testid="button-back-top"><ArrowUpRight size={15} /> Back to top</button></div>
          <div className="footer-bottom"><span>© 2025 SXDU Unofficial</span><span>Student-run. Unofficial. Full of heart.</span><span className="mono">Dulijan / Assam / India</span></div>
        </div>
      </footer>

      {shared && <div className="toast-note" role="status" data-testid="status-share"><Check size={15} /> Link ready to share <button onClick={() => setShared(false)} aria-label="Dismiss" data-testid="button-dismiss-toast"><X size={14} /></button></div>}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary resetKey={window.location.pathname}><Router /></ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
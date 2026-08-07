import { useEffect, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, Building2, Check, ChevronRight, CirclePlay, Menu, Search, Sparkles, Star, Users, X } from 'lucide-react'

const categories = [
  ['Development', '3,240 open roles', '⌘'], ['Design & creative', '1,860 open roles', '✦'],
  ['Writing & marketing', '2,480 open roles', '✎'], ['Business & finance', '930 open roles', '◈']
]
const jobs = [
  { role: 'Senior product designer', company: 'Aster Studio', meta: 'Remote · Full-time', pay: '$75–95/hr', color: 'violet' },
  { role: 'Frontend engineer', company: 'Northstar Labs', meta: 'Remote · Contract', pay: '$60–85/hr', color: 'teal' },
  { role: 'Brand strategist', company: 'House of Form', meta: 'New York · Hybrid', pay: '$5k–7k/mo', color: 'orange' },
]

function App() {
  const [open, setOpen] = useState(false)
  const [word, setWord] = useState(0)
  const words = ['Talent', 'Skills', 'Potential', 'Possibility']
  useEffect(() => { const id = setInterval(() => setWord(n => (n + 1) % words.length), 2400); return () => clearInterval(id) }, [])
  return <div>
    <header className="nav">
      <a className="brand" href="#top"><span>J</span> joblifyr</a>
      <nav className={open ? 'links mobile-open' : 'links'}>
        <a href="#discover">Discover work</a><a href="#hire">Find talent</a><a href="#how">How it works</a><a href="#stories">Stories</a>
        <a className="nav-login" href="/auth/login.php">Log in</a><a className="nav-cta" href="/auth/register.php">Join Joblifyr <ArrowRight size={15}/></a>
      </nav>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </header>
    <main id="top">
      <section className="hero section">
        <div className="hero-copy reveal">
          <div className="eyebrow"><Sparkles size={14}/> A better way to work together</div>
          <h1>Where good work meets <span className="roller" key={word}>{words[word]}</span>.</h1>
          <p>One considered space for ambitious people and teams to find each other, do meaningful work, and keep growing.</p>
          <div className="hero-actions"><a href="/auth/register.php" className="primary">Find your next move <ArrowRight size={18}/></a><a href="#how" className="text-button"><CirclePlay size={20}/> See how it works</a></div>
          <div className="trust"><div className="avatars"><i>JM</i><i>AL</i><i>RK</i><i>+</i></div><span>Trusted by <b>18,000+</b> people building their future</span></div>
        </div>
        <div className="hero-visual reveal delay">
          <div className="orb orb-one"/><div className="orb orb-two"/>
          <div className="profile-card"><div className="profile-top"><div className="portrait">MK</div><span className="active">Available</span></div><h3>Maya Kline</h3><p>Product designer · Berlin</p><div className="pills"><b>Product design</b><b>Research</b></div><div className="profile-foot"><span><Star size={14} fill="currentColor"/> 4.9 <small>(48 reviews)</small></span><button>View profile <ChevronRight size={15}/></button></div></div>
          <div className="match-card"><div className="match-icon"><Sparkles size={18}/></div><div><strong>It’s a match</strong><span>98% role alignment</span></div></div>
          <div className="floating-mini"><div className="company-mark">N</div><div><b>Northstar Labs</b><span>Just posted a role</span></div></div>
        </div>
      </section>
      <section className="logos"><span>Helping independent work feel more human</span><div><b>orbit</b><b>lumen</b><b>cinder</b><b>MONO</b><b>aperture</b></div></section>
      <section id="discover" className="section discovery">
        <div className="section-heading"><div><span className="kicker">Explore with intent</span><h2>Work that fits your<br/><em>whole</em> career.</h2></div><p>From first projects to defining roles, Joblifyr makes it simpler to discover opportunities worth your time.</p></div>
        <div className="category-grid">{categories.map(([title, count, icon], i) => <a className={'category c'+i} href="/auth/categories.php" key={title}><span className="category-icon">{icon}</span><h3>{title}</h3><p>{count}</p><ArrowRight className="category-arrow" size={18}/></a>)}</div>
      </section>
      <section id="how" className="how section"><div className="how-panel"><div><span className="kicker light">Designed for momentum</span><h2>Less searching.<br/>More <em>starting.</em></h2></div><div className="steps">{[['01','Show what you do','Build a living profile with your work, experience, and the things that make you different.'],['02','Find the right fit','Use thoughtful search, clear details, and signals that help you decide quickly.'],['03','Make work happen','Connect, collaborate, and grow from a place built around trust.']].map(([n,t,p])=><div className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{p}</p></div></div>)}</div></div></section>
      <section id="hire" className="section jobs"><div className="jobs-aside"><span className="kicker">Fresh opportunities</span><h2>Roles with room to <em>grow.</em></h2><p>See the work that’s moving today.</p><a href="/auth/newsfeed.php" className="outline">Explore all work <ArrowRight size={17}/></a></div><div className="job-list">{jobs.map((job, i)=><article className="job-card" key={job.role}><div className={'job-logo '+job.color}>{job.company[0]}</div><div className="job-info"><p>{job.company}</p><h3>{job.role}</h3><span>{job.meta}</span></div><div className="job-pay">{job.pay}<button aria-label="View job"><ArrowRight size={18}/></button></div></article>)}</div></section>
      <section id="stories" className="section quote"><div className="quote-mark">“</div><blockquote>Joblifyr feels like it understands that a great opportunity is about more than a job title.</blockquote><div className="quote-person"><div className="portrait small">TR</div><div><b>Tariq Reynolds</b><span>Independent creative director</span></div></div><div className="quote-stat"><strong>4.8<span>/5</span></strong><p>average connection rating</p></div></section>
      <section className="cta section"><div><span className="kicker light">Your next chapter is here</span><h2>Good work is<br/>closer than you think.</h2></div><a className="light-button" href="/auth/register.php">Create your profile <ArrowRight size={18}/></a></section>
    </main>
    <footer><a className="brand" href="#top"><span>J</span> joblifyr</a><p>Work, with more possibility.</p><div><a href="#discover">Discover</a><a href="#hire">For companies</a><a href="/auth/login.php">Sign in</a></div><small>© 2026 Joblifyr. Made for good work.</small></footer>
  </div>
}
export default App

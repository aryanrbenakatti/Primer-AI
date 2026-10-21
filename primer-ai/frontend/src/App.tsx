import { useMemo, useState } from 'react';
import { BookOpen, Calculator, Sparkles, Volume2, Mic, ArrowRight, RotateCcw, Star, Leaf } from 'lucide-react';

type Subject = 'reading' | 'math';
type Activity = { id: string; subject: Subject; skill: string; question: string; options: string[]; answer: string; hint: string; visual: string; explanation: string };

const activities: Activity[] = [
  { id: 'read-001', subject: 'reading', skill: 'initial-m-sound', question: "Which word starts with the 'm' sound?", options: ['Moon', 'Sun', 'Cat'], answer: 'Moon', hint: 'Think of something you might see shining in the night sky.', visual: '🌙', explanation: 'Moon starts with the /m/ sound. Can you hear mmmmm at the beginning?' },
  { id: 'read-002', subject: 'reading', skill: 'letter-b-sound', question: "Which word begins with the 'b' sound?", options: ['Ball', 'Fish', 'Tree'], answer: 'Ball', hint: 'It is round and you can bounce it.', visual: '⚽', explanation: 'Ball begins with the /b/ sound. Your lips come together to make that sound.' },
  { id: 'read-003', subject: 'reading', skill: 'rhyming', question: 'Which word rhymes with cat?', options: ['Hat', 'Dog', 'Sun'], answer: 'Hat', hint: 'Listen to the ending sound: c-at and h-at.', visual: '🐱', explanation: 'Cat and hat rhyme because they share the same ending sound.' },
  { id: 'math-001', subject: 'math', skill: 'addition-within-10', question: 'You have 2 apples and get 3 more. How many apples do you have?', options: ['4', '5', '6'], answer: '5', hint: 'Start at 2 and count three more: 3, 4, 5.', visual: '🍎', explanation: '2 apples plus 3 more apples makes 5 apples altogether.' },
  { id: 'math-002', subject: 'math', skill: 'counting-to-10', question: 'How many little stars can you count?', options: ['3', '4', '5'], answer: '4', hint: 'Point to each star once as you count.', visual: '⭐ ⭐ ⭐ ⭐', explanation: 'There are four stars. Counting each star once helps us get the total.' },
  { id: 'math-003', subject: 'math', skill: 'subtraction-within-10', question: 'There are 5 balloons. One floats away. How many are left?', options: ['3', '4', '5'], answer: '4', hint: 'Hold up five fingers and put one down.', visual: '🎈', explanation: '5 take away 1 leaves 4 balloons.' },
];

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');

export default function App() {
  const [subject, setSubject] = useState<Subject>('reading');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSource, setFeedbackSource] = useState<'local' | 'gemini'>('local');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const subjectActivities = useMemo(() => activities.filter((a) => a.subject === subject), [subject]);
  const activity = subjectActivities[index % subjectActivities.length];
  const correct = selected === activity.answer;

  function say(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  function switchSubject(next: Subject) {
    setSubject(next); setIndex(0); setSelected(null); setFeedback(''); setLoading(false);
  }

  async function chooseAnswer(option: string) {
    if (selected || loading) return;
    setSelected(option);
    const isCorrect = option === activity.answer;
    setFeedback(isCorrect ? 'Brilliant work! 🌟' : `Good try! ${activity.hint}`);
    setFeedbackSource('local');
    if (isCorrect) setCompleted((old) => old.includes(activity.id) ? old : [...old, activity.id]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tutor/respond/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, age_band: '5-6', question: activity.question, learner_answer: option, expected_answer: activity.answer, is_correct: isCorrect, hint: activity.hint, explanation: activity.explanation }),
        signal: AbortSignal.timeout(12000),
      });
      if (response.ok) {
        const data: { message?: string; source?: string } = await response.json();
        if (data.message) { setFeedback(data.message); setFeedbackSource(data.source === 'gemini' ? 'gemini' : 'local'); }
      }
    } catch { /* local feedback remains available when the API is offline */ }
    finally { setLoading(false); }
  }

  function nextActivity() {
    setIndex((old) => (old + 1) % subjectActivities.length);
    setSelected(null); setFeedback(''); setLoading(false);
  }

  function resetActivity() { setSelected(null); setFeedback(''); setLoading(false); }

  const progress = Math.round((completed.length / activities.length) * 100);

  return <div className="page-shell">
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Primer AI home"><span className="brand-mark"><Sparkles size={20}/></span><span>primer<span className="brand-ai"> AI</span></span></a>
      <div className="topbar-right"><span className="top-note"><Leaf size={15}/> Little steps, big discoveries</span><div className="avatar">P</div></div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR LEARNING ADVENTURE</div>
        <h1>Curious minds grow <span>here.</span></h1>
        <p>A little reading, a little maths, and lots of discovery.</p>
        <div className="progress-wrap"><div className="progress-label"><span>Today's discovery trail</span><strong>{completed.length} of {activities.length} skills explored</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}/></div></div>
      </section>

      <section className="subject-grid" aria-label="Choose a subject">
        <button className={`subject-card reading ${subject === 'reading' ? 'active' : ''}`} onClick={() => switchSubject('reading')}>
          <span className="subject-art reading-art"><BookOpen size={28}/><span>ABC</span></span><span className="subject-copy"><strong>Word garden</strong><small>Letters, sounds & words</small><span className="subject-cta">Explore reading <ArrowRight size={14}/></span></span><span className="card-sparkle">✦</span>
        </button>
        <button className={`subject-card maths ${subject === 'math' ? 'active' : ''}`} onClick={() => switchSubject('math')}>
          <span className="subject-art math-art"><Calculator size={28}/><span>1+2</span></span><span className="subject-copy"><strong>Number island</strong><small>Counting & little puzzles</small><span className="subject-cta">Explore maths <ArrowRight size={14}/></span></span><span className="card-sparkle">✦</span>
        </button>
      </section>

      <section className="lesson-layout">
        <div className="lesson-card">
          <div className="lesson-topline"><span className="lesson-label">{subject === 'reading' ? 'WORD EXPLORER' : 'NUMBER ADVENTURE'}</span><span className="step-pill">ACTIVITY {(index % subjectActivities.length) + 1} <span>·</span> {subjectActivities.length}</span></div>
          <div className={`lesson-visual ${subject === 'math' ? 'visual-math' : ''}`}><span className="visual-orbit orbit-one"/><span className="visual-orbit orbit-two"/><span className="visual-emoji">{activity.visual}</span><span className="visual-twinkle twinkle-one">✦</span><span className="visual-twinkle twinkle-two">✧</span></div>
          <h2>{activity.question}</h2><p className="instruction">Choose the answer that feels right to you.</p>
          <div className="answer-grid">{activity.options.map((option, i) => <button key={option} className={`answer-button ${selected === option ? 'chosen' : ''} ${selected && option === activity.answer ? 'correct' : ''}`} disabled={!!selected || loading} onClick={() => void chooseAnswer(option)}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{selected && option === activity.answer && <span className="answer-check">✓</span>}</button>)}</div>
          {feedback && <div className={`feedback ${correct ? 'feedback-good' : 'feedback-try'}`} role="status" aria-live="polite"><span className="feedback-star">✦</span><div className="feedback-copy"><strong>{correct ? 'You did it!' : 'Keep exploring!'}</strong><p>{feedback}</p>{feedbackSource === 'gemini' && <small className="ai-label"><Sparkles size={12}/> Gemini tutor</small>}</div><button className="speak-button" aria-label="Read feedback aloud" onClick={() => say(feedback)}><Volume2 size={18}/></button></div>}
          {loading && <p className="loading-line"><span className="loader-dot"/> Your learning buddy is thinking…</p>}
          <div className="lesson-actions"><button className="quiet-button" onClick={resetActivity} disabled={!selected || loading}><RotateCcw size={15}/> Try again</button><div className="primary-actions"><button className="voice-button" onClick={() => say(activity.question)}><Volume2 size={16}/> Listen</button><button className="next-button" onClick={nextActivity} disabled={!selected || loading}>Next activity <ArrowRight size={16}/></button></div></div>
          <div className="voice-note"><Mic size={14}/> Voice practice is optional. Grown-ups can help with reading aloud.</div>
        </div>
        <aside className="side-panel"><div className="buddy-card"><div className="buddy-head"><span className="buddy-eyebrow">YOUR LEARNING BUDDY</span><span className="buddy-sparkle">✦</span></div><div className="buddy-illustration"><span className="buddy-cloud cloud-a"/><span className="buddy-cloud cloud-b"/><span className="buddy-character">🦊</span><span className="buddy-star">⭐</span></div><h3>Hi, little explorer!</h3><p>Every answer helps your brain grow. Mistakes are part of the adventure.</p><button className="buddy-say" onClick={() => say('Hi, little explorer! Every answer helps your brain grow. Mistakes are part of the adventure.')}><Volume2 size={15}/> Say hello</button></div><div className="streak-card"><div className="streak-icon"><Star size={19}/></div><div><strong>{completed.length} little wins</strong><p>Keep discovering at your own pace.</p></div></div><div className="parent-note"><span>FOR GROWN-UPS</span><p>This is a learning prototype. Stay nearby during activities and avoid entering personal information.</p></div></aside>
      </section>
    </main>
    <footer><span className="footer-mark">✦</span> Made for curious minds <span className="footer-dot">·</span> Learning should feel like discovery</footer>
  </div>;
}

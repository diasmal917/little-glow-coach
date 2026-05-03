import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Bot, Brain, Camera, Check, ChevronRight, Flame, Heart, Mic2, RotateCcw, Send, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import './style.css';

const tracks = [
  { id: 'english', title: 'English Voice', icon: Mic2, color: '#2f9cf4', description: 'Speak first, grammar second.', lessons: [
    { id: 'eng-intro', xp: 18, title: 'แนะนำตัว 30 วินาที', task: 'พูดหรือเขียน 3 ประโยค: ชื่อ, อยู่ที่ไหน, วันนี้รู้สึกยังไง', examples: ['My name is Nannie.', 'I live in Bangkok.', 'Today I feel calm because I practiced.'] },
    { id: 'eng-cafe', xp: 16, title: 'สั่งกาแฟแบบมั่นใจ', task: 'ซ้อมพูดประโยคสั่งเครื่องดื่ม 3 รอบ', examples: ['Can I have an iced latte, please?', 'Less sweet, please.', 'Can I pay by QR?'] },
    { id: 'eng-feeling', xp: 14, title: 'พูดความรู้สึกง่ายๆ', task: 'เลือก 1 อารมณ์ แล้วแต่งประโยคอังกฤษ 2 ประโยค', examples: ['I feel proud today.', 'I was nervous, but I tried.'] },
  ] },
  { id: 'ai', title: 'AI Skills', icon: Brain, color: '#23b26d', description: 'Use AI like a smart helper.', lessons: [
    { id: 'ai-caption', xp: 20, title: 'Prompt ให้ได้ caption', task: 'ขอให้ AI ช่วยเขียน caption ภาษาอังกฤษ 5 แบบสำหรับรูปวันนี้', examples: ['Make this sound natural.', 'Give me 5 cute captions.', 'Explain your changes in Thai.'] },
    { id: 'ai-translate', xp: 18, title: 'แปลแบบเป็นธรรมชาติ', task: 'เอาประโยคไทย 1 ประโยคไปให้ AI แปลเป็นอังกฤษแบบน่ารัก', examples: ['Translate this naturally.', 'Make it softer.', 'Make it sound confident.'] },
  ] },
  { id: 'creator', title: 'Creator Studio', icon: Camera, color: '#ff8f3d', description: 'Turn taste into little outputs.', lessons: [
    { id: 'creator-outfit', xp: 18, title: 'Outfit caption', task: 'เลือก 1 รูป แล้วเขียน caption อังกฤษ 1 แบบ + ไทย 1 แบบ', examples: ['Soft girl energy today.', 'Simple, clean, and cute.', 'Bangkok cafe day.'] },
    { id: 'creator-shotlist', xp: 18, title: 'Shot list 3 รูป', task: 'วางแผนรูป 3 แบบ: wide, detail, selfie', examples: ['Wide shot', 'Close-up detail', 'Mirror selfie'] },
  ] },
  { id: 'health', title: 'Healthy Routine', icon: Heart, color: '#ff6f91', description: 'Tiny daily body care.', lessons: [
    { id: 'health-water', xp: 12, title: 'น้ำ + เดินเบาๆ', task: 'ดื่มน้ำ 1 แก้ว แล้วเดินหรือยืดตัว 5 นาที', examples: ['I drank water.', 'I walked for five minutes.', 'My body feels lighter.'] },
    { id: 'health-food', xp: 16, title: 'Healthy yummy plate', task: 'วางแผนอาหารง่ายๆ 1 มื้อ: protein + vegetable + fruit', examples: ['egg', 'tuna', 'avocado', 'banana'] },
  ] },
  { id: 'money', title: 'Money & Safety', icon: ShieldCheck, color: '#18b7b1', description: 'Be kind, but not careless.', lessons: [
    { id: 'safety-dm', xp: 15, title: 'DM แปลกๆ ต้องระวัง', task: 'เขียนคำตอบสุภาพ 1 ประโยคเมื่อมีคนขอข้อมูลส่วนตัว', examples: ['I am not comfortable sharing that.', 'No, thank you.', 'Please contact me by email.'] },
    { id: 'money-budget', xp: 15, title: 'เงินวันนี้', task: 'เขียน spending plan ง่ายๆ: food, travel, save', examples: ['Food budget', 'Travel budget', 'Save a little first.'] },
  ] },
  { id: 'confidence', title: 'Confidence', icon: Sparkles, color: '#7864f4', description: 'Quiet strength, daily.', lessons: [
    { id: 'mind-control', xp: 14, title: 'อะไรควบคุมได้?', task: 'เขียน 1 เรื่องที่กังวล แล้วแยก: ควบคุมได้ / ควบคุมไม่ได้', examples: ['I can control my actions.', 'I cannot control other people.', 'I will do my best today.'] },
    { id: 'mind-proud', xp: 14, title: 'หนึ่งอย่างที่ภูมิใจ', task: 'เขียน 1 บรรทัดว่าทำอะไรดีแล้ววันนี้', examples: ['I practiced even though I was shy.', 'I kept my promise today.'] },
  ] },
];

const accountabilityItems = [
  { id: 'voice', title: 'Voice practice', detail: 'พูดอังกฤษ 1 นาที' },
  { id: 'body', title: 'Healthy step', detail: 'น้ำหรือเดินเบาๆ' },
  { id: 'reflect', title: 'Reflection', detail: 'เขียนใจตัวเอง 1 บรรทัด' },
];
const badges = [
  { id: 'first', title: 'First Quest', need: 1, icon: Star },
  { id: 'voice', title: 'Voice Brave', need: 2, icon: Mic2 },
  { id: 'creator', title: 'Soft Creator', need: 4, icon: Camera },
  { id: 'week', title: 'Week Spark', need: 7, icon: Flame },
  { id: 'safe', title: 'Safe Online', need: 10, icon: ShieldCheck },
];
const storageKey = 'nannie-academy-progress-v2';

function readProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; }
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [activeTrack, setActiveTrack] = useState('english');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const done = progress.done || [];
  const daily = progress.daily || {};
  const selected = tracks.find((track) => track.id === activeTrack) || tracks[0];
  const allLessons = tracks.flatMap((track) => track.lessons.map((lesson) => ({ ...lesson, track: track.title })));
  const todayLesson = allLessons[done.length % allLessons.length];
  const xp = done.reduce((sum, id) => sum + (allLessons.find((lesson) => lesson.id === id)?.xp || 0), 0);
  const level = Math.floor(xp / 80) + 1;
  const nextLevelXp = xp % 80 === 0 && xp > 0 ? 80 : 80 - (xp % 80);
  const dailyDone = accountabilityItems.filter((item) => daily[item.id]).length;
  const accountabilityPercent = Math.min(100, Math.round(((done.length + dailyDone) / 28) * 100));

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(progress)); }, [progress]);

  const completeQuest = (lessonId) => {
    if (done.includes(lessonId)) return;
    setProgress({ ...progress, done: [...done, lessonId], streak: Math.max(1, progress.streak || 0), lastDoneAt: new Date().toISOString() });
  };
  const toggleDaily = (itemId) => setProgress({ ...progress, daily: { ...daily, [itemId]: !daily[itemId] } });
  const reset = () => { setProgress({ done: [], daily: {}, streak: 0 }); setAnswer(''); setSubmitStatus(''); };

  const submitToChib = async () => {
    if (!answer.trim()) { setSubmitStatus('เขียนคำตอบก่อนนะคะ'); return; }
    setSubmitStatus('กำลังส่ง...');
    const payload = { name: 'Nannie', lessonTitle: todayLesson.title, lessonArea: todayLesson.track, xp: todayLesson.xp, answer };
    try {
      const endpoint = window.NANNIE_API_ENDPOINT || '/api/submit';
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': '1' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Submit failed');
      completeQuest(todayLesson.id);
      setSubmitStatus('ส่งให้ Chib แล้วค่ะ');
    } catch {
      const fallback = `สวัสดี Chib ค่ะ หนูทำภารกิจแล้ว\nบทเรียน: ${todayLesson.title}\nคำตอบของหนู: ${answer}`;
      navigator.clipboard?.writeText(fallback);
      setSubmitStatus('ส่งอัตโนมัติไม่ได้ แต่คัดลอกข้อความไว้ให้แล้วค่ะ');
    }
  };
  const trackCompletion = (track) => Math.round((track.lessons.filter((lesson) => done.includes(lesson.id)).length / track.lessons.length) * 100);

  return <main className="academy-shell">
    <aside className="track-rail" aria-label="Learning tracks">
      <div className="rail-logo"><Bot size={22} /></div>
      {tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className={activeTrack === track.id ? 'rail-button active' : 'rail-button'} onClick={() => setActiveTrack(track.id)} title={track.title}><Icon size={19} /><span>{track.title}</span></button>; })}
    </aside>
    <section className="academy-main">
      <header className="topbar"><div><h1>Nannie’s Daily Quest</h1><p>English, AI, creator confidence, health, money safety, and calm reflection.</p></div><button className="icon-action" onClick={reset} title="Reset progress"><RotateCcw size={18} /></button></header>
      <section className="dashboard-grid">
        <motion.article className="profile-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><div className="mascot-banner"><span className="spark one" /><div className="mascot-face"><span /><span /></div><span className="spark two" /></div><p className="eyebrow">Learner</p><h2>Nannie</h2><p className="muted">Bangkok glow-up academy</p><div className="stat-row"><Stat icon={Star} label="XP" value={xp} /><Stat icon={Trophy} label="Level" value={level} /><Stat icon={Flame} label="Streak" value={progress.streak || 0} /></div><div className="ring-row"><div className="ring" style={{ '--value': `${accountabilityPercent}%` }}><span>{accountabilityPercent}%</span></div><p>Weekly accountability progress. Keep the loop gentle but visible.</p></div></motion.article>
        <motion.article className="quest-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}><div className="card-head"><div><p className="eyebrow">Today</p><h2>{todayLesson.title}</h2><p>{todayLesson.track}</p></div><span className="xp-pill">+{todayLesson.xp} XP</span></div><p className="task-text">{todayLesson.task}</p><div className="example-row">{todayLesson.examples.map((example) => <code key={example}>{example}</code>)}</div><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="พิมพ์คำตอบของ Nannie ตรงนี้..." /><div className="action-row"><button onClick={submitToChib}><Send size={17} /> ส่งให้ Chib</button>{submitStatus && <span>{submitStatus}</span>}</div></motion.article>
        <motion.article className="account-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><div className="card-head compact"><div><h2>Accountability</h2><p>{dailyDone}/3 complete today</p></div><ShieldCheck size={20} /></div>{accountabilityItems.map((item) => <button key={item.id} className={daily[item.id] ? 'check-item done' : 'check-item'} onClick={() => toggleDaily(item.id)}><span>{daily[item.id] && <Check size={14} />}</span><strong>{item.title}</strong><small>{item.detail}</small></button>)}</motion.article>
      </section>
      <section className="content-grid"><article className="lesson-map"><div className="card-head"><div><h2>{selected.title}</h2><p>{selected.description}</p></div><span className="xp-pill">{selected.lessons.length} quests</span></div>{selected.lessons.map((lesson, index) => { const isDone = done.includes(lesson.id); return <button key={lesson.id} className={isDone ? 'lesson-node complete' : 'lesson-node'} onClick={() => completeQuest(lesson.id)} disabled={isDone}><span>{isDone ? <Check size={20} /> : index + 1}</span><div><strong>{lesson.title}</strong><p>{lesson.task}</p></div><ChevronRight size={18} /></button>; })}</article>
        <aside className="side-stack"><article className="voice-card"><div className="mini-icons"><Mic2 /><Sparkles /><Bot /></div><h2>ChatGPT Voice Classroom</h2><p>ใช้ GPT ส่วนตัวเป็นห้องพูดจริง แล้วให้ Slack เป็นสมุดเตือนและติดตามผล</p><a href="https://chatgpt.com/gpts" target="_blank" rel="noreferrer">Open Voice</a><small>Next: replace this with Nannie’s private GPT link.</small></article><article className="rewards-card"><div className="card-head compact"><h2>Rewards</h2><p>Badges unlock as she practices</p></div><div className="badge-grid">{badges.map((badge) => { const Icon = badge.icon; const unlocked = done.length >= badge.need; return <div key={badge.id} className={unlocked ? 'badge unlocked' : 'badge'}><Icon size={18} /><span>{badge.title}</span></div>; })}</div></article><article className="notes-card"><h2>Mentor Notes</h2><p>Separate learner memory</p><ul><li>Thai-first explanations, tiny English examples</li><li>One quest at a time; praise effort before correction</li><li>Voice practice should feel light, not like a test</li><li>Memory should track progress, not private diary details</li></ul><p className="next-level">{nextLevelXp} XP until next level</p></article></aside>
      </section>
      <section className="track-grid">{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className="track-tile" onClick={() => setActiveTrack(track.id)}><span style={{ background: track.color }}><Icon size={18} /></span><strong>{track.title}</strong><small>{trackCompletion(track)}% complete</small></button>; })}</section>
    </section>
  </main>;
}

function Stat({ icon: Icon, label, value }) {
  return <div className="stat"><Icon size={17} /><strong>{value}</strong><span>{label}</span></div>;
}

createRoot(document.getElementById('root')).render(<App />);

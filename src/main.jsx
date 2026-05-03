import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Bot, Brain, Camera, Check, ChevronRight, Flame, Heart, Mic2, RotateCcw, Send, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import './style.css';

const tracks = [
  { id: 'english', title: 'English Voice', icon: Mic2, color: '#2f9cf4', helper: 'Bow Kitty', description: 'Speak softly, clearly, and confidently around Bangkok.', lessons: [
    { id: 'eng-intro', xp: 18, title: 'แนะนำตัวแบบ Nannie', task: 'พูด 3 ประโยค: ชื่อ, อยู่แถว Thonglor/Bangkok, วันนี้รู้สึกยังไง', examples: ['My name is Nannie.', 'I live near Thonglor in Bangkok.', 'Today I feel calm and pretty.'] },
    { id: 'eng-cafe', xp: 16, title: 'Thonglor cafe order', task: 'ซ้อมสั่งกาแฟหรือขนมในคาเฟ่ 3 รอบ', examples: ['Can I have an iced latte, please?', 'Less sweet, please.', 'Can I pay by QR?'] },
    { id: 'eng-music', xp: 16, title: 'พูดเรื่องเพลงที่ชอบ', task: 'พูด 2 ประโยคเกี่ยวกับเพลงหรือศิลปินที่ชอบ', examples: ['I like this song because it feels fun.', 'This music makes me want to dance.'] },
  ] },
  { id: 'fashion', title: 'Fashion Studio', icon: Camera, color: '#d97706', helper: 'Brown Buddy', description: 'Turn her style into captions, looks, and confidence.', lessons: [
    { id: 'fit-caption', xp: 20, title: 'Emerald night-out caption', task: 'เขียน caption อังกฤษ 1 แบบจากลุคกลางคืน โทนสวย แพง นุ่มนวล', examples: ['Emerald glow in Bangkok.', 'Soft glam, calm heart.', 'A little sparkle for Thonglor night.'] },
    { id: 'fit-shotlist', xp: 18, title: '3-shot outfit plan', task: 'วางแผนรูป 3 แบบ: mirror, detail, cafe table', examples: ['Mirror selfie', 'Jewelry detail', 'Cafe table mood'] },
    { id: 'fit-voice', xp: 14, title: 'Describe my outfit', task: 'พูดอังกฤษ 20 วินาที อธิบายชุดวันนี้', examples: ['I am wearing a green dress.', 'It feels elegant and soft.'] },
  ] },
  { id: 'ai', title: 'AI Skills', icon: Brain, color: '#23b26d', helper: 'Chib', description: 'Use AI like a clever study and creator assistant.', lessons: [
    { id: 'ai-caption', xp: 20, title: 'Prompt ให้ได้ caption', task: 'ขอให้ AI ช่วยเขียน caption อังกฤษ 5 แบบสำหรับรูปวันนี้', examples: ['Make this sound natural.', 'Give me 5 cute captions.', 'Explain your changes in Thai.'] },
    { id: 'ai-translate', xp: 18, title: 'แปลแบบเป็นธรรมชาติ', task: 'เอาประโยคไทย 1 ประโยคไปให้ AI แปลเป็นอังกฤษแบบน่ารัก', examples: ['Translate this naturally.', 'Make it softer.', 'Make it sound confident.'] },
  ] },
  { id: 'astrology', title: 'Astrology Basics', icon: Sparkles, color: '#7864f4', helper: 'Bow Kitty', description: 'Beginner astrology with Virgo structure and kindness.', lessons: [
    { id: 'astro-virgo', xp: 18, title: 'Virgo คืออะไร?', task: 'เรียน 3 คำ: detail, routine, helpful แล้วเขียนว่า Virgo ช่วย Nannie ยังไง', examples: ['Virgo notices details.', 'Virgo likes clean routines.', 'Virgo helps with practice.'] },
    { id: 'astro-elements', xp: 16, title: 'Elements 101', task: 'จำ 4 ธาตุ: fire, earth, air, water แล้วเลือกธาตุที่รู้สึกเหมือนวันนี้', examples: ['Earth feels grounded.', 'Water feels emotional.', 'Fire feels brave.'] },
    { id: 'astro-chart', xp: 16, title: 'Sun, Moon, Rising', task: 'เขียนความหมายง่ายๆ ของ Sun, Moon, Rising อย่างละ 1 บรรทัด', examples: ['Sun is identity.', 'Moon is feelings.', 'Rising is first impression.'] },
  ] },
  { id: 'isaan', title: 'Isaan Culture', icon: Heart, color: '#ef4444', helper: 'Brown Buddy', description: 'Food, music, family feeling, and local pride.', lessons: [
    { id: 'isaan-food', xp: 18, title: 'Order Isaan food in English', task: 'ฝึกพูดชื่ออาหารอีสาน 3 อย่างเป็นอังกฤษง่ายๆ', examples: ['papaya salad', 'grilled chicken', 'sticky rice'] },
    { id: 'isaan-music', xp: 16, title: 'Music mood', task: 'พูด 2 ประโยคเกี่ยวกับเพลงอีสาน/หมอลำว่าทำให้รู้สึกยังไง', examples: ['The rhythm feels joyful.', 'This song reminds me of home.'] },
  ] },
  { id: 'bowling', title: 'Bowling & Fun', icon: Trophy, color: '#f59e0b', helper: 'Brown Buddy', description: 'Playful English for social confidence.', lessons: [
    { id: 'bowl-score', xp: 14, title: 'Bowling phrases', task: 'ฝึกพูด 3 ประโยคเวลาไป bowling กับเพื่อน', examples: ['It is my turn.', 'Nice shot!', 'I almost got a strike.'] },
    { id: 'bowl-invite', xp: 16, title: 'Invite a friend', task: 'เขียน invitation ภาษาอังกฤษ 1 ข้อความ', examples: ['Do you want to go bowling in Thonglor?', 'Let’s play one game after dinner.'] },
  ] },
  { id: 'safety', title: 'Money & Safety', icon: ShieldCheck, color: '#18b7b1', helper: 'Chib', description: 'Soft heart, strong boundaries.', lessons: [
    { id: 'safety-dm', xp: 15, title: 'DM แปลกๆ ต้องระวัง', task: 'เขียนคำตอบสุภาพ 1 ประโยคเมื่อมีคนขอข้อมูลส่วนตัว', examples: ['I am not comfortable sharing that.', 'No, thank you.', 'Please contact me by email.'] },
    { id: 'money-budget', xp: 15, title: 'Thonglor day budget', task: 'เขียน spending plan ง่ายๆ: food, travel, save', examples: ['Food budget', 'Travel budget', 'Save a little first.'] },
  ] },
];

const accountabilityItems = [
  { id: 'voice', title: 'Voice practice', detail: 'พูดอังกฤษ 1 นาที' },
  { id: 'style', title: 'Style output', detail: 'caption หรือ outfit note 1 อย่าง' },
  { id: 'reflect', title: 'Virgo reflection', detail: 'เขียนใจตัวเอง 1 บรรทัด' },
];

const badges = [
  { id: 'first', title: 'First Quest', need: 1, icon: Star },
  { id: 'virgo', title: 'Virgo Focus', need: 2, icon: Sparkles },
  { id: 'style', title: 'Thonglor Style', need: 4, icon: Camera },
  { id: 'voice', title: 'Voice Brave', need: 6, icon: Mic2 },
  { id: 'safe', title: 'Safe Online', need: 10, icon: ShieldCheck },
];

const storageKey = 'nannie-academy-progress-v3';

function readProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; }
}

function MascotPair() {
  return <div className="mascot-pair" aria-label="Nannie Academy helpers">
    <div className="bear-helper"><span /><i /></div>
    <div className="kitty-helper"><b /><span /><i /></div>
  </div>;
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [activeTrack, setActiveTrack] = useState('english');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const done = progress.done || [];
  const daily = progress.daily || {};
  const selected = tracks.find((track) => track.id === activeTrack) || tracks[0];
  const allLessons = tracks.flatMap((track) => track.lessons.map((lesson) => ({ ...lesson, track: track.title, helper: track.helper })));
  const todayLesson = allLessons[done.length % allLessons.length];
  const xp = done.reduce((sum, id) => sum + (allLessons.find((lesson) => lesson.id === id)?.xp || 0), 0);
  const level = Math.floor(xp / 80) + 1;
  const nextLevelXp = xp % 80 === 0 && xp > 0 ? 80 : 80 - (xp % 80);
  const dailyDone = accountabilityItems.filter((item) => daily[item.id]).length;
  const accountabilityPercent = Math.min(100, Math.round(((done.length + dailyDone) / 32) * 100));

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
      <header className="topbar"><div><p className="place-pill">Bangkok • Thonglor • Virgo girl</p><h1>Nannie Academy</h1><p>English voice, fashion, AI, astrology, bowling, Isaan culture, music, food, and soft accountability.</p></div><button className="icon-action" onClick={reset} title="Reset progress"><RotateCcw size={18} /></button></header>

      <section className="dashboard-grid">
        <motion.article className="profile-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><div className="mascot-banner"><MascotPair /><span className="spark one" /><span className="spark two" /></div><p className="eyebrow">Learner</p><h2>Nannie</h2><p className="muted">Emerald night-out energy, Thonglor routines, Virgo focus.</p><div className="stat-row"><Stat icon={Star} label="XP" value={xp} /><Stat icon={Trophy} label="Level" value={level} /><Stat icon={Flame} label="Streak" value={progress.streak || 0} /></div><div className="ring-row"><div className="ring" style={{ '--value': `${accountabilityPercent}%` }}><span>{accountabilityPercent}%</span></div><p>Weekly progress for voice, style, Virgo reflection, and Chib check-ins.</p></div></motion.article>
        <motion.article className="quest-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}><div className="card-head"><div><p className="eyebrow">Today with {todayLesson.helper}</p><h2>{todayLesson.title}</h2><p>{todayLesson.track}</p></div><span className="xp-pill">+{todayLesson.xp} XP</span></div><p className="task-text">{todayLesson.task}</p><div className="example-row">{todayLesson.examples.map((example) => <code key={example}>{example}</code>)}</div><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="พิมพ์คำตอบของ Nannie ตรงนี้..." /><div className="action-row"><button onClick={submitToChib}><Send size={17} /> ส่งให้ Chib</button>{submitStatus && <span>{submitStatus}</span>}</div></motion.article>
        <motion.article className="account-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><div className="card-head compact"><div><h2>Accountability</h2><p>{dailyDone}/3 complete today</p></div><ShieldCheck size={20} /></div>{accountabilityItems.map((item) => <button key={item.id} className={daily[item.id] ? 'check-item done' : 'check-item'} onClick={() => toggleDaily(item.id)}><span>{daily[item.id] && <Check size={14} />}</span><strong>{item.title}</strong><small>{item.detail}</small></button>)}</motion.article>
      </section>

      <section className="content-grid"><article className="lesson-map"><div className="card-head"><div><h2>{selected.title}</h2><p>{selected.description}</p><p className="helper-line">Helper: {selected.helper}</p></div><span className="xp-pill">{selected.lessons.length} quests</span></div>{selected.lessons.map((lesson, index) => { const isDone = done.includes(lesson.id); return <button key={lesson.id} className={isDone ? 'lesson-node complete' : 'lesson-node'} onClick={() => completeQuest(lesson.id)} disabled={isDone}><span>{isDone ? <Check size={20} /> : index + 1}</span><div><strong>{lesson.title}</strong><p>{lesson.task}</p></div><ChevronRight size={18} /></button>; })}</article>
        <aside className="side-stack"><article className="voice-card"><div className="mini-mascots"><div className="tiny-bear" /><div className="tiny-kitty" /></div><h2>Voice Classroom</h2><p>ใช้ GPT ส่วนตัวเป็นห้องพูดจริง: คาเฟ่ทองหล่อ, outfit, astrology, bowling, music, and Isaan food.</p><a href="https://chatgpt.com/gpts" target="_blank" rel="noreferrer">Open Voice</a><small>Next: replace this with Nannie’s private GPT link.</small></article><article className="rewards-card"><div className="card-head compact"><h2>Rewards</h2><p>Badges unlock as she practices</p></div><div className="badge-grid">{badges.map((badge) => { const Icon = badge.icon; const unlocked = done.length >= badge.need; return <div key={badge.id} className={unlocked ? 'badge unlocked' : 'badge'}><Icon size={18} /><span>{badge.title}</span></div>; })}</div></article><article className="notes-card"><h2>Mentor Notes</h2><p>Separate learner memory</p><ul><li>Thai-first explanations, tiny English examples</li><li>Virgo tone: organized, gentle, specific, never harsh</li><li>Use Thonglor, fashion, bowling, Isaan food/music as examples</li><li>Memory should track progress, not private diary details</li></ul><p className="next-level">{nextLevelXp} XP until next level</p></article></aside>
      </section>
      <section className="track-grid">{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className="track-tile" onClick={() => setActiveTrack(track.id)}><span style={{ background: track.color }}><Icon size={18} /></span><strong>{track.title}</strong><small>{trackCompletion(track)}% complete</small></button>; })}</section>
    </section>
  </main>;
}

function Stat({ icon: Icon, label, value }) {
  return <div className="stat"><Icon size={17} /><strong>{value}</strong><span>{label}</span></div>;
}

createRoot(document.getElementById('root')).render(<App />);

import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Bot, Brain, Camera, Check, ChevronRight, Clipboard, ExternalLink, Flame, MessageCircle, Mic2, RotateCcw, Send, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import './style.css';

const chatgptUrl = 'https://chatgpt.com/';
const nannieGptUrl = window.NANNIE_GPT_URL || chatgptUrl;
const mentorVoice = 'Teach me like the smartest, kindest, most compassionate mentor from Suwannaphum District in Roi Et Province. Make it familiar, warm, encouraging, and focused. Use simple English with Thai support. Mention Suwannaphum, Roi Et, Bangkok, or Thonglor only when it naturally helps the lesson feel personal.';

const moodOptions = [
  { id: 'tired', label: 'เหนื่อย', instruction: 'Make today very easy, soft, and low-pressure. One tiny win is enough.' },
  { id: 'fun', label: 'อยากสนุก', instruction: 'Make today playful, funny, and light. Use jokes and quick practice.' },
  { id: 'pretty', label: 'อยากสวย/มั่นใจ', instruction: 'Make today confidence-building, feminine, stylish, and warm.' },
  { id: 'focus', label: 'อยากเรียนจริงจัง', instruction: 'Make today structured and useful. Correct clearly but kindly.' },
];

const helperRoles = {
  'Bow Kitty': 'ช่วยเรื่องเสียง สำเนียง และประโยคที่พูดแล้วน่ารักเป็นธรรมชาติ',
  'Brown Buddy': 'ช่วยให้กำลังใจ วางแผนเล็กๆ และทำให้ฝึกต่อได้ทุกวัน',
  Chib: 'ช่วยสรุปความคืบหน้า ตรวจคำตอบ และเลือกบทต่อไปให้เหมาะกับ Nannie',
};

const tracks = [
  { id: 'english', title: 'English Voice', icon: Mic2, color: '#2f9cf4', helper: 'Bow Kitty', description: 'ฝึกพูดสั้นๆ สำหรับชีวิตจริง', lessons: [
    { id: 'eng-intro', xp: 18, title: 'แนะนำตัวแบบ Nannie', task: 'พูด 3 ประโยค: ชื่อ, มาจาก Suwannaphum/Roi Et, ตอนนี้อยู่แถว Thonglor/Bangkok', examples: ['My name is Nannie.', 'I am from Suwannaphum District in Roi Et.', 'Now I spend time near Thonglor in Bangkok.'], chatgpt: 'Use voice mode and help me practice a natural English self-introduction. Speak slowly, correct me gently, and give me one better version after I try.' },
    { id: 'eng-cafe', xp: 16, title: 'Thonglor cafe order', task: 'ซ้อมสั่งกาแฟหรือขนมในคาเฟ่ 3 รอบ', examples: ['Can I have an iced latte, please?', 'Less sweet, please.', 'Can I pay by QR?'], chatgpt: 'Roleplay as a friendly barista in a Thonglor cafe. Let me order in English. Keep replies short and correct only one mistake at a time.' },
    { id: 'eng-music', xp: 16, title: 'พูดเรื่องเพลงที่ชอบ', task: 'พูด 2 ประโยคเกี่ยวกับเพลงหรือศิลปินที่ชอบ', examples: ['I like this song because it feels fun.', 'This music makes me think of home.', 'The rhythm feels joyful.'], chatgpt: 'Help me talk in simple English about music I like. Ask easy questions and suggest natural phrases.' },
  ] },
  { id: 'fashion', title: 'Fashion Studio', icon: Camera, color: '#d97706', helper: 'Brown Buddy', description: 'ฝึก caption, outfit notes, และความมั่นใจ', lessons: [
    { id: 'fit-caption', xp: 20, title: 'Emerald night-out caption', task: 'เขียน caption อังกฤษ 1 แบบจากลุคกลางคืน โทนสวย แพง นุ่มนวล', examples: ['Emerald glow in Bangkok.', 'Soft glam, calm heart.', 'A little sparkle for Thonglor night.'], chatgpt: 'Give me 10 natural Instagram captions in English for an emerald green night-out look in Bangkok. Make them feminine, confident, and not cringe. Explain the best 3 in Thai.' },
    { id: 'fit-shotlist', xp: 18, title: '3-shot outfit plan', task: 'วางแผนรูป 3 แบบ: mirror, detail, cafe table', examples: ['Mirror selfie', 'Jewelry detail', 'Cafe table mood'], chatgpt: 'Help me make a simple 3-shot outfit photo plan for a Bangkok cafe or dinner. Include pose ideas, caption ideas, and one styling tip.' },
    { id: 'fit-voice', xp: 14, title: 'Describe my outfit', task: 'พูดอังกฤษ 20 วินาที อธิบายชุดวันนี้', examples: ['I am wearing a green dress.', 'It feels elegant and soft.'], chatgpt: 'Use voice mode. Ask me to describe my outfit in English for 20 seconds, then give me a polished version I can repeat.' },
  ] },
  { id: 'ai', title: 'AI Skills', icon: Brain, color: '#23b26d', helper: 'Chib', description: 'ใช้ ChatGPT เป็นผู้ช่วยประจำวัน', lessons: [
    { id: 'ai-caption', xp: 20, title: 'Prompt ให้ได้ caption', task: 'ขอให้ ChatGPT ช่วยเขียน caption อังกฤษ 5 แบบสำหรับรูปวันนี้', examples: ['Make this sound natural.', 'Give me 5 cute captions.', 'Explain your changes in Thai.'], chatgpt: 'Teach me how to ask ChatGPT for better captions. Ask what photo I have, then create 5 caption options and explain why each one works.' },
    { id: 'ai-translate', xp: 18, title: 'แปลแบบเป็นธรรมชาติ', task: 'เอาประโยคไทย 1 ประโยคไปให้ ChatGPT แปลเป็นอังกฤษแบบน่ารัก', examples: ['Translate this naturally.', 'Make it softer.', 'Make it sound confident.'], chatgpt: 'I will give you a Thai sentence. Translate it into natural English in 3 styles: cute, confident, and casual. Explain the difference in Thai.' },
  ] },
  { id: 'astrology', title: 'Astrology Basics', icon: Sparkles, color: '#7864f4', helper: 'Bow Kitty', description: 'เรียนภาษา astrology แบบง่ายทีละนิด', lessons: [
    { id: 'astro-virgo', xp: 18, title: 'Virgo คืออะไร?', task: 'เรียน 3 คำ: detail, routine, helpful แล้วเขียนว่า Virgo ช่วย Nannie ยังไง', examples: ['Virgo notices details.', 'Virgo likes clean routines.', 'Virgo helps with practice.'], chatgpt: 'Teach me beginner astrology in Thai and English. Start with Virgo. Give me 5 useful English words and one tiny quiz at the end.' },
    { id: 'astro-elements', xp: 16, title: 'Elements 101', task: 'จำ 4 ธาตุ: fire, earth, air, water แล้วเลือกธาตุที่รู้สึกเหมือนวันนี้', examples: ['Earth feels grounded.', 'Water feels emotional.', 'Fire feels brave.'], chatgpt: 'Explain the four astrology elements for a beginner. Use simple English with Thai explanations, then ask which element fits my mood today.' },
    { id: 'astro-chart', xp: 16, title: 'Sun, Moon, Rising', task: 'เขียนความหมายง่ายๆ ของ Sun, Moon, Rising อย่างละ 1 บรรทัด', examples: ['Sun is identity.', 'Moon is feelings.', 'Rising is first impression.'], chatgpt: 'Teach me Sun, Moon, and Rising signs like I am a beginner. Keep it simple, give examples, and ask me to explain it back in easy English.' },
  ] },
  { id: 'astro-x', title: 'Astro X Studio', icon: MessageCircle, color: '#111827', helper: 'Chib', description: 'สร้าง astrology memes และ posts สำหรับ X', lessons: [
    { id: 'x-virgo-angle', xp: 22, title: 'Virgo meme angle', task: 'เลือก 1 angle ที่คนอ่านแล้วรู้สึกว่า “นี่คือฉัน”', examples: ['Virgo checking the outfit, the text, and the moon sign.', 'Earth sign, soft heart, strong standards.', 'POV: you said “I’m chill” but made a spreadsheet.'], chatgpt: 'Help me create astrology meme angles for X. My profile: Thai woman from Suwannaphum/Roi Et, Virgo, likes fashion, Bangkok/Thonglor, bowling, music, and soft funny posts. Give 12 short Virgo meme angles in English with Thai explanations. Make them relatable, not mean, not generic.' },
    { id: 'x-one-liners', xp: 24, title: 'X one-liners', task: 'เขียน post สั้นๆ 5 แบบ: funny, soft, fashion, Bangkok, Virgo', examples: ['Virgo girl math: if the outfit is perfect, the plan is blessed.', 'Mercury retrograde but my eyeliner survived.', 'Thonglor mood, Roi Et heart, Virgo standards.'], chatgpt: 'Write 15 short X posts for astrology memes. Mix English and Thai-English. Topics: Virgo girl, fashion, Bangkok night out, Suwannaphum/Roi Et roots, soft confidence. Keep them under 240 characters.' },
    { id: 'x-meme-caption', xp: 22, title: 'Meme caption formula', task: 'ใช้สูตร: setup + astrology twist + punchline แล้วเขียน 3 captions', examples: ['me: I’m spontaneous / also me: checks the plan 14 times', 'when he says “just relax” and your Virgo moon opens Notes app', 'outfit calm, birth chart loud'], chatgpt: 'Teach me a repeatable formula for astrology meme captions on X: setup + astrology twist + punchline. Give 8 examples for Virgo/fashion/Bangkok, then ask me to write 3 and improve them.' },
    { id: 'x-content-week', xp: 26, title: '7-day X plan', task: 'วางแผนโพสต์ 7 วัน: meme, question, caption, astrology lesson', examples: ['Day 1: Virgo meme', 'Day 2: ask a question', 'Day 3: fashion astrology caption'], chatgpt: 'Create a realistic 7-day X content plan for a beginner. Use my themes: Virgo, fashion, Thai/Isaan warmth, Bangkok/Thonglor, music, bowling, food. Include one sample post per day.' },
  ] },
  { id: 'bowling', title: 'Bowling & Fun', icon: Trophy, color: '#f59e0b', helper: 'Brown Buddy', description: 'ฝึก English ผ่านเกมและ social phrases', lessons: [
    { id: 'bowl-score', xp: 14, title: 'Bowling phrases', task: 'ฝึกพูด 3 ประโยคเวลาไป bowling กับเพื่อน', examples: ['It is my turn.', 'Nice shot!', 'I almost got a strike.'], chatgpt: 'Roleplay a bowling night with me in English. Teach me casual phrases, cheer me on, and correct only the most important mistake.' },
    { id: 'bowl-invite', xp: 16, title: 'Invite a friend', task: 'เขียน invitation ภาษาอังกฤษ 1 ข้อความ', examples: ['Do you want to go bowling in Thonglor?', 'Let’s play one game after dinner.'], chatgpt: 'Help me write a friendly English message inviting someone to bowling in Thonglor. Give me 3 versions: cute, casual, and confident.' },
  ] },
  { id: 'safety', title: 'Money & Safety', icon: ShieldCheck, color: '#18b7b1', helper: 'Chib', description: 'คำพูดสุภาพ ขอบเขตชัด และการเงินง่ายๆ', lessons: [
    { id: 'safety-dm', xp: 15, title: 'DM แปลกๆ ต้องระวัง', task: 'เขียนคำตอบสุภาพ 1 ประโยคเมื่อมีคนขอข้อมูลส่วนตัว', examples: ['I am not comfortable sharing that.', 'No, thank you.', 'Please contact me by email.'], chatgpt: 'Help me respond safely and politely in English when someone asks for private information. Give short replies and explain in Thai when to block or ignore.' },
    { id: 'money-budget', xp: 15, title: 'Thonglor day budget', task: 'เขียน spending plan ง่ายๆ: food, travel, save', examples: ['Food budget', 'Travel budget', 'Save a little first.'], chatgpt: 'Help me make a simple day budget for Bangkok or Thonglor. Use easy English categories: food, travel, shopping, and savings.' },
  ] },
];

const accountabilityItems = [
  { id: 'voice', title: 'ChatGPT voice', detail: 'คุย voice mode 3-5 นาที' },
  { id: 'style', title: 'Style output', detail: 'caption/post idea 1 อย่าง' },
  { id: 'reflect', title: 'Reflection', detail: 'เขียนสิ่งที่เรียน 1 บรรทัด' },
];

const badges = [
  { id: 'first', title: 'First Quest', need: 1, icon: Star },
  { id: 'focus', title: 'Steady Focus', need: 2, icon: Sparkles },
  { id: 'style', title: 'Style Spark', need: 4, icon: Camera },
  { id: 'voice', title: 'Voice Brave', need: 6, icon: Mic2 },
  { id: 'meme', title: 'Meme Maker', need: 8, icon: MessageCircle },
  { id: 'safe', title: 'Safe Online', need: 12, icon: ShieldCheck },
];

const storageKey = 'nannie-academy-progress-v11';

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
  const [promptStatus, setPromptStatus] = useState('');
  const [summaryStatus, setSummaryStatus] = useState('');
  const [surpriseId, setSurpriseId] = useState('');
  const done = progress.done || [];
  const daily = progress.daily || {};
  const reflections = progress.reflections || [];
  const mood = progress.mood || 'pretty';
  const selected = tracks.find((track) => track.id === activeTrack) || tracks[0];
  const allLessons = useMemo(() => tracks.flatMap((track) => track.lessons.map((lesson) => ({ ...lesson, track: track.title, helper: track.helper }))), []);
  const todayLesson = allLessons.find((lesson) => lesson.id === surpriseId) || allLessons[done.length % allLessons.length];
  const xp = done.reduce((sum, id) => sum + (allLessons.find((lesson) => lesson.id === id)?.xp || 0), 0);
  const level = Math.floor(xp / 80) + 1;
  const dailyDone = accountabilityItems.filter((item) => daily[item.id]).length;
  const accountabilityPercent = Math.min(100, Math.round(((done.length + dailyDone) / 34) * 100));
  const weeklySummary = buildWeeklySummary(reflections, done, allLessons, xp, level);
  const selectedMood = moodOptions.find((item) => item.id === mood) || moodOptions[2];
  const lastReward = progress.lastReward || 'วันนี้ทำแค่บทเดียวก็พอ ขอให้ได้ small win หนึ่งอย่าง';

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(progress)); }, [progress]);

  const setMood = (moodId) => setProgress({ ...progress, mood: moodId });
  const surpriseMe = () => {
    const unfinished = allLessons.filter((lesson) => !done.includes(lesson.id));
    const pool = unfinished.length ? unfinished : allLessons;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSurpriseId(pick.id);
    setActiveTrack(tracks.find((track) => track.lessons.some((lesson) => lesson.id === pick.id))?.id || 'english');
  };
  const rewardFor = (lesson) => {
    if (lesson.track === 'Astro X Studio') return 'Meme Maker energy unlocked: Nannie มี post idea ใหม่แล้ว';
    if (lesson.track === 'Fashion Studio') return 'Soft confidence +1: caption หรือ outfit language วันนี้ดีขึ้นแล้ว';
    if (lesson.track === 'English Voice') return 'Voice Brave +1: วันนี้ Nannie ได้พูดอังกฤษแล้ว';
    if (lesson.track === 'Astrology Basics') return 'Virgo focus unlocked: เข้าใจ astrology language เพิ่มอีกนิด';
    return 'Small win saved: วันนี้ทำสำเร็จแล้วหนึ่งอย่าง';
  };
  const saveProgress = (lesson, note) => {
    const alreadyDone = done.includes(lesson.id);
    const nextDone = alreadyDone ? done : [...done, lesson.id];
    const nextReflection = note.trim() ? [{ id: `${lesson.id}-${Date.now()}`, lessonId: lesson.id, lessonTitle: lesson.title, lessonArea: lesson.track, helper: lesson.helper, answer: note.trim().slice(0, 700), createdAt: new Date().toISOString() }, ...reflections].slice(0, 20) : reflections;
    setProgress({ ...progress, done: nextDone, reflections: nextReflection, streak: Math.max(1, progress.streak || 0), lastDoneAt: new Date().toISOString(), lastReward: rewardFor(lesson) });
    setSurpriseId('');
  };
  const completeQuest = (lesson) => { if (!done.includes(lesson.id)) saveProgress(lesson, ''); };
  const toggleDaily = (itemId) => setProgress({ ...progress, daily: { ...daily, [itemId]: !daily[itemId] } });
  const reset = () => { setProgress({ done: [], daily: {}, streak: 0, reflections: [], mood: 'pretty' }); setAnswer(''); setSubmitStatus(''); setPromptStatus(''); setSummaryStatus(''); setSurpriseId(''); };

  const copyChatGPTPrompt = async (lesson = todayLesson) => {
    const prompt = `${mentorVoice}\n\nNannie mood today: ${selectedMood.label}. ${selectedMood.instruction}\n\nLesson: ${lesson.title}\n${lesson.chatgpt}\n\nAfter we finish, give me:\n1. three corrected sentences or post options\n2. one phrase/formula to memorize\n3. one short sentence I can paste back into Nannie Academy`;
    try { await navigator.clipboard?.writeText(prompt); setPromptStatus('คัดลอกแล้ว เปิด Nannie Mentor/ChatGPT แล้วกด voice ได้เลย'); }
    catch { setPromptStatus(prompt); }
  };
  const copyWeeklySummary = async () => {
    try { await navigator.clipboard?.writeText(weeklySummary); setSummaryStatus('คัดลอก weekly review แล้ว'); }
    catch { setSummaryStatus(weeklySummary); }
  };
  const copyBackup = async () => {
    const backup = JSON.stringify({ app: 'Nannie Academy', exportedAt: new Date().toISOString(), progress }, null, 2);
    try { await navigator.clipboard?.writeText(backup); setSummaryStatus('คัดลอก backup แล้ว'); }
    catch { setSummaryStatus(backup); }
  };
  const submitToChib = async () => {
    if (!answer.trim()) { setSubmitStatus('เขียนประโยคที่ได้จาก ChatGPT ก่อนนะคะ'); return; }
    setSubmitStatus('กำลังบันทึก...');
    const payload = { name: 'Nannie', lessonTitle: todayLesson.title, lessonArea: todayLesson.track, xp: todayLesson.xp, answer };
    saveProgress(todayLesson, answer);
    setAnswer('');
    try {
      const endpoint = window.NANNIE_API_ENDPOINT || '/api/submit';
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': '1' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Submit failed');
      setSubmitStatus('บันทึกแล้วค่ะ');
    } catch { setSubmitStatus('บันทึกในเครื่องนี้แล้วค่ะ'); }
  };
  const trackCompletion = (track) => Math.round((track.lessons.filter((lesson) => done.includes(lesson.id)).length / track.lessons.length) * 100);

  return <main className="academy-shell">
    <aside className="track-rail" aria-label="Learning tracks"><div className="rail-logo"><Bot size={22} /></div>{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className={activeTrack === track.id ? 'rail-button active' : 'rail-button'} onClick={() => setActiveTrack(track.id)} title={track.title}><Icon size={19} /><span>{track.title}</span></button>; })}</aside>
    <section className="academy-main">
      <header className="topbar"><div><p className="place-pill">ครูใจดีจาก Suwannaphum</p><h1>Nannie Academy</h1><p>แผนเรียนส่วนตัวสำหรับภาษาอังกฤษ ความมั่นใจ และ astrology content บน X</p></div><button className="icon-action" onClick={reset} title="Reset progress"><RotateCcw size={18} /></button></header>
      <section className="context-strip" aria-label="How Nannie Academy works">
        <article><strong>นี่คืออะไร</strong><p>แผนที่การเรียน: เลือกบท ฝึกกับ ChatGPT voice แล้วเก็บ progress ไว้ที่นี่</p></article>
        <article><strong>วันนี้รู้สึกยังไง</strong><div className="mood-row">{moodOptions.map((item) => <button key={item.id} className={mood === item.id ? 'mood-chip active' : 'mood-chip'} onClick={() => setMood(item.id)}>{item.label}</button>)}</div></article>
        <article><strong>เป้าหมายคืออะไร</strong><p>พูดอังกฤษดีขึ้น และสร้างตัวตนแบบ Virgo, fashion, Bangkok, Isaan warmth</p></article>
        <article><strong>ทำแค่นี้พอ</strong><p>Copy prompt → voice 3-5 นาที → save 1 ประโยคที่ ChatGPT แก้ให้</p></article>
      </section>
      <section className="daily-focus">
        <motion.article className="quest-card hero-quest" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><div className="card-head"><div><p className="eyebrow">ทำวันนี้</p><h2>{todayLesson.title}</h2><p>{todayLesson.track} with {todayLesson.helper}</p></div><span className="xp-pill">+{todayLesson.xp} XP</span></div><div className="daily-steps"><span>1 Copy prompt</span><span>2 Open mentor</span><span>3 Voice 3-5 min</span><span>4 Save 1 sentence</span></div><p className="task-text">{todayLesson.task}</p><div className="example-row">{todayLesson.examples.map((example) => <code key={example}>{example}</code>)}</div><div className="chatgpt-inline"><button type="button" onClick={() => copyChatGPTPrompt(todayLesson)}><Clipboard size={16} /> คัดลอก prompt</button><a href={nannieGptUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> เปิด Nannie Mentor</a><button type="button" onClick={surpriseMe}><Sparkles size={16} /> Surprise me</button></div>{promptStatus && <p className="prompt-status">{promptStatus}</p>}<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="วาง 1 ประโยคที่ ChatGPT แก้ให้ หรือ 1 post idea ที่ชอบตรงนี้..." /><div className="action-row"><button onClick={submitToChib}><Send size={17} /> บันทึก progress</button>{submitStatus && <span>{submitStatus}</span>}</div></motion.article>
        <motion.article className="profile-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}><div className="mascot-banner"><MascotPair /><span className="spark one" /><span className="spark two" /></div><p className="eyebrow">Nannie</p><h2>Level {level}</h2><p className="muted">{lastReward}</p><div className="stat-row"><Stat icon={Star} label="XP" value={xp} /><Stat icon={Trophy} label="Done" value={done.length} /><Stat icon={Flame} label="Streak" value={progress.streak || 0} /></div><div className="ring-row"><div className="ring" style={{ '--value': `${accountabilityPercent}%` }}><span>{accountabilityPercent}%</span></div><p>Daily practice, short reflection, steady progress.</p></div></motion.article>
      </section>
      <section className="content-grid"><article className="lesson-map"><div className="card-head"><div><h2>{selected.title}</h2><p>{selected.description}</p><p className="helper-line">{selected.helper}: {helperRoles[selected.helper]}</p></div><span className="xp-pill">{selected.lessons.length} quests</span></div>{selected.lessons.map((lesson, index) => { const isDone = done.includes(lesson.id); return <button key={lesson.id} className={isDone ? 'lesson-node complete' : 'lesson-node'} onClick={() => completeQuest(lesson)} disabled={isDone}><span>{isDone ? <Check size={20} /> : index + 1}</span><div><strong>{lesson.title}</strong><p>{lesson.task}</p></div><ChevronRight size={18} /></button>; })}</article>
        <aside className="side-stack"><article className="today-card"><div className="card-head compact"><div><h2>วันนี้</h2><p>{dailyDone}/3 complete</p></div><ShieldCheck size={20} /></div>{accountabilityItems.map((item) => <button key={item.id} className={daily[item.id] ? 'check-item done' : 'check-item'} onClick={() => toggleDaily(item.id)}><span>{daily[item.id] && <Check size={14} />}</span><strong>{item.title}</strong><small>{item.detail}</small></button>)}</article><article className="voice-card"><div className="mini-mascots"><div className="tiny-bear" /><div className="tiny-kitty" /></div><h2>Nannie Mentor</h2><p>ใช้ ChatGPT Plus สำหรับคุย voice, ฝึกภาษา, และช่วยคิด X posts แบบมีตัวตน</p><a href={nannieGptUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> เปิด mentor</a><small>ถ้ายังไม่มี custom GPT ลิงก์นี้จะเปิด ChatGPT ปกติก่อน</small></article><article className="review-card"><h2>Weekly Review</h2><p>สรุปให้ Chib ดูว่าเรียนอะไรไปแล้ว post ideas ไหนน่าต่อยอด และควรเรียนอะไรต่อ</p><button onClick={copyWeeklySummary}><Clipboard size={16} /> Copy review</button><button onClick={copyBackup}><Clipboard size={16} /> Copy backup</button>{summaryStatus && <small>{summaryStatus}</small>}</article></aside>
      </section>
      <section className="track-grid">{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className="track-tile" onClick={() => setActiveTrack(track.id)}><span style={{ background: track.color }}><Icon size={18} /></span><strong>{track.title}</strong><small>{trackCompletion(track)}% complete</small></button>; })}</section>
    </section>
  </main>;
}

function buildWeeklySummary(reflections, done, lessons, xp, level) {
  const completed = done.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean);
  const recent = reflections.slice(0, 7);
  return ['Nannie Academy weekly review', `Level: ${level}`, `XP: ${xp}`, `Completed quests: ${completed.length}`, '', 'Completed lessons:', completed.length ? completed.map((lesson) => `- ${lesson.track}: ${lesson.title}`).join('\n') : '- None yet', '', 'Recent reflections / post ideas:', recent.length ? recent.map((item) => `- ${item.lessonTitle}: ${item.answer}`).join('\n') : '- None yet', '', 'Chib, please review her progress, praise effort first, improve her English/content ideas, and choose the next best quest.'].join('\n');
}

function Stat({ icon: Icon, label, value }) { return <div className="stat"><Icon size={17} /><strong>{value}</strong><span>{label}</span></div>; }

createRoot(document.getElementById('root')).render(<App />);

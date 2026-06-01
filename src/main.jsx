import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Bot, Brain, Camera, Check, ChevronRight, Clipboard, Flame, Gift, MessageCircle, RotateCcw, Send, ShieldCheck, Sparkles, Star, Trophy, Users } from 'lucide-react';
import './style.css';

const moodOptions = [
  { id: 'soft', label: 'ขอเบาๆ', note: 'วันนี้ทำภารกิจเล็กมากก็พอ' },
  { id: 'fun', label: 'อยากสนุก', note: 'วันนี้ขอแบบเล่นง่าย ยิ้มได้' },
  { id: 'pretty', label: 'อยากมั่นใจ', note: 'วันนี้เน้นสวย เก่ง และเป็นตัวเอง' },
  { id: 'focus', label: 'พร้อมลุย', note: 'วันนี้เน้นจริงจัง แต่ไม่กดดัน' },
];

const helperRoles = {
  'คิตตี้': 'ช่วยทำให้บทเรียนเบา น่ารัก และจำง่าย',
  'บราวน์': 'คอยให้กำลังใจ เก็บแต้ม และเตือนให้ทำทีละนิด',
  'ครูสุวรรณภูมิ': 'สอนแบบอบอุ่น เหมือนคนบ้านเดียวกันที่อยากเห็นนานนี่โต',
};

const tracks = [
  {
    id: 'start',
    title: 'เริ่มง่ายวันนี้',
    icon: Sparkles,
    color: '#22a06b',
    helper: 'บราวน์',
    description: 'ภารกิจสั้นๆ ที่ทำให้กลับมาเรียนได้ทุกวัน',
    lessons: [
      {
        id: 'start-mood',
        points: 12,
        title: 'เช็กใจวันนี้',
        task: 'เลือกอารมณ์วันนี้ แล้วเขียนหนึ่งบรรทัดว่าอยากได้อะไรจากบทเรียนนี้',
        examples: ['วันนี้อยากเรียนแบบสนุก', 'อยากได้ไอเดียโพสต์ดวง', 'อยากมั่นใจขึ้นอีกนิด'],
        outcome: 'นานนี่รู้ว่าตัวเองต้องการอะไร และเริ่มได้แบบไม่หนัก',
      },
      {
        id: 'start-story',
        points: 16,
        title: 'เสน่ห์จากสุวรรณภูมิ',
        task: 'เขียนเรื่องสั้นๆ เกี่ยวกับตัวเอง 2 บรรทัด: บ้านเกิด รสนิยม หรือสิ่งที่คนจำได้',
        examples: ['สาวสุวรรณภูมิที่ชอบดวง แฟชั่น และมุกน่ารัก', 'อยู่กรุงเทพ แต่ใจยังมีความอบอุ่นแบบร้อยเอ็ด', 'ชอบโบว์ลิ่ง เพลง อาหาร และเรื่องดวง'],
        outcome: 'ได้วัตถุดิบส่วนตัวไว้ใช้สร้างตัวตนบน X',
      },
      {
        id: 'start-one-win',
        points: 14,
        title: 'ชนะเล็กๆ หนึ่งอย่าง',
        task: 'เลือกหนึ่งอย่างที่ทำได้วันนี้ แล้วบันทึกให้ตัวเองภูมิใจ',
        examples: ['คิดหัวข้อโพสต์ได้ 1 หัวข้อ', 'เข้าใจราศีกันย์มากขึ้น', 'เขียนแคปชันได้หนึ่งแบบ'],
        outcome: 'สร้างนิสัยเรียนสั้นๆ แต่ต่อเนื่อง',
      },
    ],
  },
  {
    id: 'fashion',
    title: 'แฟชั่นกับความมั่นใจ',
    icon: Camera,
    color: '#f06f4f',
    helper: 'คิตตี้',
    description: 'เอาสไตล์ของนานนี่มาเป็นคอนเทนต์ที่คนจำได้',
    lessons: [
      {
        id: 'fashion-vibe',
        points: 18,
        title: 'ลุควันนี้เป็นพลังดาวอะไร',
        task: 'เลือกหนึ่งลุค แล้วจับคู่กับอารมณ์ทางโหราศาสตร์',
        examples: ['ชุดเขียว = สงบ แพง ละมุน', 'ลุคทองหล่อ = สวยแบบมั่นใจ', 'ลุคโบว์ลิ่ง = สนุก เข้าถึงง่าย'],
        outcome: 'ได้มุมโพสต์แฟชั่นที่โยงกับดวงได้อย่างเป็นธรรมชาติ',
      },
      {
        id: 'fashion-caption',
        points: 20,
        title: 'แคปชันสายดวงสายสวย',
        task: 'เขียนแคปชันภาษาไทย 3 แบบ: น่ารัก ตลก และดูแพง',
        examples: ['ราศีกันย์ไม่ได้เยอะ แค่รายละเอียดต้องเป๊ะ', 'วันนี้แต่งตัวตามดาว ไม่ตามใจใคร', 'ทองหล่อคืนนี้ ขอให้ดาวเข้าข้าง'],
        outcome: 'มีแคปชันพร้อมใช้กับรูปตัวเอง',
      },
      {
        id: 'fashion-shot',
        points: 18,
        title: 'แผนถ่ายรูป 3 ช็อต',
        task: 'วางรูป 3 แบบสำหรับหนึ่งโพสต์: หน้าตรง รายละเอียดชุด และบรรยากาศ',
        examples: ['รูปยิ้ม', 'เครื่องประดับหรือกระเป๋า', 'โต๊ะอาหาร คาเฟ่ หรือทางโบว์ลิ่ง'],
        outcome: 'โพสต์ดูมีเรื่องราว ไม่ใช่แค่รูปเดียวจบ',
      },
    ],
  },
  {
    id: 'astro',
    title: 'พื้นฐานโหราศาสตร์',
    icon: Brain,
    color: '#7b6cf6',
    helper: 'ครูสุวรรณภูมิ',
    description: 'เรียนดวงแบบเข้าใจง่าย เอาไปเล่าให้คนอื่นฟังได้',
    lessons: [
      {
        id: 'astro-virgo',
        points: 18,
        title: 'ราศีกันย์คืออะไร',
        task: 'เขียน 3 คำที่อธิบายราศีกันย์ แล้วโยงกับตัวนานนี่',
        examples: ['ละเอียด', 'รักความเรียบร้อย', 'อยากช่วยให้สิ่งต่างๆ ดีขึ้น'],
        outcome: 'เริ่มสร้างเสียงของตัวเองในฐานะสาวราศีกันย์',
      },
      {
        id: 'astro-elements',
        points: 18,
        title: 'ธาตุทั้งสี่จำง่าย',
        task: 'เลือกหนึ่งธาตุที่ตรงกับอารมณ์วันนี้ แล้วเขียนว่าทำไม',
        examples: ['ดิน = มั่นคง', 'น้ำ = อ่อนไหว', 'ไฟ = กล้า', 'ลม = คิดไว'],
        outcome: 'เข้าใจภาษาดวงพื้นฐานที่ใช้ทำโพสต์ได้บ่อย',
      },
      {
        id: 'astro-chart',
        points: 20,
        title: 'อาทิตย์ จันทร์ ลัคนา',
        task: 'สรุปความหมายของสามคำนี้แบบคนทั่วไปอ่านแล้วเข้าใจ',
        examples: ['อาทิตย์ = ตัวตน', 'จันทร์ = ความรู้สึก', 'ลัคนา = ภาพแรกที่คนเห็น'],
        outcome: 'มีพื้นฐานไว้ทำโพสต์ความรู้แบบสั้นๆ',
      },
      {
        id: 'astro-love',
        points: 20,
        title: 'ดวงความรักแบบไม่งมงาย',
        task: 'เขียนโพสต์สั้นๆ ที่ให้กำลังใจคนอ่านเรื่องความรัก โดยไม่ฟันธงแรง',
        examples: ['บางครั้งดาวไม่ได้บอกให้รอ แต่บอกให้รักตัวเองก่อน', 'คนที่ใช่ไม่ควรทำให้เราต้องเดาตลอดเวลา'],
        outcome: 'คอนเทนต์ดูอบอุ่น น่าแชร์ และไม่ทำร้ายคนอ่าน',
      },
    ],
  },
  {
    id: 'xideas',
    title: 'ไอเดียโพสต์ดวงบน X',
    icon: MessageCircle,
    color: '#111827',
    helper: 'คิตตี้',
    description: 'ฝึกทำมีม มุมตลก และโพสต์สั้นที่คนอยากแชร์',
    lessons: [
      {
        id: 'x-virgo-meme',
        points: 24,
        title: 'สูตรมีมราศีกันย์',
        task: 'ใช้สูตร: สถานการณ์จริง + นิสัยราศีกันย์ + มุกจบ แล้วเขียน 3 มุก',
        examples: ['บอกว่าไม่คิดมาก แต่จัดตารางในหัวไปแล้ว', 'ไม่ได้จับผิด แค่รายละเอียดมันตะโกน', 'รักความสงบ แต่โต๊ะต้องเรียบร้อยก่อน'],
        outcome: 'ได้มีมที่คนราศีกันย์อ่านแล้วรู้สึกว่าใช่',
      },
      {
        id: 'x-fashion-astro',
        points: 22,
        title: 'แฟชั่นตามพลังดาว',
        task: 'จับคู่ลุค 1 ลุคกับราศีหรือธาตุ แล้วเขียนโพสต์สั้นๆ',
        examples: ['ลุคเขียววันนี้คือพลังธาตุดิน: นิ่ง สวย แพง', 'ถ้าดาวบอกให้พัก ก็พักแบบแต่งตัวสวย'],
        outcome: 'ผสมแฟชั่นกับดวงให้เป็นเอกลักษณ์ของนานนี่',
      },
      {
        id: 'x-question',
        points: 20,
        title: 'คำถามที่ทำให้คนตอบ',
        task: 'เขียนคำถาม 3 ข้อที่คนชอบดวงอยากมาตอบ',
        examples: ['ราศีไหนชอบคิดมากที่สุด', 'ถ้าวันนี้เป็นธาตุหนึ่งธาตุ คุณเป็นธาตุอะไร', 'ราศีกันย์ควรพักยังไงให้ไม่รู้สึกผิด'],
        outcome: 'เพิ่มโอกาสให้คนคุย ตอบ และจำบัญชีได้',
      },
      {
        id: 'x-food-home',
        points: 20,
        title: 'ดวง บ้านเกิด และของอร่อย',
        task: 'โยงเรื่องสุวรรณภูมิ ร้อยเอ็ด อาหาร หรือเพลง เข้ากับมุมดวง 1 โพสต์',
        examples: ['ใจราศีกันย์ก็เหมือนส้มตำที่ต้องปรุงให้พอดี', 'โตที่ร้อยเอ็ด เลยเชื่อว่าความจริงใจดูออกจากรายละเอียดเล็กๆ'],
        outcome: 'คอนเทนต์มีความเป็นนานนี่ ไม่เหมือนบัญชีดวงทั่วไป',
      },
    ],
  },
  {
    id: 'growth',
    title: 'โตบน X แบบคนชอบดวง',
    icon: Users,
    color: '#18a0c8',
    helper: 'ครูสุวรรณภูมิ',
    description: 'เรียนวิธีดึงคนติดตามอย่างจริงใจและทำซ้ำได้',
    lessons: [
      {
        id: 'growth-audience',
        points: 24,
        title: 'ใครคือคนที่อยากให้ติดตาม',
        task: 'เลือกคนดู 1 กลุ่ม แล้วเขียนว่าเขามาหาอะไรจากนานนี่',
        examples: ['สาวๆ ที่ชอบดวงและแฟชั่น', 'คนราศีกันย์ที่ชอบมุกตรงใจ', 'คนที่อยากได้กำลังใจแบบนุ่มๆ'],
        outcome: 'โพสต์จะชัดขึ้น เพราะรู้ว่ากำลังคุยกับใคร',
      },
      {
        id: 'growth-follow',
        points: 26,
        title: 'เหตุผลที่คนจะกดติดตาม',
        task: 'เขียนคำสัญญาของบัญชี 1 ประโยค: ตามแล้วเขาจะได้อะไร',
        examples: ['ตามแล้วได้มุกดวงที่อ่านแล้วรู้สึกว่าโดน', 'ตามแล้วได้ไอเดียแต่งตัวตามพลังดาว', 'ตามแล้วได้กำลังใจแบบสาวราศีกันย์'],
        outcome: 'บัญชีมีทิศทาง คนใหม่เข้าใจเร็วว่าควรติดตามทำไม',
      },
      {
        id: 'growth-reply',
        points: 22,
        title: 'ตอบกลับให้คนจำได้',
        task: 'เขียนประโยคตอบกลับ 3 แบบ: น่ารัก ตลก และอบอุ่น',
        examples: ['ราศีกันย์เห็นแล้วพยักหน้าเงียบๆ', 'อันนี้ดาวไม่ได้เตือนแล้ว ดาวขอพักก่อน', 'ขอบคุณที่มาเล่าให้อ่านนะ น่ารักมาก'],
        outcome: 'คนรู้สึกว่าเจ้าของบัญชีมีชีวิต มีเสน่ห์ และน่าคุยด้วย',
      },
      {
        id: 'growth-week',
        points: 28,
        title: 'ตารางโพสต์ 7 วัน',
        task: 'วางแผน 7 วัน: มีม 2 ความรู้ 2 คำถาม 1 แฟชั่น 1 เรื่องส่วนตัว 1',
        examples: ['จันทร์: มีมราศีกันย์', 'พุธ: ความรู้ธาตุทั้งสี่', 'ศุกร์: ลุคทองหล่อตามพลังดาว'],
        outcome: 'มีแผนโพสต์ที่ทำจริงได้ ไม่ต้องคิดใหม่ทุกวัน',
      },
    ],
  },
  {
    id: 'fun',
    title: 'โบว์ลิ่ง เพลง และชีวิต',
    icon: Trophy,
    color: '#f5a524',
    helper: 'บราวน์',
    description: 'เปลี่ยนสิ่งที่ชอบให้เป็นเรื่องเล่าและคอนเทนต์',
    lessons: [
      {
        id: 'fun-bowling',
        points: 18,
        title: 'โบว์ลิ่งก็เป็นคอนเทนต์ได้',
        task: 'เขียนมุกดวง 2 มุกที่โยงกับโบว์ลิ่ง',
        examples: ['ชีวิตก็เหมือนโบว์ลิ่ง บางวันตั้งใจมากแต่ลูกลงราง', 'ราศีกันย์ไม่ได้อยากชนะ แค่อยากท่าโยนสวย'],
        outcome: 'ได้โพสต์ที่สนุกและเป็นตัวเอง',
      },
      {
        id: 'fun-music',
        points: 16,
        title: 'เพลงกับอารมณ์ดาว',
        task: 'เลือกเพลงหนึ่งเพลง แล้วเขียนว่ามันให้พลังราศีหรือธาตุอะไร',
        examples: ['เพลงนี้เหมือนธาตุไฟ เพราะทำให้กล้า', 'เพลงนี้เหมือนธาตุน้ำ เพราะนุ่มและคิดถึงบ้าน'],
        outcome: 'ทำคอนเทนต์ที่เชื่อมเพลงกับดวงได้',
      },
    ],
  },
  {
    id: 'safety',
    title: 'เงิน ขอบเขต และความปลอดภัย',
    icon: ShieldCheck,
    color: '#0fb7a7',
    helper: 'ครูสุวรรณภูมิ',
    description: 'ดูแลตัวเองเวลามีคนทัก มีคนชม หรือมีโอกาสใหม่ๆ',
    lessons: [
      {
        id: 'safe-dm',
        points: 18,
        title: 'ข้อความแปลกๆ ต้องระวัง',
        task: 'เขียนคำตอบสุภาพ 2 แบบเมื่อไม่อยากให้ข้อมูลส่วนตัว',
        examples: ['ขอบคุณนะคะ แต่ขอไม่แชร์ข้อมูลส่วนตัวค่ะ', 'ถ้าเป็นเรื่องงาน ส่งรายละเอียดชัดๆ มาได้เลยค่ะ'],
        outcome: 'มีประโยคป้องกันตัวเองโดยไม่ต้องรู้สึกผิด',
      },
      {
        id: 'safe-money',
        points: 18,
        title: 'งบวันเที่ยวทองหล่อ',
        task: 'แบ่งงบง่ายๆ 3 ช่อง: กิน เดินทาง เก็บไว้',
        examples: ['กินเท่าไร', 'เดินทางเท่าไร', 'เก็บก่อนใช้เท่าไร'],
        outcome: 'ฝึกคิดเรื่องเงินแบบไม่เครียด',
      },
    ],
  },
];

const accountabilityItems = [
  { id: 'open', title: 'เปิดแอป', detail: 'เข้ามาเช็กอารมณ์วันนี้' },
  { id: 'quest', title: 'ทำภารกิจ', detail: 'เลือกหนึ่งบทแล้วทำ 5 นาที' },
  { id: 'reflect', title: 'บันทึกสั้นๆ', detail: 'เขียนสิ่งที่ได้ 1 บรรทัด' },
];

const badges = [
  { id: 'first', title: 'เริ่มแล้ว', need: 1, icon: Star },
  { id: 'steady', title: 'ไม่หลุด', need: 3, icon: Flame },
  { id: 'style', title: 'สายสวย', need: 5, icon: Camera },
  { id: 'astro', title: 'สายดวง', need: 8, icon: Sparkles },
  { id: 'crowd', title: 'คนเริ่มจำ', need: 12, icon: Users },
  { id: 'safe', title: 'ดูแลตัวเอง', need: 16, icon: ShieldCheck },
];

const storageKey = 'nannie-academy-progress-v12-thai';

function readProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; }
}

function MascotPair() {
  return <div className="mascot-pair" aria-label="ผู้ช่วยของนานนี่">
    <div className="bear-helper"><span /><i /></div>
    <div className="kitty-helper"><b /><span /><i /></div>
  </div>;
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [activeTrack, setActiveTrack] = useState('start');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [summaryStatus, setSummaryStatus] = useState('');
  const [focusId, setFocusId] = useState('');
  const done = progress.done || [];
  const daily = progress.daily || {};
  const reflections = progress.reflections || [];
  const mood = progress.mood || 'pretty';
  const selected = tracks.find((track) => track.id === activeTrack) || tracks[0];
  const allLessons = useMemo(() => tracks.flatMap((track) => track.lessons.map((lesson) => ({ ...lesson, trackId: track.id, trackTitle: track.title, helper: track.helper }))), []);
  const todayLesson = allLessons.find((lesson) => lesson.id === focusId) || allLessons.find((lesson) => !done.includes(lesson.id)) || allLessons[0];
  const points = done.reduce((sum, id) => sum + (allLessons.find((lesson) => lesson.id === id)?.points || 0), 0);
  const level = Math.floor(points / 90) + 1;
  const dailyDone = accountabilityItems.filter((item) => daily[item.id]).length;
  const progressPercent = Math.min(100, Math.round(((done.length + dailyDone) / 42) * 100));
  const weeklySummary = buildWeeklySummary(reflections, done, allLessons, points, level);
  const selectedMood = moodOptions.find((item) => item.id === mood) || moodOptions[2];
  const lastReward = progress.lastReward || 'วันนี้เริ่มแบบเบาๆ ก็เก่งแล้ว ขอแค่แต้มเล็กหนึ่งแต้มก็พอ';

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(progress)); }, [progress]);

  const setMood = (moodId) => setProgress({ ...progress, mood: moodId });
  const chooseLesson = (lesson) => {
    setFocusId(lesson.id);
    setActiveTrack(lesson.trackId);
    setSubmitStatus('เลือกภารกิจนี้แล้ว ลองทำสั้นๆ ได้เลยค่ะ');
  };
  const surpriseMe = () => {
    const unfinished = allLessons.filter((lesson) => !done.includes(lesson.id));
    const pool = unfinished.length ? unfinished : allLessons;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setFocusId(pick.id);
    setActiveTrack(pick.trackId);
    setSubmitStatus('สุ่มภารกิจใหม่ให้แล้วค่ะ');
  };
  const rewardFor = (lesson) => {
    if (lesson.trackTitle === 'ไอเดียโพสต์ดวงบน X') return 'ปลดล็อกพลังนักทำมีม: วันนี้มีไอเดียโพสต์ใหม่แล้ว';
    if (lesson.trackTitle === 'โตบน X แบบคนชอบดวง') return 'ปลดล็อกพลังคนดู: บัญชีของนานนี่ชัดขึ้นอีกนิด';
    if (lesson.trackTitle === 'แฟชั่นกับความมั่นใจ') return 'ความมั่นใจเพิ่มขึ้น: สไตล์ของนานนี่เริ่มกลายเป็นคอนเทนต์';
    if (lesson.trackTitle === 'พื้นฐานโหราศาสตร์') return 'พลังสายดวงเพิ่มขึ้น: วันนี้อธิบายเรื่องดวงได้ดีขึ้น';
    return 'ชนะเล็กๆ สำเร็จแล้ว เก็บแต้มไว้ได้เลย';
  };
  const saveProgress = (lesson, note) => {
    const alreadyDone = done.includes(lesson.id);
    const nextDone = alreadyDone ? done : [...done, lesson.id];
    const nextReflection = note.trim() ? [{ id: `${lesson.id}-${Date.now()}`, lessonId: lesson.id, lessonTitle: lesson.title, lessonArea: lesson.trackTitle, helper: lesson.helper, answer: note.trim().slice(0, 700), createdAt: new Date().toISOString() }, ...reflections].slice(0, 20) : reflections;
    setProgress({ ...progress, done: nextDone, reflections: nextReflection, daily: { ...daily, quest: true, reflect: true }, streak: Math.max(1, progress.streak || 0), lastDoneAt: new Date().toISOString(), lastReward: rewardFor(lesson) });
    setFocusId('');
  };
  const toggleDaily = (itemId) => setProgress({ ...progress, daily: { ...daily, [itemId]: !daily[itemId] } });
  const reset = () => { setProgress({ done: [], daily: {}, streak: 0, reflections: [], mood: 'pretty' }); setAnswer(''); setSubmitStatus(''); setSummaryStatus(''); setFocusId(''); setActiveTrack('start'); };
  const copyWeeklySummary = async () => {
    try { await navigator.clipboard?.writeText(weeklySummary); setSummaryStatus('คัดลอกสรุปแล้วค่ะ'); }
    catch { setSummaryStatus(weeklySummary); }
  };
  const submitLesson = async () => {
    if (!answer.trim() || answer.trim().length < 3) { setSubmitStatus('เขียนคำตอบสั้นๆ ก่อนนะคะ แค่หนึ่งบรรทัดก็พอ'); return; }
    setSubmitStatus('กำลังบันทึกแต้ม...');
    const payload = { name: 'Nannie', lessonTitle: todayLesson.title, lessonArea: todayLesson.trackTitle, xp: todayLesson.points, answer };
    saveProgress(todayLesson, answer);
    setAnswer('');
    try {
      const endpoint = window.NANNIE_API_ENDPOINT || '/api/submit';
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': '1' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Submit failed');
      setSubmitStatus('บันทึกแล้ว เก่งมากค่ะ');
    } catch { setSubmitStatus('บันทึกในเครื่องนี้แล้วค่ะ'); }
  };
  const trackCompletion = (track) => Math.round((track.lessons.filter((lesson) => done.includes(lesson.id)).length / track.lessons.length) * 100);

  return <main className="academy-shell">
    <aside className="track-rail" aria-label="หมวดบทเรียน"><div className="rail-logo"><Bot size={22} /></div>{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className={activeTrack === track.id ? 'rail-button active' : 'rail-button'} onClick={() => setActiveTrack(track.id)} title={track.title}><Icon size={19} /><span>{track.title}</span></button>; })}</aside>
    <section className="academy-main">
      <header className="topbar"><div><p className="place-pill">ครูใจดีจากสุวรรณภูมิ</p><h1>นานนี่อะคาเดมี</h1><p>เกมเรียนรู้ส่วนตัวสำหรับดวง แฟชั่น ความมั่นใจ และการโตบน X แบบมีเสน่ห์</p></div><button className="icon-action" onClick={reset} title="เริ่มใหม่"><RotateCcw size={18} /></button></header>
      <section className="context-strip" aria-label="วิธีเริ่ม">
        <article className="step-card"><strong>1 เลือกอารมณ์</strong><div className="mood-row">{moodOptions.map((item) => <button key={item.id} className={mood === item.id ? 'mood-chip active' : 'mood-chip'} onClick={() => setMood(item.id)}>{item.label}</button>)}</div><p>{selectedMood.note}</p></article>
        <article><strong>2 ทำภารกิจ 5 นาที</strong><p>อ่านโจทย์ แล้วตอบจากความคิดตัวเอง ไม่ต้องทำยาว</p></article>
        <article><strong>3 บันทึกหนึ่งบรรทัด</strong><p>เขียนไอเดีย โพสต์ หรือสิ่งที่ได้เรียน แล้วรับแต้ม</p></article>
        <article><strong>ถ้าคิดไม่ออก</strong><p>กด “สุ่มภารกิจ” ให้บราวน์กับคิตตี้เลือกให้</p></article>
      </section>
      <section className="daily-focus">
        <motion.article className="quest-card hero-quest" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><div className="card-head"><div><p className="eyebrow">ภารกิจวันนี้</p><h2>{todayLesson.title}</h2><p>{todayLesson.trackTitle} · {todayLesson.helper}</p></div><span className="xp-pill">+{todayLesson.points} แต้ม</span></div><div className="daily-steps"><span><strong>1</strong> อ่านโจทย์</span><span><strong>2</strong> ลองทำ</span><span><strong>3</strong> เขียนสั้นๆ</span><span><strong>4</strong> รับแต้ม</span></div><p className="task-text">{todayLesson.task}</p><div className="example-label">ไอเดียเริ่มต้น</div><div className="example-row">{todayLesson.examples.map((example) => <code key={example}>{example}</code>)}</div><p className="outcome-line"><Gift size={16} /> ทำแล้วจะได้: {todayLesson.outcome}</p><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="เขียนคำตอบหรือไอเดียที่ได้จากภารกิจนี้..." /><div className="action-row"><button onClick={submitLesson}><Send size={17} /> บันทึกแต้ม</button><button type="button" className="secondary-action" onClick={surpriseMe}><Sparkles size={16} /> สุ่มภารกิจ</button>{submitStatus && <span>{submitStatus}</span>}</div></motion.article>
        <motion.article className="profile-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}><div className="mascot-banner"><MascotPair /><span className="spark one" /><span className="spark two" /></div><p className="eyebrow">นานนี่</p><h2>เลเวล {level}</h2><p className="muted">{lastReward}</p><div className="stat-row"><Stat icon={Star} label="แต้ม" value={points} /><Stat icon={Trophy} label="สำเร็จ" value={done.length} /><Stat icon={Flame} label="ต่อเนื่อง" value={progress.streak || 0} /></div><div className="ring-row"><div className="ring" style={{ '--value': `${progressPercent}%` }}><span>{progressPercent}%</span></div><p>ทำวันละนิด สะสมตัวตนและไอเดียที่คนอยากติดตาม</p></div><div className="badge-row">{badges.map((badge) => { const Icon = badge.icon; const unlocked = done.length >= badge.need; return <div key={badge.id} className={unlocked ? 'badge unlocked' : 'badge'}><Icon size={15} /><span>{badge.title}</span></div>; })}</div></motion.article>
      </section>
      <section className="content-grid"><article className="lesson-map"><div className="card-head"><div><h2>{selected.title}</h2><p>{selected.description}</p><p className="helper-line">{selected.helper}: {helperRoles[selected.helper]}</p></div><span className="xp-pill">{selected.lessons.length} ภารกิจ</span></div>{selected.lessons.map((lesson, index) => { const fullLesson = { ...lesson, trackId: selected.id, trackTitle: selected.title, helper: selected.helper }; const isDone = done.includes(lesson.id); const isFocused = todayLesson.id === lesson.id; return <button key={lesson.id} className={`${isDone ? 'lesson-node complete' : 'lesson-node'} ${isFocused ? 'focused' : ''}`} onClick={() => chooseLesson(fullLesson)}><span>{isDone ? <Check size={20} /> : index + 1}</span><div><strong>{lesson.title}</strong><p>{lesson.task}</p></div><ChevronRight size={18} /></button>; })}</article>
        <aside className="side-stack"><article className="today-card"><div className="card-head compact"><div><h2>เช็กอินวันนี้</h2><p>{dailyDone}/3 สำเร็จ</p></div><ShieldCheck size={20} /></div>{accountabilityItems.map((item) => <button key={item.id} className={daily[item.id] ? 'check-item done' : 'check-item'} onClick={() => toggleDaily(item.id)}><span>{daily[item.id] && <Check size={14} />}</span><strong>{item.title}</strong><small>{item.detail}</small></button>)}</article><article className="growth-card"><div className="mini-mascots"><div className="tiny-bear" /><div className="tiny-kitty" /></div><h2>กฎโตบน X</h2><p>โพสต์ให้คนรู้สึกว่า “นี่แหละฉัน” ก่อน แล้วค่อยให้ความรู้สั้นๆ ที่จำง่าย</p><ul><li>มีมที่ตรงใจ</li><li>คำถามที่คนอยากตอบ</li><li>ตัวตนจากสุวรรณภูมิ ร้อยเอ็ด และกรุงเทพ</li><li>ตอบกลับแบบอบอุ่นให้คนจำได้</li></ul></article><article className="review-card"><h2>สมุดบันทึก</h2><p>เก็บไอเดียที่นานนี่เขียนไว้ เพื่อดูว่าบทไหนทำให้สนุกและควรต่อยอดอะไร</p><button onClick={copyWeeklySummary}><Clipboard size={16} /> คัดลอกสรุป</button>{summaryStatus && <small>{summaryStatus}</small>}<div className="recent-list">{reflections.slice(0, 3).map((item) => <p key={item.id}><strong>{item.lessonTitle}</strong>{item.answer}</p>)}{!reflections.length && <p>ยังไม่มีบันทึก ลองทำภารกิจแรกได้เลยค่ะ</p>}</div></article></aside>
      </section>
      <section className="track-grid">{tracks.map((track) => { const Icon = track.icon; return <button key={track.id} className="track-tile" onClick={() => setActiveTrack(track.id)}><span style={{ background: track.color }}><Icon size={18} /></span><strong>{track.title}</strong><small>สำเร็จ {trackCompletion(track)}%</small></button>; })}</section>
    </section>
  </main>;
}

function buildWeeklySummary(reflections, done, lessons, points, level) {
  const completed = done.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean);
  const recent = reflections.slice(0, 7);
  return ['สรุปนานนี่อะคาเดมี', `เลเวล: ${level}`, `แต้ม: ${points}`, `ภารกิจที่ทำแล้ว: ${completed.length}`, '', 'บทที่ทำแล้ว:', completed.length ? completed.map((lesson) => `- ${lesson.trackTitle}: ${lesson.title}`).join('\n') : '- ยังไม่มี', '', 'บันทึกล่าสุด:', recent.length ? recent.map((item) => `- ${item.lessonTitle}: ${item.answer}`).join('\n') : '- ยังไม่มี', '', 'ช่วยดูว่านานนี่สนุกกับอะไร ควรชมตรงไหน และภารกิจต่อไปควรเป็นอะไร'].join('\n');
}

function Stat({ icon: Icon, label, value }) { return <div className="stat"><Icon size={17} /><strong>{value}</strong><span>{label}</span></div>; }

createRoot(document.getElementById('root')).render(<App />);

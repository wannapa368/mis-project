import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ArrowUp, User, CheckCircle2, CircleDashed, RefreshCw, Send, Smile, Plus, Camera, Image as ImageIcon, GraduationCap, FileText, ExternalLink, Sparkles, SquarePen, ChevronDown, X, ZoomIn, Bot, MessagesSquare, Users } from 'lucide-react';
import axios from 'axios';
import Avatar from '../components/Avatar';
import { tagClass } from '../lib/tags';
import { forumCache, loadQuestions } from '../lib/forumCache';
import FacultyDashboard from '../components/FacultyDashboard';

import militaryDefermentImg from '../assets/images/military_deferment_mju.png';
import accidentInsuranceImg from '../assets/images/accident_insurance_mju.png';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

// SVGs for Chatbot
const AcademicLogo = () => (
  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md shadow-brand-600/30 select-none shrink-0 bg-gradient-to-br from-brand-600 to-accent-600">
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  </div>
);

const MascotAcademic = () => (
  <div className="flex flex-col items-center my-3 animate-bounce-slow">
    <svg className="w-24 h-24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="40" width="100" height="70" rx="35" fill="#EBF3FF" stroke="#3B82F6" strokeWidth="4" />
      <path d="M100 15L45 35L100 55L155 35L100 15Z" fill="#1E3A8A" />
      <path d="M140 37V60" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="140" cy="62" r="4" fill="#F59E0B" />
      <rect x="68" y="58" width="64" height="34" rx="17" fill="#1F2937" />
      <circle cx="88" cy="72" r="4.5" fill="#60A5FA" />
      <circle cx="112" cy="72" r="4.5" fill="#60A5FA" />
      <ellipse cx="80" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="120" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
      <rect x="65" y="110" width="70" height="55" rx="27.5" fill="#EBF3FF" stroke="#3B82F6" strokeWidth="4" />
      <rect x="88" y="122" width="24" height="20" rx="3" fill="#3B82F6" />
      <line x1="94" y1="128" x2="106" y2="128" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="94" y1="134" x2="106" y2="134" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// SVGs for Educational Carousel
const ComputerIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#EFF6FF" />
    <rect x="22" y="24" width="56" height="38" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    <rect x="27" y="29" width="46" height="26" rx="3" fill="#DBEAFE" />
    <circle cx="50" cy="42" r="6" fill="#2563EB" />
    <path d="M42 62L36 74H64L58 62" stroke="#1D4ED8" strokeWidth="3" strokeLinejoin="round" fill="#93C5FD" />
    <line x1="30" y1="74" x2="70" y2="74" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ScholarshipIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#FEF3C7" />
    <circle cx="50" cy="45" r="18" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
    <path d="M43 45L48 50L57 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="35" y="68" width="30" height="8" rx="3" fill="#D97706" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#ECFDF5" />
    <rect x="25" y="30" width="50" height="48" rx="8" stroke="#10B981" strokeWidth="3" fill="white" />
    <line x1="25" y1="44" x2="75" y2="44" stroke="#10B981" strokeWidth="3" />
    <circle cx="40" cy="54" r="3" fill="#059669" />
    <circle cx="50" cy="54" r="3" fill="#059669" />
    <circle cx="60" cy="54" r="3" fill="#059669" />
    <circle cx="40" cy="64" r="3" fill="#059669" />
    <circle cx="50" cy="64" r="3" fill="#059669" />
    <circle cx="60" cy="64" r="3" fill="#059669" />
    <line x1="38" y1="22" x2="38" y2="30" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="62" y1="22" x2="62" y2="30" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const CurriculumIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#F5F3FF" />
    <path d="M22 28C22 24.6863 24.6863 22 28 22H46C48.2091 22 50 23.7909 50 26V74C50 72.8954 48.2091 72 46 72H28C24.6863 72 22 69.3137 22 66V28Z" fill="#8B5CF6" />
    <path d="M78 28C78 24.6863 75.3137 22 72 22H54C51.7909 22 50 23.7909 50 26V74C50 72.8954 51.7909 72 54 72H72C75.3137 72 78 69.3137 78 66V28Z" fill="#A78BFA" />
    <line x1="29" y1="36" x2="43" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="29" y1="46" x2="43" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="29" y1="56" x2="39" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="57" y1="36" x2="71" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="57" y1="46" x2="71" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="57" y1="56" x2="67" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ชุดสีของการ์ดข้อมูลในแชท (ต้องเขียนคลาสเต็มเพื่อให้ Tailwind สร้าง CSS ได้)
const CARD_TONES = {
  violet: { soft: 'bg-violet-50', text: 'text-violet-600', solid: 'bg-violet-600', button: 'bg-violet-50 text-violet-700 hover:bg-violet-100', border: 'hover:border-violet-200' },
  blue: { soft: 'bg-blue-50', text: 'text-blue-600', solid: 'bg-blue-600', button: 'bg-blue-50 text-blue-700 hover:bg-blue-100', border: 'hover:border-blue-200' },
  amber: { soft: 'bg-amber-50', text: 'text-amber-600', solid: 'bg-amber-500', button: 'bg-amber-50 text-amber-700 hover:bg-amber-100', border: 'hover:border-amber-200' },
  emerald: { soft: 'bg-emerald-50', text: 'text-emerald-600', solid: 'bg-emerald-600', button: 'bg-emerald-600 text-white hover:bg-emerald-700', border: 'hover:border-emerald-200' },
  rose: { soft: 'bg-rose-50', text: 'text-rose-600', solid: 'bg-rose-600', button: 'bg-rose-600 text-white hover:bg-rose-700', border: 'hover:border-rose-200' },
};

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand-600/30 select-none">
    <Bot size={16} />
  </div>
);

// แปลง **ข้อความ** ในคำตอบของบอทให้เป็นตัวหนา
function renderRichText(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
      : part
  );
}

function ImageAttachment({ image, onPreview }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white whitespace-normal">
      <button
        type="button"
        onClick={() => onPreview({ url: image.url, title: image.caption || image.alt })}
        className="block w-full relative group cursor-pointer overflow-hidden bg-slate-50"
        title="คลิกเพื่อดูรูปภาพขนาดใหญ่"
      >
        <img
          src={image.url}
          alt={image.alt || 'รูปภาพ'}
          className="w-full h-auto max-h-96 object-contain group-hover:scale-[1.02] transition-transform duration-300"
          loading="eager"
        />
        <span className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-medium opacity-90 group-hover:opacity-100 transition">
          <ZoomIn size={12} /> คลิกดูรูปขนาดใหญ่
        </span>
      </button>
      {image.caption && (
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-600 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <span className="flex-1 text-center">{image.caption}</span>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-800 text-[10px] font-semibold shrink-0 inline-flex items-center gap-0.5"
          >
            เปิดแท็บใหม่ <ExternalLink size={10} />
          </a>
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'เมื่อสักครู่';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH');
}

export default function Home({ currentUser }) {
  const navigate = useNavigate();
  
  // View states: 'chatbot' (Academic AI) or 'forum' (Helpdesk web board)
  const [viewMode, setViewMode] = useState('chatbot'); 
  
  // Forum variables
  const [questions, setQuestions] = useState(() => forumCache.get(JSON.stringify({})) || []);
  const [forumLoading, setForumLoading] = useState(true);
  const [forumSlow, setForumSlow] = useState(false);
  const [forumError, setForumError] = useState(false);
  const [forumReloadKey, setForumReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [forumTab, setForumTab] = useState('all'); // 'all', 'mine', 'unanswered'
  const [selectedTag, setSelectedTag] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Chatbot variables
  const [chatInputValue, setChatInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Academic Chatbot Messages
  const [academicMessages, setAcademicMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      isMascot: true 
    },
    { 
      id: 2, 
      sender: 'bot', 
      text: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบแนะนำข้อมูลวิชาการและสารสนเทศ มหาวิทยาลัยแม่โจ้\n\nผมยินดีให้ข้อมูลเกี่ยวกับ:\n• หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70)\n• โครงสร้างหลักสูตร 120–124 หน่วยกิต & 4 Tracks อาชีพ\n• ค่าธรรมเนียมการศึกษา (ค่าเทอม 20,000 บาท)\n• ทุนการศึกษา “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5 (ทุนต่อเนื่อง & ไม่ต่อเนื่อง)\n• ปฏิทินการศึกษา มหาวิทยาลัยแม่โจ้ (PDF ทางการ)\n• การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 (พร้อมรูปประกาศ)\n• ประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (เออร์โกประกันภัย พร้อมรูปข้อมูล)\n\nสามารถเลื่อนดูการ์ดข้อมูล & แตะดูรูปภาพ หรือคลิกเลือกปุ่มด้านล่างได้เลยครับ!' 
    },
    {
      id: 3,
      sender: 'bot',
      isEduCarousel: true
    }
  ]);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const userMenuRef = useRef(null);

  // ปิดเมนูผู้ใช้เมื่อคลิกนอกเมนู
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // กด Esc เพื่อปิดหน้าต่างดูรูป
  useEffect(() => {
    if (!previewModalImage) return;
    const handleKeyDown = (e) => e.key === 'Escape' && setPreviewModalImage(null);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewModalImage]);

  // Scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [academicMessages, viewMode, isBotReplying]);

  // โหลดกระทู้ล่วงหน้าตั้งแต่เปิดเว็บ เพื่อปลุกเซิร์ฟเวอร์ (Render หลับเมื่อไม่มีคนใช้)
  // และให้ข้อมูลพร้อมแสดงทันทีเมื่อผู้ใช้กดเข้าหน้ากระทู้
  useEffect(() => {
    loadQuestions({}).catch(() => {});
  }, []);

  // หน่วงการค้นหา 300ms เพื่อไม่ยิง request ทุกครั้งที่พิมพ์ตัวอักษร
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Forum Questions (แสดงข้อมูลใน cache ทันที แล้วอัปเดตจากเซิร์ฟเวอร์ตามหลัง)
  useEffect(() => {
    if (viewMode !== 'forum') return;

    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedTag) params.tag = selectedTag;
    if (forumTab === 'mine') params.myThreads = currentUser.name;

    const applyTab = (data) =>
      forumTab === 'unanswered'
        ? data.filter(q => q.commentsCount === 0 && q.status === 'waiting')
        : data;

    let cancelled = false;
    const cached = forumCache.get(JSON.stringify(params));
    if (cached) setQuestions(applyTab(cached));
    setForumLoading(!cached);
    setForumError(false);
    setForumSlow(false);
    const slowTimer = setTimeout(() => setForumSlow(true), 4000);

    loadQuestions(params)
      .then((data) => {
        if (!cancelled) setQuestions(applyTab(data));
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        if (!cancelled && !cached) setForumError(true);
      })
      .finally(() => {
        clearTimeout(slowTimer);
        if (!cancelled) {
          setForumLoading(false);
          setForumSlow(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, [viewMode, debouncedSearch, selectedTag, forumTab, currentUser.name, forumReloadKey]);

  const reloadForum = () => {
    forumCache.clear();
    setForumReloadKey(k => k + 1);
  };

  // Seed data trigger
  const handleSeedData = async () => {
    setForumLoading(true);
    try {
      await axios.get(`${API_URL}/api/seed`);
      forumCache.clear();
      if (viewMode === 'forum') {
        reloadForum();
      } else {
        alert('นำเข้าข้อมูลสำเร็จแล้วครับ! คุณสามารถเปิดสลับเป็น [กระทู้เว็บบอร์ด] เพื่อดูข้อมูลได้ครับ');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลตัวอย่าง');
    } finally {
      setForumLoading(false);
    }
  };

  // โหวตแบบ optimistic: อัปเดตหน้าจอทันที ไม่ต้องรอโหลดรายการกระทู้ใหม่ทั้งหมด
  const handleUpvote = async (e, id) => {
    e.stopPropagation();
    const toggleVote = (q) => {
      if (q._id !== id) return q;
      const voted = q.upvoteUserIds?.includes(currentUser.name);
      return {
        ...q,
        upvotes: q.upvotes + (voted ? -1 : 1),
        upvoteUserIds: voted
          ? q.upvoteUserIds.filter(u => u !== currentUser.name)
          : [...(q.upvoteUserIds || []), currentUser.name]
      };
    };
    setQuestions(prev => prev.map(toggleVote));

    try {
      const { data } = await axios.post(`${API_URL}/api/questions/${id}/upvote`, {
        userId: currentUser.name
      });
      const applyServer = (q) =>
        q._id === id ? { ...q, upvotes: data.upvotes, upvoteUserIds: data.upvoteUserIds } : q;
      setQuestions(prev => prev.map(applyServer));
      for (const [key, list] of forumCache) forumCache.set(key, list.map(applyServer));
    } catch (err) {
      console.error(err);
      setQuestions(prev => prev.map(toggleVote)); // ย้อนกลับถ้าโหวตไม่สำเร็จ
    }
  };

  // Process sending chat message (Academic Only)
  const handleSendChatMessage = async (textToSend) => {
    if (!textToSend.trim() || isBotReplying) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    
    setAcademicMessages(prev => [...prev, userMsg]);
    setIsBotReplying(true);
    setChatInputValue('');

    // Process bot response
    setTimeout(async () => {
      try {
        const cleanText = textToSend.trim().toLowerCase();

        // 0. ข้อมูลหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70)
        if (
          cleanText.includes('หลักสูตร') ||
          cleanText.includes('2570') ||
          cleanText.includes('รหัส 70') ||
          cleanText.includes('รหัส70') ||
          cleanText.includes('โครงสร้างหลักสูตร') ||
          cleanText.includes('หน่วยกิต') ||
          cleanText.includes('[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]') ||
          cleanText.includes('[โครงสร้างหลักสูตร 70]') ||
          cleanText.includes('[โครงสร้างหน่วยกิต]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'bot', isMascot: true },
            {
              id: Date.now() + 2,
              sender: 'bot',
              text: 'หลักสูตร วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์\n(หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70) มหาวิทยาลัยแม่โจ้\n\nได้รับการออกแบบตามเกณฑ์มาตรฐานอุดมศึกษาฉบับใหม่ เน้นสมรรถนะการปฏิบัติงานจริง (Outcome-Based Education: OBE) และปรับปรุงเนื้อหาให้ทันต่อเทคโนโลยี AI และ Cloud Native\n\nโครงสร้างหลักสูตร (รวมตลอดหลักสูตรไม่น้อยกว่า 120–124 หน่วยกิต):\n\n1️ หมวดวิชาศึกษาทั่วไป (General Education) ไม่น้อยกว่า 24–30 หน่วยกิต\n• กลุ่มทักษะการสื่อสารและภาษา (Thai/English): 6–9 หน่วยกิต\n• กลุ่มทักษะดิจิทัลและการรู้เท่าทันเทคโนโลยี: 6 หน่วยกิต\n• กลุ่มทักษะความเป็นผู้ประกอบการและการคิดเชิงนวัตกรรม: 6 หน่วยกิต\n• กลุ่มการพัฒนาสุขภาวะและความรับผิดชอบต่อสังคม: 6 หน่วยกิต\n\n2️ หมวดวิชาเฉพาะ (Specialized Courses) ไม่น้อยกว่า 84–90 หน่วยกิต\n• กลุ่มวิชาแกน (Core Mathematics & Science): 12–15 หน่วยกิต\n• กลุ่มวิชาเอกบังคับ (Core CS Subjects): 42–45 หน่วยกิต\n• กลุ่มวิชาเอกเลือกตามเส้นทางอาชีพ (Tracks): 18–24 หน่วยกิต\n• กลุ่มวิชาการเรียนรู้เชิงบูรณาการกับการทำงาน (CWIE / Co-op): 6–7 หน่วยกิต\n\n3️ หมวดวิชาเลือกเสรี (Free Electives) ไม่น้อยกว่า 6 หน่วยกิต'
            },
            { id: Date.now() + 3, sender: 'bot', isEduCarousel: true }
          ]);
        }

        // 0.1 จุดเน้นการปรับปรุงรายวิชาในหลักสูตร 70 (Core Update)
        else if (
          cleanText.includes('จุดเน้น') ||
          cleanText.includes('core update') ||
          cleanText.includes('เอกบังคับ') ||
          cleanText.includes('modern programming') ||
          cleanText.includes('devops') ||
          cleanText.includes('cloud-native') ||
          cleanText.includes('ai ethics') ||
          cleanText.includes('pdpa') ||
          cleanText.includes('[จุดเน้นปรับปรุงหลักสูตร 70]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'จุดเน้นการปรับปรุงรายวิชาในหลักสูตร 70 (Core Update):\n\n1. ปรับกระบวนวิชาเขียนโปรแกรมให้เข้ากับภาษาสมัยใหม่ (Modern Programming: Python, TypeScript, Go/Rust)\n2. เพิ่มน้ำหนักด้าน DevOps & Cloud-Native Development (CI/CD, Containerization, Microservices) เข้าเป็นพื้นฐาน\n3. สถาปัตยกรรมระบบและเครือข่ายเน้น Hybrid Cloud & Edge Computing\n4. เพิ่มจริยธรรมด้านปัญญาประดิษฐ์และความมั่นคงปลอดภัยข้อมูลส่วนบุคคล (AI Ethics & PDPA / Data Governance)'
            }
          ]);
        }

        // 0.2 แผนการเลือกกลุ่มวิชาชีพเฉพาะทาง (4 Career Tracks)
        else if (
          cleanText.includes('track') ||
          cleanText.includes('แทร็ก') ||
          cleanText.includes('แทรค') ||
          cleanText.includes('เส้นทางอาชีพ') ||
          cleanText.includes('เอกเลือก') ||
          cleanText.includes('เฉพาะทาง') ||
          cleanText.includes('สายอาชีพ') ||
          cleanText.includes('applied data') ||
          cleanText.includes('full-stack') ||
          cleanText.includes('cybersecurity') ||
          cleanText.includes('agro-informatics') ||
          cleanText.includes('[วิชาเอกเลือก 4 แทร็ก]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'แผนการเลือกกลุ่มวิชาชีพเฉพาะทาง (Elective Career Tracks - 18–24 หน่วยกิต):\nนักศึกษาสามารถเลือกมุ่งเน้นตามความถนัดได้ 3–4 เส้นทางหลัก:\n\nTrack 1: AI & Applied Data Intelligence\n• Machine Learning & Deep Learning Implementation\n• Generative AI & Large Language Models Application\n• Data Engineering & Big Data Infrastructure\n• Computer Vision & Natural Language Processing\n\nTrack 2: Full-Stack Software & Cloud Architecture\n• Advanced Web & Mobile Frameworks\n• Cloud Computing & Serverless Architectures\n• API Design & Enterprise Software Engineering\n• UI/UX Engineering & Front-End Performance\n\nTrack 3: Cybersecurity & Defensive Operations\n• Practical Network Security & Cryptography\n• Secure Coding & Vulnerability Assessment\n• Cloud Security & Incident Response\n\nTrack 4: Smart Technology & Agro-Informatics (อัตลักษณ์แม่โจ้)\n• Internet of Things (IoT) & Embedded Systems for Smart Agriculture\n• Spatial Data & Remote Sensing Informatics'
            }
          ]);
        }

        // 0.3 CWIE / Co-op / สหกิจศึกษา
        else if (
          cleanText.includes('cwie') ||
          cleanText.includes('สหกิจ') ||
          cleanText.includes('co-op') ||
          cleanText.includes('capstone') ||
          cleanText.includes('ฝึกงาน') ||
          cleanText.includes('บูรณาการ') ||
          cleanText.includes('[สหกิจศึกษา cwie]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'แผนการเรียนรู้ผ่านการทำงานจริง (CWIE: Cooperative and Work-Integrated Education) 6–7 หน่วยกิต:\n\nนักศึกษาสามารถเลือกรูปแบบการเรียนรู้ได้ 2 รูปแบบ:\n1. รูปแบบเลือกทำ สหกิจศึกษา (Co-op) เต็มเวลา 1 ภาคการศึกษา ในสถานประกอบการหรือองค์กรพันธมิตร\n2. หรือรูปแบบ โครงงานวิจัยอุตสาหกรรม (Industrial Capstone Project) พัฒนานวัตกรรมหรือแก้โจทย์จริงร่วมกับภาคอุตสาหกรรม'
            }
          ]);
        }

        // 1. ค่าเทอม / ค่าธรรมเนียม / วท.คอมฯ / วิทยาศาสตร์
        else if (
          cleanText.includes('ค่าเทอม') || 
          cleanText.includes('ค่าธรรมเนียม') || 
          cleanText.includes('คอมพิวเตอร์') || 
          cleanText.includes('วิทยาการคอม') || 
          cleanText.includes('วิทยาศาสตร์') || 
          cleanText.includes('ค่าเรียน') ||
          cleanText.includes('จ่ายเงิน') ||
          cleanText.includes('การเงิน') ||
          cleanText.includes('[ค่าเทอม วิทยาการคอมพิวเตอร์]') ||
          cleanText.includes('[ค่าเทอม/การเงิน]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'bot', isMascot: true },
            { 
              id: Date.now() + 2, 
              sender: 'bot', 
              text: 'ข้อมูลอัตราค่าธรรมเนียมการศึกษา (ค่าเทอม):\n\n• **คณะวิทยาศาสตร์** มหาวิทยาลัยแม่โจ้\n• **สาขาวิชาวิทยาการคอมพิวเตอร์**\n• **ค่าเทอม: 20,000 บาท** / ภาคการศึกษา\n\nช่องทางการชำระเงิน:\n• สแกน QR Code / PromptPay ผ่านระบบ Mobile Banking ได้ทุกธนาคาร\n• พิมพ์ใบแจ้งยอด Pay-in นำไปชำระที่เคาน์เตอร์ธนาคารกรุงไทย หรือเคาน์เตอร์เซอร์วิส\n• หากมีความจำเป็น สามารถยื่นคำร้อง "ขอผ่อนผันค่าเทอม" ได้ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
            },
            { id: Date.now() + 3, sender: 'bot', isEduCarousel: true }
          ]);
        }

        // 2. ทุนการศึกษา / ทุนปันน้ำใจพี่ให้น้อง / ทุนต่อเนื่อง / ทุนไม่ต่อเนื่อง
        else if (
          cleanText.includes('ทุนการศึกษา') || 
          cleanText.includes('ทุน') || 
          cleanText.includes('ปันน้ำใจ') || 
          cleanText.includes('พี่ให้น้อง') || 
          cleanText.includes('ต่อเนื่อง') ||
          cleanText.includes('ไม่ต่อเนื่อง') ||
          cleanText.includes('[ทุนปันน้ำใจพี่ให้น้อง]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ข้อมูลภาพรวมทุนการศึกษา มหาวิทยาลัยแม่โจ้ & ทุน “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5\n\nมหาวิทยาลัยแม่โจ้มีทุนการศึกษาจัดสรรให้นักศึกษาหลากหลายประเภท ทั้งทุนการศึกษาจากกองทุนมหาวิทยาลัย ทุนจากหน่วยงานภายนอก/ศิษย์เก่า และทุนกู้ยืมเพื่อการศึกษา (กยศ./กรอ.)\n\nสำหรับทุน “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5 แบ่งเป็น:\n1. **ทุนการศึกษาต่อเนื่อง**: รวม 20 ทุน (ต่อเนื่องจากปี 2568 จำนวน 9 ทุน และรายใหม่ปี 2569 จำนวน 11 ทุน)\n2. **ทุนการศึกษาไม่ต่อเนื่อง (ให้ 1 ปีการศึกษา)**: รวม 5 ทุน (ม.แม่โจ้-เชียงใหม่ 3 ทุน, ม.แม่โจ้-แพร่ 1 ทุน, ม.แม่โจ้-ชุมพร 1 ทุน)\n\nคุณสามารถคลิกปุ่มลิงก์ด้านล่าง เพื่อเปิดหน้าเว็บไซต์ทุนการศึกษาของมหาวิทยาลัยและดูรายละเอียดระเบียบการทั้งหมดได้ทันทีครับ:',
              actionLink: {
                title: 'ดูข้อมูลทุนทั้งหมด',
                url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
              }
            }
          ]);
        }

        // 3. คุณสมบัติของผู้สมัครขอรับทุน
        else if (
          cleanText.includes('คุณสมบัติ') || 
          cleanText.includes('gpax') || 
          cleanText.includes('เกรด') || 
          cleanText.includes('ธกส') || 
          cleanText.includes('ธ.ก.ส.') || 
          cleanText.includes('ผู้กู้') || 
          cleanText.includes('ลูกค้า') ||
          cleanText.includes('[คุณสมบัติผู้ขอทุน]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'คุณสมบัติของผู้สมัครขอรับทุนการศึกษา (ต้องมีครบทั้ง 6 ข้อ):\n\n1. เป็นนักศึกษาระดับปริญญาตรีทุกชั้นปี ที่ลงทะเบียนเรียนภาคเรียนที่ 1 ในปีการศึกษา 2569\n2. เป็นนักศึกษาขาดแคลนทุนทรัพย์ในการศึกษา เป็นนักศึกษาที่มีความประพฤติเรียบร้อย และไม่เคยถูกลงโทษทางวินัยนักศึกษา\n3. ไม่เป็นนักศึกษาที่เป็นข้าราชการ พนักงานของรัฐ หรือพนักงานรัฐวิสาหกิจ\n4. นักศึกษาจะต้องไม่ได้รับทุนการศึกษาจากแหล่งทุนอื่น ๆ\n5. มีผลคะแนนเฉลี่ยสะสม (GPAX) รวมทุกรายวิชาเกรดเฉลี่ย 2.00 ขึ้นไป (สำหรับนักศึกษาชั้นปีที่ 1 ให้ใช้ผลการเรียนจากสถาบันการศึกษาเดิม)\n6. เป็นบุตรหรืออยู่ในความอุปการะของลูกค้า (ผู้กู้) ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.) ทั่วประเทศ\n\n⚠️ **หมายเหตุ**: นักศึกษาต้องมีคุณสมบัติของผู้สมัครขอรับทุนการศึกษา ตามข้อ 1 - 6 ทุกข้อจึงมีสิทธิ์สมัครขอรับทุนการศึกษาดังกล่าวได้ครับ',
              actionLink: {
                title: 'ดูข้อมูลทุนทั้งหมด',
                url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
              }
            }
          ]);
        }

        // 4. วิธีการสมัคร & หลักฐานแนบใบสมัคร
        else if (
          cleanText.includes('วิธีสมัคร') || 
          cleanText.includes('วิธีการสมัคร') || 
          cleanText.includes('หลักฐาน') || 
          cleanText.includes('เอกสาร') || 
          cleanText.includes('สมัครยังไง') || 
          cleanText.includes('อำนวย ยศสุข') || 
          cleanText.includes('ส่งที่ไหน') || 
          cleanText.includes('วันสมัคร') || 
          cleanText.includes('สิงหาคม') ||
          cleanText.includes('transcript') ||
          cleanText.includes('รูปถ่าย') ||
          cleanText.includes('[วิธีสมัคร & หลักฐาน]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'วิธีการสมัครขอรับทุนการศึกษา:\n\n1. ให้นักศึกษารับแบบฟอร์มใบสมัครทุนการศึกษา “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5 ที่หน่วยทุนการศึกษา ชั้น 2 อาคารอำนวย ยศสุข ตั้งแต่วันที่ 3 - 21 สิงหาคม 2569 พร้อมส่งใบสมัครทุนการศึกษา และหลักฐานการสมัครที่หน่วยทุนการศึกษา งานบริการนักศึกษา จำนวน 1 ชุด\n2. ให้นักศึกษากรอกใบสมัครทุนการศึกษาให้สมบูรณ์ และเป็นไปตามความเป็นจริง (ถ้าหากคณะกรรมการพิจารณาทุนการศึกษาตรวจพบว่าข้อมูลไม่เป็นความจริงจะถูกตัดสิทธิ์ขอรับทุนดังกล่าว)\n\n📎 หลักฐานแนบใบสมัครขอรับทุนการศึกษา (จำนวน 1 ชุด):\n1. รูปถ่าย 1 นิ้ว หรือ 2 นิ้ว (สามารถใช้ภาพสแกนได้)\n2. สำเนาบัตรประจำตัวประชาชนของนักศึกษา บิดา มารดา หรือผู้อุปการะ\n3. ใบแสดงผลการเรียน (Transcript):\n   • นักศึกษาชั้นปีที่ 2 - 4 ใช้ของมหาวิทยาลัยแม่โจ้\n   • นักศึกษาชั้นปีที่ 1 ใช้ของสถาบันการศึกษาเดิม\n4. เอกสารสำเนาแสดงการเป็นบุตร หรืออยู่ในความอุปการะของลูกค้า (ผู้กู้) ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร ทั่วประเทศ เช่น สำเนาบัตรสมาชิก ธ.ก.ส. / สำเนาบัญชีธนาคาร ธ.ก.ส.',
              actionLink: {
                title: 'ดูข้อมูลทุนทั้งหมด',
                url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
              }
            }
          ]);
        }

        // 5. ปฏิทินการศึกษา
        else if (
          cleanText.includes('ปฏิทิน') || 
          cleanText.includes('ปฏิทินการศึกษา') || 
          cleanText.includes('ตารางเรียน') || 
          cleanText.includes('เปิดเทอม') || 
          cleanText.includes('วันสอบ') || 
          cleanText.includes('mju') ||
          cleanText.includes('[ปฏิทินการศึกษา mju]') ||
          cleanText.includes('[ปฏิทินการศึกษา]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ปฏิทินการศึกษา มหาวิทยาลัยแม่โจ้:\n\nรวมกำหนดการลงทะเบียนเรียน, วันเปิด-ปิดภาคเรียน, วันสอบกลางภาค และวันสอบปลายภาค คุณสามารถเปิดดูหรือดาวน์โหลดเอกสาร PDF ทางการได้ที่ปุ่มด้านล่างนี้ครับ:',
              downloadLink: {
                title: 'ดาวน์โหลดปฏิทินการศึกษา มหาวิทยาลัยแม่โจ้ (PDF)',
                url: 'https://edu.mju.ac.th/fileDownload/891.pdf?v=21:22:41'
              }
            }
          ]);
        }

        // 6. ผ่อนผันค่าเทอม (เฉพาะกรณีระบุค่าเทอม หรือไม่เกี่ยวกับทหาร)
        else if (
          (cleanText.includes('ผ่อนผันค่าเทอม') || cleanText.includes('ผ่อนผันค่าเรียน') || (cleanText.includes('ผ่อนผัน') && !cleanText.includes('ทหาร') && !cleanText.includes('เกณฑ์') && !cleanText.includes('รูป') && !cleanText.includes('ภาพ'))) || 
          cleanText.includes('ค้างจ่าย') || 
          cleanText.includes('ขั้นตอนผ่อนผันค่าเทอม') ||
          cleanText.includes('[ผ่อนผันการชำระ]')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            { 
              id: Date.now() + 1, 
              sender: 'bot', 
              text: 'ขั้นตอนการยื่นคำร้องขอผ่อนผันค่าเทอม:\n\n1. ดาวน์โหลดหรือรับแบบฟอร์ม "คำร้องขอผ่อนผันค่าธรรมเนียมการศึกษา"\n2. กรอกข้อมูลให้ครบถ้วนพร้อมเซ็นชื่อรับรองโดยผู้ปกครอง\n3. ยื่นส่งคำร้องผ่านเว็บไซต์ทะเบียนหรือนำส่งฝ่ายกิจการนักศึกษา ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
            }
          ]);
        }

        // 6.0 คำถามเกี่ยวกับ "รูปภาพ" โดยตรง หรือต้องการดูรูปทั้งหมด
        else if (
          (cleanText.includes('รูป') || cleanText.includes('ภาพ') || cleanText.includes('photo') || cleanText.includes('image')) &&
          !cleanText.includes('ทหาร') && !cleanText.includes('ประกัน')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'นี่คือรูปภาพประกาศและข้อมูลสำคัญของมหาวิทยาลัยแม่โจ้ครับ:\n\n1.**ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569** (ยื่น 21 ก.ย. - 18 ธ.ค. 69)\n2.**ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้** (บมจ.เออร์โกประกันภัย คุ้มครอง 22,000 บ./ครั้ง)',
              images: [
                {
                  url: militaryDefermentImg,
                  alt: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้',
                  caption: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 (21 ก.ย. - 18 ธ.ค. 2569)'
                },
                {
                  url: accidentInsuranceImg,
                  alt: 'ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569',
                  caption: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (บมจ.เออร์โกประกันภัย)'
                }
              ],
              actionLink: {
                title: 'เข้าสู่ระบบยื่นคำร้องผ่อนผันทหาร (ERP MJU)',
                url: 'https://erp.mju.ac.th'
              }
            }
          ]);
        }

        // 6.1 การขอผ่อนผันทหาร ประจำปีการศึกษา 2569
        else if (
          cleanText.includes('ผ่อนผันทหาร') || 
          cleanText.includes('เกณฑ์ทหาร') || 
          cleanText.includes('ทหาร') || 
          cleanText.includes('สด.9') || 
          cleanText.includes('สด9') || 
          cleanText.includes('สด.35') || 
          cleanText.includes('สด35') || 
          cleanText.includes('รด.') || 
          cleanText.includes('รด') ||
          cleanText.includes('รูปทหาร') ||
          cleanText.includes('รูปผ่อนผัน') ||
          cleanText.includes('[ผ่อนผันทหาร]') ||
          cleanText.includes('[การขอผ่อนผันทหาร]') ||
          cleanText.includes('[การขอผ่อนผันทหาร]') ||
          cleanText.includes('การขอผ่อนผันทหาร')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้:\n\n• **กลุ่มเป้าหมาย**: นักศึกษาชายทุกคนที่เกิดใน **ปี พ.ศ. 2549** ที่เข้ามาศึกษาใน ม.แม่โจ้ และนักศึกษาหลักสูตร 4 ปี เทียบเข้าเรียน (2 ปีต่อเนื่อง) ที่เคยผ่อนผันทหารจากสถาบันเดิมแล้ว เมื่อย้ายสถานศึกษาและรายงานตัวเป็นนักศึกษาใหม่ จะต้องยื่นเรื่องขอผ่อนผันใหม่ทุกคน (ยกเว้นผู้ที่เรียน รด. จบชั้นปีที่ 3)\n\n**เอกสารที่ต้องเตรียม (อย่างละ 1 ฉบับ)**:\n1. สำเนา สด.9\n2. สำเนา สด.35\n3. สำเนาทะเบียนบ้าน (ภูมิลำเนาเดิม)\n4. สำเนาบัตรประจำตัวประชาชน\n5. สำเนาใบแจ้งเปลี่ยนชื่อ (ถ้ามี)\n*หมายเหตุ: สำเนาทุกฉบับต้องลงลายมือชื่อรับรองสำเนาถูกต้องด้วยปากกาน้ำเงินเท่านั้น ห้ามขีดฆ่าหรือแก้ไขข้อความเด็ดขาด*\n\n**กำหนดการเปิดรับยื่นเอกสาร**: วันที่ 21 กันยายน - 18 ธันวาคม 2569\n\n**ขั้นตอนการยื่นคำร้อง**:\n1. ยื่นคำร้องผ่านระบบออนไลน์ที่: https://erp.mju.ac.th\n2. ศึกษาวิธีการใช้งานได้ที่คู่มือ: https://maejo.link/CcY3pl\n3. เมื่อกรอกคำร้องออนไลน์แล้ว ให้นำเอกสารสำเนาส่งที่ ห้องงานบริการนักศึกษา ชั้น 2 อาคารอำนวย ยศสุข ในวันและเวลาราชการ\n*(นักศึกษาที่เคยยื่นผ่อนผันไปในปีก่อนหน้านี้ ไม่ต้องยื่นใหม่ สามารถใช้เอกสารเดิมได้จนจบการศึกษา)*',
              image: {
                url: militaryDefermentImg,
                alt: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้',
                caption: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 (21 ก.ย. - 18 ธ.ค. 2569)'
              },
              actionLink: {
                title: 'เข้าสู่ระบบยื่นคำร้องผ่อนผันทหาร (ERP MJU)',
                url: 'https://erp.mju.ac.th'
              }
            }
          ]);
        }

        // 6.2 ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้
        else if (
          cleanText.includes('ประกัน') || 
          cleanText.includes('ประกันอุบัติเหตุ') || 
          cleanText.includes('อุบัติเหตุ') || 
          cleanText.includes('ค่ารักษา') || 
          cleanText.includes('เคลม') || 
          cleanText.includes('เออร์โก') || 
          cleanText.includes('ergo') ||
          cleanText.includes('รูปประกัน') ||
          cleanText.includes('[ประกันอุบัติเหตุ]') ||
          cleanText.includes('[ประกันอุบัติเหตุกลุ่ม]') ||
          cleanText.includes('ประกันอุบัติเหตุกลุ่ม')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569:\n\nมหาวิทยาลัยแม่โจ้จัดทำประกันอุบัติเหตุกลุ่มให้กับนักศึกษาและบุคลากร ร่วมกับ บริษัท เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)\nระยะเวลาคุ้มครอง: 1 มิถุนายน 2569 – 31 พฤษภาคม 2570\n\n**วงเงินความคุ้มครอง**:\n• ค่ารักษาพยาบาลต่ออุบัติเหตุแต่ละครั้ง ตามจ่ายจริงไม่เกิน **22,000 บาท**\n• กรณีเสียชีวิต ทุพพลภาพถาวร หรือสูญเสียอวัยวะเนื่องจากอุบัติเหตุ **180,000 บาท**\n\n**โรงพยาบาลคู่สัญญาใน จ.เชียงใหม่ (ไม่ต้องสำรองจ่าย)**:\n1. โรงพยาบาลเชียงใหม่ราม 1\n2. โรงพยาบาลเชียงใหม่ใกล้หมอ\n3. โรงพยาบาลเทพปัญญา 1\n4. โรงพยาบาลแมคคอร์มิค\n5. โรงพยาบาลราชเวชเชียงใหม่\n6. โรงพยาบาลลานนา\n*(เพียงยื่นบัตรประชาชน แจ้งทำประกันกับ บมจ.เออร์โกประกันภัย กรมธรรม์เลขที่: 260401/P001000250)*\n\n**กรณีเข้ารับการรักษาโรงพยาบาลนอกเครือข่าย**:\nให้สำรองจ่ายเงินไปก่อน แล้วนำหลักฐานมายื่นเบิกได้ที่ **งานอนามัย กองพัฒนานักศึกษา อาคารอำนวย ยศสุข** ในวันและเวลาราชการ\nเอกสารที่ใช้: 1. ใบเสร็จฉบับจริง, 2. ใบรับรองแพทย์ฉบับจริง, 3. สำเนาบัตรประชาชน, 4. สำเนาหน้าสมุดบัญชีธนาคาร (ยกเว้น ออมสิน, ธ.ก.ส., ธอส.)\n\nสอบถามเพิ่มเติมได้ที่ งานอนามัย กองพัฒนานักศึกษา โทร. 0 5387 3075',
              image: {
                url: accidentInsuranceImg,
                alt: 'ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569',
                caption: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (เออร์โกประกันภัย)'
              }
            }
          ]);
        }

        // 7. ช่องทางติดต่อ
        else if (
          cleanText.includes('ติดต่อ') || 
          cleanText.includes('เบอร์โทร') || 
          cleanText.includes('สถานที่') || 
          cleanText.includes('ติดต่อฝ่ายทะเบียน') || 
          cleanText.includes('ติดต่อฝ่ายการเงิน')
        ) {
          setAcademicMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ช่องทางการติดต่อหน่วยงาน มหาวิทยาลัยแม่โจ้:\n\n• **หน่วยทุนการศึกษา งานบริการนักศึกษา**: ชั้น 2 อาคารอำนวย ยศสุข\n• **สำนักบริหารและพัฒนาวิชาการ (งานทะเบียน)**: โทร. 053-873450-4\n• **สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้**\n\nเปิดทำการวันจันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)'
            }
          ]);
        }

        // 8. Thread search
        else if (cleanText.includes('mongodb') || cleanText.includes('java') || cleanText.includes('react') || cleanText.includes('nestjs') || cleanText.includes('error') || cleanText.includes('กระทู้')) {
          try {
            let queryKeyword = '';
            if (cleanText.includes('mongodb')) queryKeyword = 'mongodb';
            else if (cleanText.includes('java')) queryKeyword = 'java';
            else if (cleanText.includes('react')) queryKeyword = 'react';
            else if (cleanText.includes('nestjs')) queryKeyword = 'nestjs';
            else if (cleanText.includes('error')) queryKeyword = 'error';

            const response = await axios.get(`${API_URL}/api/questions?q=${queryKeyword}`);
            const threads = response.data;

            if (threads.length > 0) {
              const listText = threads.map((t, idx) => `${idx + 1}. **${t.title}** (โดย ${t.author.name})`).join('\n');
              setAcademicMessages(prev => [
                ...prev,
                { 
                  id: Date.now() + 1, 
                  sender: 'bot', 
                  text: `ผมพบกระทู้เกี่ยวกับการเรียนในเรื่อง "${queryKeyword}" บนเว็บบอร์ด CS Helpdesk ด้วยครับ:\n\n${listText}\n\nคลิกลิงก์ด้านล่างเพื่อเข้าไปศึกษาเพิ่มเติมได้เลยครับ:`,
                  searchResults: threads
                }
              ]);
            } else {
              setAcademicMessages(prev => [
                ...prev,
                { id: Date.now() + 1, sender: 'bot', text: `ผมลองค้นหาหัวข้อการเรียนเรื่อง "${queryKeyword}" บนเว็บบอร์ดช่วยเหลือแล้ว แต่ยังไม่พบกระทู้ที่ตรงกันเลยครับ` }
              ]);
            }
          } catch (err) {
            console.error(err);
          }
        }
        else {
          setAcademicMessages(prev => [
            ...prev,
            { 
              id: Date.now() + 1, 
              sender: 'bot', 
              text: 'ขออภัยครับ บอทวิชาการยังไม่เข้าใจคำถามนี้\nคุณสามารถสอบถามเกี่ยวกับ:\n• "[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]" (โครงสร้าง 120–124 หน่วยกิต & 4 แทร็กอาชีพ)\n• "[ค่าเทอม วิทยาการคอมพิวเตอร์]" (คณะวิทยาศาสตร์ 20,000 บาท)\n• "[ทุนปันน้ำใจพี่ให้น้อง]" (ทุนต่อเนื่อง/ไม่ต่อเนื่อง)\n• "[ปฏิทินการศึกษา MJU]" (ดาวน์โหลดปฏิทิน มหาวิทยาลัยแม่โจ้)\n• "ผ่อนผันทหาร" (ประกาศการผ่อนผันเกณฑ์ทหาร ปี 2569 พร้อมรูปภาพ)\n• "ประกันอุบัติเหตุ" (ความคุ้มครอง & รายชื่อโรงพยาบาลคู่สัญญา พร้อมรูปภาพ)\nหรือเลือกคลิกจากปุ่มตัวเลือก 4 ปุ่มด้านล่างได้เลยครับ!' 
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsBotReplying(false);
      }
    }, 800);
  };

  const handleCurriculumOption = () => {
    handleSendChatMessage('[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]');
  };

  const handleCsTuitionOption = () => {
    handleSendChatMessage('[ค่าเทอม วิทยาการคอมพิวเตอร์]');
  };

  const handleScholarshipOption = () => {
    handleSendChatMessage('[ทุนปันน้ำใจพี่ให้น้อง]');
  };

  const handleCalendarOption = () => {
    handleSendChatMessage('[ปฏิทินการศึกษา MJU]');
  };

  // การ์ดข้อมูลแนะนำที่เลื่อนดูได้ในแชท
  const eduCards = [
    { key: 'curriculum', tone: 'violet', icon: <CurriculumIcon />, title: 'หลักสูตรใหม่ (รหัส 70)', subtitle: 'AI & Cloud Native (OBE)', highlight: '120–124 หน่วยกิต', cta: 'ดูโครงสร้างหลักสูตร', onClick: handleCurriculumOption },
    { key: 'cs', tone: 'blue', icon: <ComputerIcon />, title: 'วท.บ. วิทยาการคอมพิวเตอร์', subtitle: 'คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้', highlight: '20,000 บ./ภาคเรียน', cta: 'ดูข้อมูลค่าเทอม', onClick: handleCsTuitionOption },
    { key: 'scholarship', tone: 'amber', icon: <ScholarshipIcon />, title: 'ทุน “ปันน้ำใจพี่ให้น้อง” #5', subtitle: 'ทุนต่อเนื่อง & ไม่ต่อเนื่อง', highlight: 'รวม 25 ทุนการศึกษา', cta: 'ดูข้อมูลทุนทั้งหมด', onClick: handleScholarshipOption },
    { key: 'calendar', tone: 'emerald', icon: <CalendarIcon />, title: 'ปฏิทินการศึกษา MJU', subtitle: 'กำหนดการลงทะเบียน & สอบ', highlight: 'ไฟล์ PDF ทางการ', cta: 'เปิดดูปฏิทิน', softButton: true, onClick: handleCalendarOption },
    { key: 'military', tone: 'emerald', image: militaryDefermentImg, badge: 'รูปประกาศทางการ', previewTitle: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้', alt: 'ประกาศการขอผ่อนผันทหาร มหาวิทยาลัยแม่โจ้', title: 'การขอผ่อนผันทหาร 2569', subtitle: 'นศ. ชาย เกิด พ.ศ. 2549', highlight: '21 ก.ย. - 18 ธ.ค. 69', cta: 'ดูรูปประกาศ & ข้อมูล', onClick: () => handleSendChatMessage('[การขอผ่อนผันทหาร]') },
    { key: 'insurance', tone: 'rose', image: accidentInsuranceImg, badge: 'รูปตารางคุ้มครอง', previewTitle: 'ประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (เออร์โกประกันภัย)', alt: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้', title: 'ประกันอุบัติเหตุกลุ่ม MJU', subtitle: 'บมจ.เออร์โกประกันภัย', highlight: 'รักษาพยาบาล 22,000 บ.', cta: 'ดูรูปตาราง & สิทธิคุ้มครอง', onClick: () => handleSendChatMessage('[ประกันอุบัติเหตุ]') },
  ];

  const forumNav = [
    { tab: 'all', label: 'กระทู้ทั้งหมด', icon: MessageSquare },
    { tab: 'mine', label: 'กระทู้ของฉัน', icon: User },
    { tab: 'unanswered', label: 'กระทู้รอคนตอบ', icon: CircleDashed },
  ];

  const openForumTab = (tab) => {
    setViewMode('forum');
    setForumTab(tab);
    setSelectedTag(null);
  };

  const isForumTabActive = (tab) =>
    viewMode === 'forum' && forumTab === tab && (tab !== 'all' || !selectedTag);

  const forumTitle = selectedTag
    ? `หมวดหมู่สำหรับ #${selectedTag}`
    : forumTab === 'mine'
      ? 'กระทู้ของฉัน'
      : forumTab === 'unanswered'
        ? 'กระทู้รอความช่วยเหลือ'
        : 'กระทู้ล่าสุดทั้งหมด';

  const navItemClass = (active) =>
    `w-full text-left px-2.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-3 cursor-pointer ${
      active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    }`;

  const navIconClass = (active) =>
    `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
      active ? 'bg-white text-brand-600 shadow-sm' : 'bg-slate-100 text-slate-500'
    }`;

  const searchField = (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="ค้นหากระทู้, คำถาม หรือแท็ก..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-100/70 text-sm placeholder:text-slate-400 transition focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* 1. Top Navigation Bar */}
      <header className="glass sticky top-0 z-30 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setViewMode('chatbot')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition">
              <GraduationCap size={20} strokeWidth={2.25} />
            </div>
            <div className="text-left leading-tight">
              <div className="font-extrabold text-slate-900 tracking-tight text-[15px]">CS Helpdesk</div>
              <div className="text-[11px] font-medium text-slate-500 hidden sm:block">Assistant · มหาวิทยาลัยแม่โจ้</div>
            </div>
          </button>

          {/* Forum Search Bar (Hidden in Chatbot mode) */}
          <div className={`flex-1 max-w-xl mx-auto hidden md:block transition-all duration-300 ${viewMode === 'forum' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
            {searchField}
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto md:ml-0">
            <button
              type="button"
              onClick={() => navigate('/create')}
              className="btn-primary"
              title="ตั้งคำถาม"
            >
              <SquarePen size={16} />
              <span className="hidden sm:inline">ตั้งคำถาม</span>
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 lg:pr-3 hover:bg-slate-100 transition cursor-pointer"
                title="บัญชีของฉัน"
              >
                <Avatar name={currentUser.name} size="sm" className="ring-2 ring-white shadow" />
                <div className="hidden lg:block text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-800">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา'}</div>
                </div>
                <ChevronDown size={14} className={`hidden lg:block text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 card p-4 z-40 animate-slide-in">
                  <div className="flex items-center gap-3">
                    <Avatar name={currentUser.name} size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-xs text-slate-500">{currentUser.role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile view switcher */}
      <div className="md:hidden max-w-7xl mx-auto w-full px-4 pt-4">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/60 rounded-xl">
          {[
            { mode: 'chatbot', label: 'ผู้ช่วย AI', icon: Sparkles, onClick: () => setViewMode('chatbot') },
            { mode: 'forum', label: 'กระทู้', icon: MessagesSquare, onClick: () => openForumTab('all') },
            { mode: 'faculty', label: 'อาจารย์', icon: Users, onClick: () => setViewMode('faculty') },
          ].map(({ mode, label, icon: Icon, onClick }) => (
            <button
              type="button"
              key={mode}
              onClick={onClick}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                viewMode === mode ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex gap-6 w-full flex-1 min-h-0">

        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col gap-4">

          {/* Chatbot Navigation */}
          <div className="card p-2">
            <h3 className="font-semibold text-slate-400 px-2.5 pt-1.5 pb-2 text-[11px] uppercase tracking-wider">บอทช่วยเหลือจำลอง</h3>
            <button
              type="button"
              onClick={() => setViewMode('chatbot')}
              className={navItemClass(viewMode === 'chatbot')}
            >
              <span className={navIconClass(viewMode === 'chatbot')}><Sparkles size={16} /></span>
              ข้อมูลหลักสูตร & ทุนการศึกษา
            </button>
          </div>

          {/* Faculty Navigation */}
          <div className="card p-2">
            <h3 className="font-semibold text-slate-400 px-2.5 pt-1.5 pb-2 text-[11px] uppercase tracking-wider">คณาจารย์</h3>
            <button
              type="button"
              onClick={() => setViewMode('faculty')}
              className={navItemClass(viewMode === 'faculty')}
            >
              <span className={navIconClass(viewMode === 'faculty')}><Users size={16} /></span>
              ทำเนียบอาจารย์ & ความถนัด
            </button>
          </div>

          {/* Forum Navigation */}
          <div className="card p-2">
            <h3 className="font-semibold text-slate-400 px-2.5 pt-1.5 pb-2 text-[11px] uppercase tracking-wider">กระทู้ถามตอบเว็บบอร์ด</h3>
            <nav className="space-y-0.5">
              {forumNav.map(({ tab, label, icon: Icon }) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => openForumTab(tab)}
                  className={navItemClass(isForumTabActive(tab))}
                >
                  <span className={navIconClass(isForumTabActive(tab))}><Icon size={16} /></span>
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Hot Tags List */}
          <div className="card p-4">
            <h3 className="font-semibold text-slate-400 mb-3 text-[11px] uppercase tracking-wider">Tags ยอดฮิต</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Curriculum', 'Java', 'Database', 'Error', 'NestJS', 'React'].map(tag => {
                const active = selectedTag === tag && viewMode === 'forum';
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setViewMode('forum');
                      setForumTab('all');
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                      active
                        ? 'bg-brand-600 border-brand-600 text-white shadow-sm shadow-brand-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Utilities */}
          <button
            type="button"
            onClick={handleSeedData}
            className="btn-ghost text-xs text-slate-500"
          >
            <RefreshCw size={13} /> รีเซ็ตเป็นข้อมูลตัวอย่าง
          </button>
        </aside>

        {/* Central Display Area */}
        <section className="flex-1 min-w-0 card overflow-hidden flex flex-col h-[calc(100dvh-9.5rem)] md:h-[calc(100dvh-7rem)]">

          {/* VIEW MODE 1: ACADEMIC CHATBOT PANELS (Default) */}
          {viewMode === 'chatbot' && (
            <div className="flex-1 flex flex-col min-h-0">

              {/* Chat Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-gradient-to-r from-brand-50/80 via-white to-violet-50/60">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative">
                    <AcademicLogo />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 leading-tight tracking-tight truncate">
                      ข้อมูลหลักสูตร & ทุนการศึกษา
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>Academic AI</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-600 font-medium">ออนไลน์</span>
                    </div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-white border border-brand-100 rounded-full px-2.5 py-1 shadow-sm shrink-0">
                  <Sparkles size={12} /> AI Assistant
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-slate-50/40">
                {academicMessages.map((msg) => (
                  <div key={msg.id} className="animate-fade-up">

                    {/* Bot Messages */}
                    {msg.sender === 'bot' && (
                      <div className="flex gap-3 items-start max-w-[92%] sm:max-w-[85%]">
                        {!msg.isMascot && <BotAvatar />}

                        {/* Mascot Sticker */}
                        {msg.isMascot && <MascotAcademic />}

                        {/* Educational Carousel */}
                        {msg.isEduCarousel && (
                          <div className="flex-1 min-w-0 flex gap-3 overflow-x-auto scrollbar-hide snap-x py-1 pr-8 [mask-image:linear-gradient(to_right,black_85%,transparent)]">
                            {eduCards.map((card) => {
                              const tone = CARD_TONES[card.tone];
                              return (
                                <div
                                  key={card.key}
                                  className={`group snap-start shrink-0 w-48 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 ${tone.border}`}
                                >
                                  {card.image ? (
                                    <button
                                      type="button"
                                      className={`h-32 relative overflow-hidden cursor-pointer ${tone.soft}`}
                                      onClick={() => setPreviewModalImage({ url: card.image, title: card.previewTitle })}
                                      title="คลิกเพื่อดูรูปขนาดใหญ่"
                                    >
                                      <img
                                        src={card.image}
                                        alt={card.alt}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                        loading="eager"
                                      />
                                      <span className={`absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow ${tone.solid}`}>
                                        {card.badge}
                                      </span>
                                      <span className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                        <ZoomIn size={11} /> แตะดูรูป
                                      </span>
                                    </button>
                                  ) : (
                                    <div className={`h-32 ${tone.soft}`}>{card.icon}</div>
                                  )}
                                  <div className="p-3.5 flex-1 flex flex-col">
                                    <div className="text-[13px] font-bold text-slate-900 leading-snug">{card.title}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">{card.subtitle}</div>
                                    <div className={`text-xs font-bold mt-2 ${tone.text}`}>{card.highlight}</div>
                                    <div className="mt-auto pt-3.5">
                                      <button
                                        type="button"
                                        onClick={card.onClick}
                                        className={`w-full py-2 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                                          card.softButton ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : tone.button
                                        }`}
                                      >
                                        {card.cta}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Standard text bubble */}
                        {msg.text && (
                          <div className="min-w-0 bg-white border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-md px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap shadow-soft">
                            {renderRichText(msg.text)}

                            {/* Embedded Single Image (โชว์รูปภาพเลย) */}
                            {msg.image && <ImageAttachment image={msg.image} onPreview={setPreviewModalImage} />}

                            {/* Embedded Multiple Images (โชว์รูปภาพหลายรูป) */}
                            {msg.images && msg.images.map((imgItem, imgIdx) => (
                              <ImageAttachment key={imgIdx} image={imgItem} onPreview={setPreviewModalImage} />
                            ))}

                            {/* URL Action / Link Button */}
                            {msg.actionLink && (
                              <a
                                href={msg.actionLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-amber-500/20 group whitespace-normal"
                              >
                                <span className="flex items-center gap-2">
                                  <ExternalLink size={15} className="shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>{msg.actionLink.title}</span>
                                </span>
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium shrink-0">เปิดเว็บไซต์ ↗</span>
                              </a>
                            )}

                            {/* PDF Download Cards */}
                            {msg.downloadLink && (
                              <a
                                href={msg.downloadLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition group whitespace-normal"
                              >
                                <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                  <FileText size={18} />
                                </span>
                                <span className="flex-1 text-xs font-semibold text-slate-800">{msg.downloadLink.title}</span>
                                <ExternalLink size={14} className="text-slate-400 group-hover:text-red-500 shrink-0" />
                              </a>
                            )}

                            {/* Payment links */}
                            {msg.paymentLink && (
                              <a
                                href={msg.paymentLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl text-xs font-semibold text-white hover:brightness-110 transition shadow-md shadow-brand-600/20 whitespace-normal"
                              >
                                <span className="flex items-center gap-2"><ExternalLink size={14} /> {msg.paymentLink.title}</span>
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium shrink-0">คลิกชำระเงิน</span>
                              </a>
                            )}

                            {/* Database thread suggestion links */}
                            {msg.searchResults && (
                              <div className="mt-3 space-y-1 border-t border-slate-100 pt-2 whitespace-normal">
                                {msg.searchResults.map((t) => (
                                  <button
                                    type="button"
                                    key={t._id}
                                    onClick={() => navigate(`/question/${t._id}`)}
                                    className="flex items-center gap-2 w-full text-left text-xs font-semibold text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg px-2 py-1.5 transition cursor-pointer"
                                  >
                                    <MessageSquare size={13} className="shrink-0" />
                                    <span className="truncate">กระทู้: {t.title}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                    {/* User messages */}
                    {msg.sender === 'user' && (
                      <div className="flex justify-end">
                        <div
                          className={`rounded-2xl rounded-tr-md px-4 py-2.5 text-[13px] leading-relaxed font-medium text-white max-w-[80%] shadow-md ${
                            msg.text.startsWith('[')
                              ? 'bg-gradient-to-br from-accent-500 to-accent-600 shadow-accent-500/20'
                              : 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/20'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    )}

                  </div>
                ))}

                {/* Typing indicator */}
                {isBotReplying && (
                  <div className="flex gap-3 items-start animate-fade-up">
                    <BotAvatar />
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-4 py-3.5 shadow-soft flex gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="px-4 sm:px-6 pt-4 pb-4 bg-white border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 pl-2 pr-1.5 py-1.5 transition focus-within:bg-white focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10">
                  <div className="hidden sm:flex items-center text-slate-400">
                    {[Plus, Camera, ImageIcon].map((Icon, i) => (
                      <button key={i} type="button" className="p-2 rounded-xl hover:bg-slate-200/60 hover:text-slate-600 transition">
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(chatInputValue)}
                    placeholder="ถามเรื่องหลักสูตร ค่าเทอม ทุนการศึกษา ปฏิทินการศึกษา..."
                    className="flex-1 min-w-0 bg-transparent px-2 py-2 text-sm focus:outline-none placeholder:text-slate-400"
                  />

                  <button type="button" className="hidden sm:inline-flex p-2 rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition">
                    <Smile size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendChatMessage(chatInputValue)}
                    disabled={!chatInputValue.trim() || isBotReplying}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-brand-600 to-accent-600 shadow-md shadow-brand-600/25 hover:brightness-110 transition cursor-pointer disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    title="ส่งข้อความ"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 3: FACULTY DASHBOARD */}
          {viewMode === 'faculty' && <FacultyDashboard />}

          {/* VIEW MODE 2: Q&A FORUM BOARD */}
          {viewMode === 'forum' && (
            <div className="flex-1 flex flex-col min-h-0">

              {/* Forum Header Filter summary */}
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{forumTitle}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {forumLoading ? 'กำลังโหลด...' : `${questions.length} กระทู้`}
                    </p>
                  </div>
                  {selectedTag && (
                    <button
                      type="button"
                      onClick={() => setSelectedTag(null)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-full pl-2.5 pr-1.5 py-1 hover:bg-brand-100 transition cursor-pointer"
                      title="ล้างตัวกรองแท็ก"
                    >
                      #{selectedTag} <X size={13} />
                    </button>
                  )}
                </div>

                {/* Mobile: search + tabs */}
                <div className="md:hidden space-y-3">
                  {searchField}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {forumNav.map(({ tab, label, icon: Icon }) => (
                      <button
                        type="button"
                        key={tab}
                        onClick={() => openForumTab(tab)}
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                          isForumTabActive(tab)
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forum Thread Cards */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40">
                {forumError ? (
                  <div className="card p-10 text-center max-w-md mx-auto mt-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                      <RefreshCw size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900">โหลดกระทู้ไม่สำเร็จ</h3>
                    <p className="text-sm text-slate-500 mt-1.5">เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
                    <div className="pt-5 flex justify-center">
                      <button type="button" onClick={reloadForum} className="btn-primary text-xs">
                        <RefreshCw size={14} /> ลองใหม่
                      </button>
                    </div>
                  </div>
                ) : forumLoading ? (
                  <div className="space-y-3">
                    {forumSlow && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 border border-brand-100 text-brand-800 text-xs font-medium animate-fade-up">
                        <RefreshCw size={15} className="animate-spin shrink-0" />
                        <span>กำลังปลุกเซิร์ฟเวอร์ให้ตื่น (ครั้งแรกหลังไม่มีคนใช้งานอาจใช้เวลาประมาณ 30–60 วินาที) ครั้งต่อไปจะเร็วขึ้นครับ</span>
                      </div>
                    )}
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 flex gap-4 animate-pulse">
                        <div className="w-12 space-y-2">
                          <div className="h-11 bg-slate-100 rounded-xl" />
                          <div className="h-9 bg-slate-100 rounded-xl" />
                        </div>
                        <div className="flex-1 space-y-3 pt-1">
                          <div className="h-3 w-40 bg-slate-100 rounded-full" />
                          <div className="h-4 w-3/4 bg-slate-200/70 rounded-full" />
                          <div className="flex gap-2">
                            <div className="h-4 w-14 bg-slate-100 rounded-md" />
                            <div className="h-4 w-14 bg-slate-100 rounded-md" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-3">
                    {questions.map((q) => {
                      const hasUpvoted = q.upvoteUserIds?.includes(currentUser.name);
                      return (
                        <article
                          key={q._id}
                          onClick={() => navigate(`/question/${q._id}`)}
                          className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-lift hover:border-brand-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex gap-4 animate-fade-up"
                        >
                          {/* Votes and replies count */}
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleUpvote(e, q._id)}
                              className={`w-12 flex flex-col items-center py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                hasUpvoted
                                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-brand-200 hover:text-brand-600'
                              }`}
                              title="โหวตขึ้น"
                            >
                              <ArrowUp size={14} />
                              <span>{q.upvotes}</span>
                            </button>
                            <div className="w-12 flex flex-col items-center py-1 text-xs font-semibold text-slate-400">
                              <MessageSquare size={14} />
                              <span>{q.commentsCount}</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Avatar name={q.author.name} size="xs" />
                              <span className="font-semibold text-slate-700 truncate">{q.author.name}</span>
                              <span className="text-slate-300">•</span>
                              <span className="shrink-0">{formatRelativeTime(q.createdAt)}</span>

                              <span className="ml-auto shrink-0">
                                {q.status === 'resolved' ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                                    <CheckCircle2 size={12} /> แก้ไขแล้ว
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                    <CircleDashed size={12} /> รอคำตอบ
                                  </span>
                                )}
                              </span>
                            </div>

                            <h3 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition line-clamp-2">
                              {q.title}
                            </h3>

                            {q.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {q.tags.map(tag => (
                                  <span key={tag} className={tagClass(tag)}>#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="card p-10 text-center max-w-md mx-auto mt-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                      <Search size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900">ไม่พบกระทู้ที่กำลังมองหา</h3>
                    <p className="text-sm text-slate-500 mt-1.5">ขณะนี้ไม่มีกระทู้ใดตรงตามตัวกรอง ค้นหา หรือบทบาทที่กำหนดในฐานข้อมูล</p>
                    <div className="pt-5 flex justify-center gap-2">
                      <button type="button" onClick={handleSeedData} className="btn-primary text-xs">
                        โหลดข้อมูลตัวอย่าง
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForumTab('all');
                          setSelectedTag(null);
                          setSearchQuery('');
                        }}
                        className="btn-ghost text-xs"
                      >
                        ล้างตัวกรอง
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </section>

      </main>

      {/* Image Preview Lightbox Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800 truncate">{previewModalImage.title || 'ดูรูปภาพ'}</span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewModalImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
                >
                  เปิดแท็บใหม่ <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalImage(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                  title="ปิด (Esc)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-50 max-h-[calc(92vh-3.75rem)]">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.title || 'รูปภาพ'}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

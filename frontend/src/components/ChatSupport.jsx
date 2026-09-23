import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Plus, Image as ImageIcon, ArrowLeft, FileText, ExternalLink, PhoneCall, Bot, GraduationCap } from 'lucide-react';
import { getBotReplies, withIds, nextMessageId, DEFAULT_QUICK_REPLIES } from '../lib/academicBot';

import militaryDefermentImg from '../assets/images/military_deferment_mju.png';
import accidentInsuranceImg from '../assets/images/accident_insurance_mju.png';

// SVGs for educational categories and cards
const AcademicLogo = () => (
  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shadow-brand-600/30 select-none shrink-0 bg-gradient-to-br from-brand-600 to-accent-600">
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  </div>
);

const MascotAssistant = () => (
  <div className="flex flex-col items-center my-3 animate-bounce-slow">
    <svg className="w-24 h-24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <rect x="50" y="40" width="100" height="70" rx="35" fill="#EBF3FF" stroke="#3B82F6" strokeWidth="4" />
      {/* Graduation Cap */}
      <path d="M100 15L45 35L100 55L155 35L100 15Z" fill="#1E3A8A" />
      <path d="M140 37V60" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="140" cy="62" r="4" fill="#F59E0B" />
      {/* Face Screen */}
      <rect x="68" y="58" width="64" height="34" rx="17" fill="#1F2937" />
      {/* Eyes */}
      <circle cx="88" cy="72" r="4.5" fill="#60A5FA" />
      <circle cx="112" cy="72" r="4.5" fill="#60A5FA" />
      <ellipse cx="80" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="120" cy="80" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
      {/* Body */}
      <rect x="65" y="110" width="70" height="55" rx="27.5" fill="#EBF3FF" stroke="#3B82F6" strokeWidth="4" />
      {/* Book on Chest */}
      <rect x="88" y="122" width="24" height="20" rx="3" fill="#3B82F6" />
      <line x1="94" y1="128" x2="106" y2="128" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="94" y1="134" x2="106" y2="134" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

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
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-2">
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
      <GraduationCap size={22} />
    </div>
    <span className="text-[10px] font-bold text-purple-900">หลักสูตร 70</span>
    <span className="text-[9px] text-purple-600">120-124 หน่วยกิต</span>
  </div>
);


export default function ChatSupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 1. นำ Hooks ทั้งหมดขึ้นมาประกาศก่อนเงื่อนไข if
  const [messages, setMessages] = useState([
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
  const [inputValue, setInputValue] = useState('');
  const [quickReplies, setQuickReplies] = useState(DEFAULT_QUICK_REPLIES);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 2. เงื่อนไขการ return จะอยู่หลังการประกาศ Hooks ทั้งหมด
  // Hide on home page since the home page itself is now the full-screen chatbot panel
  if (location.pathname === '/') {
    return null;
  }

  // Handle keyword matching and dialog progression
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isBotReplying) return;

    // Add user message
    const userMsg = { id: nextMessageId(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setIsBotReplying(true);
    setInputValue('');

    setTimeout(async () => {
      try {
        const replies = await getBotReplies(textToSend);
        setMessages(prev => [...prev, ...withIds(replies)]);
      } catch (err) {
        console.error(err);
      } finally {
        // ให้ปุ่มตัวเลือก (Quick Replies) แสดงผลอยู่เสมอที่ท้ายข้อความตอบกลับของบอททุกครั้ง
        setQuickReplies(DEFAULT_QUICK_REPLIES);
        setIsBotReplying(false);
      }
    }, 800);
  };

  const handleCurriculumOption = () => {
    handleSendMessage('[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]');
  };

  const handleCsTuitionOption = () => {
    handleSendMessage('[ค่าเทอม วิทยาการคอมพิวเตอร์]');
  };

  const handleScholarshipOption = () => {
    handleSendMessage('[ทุนปันน้ำใจพี่ให้น้อง]');
  };

  const handleCalendarOption = () => {
    handleSendMessage('[ปฏิทินการศึกษา MJU]');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-brand-600 to-accent-600 shadow-xl shadow-brand-600/30 hover:scale-105 hover:shadow-2xl hover:shadow-brand-600/40 transition-all duration-300 relative group cursor-pointer"
        >
          <MessageSquare size={26} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold">1</span>
          </span>
          <div className="absolute right-16 bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition whitespace-nowrap shadow-lg pointer-events-none">
            ปรึกษาค่าเทอม & ทุนการศึกษา มหาวิทยาลัยแม่โจ้
          </div>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[min(580px,calc(100dvh-3rem))] bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/20 flex flex-col overflow-hidden animate-slide-in relative origin-bottom-right">
          
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-100 bg-gradient-to-r from-brand-50/80 via-white to-violet-50/60">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500 cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              
              <AcademicLogo />
              
              <div>
                <div className="font-bold text-slate-900 text-[15px] leading-tight tracking-tight">ข้อมูลหลักสูตร & ทุน ม.แม่โจ้</div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-500 font-medium">บอทวิชาการ วิทยาการคอมพิวเตอร์ (AI)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600 transition">
                <PhoneCall size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1.5">
                
                {/* Bot Message */}
                {msg.sender === 'bot' && (
                  <div className="flex gap-2 items-start max-w-[88%] animate-fade-up">
                    {/* Bot Logo */}
                    {!msg.isMascot && (
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 select-none bg-gradient-to-br from-brand-600 to-accent-600 shadow-sm">
                        <Bot size={14} />
                      </div>
                    )}
                    
                    {/* Mascot Sticker */}
                    {msg.isMascot && (
                      <MascotAssistant />
                    )}

                    {/* Educational Program Carousel */}
                    {msg.isEduCarousel && (
                      <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide snap-x w-[300px]">
                        
                        {/* Curriculum 70 Card */}
                        <div className="bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-purple-50">
                            <CurriculumIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-purple-900">หลักสูตร (รหัส 70)</div>
                              <div className="text-[9px] text-gray-500 font-medium">AI & Cloud Native</div>
                              <div className="text-[10px] text-purple-600 font-bold mt-1">120–124 หน่วยกิต</div>
                            </div>
                            <button
                              onClick={handleCurriculumOption}
                              className="mt-2 w-full py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded text-[10px] transition border border-purple-200 cursor-pointer"
                            >
                              โครงสร้างหลักสูตร
                            </button>
                          </div>
                        </div>

                        {/* Computer Science Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100">
                            <ComputerIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-gray-800">วิทยาการคอมพิวเตอร์</div>
                              <div className="text-[9px] text-gray-500 font-medium">คณะวิทยาศาสตร์</div>
                              <div className="text-[10px] text-blue-600 font-bold mt-1">20,000 บ./ภาคเรียน</div>
                            </div>
                            <button
                              onClick={handleCsTuitionOption}
                              className="mt-2 w-full py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-[10px] transition border border-blue-200"
                            >
                              ข้อมูลค่าเทอม
                            </button>
                          </div>
                        </div>

                        {/* ทุนการศึกษา Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100">
                            <ScholarshipIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-gray-800">ทุนปันน้ำใจฯ #5</div>
                              <div className="text-[9px] text-gray-500 font-medium">ต่อเนื่อง & ไม่ต่อเนื่อง</div>
                              <div className="text-[10px] text-amber-600 font-bold mt-1">รวม 25 ทุน</div>
                            </div>
                            <button
                              onClick={handleScholarshipOption}
                              className="mt-2 w-full py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded text-[10px] transition border border-amber-200 cursor-pointer"
                            >
                              ดูข้อมูลทุนทั้งหมด
                            </button>
                          </div>
                        </div>

                        {/* Calendar Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100">
                            <CalendarIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-gray-800">ปฏิทินการศึกษา</div>
                              <div className="text-[9px] text-gray-500 font-medium">มหาวิทยาลัยแม่โจ้</div>
                              <div className="text-[10px] text-emerald-600 font-bold mt-1">ไฟล์ PDF ทางการ</div>
                            </div>
                            <button
                              onClick={handleCalendarOption}
                              className="mt-2 w-full py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[10px] transition border border-emerald-200"
                            >
                              ดูปฏิทิน
                            </button>
                          </div>
                        </div>

                        {/* Military Deferment Card (การ์ดโชว์รูปประกาศผ่อนผันทหาร) */}
                        <div className="bg-white rounded-xl border border-emerald-300 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col group">
                          <div 
                            className="h-28 bg-emerald-50 relative overflow-hidden cursor-pointer"
                            onClick={() => setPreviewModalImage({ url: militaryDefermentImg, title: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้' })}
                            title="คลิกเพื่อดูรูปประกาศขนาดใหญ่"
                          >
                            <img 
                              src={militaryDefermentImg} 
                              alt="ประกาศการขอผ่อนผันทหาร มหาวิทยาลัยแม่โจ้" 
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                              loading="eager"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                              รูปประกาศ
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5 font-semibold">
                              <span>🔍 แตะดูรูป</span>
                            </div>
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-emerald-950">ผ่อนผันทหาร 69</div>
                              <div className="text-[9px] text-gray-500 font-medium">เกิด พ.ศ. 2549</div>
                              <div className="text-[10px] text-emerald-700 font-bold mt-1">21 ก.ย. - 18 ธ.ค.</div>
                            </div>
                            <button
                              onClick={() => handleSendMessage('[การขอผ่อนผันทหาร]')}
                              className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] transition shadow-xs cursor-pointer"
                            >
                              ดูรูป & ข้อมูล
                            </button>
                          </div>
                        </div>

                        {/* Accident Insurance Card (การ์ดโชว์รูปข้อมูลประกันอุบัติเหตุ) */}
                        <div className="bg-white rounded-xl border border-rose-300 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col group">
                          <div 
                            className="h-28 bg-rose-50 relative overflow-hidden cursor-pointer"
                            onClick={() => setPreviewModalImage({ url: accidentInsuranceImg, title: 'ประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (เออร์โกประกันภัย)' })}
                            title="คลิกเพื่อดูรูปตารางความคุ้มครองขนาดใหญ่"
                          >
                            <img 
                              src={accidentInsuranceImg} 
                              alt="ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้" 
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                              loading="eager"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                              รูปตารางคุ้มครอง
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5 font-semibold">
                              <span>🔍 แตะดูรูป</span>
                            </div>
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-rose-950">ประกันอุบัติเหตุ</div>
                              <div className="text-[9px] text-gray-500 font-medium">บมจ.เออร์โกประกันภัย</div>
                              <div className="text-[10px] text-rose-600 font-bold mt-1">รักษา 22,000 บ.</div>
                            </div>
                            <button
                              onClick={() => handleSendMessage('[ประกันอุบัติเหตุ]')}
                              className="mt-2 w-full py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px] transition shadow-xs cursor-pointer"
                            >
                              ดูรูป & สิทธิคุ้มครอง
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Standard Text Bubble */}
                    {msg.text && (
                      <div className="min-w-0 bg-white border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-soft">
                        {msg.text}
                        
                        {/* Embedded Single Image (โชว์รูปภาพเลย) */}
                        {msg.image && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-300 shadow-sm bg-white">
                            <div 
                              onClick={() => setPreviewModalImage({ url: msg.image.url, title: msg.image.caption || msg.image.alt })}
                              className="block relative group cursor-pointer overflow-hidden bg-gray-50"
                              title="คลิกเพื่อดูรูปภาพขนาดใหญ่"
                            >
                              <img 
                                src={msg.image.url} 
                                alt={msg.image.alt || 'รูปภาพประกาศ'} 
                                className="w-full h-auto max-h-80 object-contain rounded-t-lg group-hover:scale-[1.01] transition-transform duration-200"
                                loading="eager"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md opacity-90 group-hover:opacity-100 transition flex items-center gap-1 font-semibold shadow">
                                <span>🔍 คลิกดูรูปขนาดใหญ่</span>
                              </div>
                            </div>
                            {msg.image.caption && (
                              <div className="px-2.5 py-1.5 text-[10px] font-bold text-gray-700 bg-gray-50/90 border-t border-gray-200 text-center flex items-center justify-between">
                                <span className="flex-1 text-center">{msg.image.caption}</span>
                                <a 
                                  href={msg.image.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold underline shrink-0 ml-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  เปิดแท็บใหม่
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Embedded Multiple Images (โชว์รูปภาพหลายรูป) */}
                        {msg.images && msg.images.map((imgItem, imgIdx) => (
                          <div key={imgIdx} className="mt-3 overflow-hidden rounded-xl border border-gray-300 shadow-sm bg-white">
                            <div 
                              onClick={() => setPreviewModalImage({ url: imgItem.url, title: imgItem.caption || imgItem.alt })}
                              className="block relative group cursor-pointer overflow-hidden bg-gray-50"
                              title="คลิกเพื่อดูรูปภาพขนาดใหญ่"
                            >
                              <img 
                                src={imgItem.url} 
                                alt={imgItem.alt || 'รูปภาพ'} 
                                className="w-full h-auto max-h-80 object-contain rounded-t-lg group-hover:scale-[1.01] transition-transform duration-200"
                                loading="eager"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md opacity-90 group-hover:opacity-100 transition flex items-center gap-1 font-semibold shadow">
                                <span>🔍 คลิกดูรูปขนาดใหญ่</span>
                              </div>
                            </div>
                            {imgItem.caption && (
                              <div className="px-2.5 py-1.5 text-[10px] font-bold text-gray-700 bg-gray-50/90 border-t border-gray-200 text-center flex items-center justify-between">
                                <span className="flex-1 text-center">{imgItem.caption}</span>
                                <a 
                                  href={imgItem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold underline shrink-0 ml-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  เปิดแท็บใหม่
                                </a>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* URL Action / Link Button */}
                        {msg.actionLink && (
                          <a 
                            href={msg.actionLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-3 flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm group cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <ExternalLink size={15} className="shrink-0 group-hover:scale-110 transition-transform" /> 
                              <span>{msg.actionLink.title}</span>
                            </span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium shrink-0">เปิดเว็บไซต์ ↗</span>
                          </a>
                        )}

                        {/* PDF Downloads */}
                        {msg.downloadLink && (
                          <a 
                            href={msg.downloadLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-3 flex items-center gap-1.5 p-2 bg-white rounded-lg border border-gray-300 text-[10px] font-bold text-red-600 hover:bg-red-50 hover:border-red-400 transition"
                          >
                            <FileText size={14} /> {msg.downloadLink.title}
                          </a>
                        )}

                        {/* Payment Gateway Links */}
                        {msg.paymentLink && (
                          <a 
                            href={msg.paymentLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-3 flex items-center justify-between p-2 bg-blue-600 rounded-lg text-[10px] font-bold text-white hover:bg-blue-700 transition"
                          >
                            <span className="flex items-center gap-1.5"><ExternalLink size={14} /> {msg.paymentLink.title}</span>
                            <span>คลิกชำระเงิน</span>
                          </a>
                        )}

                        {/* Q&A Thread Links */}
                        {msg.searchResults && (
                          <div className="mt-3 space-y-1.5 border-t pt-2 border-gray-300/40">
                            {msg.searchResults.map((t) => (
                              <button
                                key={t._id}
                                onClick={() => {
                                  navigate(`/question/${t._id}`);
                                  setIsOpen(false);
                                }}
                                className="block text-[11px] font-bold text-blue-600 hover:underline text-left w-full truncate"
                              >
                                กระทู้: {t.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* User Message */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div 
                      className={`rounded-2xl rounded-tr-md px-3.5 py-2 text-xs leading-relaxed font-medium text-white max-w-[80%] shadow-md animate-fade-up ${
                        msg.text.startsWith('[') 
                          ? 'bg-gradient-to-br from-accent-500 to-accent-600 shadow-accent-500/20' // Purple for categories
                          : 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/20' // Blue for inputs/choices
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}

              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies (4 ปุ่มตัวเลือกด่วน แสดงผลเสมอ) */}
          {quickReplies.length > 0 && (
            <div className="bg-white px-3 pt-2.5 pb-1 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-100 shrink-0">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  disabled={isBotReplying}
                  onClick={() => handleSendMessage(reply)}
                  className={`shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-medium text-slate-600 transition ${
                    isBotReplying 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer'
                  }`}
                >
                  {reply.replace(/^\[|\]$/g, '')}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="bg-white px-3 pt-1.5 pb-3 shrink-0">
            <div className="flex items-center gap-0.5 rounded-2xl border border-slate-200 bg-slate-50 pl-1.5 pr-1 py-1 transition focus-within:bg-white focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10">
              <button type="button" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition">
                <Plus size={17} />
              </button>
              <button type="button" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition">
                <ImageIcon size={17} />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="สอบถามค่าเทอม ทุน ปฏิทินการศึกษา..."
                className="flex-1 min-w-0 bg-transparent px-1.5 py-1.5 text-xs focus:outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isBotReplying}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-brand-600 to-accent-600 shadow-sm shadow-brand-600/25 hover:brightness-110 transition cursor-pointer disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                title="ส่งข้อความ"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 text-white">
              <span className="text-xs sm:text-sm font-bold truncate pr-2">{previewModalImage.title || 'ดูรูปภาพ'}</span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewModalImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                >
                  เปิดแท็บใหม่
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalImage(null)}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-3 overflow-auto flex items-center justify-center bg-gray-100/80 max-h-[calc(92vh-3.5rem)]">
              <img 
                src={previewModalImage.url} 
                alt={previewModalImage.title || 'รูปภาพ'} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
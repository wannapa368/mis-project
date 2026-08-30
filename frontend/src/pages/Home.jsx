import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ArrowUp, User, CheckCircle2, CircleDashed, Filter, RefreshCw, Send, Smile, ThumbsUp, Plus, Camera, Image as ImageIcon, Video, PhoneCall, GraduationCap, FileText, ExternalLink } from 'lucide-react';
import axios from 'axios';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

// SVGs for Chatbot
const AcademicLogo = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md select-none shrink-0" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}>
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
const RegularIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#EFF6FF" />
    <path d="M50 20L20 35L50 50L80 35L50 20Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 45V62C30 67 40 72 50 72C60 72 70 67 70 62V45" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M80 35V52" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SpecialIcon = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#FAF5FF" />
    <circle cx="50" cy="50" r="28" fill="#C084FC" stroke="#9333EA" strokeWidth="3" />
    <path d="M50 32V50H64" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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

export default function Home({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  
  // View states: 'chatbot' (Academic AI) or 'forum' (Helpdesk web board)
  const [viewMode, setViewMode] = useState('chatbot'); 
  
  // Forum variables
  const [questions, setQuestions] = useState([]);
  const [forumLoading, setForumLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [forumTab, setForumTab] = useState('all'); // 'all', 'mine', 'unanswered'
  const [selectedTag, setSelectedTag] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Chatbot variables
  const [chatInputValue, setChatInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Mock User lists
  const mockUsers = [
    { name: 'Somchai R.', role: 'Student', avatar: 'Student' },
    { name: 'นักศึกษาปริศนา', role: 'Student', avatar: 'Student' },
    { name: 'Wannapa C.', role: 'Student', avatar: 'Student' },
    { name: 'อาจารย์สมศักดิ์', role: 'Teacher', avatar: 'Teacher' }
  ];

  // Academic Chatbot Messages
  const [academicMessages, setAcademicMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีครับ ผมบอทช่วยเหลือการศึกษาประจำเป็นบอร์ดวิชาการครับ 🎓' },
    { id: 2, sender: 'bot', text: 'ยินดีช่วยเหลือเรื่องงานทะเบียน โครงสร้างหลักสูตร ค่าเทอม และการขอผ่อนผันครับ รบกวนเลือกหมวดหมู่คำถามด้านล่าง หรือพิมพ์คำถามที่ต้องการได้เลยครับ' }
  ]);
  const [academicReplies, setAcademicReplies] = useState(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]', '[ผ่อนผันการชำระ]']);

  // Scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [academicMessages, viewMode]);

  // Fetch Forum Questions
  const fetchForumQuestions = useCallback(async () => {
    setForumLoading(true);
    try {
      let url = `${API_URL}/api/questions`;
      const params = {};

      if (searchQuery) {
        params.q = searchQuery;
      }
      if (selectedTag) {
        params.tag = selectedTag;
      }
      if (forumTab === 'mine') {
        params.myThreads = currentUser.name;
      }

      const response = await axios.get(url, { params });
      let data = response.data;

      if (forumTab === 'unanswered') {
        data = data.filter(q => q.commentsCount === 0 && q.status === 'waiting');
      }

      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setForumLoading(false);
    }
  }, [searchQuery, selectedTag, forumTab, currentUser.name]);

  useEffect(() => {
    if (viewMode === 'forum') {
      fetchForumQuestions();
    }
  }, [viewMode, fetchForumQuestions]);

  // Seed data trigger
  const handleSeedData = async () => {
    setForumLoading(true);
    try {
      await axios.get(`${API_URL}/api/seed`);
      if (viewMode === 'forum') {
        fetchForumQuestions();
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

  const handleUpvote = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.post(`${API_URL}/api/questions/${id}/upvote`, {
        userId: currentUser.name
      });
      fetchForumQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  // Process sending chat message (Academic Only)
  const handleSendChatMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    
    setAcademicMessages(prev => [...prev, userMsg]);
    setAcademicReplies([]);
    setChatInputValue('');

    // Process bot response
    setTimeout(async () => {
      const cleanText = textToSend.trim().toLowerCase();

      if (cleanText.includes('ค่าเทอม') || cleanText.includes('จ่ายเงิน') || cleanText.includes('การเงิน') || cleanText.includes('ค่าธรรมเนียม') || cleanText.includes('เงิน') || cleanText.includes('[ค่าเทอม/การเงิน]')) {
        setAcademicMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', isMascot: true },
          { id: Date.now() + 2, sender: 'bot', text: 'ข้อมูลอัตราค่าธรรมเนียมการศึกษา (ค่าเทอม) ประจำภาคการศึกษาปัจจุบันแยกตามประเภทหลักสูตรครับ:' },
          { id: Date.now() + 3, sender: 'bot', isEduCarousel: true }
        ]);
        setAcademicReplies(['ช่องทางชำระเงิน', 'ขั้นตอนผ่อนผันค่าเทอม', 'ทุนการศึกษา']);
      }
      else if (cleanText.includes('ลงทะเบียน') || cleanText.includes('ลงเรียน') || cleanText.includes('[งานทะเบียน]')) {
        setAcademicMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: 'ขั้นตอนการลงทะเบียนเรียนวิชาการศึกษา:\n\n1. เข้าสู่ระบบทะเบียนกลางโดยป้อนรหัสนักศึกษา\n2. เลือกรายวิชาตามแผนการเรียนประจำเทอม\n3. กดยืนยันการเลือก และพิมพ์ใบชำระค่าธรรมเนียม\n\nคุณสามารถดาวน์โหลดคู่มือฉบับเต็มได้ที่นี่ครับ:',
            downloadLink: {
              title: 'ดาวน์โหลดคู่มือการลงทะเบียนเรียน.pdf',
              url: 'https://reg.cs-helpdesk.ac.th/manual.pdf'
            }
          }
        ]);
        setAcademicReplies(['ปฏิทินการศึกษา', 'ติดต่อฝ่ายทะเบียน']);
      }
      else if (cleanText.includes('ผ่อนผัน') || cleanText.includes('ค้างจ่าย') || cleanText.includes('[ผ่อนผันการชำระ]') || cleanText.includes('ขั้นตอนผ่อนผันค่าเทอม')) {
        setAcademicMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: 'ขั้นตอนการยื่นคำร้องขอผ่อนผันค่าเทอม:\n\n1. ดาวน์โหลด "คำร้องขอผ่อนผันค่าธรรมเนียมการศึกษา"\n2. กรอกข้อมูลให้ครบถ้วนพร้อมเซ็นชื่อรับรองโดยผู้ปกครอง\n3. ยื่นส่งคำร้องผ่านเว็บไซต์ทะเบียนหรือนำส่งฝ่ายกิจการนักศึกษาอาคาร 1 ชั้น 1 ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
          },
          {
            id: Date.now() + 2,
            sender: 'bot',
            text: 'ดาวน์โหลดแบบฟอร์มขอผ่อนผันค่าเทอมได้ที่ลิงก์ด้านล่างนี้ครับ:',
            downloadLink: {
              title: 'แบบฟอร์มคำร้องผ่อนผันค่าธรรมเนียมการศึกษา.pdf',
              url: 'https://reg.cs-helpdesk.ac.th/defer-form.pdf'
            }
          }
        ]);
        setAcademicReplies(['ช่องทางชำระเงิน', 'ติดต่อฝ่ายทะเบียน']);
      }
      else if (cleanText.includes('ช่องทางชำระเงิน') || cleanText.includes('ชำระเงิน') || cleanText.includes('ช่องทางจ่ายเงิน')) {
        setAcademicMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'ช่องทางการชำระเงินค่าเทอม:\n\n• ชำระผ่านระบบสแกน QR Code/PromptPay บนแอปพลิเคชันธนาคาร\n• พิมพ์ใบ Pay-in นำไปจ่ายที่เคาน์เตอร์ธนาคารกรุงไทย หรือเคาน์เตอร์เซอร์วิส\n\nชำระออนไลน์ได้ที่นี่:',
            paymentLink: {
              title: 'ระบบชำระเงินออนไลน์ (Payment Gateway)',
              url: 'https://payment.cs-helpdesk.ac.th'
            }
          }
        ]);
        setAcademicReplies(['ขั้นตอนผ่อนผันค่าเทอม', 'ตรวจสอบยอดค้างชำระ']);
      }
      else if (cleanText.includes('ทุนการศึกษา') || cleanText.includes('ทุน')) {
        setAcademicMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'ทุนการศึกษาที่เปิดรับสมัครปัจจุบัน:\n\n1. ทุนกู้ยืมเพื่อการศึกษา (กยศ.)\n2. ทุนเรียนดีประจำปีการศึกษา\n3. ทุนช่วยเหลือค่าครองชีพนักศึกษาขาดแคลนทุนทรัพย์\n\nอ่านรายละเอียดคุณสมบัติและดาวน์โหลดแบบฟอร์มสมัครได้ที่ฝ่ายกิจการนักศึกษา อาคาร 1 ชั้น 1 ครับ'
          }
        ]);
        setAcademicReplies(['ขั้นตอนผ่อนผันค่าเทอม', 'ติดต่อฝ่ายการเงิน']);
      }
      else if (cleanText.includes('ปฏิทินการศึกษา') || cleanText.includes('ปฏิทิน')) {
        setAcademicMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'ปฏิทินการศึกษาประจำปีการศึกษาปัจจุบันครับ (รวมวันลงทะเบียน วันสอบกลางภาค/ปลายภาค วันสุดท้ายในการดรอปเรียน):',
            downloadLink: {
              title: 'ปฏิทินวิชาการประจำปีการศึกษา.pdf',
              url: 'https://reg.cs-helpdesk.ac.th/academic-calendar.pdf'
            }
          }
        ]);
        setAcademicReplies(['[งานทะเบียน]', 'ติดต่อฝ่ายทะเบียน']);
      }
      else if (cleanText.includes('ติดต่อ') || cleanText.includes('ติดต่อฝ่ายทะเบียน') || cleanText.includes('ติดต่อฝ่ายการเงิน')) {
        setAcademicMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'ช่องทางการติดต่อหน่วยงานการศึกษา:\n\n• **ฝ่ายทะเบียนกลาง**: อาคารบริหาร ชั้น 1 โทร. 02-123-4567 ต่อ 11\n• **ฝ่ายการเงิน/ชำระเงิน**: อาคารบริหาร ชั้น 2 โทร. 02-123-4567 ต่อ 12\n• **ฝ่ายกิจการนักศึกษา (ผ่อนผัน/ทุน)**: อาคาร 1 ชั้น 1 โทร. 02-123-4567 ต่อ 13\n\nเปิดทำการวันจันทร์ - ศุกร์ 08:30 - 16:30 น.'
          }
        ]);
        setAcademicReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]']);
      }
      // Thread search
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
        setAcademicReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]']);
      }
      else {
        setAcademicMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'ขออภัยครับ บอทวิชาการจำลองยังไม่เข้าใจข้อความดังกล่าว คุณสามารถถามถึง "ค่าเทอม", "ลงทะเบียน", "ขั้นตอนผ่อนผัน" หรือเลือกปุ่มหมวดหมู่ด่วนด้านล่างได้เลยนะครับ' }
        ]);
        setAcademicReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]', '[ผ่อนผันการชำระ]']);
      }
    }, 800);
  };

  const handleRegularOption = () => {
    handleSendChatMessage('ค่าเทอมภาคปกติ');
  };

  const handleSpecialOption = () => {
    handleSendChatMessage('ค่าเทอมภาคพิเศษ');
  };

  const handleScholarshipOption = () => {
    handleSendChatMessage('ทุนการศึกษา');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 1. Top Navigation Bar */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => {
              setViewMode('chatbot');
            }}
            className="text-xl font-extrabold text-blue-600 cursor-pointer tracking-tight flex items-center gap-1.5"
          >
            <GraduationCap className="h-6 w-6 stroke-[2.5]" />
            <span>CS Helpdesk & Assistant</span>
          </div>
          
          {/* Forum Search Bar (Hidden in Chatbot mode) */}
          <div className={`flex-1 max-w-2xl px-8 transition-opacity duration-300 ${viewMode === 'forum' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="ค้นหากระทู้, คำถาม หรือแท็ก..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-1 shadow-sm text-sm"
            >
              + ตั้งคำถาม
            </button>
            
            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
                title="สลับบทบาทในการทดสอบ"
              >
                {currentUser.name.charAt(0)}
              </button>
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg py-2 z-20">
                  <div className="px-4 py-1.5 border-b mb-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">สลับบทบาทของคุณ</span>
                    <span className="text-xs font-semibold text-gray-700">{currentUser.name} ({currentUser.role})</span>
                  </div>
                  {mockUsers.map((u) => (
                    <button
                      key={u.name}
                      onClick={() => {
                        setCurrentUser(u);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${
                        currentUser.name === u.name ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      <span>{u.name}</span>
                      <span className="text-[9px] bg-gray-200 text-gray-600 px-1 rounded">{u.role === 'Teacher' ? 'อาจารย์' : 'นศ.'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6 w-full flex-1 min-h-0">
        
        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="space-y-6">
            
            {/* Chatbot Navigation */}
            <div>
              <h3 className="font-bold text-gray-400 px-4 mb-2 text-xs uppercase tracking-wider">🤖 บอทช่วยเหลือจำลอง</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => {
                    setViewMode('chatbot');
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${
                    viewMode === 'chatbot'
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <GraduationCap size={16} />
                  บอททะเบียนเรียน & การเงิน
                </button>
              </nav>
            </div>

            {/* Forum Navigation */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-400 px-4 mb-2 text-xs uppercase tracking-wider">📋 กระทู้ถามตอบเว็บบอร์ด</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => {
                    setViewMode('forum');
                    setForumTab('all');
                    setSelectedTag(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    viewMode === 'forum' && forumTab === 'all' && !selectedTag
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare size={16} />
                  กระทู้ทั้งหมด
                </button>
                <button 
                  onClick={() => {
                    setViewMode('forum');
                    setForumTab('mine');
                    setSelectedTag(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    viewMode === 'forum' && forumTab === 'mine'
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User size={16} />
                  กระทู้ของฉัน
                </button>
                <button 
                  onClick={() => {
                    setViewMode('forum');
                    setForumTab('unanswered');
                    setSelectedTag(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    viewMode === 'forum' && forumTab === 'unanswered'
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CircleDashed size={16} />
                  กระทู้รอคนตอบ
                </button>
              </nav>
            </div>

            {/* Hot Tags List */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-400 px-4 mb-2 text-xs uppercase tracking-wider">Tags ยอดฮิต</h3>
              <div className="flex flex-col gap-1 px-2">
                {['Java', 'Database', 'Error', 'NestJS', 'React'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setViewMode('forum');
                      setForumTab('all');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition flex items-center justify-between ${
                      selectedTag === tag && viewMode === 'forum'
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      selectedTag === tag && viewMode === 'forum' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tag === 'Database' ? 'DB' : tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="pt-2">
              <button
                onClick={handleSeedData}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 border"
              >
                <RefreshCw size={12} /> รีเซ็ตเป็นข้อมูลตัวอย่าง
              </button>
            </div>

          </div>
        </aside>

        {/* Central Display Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
          
          {/* VIEW MODE 1: ACADEMIC CHATBOT PANELS (Default) */}
          {viewMode === 'chatbot' && (
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
              
              {/* Chat Header */}
              <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <AcademicLogo />
                  <div>
                    <div className="font-extrabold text-gray-800 text-lg leading-tight tracking-tight">
                      บอททะเบียนเรียน & การเงิน (Academic AI)
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ออนไลน์</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {academicMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    
                    {/* Bot Messages */}
                    {msg.sender === 'bot' && (
                      <div className="flex gap-3 items-end max-w-[85%]">
                        {!msg.isMascot && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none bg-blue-800">
                            A
                          </div>
                        )}

                        {/* Mascot Sticker */}
                        {msg.isMascot && (
                          <MascotAcademic />
                        )}

                        {/* Tuition Carousel */}
                        {msg.isEduCarousel && (
                          <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide snap-x w-[320px] md:w-[450px]">
                            {/* Regular Card */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-44 snap-start flex flex-col">
                              <div className="h-32 bg-gray-50"><RegularIcon /></div>
                              <div className="p-3 text-center flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="text-xs font-extrabold text-gray-800">หลักสูตรภาคปกติ</div>
                                  <div className="text-[11px] text-blue-600 font-bold mt-1">18,000 บ./ภาคเรียน</div>
                                </div>
                                <button
                                  onClick={handleRegularOption}
                                  className="mt-3 w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-[10px] transition border border-blue-200"
                                >
                                  อ่านรายละเอียด
                                </button>
                              </div>
                            </div>

                            {/* Special Card */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-44 snap-start flex flex-col">
                              <div className="h-32 bg-gray-50"><SpecialIcon /></div>
                              <div className="p-3 text-center flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="text-xs font-extrabold text-gray-800">หลักสูตรภาคพิเศษ</div>
                                  <div className="text-[11px] text-purple-600 font-bold mt-1">28,000 บ./ภาคเรียน</div>
                                </div>
                                <button
                                  onClick={handleSpecialOption}
                                  className="mt-3 w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded text-[10px] transition border border-purple-200"
                                >
                                  อ่านรายละเอียด
                                </button>
                              </div>
                            </div>

                            {/* Scholarship Card */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-44 snap-start flex flex-col">
                              <div className="h-32 bg-gray-50"><ScholarshipIcon /></div>
                              <div className="p-3 text-center flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="text-xs font-extrabold text-gray-800">ทุนการศึกษา / กยศ.</div>
                                  <div className="text-[11px] text-amber-600 font-bold mt-1">สมัครทุนช่วยเหลือ</div>
                                </div>
                                <button
                                  onClick={handleScholarshipOption}
                                  className="mt-3 w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded text-[10px] transition border border-amber-200"
                                >
                                  สอบถามทุน
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Standard text bubble */}
                        {msg.text && (
                          <div className="bg-gray-200/80 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                            {msg.text}
                            
                            {/* PDF Download Cards */}
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

                            {/* Payment links */}
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

                            {/* Database thread suggestion links */}
                            {msg.searchResults && (
                              <div className="mt-3 space-y-1.5 border-t pt-2 border-gray-300/40">
                                {msg.searchResults.map((t) => (
                                  <button
                                    key={t._id}
                                    onClick={() => navigate(`/question/${t._id}`)}
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

                    {/* User messages */}
                    {msg.sender === 'user' && (
                      <div className="flex justify-end">
                        <div 
                          className={`rounded-2xl rounded-br-none px-4 py-2 text-xs leading-relaxed font-semibold text-white max-w-[80%] shadow-sm ${
                            msg.text.startsWith('[') 
                              ? 'bg-purple-600' 
                              : 'bg-blue-600'
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

              {/* Quick Replies Bar */}
              {academicReplies.length > 0 && (
                <div className="bg-white/80 px-6 py-3 flex flex-wrap gap-2 justify-center border-t shrink-0">
                  {academicReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSendChatMessage(reply)}
                      className="px-4 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-gray-200 rounded-full text-xs font-bold text-gray-600 transition shadow-sm cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="bg-white border-t p-4 flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-blue-600">
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded-full transition"><Plus size={18} /></button>
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded-full transition"><Camera size={18} /></button>
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded-full transition"><ImageIcon size={18} /></button>
                </div>

                <input
                  type="text"
                  value={chatInputValue}
                  onChange={(e) => setChatInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(chatInputValue)}
                  placeholder="สอบถามเรื่องลงทะเบียนเรียน ค่าเทอม หรือพิมพ์ 'ค่าเทอม'..."
                  className="flex-1 bg-gray-100 rounded-full px-5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />

                <div className="flex items-center gap-1.5 text-blue-600">
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded-full transition"><Smile size={18} /></button>
                  {chatInputValue.trim() ? (
                    <button 
                      type="button" 
                      onClick={() => handleSendChatMessage(chatInputValue)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition text-blue-600 cursor-pointer"
                    >
                      <Send size={18} />
                    </button>
                  ) : (
                    <button type="button" className="p-1.5 hover:bg-gray-100 rounded-full transition"><ThumbsUp size={18} /></button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: Q&A FORUM BOARD */}
          {viewMode === 'forum' && (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Forum Header Filter summary */}
              <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <Filter size={18} className="text-blue-500" />
                  <span>
                    {selectedTag 
                      ? `หมวดหมู่สำหรับ #${selectedTag}` 
                      : forumTab === 'mine' 
                        ? 'กระทู้ของฉัน' 
                        : forumTab === 'unanswered' 
                          ? 'กระทู้รอความช่วยเหลือ' 
                          : 'กระทู้ล่าสุดทั้งหมด'}
                  </span>
                </h2>
                {selectedTag && (
                  <button 
                    onClick={() => setSelectedTag(null)}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    ล้างตัวกรองแท็ก
                  </button>
                )}
              </div>

              {/* Forum Thread Cards */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                {forumLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-400 mt-2 text-sm">กำลังโหลดข้อมูลกระทู้...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div 
                        key={q._id}
                        onClick={() => navigate(`/question/${q._id}`)}
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col md:flex-row gap-4 justify-between items-start"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                              {q.author.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800">{q.author.name}</span>
                              <span className="mx-1">•</span>
                              <span>{formatRelativeTime(q.createdAt)}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-blue-600 transition">
                            {q.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex gap-1.5">
                              {q.tags.map(tag => {
                                let color = 'bg-gray-100 text-gray-600';
                                if (tag === 'Database') color = 'bg-green-50 text-green-700 border border-green-200';
                                else if (tag === 'Error') color = 'bg-red-50 text-red-700 border border-red-200';
                                else if (tag === 'React') color = 'bg-blue-50 text-blue-700 border border-blue-200';
                                else if (tag === 'Java') color = 'bg-orange-50 text-orange-700 border border-orange-200';
                                else if (tag === 'NestJS') color = 'bg-pink-50 text-pink-700 border border-pink-200';
                                return (
                                  <span key={tag} className={`px-2 py-0.5 text-[10px] font-semibold rounded ${color}`}>
                                    #{tag}
                                  </span>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-semibold ml-auto md:ml-0">
                              {q.status === 'resolved' ? (
                                <span className="flex items-center gap-0.5 text-green-600">
                                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span> แก้ไขแล้ว
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-yellow-600">
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></span> รอคำตอบ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Votes and replies count */}
                        <div className="flex md:flex-col items-center md:justify-center gap-3 self-stretch md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-gray-100 w-full md:w-16">
                          <button 
                            onClick={(e) => handleUpvote(e, q._id)}
                            className={`flex md:flex-col items-center justify-center gap-1 py-1 px-2.5 rounded border text-[11px] font-bold transition w-full hover:bg-blue-50 ${
                              q.upvoteUserIds?.includes(currentUser.name) 
                                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                          >
                            <ArrowUp size={12} />
                            <span>{q.upvotes}</span>
                          </button>
                          
                          <div className="flex md:flex-col items-center justify-center gap-1 py-1 px-2.5 rounded border border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-semibold w-full">
                            <MessageSquare size={12} />
                            <span>{q.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-3">
                    <h3 className="font-bold text-gray-800">ไม่พบกระทู้ที่กำลังมองหา</h3>
                    <p className="text-xs text-gray-500">ขณะนี้ไม่มีกระทู้ใดตรงตามตัวกรอง ค้นหา หรือบทบาทที่กำหนดในฐานข้อมูล</p>
                    <div className="pt-2 flex justify-center gap-2">
                      <button onClick={handleSeedData} className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded transition">
                        โหลดข้อมูลตัวอย่าง
                      </button>
                      <button 
                        onClick={() => {
                          setForumTab('all');
                          setSelectedTag(null);
                          setSearchQuery('');
                        }} 
                        className="px-4 py-1.5 border hover:bg-gray-100 text-xs font-semibold rounded transition text-gray-600"
                      >
                        ล้างตัวกรอง
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
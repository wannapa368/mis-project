import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Smile, ThumbsUp, Plus, Camera, Image as ImageIcon, Video, ArrowLeft, FileText, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';
import axios from 'axios';

// SVGs for educational categories and cards
const AcademicLogo = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md select-none shrink-0" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}>
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

export default function ChatSupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on home page since the home page itself is now the full-screen chatbot panel
  if (location.pathname === '/') {
    return null;
  }

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีครับ ผมบอทช่วยเหลือการศึกษาประจำเป็นบอร์ดวิชาการครับ 🎓' },
    { id: 2, sender: 'bot', text: 'ยินดีช่วยเหลือเรื่องงานทะเบียน โครงสร้างหลักสูตร ค่าเทอม และการขอผ่อนผันครับ รบกวนเลือกหมวดหมู่คำถามด้านล่าง หรือพิมพ์คำถามที่ต้องการได้เลยครับ' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [quickReplies, setQuickReplies] = useState(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]', '[ผ่อนผันการชำระ]']);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle keyword matching and dialog progression
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setQuickReplies([]);

    setTimeout(async () => {
      const cleanText = textToSend.trim().toLowerCase();

      // 1. Keyword check: ค่าเทอม / จ่ายเงิน / การเงิน
      if (cleanText.includes('ค่าเทอม') || cleanText.includes('จ่ายเงิน') || cleanText.includes('การเงิน') || cleanText.includes('ค่าธรรมเนียม') || cleanText.includes('เงิน') || cleanText.includes('[ค่าเทอม/การเงิน]')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', isMascot: true },
          { id: Date.now() + 2, sender: 'bot', text: 'ข้อมูลอัตราค่าธรรมเนียมการศึกษา (ค่าเทอม) ประจำภาคการศึกษาปัจจุบันแยกตามประเภทหลักสูตรครับ:' },
          { id: Date.now() + 3, sender: 'bot', isEduCarousel: true }
        ]);
        setQuickReplies(['ช่องทางชำระเงิน', 'ขั้นตอนผ่อนผันค่าเทอม', 'ทุนการศึกษา']);
      }

      // 2. Keyword check: ลงทะเบียน / ลงทะเบียนเรียน / เรียน
      else if (cleanText.includes('ลงทะเบียน') || cleanText.includes('ลงเรียน') || cleanText.includes('[งานทะเบียน]')) {
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: '📌 ขั้นตอนการลงทะเบียนเรียนวิชาการศึกษา:\n\n1. เข้าสู่ระบบทะเบียนกลางโดยป้อนรหัสนักศึกษา\n2. เลือกรายวิชาตามแผนการเรียนประจำเทอม\n3. กดยืนยันการเลือก และพิมพ์ใบชำระค่าธรรมเนียม\n\nคุณสามารถดาวน์โหลดคู่มือฉบับเต็มได้ที่นี่ครับ:',
            downloadLink: {
              title: 'ดาวน์โหลดคู่มือการลงทะเบียนเรียน.pdf',
              url: 'https://reg.cs-helpdesk.ac.th/manual.pdf'
            }
          }
        ]);
        setQuickReplies(['ปฏิทินการศึกษา', 'ติดต่อฝ่ายทะเบียน']);
      }

      // 3. Keyword check: ผ่อนผัน / ผ่อนผันค่าเทอม / ขอเลื่อน
      else if (cleanText.includes('ผ่อนผัน') || cleanText.includes('ค้างจ่าย') || cleanText.includes('[ผ่อนผันการชำระ]') || cleanText.includes('ขั้นตอนผ่อนผันค่าเทอม')) {
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: '📝 ขั้นตอนการยื่นคำร้องขอผ่อนผันค่าเทอม:\n\n1. ดาวน์โหลด "คำร้องขอผ่อนผันค่าธรรมเนียมการศึกษา"\n2. กรอกข้อมูลให้ครบถ้วนพร้อมเซ็นชื่อรับรองโดยผู้ปกครอง\n3. ยื่นส่งคำร้องผ่านเว็บไซต์ทะเบียนหรือนำส่งฝ่ายกิจการนักศึกษาอาคาร 1 ชั้น 1 ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
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
        setQuickReplies(['ช่องทางชำระเงิน', 'ติดต่อฝ่ายทะเบียน']);
      }

      // 4. Specific quick replies: ช่องทางชำระเงิน
      else if (cleanText.includes('ช่องทางชำระเงิน') || cleanText.includes('ชำระเงิน') || cleanText.includes('ช่องทางจ่ายเงิน')) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: '💳 ช่องทางการชำระเงินค่าเทอม:\n\n• ชำระผ่านระบบสแกน QR Code/PromptPay บนแอปพลิเคชันธนาคาร\n• พิมพ์ใบ Pay-in นำไปจ่ายที่เคาน์เตอร์ธนาคารกรุงไทย หรือเคาน์เตอร์เซอร์วิส\n\nชำระออนไลน์ได้ที่นี่:',
            paymentLink: {
              title: 'ระบบชำระเงินออนไลน์ (Payment Gateway)',
              url: 'https://payment.cs-helpdesk.ac.th'
            }
          }
        ]);
        setQuickReplies(['ขั้นตอนผ่อนผันค่าเทอม', 'ตรวจสอบยอดค้างชำระ']);
      }

      // 5. Specific quick replies: ทุนการศึกษา
      else if (cleanText.includes('ทุนการศึกษา') || cleanText.includes('ทุน')) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: '🌟 ทุนการศึกษาที่เปิดรับสมัครปัจจุบัน:\n\n1. ทุนกู้ยืมเพื่อการศึกษา (กยศ.)\n2. ทุนเรียนดีประจำปีการศึกษา\n3. ทุนช่วยเหลือค่าครองชีพนักศึกษาขาดแคลนทุนทรัพย์\n\nอ่านรายละเอียดคุณสมบัติและดาวน์โหลดแบบฟอร์มสมัครได้ที่ฝ่ายกิจการนักศึกษา อาคาร 1 ชั้น 1 ครับ'
          }
        ]);
        setQuickReplies(['ขั้นตอนผ่อนผันค่าเทอม', 'ติดต่อฝ่ายการเงิน']);
      }

      // 6. Specific quick replies: ปฏิทินการศึกษา
      else if (cleanText.includes('ปฏิทินการศึกษา') || cleanText.includes('ปฏิทิน')) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: '📅 ปฏิทินการศึกษาประจำปีการศึกษาปัจจุบันครับ (รวมวันลงทะเบียน วันสอบกลางภาค/ปลายภาค วันสุดท้ายในการดรอปเรียน):',
            downloadLink: {
              title: 'ปฏิทินวิชาการประจำปีการศึกษา.pdf',
              url: 'https://reg.cs-helpdesk.ac.th/academic-calendar.pdf'
            }
          }
        ]);
        setQuickReplies(['[งานทะเบียน]', 'ติดต่อฝ่ายทะเบียน']);
      }

      // 7. Contact Registrars / Finance
      else if (cleanText.includes('ติดต่อ') || cleanText.includes('ติดต่อฝ่ายทะเบียน') || cleanText.includes('ติดต่อฝ่ายการเงิน')) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: '📞 ช่องทางการติดต่อหน่วยงานการศึกษา:\n\n• **ฝ่ายทะเบียนกลาง**: อาคารบริหาร ชั้น 1 โทร. 02-123-4567 ต่อ 11\n• **ฝ่ายการเงิน/ชำระเงิน**: อาคารบริหาร ชั้น 2 โทร. 02-123-4567 ต่อ 12\n• **ฝ่ายกิจการนักศึกษา (ผ่อนผัน/ทุน)**: อาคาร 1 ชั้น 1 โทร. 02-123-4567 ต่อ 13\n\nอีเมลประสานงาน: register@helpdesk.ac.th\nเปิดทำการวันจันทร์ - ศุกร์ 08:30 - 16:30 น. เว้นวันหยุดนักขัตฤกษ์'
          }
        ]);
        setQuickReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]']);
      }

      // 8. Helpdesk Search Integration
      else if (cleanText.includes('mongodb') || cleanText.includes('java') || cleanText.includes('react') || cleanText.includes('nestjs') || cleanText.includes('error') || cleanText.includes('กระทู้')) {
        try {
          let queryKeyword = '';
          if (cleanText.includes('mongodb')) queryKeyword = 'mongodb';
          else if (cleanText.includes('java')) queryKeyword = 'java';
          else if (cleanText.includes('react')) queryKeyword = 'react';
          else if (cleanText.includes('nestjs')) queryKeyword = 'nestjs';
          else if (cleanText.includes('error')) queryKeyword = 'error';

          const response = await axios.get(`http://localhost:5000/api/questions?q=${queryKeyword}`);
          const threads = response.data;

          if (threads.length > 0) {
            const listText = threads.map((t, idx) => `${idx + 1}. **${t.title}** (โดย ${t.author.name})`).join('\n');
            setMessages(prev => [
              ...prev,
              { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: `ผมพบกระทู้เกี่ยวกับการเรียนในเรื่อง "${queryKeyword}" บนเว็บบอร์ด CS Helpdesk ด้วยครับ:\n\n${listText}\n\nคลิกลิงก์ด้านล่างเพื่อเข้าไปศึกษาเพิ่มเติมได้เลยครับ:`,
                searchResults: threads
              }
            ]);
          } else {
            setMessages(prev => [
              ...prev,
              { id: Date.now() + 1, sender: 'bot', text: `ผมลองค้นหาหัวข้อการเรียนเรื่อง "${queryKeyword}" บนเว็บบอร์ดช่วยเหลือแล้ว แต่ยังไม่พบกระทู้ที่ตรงกันเลยครับ` }
            ]);
          }
        } catch (err) {
          console.error(err);
          setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'bot', text: 'ขออภัยด้วยครับ ระบบดึงข้อมูลเว็บบอร์ดขัดข้องชั่วคราว ลองปรึกษาเรื่องทะเบียนเรียนดูนะครับ' }
          ]);
        }
        setQuickReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]']);
      }

      // Fallback
      else {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'ขออภัยด้วยครับ ผมอาจจะไม่เข้าใจประโยคดังกล่าว หากต้องการข้อมูลด่วน สามารถพิมพ์หัวข้อสั้นๆ หรือตรวจสอบจากปุ่มตัวเลือกด้านล่างได้เลยนะครับ 🥺' }
        ]);
        setQuickReplies(['[งานทะเบียน]', '[ค่าเทอม/การเงิน]', '[ผ่อนผันการชำระ]']);
      }
    }, 1000);
  };

  const handleRegularOption = () => {
    handleSendMessage('ค่าเทอมภาคปกติ');
  };

  const handleSpecialOption = () => {
    handleSendMessage('ค่าเทอมภาคพิเศษ');
  };

  const handleScholarshipOption = () => {
    handleSendMessage('ทุนการศึกษา');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 relative group cursor-pointer"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold">1</span>
          </span>
          <div className="absolute right-16 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
            ปรึกษางานทะเบียน & การเงิน
          </div>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="w-[380px] h-[580px] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-slide-in relative">
          
          {/* Header */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500 cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              
              <AcademicLogo />
              
              <div>
                <div className="font-extrabold text-gray-800 text-base leading-tight tracking-tight">ระบบบริการการศึกษา</div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">เจ้าหน้าที่ทะเบียนจำลอง (AI)</span>
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
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1.5">
                
                {/* Bot Message */}
                {msg.sender === 'bot' && (
                  <div className="flex gap-2 items-end max-w-[85%]">
                    {/* Bot Logo */}
                    {!msg.isMascot && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 select-none bg-blue-800">
                        A
                      </div>
                    )}
                    
                    {/* Mascot Sticker */}
                    {msg.isMascot && (
                      <MascotAssistant />
                    )}

                    {/* Educational Program Carousel */}
                    {msg.isEduCarousel && (
                      <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide snap-x w-[300px]">
                        
                        {/* ภาคปกติ Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100">
                            <RegularIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-gray-800">หลักสูตรภาคปกติ</div>
                              <div className="text-[10px] text-blue-600 font-bold mt-1">18,000 บ./ภาคเรียน</div>
                            </div>
                            <button
                              onClick={handleRegularOption}
                              className="mt-2 w-full py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-[10px] transition border border-blue-200"
                            >
                              อ่านรายละเอียด
                            </button>
                          </div>
                        </div>

                        {/* ภาคพิเศษ Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100">
                            <SpecialIcon />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-gray-800">หลักสูตรภาคพิเศษ</div>
                              <div className="text-[10px] text-purple-600 font-bold mt-1">28,000 บ./ภาคเรียน</div>
                            </div>
                            <button
                              onClick={handleSpecialOption}
                              className="mt-2 w-full py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded text-[10px] transition border border-purple-200"
                            >
                              อ่านรายละเอียด
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
                              <div className="text-xs font-extrabold text-gray-800">ทุนการศึกษา / กยศ.</div>
                              <div className="text-[10px] text-amber-600 font-bold mt-1">สนับสนุนเต็มจำนวน</div>
                            </div>
                            <button
                              onClick={handleScholarshipOption}
                              className="mt-2 w-full py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded text-[10px] transition border border-amber-200"
                            >
                              สอบถามทุน
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Standard Text Bubble */}
                    {msg.text && (
                      <div className="bg-gray-200/80 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                        {msg.text}
                        
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
                                🔗 กระทู้: {t.title}
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
                      className={`rounded-2xl rounded-br-none px-4 py-2 text-xs leading-relaxed font-semibold text-white max-w-[80%] shadow-sm ${
                        msg.text.startsWith('[') 
                          ? 'bg-purple-600' // Purple for categories
                          : 'bg-blue-600' // Blue for inputs/choices
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

          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="bg-gray-50/50 px-4 py-2 flex flex-wrap gap-2 justify-center border-t shrink-0">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="px-4 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-gray-200 rounded-full text-xs font-bold text-gray-600 transition shadow-sm cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="bg-white border-t p-3 flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-blue-600">
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                <Plus size={18} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                <Camera size={18} />
              </button>
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                <ImageIcon size={18} />
              </button>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="พิมพ์คำถามทะเบียนหรือค่าเทอม..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />

            <div className="flex items-center gap-1 text-blue-600">
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                <Smile size={18} />
              </button>
              {inputValue.trim() ? (
                <button 
                  type="button" 
                  onClick={() => handleSendMessage(inputValue)}
                  className="p-1 hover:bg-gray-100 rounded-full transition text-blue-600 cursor-pointer"
                >
                  <Send size={18} />
                </button>
              ) : (
                <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                  <ThumbsUp size={18} />
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

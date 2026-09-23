import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Plus, Image as ImageIcon, ArrowLeft, FileText, ExternalLink, PhoneCall, Bot, GraduationCap } from 'lucide-react';
import axios from 'axios';

import militaryDefermentImg from '../assets/images/military_deferment_mju.png';
import accidentInsuranceImg from '../assets/images/accident_insurance_mju.png';

const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

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

// ปุ่มตัวเลือกหลักของระบบ (Quick Replies / Suggestion Chips) ที่ต้องแสดงผลเสมอ
const DEFAULT_QUICK_REPLIES = [
  '[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]',
  '[ค่าเทอม วิทยาการคอมพิวเตอร์]',
  '[ทุนปันน้ำใจพี่ให้น้อง]',
  '[ปฏิทินการศึกษา MJU]',
  '[การขอผ่อนผันทหาร]',
  '[ประกันอุบัติเหตุกลุ่ม]'
];

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
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setIsBotReplying(true);
    setInputValue('');

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
          setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'bot', isMascot: true },
            {
              id: Date.now() + 2,
              sender: 'bot',
              text: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์\n(หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70) มหาวิทยาลัยแม่โจ้\n\nได้รับการออกแบบตามเกณฑ์มาตรฐานอุดมศึกษาฉบับใหม่ เน้นสมรรถนะการปฏิบัติงานจริง (Outcome-Based Education: OBE) และปรับปรุงเนื้อหาให้ทันต่อเทคโนโลยี AI และ Cloud Native\n\nโครงสร้างหลักสูตร (รวมตลอดหลักสูตรไม่น้อยกว่า 120–124 หน่วยกิต):\n\n1️ หมวดวิชาศึกษาทั่วไป (General Education) ไม่น้อยกว่า 24–30 หน่วยกิต\n• กลุ่มทักษะการสื่อสารและภาษา (Thai/English): 6–9 หน่วยกิต\n• กลุ่มทักษะดิจิทัลและการรู้เท่าทันเทคโนโลยี: 6 หน่วยกิต\n• กลุ่มทักษะความเป็นผู้ประกอบการและการคิดเชิงนวัตกรรม: 6 หน่วยกิต\n• กลุ่มการพัฒนาสุขภาวะและความรับผิดชอบต่อสังคม: 6 หน่วยกิต\n\n2️ หมวดวิชาเฉพาะ (Specialized Courses) ไม่น้อยกว่า 84–90 หน่วยกิต\n• กลุ่มวิชาแกน (Core Mathematics & Science): 12–15 หน่วยกิต\n• กลุ่มวิชาเอกบังคับ (Core CS Subjects): 42–45 หน่วยกิต\n• กลุ่มวิชาเอกเลือกตามเส้นทางอาชีพ (Tracks): 18–24 หน่วยกิต\n• กลุ่มวิชาการเรียนรู้เชิงบูรณาการกับการทำงาน (CWIE / Co-op): 6–7 หน่วยกิต\n\n3️ หมวดวิชาเลือกเสรี (Free Electives) ไม่น้อยกว่า 6 หน่วยกิต'
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
          setMessages(prev => [
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
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'แผนการเลือกกลุ่มวิชาชีพเฉพาะทาง (Elective Career Tracks - 18–24 หน่วยกิต):\nนักศึกษาสามารถเลือกมุ่งเน้นตามความถนัดได้ 3–4 เส้นทางหลัก:\n\nTrack 1: AI & Applied Data Intelligence\n• Machine Learning & Deep Learning Implementation\n• Generative AI & Large Language Models Application\n• Data Engineering & Big Data Infrastructure\n• Computer Vision & Natural Language Processing\n\n🔹 Track 2: Full-Stack Software & Cloud Architecture\n• Advanced Web & Mobile Frameworks\n• Cloud Computing & Serverless Architectures\n• API Design & Enterprise Software Engineering\n• UI/UX Engineering & Front-End Performance\n\n🔹 Track 3: Cybersecurity & Defensive Operations\n• Practical Network Security & Cryptography\n• Secure Coding & Vulnerability Assessment\n• Cloud Security & Incident Response\n\nTrack 4: Smart Technology & Agro-Informatics (อัตลักษณ์แม่โจ้)\n• Internet of Things (IoT) & Embedded Systems for Smart Agriculture\n• Spatial Data & Remote Sensing Informatics'
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
          setMessages(prev => [
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
          setMessages(prev => [
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
          setMessages(prev => [
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
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'คุณสมบัติของผู้สมัครขอรับทุนการศึกษา (ต้องมีครบทั้ง 6 ข้อ):\n\n1. เป็นนักศึกษาระดับปริญญาตรีทุกชั้นปี ที่ลงทะเบียนเรียนภาคเรียนที่ 1 ในปีการศึกษา 2569\n2. เป็นนักศึกษาขาดแคลนทุนทรัพย์ในการศึกษา เป็นนักศึกษาที่มีความประพฤติเรียบร้อย และไม่เคยถูกลงโทษทางวินัยนักศึกษา\n3. ไม่เป็นนักศึกษาที่เป็นข้าราชการ พนักงานของรัฐ หรือพนักงานรัฐวิสาหกิจ\n4. นักศึกษาจะต้องไม่ได้รับทุนการศึกษาจากแหล่งทุนอื่น ๆ\n5. มีผลคะแนนเฉลี่ยสะสม (GPAX) รวมทุกรายวิชาเกรดเฉลี่ย 2.00 ขึ้นไป (สำหรับนักศึกษาชั้นปีที่ 1 ให้ใช้ผลการเรียนจากสถาบันการศึกษาเดิม)\n6. เป็นบุตรหรืออยู่ในความอุปการะของลูกค้า (ผู้กู้) ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.) ทั่วประเทศ\n\n**หมายเหตุ**: นักศึกษาต้องมีคุณสมบัติของผู้สมัครขอรับทุนการศึกษา ตามข้อ 1 - 6 ทุกข้อจึงมีสิทธิ์สมัครขอรับทุนการศึกษาดังกล่าวได้ครับ',
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
          setMessages(prev => [
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
          setMessages(prev => [
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
          setMessages(prev => [
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
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'นี่คือรูปภาพประกาศและข้อมูลสำคัญของมหาวิทยาลัยแม่โจ้ครับ:\n\n1. 🪖 **ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569** (ยื่น 21 ก.ย. - 18 ธ.ค. 69)\n2. 🛡️ **ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้** (บมจ.เออร์โกประกันภัย คุ้มครอง 22,000 บ./ครั้ง)',
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
          setMessages(prev => [
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
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569:\n\nมหาวิทยาลัยแม่โจ้จัดทำประกันอุบัติเหตุกลุ่มให้กับนักศึกษาและบุคลากร ร่วมกับ บริษัท เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)\nระยะเวลาคุ้มครอง: 1 มิถุนายน 2569 – 31 พฤษภาคม 2570\n\n**วงเงินความคุ้มครอง**:\n• ค่ารักษาพยาบาลต่ออุบัติเหตุแต่ละครั้ง ตามจ่ายจริงไม่เกิน **22,000 บาท**\n• กรณีเสียชีวิต ทุพพลภาพถาวร หรือสูญเสียอวัยวะเนื่องจากอุบัติเหตุ **180,000 บาท**\n\n**โรงพยาบาลคู่สัญญาใน จ.เชียงใหม่ (ไม่ต้องสำรองจ่าย)**:\n1. โรงพยาบาลเชียงใหม่ราม 1\n2. โรงพยาบาลเชียงใหม่ใกล้หมอ\n3. โรงพยาบาลเทพปัญญา 1\n4. โรงพยาบาลแมคคอร์มิค\n5. โรงพยาบาลราชเวชเชียงใหม่\n6. โรงพยาบาลลานนา\n*(เพียงยื่นบัตรประชาชน แจ้งทำประกันกับ บมจ.เออร์โกประกันภัย กรมธรรม์เลขที่: 260401/P001000250)*\n\n**กรณีเข้ารับการรักษาโรงพยาบาลนอกเครือข่าย**:\nให้สำรองจ่ายเงินไปก่อน แล้วนำหลักฐานมายื่นเบิกได้ที่ **งานอนามัย กองพัฒนานักศึกษา อาคารอำนวย ยศสุข** ในวันและเวลาราชการ\nเอกสารที่ใช้: 1. ใบเสร็จฉบับจริง, 2. ใบรับรองแพทย์ฉบับจริง, 3. สำเนาบัตรประชาชน, 4. สำเนาหน้าสมุดบัญชีธนาคาร (ยกเว้น ออมสิน, ธ.ก.ส., ธอส.)\n\nสอบถามเพิ่มเติมได้ที่ งานอนามัย กองพัฒนานักศึกษา โทร. 0 5387 3075',
              image: {
                url: accidentInsuranceImg,
                alt: 'ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569',
                caption: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้'
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
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'ช่องทางการติดต่อหน่วยงาน มหาวิทยาลัยแม่โจ้:\n\n• **หน่วยทุนการศึกษา งานบริการนักศึกษา**: ชั้น 2 อาคารอำนวย ยศสุข\n• **สำนักบริหารและพัฒนาวิชาการ (งานทะเบียน)**: โทร. 053-873450-4\n• **สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้**\n\nเปิดทำการวันจันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)'
            }
          ]);
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

            const response = await axios.get(`${API_URL}/api/questions?q=${queryKeyword}`);
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
        }

        // Fallback
        else {
          setMessages(prev => [
            ...prev,
            { 
              id: Date.now() + 1, 
              sender: 'bot', 
              text: 'ขออภัยครับ บอทวิชาการยังไม่เข้าใจคำถามนี้\nคุณสามารถสอบถามเกี่ยวกับ:\n• "[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]" (โครงสร้าง 120–124 หน่วยกิต & 4 แทร็กอาชีพ)\n• "[ค่าเทอม วิทยาการคอมพิวเตอร์]" (คณะวิทยาศาสตร์ 20,000 บาท)\n• "[ทุนปันน้ำใจพี่ให้น้อง]" (ทุนต่อเนื่อง/ไม่ต่อเนื่อง)\n• "[ปฏิทินการศึกษา MJU]" (ดาวน์โหลดปฏิทิน ม.แม่โจ้)\n• "ผ่อนผันทหาร" (ประกาศการผ่อนผันเกณฑ์ทหาร ปี 2569 พร้อมรูปภาพ)\n• "ประกันอุบัติเหตุ" (ความคุ้มครอง & รายชื่อโรงพยาบาลคู่สัญญา พร้อมรูปภาพ)\nหรือเลือกคลิกจากปุ่มตัวเลือก 4 ปุ่มด้านล่างได้เลยครับ!' 
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        // ให้ปุ่มตัวเลือก (Quick Replies / Suggestion Chips) ทั้ง 4 ปุ่มนี้ แสดงผลอยู่เสมอที่ท้ายข้อความตอบกลับของบอทในทุกๆ ครั้ง
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
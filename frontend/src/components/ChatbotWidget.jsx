import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Smile, ThumbsUp, Plus, Camera, Image as ImageIcon, Video, ArrowLeft, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// SVGs for the ZWIZ logo, Mascot, and T-Shirts
const ZwizLogo = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md select-none shrink-0" style={{ background: 'linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)' }}>
    <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 30H75L25 70H75" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const MascotRobot = () => (
  <div className="flex flex-col items-center my-3 animate-bounce-slow">
    <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antennas */}
      <path d="M100 40V25" stroke="#FF5E62" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="20" r="6" fill="#FF5E62" />
      {/* Head */}
      <rect x="50" y="40" width="100" height="70" rx="35" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="4" />
      {/* Face Screen */}
      <rect x="65" y="55" width="70" height="40" rx="20" fill="#1F2937" />
      {/* Eyes */}
      <circle cx="85" cy="75" r="5" fill="#10B981" />
      <circle cx="115" cy="75" r="5" fill="#10B981" />
      {/* Blush */}
      <ellipse cx="75" cy="85" rx="5" ry="2.5" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="125" cy="85" rx="5" ry="2.5" fill="#F43F5E" opacity="0.6" />
      {/* Body */}
      <rect x="60" y="110" width="80" height="60" rx="30" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="4" />
      {/* Logo */}
      <circle cx="100" cy="140" r="12" fill="#FF5E62" />
      <path d="M96 136H104L96 144H104" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arms */}
      <rect x="32" y="115" width="16" height="30" rx="8" fill="#D1D5DB" transform="rotate(20 32 115)" />
      <rect x="152" y="115" width="16" height="30" rx="8" fill="#D1D5DB" transform="rotate(-20 152 115)" />
      {/* Holding T-Shirt */}
      <path d="M135 125H165L170 140L160 143L158 135V160H142V135L140 135V160H130V125" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
      <circle cx="147" cy="142" r="5" fill="#FF5E62" />
    </svg>
  </div>
);

const HappyShirtSVG = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H40L45 10H55L60 20H80L85 45L73 48L70 40V85H30V40L27 48L15 45L20 20Z" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="3" />
    <circle cx="50" cy="53" r="18" fill="#FBBF24" />
    <circle cx="43" cy="48" r="2.5" fill="#1F2937" />
    <circle cx="57" cy="48" r="2.5" fill="#1F2937" />
    <path d="M42 58C45 62 55 62 58 58" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SummerShirtSVG = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H35L42 27L50 15L58 27L65 20H80L85 45L73 48L70 40V85H30V40L27 48L15 45L20 20Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="3" />
    <path d="M42 27V42H58V27" stroke="#D1D5DB" strokeWidth="2" />
    <path d="M35 55C35 65 65 65 65 55H35Z" fill="#EF4444" />
    <path d="M32 55C32 68 68 68 68 55H32Z" fill="none" stroke="#10B981" strokeWidth="3" />
    <circle cx="45" cy="58" r="1.2" fill="#111827" />
    <circle cx="50" cy="60" r="1.2" fill="#111827" />
    <circle cx="55" cy="58" r="1.2" fill="#111827" />
  </svg>
);

const HolidayShirtSVG = () => (
  <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H40L45 10H55L60 20H80L85 45L73 48L70 40V85H30V40L27 48L15 45L20 20Z" fill="#FEF3C7" stroke="#D1D5DB" strokeWidth="3" />
    <rect x="44" y="45" width="12" height="18" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
    <path d="M47 43L50 35L53 43" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <rect x="28" y="32" width="10" height="15" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
    <path d="M30 30L33 24L36 30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="62" y="32" width="10" height="15" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
    <path d="M64 30L67 24L70 30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีค่ะ ยินดีต้อนรับสู่ ZWIZ.AI! 🤖' },
    { id: 2, sender: 'bot', text: 'ฉันสามารถแนะนำเสื้อยืดสวยๆ หรือช่วยค้นหากระทู้บนบอร์ด CS Helpdesk ได้นะคะ ลองพิมพ์หรือเลือกหัวข้อด้านล่างได้เลยค่ะ' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [quickReplies, setQuickReplies] = useState(['สนใจเสื้อเชิ้ตค่ะ', 'ค้นหากระทู้ MongoDB']);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on message list change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setQuickReplies([]);

    // Simulate bot thinking
    setTimeout(async () => {
      const cleanText = textToSend.trim().toLowerCase();

      // Flow 1: Interested in shirts (Matches the user uploaded screenshot)
      if (cleanText.includes('สนใจเสื้อเชิ้ต') || cleanText.includes('เสื้อเชิ้ต') || cleanText.includes('ซื้อเสื้อ')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', isSticker: true },
          { id: Date.now() + 2, sender: 'bot', text: 'สวัสดีค่ะ ลูกค้าสนใจรุ่นไหนดีคะ?' },
          { id: Date.now() + 3, sender: 'bot', isCarousel: true }
        ]);
        setQuickReplies(['ตารางไซส์', 'โปรโมชั่น']);
      }
      
      // Flow 2: Selected Summer model
      else if (cleanText.includes('summer') || cleanText.includes('รุ่น summer')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'รุ่น Summer 🍉 เป็นผ้าคอตตอนตัดต่อแบบโปโลอย่างดี ลายแตงโมต้อนรับซัมเมอร์ ราคาเพียง 390 บาทค่ะ! ใส่เที่ยวก็ชิค ใส่เรียนก็เท่ค่ะ' }
        ]);
        setQuickReplies(['ตารางไซส์', 'โปรโมชั่น', 'กลับไปดูเสื้อทั้งหมด']);
      }

      // Flow 3: Selected Happy model
      else if (cleanText.includes('happy') || cleanText.includes('รุ่น happy')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'รุ่น Happy T-Shirt 💛 เสื้อยืดสีขาวสกรีนลายหน้ายิ้มสดใส ผ้าคอตตอน 100% หนานุ่ม ใส่ได้ทุกวัน ราคาเพียง 290 บาทค่ะ' }
        ]);
        setQuickReplies(['ตารางไซส์', 'โปรโมชั่น', 'กลับไปดูเสื้อทั้งหมด']);
      }

      // Flow 4: Selected Holiday model
      else if (cleanText.includes('holiday') || cleanText.includes('รุ่น holiday')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'รุ่น Holiday T-Shirt 🍍 เสื้อยืดสีครีมลายสับปะรดฮอลิเดย์ ผ้าคอตตอนเบาสบายระบายอากาศดีมาก ราคาเพียง 290 บาทค่ะ' }
        ]);
        setQuickReplies(['ตารางไซส์', 'โปรโมชั่น', 'กลับไปดูเสื้อทั้งหมด']);
      }

      // Flow 5: Sizing chart
      else if (cleanText.includes('ตารางไซส์') || cleanText.includes('ไซส์') || cleanText.includes('size')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'ตารางขนาดเสื้อยืด (นิ้ว) ค่ะ:\n\n• ไซส์ S : อก 36 นิ้ว / ยาว 26 นิ้ว\n• ไซส์ M : อก 38 นิ้ว / ยาว 27 นิ้ว\n• ไซส์ L : อก 40 นิ้ว / ยาว 28 นิ้ว\n• ไซส์ XL : อก 44 นิ้ว / ยาว 29 นิ้ว' }
        ]);
        setQuickReplies(['โปรโมชั่น', 'สนใจเสื้อเชิ้ตค่ะ']);
      }

      // Flow 6: Promotions
      else if (cleanText.includes('โปรโมชั่น') || cleanText.includes('ลดราคา') || cleanText.includes('โปร')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: '🎉 โปรโมชั่นพิเศษวันนี้!\n\n• ซื้อเสื้อยืด 2 ตัวขึ้นไป ลดทันที 10%\n• จัดส่งฟรีทั่วประเทศ\n• แถมฟรีสติกเกอร์ ZWIZ ลิมิเต็ด!' }
        ]);
        setQuickReplies(['สนใจเสื้อเชิ้ตค่ะ', 'ตารางไซส์']);
      }

      // Flow 7: Ask to see all shirts again
      else if (cleanText.includes('กลับไปดูเสื้อทั้งหมด')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', isCarousel: true }
        ]);
        setQuickReplies(['ตารางไซส์', 'โปรโมชั่น']);
      }

      // Flow 8: Helpdesk integration search
      else if (cleanText.includes('mongodb') || cleanText.includes('รันไม่ได้') || cleanText.includes('error') || cleanText.includes('java') || cleanText.includes('react') || cleanText.includes('nestjs') || cleanText.includes('กระทู้')) {
        // Query database to fetch matching threads
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
            // Found matching threads!
            const listText = threads.map((t, idx) => `${idx + 1}. **${t.title}** (โดย ${t.author.name})`).join('\n');
            setMessages(prev => [
              ...prev,
              { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: `ฉันค้นหากระทู้ในหัวข้อ "${queryKeyword}" บนบอร์ด CS Helpdesk มาให้แล้วค่ะ:\n\n${listText}\n\nคลิกเพื่อดูรายละเอียดจากลิงก์ด้านล่างได้เลยนะคะ!`,
                searchResults: threads
              }
            ]);
          } else {
            setMessages(prev => [
              ...prev,
              { id: Date.now() + 1, sender: 'bot', text: `ขออภัยค่ะ ฉันค้นหาบนบอร์ด CS Helpdesk แล้วยังไม่พบกระทู้ที่ตรงกับหัวข้อ "${queryKeyword}" เลยค่ะ` }
            ]);
          }
        } catch (err) {
          console.error(err);
          setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'bot', text: 'ขออภัยด้วยค่ะ ระบบเชื่อมต่อฐานข้อมูลกระทู้ขัดข้องชั่วคราว ลองพิมพ์เรื่องอื่นๆ ดูนะคะ' }
          ]);
        }
        setQuickReplies(['สนใจเสื้อเชิ้ตค่ะ', 'โปรโมชั่น']);
      }

      // Fallback response
      else {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: 'ขออภัยค่ะ ฉันไม่เข้าใจคำถามนี้ 🥺 คุณสามารถสอบถามเกี่ยวกับ "เสื้อเชิ้ต", "ตารางไซส์", "โปรโมชั่น" หรือค้นหากระทู้ช่วยเหลือ (เช่น พิมพ์ "ปัญหา MongoDB", "กระทู้ Java") ได้เลยนะคะ!' }
        ]);
        setQuickReplies(['สนใจเสื้อเชิ้ตค่ะ', 'ตารางไซส์', 'โปรโมชั่น']);
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. Chat Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 relative group cursor-pointer"
        >
          <MessageCircle size={28} />
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold">1</span>
          </span>
          {/* Tooltip */}
          <div className="absolute right-16 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
            คุยกับแชทบอท ZWIZ.AI
          </div>
        </button>
      )}

      {/* 2. Chat Drawer Panel (Messenger Mobile Mockup Style) */}
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
              
              <ZwizLogo />
              
              <div>
                <div className="font-extrabold text-gray-800 text-base leading-tight tracking-tight">ZWIZ.AI</div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">แชทบอทระบบเสื้อผ้า & บอร์ด</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full text-purple-600 transition">
                <Video size={20} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1.5">
                
                {/* Bot Message Block */}
                {msg.sender === 'bot' && (
                  <div className="flex gap-2 items-end max-w-[85%]">
                    {/* Bot Avatar */}
                    {!msg.isSticker && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 select-none" style={{ background: 'linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)' }}>
                        Z
                      </div>
                    )}
                    
                    {/* Bot Sticker Item (ZWIZ cute robot) */}
                    {msg.isSticker && (
                      <MascotRobot />
                    )}

                    {/* Bot Carousel Item (Matching Watermelon/Pineapple/Smiley Shirts) */}
                    {msg.isCarousel && (
                      <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide snap-x w-[300px]">
                        
                        {/* Shirt Card 1: Happy */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100 relative">
                            <HappyShirtSVG />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div className="text-xs font-bold text-gray-800">Happy T-Shirt</div>
                            <button
                              onClick={() => handleSendMessage('รุ่น Happy T-Shirt')}
                              className="mt-2 w-full py-1 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 font-semibold rounded text-[10px] transition"
                            >
                              เลือกรุ่นนี้
                            </button>
                          </div>
                        </div>

                        {/* Shirt Card 2: Summer */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100 relative">
                            <SummerShirtSVG />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div className="text-xs font-bold text-gray-800">Summer T-Shirt</div>
                            <button
                              onClick={() => handleSendMessage('รุ่น Summer')}
                              className="mt-2 w-full py-1 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 font-semibold rounded text-[10px] transition"
                            >
                              เลือกรุ่นนี้
                            </button>
                          </div>
                        </div>

                        {/* Shirt Card 3: Holiday */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 w-36 snap-start flex flex-col">
                          <div className="h-32 bg-gray-100 relative">
                            <HolidayShirtSVG />
                          </div>
                          <div className="p-2.5 text-center flex-1 flex flex-col justify-between">
                            <div className="text-xs font-bold text-gray-800">Holiday T-Shirt</div>
                            <button
                              onClick={() => handleSendMessage('รุ่น Holiday')}
                              className="mt-2 w-full py-1 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 font-semibold rounded text-[10px] transition"
                            >
                              เลือกรุ่นนี้
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Standard Bot Text Bubble */}
                    {msg.text && (
                      <div className="bg-gray-200/80 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                        {msg.text}
                        
                        {/* Search Results (Link click helper) */}
                        {msg.searchResults && (
                          <div className="mt-3 space-y-1.5 border-t pt-2 border-gray-300/40">
                            {msg.searchResults.map((t) => (
                              <button
                                key={t._id}
                                onClick={() => {
                                  navigate(`/question/${t._id}`);
                                  setIsOpen(false); // Close chatbot upon navigation
                                }}
                                className="block text-[11px] font-bold text-blue-600 hover:underline text-left w-full truncate"
                              >
                                🔗 {t.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* User Message Block */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div 
                      className={`rounded-2xl rounded-br-none px-4 py-2 text-xs leading-relaxed font-semibold text-white max-w-[80%] shadow-sm ${
                        msg.text.includes('รุ่น Summer') || msg.text.includes('ตารางไซส์') || msg.text.includes('โปรโมชั่น')
                          ? 'bg-blue-500' // Blue bubble for choices
                          : 'bg-purple-500' // Purple bubble for start ("สนใจเสื้อเชิ้ตค่ะ")
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

          {/* Quick Replies section */}
          {quickReplies.length > 0 && (
            <div className="bg-gray-50/50 px-4 py-2 flex flex-wrap gap-2 justify-center border-t shrink-0">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="px-4 py-1.5 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-gray-200 rounded-full text-xs font-bold text-gray-600 transition shadow-sm cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="bg-white border-t p-3 flex items-center gap-2 shrink-0">
            {/* Left Icons */}
            <div className="flex items-center gap-1.5 text-blue-600">
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

            {/* Input Bar */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="พิมพ์ข้อความที่นี่..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />

            {/* Right Icons */}
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

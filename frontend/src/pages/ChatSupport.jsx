import { useState } from 'react';
import { Image, Mic, Smile, Menu, MessageCircle, Send } from 'lucide-react';

export default function ChatSupport() {
  const userName = "Wannapa"; 

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีค่ะ ยินดีต้อนรับ สอบถามปัญหาหรือแจ้งซ่อมได้เลยค่าา' }
  ]);

  const [hasStarted, setHasStarted] = useState(false);
  const [inputText, setInputText] = useState("");

  // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม Get Started
  const handleGetStarted = () => {
    setHasStarted(true);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: 'Get Started' }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: `สวัสดีค่ะ K. ${userName} สอบถามหรือแจ้งปัญหา แคปรูปภาพส่งมาได้เลยค่า` 
      }]);
    }, 500);
  };

  // ฟังก์ชันเมื่อกดคลิกปุ่ม Quick Replies (เช่น "แจ้งปัญหา", "ดูสถานะ")
  const handleQuickReply = (replyText) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: replyText }]);

    setTimeout(() => {
      let botResponse = "รับทราบค่ะ กรุณารอสักครู่นะคะ ระบบกำลังดำเนินการให้ค่ะ";
      if (replyText === "แจ้งปัญหา") {
        botResponse = "รบกวนพิมพ์รายละเอียดปัญหาหรือแนบรูปภาพหน้าจอ Error ให้หน่อยนะคะ";
      } else if (replyText === "ดูสถานะ") {
        botResponse = "คุณสามารถตรวจสอบสถานะกระทู้และงานซ่อมได้ที่หน้าหลักของเว็บไซต์เลยค่ะ";
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: botResponse 
      }]);
    }, 600);
  };

  // ฟังก์ชันพิมพ์ข้อความส่งเอง
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputText("");

    // จำลองบอทตอบกลับตามข้อความที่พิมพ์
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: `แอดมินได้รับข้อความ "${userMsg}" เรียบร้อยแล้วค่ะ จะรีบตรวจสอบให้นะคะ!` 
      }]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {/* กรอบโทรศัพท์จำลอง */}
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-gray-200 flex flex-col h-[700px]">
        
        {/* Header แชท */}
        <div className="bg-white border-b px-4 py-3 flex flex-col items-center pt-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-2">
            <MessageCircle className="text-white w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">CS Helpdesk Support</h2>
          <p className="text-xs text-gray-500">Typically replies within minutes</p>
          <button className="mt-3 px-4 py-1 text-xs font-semibold bg-gray-100 rounded-full hover:bg-gray-200 transition">
            VIEW PROFILE
          </button>
        </div>

        {/* พื้นที่แชท */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          <div className="text-center text-xs text-gray-400 my-4">11:27 AM</div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-4 py-2 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-gray-200 text-gray-800 rounded-2xl rounded-tl-sm border border-gray-300'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* ปุ่ม Get Started (จะหายไปเมื่อกดแล้ว) */}
          {!hasStarted && (
            <div className="flex justify-end">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* ส่วนท้าย: Quick Replies และ ช่องพิมพ์ */}
        <div className="bg-white border-t pb-2">
          
          {/* Quick Replies (ปุ่มตัวเลือกด่วน เมื่อกด Get Started แล้วจะแสดงขึ้นมา) */}
          {hasStarted && (
             <div className="flex justify-end gap-2 p-2 border-b bg-gray-50">
               <button 
                 onClick={() => handleQuickReply("แจ้งปัญหา")}
                 className="px-4 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-full text-xs font-semibold shadow-sm hover:bg-blue-50 transition"
               >
                 แจ้งปัญหา
               </button>
               <button 
                 onClick={() => handleQuickReply("ดูสถานะ")}
                 className="px-4 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-full text-xs font-semibold shadow-sm hover:bg-blue-50 transition"
               >
                 ดูสถานะ
               </button>
             </div>
          )}

          {/* ฟอร์มช่องพิมพ์ข้อความ */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 px-3 py-2 text-blue-600">
            <Menu className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
            <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">GIF</div>
            <Image className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
            <Mic className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
            
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 flex items-center justify-between">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Aa"
                className="bg-transparent text-sm w-full outline-none text-gray-700"
              />
              <Smile className="w-5 h-5 text-blue-600 cursor-pointer" />
            </div>

            {inputText.trim() && (
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
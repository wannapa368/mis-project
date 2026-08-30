import { useState } from 'react';
import { Image, Mic, Smile, Menu, MessageCircle } from 'lucide-react';

export default function ChatSupport() {
  // 1. ดึงชื่อ User จากระบบ (จำลองว่าล็อกอินเข้ามาแล้ว)
  const userName = "Wannapa"; 

  // 2. State เก็บประวัติการแชท
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีค่ะ ยินดีต้อนรับ สอบถามปัญหาหรือแจ้งซ่อมได้เลยค่าา' }
  ]);

  // State สำหรับเช็คว่ากดปุ่มเริ่มต้นหรือยัง
  const [hasStarted, setHasStarted] = useState(false);

  // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม Get Started
  const handleGetStarted = () => {
    setHasStarted(true);
    // เพิ่มข้อความฝั่งผู้ใช้
    setMessages(prev => [...prev, { id: 2, sender: 'user', text: 'Get Started' }]);
    
    // หน่วงเวลา 0.5 วินาทีให้ดูเหมือนบอทกำลังพิมพ์ แล้วตอบกลับพร้อมดึงชื่อ userName มาใช้
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: 3, 
        sender: 'bot', 
        text: `สวัสดีค่ะ K. ${userName} สอบถามหรือแจ้งปัญหา แคปรูปภาพส่งมาได้เลยค่า` 
      }]);
    }, 500);
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
          <button className="mt-3 px-4 py-1 text-xs font-semibold bg-gray-100 rounded-full">
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
                    : 'bg-gray-200 text-gray-800 rounded-2xl rounded-tl-sm border border-red-500/30' // ใส่ border แดงให้เหมือนในรูป
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
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* ส่วนท้าย: Quick Replies และ ช่องพิมพ์ */}
        <div className="bg-white border-t pb-6">
          
          {/* Quick Replies (ปุ่มตัวเลือกด่วน) */}
          {hasStarted && (
             <div className="flex justify-end gap-2 p-3 border-b border-red-500/30">
               <button className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50">
                 แจ้งปัญหา
               </button>
               <button className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50">
                 ดูสถานะ
               </button>
             </div>
          )}

          {/* แถบเครื่องมือด้านล่างสุด */}
          <div className="flex items-center gap-3 px-4 py-3 text-blue-600">
            <Menu className="w-6 h-6" />
            <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 rounded">GIF</div>
            <Image className="w-6 h-6" />
            <Mic className="w-6 h-6" />
            
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Aa</span>
              <Smile className="w-5 h-5 text-blue-600" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
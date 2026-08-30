import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic, Link, Image, Code, ArrowLeft, Loader2, X, Plus } from 'lucide-react';
import axios from 'axios';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

export default function CreateQuestion({ currentUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');

  // Auto suggest tags when title or body changes (with a debounce)
  useEffect(() => {
    if (!title && !body) {
      setSuggestedTags([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const response = await axios.post(`${API_URL}/api/ai-suggest-tags`, { title, body });
        // Filter out tags that are already selected
        const newSuggestions = response.data.tags.filter(t => !tags.includes(t));
        setSuggestedTags(newSuggestions);
      } catch (err) {
        console.error('Failed to fetch AI suggested tags', err);
      } finally {
        setIsSuggesting(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [title, body, tags]);

  const handleAddTag = (tagToAdd) => {
    const cleanTag = tagToAdd.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setSuggestedTags(suggestedTags.filter(t => t !== cleanTag));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleToolbarClick = (type) => {
    const textarea = document.getElementById('body-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'ตัวหนา'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'ตัวเอียง'}*`;
        break;
      case 'link':
        replacement = `[${selectedText || 'ลิงก์'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'คำอธิบายรูป'}](https://image-url.com)`;
        break;
      case 'code':
        replacement = `\n\`\`\`javascript\n${selectedText || '// วางโค้ดของคุณที่นี่'}\n\`\`\`\n`;
        break;
      default:
        return;
    }

    const newBody = text.substring(0, start) + replacement + text.substring(end);
    setBody(newBody);
    
    // Focus back on textarea after state updates
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณากรอกหัวข้อคำถาม');
      return;
    }
    if (!body.trim()) {
      setError('กรุณากรอกรายละเอียดคำถาม');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/questions`, {
        title,
        body,
        tags,
        author: currentUser
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึกคำถาม กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="text-gray-600" />
          </button>
          <div className="text-lg font-bold text-gray-900">กลับสู่หน้าแรก</div>
        </div>
      </header>

      {/* Main Form container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">ตั้งคำถามใหม่</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                หัวข้อคำถามของคุณคืออะไร?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น รัน MongoDB ไม่ขึ้นครับ Error connection refused"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg font-medium"
              />
            </div>

            {/* Toolbar & Body */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                รายละเอียดปัญหาหรือโค้ด
              </label>
              
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-gray-50 border border-b-0 rounded-t-xl text-gray-600">
                <button
                  type="button"
                  onClick={() => handleToolbarClick('bold')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="ตัวหนา"
                >
                  <Bold size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleToolbarClick('italic')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="ตัวเอียง"
                >
                  <Italic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleToolbarClick('link')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="แทรกลิงก์"
                >
                  <Link size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleToolbarClick('image')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="แนบรูปภาพ"
                >
                  <Image size={18} />
                </button>
                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => handleToolbarClick('code')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition flex items-center gap-1 font-semibold text-xs"
                  title="แทรก Code Block"
                >
                  <Code size={18} /> แทรก Code Block
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="body-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="อธิบายปัญหาที่คุณพบอย่างละเอียด และวางโค้ดที่เกี่ยวข้องเพื่อความรวดเร็วในการช่วยเหลือ..."
                rows={12}
                className="w-full p-4 border rounded-b-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm leading-relaxed"
              />
            </div>

            {/* Tags Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                แท็กป้ายกำกับ (Tags)
              </label>

              {/* Selected Tags list */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:bg-blue-100 rounded-full p-0.5">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Tag */}
              <div className="flex gap-2 max-w-sm mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(newTag))}
                  placeholder="พิมพ์แท็กใหม่แล้วกด Enter..."
                  className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(newTag)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border rounded-lg text-sm flex items-center gap-1 text-gray-700"
                >
                  <Plus size={16} /> เพิ่ม
                </button>
              </div>

              {/* AI Tag Suggestion box */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                  <span>AI แนะนำ:</span>
                  {isSuggesting && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Loader2 size={12} className="animate-spin" /> กำลังประมวลผลหมวดหมู่...
                    </span>
                  )}
                </div>
                
                {suggestedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="px-3 py-1 bg-white hover:bg-green-50 hover:text-green-700 hover:border-green-300 border rounded-lg text-xs font-medium text-gray-600 transition flex items-center gap-1"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">
                    {!title && !body ? 'พิมพ์หัวข้อหรือรายละเอียดคำถามเพื่อให้ AI แนะนำแท็กที่เหมาะสม' : 'ยังไม่มีแท็กแนะนำเพิ่มเติม'}
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition"
              >
                โพสต์คำถาม
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
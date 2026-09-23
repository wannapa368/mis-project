import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic, Link, Image, Code, ArrowLeft, Loader2, X, Plus, Sparkles, Send } from 'lucide-react';
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

  const toolbarButtons = [
    { type: 'bold', icon: Bold, title: 'ตัวหนา' },
    { type: 'italic', icon: Italic, title: 'ตัวเอียง' },
    { type: 'link', icon: Link, title: 'แทรกลิงก์' },
    { type: 'image', icon: Image, title: 'แนบรูปภาพ' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="glass sticky top-0 z-30 border-b border-slate-200/70">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="กลับสู่หน้าแรก"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-slate-900">กลับสู่หน้าแรก</div>
            <div className="text-[11px] text-slate-500">CS Helpdesk · มหาวิทยาลัยแม่โจ้</div>
          </div>
        </div>
      </header>

      {/* Main Form container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6 animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">ตั้งคำถามใหม่</h1>
          <p className="text-sm text-slate-500 mt-1.5">อธิบายปัญหาให้ชัดเจน แนบโค้ดที่เกี่ยวข้อง แล้วให้ AI ช่วยแนะนำแท็กที่เหมาะสม</p>
        </div>

        <div className="card p-6 sm:p-8 animate-fade-up">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 flex items-center gap-2">
              <X size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                หัวข้อคำถามของคุณคืออะไร?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น รัน MongoDB ไม่ขึ้นครับ Error connection refused"
                className="input-field text-base font-medium py-3"
              />
            </div>

            {/* Toolbar & Body */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                รายละเอียดปัญหาหรือโค้ด
              </label>

              <div className="rounded-xl border border-slate-200 overflow-hidden transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10">
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200 text-slate-500">
                  {toolbarButtons.map(({ type, icon: Icon, title: buttonTitle }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToolbarClick(type)}
                      className="p-2 hover:bg-white hover:text-slate-800 hover:shadow-sm rounded-lg transition cursor-pointer"
                      title={buttonTitle}
                    >
                      <Icon size={17} />
                    </button>
                  ))}
                  <div className="w-px h-5 bg-slate-200 mx-1.5"></div>
                  <button
                    type="button"
                    onClick={() => handleToolbarClick('code')}
                    className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg transition flex items-center gap-1.5 font-semibold text-xs cursor-pointer"
                    title="แทรก Code Block"
                  >
                    <Code size={15} /> แทรก Code Block
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  id="body-textarea"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="อธิบายปัญหาที่คุณพบอย่างละเอียด และวางโค้ดที่เกี่ยวข้องเพื่อความรวดเร็วในการช่วยเหลือ..."
                  rows={12}
                  className="block w-full p-4 bg-white focus:outline-none font-mono text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 resize-y"
                />
              </div>
            </div>

            {/* Tags Area */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                แท็กป้ายกำกับ (Tags)
              </label>

              {/* Selected Tags list */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 pl-3 pr-1.5 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded-full border border-brand-200 animate-fade-up">
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:bg-brand-100 rounded-full p-0.5 cursor-pointer" title="ลบแท็ก">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Custom Tag */}
              <div className="flex gap-2 max-w-sm mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(newTag))}
                  placeholder="พิมพ์แท็กใหม่แล้วกด Enter..."
                  className="input-field py-2"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(newTag)}
                  className="btn-ghost shrink-0"
                >
                  <Plus size={16} /> เพิ่ม
                </button>
              </div>

              {/* AI Tag Suggestion box */}
              <div className="rounded-xl p-4 border border-violet-100 bg-gradient-to-br from-violet-50/80 to-brand-50/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 mb-2.5">
                  <Sparkles size={14} />
                  <span>AI แนะนำ</span>
                  {isSuggesting && (
                    <span className="flex items-center gap-1 text-brand-600 font-medium">
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
                        className="px-3 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Plus size={12} /> {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">
                    {!title && !body ? 'พิมพ์หัวข้อหรือรายละเอียดคำถามเพื่อให้ AI แนะนำแท็กที่เหมาะสม' : 'ยังไม่มีแท็กแนะนำเพิ่มเติม'}
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-ghost px-6 py-2.5"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2.5"
              >
                <Send size={15} /> โพสต์คำถาม
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bold, Italic, Link, Image, Code, ArrowLeft, Loader2, X, Plus, Sparkles, Send,
  SquarePen, Hash, Lightbulb, Eye, Check, Search, CircleDashed, Tags,
} from 'lucide-react';
import axios from 'axios';
import Avatar from '../components/Avatar';
import { tagClass } from '../lib/tags';
import { loadQuestions, invalidateForumCache } from '../lib/forumCache';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

const MAX_TITLE = 150;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;
// แท็กยอดฮิตที่แสดงในแถบด้านซ้ายของหน้าแรก (ให้เลือกได้เสมอ แม้ยังไม่มีกระทู้ใช้)
const HOT_TAGS = ['Curriculum', 'Java', 'Database', 'Error', 'NestJS', 'React'];

// "  #React Native " -> "React-Native"
function normalizeTag(raw) {
  return raw.trim().replace(/^#+/, '').replace(/\s+/g, '-').slice(0, MAX_TAG_LENGTH);
}

function StepHeader({ number, title, hint, done }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
          done ? 'bg-emerald-500 text-white' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
        }`}
      >
        {done ? <Check size={14} /> : number}
      </span>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}

export default function CreateQuestion({ currentUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [tagQuery, setTagQuery] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [boardQuestions, setBoardQuestions] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // โหลดแท็กที่มีอยู่ในระบบจากกระทู้ทั้งหมด (ใช้ cache เดียวกับหน้ารวมกระทู้)
  useEffect(() => {
    let cancelled = false;
    loadQuestions({})
      .then((data) => { if (!cancelled) setBoardQuestions(data); })
      .catch((err) => console.error('Failed to load existing tags', err))
      .finally(() => { if (!cancelled) setTagsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // แท็กที่มีอยู่ พร้อมจำนวนกระทู้ที่ใช้ เรียงจากมากไปน้อย
  const existingTags = useMemo(() => {
    const counts = new Map(HOT_TAGS.map((t) => [t, 0]));
    for (const q of boardQuestions) {
      for (const t of q.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [boardQuestions]);

  // Auto suggest tags when title or body changes (with a debounce)
  useEffect(() => {
    if (!title && !body) return;

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

  // ซ่อนคำแนะนำเมื่อยังไม่ได้พิมพ์อะไร (แทนการล้าง state ใน effect)
  const visibleSuggestions = title || body ? suggestedTags : [];

  const hasTag = (tag) => tags.some(t => t.toLowerCase() === tag.toLowerCase());

  const handleAddTag = (tagToAdd) => {
    const cleanTag = normalizeTag(tagToAdd);
    if (!cleanTag || hasTag(cleanTag)) {
      setTagQuery('');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setError(`เลือกแท็กได้สูงสุด ${MAX_TAGS} แท็ก`);
      return;
    }
    // ถ้าตรงกับแท็กที่มีอยู่ (ไม่สนตัวพิมพ์เล็ก/ใหญ่) ให้ใช้ชื่อเดิม เพื่อไม่ให้เกิดแท็กซ้ำ เช่น react / React
    const existing = existingTags.find(t => t.name.toLowerCase() === cleanTag.toLowerCase());
    const finalTag = existing ? existing.name : cleanTag;
    setTags([...tags, finalTag]);
    setSuggestedTags(suggestedTags.filter(t => t !== finalTag));
    setTagQuery('');
    setError('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleTag = (tag) => (hasTag(tag) ? handleRemoveTag(tag) : handleAddTag(tag));

  const normalizedQuery = normalizeTag(tagQuery);
  const filteredExisting = existingTags.filter(t =>
    !normalizedQuery || t.name.toLowerCase().includes(normalizedQuery.toLowerCase())
  );
  const canCreateTag =
    normalizedQuery && !existingTags.some(t => t.name.toLowerCase() === normalizedQuery.toLowerCase()) && !hasTag(normalizedQuery);

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

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/questions`, {
        title,
        body,
        tags,
        author: currentUser
      });
      invalidateForumCache();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึกคำถาม กรุณาลองใหม่อีกครั้ง');
      setSubmitting(false);
    }
  };

  const toolbarButtons = [
    { type: 'bold', icon: Bold, title: 'ตัวหนา' },
    { type: 'italic', icon: Italic, title: 'ตัวเอียง' },
    { type: 'link', icon: Link, title: 'แทรกลิงก์' },
    { type: 'image', icon: Image, title: 'แนบรูปภาพ' },
  ];

  const steps = [!!title.trim(), !!body.trim(), tags.length > 0];
  const completed = steps.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="glass sticky top-0 z-30 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 text-white p-6 sm:p-8 mb-6 shadow-lg shadow-brand-600/20 animate-fade-up">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-16 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
              <SquarePen size={26} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">ตั้งคำถามใหม่</h1>
              <p className="text-sm text-white/80 mt-1">อธิบายปัญหาให้ชัดเจน แนบโค้ดที่เกี่ยวข้อง แล้วติดแท็กให้เพื่อน ๆ และอาจารย์หาเจอง่าย</p>
            </div>
            <div className="sm:w-44">
              <div className="flex justify-between text-xs font-semibold text-white/90 mb-1.5">
                <span>ความคืบหน้า</span>
                <span>{completed}/3</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${(completed / 3) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 sm:p-8 space-y-8 animate-fade-up">
            {error && (
              <div className="px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                <X size={16} className="shrink-0" /> {error}
              </div>
            )}

            {/* 1. Title */}
            <section>
              <StepHeader number={1} title="หัวข้อคำถามของคุณคืออะไร?" hint="สรุปปัญหาให้สั้นและเจาะจง คนอ่านจะเข้าใจได้ทันที" done={steps[0]} />
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  maxLength={MAX_TITLE}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น รัน MongoDB ไม่ขึ้นครับ Error connection refused"
                  className="input-field text-base font-medium py-3 pr-16"
                />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] tabular-nums ${title.length > MAX_TITLE - 20 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {title.length}/{MAX_TITLE}
                </span>
              </div>
            </section>

            {/* 2. Toolbar & Body */}
            <section>
              <StepHeader number={2} title="รายละเอียดปัญหาหรือโค้ด" hint="บอกสิ่งที่ลองทำไปแล้ว ผลที่คาดหวัง และ error ที่เจอ" done={steps[1]} />
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
                  <span className="ml-auto text-[11px] text-slate-400 tabular-nums pr-1 hidden sm:block">{body.length} ตัวอักษร</span>
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
            </section>

            {/* 3. Tags */}
            <section>
              <StepHeader
                number={3}
                title="แท็กป้ายกำกับ (Tags)"
                hint={`เลือกแท็กที่มีอยู่ หรือสร้างแท็กใหม่ได้สูงสุด ${MAX_TAGS} แท็ก`}
                done={steps[2]}
              />

              {/* Selected Tags */}
              <div className="flex flex-wrap items-center gap-2 min-h-11 p-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 mb-4">
                {tags.length === 0 && (
                  <span className="text-xs text-slate-400 px-1">ยังไม่ได้เลือกแท็ก · กดเลือกจากด้านล่างได้เลย</span>
                )}
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 pl-3 pr-1.5 py-1 bg-brand-600 text-white text-sm font-medium rounded-full shadow-sm shadow-brand-600/20 animate-fade-up">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer" title="ลบแท็ก">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <span className="ml-auto text-[11px] text-slate-400 tabular-nums pr-1">{tags.length}/{MAX_TAGS}</span>
              </div>

              {/* Search / create tag */}
              <div className="relative mb-3">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={tagQuery}
                  onChange={(e) => setTagQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(tagQuery))}
                  placeholder="ค้นหาแท็กที่มีอยู่ หรือพิมพ์ชื่อแท็กใหม่แล้วกด Enter..."
                  disabled={tags.length >= MAX_TAGS}
                  className="input-field pl-10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {canCreateTag && tags.length < MAX_TAGS && (
                <button
                  type="button"
                  onClick={() => handleAddTag(tagQuery)}
                  className="w-full mb-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-brand-200 bg-brand-50/60 hover:bg-brand-50 text-sm text-brand-700 transition cursor-pointer animate-fade-up"
                >
                  <Plus size={16} />
                  <span>สร้างแท็กใหม่ <strong className="font-semibold">#{normalizedQuery}</strong></span>
                  <kbd className="ml-auto text-[10px] font-semibold text-brand-600 bg-white border border-brand-200 rounded px-1.5 py-0.5">Enter</kbd>
                </button>
              )}

              {/* Existing tags */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-3">
                  <Tags size={14} className="text-slate-400" />
                  <span>แท็กที่มีอยู่ในระบบ</span>
                  {tagsLoading && <Loader2 size={12} className="animate-spin text-slate-400" />}
                  <span className="ml-auto font-normal text-slate-400">ตัวเลข = จำนวนกระทู้ที่ใช้แท็กนี้</span>
                </div>
                {filteredExisting.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredExisting.map(({ name, count }) => {
                      const selected = hasTag(name);
                      return (
                        <button
                          type="button"
                          key={name}
                          onClick={() => toggleTag(name)}
                          disabled={!selected && tags.length >= MAX_TAGS}
                          className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-lg text-xs font-medium border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            selected
                              ? 'bg-brand-600 border-brand-600 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                          }`}
                        >
                          {selected ? <Check size={12} /> : <Hash size={12} className="text-slate-400" />}
                          {name}
                          <span className={`text-[10px] tabular-nums rounded px-1 ${selected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Search size={12} /> ไม่พบแท็กที่ตรงกับ “{tagQuery}” กด Enter เพื่อสร้างแท็กใหม่
                  </p>
                )}
              </div>

              {/* AI Tag Suggestion box */}
              <div className="mt-3 rounded-xl p-4 border border-violet-100 bg-gradient-to-br from-violet-50/80 to-brand-50/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 mb-2.5">
                  <Sparkles size={14} />
                  <span>AI แนะนำจากเนื้อหาของคุณ</span>
                  {isSuggesting && (
                    <span className="flex items-center gap-1 text-brand-600 font-medium">
                      <Loader2 size={12} className="animate-spin" /> กำลังประมวลผลหมวดหมู่...
                    </span>
                  )}
                </div>

                {visibleSuggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visibleSuggestions.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        disabled={tags.length >= MAX_TAGS}
                        className="px-3 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition flex items-center gap-1 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
            </section>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <span className="sm:mr-auto text-xs text-slate-400 flex items-center gap-2">
                <Avatar name={currentUser.name} size="xs" />
                โพสต์ในนาม <strong className="text-slate-600">{currentUser.name}</strong>
              </span>
              <button type="button" onClick={() => navigate('/')} className="btn-ghost px-6 py-2.5">
                ยกเลิก
              </button>
              <button type="submit" disabled={submitting} className="btn-primary px-6 py-2.5">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} โพสต์คำถาม
              </button>
            </div>
          </form>

          {/* Sidebar: live preview + tips */}
          <aside className="space-y-4 lg:sticky lg:top-24 animate-fade-up">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                <Eye size={14} /> ตัวอย่างในหน้ารวมกระทู้
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Avatar name={currentUser.name} size="xs" />
                  <span className="font-semibold text-slate-700 truncate">{currentUser.name}</span>
                  <span className="text-slate-300">•</span>
                  <span>เมื่อสักครู่</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <CircleDashed size={11} /> รอคำตอบ
                  </span>
                </div>
                <h3 className={`mt-2 text-[15px] font-bold leading-snug line-clamp-3 break-words ${title.trim() ? 'text-slate-900' : 'text-slate-300'}`}>
                  {title.trim() || 'หัวข้อคำถามจะแสดงตรงนี้'}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.length > 0
                    ? tags.map(tag => <span key={tag} className={tagClass(tag)}>#{tag}</span>)
                    : <span className="text-[11px] text-slate-300">#แท็ก</span>}
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lightbulb size={16} />
                </span>
                เคล็ดลับให้ได้คำตอบเร็ว
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                {[
                  'ตั้งหัวข้อให้เจาะจง เช่น ใส่ชื่อ error หรือชื่อวิชา',
                  'บอกสิ่งที่ลองทำไปแล้ว และผลลัพธ์ที่คาดหวัง',
                  'แปะโค้ดด้วยปุ่ม “แทรก Code Block” เพื่อให้อ่านง่าย',
                  'เลือกแท็กที่มีอยู่ก่อน เพื่อให้คนที่ถนัดเรื่องนั้นเห็น',
                ].map((tip, i) => (
                  <li key={tip} className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

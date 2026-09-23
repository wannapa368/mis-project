import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ArrowUp, Star, CheckCircle, Sparkles, CircleDashed, CircleAlert, Loader2, Reply, Send, Pencil, Trash2, Check } from 'lucide-react';
import axios from 'axios';
import Avatar from '../components/Avatar';
import ConfirmDialog from '../components/ConfirmDialog';
import { tagClass } from '../lib/tags';
import { invalidateForumCache } from '../lib/forumCache';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

const OwnerBadge = () => (
  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
    เจ้าของกระทู้
  </span>
);

// ปุ่มแก้ไข / ลบ สำหรับเจ้าของเนื้อหา
const OwnerActions = ({ onEdit, onDelete, label = '' }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-700 hover:bg-brand-50 px-2 py-1 rounded-lg transition cursor-pointer"
      title={`แก้ไข${label}`}
    >
      <Pencil size={12} /> แก้ไข
    </button>
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition cursor-pointer"
      title={`ลบ${label}`}
    >
      <Trash2 size={12} /> ลบ
    </button>
  </div>
);

const EditedLabel = ({ at }) =>
  at ? (
    <span className="text-[11px] text-slate-400" title={`แก้ไขเมื่อ ${new Date(at).toLocaleString('th-TH')}`}>
      · แก้ไขแล้ว
    </span>
  ) : null;

// กล่องแก้ไขข้อความแบบ inline
const InlineEditor = ({ value, onChange, onSubmit, onCancel, saving, error, rows = 4 }) => (
  <form onSubmit={onSubmit} className="space-y-2 animate-fade-up">
    <textarea
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="input-field p-3 font-mono leading-relaxed resize-y"
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
    <div className="flex justify-end gap-2">
      <button type="button" onClick={onCancel} disabled={saving} className="btn-ghost text-xs px-3 py-1.5">
        ยกเลิก
      </button>
      <button type="submit" disabled={saving || !value.trim()} className="btn-primary text-xs px-3 py-1.5">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} บันทึก
      </button>
    </div>
  </form>
);

export default function QuestionDetail({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // _id ของคำตอบที่เจ้าของกระทู้กำลังตอบกลับ
  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState('');

  // แก้ไข / ลบ (เฉพาะเจ้าของเนื้อหา)
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [questionDraft, setQuestionDraft] = useState({ title: '', body: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null); // { kind: 'question' | 'comment', id, title, message }
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch thread details
  const fetchThread = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/questions/${id}`);
      setQuestion(response.data.question);
      setComments(response.data.comments);
    } catch (err) {
      console.error(err);
      setError('ไม่พบกระทู้ที่ต้องการ หรือเกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  // Vote Question
  const handleVoteQuestion = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/questions/${id}/upvote`, {
        userId: currentUser.name
      });
      setQuestion(response.data);
    } catch (err) {
      console.error('Failed to vote question', err);
    }
  };

  // Vote Comment
  const handleVoteComment = async (commentId) => {
    try {
      await axios.post(`${API_URL}/api/comments/${commentId}/upvote`, {
        userId: currentUser.name
      });
      fetchThread();
    } catch (err) {
      console.error('Failed to vote comment', err);
    }
  };

  // Verify Comment
  const handleVerifyComment = async (commentId) => {
    try {
      await axios.post(`${API_URL}/api/comments/${commentId}/verify`, {
        userId: currentUser.name,
        role: currentUser.role
      });
      fetchThread();
    } catch (err) {
      console.error('Failed to verify comment', err);
    }
  };

  // Submit Comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentBody.trim()) return;

    try {
      await axios.post(`${API_URL}/api/questions/${id}/comments`, {
        body: newCommentBody,
        author: currentUser
      });
      setNewCommentBody('');
      invalidateForumCache();
      fetchThread();
    } catch (err) {
      console.error('Failed to submit comment', err);
    }
  };

  // เจ้าของกระทู้ตอบกลับคำตอบ
  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyBody.trim() || replySending) return;

    setReplySending(true);
    setReplyError('');
    try {
      await axios.post(`${API_URL}/api/questions/${id}/comments`, {
        body: replyBody,
        author: currentUser,
        parentId
      });
      setReplyBody('');
      setReplyingTo(null);
      invalidateForumCache();
      fetchThread();
    } catch (err) {
      console.error('Failed to submit reply', err);
      setReplyError(err.response?.data?.error || 'ส่งข้อความตอบกลับไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setReplySending(false);
    }
  };

  const errorMessage = (err, fallback) => {
    if (err.response?.data?.error) return err.response.data.error;
    // 404 ที่ไม่มีข้อความ error = เซิร์ฟเวอร์ไม่มี route นี้ (backend ยังไม่ได้ deploy เวอร์ชันล่าสุด)
    if (err.response?.status === 404) return 'เซิร์ฟเวอร์ยังไม่รองรับการทำรายการนี้ (backend อาจยังไม่ได้อัปเดตเป็นเวอร์ชันล่าสุด)';
    if (!err.response) return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง';
    return fallback;
  };

  const startEditQuestion = () => {
    setQuestionDraft({ title: question.title, body: question.body });
    setEditingQuestion(true);
    setEditingCommentId(null);
    setEditError('');
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionDraft.title.trim() || !questionDraft.body.trim()) {
      setEditError('กรุณากรอกหัวข้อและรายละเอียดคำถาม');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const { data } = await axios.put(`${API_URL}/api/questions/${id}`, {
        title: questionDraft.title,
        body: questionDraft.body,
        userName: currentUser.name
      });
      setQuestion(data);
      setEditingQuestion(false);
      invalidateForumCache();
    } catch (err) {
      setEditError(errorMessage(err, 'บันทึกการแก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setSaving(false);
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setCommentDraft(comment.body);
    setEditingQuestion(false);
    setReplyingTo(null);
    setEditError('');
  };

  const handleSaveComment = async (e) => {
    e.preventDefault();
    if (!commentDraft.trim()) {
      setEditError('กรุณากรอกข้อความ');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const { data } = await axios.put(`${API_URL}/api/comments/${editingCommentId}`, {
        body: commentDraft,
        userName: currentUser.name
      });
      setComments(prev => prev.map(c => (c._id === data._id ? data : c)));
      setEditingCommentId(null);
    } catch (err) {
      setEditError(errorMessage(err, 'บันทึกการแก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (target) => {
    setDeleteError('');
    setPendingDelete(target);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      if (pendingDelete.kind === 'question') {
        await axios.delete(`${API_URL}/api/questions/${id}`, { data: { userName: currentUser.name } });
        invalidateForumCache();
        navigate('/');
        return;
      }
      await axios.delete(`${API_URL}/api/comments/${pendingDelete.id}`, { data: { userName: currentUser.name } });
      invalidateForumCache();
      setPendingDelete(null);
      fetchThread();
    } catch (err) {
      setDeleteError(errorMessage(err, 'ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setDeleting(false);
    }
  };

  const openReply = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyBody('');
    setReplyError('');
  };

  // Custom code highlighter logic
  const highlightCode = (code, lang) => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const jsKeywords = /\b(const|let|var|function|return|import|export|from|default|class|extends|new|if|else|try|catch|async|await|this|true|false|null)\b/g;
    const types = /\b(string|number|boolean|any|void|int|double|float|char|public|private|protected|static|interface)\b/g;
    const commentsRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
    const stringsRegex = /(["'`])(.*?)\1/g;
    
    escaped = escaped.replace(commentsRegex, '<span class="text-gray-500">$1</span>');
    escaped = escaped.replace(jsKeywords, '<span class="text-pink-400 font-semibold">$1</span>');
    escaped = escaped.replace(types, '<span class="text-blue-400">$1</span>');
    escaped = escaped.replace(stringsRegex, '<span class="text-green-300">"$2"</span>');
    
    return escaped;
  };

  const renderInlineCode = (text) => {
    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <code key={i} className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded-md font-mono text-[0.85em] border border-slate-200">
            {part}
          </code>
        );
      }
      return part;
    });
  };

  const renderContentWithCode = (text) => {
    if (!text) return null;
    const parts = text.split(/(\`\`\`[a-z]*\n[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const firstLine = lines[0];
        const lang = firstLine.replace('```', '').trim() || 'code';
        const code = lines.slice(1, lines.length - 1).join('\n');
        const highlighted = highlightCode(code, lang);
        
        return (
          <div key={index} className="relative group my-4">
            <div className="absolute right-3 top-2 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">{lang}</div>
            <pre 
              className="bg-slate-900 text-slate-100 p-4 pt-8 rounded-xl font-mono text-xs md:text-sm overflow-x-auto border border-slate-800 leading-relaxed shadow-lg shadow-slate-900/10"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        );
      }
      
      return (
        <span key={index} className="whitespace-pre-line text-slate-700 leading-relaxed text-[15px] block my-2">
          {renderInlineCode(part)}
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-brand-600 mx-auto" />
          <p className="text-slate-500 font-medium text-sm">กำลังโหลดข้อมูลกระทู้...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-md animate-slide-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <CircleAlert size={26} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'ไม่พบหน้ากระทู้นี้'}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-primary px-5 py-2.5"
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    );
  }

  const hasUpvotedQuestion = question.upvoteUserIds?.includes(currentUser.name);
  const canVerify = currentUser.role === 'Teacher' || question.author.name === currentUser.name;
  const isQuestionAuthor = question.author.name === currentUser.name;
  const isMine = (name) => name === currentUser.name;
  const isOwnerName = (name) => name === question.author.name;
  const answers = comments.filter(c => !c.parentId);
  const repliesByParent = comments
    .filter(c => c.parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, r) => ((acc[r.parentId] ||= []).push(r), acc), {});
  const roleLabel = (role) => (role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา');
  const roleBadgeClass = (role) =>
    `text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
      role === 'Teacher' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl text-sm text-slate-600 hover:text-brand-700 hover:bg-slate-100 font-semibold transition cursor-pointer"
          >
            <ArrowLeft size={18} /> กลับหน้าแรก
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="hidden sm:inline">บทบาทปัจจุบันของคุณ:</span>
            <span className={`inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full font-semibold truncate ${
              currentUser.role === 'Teacher' ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-brand-50 text-brand-700 border border-brand-100'
            }`}>
              <Avatar name={currentUser.name} size="xs" />
              {roleLabel(currentUser.role)} ({currentUser.name})
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">

        {/* Question Panel */}
        <article className="card p-5 sm:p-8 flex gap-4 sm:gap-6 animate-fade-up">
          {/* Left Column: Vote */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleVoteQuestion}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                hasUpvotedQuestion
                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-brand-200 hover:text-brand-600'
              }`}
              title="โหวตขึ้น"
            >
              <ArrowUp size={20} />
            </button>
            <span className="text-lg font-bold text-slate-800">{question.upvotes}</span>
          </div>

          {/* Right Column: Question Content */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Avatar name={question.author.name} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{question.author.name}</span>
                  <span className={roleBadgeClass(question.author.role)}>{roleLabel(question.author.role)}</span>
                </div>
                <span className="text-xs">{new Date(question.createdAt).toLocaleString('th-TH')}</span>{' '}
                <EditedLabel at={question.editedAt} />
              </div>

              {/* Status Badge */}
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                {isQuestionAuthor && !editingQuestion && (
                  <OwnerActions
                    label="กระทู้"
                    onEdit={startEditQuestion}
                    onDelete={() => requestDelete({
                      kind: 'question',
                      id: question._id,
                      title: 'ลบกระทู้นี้?',
                      message: `กระทู้ "${question.title}" รวมถึงคำตอบและข้อความตอบกลับทั้งหมด (${comments.length} รายการ) จะถูกลบถาวร และไม่สามารถกู้คืนได้`
                    })}
                  />
                )}
                {question.status === 'resolved' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle size={14} /> แก้ปัญหาแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <CircleDashed size={14} /> กำลังรอคำตอบ
                  </span>
                )}
              </div>
            </div>

            {editingQuestion ? (
              <form onSubmit={handleSaveQuestion} className="space-y-3 animate-fade-up">
                <input
                  type="text"
                  autoFocus
                  value={questionDraft.title}
                  onChange={(e) => setQuestionDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="หัวข้อคำถาม"
                  className="input-field text-base font-bold py-3"
                />
                <textarea
                  value={questionDraft.body}
                  onChange={(e) => setQuestionDraft(d => ({ ...d, body: e.target.value }))}
                  placeholder="รายละเอียดปัญหาหรือโค้ด"
                  rows={10}
                  className="input-field p-4 font-mono leading-relaxed resize-y"
                />
                {editError && <p className="text-xs text-red-600">{editError}</p>}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingQuestion(false)} disabled={saving} className="btn-ghost text-xs">
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary text-xs">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} บันทึกการแก้ไข
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {question.title}
                </h1>

                {/* Render body */}
                <div className="max-w-none text-slate-700">
                  {renderContentWithCode(question.body)}
                </div>
              </>
            )}

            {/* AI Tags */}
            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {question.tags.map(tag => (
                  <span key={tag} className={tagClass(tag)}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={19} className="text-brand-600" />
            คำตอบทั้งหมด
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{answers.length}</span>
          </h2>

          {/* Render comments list */}
          {answers.map(comment => {
            const hasUpvotedComment = comment.upvoteUserIds?.includes(currentUser.name);
            const replies = repliesByParent[comment._id] || [];

            return (
              <div
                key={comment._id}
                className={`rounded-2xl border p-5 sm:p-6 flex gap-4 transition-all duration-300 animate-fade-up ${
                  comment.isVerified
                    ? 'bg-emerald-50/40 border-emerald-300 ring-4 ring-emerald-500/10 shadow-soft'
                    : 'bg-white border-slate-200/80 shadow-soft'
                }`}
              >
                {/* Comment Vote */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleVoteComment(comment._id)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                      hasUpvotedComment
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-brand-200 hover:text-brand-600'
                    }`}
                    title="โหวตความคิดเห็น"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <span className="text-sm font-bold text-slate-700">{comment.upvotes}</span>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0 space-y-3">

                  {/* Verified Header if verified */}
                  {comment.isVerified && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
                      <Star size={14} className="fill-emerald-600 text-emerald-600" />
                      คำตอบนี้ถูกต้องและได้รับการยืนยันจากอาจารย์หรือเจ้าของกระทู้แล้ว
                    </div>
                  )}

                  {/* Author Header */}
                  <div className="flex items-center gap-2.5 text-sm text-slate-500">
                    <Avatar name={comment.author.name} size="sm" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{comment.author.name}</span>
                        <span className={roleBadgeClass(comment.author.role)}>{roleLabel(comment.author.role)}</span>
                        {isOwnerName(comment.author.name) && <OwnerBadge />}
                      </div>
                      <span className="text-[11px]">{new Date(comment.createdAt).toLocaleString('th-TH')}</span>{' '}
                      <EditedLabel at={comment.editedAt} />
                    </div>
                  </div>

                  {/* Comment Body */}
                  {editingCommentId === comment._id ? (
                    <InlineEditor
                      value={commentDraft}
                      onChange={setCommentDraft}
                      onSubmit={handleSaveComment}
                      onCancel={() => setEditingCommentId(null)}
                      saving={saving}
                      error={editError}
                      rows={5}
                    />
                  ) : (
                    <div className="max-w-none text-slate-700">
                      {renderContentWithCode(comment.body)}
                    </div>
                  )}

                  {/* Actions: แก้ไข/ลบของตัวเอง, เจ้าของกระทู้ตอบกลับ, อาจารย์หรือเจ้าของกระทู้ยืนยันคำตอบ */}
                  {(isQuestionAuthor || canVerify || isMine(comment.author.name)) && editingCommentId !== comment._id && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      {isMine(comment.author.name) && (
                        <div className="mr-auto">
                          <OwnerActions
                            label="คำตอบ"
                            onEdit={() => startEditComment(comment)}
                            onDelete={() => requestDelete({
                              kind: 'comment',
                              id: comment._id,
                              title: 'ลบคำตอบนี้?',
                              message: replies.length > 0
                                ? `คำตอบนี้และข้อความตอบกลับ ${replies.length} รายการใต้คำตอบนี้จะถูกลบถาวร`
                                : 'คำตอบนี้จะถูกลบถาวร และไม่สามารถกู้คืนได้'
                            })}
                          />
                        </div>
                      )}
                      {isQuestionAuthor && (
                        <button
                          type="button"
                          onClick={() => openReply(comment._id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition border cursor-pointer ${
                            replyingTo === comment._id
                              ? 'bg-brand-50 text-brand-700 border-brand-200'
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Reply size={14} /> ตอบกลับ
                        </button>
                      )}
                      {canVerify && (
                      <button
                        type="button"
                        onClick={() => handleVerifyComment(comment._id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition border cursor-pointer ${
                          comment.isVerified
                            ? 'bg-white text-red-600 hover:bg-red-50 border-red-200'
                            : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        {comment.isVerified ? (
                          <>ยกเลิกการยืนยันคำตอบ</>
                        ) : (
                          <>
                            <Star size={14} className="fill-current" /> ยืนยันว่าคำตอบถูกต้อง
                          </>
                        )}
                      </button>
                      )}
                    </div>
                  )}

                  {/* ข้อความตอบกลับจากเจ้าของกระทู้ */}
                  {replies.length > 0 && (
                    <div className="space-y-3 border-l-2 border-brand-100 pl-4 ml-1">
                      {replies.map(reply => (
                        <div key={reply._id} className="animate-fade-up">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Avatar name={reply.author.name} size="xs" />
                            <span className="font-semibold text-slate-900 text-[13px]">{reply.author.name}</span>
                            {isOwnerName(reply.author.name) && <OwnerBadge />}
                            <span className="text-[11px]">{new Date(reply.createdAt).toLocaleString('th-TH')}</span>
                            <EditedLabel at={reply.editedAt} />
                            {isMine(reply.author.name) && editingCommentId !== reply._id && (
                              <div className="ml-auto">
                                <OwnerActions
                                  label="ข้อความตอบกลับ"
                                  onEdit={() => startEditComment(reply)}
                                  onDelete={() => requestDelete({
                                    kind: 'comment',
                                    id: reply._id,
                                    title: 'ลบข้อความตอบกลับนี้?',
                                    message: 'ข้อความตอบกลับนี้จะถูกลบถาวร และไม่สามารถกู้คืนได้'
                                  })}
                                />
                              </div>
                            )}
                          </div>
                          {editingCommentId === reply._id ? (
                            <div className="mt-2">
                              <InlineEditor
                                value={commentDraft}
                                onChange={setCommentDraft}
                                onSubmit={handleSaveComment}
                                onCancel={() => setEditingCommentId(null)}
                                saving={saving}
                                error={editError}
                                rows={3}
                              />
                            </div>
                          ) : (
                            <div className="mt-1 text-slate-700 [&_span.block]:text-sm [&_span.block]:my-1">
                              {renderContentWithCode(reply.body)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* กล่องพิมพ์ตอบกลับ (เฉพาะเจ้าของกระทู้) */}
                  {isQuestionAuthor && replyingTo === comment._id && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, comment._id)}
                      className="border-l-2 border-brand-200 pl-4 ml-1 space-y-2 animate-fade-up"
                    >
                      <textarea
                        autoFocus
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder={`ตอบกลับ ${comment.author.name}...`}
                        rows={3}
                        className="input-field p-3 leading-relaxed resize-y"
                      />
                      {replyError && <p className="text-xs text-red-600">{replyError}</p>}
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openReply(comment._id)} className="btn-ghost text-xs px-3 py-1.5">
                          ยกเลิก
                        </button>
                        <button type="submit" disabled={!replyBody.trim() || replySending} className="btn-primary text-xs px-3 py-1.5">
                          {replySending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} ส่งตอบกลับ
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>
            );
          })}

          {answers.length === 0 && (
            <div className="text-center py-12 px-6 bg-white/60 border border-dashed border-slate-300 rounded-2xl">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                <MessageSquare size={22} />
              </div>
              <p className="text-slate-500 text-sm">ยังไม่มีผู้มาแสดงความคิดเห็น ร่วมเป็นคนแรกที่จะช่วยตอบคำถามนี้กัน!</p>
            </div>
          )}
        </section>

        {/* Reply Box */}
        <section className="card p-5 sm:p-6">
          <h3 className="font-bold text-slate-900 mb-4 text-base">เขียนคำตอบของคุณ</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              placeholder="พิมพ์คำตอบของคุณเพื่อช่วยเหลือเพื่อนๆ (หากต้องการแปะโค้ด ให้ใช้เครื่องหมาย ``` ครอบโค้ดไว้)..."
              rows={4}
              className="input-field p-4 font-mono leading-relaxed resize-y"
            />
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <Avatar name={currentUser.name} size="xs" />
                คุณกำลังตอบกลับในฐานะ <strong className="text-slate-600">{currentUser.name}</strong>
              </span>
              <button
                type="submit"
                disabled={!newCommentBody.trim()}
                className="btn-primary px-5 py-2.5"
              >
                <Sparkles size={16} /> ส่งคำตอบ
              </button>
            </div>
          </form>
        </section>

      </main>

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDelete.title}
          message={pendingDelete.message}
          busy={deleting}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

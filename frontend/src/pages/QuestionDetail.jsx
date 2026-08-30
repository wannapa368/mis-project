import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ArrowUp, ArrowDown, Star, CheckCircle, User, Sparkles, CircleDashed } from 'lucide-react';
import axios from 'axios';

export default function QuestionDetail({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch thread details
  const fetchThread = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/questions/${id}`);
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
      const response = await axios.post(`http://localhost:5000/api/questions/${id}/upvote`, {
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
      await axios.post(`http://localhost:5000/api/comments/${commentId}/upvote`, {
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
      await axios.post(`http://localhost:5000/api/comments/${commentId}/verify`, {
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
      await axios.post(`http://localhost:5000/api/questions/${id}/comments`, {
        body: newCommentBody,
        author: currentUser
      });
      setNewCommentBody('');
      fetchThread();
    } catch (err) {
      console.error('Failed to submit comment', err);
    }
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
          <code key={i} className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-700">
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
            <div className="absolute right-3 top-2 text-xs font-mono text-gray-500 uppercase">{lang}</div>
            <pre 
              className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto border border-gray-800 leading-relaxed shadow-inner"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        );
      }
      
      return (
        <span key={index} className="whitespace-pre-line text-gray-800 leading-relaxed text-base block my-2">
          {renderInlineCode(part)}
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลกระทู้...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border text-center max-w-md shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error || 'ไม่พบหน้ากระทู้นี้'}</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    );
  }

  const hasUpvotedQuestion = question.upvoteUserIds?.includes(currentUser.name);
  const canVerify = currentUser.role === 'Teacher' || question.author.name === currentUser.name;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
          >
            <ArrowLeft size={20} /> กลับหน้าแรก
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>บทบาทปัจจุบันของคุณ:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
              currentUser.role === 'Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {currentUser.role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา'} ({currentUser.name})
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        
        {/* Question Panel */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 flex gap-6">
          {/* Left Column: Vote */}
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleVoteQuestion}
              className={`p-2.5 rounded-full border transition hover:bg-blue-50 ${
                hasUpvotedQuestion ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
              title="โหวตขึ้น"
            >
              <ArrowUp size={22} className={hasUpvotedQuestion ? 'fill-blue-600' : ''} />
            </button>
            <span className="text-lg font-bold text-gray-800">{question.upvotes}</span>
          </div>

          {/* Right Column: Question Content */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                {question.author.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{question.author.name}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {question.author.role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา'}
                  </span>
                </div>
                <span className="text-xs">{new Date(question.createdAt).toLocaleString('th-TH')}</span>
              </div>

              {/* Status Badge */}
              <div className="ml-auto flex items-center gap-1.5 font-semibold text-sm">
                {question.status === 'resolved' ? (
                  <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle size={16} /> แก้ปัญหาแล้ว
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                    <CircleDashed size={16} /> กำลังรอคำตอบ
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {question.title}
            </h1>

            {/* Render body */}
            <div className="prose max-w-none text-gray-800">
              {renderContentWithCode(question.body)}
            </div>

            {/* AI Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {question.tags.map(tag => {
                let colorClass = 'bg-gray-100 text-gray-700';
                if (tag === 'Database') colorClass = 'bg-green-100 text-green-700 border border-green-200';
                else if (tag === 'Error') colorClass = 'bg-red-100 text-red-700 border border-red-200';
                else if (tag === 'React') colorClass = 'bg-blue-100 text-blue-700 border border-blue-200';
                else if (tag === 'Java') colorClass = 'bg-orange-100 text-orange-700 border border-orange-200';
                else if (tag === 'NestJS') colorClass = 'bg-pink-100 text-pink-700 border border-pink-200';
                return (
                  <span key={tag} className={`px-2.5 py-1 text-xs font-semibold rounded-md ${colorClass}`}>
                    #{tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-500" />
            คำตอบทั้งหมด ({comments.length})
          </h2>

          {/* Render comments list */}
          {comments.map(comment => {
            const hasUpvotedComment = comment.upvoteUserIds?.includes(currentUser.name);

            return (
              <div 
                key={comment._id} 
                className={`bg-white rounded-2xl border p-6 flex gap-4 transition-all duration-300 ${
                  comment.isVerified 
                    ? 'border-green-500 bg-green-50/30 ring-2 ring-green-400/20' 
                    : 'border-gray-200'
                }`}
              >
                {/* Comment Vote */}
                <div className="flex flex-col items-center gap-1.5 pt-1">
                  <button 
                    onClick={() => handleVoteComment(comment._id)}
                    className={`p-2 rounded-full border transition hover:bg-blue-50 ${
                      hasUpvotedComment ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                    title="โหวตความคิดเห็น"
                  >
                    <ArrowUp size={16} className={hasUpvotedComment ? 'fill-blue-600' : ''} />
                  </button>
                  <span className="text-sm font-bold text-gray-700">{comment.upvotes}</span>
                </div>

                {/* Comment Content */}
                <div className="flex-1 space-y-3">
                  
                  {/* Verified Header if verified */}
                  {comment.isVerified && (
                    <div className="flex items-center gap-1.5 text-green-700 font-bold text-sm bg-green-100/60 px-3 py-1.5 rounded-lg border border-green-200 w-fit">
                      <Star size={16} className="fill-green-600 text-green-600 animate-pulse" />
                      คำตอบนี้ถูกต้องและได้รับการยืนยันจากอาจารย์หรือเจ้าของกระทู้แล้ว
                    </div>
                  )}

                  {/* Author Header */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xs">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900">{comment.author.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          comment.author.role === 'Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {comment.author.role === 'Teacher' ? 'อาจารย์' : 'นักศึกษา'}
                        </span>
                      </div>
                      <span className="text-[11px]">{new Date(comment.createdAt).toLocaleString('th-TH')}</span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="prose max-w-none text-gray-800">
                    {renderContentWithCode(comment.body)}
                  </div>

                  {/* Actions for teacher or question author */}
                  {canVerify && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleVerifyComment(comment._id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition border ${
                          comment.isVerified
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
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
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {comments.length === 0 && (
            <div className="text-center py-10 bg-white border rounded-2xl text-gray-400 text-sm">
              ยังไม่มีผู้มาแสดงความคิดเห็น ร่วมเป็นคนแรกที่จะช่วยตอบคำถามนี้กัน!
            </div>
          )}
        </div>

        {/* Reply Box */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-base">เขียนคำตอบของคุณ</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              placeholder="พิมพ์คำตอบของคุณเพื่อช่วยเหลือเพื่อนๆ (หากต้องการแปะโค้ด ให้ใช้เครื่องหมาย ``` ครอบโค้ดไว้)..."
              rows={4}
              className="w-full p-4 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                คุณกำลังตอบกลับในฐานะ <strong className="text-gray-600">{currentUser.name}</strong>
              </span>
              <button
                type="submit"
                disabled={!newCommentBody.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition text-sm flex items-center gap-1 shadow-sm"
              >
                <Sparkles size={16} /> ส่งคำตอบ
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}

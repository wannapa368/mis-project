const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (รองรับทั้ง MongoDB บนคลาวด์และในเครื่อง)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cs_helpdesk';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB cs_helpdesk'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas & Models
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['waiting', 'resolved'], default: 'waiting' },
  upvotes: { type: Number, default: 0 },
  upvoteUserIds: [String],
  author: {
    name: { type: String, default: 'นักศึกษาปริศนา' },
    role: { type: String, default: 'Student' }, // 'Student' or 'Teacher'
    avatar: { type: String, default: 'Student' }
  },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null }
});

const CommentSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  // ถ้ามีค่า = เป็นการตอบกลับคำตอบนั้น (ตอบกลับได้เฉพาะเจ้าของกระทู้)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  upvoteUserIds: [String],
  isVerified: { type: Boolean, default: false },
  author: {
    name: { type: String, required: true },
    role: { type: String, default: 'Student' },
    avatar: { type: String, default: 'Student' }
  },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null }
});

// Index สำหรับคำสั่งที่ใช้บ่อย: เรียงกระทู้ล่าสุด, กรองตามแท็ก/ผู้เขียน, หาคอมเมนต์ของกระทู้
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ tags: 1, createdAt: -1 });
QuestionSchema.index({ 'author.name': 1, createdAt: -1 });
CommentSchema.index({ questionId: 1 });

const Question = mongoose.model('Question', QuestionSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Helper function for tag suggestions (AI)
function extractAITags(title, body) {
  const text = (title + ' ' + body).toLowerCase();
  const tags = [];
  if (text.includes('java') || text.includes('spring') || text.includes('jvm')) tags.push('Java');
  if (text.includes('database') || text.includes('sql') || text.includes('mongo') || text.includes('mysql') || text.includes('postgres') || text.includes('db') || text.includes('refused') || text.includes('typeorm')) tags.push('Database');
  if (text.includes('error') || text.includes('exception') || text.includes('bug') || text.includes('fail') || text.includes('refused') || text.includes('crash')) tags.push('Error');
  if (text.includes('nest') || text.includes('nestjs') || text.includes('typeorm')) tags.push('NestJS');
  if (text.includes('react') || text.includes('useeffect') || text.includes('usestate') || text.includes('hooks') || text.includes('nextjs')) tags.push('React');
  if (text.includes('หลักสูตร') || text.includes('curriculum') || text.includes('หน่วยกิต') || text.includes('cwie') || text.includes('2570') || text.includes('รหัส 70') || text.includes('รหัส70')) tags.push('Curriculum');
  
  const uniqueTags = [...new Set(tags)];
  return uniqueTags.length > 0 ? uniqueTags : ['General'];
}

// REST APIs
app.get('/api/test', (req, res) => {
  res.json({ message: 'เชื่อมต่อ Backend สำเร็จแล้ว!' });
});

// Suggest tags route
app.post('/api/ai-suggest-tags', (req, res) => {
  const { title, body } = req.body;
  const tags = extractAITags(title || '', body || '');
  res.json({ tags });
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const { q, tag, status, myThreads } = req.query;
    let filter = {};

    if (q) {
      // escape อักขระพิเศษ เช่น "C++" หรือ "(" เพื่อไม่ให้ regex พัง
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safeQ, $options: 'i' } },
        { body: { $regex: safeQ, $options: 'i' } },
        { tags: { $regex: safeQ, $options: 'i' } }
      ];
    }

    if (tag) {
      filter.tags = tag;
    }

    if (status) {
      filter.status = status;
    }

    if (myThreads) {
      filter['author.name'] = myThreads;
    }

    // ดึงกระทู้พร้อมจำนวนคอมเมนต์ในคำสั่งเดียว (แทนการ count ทีละกระทู้)
    // และไม่ส่ง body ไปด้วย เพราะหน้ารวมกระทู้ไม่ได้ใช้ ทำให้ response เล็กลง
    const questions = await Question.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $project: { body: 0 } },
      {
        $lookup: {
          from: Comment.collection.name,
          localField: '_id',
          foreignField: 'questionId',
          pipeline: [{ $project: { _id: 1 } }],
          as: 'comments'
        }
      },
      { $addFields: { commentsCount: { $size: '$comments' } } },
      { $project: { comments: 0 } }
    ]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a question by ID
app.get('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const comments = await Comment.find({ questionId: req.params.id })
      .sort({ isVerified: -1, upvotes: -1, createdAt: -1 });

    res.json({ question, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create question
app.post('/api/questions', async (req, res) => {
  try {
    const { title, body, tags, author } = req.body;
    let finalTags = tags;
    if (!finalTags || finalTags.length === 0) {
      finalTags = extractAITags(title, body);
    }
    const newQuestion = new Question({
      title,
      body,
      tags: finalTags,
      author: author || { name: 'นักศึกษาปริศนา', role: 'Student', avatar: 'Student' }
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upvote question
app.post('/api/questions/:id/upvote', async (req, res) => {
  try {
    const { userId } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const index = question.upvoteUserIds.indexOf(userId);
    if (index === -1) {
      question.upvoteUserIds.push(userId);
      question.upvotes += 1;
    } else {
      question.upvoteUserIds.splice(index, 1);
      question.upvotes -= 1;
    }
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
app.post('/api/questions/:id/comments', async (req, res) => {
  try {
    const { body, author, parentId } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    if (parentId) {
      if (!author || author.name !== question.author.name) {
        return res.status(403).json({ error: 'เฉพาะเจ้าของกระทู้เท่านั้นที่ตอบกลับคำตอบได้' });
      }
      const parent = await Comment.findById(parentId);
      if (!parent || !parent.questionId.equals(question._id) || parent.parentId) {
        return res.status(400).json({ error: 'ไม่พบคำตอบที่ต้องการตอบกลับ' });
      }
    }

    const newComment = new Comment({
      questionId: question._id,
      parentId: parentId || null,
      body,
      author: author || { name: 'นักศึกษาปริศนา', role: 'Student', avatar: 'Student' }
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upvote comment
app.post('/api/comments/:commentId/upvote', async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const index = comment.upvoteUserIds.indexOf(userId);
    if (index === -1) {
      comment.upvoteUserIds.push(userId);
      comment.upvotes += 1;
    } else {
      comment.upvoteUserIds.splice(index, 1);
      comment.upvotes -= 1;
    }
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify comment (toggle)
app.post('/api/comments/:commentId/verify', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.parentId) return res.status(400).json({ error: 'ไม่สามารถยืนยันข้อความตอบกลับเป็นคำตอบได้' });

    const question = await Question.findById(comment.questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const wasVerified = comment.isVerified;

    if (wasVerified) {
      comment.isVerified = false;
      await comment.save();

      const otherVerified = await Comment.findOne({ questionId: question._id, isVerified: true });
      if (!otherVerified) {
        question.status = 'waiting';
        await question.save();
      }
    } else {
      await Comment.updateMany({ questionId: question._id }, { isVerified: false });
      comment.isVerified = true;
      await comment.save();

      question.status = 'resolved';
      await question.save();
    }

    res.json({ comment, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed route
// ---- แก้ไข / ลบ (ทำได้เฉพาะเจ้าของเนื้อหา) ----
// หมายเหตุ: ระบบยังไม่มีการล็อกอินจริง จึงเช็กจากชื่อผู้ใช้ที่ส่งมา (userName)

// แก้ไขกระทู้
app.put('/api/questions/:id', async (req, res) => {
  try {
    const { title, body, tags, userName } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    if (!userName || userName !== question.author.name) {
      return res.status(403).json({ error: 'เฉพาะเจ้าของกระทู้เท่านั้นที่แก้ไขกระทู้ได้' });
    }
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ error: 'กรุณากรอกหัวข้อและรายละเอียดคำถาม' });
    }

    question.title = title.trim();
    question.body = body;
    if (Array.isArray(tags)) question.tags = tags;
    question.editedAt = new Date();
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ลบกระทู้ (ลบคำตอบและข้อความตอบกลับทั้งหมดของกระทู้ด้วย)
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { userName } = req.body || {};
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    if (!userName || userName !== question.author.name) {
      return res.status(403).json({ error: 'เฉพาะเจ้าของกระทู้เท่านั้นที่ลบกระทู้ได้' });
    }

    await Comment.deleteMany({ questionId: question._id });
    await question.deleteOne();
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// แก้ไขคำตอบ / ข้อความตอบกลับ
app.put('/api/comments/:commentId', async (req, res) => {
  try {
    const { body, userName } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (!userName || userName !== comment.author.name) {
      return res.status(403).json({ error: 'เฉพาะผู้เขียนเท่านั้นที่แก้ไขข้อความนี้ได้' });
    }
    if (!body?.trim()) return res.status(400).json({ error: 'กรุณากรอกข้อความ' });

    comment.body = body;
    comment.editedAt = new Date();
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ลบคำตอบ / ข้อความตอบกลับ (ลบคำตอบ = ลบข้อความตอบกลับใต้คำตอบนั้นด้วย)
app.delete('/api/comments/:commentId', async (req, res) => {
  try {
    const { userName } = req.body || {};
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (!userName || userName !== comment.author.name) {
      return res.status(403).json({ error: 'เฉพาะผู้เขียนเท่านั้นที่ลบข้อความนี้ได้' });
    }

    await Comment.deleteMany({ parentId: comment._id });
    await comment.deleteOne();

    // ถ้าลบคำตอบที่ถูกยืนยันไว้ ให้กระทู้กลับไปเป็น "รอคำตอบ"
    if (comment.isVerified) {
      await Question.updateOne({ _id: comment.questionId }, { status: 'waiting' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    await Question.deleteMany({});
    await Comment.deleteMany({});

    // Q1
    const q1 = new Question({
      title: 'รัน MongoDB ไม่ขึ้นครับ Error connection refused',
      body: 'พยายามรันโปรเจกต์แล้วขึ้น Error connection refused ยิงไป port 27017 ไม่ได้เลยครับ ต้องแก้ไขยังไงครับ โค้ดเชื่อมต่อประมาณนี้ครับ:\n\n```javascript\nmongoose.connect(\'mongodb://localhost:27017/my_db\')\n  .then(() => console.log(\'Connected!\'));\n```',
      tags: ['Database', 'Error'],
      status: 'waiting',
      upvotes: 12,
      upvoteUserIds: [],
      author: { name: 'นักศึกษาปริศนา', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 10 * 60 * 1000)
    });
    await q1.save();

    const c1_1 = new Comment({
      questionId: q1._id,
      body: 'ลองเช็คดูว่า mongod service รันอยู่หรือยังครับ ใน Windows ให้เปิดโปรแกรม Services (ค้นหาใน Start) แล้วมองหาบริการชื่อ `MongoDB Server (MongoDB)` จากนั้นกด Start service ครับ\n\nหรือถ้าใช้ command line ลองรันคำสั่ง `net start MongoDB` ใน Administrator PowerShell ดูครับ',
      upvotes: 4,
      upvoteUserIds: [],
      isVerified: false,
      author: { name: 'อาจารย์สมศักดิ์', role: 'Teacher', avatar: 'Teacher' },
      createdAt: new Date(Date.now() - 8 * 60 * 1000)
    });
    await c1_1.save();

    const c1_2 = new Comment({
      questionId: q1._id,
      body: 'ขอบคุณครับอาจารย์ ลองเปิดใน Services แล้วเจอว่าปิดอยู่จริงๆ ด้วยครับ พอกด Start แล้วเชื่อมต่อได้ทันทีเลยครับ!',
      upvotes: 1,
      upvoteUserIds: [],
      isVerified: false,
      author: { name: 'นักศึกษาปริศนา', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 5 * 60 * 1000)
    });
    await c1_2.save();

    // Q2
    const q2 = new Question({
      title: 'สอบถามวิธีใช้ useEffect ใน React เบื้องต้นครับ',
      body: 'อยากทราบว่า Dependency Array ใน useEffect ทำหน้าที่อะไร และมีวิธีกำหนดค่าอย่างไรบ้างครับ เช่น `[]` กับการไม่ใส่เลย หรือใส่ตัวแปรลงไป ต่างกันอย่างไรครับ',
      tags: ['React'],
      status: 'resolved',
      upvotes: 45,
      upvoteUserIds: [],
      author: { name: 'Wannapa C.', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 120 * 60 * 1000)
    });
    await q2.save();

    const c2_1 = new Comment({
      questionId: q2._id,
      body: 'useEffect ใน React ใช้สำหรับจัดการ Side Effects ครับ โดยการทำงานขึ้นกับ Dependency Array (อาร์กิวเมนต์ตัวที่สอง):\n\n1. **ไม่ใส่ Dependency Array** (`useEffect(() => {})`):\n  ฟังก์ชันจะรันใหม่ทุกๆ ครั้งที่มีการเรนเดอร์ (Render) ใหม่ของ Component (ไม่แนะนำสำหรับดึงข้อมูลหรือ event listener เพราะเปลืองทรัพยากรมาก)\n\n2. **ใส่เป็น Array ว่าง** (`useEffect(() => {}, [])`):\n  ฟังก์ชันจะรัน**เฉพาะตอนที่ Component โหลดครั้งแรกเท่านั้น (Mount)** และไม่รันซ้ำอีก เหมาะสำหรับการ Fetch API หรือโหลดข้อมูลตั้งต้น\n\n3. **ใส่ตัวแปรใน Array** (`useEffect(() => {}, [count])`):\n  ฟังก์ชันจะรันตอนโหลดครั้งแรก และ**ทุกครั้งที่ค่าของตัวแปรใน Array เปลี่ยนแปลง**ครับ',
      upvotes: 8,
      upvoteUserIds: [],
      isVerified: true,
      author: { name: 'อาจารย์สมศักดิ์', role: 'Teacher', avatar: 'Teacher' },
      createdAt: new Date(Date.now() - 110 * 60 * 1000)
    });
    await c2_1.save();

    const c2_2 = new Comment({
      questionId: q2._id,
      body: 'เข้าใจแจ่มแจ้งเลยครับอาจารย์ ขอบคุณมากๆ ครับ',
      upvotes: 2,
      upvoteUserIds: [],
      isVerified: false,
      author: { name: 'Somchai R.', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 100 * 60 * 1000)
    });
    await c2_2.save();

    // Q3
    const q3 = new Question({
      title: 'จะเชื่อมต่อ NestJS กับ TypeORM ยังไงให้รองรับ ConfigService ครับ',
      body: 'ตอนแรกเขียน Config แบบ Hardcode ใน `TypeOrmModule.forRoot()` แล้วใช้งานได้ปกติครับ แต่พอจะเปลี่ยนมาดึงค่าจาก `.env` ผ่าน `ConfigService` ของ `@nestjs/config` แล้วมันฟ้องหา module ไม่เจอบ้าง หรือดึง config ได้เป็น undefined บ้าง รบกวนชี้แนะแนวทางหน่อยครับ',
      tags: ['NestJS', 'Database'],
      status: 'waiting',
      upvotes: 8,
      upvoteUserIds: [],
      author: { name: 'Thanakorn K.', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    });
    await q3.save();

    const c3_1 = new Comment({
      questionId: q3._id,
      body: 'แนะนำให้ใช้ `TypeOrmModule.forRootAsync` ร่วมกับ `ConfigModule` ในการโหลดแบบ Asynchronous ครับ โค้ดควรเขียนลักษณะนี้ครับ:\n\n```typescript\nTypeOrmModule.forRootAsync({\n  imports: [ConfigModule],\n  inject: [ConfigService],\n  useFactory: (configService: ConfigService) => ({\n    type: \'postgres\',\n    host: configService.get<string>(\'DATABASE_HOST\'),\n    port: configService.get<number>(\'DATABASE_PORT\'),\n    username: configService.get<string>(\'DATABASE_USER\'),\n    password: configService.get<string>(\'DATABASE_PASSWORD\'),\n    database: configService.get<string>(\'DATABASE_NAME\'),\n    entities: [__dirname + \'/**/*.entity{.ts,.js}\'],\n    synchronize: true,\n  }),\n})\n```\nอย่าลืมนำเข้า `ConfigModule.forRoot({ isGlobal: true })` ใน `AppModule` หลักด้วยนะครับ เพื่อให้เรียกใช้ได้ทุกที่',
      upvotes: 5,
      upvoteUserIds: [],
      isVerified: false,
      author: { name: 'อาจารย์สมศักดิ์', role: 'Teacher', avatar: 'Teacher' },
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
    });
    await c3_1.save();

    // Q4
    const q4 = new Question({
      title: 'เขียนโปรแกรม Java หาเลขคู่คี่ทำไมรันแล้วติด IndexOutOfBoundsException ครับ',
      body: 'โค้ดรับอินพุตตัวเลขเข้ามาในอาร์เรย์แล้วกรองเลขคู่คี่ครับ แต่พอรันแล้วมีข้อผิดพลาดตลอดเลยครับ:\n\n```java\nint[] numbers = new int[5];\nfor (int i = 0; i <= numbers.length; i++) {\n    numbers[i] = scanner.nextInt();\n}\n```\nบรรทัดที่วนลูปในโค้ดนี้ผิดตรงไหนเหรอครับ?',
      tags: ['Java', 'Error'],
      status: 'waiting',
      upvotes: 3,
      upvoteUserIds: [],
      author: { name: 'Anan P.', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });
    await q4.save();

    // Q5
    const q5 = new Question({
      title: 'สอบถามรายละเอียดโครงสร้างหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (ปรับปรุง 2570 / รหัส 70) ครับ',
      body: 'อยากทราบว่าหลักสูตรใหม่รหัส 70 มีโครงสร้างหน่วยกิตอย่างไรบ้าง และมีสายวิชาเลือก (Tracks) ให้เลือกเรียนอะไรบ้างครับ มีเปิดสอนวิชาทางด้าน AI หรือ Cloud บ้างไหมครับ?',
      tags: ['Curriculum', 'General'],
      status: 'resolved',
      upvotes: 28,
      upvoteUserIds: [],
      author: { name: 'Somchai R.', role: 'Student', avatar: 'Student' },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });
    await q5.save();

    const c5_1 = new Comment({
      questionId: q5._id,
      body: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70) รวมตลอดหลักสูตรไม่น้อยกว่า 120–124 หน่วยกิตครับ โดยแบ่งเป็น:\n\n1. หมวดวิชาศึกษาทั่วไป (24–30 หน่วยกิต)\n2. หมวดวิชาเฉพาะ (84–90 หน่วยกิต) ประกอบด้วย วิชาแกน (12–15 นก.), วิชาเอกบังคับ (42–45 นก.), วิชาเอกเลือกตามแทร็ก (18–24 นก.) และสหกิจศึกษา CWIE (6–7 นก.)\n3. หมวดวิชาเลือกเสรี (ไม่น้อยกว่า 6 หน่วยกิต)\n\nนอกจากนี้ยังมี 4 Tracks สายอาชีพให้นักศึกษาเลือกตามความสนใจ ได้แก่:\n• Track 1: AI & Applied Data Intelligence\n• Track 2: Full-Stack Software & Cloud Architecture\n• Track 3: Cybersecurity & Defensive Operations\n• Track 4: Smart Technology & Agro-Informatics (อัตลักษณ์แม่โจ้)',
      upvotes: 12,
      upvoteUserIds: [],
      isVerified: true,
      author: { name: 'อาจารย์สมศักดิ์', role: 'Teacher', avatar: 'Teacher' },
      createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000)
    });
    await c5_1.save();

    res.json({ message: 'Seeding completed successfully!', questionsCount: 5, commentsCount: 6 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// รองรับพอร์ตจาก Render (Production) หรือพอร์ต 5000 (Local)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
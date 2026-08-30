const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cs_helpdesk')
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
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  upvoteUserIds: [String],
  isVerified: { type: Boolean, default: false },
  author: {
    name: { type: String, required: true },
    role: { type: String, default: 'Student' },
    avatar: { type: String, default: 'Student' }
  },
  createdAt: { type: Date, default: Date.now }
});

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
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { body: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
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

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    const questionsWithCount = await Promise.all(questions.map(async (question) => {
      const commentsCount = await Comment.countDocuments({ questionId: question._id });
      return {
        ...question.toObject(),
        commentsCount
      };
    }));

    res.json(questionsWithCount);
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
    const { body, author } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const newComment = new Comment({
      questionId: question._id,
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

    const question = await Question.findById(comment.questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const wasVerified = comment.isVerified;

    if (wasVerified) {
      comment.isVerified = false;
      await comment.save();

      // Check if there are other verified comments
      const otherVerified = await Comment.findOne({ questionId: question._id, isVerified: true });
      if (!otherVerified) {
        question.status = 'waiting';
        await question.save();
      }
    } else {
      // Clear other verified comments
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
      body: 'useEffect ใน React ใช้สำหรับจัดการ Side Effects ครับ โดยการทำงานขึ้นกับ Dependency Array (อาร์กิวเมนต์ตัวที่สอง):\n\n1. **ไม่ใส่ Dependency Array** (`useEffect(() => {})`):\n   ฟังก์ชันจะรันใหม่ทุกๆ ครั้งที่มีการเรนเดอร์ (Render) ใหม่ของ Component (ไม่แนะนำสำหรับดึงข้อมูลหรือ event listener เพราะเปลืองทรัพยากรมาก)\n\n2. **ใส่เป็น Array ว่าง** (`useEffect(() => {}, [])`):\n   ฟังก์ชันจะรัน**เฉพาะตอนที่ Component โหลดครั้งแรกเท่านั้น (Mount)** และไม่รันซ้ำอีก เหมาะสำหรับการ Fetch API หรือโหลดข้อมูลตั้งต้น\n\n3. **ใส่ตัวแปรใน Array** (`useEffect(() => {}, [count])`):\n   ฟังก์ชันจะรันตอนโหลดครั้งแรก และ**ทุกครั้งที่ค่าของตัวแปรใน Array เปลี่ยนแปลง**ครับ',
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

    res.json({ message: 'Seeding completed successfully!', questionsCount: 4, commentsCount: 5 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});
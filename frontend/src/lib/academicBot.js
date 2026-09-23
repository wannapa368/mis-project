import axios from 'axios';
import militaryDefermentImg from '../assets/images/military_deferment_mju.png';
import accidentInsuranceImg from '../assets/images/accident_insurance_mju.png';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

// ตรรกะตอบคำถามของบอทวิชาการ ใช้ร่วมกันทั้งหน้าแรก (Home) และหน้าต่างแชทลอย (ChatSupport)
// แก้คำตอบของบอทที่ไฟล์นี้ที่เดียว

// ปุ่มตัวเลือกหลัก (Quick Replies) ของหน้าต่างแชทลอย
export const DEFAULT_QUICK_REPLIES = [
  '[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]',
  '[ค่าเทอม วิทยาการคอมพิวเตอร์]',
  '[ทุนปันน้ำใจพี่ให้น้อง]',
  '[ปฏิทินการศึกษา MJU]',
  '[การขอผ่อนผันทหาร]',
  '[ประกันอุบัติเหตุกลุ่ม]'
];

let messageSeq = 0;
// สร้าง id ไม่ซ้ำให้ข้อความในแชท
export function nextMessageId() {
  messageSeq += 1;
  return `msg-${messageSeq}`;
}

// ใส่ id ให้ข้อความที่ได้จาก getBotReplies ก่อนนำไปแสดง
export function withIds(messages) {
  return messages.map((m) => ({ ...m, id: nextMessageId() }));
}

// คืนรายการข้อความตอบกลับของบอท (ยังไม่มี id) สำหรับข้อความที่ผู้ใช้พิมพ์
export async function getBotReplies(textToSend) {
  const cleanText = textToSend.trim().toLowerCase();

  // 0. ข้อมูลหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70)
  if (
    cleanText.includes('หลักสูตร') ||
    cleanText.includes('2570') ||
    cleanText.includes('รหัส 70') ||
    cleanText.includes('รหัส70') ||
    cleanText.includes('โครงสร้างหลักสูตร') ||
    cleanText.includes('หน่วยกิต') ||
    cleanText.includes('[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]') ||
    cleanText.includes('[โครงสร้างหลักสูตร 70]') ||
    cleanText.includes('[โครงสร้างหน่วยกิต]')
  ) {
    return [
      { sender: 'bot', isMascot: true },
      {
        sender: 'bot',
        text: 'หลักสูตร วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์\n(หลักสูตรปรับปรุง พ.ศ. 2570 / รหัส 70) มหาวิทยาลัยแม่โจ้\n\nได้รับการออกแบบตามเกณฑ์มาตรฐานอุดมศึกษาฉบับใหม่ เน้นสมรรถนะการปฏิบัติงานจริง (Outcome-Based Education: OBE) และปรับปรุงเนื้อหาให้ทันต่อเทคโนโลยี AI และ Cloud Native\n\nโครงสร้างหลักสูตร (รวมตลอดหลักสูตรไม่น้อยกว่า 120–124 หน่วยกิต):\n\n1️ หมวดวิชาศึกษาทั่วไป (General Education) ไม่น้อยกว่า 24–30 หน่วยกิต\n• กลุ่มทักษะการสื่อสารและภาษา (Thai/English): 6–9 หน่วยกิต\n• กลุ่มทักษะดิจิทัลและการรู้เท่าทันเทคโนโลยี: 6 หน่วยกิต\n• กลุ่มทักษะความเป็นผู้ประกอบการและการคิดเชิงนวัตกรรม: 6 หน่วยกิต\n• กลุ่มการพัฒนาสุขภาวะและความรับผิดชอบต่อสังคม: 6 หน่วยกิต\n\n2️ หมวดวิชาเฉพาะ (Specialized Courses) ไม่น้อยกว่า 84–90 หน่วยกิต\n• กลุ่มวิชาแกน (Core Mathematics & Science): 12–15 หน่วยกิต\n• กลุ่มวิชาเอกบังคับ (Core CS Subjects): 42–45 หน่วยกิต\n• กลุ่มวิชาเอกเลือกตามเส้นทางอาชีพ (Tracks): 18–24 หน่วยกิต\n• กลุ่มวิชาการเรียนรู้เชิงบูรณาการกับการทำงาน (CWIE / Co-op): 6–7 หน่วยกิต\n\n3️ หมวดวิชาเลือกเสรี (Free Electives) ไม่น้อยกว่า 6 หน่วยกิต'
      },
      { sender: 'bot', isEduCarousel: true }
    ];
  }

  // 0.1 จุดเน้นการปรับปรุงรายวิชาในหลักสูตร 70 (Core Update)
  else if (
    cleanText.includes('จุดเน้น') ||
    cleanText.includes('core update') ||
    cleanText.includes('เอกบังคับ') ||
    cleanText.includes('modern programming') ||
    cleanText.includes('devops') ||
    cleanText.includes('cloud-native') ||
    cleanText.includes('ai ethics') ||
    cleanText.includes('pdpa') ||
    cleanText.includes('[จุดเน้นปรับปรุงหลักสูตร 70]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'จุดเน้นการปรับปรุงรายวิชาในหลักสูตร 70 (Core Update):\n\n1. ปรับกระบวนวิชาเขียนโปรแกรมให้เข้ากับภาษาสมัยใหม่ (Modern Programming: Python, TypeScript, Go/Rust)\n2. เพิ่มน้ำหนักด้าน DevOps & Cloud-Native Development (CI/CD, Containerization, Microservices) เข้าเป็นพื้นฐาน\n3. สถาปัตยกรรมระบบและเครือข่ายเน้น Hybrid Cloud & Edge Computing\n4. เพิ่มจริยธรรมด้านปัญญาประดิษฐ์และความมั่นคงปลอดภัยข้อมูลส่วนบุคคล (AI Ethics & PDPA / Data Governance)'
      }
    ];
  }

  // 0.2 แผนการเลือกกลุ่มวิชาชีพเฉพาะทาง (4 Career Tracks)
  else if (
    cleanText.includes('track') ||
    cleanText.includes('แทร็ก') ||
    cleanText.includes('แทรค') ||
    cleanText.includes('เส้นทางอาชีพ') ||
    cleanText.includes('เอกเลือก') ||
    cleanText.includes('เฉพาะทาง') ||
    cleanText.includes('สายอาชีพ') ||
    cleanText.includes('applied data') ||
    cleanText.includes('full-stack') ||
    cleanText.includes('cybersecurity') ||
    cleanText.includes('agro-informatics') ||
    cleanText.includes('[วิชาเอกเลือก 4 แทร็ก]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'แผนการเลือกกลุ่มวิชาชีพเฉพาะทาง (Elective Career Tracks - 18–24 หน่วยกิต):\nนักศึกษาสามารถเลือกมุ่งเน้นตามความถนัดได้ 3–4 เส้นทางหลัก:\n\nTrack 1: AI & Applied Data Intelligence\n• Machine Learning & Deep Learning Implementation\n• Generative AI & Large Language Models Application\n• Data Engineering & Big Data Infrastructure\n• Computer Vision & Natural Language Processing\n\nTrack 2: Full-Stack Software & Cloud Architecture\n• Advanced Web & Mobile Frameworks\n• Cloud Computing & Serverless Architectures\n• API Design & Enterprise Software Engineering\n• UI/UX Engineering & Front-End Performance\n\nTrack 3: Cybersecurity & Defensive Operations\n• Practical Network Security & Cryptography\n• Secure Coding & Vulnerability Assessment\n• Cloud Security & Incident Response\n\nTrack 4: Smart Technology & Agro-Informatics (อัตลักษณ์แม่โจ้)\n• Internet of Things (IoT) & Embedded Systems for Smart Agriculture\n• Spatial Data & Remote Sensing Informatics'
      }
    ];
  }

  // 0.3 CWIE / Co-op / สหกิจศึกษา
  else if (
    cleanText.includes('cwie') ||
    cleanText.includes('สหกิจ') ||
    cleanText.includes('co-op') ||
    cleanText.includes('capstone') ||
    cleanText.includes('ฝึกงาน') ||
    cleanText.includes('บูรณาการ') ||
    cleanText.includes('[สหกิจศึกษา cwie]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'แผนการเรียนรู้ผ่านการทำงานจริง (CWIE: Cooperative and Work-Integrated Education) 6–7 หน่วยกิต:\n\nนักศึกษาสามารถเลือกรูปแบบการเรียนรู้ได้ 2 รูปแบบ:\n1. รูปแบบเลือกทำ สหกิจศึกษา (Co-op) เต็มเวลา 1 ภาคการศึกษา ในสถานประกอบการหรือองค์กรพันธมิตร\n2. หรือรูปแบบ โครงงานวิจัยอุตสาหกรรม (Industrial Capstone Project) พัฒนานวัตกรรมหรือแก้โจทย์จริงร่วมกับภาคอุตสาหกรรม'
      }
    ];
  }

  // 1. ค่าเทอม / ค่าธรรมเนียม / วท.คอมฯ / วิทยาศาสตร์
  else if (
    cleanText.includes('ค่าเทอม') || 
    cleanText.includes('ค่าธรรมเนียม') || 
    cleanText.includes('คอมพิวเตอร์') || 
    cleanText.includes('วิทยาการคอม') || 
    cleanText.includes('วิทยาศาสตร์') || 
    cleanText.includes('ค่าเรียน') ||
    cleanText.includes('จ่ายเงิน') ||
    cleanText.includes('การเงิน') ||
    cleanText.includes('[ค่าเทอม วิทยาการคอมพิวเตอร์]') ||
    cleanText.includes('[ค่าเทอม/การเงิน]')
  ) {
    return [
      { sender: 'bot', isMascot: true },
      { 
        sender: 'bot', 
        text: 'ข้อมูลอัตราค่าธรรมเนียมการศึกษา (ค่าเทอม):\n\n• **คณะวิทยาศาสตร์** มหาวิทยาลัยแม่โจ้\n• **สาขาวิชาวิทยาการคอมพิวเตอร์**\n• **ค่าเทอม: 20,000 บาท** / ภาคการศึกษา\n\nช่องทางการชำระเงิน:\n• สแกน QR Code / PromptPay ผ่านระบบ Mobile Banking ได้ทุกธนาคาร\n• พิมพ์ใบแจ้งยอด Pay-in นำไปชำระที่เคาน์เตอร์ธนาคารกรุงไทย หรือเคาน์เตอร์เซอร์วิส\n• หากมีความจำเป็น สามารถยื่นคำร้อง "ขอผ่อนผันค่าเทอม" ได้ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
      },
      { sender: 'bot', isEduCarousel: true }
    ];
  }

  // 2. ทุนการศึกษา / ทุนปันน้ำใจพี่ให้น้อง / ทุนต่อเนื่อง / ทุนไม่ต่อเนื่อง
  else if (
    cleanText.includes('ทุนการศึกษา') || 
    cleanText.includes('ทุน') || 
    cleanText.includes('ปันน้ำใจ') || 
    cleanText.includes('พี่ให้น้อง') || 
    cleanText.includes('ต่อเนื่อง') ||
    cleanText.includes('ไม่ต่อเนื่อง') ||
    cleanText.includes('[ทุนปันน้ำใจพี่ให้น้อง]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'ข้อมูลภาพรวมทุนการศึกษา มหาวิทยาลัยแม่โจ้ & ทุน “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5\n\nมหาวิทยาลัยแม่โจ้มีทุนการศึกษาจัดสรรให้นักศึกษาหลากหลายประเภท ทั้งทุนการศึกษาจากกองทุนมหาวิทยาลัย ทุนจากหน่วยงานภายนอก/ศิษย์เก่า และทุนกู้ยืมเพื่อการศึกษา (กยศ./กรอ.)\n\nสำหรับทุน “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5 แบ่งเป็น:\n1. **ทุนการศึกษาต่อเนื่อง**: รวม 20 ทุน (ต่อเนื่องจากปี 2568 จำนวน 9 ทุน และรายใหม่ปี 2569 จำนวน 11 ทุน)\n2. **ทุนการศึกษาไม่ต่อเนื่อง (ให้ 1 ปีการศึกษา)**: รวม 5 ทุน (ม.แม่โจ้-เชียงใหม่ 3 ทุน, ม.แม่โจ้-แพร่ 1 ทุน, ม.แม่โจ้-ชุมพร 1 ทุน)\n\nคุณสามารถคลิกปุ่มลิงก์ด้านล่าง เพื่อเปิดหน้าเว็บไซต์ทุนการศึกษาของมหาวิทยาลัยและดูรายละเอียดระเบียบการทั้งหมดได้ทันทีครับ:',
        actionLink: {
          title: 'ดูข้อมูลทุนทั้งหมด',
          url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
        }
      }
    ];
  }

  // 3. คุณสมบัติของผู้สมัครขอรับทุน
  else if (
    cleanText.includes('คุณสมบัติ') || 
    cleanText.includes('gpax') || 
    cleanText.includes('เกรด') || 
    cleanText.includes('ธกส') || 
    cleanText.includes('ธ.ก.ส.') || 
    cleanText.includes('ผู้กู้') || 
    cleanText.includes('ลูกค้า') ||
    cleanText.includes('[คุณสมบัติผู้ขอทุน]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'คุณสมบัติของผู้สมัครขอรับทุนการศึกษา (ต้องมีครบทั้ง 6 ข้อ):\n\n1. เป็นนักศึกษาระดับปริญญาตรีทุกชั้นปี ที่ลงทะเบียนเรียนภาคเรียนที่ 1 ในปีการศึกษา 2569\n2. เป็นนักศึกษาขาดแคลนทุนทรัพย์ในการศึกษา เป็นนักศึกษาที่มีความประพฤติเรียบร้อย และไม่เคยถูกลงโทษทางวินัยนักศึกษา\n3. ไม่เป็นนักศึกษาที่เป็นข้าราชการ พนักงานของรัฐ หรือพนักงานรัฐวิสาหกิจ\n4. นักศึกษาจะต้องไม่ได้รับทุนการศึกษาจากแหล่งทุนอื่น ๆ\n5. มีผลคะแนนเฉลี่ยสะสม (GPAX) รวมทุกรายวิชาเกรดเฉลี่ย 2.00 ขึ้นไป (สำหรับนักศึกษาชั้นปีที่ 1 ให้ใช้ผลการเรียนจากสถาบันการศึกษาเดิม)\n6. เป็นบุตรหรืออยู่ในความอุปการะของลูกค้า (ผู้กู้) ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.) ทั่วประเทศ\n\n⚠️ **หมายเหตุ**: นักศึกษาต้องมีคุณสมบัติของผู้สมัครขอรับทุนการศึกษา ตามข้อ 1 - 6 ทุกข้อจึงมีสิทธิ์สมัครขอรับทุนการศึกษาดังกล่าวได้ครับ',
        actionLink: {
          title: 'ดูข้อมูลทุนทั้งหมด',
          url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
        }
      }
    ];
  }

  // 4. วิธีการสมัคร & หลักฐานแนบใบสมัคร
  else if (
    cleanText.includes('วิธีสมัคร') || 
    cleanText.includes('วิธีการสมัคร') || 
    cleanText.includes('หลักฐาน') || 
    cleanText.includes('เอกสาร') || 
    cleanText.includes('สมัครยังไง') || 
    cleanText.includes('อำนวย ยศสุข') || 
    cleanText.includes('ส่งที่ไหน') || 
    cleanText.includes('วันสมัคร') || 
    cleanText.includes('สิงหาคม') ||
    cleanText.includes('transcript') ||
    cleanText.includes('รูปถ่าย') ||
    cleanText.includes('[วิธีสมัคร & หลักฐาน]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'วิธีการสมัครขอรับทุนการศึกษา:\n\n1. ให้นักศึกษารับแบบฟอร์มใบสมัครทุนการศึกษา “ปันน้ำใจพี่ให้น้อง” ครั้งที่ 5 ที่หน่วยทุนการศึกษา ชั้น 2 อาคารอำนวย ยศสุข ตั้งแต่วันที่ 3 - 21 สิงหาคม 2569 พร้อมส่งใบสมัครทุนการศึกษา และหลักฐานการสมัครที่หน่วยทุนการศึกษา งานบริการนักศึกษา จำนวน 1 ชุด\n2. ให้นักศึกษากรอกใบสมัครทุนการศึกษาให้สมบูรณ์ และเป็นไปตามความเป็นจริง (ถ้าหากคณะกรรมการพิจารณาทุนการศึกษาตรวจพบว่าข้อมูลไม่เป็นความจริงจะถูกตัดสิทธิ์ขอรับทุนดังกล่าว)\n\n📎 หลักฐานแนบใบสมัครขอรับทุนการศึกษา (จำนวน 1 ชุด):\n1. รูปถ่าย 1 นิ้ว หรือ 2 นิ้ว (สามารถใช้ภาพสแกนได้)\n2. สำเนาบัตรประจำตัวประชาชนของนักศึกษา บิดา มารดา หรือผู้อุปการะ\n3. ใบแสดงผลการเรียน (Transcript):\n   • นักศึกษาชั้นปีที่ 2 - 4 ใช้ของมหาวิทยาลัยแม่โจ้\n   • นักศึกษาชั้นปีที่ 1 ใช้ของสถาบันการศึกษาเดิม\n4. เอกสารสำเนาแสดงการเป็นบุตร หรืออยู่ในความอุปการะของลูกค้า (ผู้กู้) ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร ทั่วประเทศ เช่น สำเนาบัตรสมาชิก ธ.ก.ส. / สำเนาบัญชีธนาคาร ธ.ก.ส.',
        actionLink: {
          title: 'ดูข้อมูลทุนทั้งหมด',
          url: 'https://guide-guidance.mju.ac.th/wtms_index.aspx?lang=th-TH'
        }
      }
    ];
  }

  // 5. ปฏิทินการศึกษา
  else if (
    cleanText.includes('ปฏิทิน') || 
    cleanText.includes('ปฏิทินการศึกษา') || 
    cleanText.includes('ตารางเรียน') || 
    cleanText.includes('เปิดเทอม') || 
    cleanText.includes('วันสอบ') || 
    cleanText.includes('mju') ||
    cleanText.includes('[ปฏิทินการศึกษา mju]') ||
    cleanText.includes('[ปฏิทินการศึกษา]')
  ) {
    return [
      {
        sender: 'bot',
        text: 'ปฏิทินการศึกษา มหาวิทยาลัยแม่โจ้:\n\nรวมกำหนดการลงทะเบียนเรียน, วันเปิด-ปิดภาคเรียน, วันสอบกลางภาค และวันสอบปลายภาค คุณสามารถเปิดดูหรือดาวน์โหลดเอกสาร PDF ทางการได้ที่ปุ่มด้านล่างนี้ครับ:',
        downloadLink: {
          title: 'ดาวน์โหลดปฏิทินการศึกษา มหาวิทยาลัยแม่โจ้ (PDF)',
          url: 'https://edu.mju.ac.th/fileDownload/891.pdf?v=21:22:41'
        }
      }
    ];
  }

  // 6. ผ่อนผันค่าเทอม (เฉพาะกรณีระบุค่าเทอม หรือไม่เกี่ยวกับทหาร)
  else if (
    (cleanText.includes('ผ่อนผันค่าเทอม') || cleanText.includes('ผ่อนผันค่าเรียน') || (cleanText.includes('ผ่อนผัน') && !cleanText.includes('ทหาร') && !cleanText.includes('เกณฑ์') && !cleanText.includes('รูป') && !cleanText.includes('ภาพ'))) || 
    cleanText.includes('ค้างจ่าย') || 
    cleanText.includes('ขั้นตอนผ่อนผันค่าเทอม') ||
    cleanText.includes('[ผ่อนผันการชำระ]')
  ) {
    return [
      { 
        sender: 'bot', 
        text: 'ขั้นตอนการยื่นคำร้องขอผ่อนผันค่าเทอม:\n\n1. ดาวน์โหลดหรือรับแบบฟอร์ม "คำร้องขอผ่อนผันค่าธรรมเนียมการศึกษา"\n2. กรอกข้อมูลให้ครบถ้วนพร้อมเซ็นชื่อรับรองโดยผู้ปกครอง\n3. ยื่นส่งคำร้องผ่านเว็บไซต์ทะเบียนหรือนำส่งฝ่ายกิจการนักศึกษา ภายใน 2 สัปดาห์แรกของภาคเรียนครับ' 
      }
    ];
  }

  // 6.0 คำถามเกี่ยวกับ "รูปภาพ" โดยตรง หรือต้องการดูรูปทั้งหมด
  else if (
    (cleanText.includes('รูป') || cleanText.includes('ภาพ') || cleanText.includes('photo') || cleanText.includes('image')) &&
    !cleanText.includes('ทหาร') && !cleanText.includes('ประกัน')
  ) {
    return [
      {
        sender: 'bot',
        text: 'นี่คือรูปภาพประกาศและข้อมูลสำคัญของมหาวิทยาลัยแม่โจ้ครับ:\n\n1.**ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569** (ยื่น 21 ก.ย. - 18 ธ.ค. 69)\n2.**ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้** (บมจ.เออร์โกประกันภัย คุ้มครอง 22,000 บ./ครั้ง)',
        images: [
          {
            url: militaryDefermentImg,
            alt: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้',
            caption: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 (21 ก.ย. - 18 ธ.ค. 2569)'
          },
          {
            url: accidentInsuranceImg,
            alt: 'ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569',
            caption: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (บมจ.เออร์โกประกันภัย)'
          }
        ],
        actionLink: {
          title: 'เข้าสู่ระบบยื่นคำร้องผ่อนผันทหาร (ERP MJU)',
          url: 'https://erp.mju.ac.th'
        }
      }
    ];
  }

  // 6.1 การขอผ่อนผันทหาร ประจำปีการศึกษา 2569
  else if (
    cleanText.includes('ผ่อนผันทหาร') || 
    cleanText.includes('เกณฑ์ทหาร') || 
    cleanText.includes('ทหาร') || 
    cleanText.includes('สด.9') || 
    cleanText.includes('สด9') || 
    cleanText.includes('สด.35') || 
    cleanText.includes('สด35') || 
    cleanText.includes('รด.') || 
    cleanText.includes('รด') ||
    cleanText.includes('รูปทหาร') ||
    cleanText.includes('รูปผ่อนผัน') ||
    cleanText.includes('[ผ่อนผันทหาร]') ||
    cleanText.includes('[การขอผ่อนผันทหาร]') ||
    cleanText.includes('[การขอผ่อนผันทหาร]') ||
    cleanText.includes('การขอผ่อนผันทหาร')
  ) {
    return [
      {
        sender: 'bot',
        text: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้:\n\n• **กลุ่มเป้าหมาย**: นักศึกษาชายทุกคนที่เกิดใน **ปี พ.ศ. 2549** ที่เข้ามาศึกษาใน ม.แม่โจ้ และนักศึกษาหลักสูตร 4 ปี เทียบเข้าเรียน (2 ปีต่อเนื่อง) ที่เคยผ่อนผันทหารจากสถาบันเดิมแล้ว เมื่อย้ายสถานศึกษาและรายงานตัวเป็นนักศึกษาใหม่ จะต้องยื่นเรื่องขอผ่อนผันใหม่ทุกคน (ยกเว้นผู้ที่เรียน รด. จบชั้นปีที่ 3)\n\n**เอกสารที่ต้องเตรียม (อย่างละ 1 ฉบับ)**:\n1. สำเนา สด.9\n2. สำเนา สด.35\n3. สำเนาทะเบียนบ้าน (ภูมิลำเนาเดิม)\n4. สำเนาบัตรประจำตัวประชาชน\n5. สำเนาใบแจ้งเปลี่ยนชื่อ (ถ้ามี)\n*หมายเหตุ: สำเนาทุกฉบับต้องลงลายมือชื่อรับรองสำเนาถูกต้องด้วยปากกาน้ำเงินเท่านั้น ห้ามขีดฆ่าหรือแก้ไขข้อความเด็ดขาด*\n\n**กำหนดการเปิดรับยื่นเอกสาร**: วันที่ 21 กันยายน - 18 ธันวาคม 2569\n\n**ขั้นตอนการยื่นคำร้อง**:\n1. ยื่นคำร้องผ่านระบบออนไลน์ที่: https://erp.mju.ac.th\n2. ศึกษาวิธีการใช้งานได้ที่คู่มือ: https://maejo.link/CcY3pl\n3. เมื่อกรอกคำร้องออนไลน์แล้ว ให้นำเอกสารสำเนาส่งที่ ห้องงานบริการนักศึกษา ชั้น 2 อาคารอำนวย ยศสุข ในวันและเวลาราชการ\n*(นักศึกษาที่เคยยื่นผ่อนผันไปในปีก่อนหน้านี้ ไม่ต้องยื่นใหม่ สามารถใช้เอกสารเดิมได้จนจบการศึกษา)*',
        image: {
          url: militaryDefermentImg,
          alt: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 มหาวิทยาลัยแม่โจ้',
          caption: 'ประกาศ การขอผ่อนผันทหาร ประจำปีการศึกษา 2569 (21 ก.ย. - 18 ธ.ค. 2569)'
        },
        actionLink: {
          title: 'เข้าสู่ระบบยื่นคำร้องผ่อนผันทหาร (ERP MJU)',
          url: 'https://erp.mju.ac.th'
        }
      }
    ];
  }

  // 6.2 ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้
  else if (
    cleanText.includes('ประกัน') || 
    cleanText.includes('ประกันอุบัติเหตุ') || 
    cleanText.includes('อุบัติเหตุ') || 
    cleanText.includes('ค่ารักษา') || 
    cleanText.includes('เคลม') || 
    cleanText.includes('เออร์โก') || 
    cleanText.includes('ergo') ||
    cleanText.includes('รูปประกัน') ||
    cleanText.includes('[ประกันอุบัติเหตุ]') ||
    cleanText.includes('[ประกันอุบัติเหตุกลุ่ม]') ||
    cleanText.includes('ประกันอุบัติเหตุกลุ่ม')
  ) {
    return [
      {
        sender: 'bot',
        text: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569:\n\nมหาวิทยาลัยแม่โจ้จัดทำประกันอุบัติเหตุกลุ่มให้กับนักศึกษาและบุคลากร ร่วมกับ บริษัท เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)\nระยะเวลาคุ้มครอง: 1 มิถุนายน 2569 – 31 พฤษภาคม 2570\n\n**วงเงินความคุ้มครอง**:\n• ค่ารักษาพยาบาลต่ออุบัติเหตุแต่ละครั้ง ตามจ่ายจริงไม่เกิน **22,000 บาท**\n• กรณีเสียชีวิต ทุพพลภาพถาวร หรือสูญเสียอวัยวะเนื่องจากอุบัติเหตุ **180,000 บาท**\n\n**โรงพยาบาลคู่สัญญาใน จ.เชียงใหม่ (ไม่ต้องสำรองจ่าย)**:\n1. โรงพยาบาลเชียงใหม่ราม 1\n2. โรงพยาบาลเชียงใหม่ใกล้หมอ\n3. โรงพยาบาลเทพปัญญา 1\n4. โรงพยาบาลแมคคอร์มิค\n5. โรงพยาบาลราชเวชเชียงใหม่\n6. โรงพยาบาลลานนา\n*(เพียงยื่นบัตรประชาชน แจ้งทำประกันกับ บมจ.เออร์โกประกันภัย กรมธรรม์เลขที่: 260401/P001000250)*\n\n**กรณีเข้ารับการรักษาโรงพยาบาลนอกเครือข่าย**:\nให้สำรองจ่ายเงินไปก่อน แล้วนำหลักฐานมายื่นเบิกได้ที่ **งานอนามัย กองพัฒนานักศึกษา อาคารอำนวย ยศสุข** ในวันและเวลาราชการ\nเอกสารที่ใช้: 1. ใบเสร็จฉบับจริง, 2. ใบรับรองแพทย์ฉบับจริง, 3. สำเนาบัตรประชาชน, 4. สำเนาหน้าสมุดบัญชีธนาคาร (ยกเว้น ออมสิน, ธ.ก.ส., ธอส.)\n\nสอบถามเพิ่มเติมได้ที่ งานอนามัย กองพัฒนานักศึกษา โทร. 0 5387 3075',
        image: {
          url: accidentInsuranceImg,
          alt: 'ประกันอุบัติเหตุกลุ่ม นักศึกษาและบุคลากร มหาวิทยาลัยแม่โจ้ ประจำปีการศึกษา 2569',
          caption: 'ข้อมูลประกันอุบัติเหตุกลุ่ม มหาวิทยาลัยแม่โจ้ (เออร์โกประกันภัย)'
        }
      }
    ];
  }

  // 7. ช่องทางติดต่อ
  else if (
    cleanText.includes('ติดต่อ') || 
    cleanText.includes('เบอร์โทร') || 
    cleanText.includes('สถานที่') || 
    cleanText.includes('ติดต่อฝ่ายทะเบียน') || 
    cleanText.includes('ติดต่อฝ่ายการเงิน')
  ) {
    return [
      {
        sender: 'bot',
        text: 'ช่องทางการติดต่อหน่วยงาน มหาวิทยาลัยแม่โจ้:\n\n• **หน่วยทุนการศึกษา งานบริการนักศึกษา**: ชั้น 2 อาคารอำนวย ยศสุข\n• **สำนักบริหารและพัฒนาวิชาการ (งานทะเบียน)**: โทร. 053-873450-4\n• **สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้**\n\nเปิดทำการวันจันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)'
      }
    ];
  }

  // 8. Thread search
  else if (cleanText.includes('mongodb') || cleanText.includes('java') || cleanText.includes('react') || cleanText.includes('nestjs') || cleanText.includes('error') || cleanText.includes('กระทู้')) {
    try {
      let queryKeyword = '';
      if (cleanText.includes('mongodb')) queryKeyword = 'mongodb';
      else if (cleanText.includes('java')) queryKeyword = 'java';
      else if (cleanText.includes('react')) queryKeyword = 'react';
      else if (cleanText.includes('nestjs')) queryKeyword = 'nestjs';
      else if (cleanText.includes('error')) queryKeyword = 'error';

      const response = await axios.get(`${API_URL}/api/questions?q=${queryKeyword}`);
      const threads = response.data;

      if (threads.length > 0) {
        const listText = threads.map((t, idx) => `${idx + 1}. **${t.title}** (โดย ${t.author.name})`).join('\n');
        return [
          { 
            sender: 'bot', 
            text: `ผมพบกระทู้เกี่ยวกับการเรียนในเรื่อง "${queryKeyword}" บนเว็บบอร์ด CS Helpdesk ด้วยครับ:\n\n${listText}\n\nคลิกลิงก์ด้านล่างเพื่อเข้าไปศึกษาเพิ่มเติมได้เลยครับ:`,
            searchResults: threads
          }
        ];
      } else {
        return [
          { sender: 'bot', text: `ผมลองค้นหาหัวข้อการเรียนเรื่อง "${queryKeyword}" บนเว็บบอร์ดช่วยเหลือแล้ว แต่ยังไม่พบกระทู้ที่ตรงกันเลยครับ` }
        ];
      }
    } catch (err) {
      console.error(err);
      return [
        { sender: 'bot', text: 'ขออภัยด้วยครับ ระบบดึงข้อมูลเว็บบอร์ดขัดข้องชั่วคราว ลองปรึกษาเรื่องทะเบียนเรียนดูนะครับ' }
      ];
    }
  }
  else {
    return [
      { 
        sender: 'bot', 
        text: 'ขออภัยครับ บอทวิชาการยังไม่เข้าใจคำถามนี้\nคุณสามารถสอบถามเกี่ยวกับ:\n• "[หลักสูตร วิทยาการคอมพิวเตอร์ (รหัส 70)]" (โครงสร้าง 120–124 หน่วยกิต & 4 แทร็กอาชีพ)\n• "[ค่าเทอม วิทยาการคอมพิวเตอร์]" (คณะวิทยาศาสตร์ 20,000 บาท)\n• "[ทุนปันน้ำใจพี่ให้น้อง]" (ทุนต่อเนื่อง/ไม่ต่อเนื่อง)\n• "[ปฏิทินการศึกษา MJU]" (ดาวน์โหลดปฏิทิน มหาวิทยาลัยแม่โจ้)\n• "ผ่อนผันทหาร" (ประกาศการผ่อนผันเกณฑ์ทหาร ปี 2569 พร้อมรูปภาพ)\n• "ประกันอุบัติเหตุ" (ความคุ้มครอง & รายชื่อโรงพยาบาลคู่สัญญา พร้อมรูปภาพ)\nหรือเลือกคลิกจากปุ่มตัวเลือก 4 ปุ่มด้านล่างได้เลยครับ!' 
      }
    ];
  }
}

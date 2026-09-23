// ข้อมูลคณาจารย์ สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้
// ที่มา: https://csmju.com/personnels (ดึงข้อมูลเมื่อ 23 ก.ย. 2569)
// - expertise: คัดลอกตามรายการ "ความเชี่ยวชาญ" บนเว็บไซต์ของสาขา
// - areas: การจัดกลุ่มด้านความถนัด (สรุปจาก expertise เพื่อใช้กรองในแดชบอร์ด)
// หากเว็บไซต์ของสาขาอัปเดตข้อมูล ให้แก้ไขไฟล์นี้ตาม

export const FACULTY_SOURCE_URL = 'https://csmju.com/personnels';
export const FACULTY_UPDATED_AT = '23 ก.ย. 2569';

export const PROGRAM_CONTACT = {
  name: 'สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้',
  address: 'ชั้น 6 อาคาร 60 ปี คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้ 63 หมู่ 4 ต.หนองหาร อ.สันทราย จ.เชียงใหม่ 50290',
  phone: '053-873890-3',
  fax: '053-873898',
};

export const EXPERTISE_AREAS = {
  ai: 'ปัญญาประดิษฐ์ & Machine Learning',
  data: 'วิทยาการข้อมูล & การวิเคราะห์ข้อมูล',
  software: 'การพัฒนาซอฟต์แวร์ & แอปพลิเคชัน',
  database: 'ระบบฐานข้อมูล & โครงสร้างข้อมูล',
  infosys: 'ระบบสารสนเทศเพื่อการจัดการ',
  iot: 'Internet of Things (IoT)',
  vision: 'การประมวลผลภาพและวิดีโอ',
  nlp: 'การประมวลผลภาษาธรรมชาติ (ภาษาไทย)',
  network: 'เครือข่าย & ความปลอดภัยสารสนเทศ',
  edtech: 'เทคโนโลยีการศึกษา & เกษตรอัจฉริยะ',
  bio: 'ชีวสารสนเทศ (Bioinformatics)',
};

export const FACULTY = [
  {
    id: "9ce1c1e5-69c2-4037-8713-94ce20844d18",
    prefix: "ผศ.",
    nameTh: "ก่องกาญจน์ ดุลยไชย",
    nameEn: "Kongkarn Dullayachai",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "วท.ม.(วิทยาการคอมพิวเตอร์) สถาบันบัณฑิตพัฒนบริหารศาสตร์",
    email: "kongkarn@mju.ac.th",
    phone: "053-873890-93 ต่อ 14",
    image: "https://csmju.com/files/personnels/2026/08/1787120326712-8ebecf61-fbac-4957-b626-82a97cdb6aeb.png",
    expertise: [
      "Decision Support System",
      "Management Information System"
    ],
    areas: [
      "infosys"
    ]
  },
  {
    id: "0c86953b-1035-43b8-b4a4-8c92b261ee77",
    prefix: "อ.ดร.",
    nameTh: "กิตติกร หาญตระกูล",
    nameEn: "Kittikorn Hantrakul",
    position: "อาจารย์",
    education: "ปร.ด.(การบริหารเทคโนโลยี) มหาวิทยาลัยแม่โจ้",
    email: "kittikor@mju.ac.th",
    phone: "053-873890-93 ต่อ 21",
    image: "https://csmju.com/files/personnels/2026/08/1787120507784-3e2fb6d1-4317-40a5-a163-a719abaa0c6d.png",
    expertise: [
      "Management Information Technology",
      "Internet of Things",
      "Technology Administration"
    ],
    areas: [
      "infosys",
      "iot"
    ]
  },
  {
    id: "c872eaf2-30b5-4e05-9c7e-6a26036b2cf3",
    prefix: "ผศ.ดร.",
    nameTh: "ปวีณ เขื่อนแก้ว",
    nameEn: "Paween Khoenkaw",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "วศ.ด.(วิศวกรรมคอมพิวเตอร์) มหาวิทยาลัยเกษตรศาสตร์",
    email: "paween_k@mju.ac.th",
    phone: "053-873896",
    image: "https://csmju.com/files/personnels/2026/08/1787120966487-3c73f840-2d42-4dea-8c38-479abbf8f046.png",
    expertise: [
      "Image Processing",
      "Video Processing",
      "Mobile Applications",
      "Internet of Things"
    ],
    areas: [
      "vision",
      "software",
      "iot"
    ]
  },
  {
    id: "95460f0a-b190-4ee5-9e4a-83b6ed1f9bd2",
    prefix: "อ.ดร.",
    nameTh: "พยุงศักดิ์ เกษมสำราญ",
    nameEn: "Payungsak Kasemsumran",
    position: "อาจารย์",
    education: "ปร.ด.(วิศวกรรมคอมพิวเตอร์) มหาวิทยาลัยเชียงใหม่",
    email: "payungsak_kae@mju.ac.th",
    phone: "053-873890-93 ต่อ 17",
    image: "https://csmju.com/files/personnels/2026/08/1787121022457-800f1f77-0868-41f4-9c72-241692e84191.png",
    expertise: [
      "Artificial Intelligence",
      "Machine Learning and Deep Learning",
      "Data Science and Data Analytics"
    ],
    areas: [
      "ai",
      "data"
    ]
  },
  {
    id: "eb391ee9-7d9e-4661-b7c5-5f6027e5f345",
    prefix: "ผศ.ดร.",
    nameTh: "พาสน์ ปราโมกข์ชน",
    nameEn: "Part Pramokchon",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "วศ.ด.(วิศวกรรมคอมพิวเตอร์) มหาวิทยาลัยเกษตรศาสตร์",
    email: "part@mju.ac.th",
    phone: "053-873890-93 ต่อ 16",
    image: "https://csmju.com/files/personnels/2026/08/1787120913926-f20fd501-f69a-4d80-ade2-1fc8c548f673.png",
    expertise: [
      "Descriptive Data Analytics",
      "Diagnostic Data Analytics",
      "Predictive Data Analytics",
      "ETL/ELT Developer"
    ],
    areas: [
      "data"
    ]
  },
  {
    id: "f2097dae-82e9-4c12-9e29-02056bc3c271",
    prefix: "ผศ.",
    nameTh: "ภานุวัฒน์ เมฆะ",
    nameEn: "Panuwat Mekha",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "วท.ม.(วิทยาการคอมพิวเตอร์) มหาวิทยาลัยเชียงใหม่",
    email: "panuwat_m@mju.ac.th",
    phone: "053-873890-93 ต่อ 20",
    image: "https://csmju.com/files/personnels/2026/08/1787120868998-fbe94a8e-7aaf-47af-80a6-cf12fa3dc614.png",
    expertise: [
      "Bio Informatics",
      "Data Mining and Machine Learning",
      "Internet of Things"
    ],
    areas: [
      "bio",
      "ai",
      "data",
      "iot"
    ]
  },
  {
    id: "a616422f-fa28-4f56-97a8-13b999cab47b",
    prefix: "ผศ.ดร.",
    nameTh: "สนิท สิทธิ",
    nameEn: "Snit Sitti",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "ศษ.ด.(เทคโนโลยีการศึกษา) มหาวิทยาลัยเกษตรศาสตร์",
    email: "snit@mju.ac.th",
    phone: "053-873890-93 ต่อ 15",
    image: "https://csmju.com/files/personnels/2026/08/1787119954275-8628cef3-7380-42e1-ada3-bc4890761c52.png",
    expertise: [
      "เทคโนโลยีการศึกษา การเรียนการสอนและการเรียนรู้ในศตวรรษที่ 21",
      "เทคโนโลยีสารสนเทศด้านการเกษตร ฟาร์มอัจฉริยะ",
      "การสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์ ระบบเครือข่ายขนาดใหญ่",
      "ระบบรักษาความปลอดภัยข้อมูล (Information Security)",
      "การพัฒนาซอฟต์แวร์และระบบฐานข้อมูล",
      "การวิเคราะห์ข้อมูลสถิติเพื่อการวิจัย"
    ],
    areas: [
      "edtech",
      "network",
      "software",
      "database",
      "data"
    ]
  },
  {
    id: "8b00285b-45b4-49b7-80c2-474fd7cc5fd2",
    prefix: "ผศ.ดร.",
    nameTh: "สมนึก สินธุปวน",
    nameEn: "Somnuek Sinthupuan",
    position: "ผู้ช่วยศาสตราจารย์",
    education: "ปร.ด.(วิทยาการคอมพิวเตอร์) หลักสูตรนานาชาติ สถาบันบัณฑิตพัฒนบริหารศาสตร์",
    email: "somnuk@mju.ac.th",
    phone: "053-873890-93 ต่อ 24",
    image: "https://csmju.com/files/personnels/2026/08/1787119831029-3a5077aa-9b32-49ff-935b-d1c324328f98.png",
    expertise: [
      "Thai Rhetorical Structure",
      "Thai Computational Linguistic",
      "Machine Learning / Deep Learning"
    ],
    areas: [
      "nlp",
      "ai"
    ]
  },
  {
    id: "26128be3-ec32-485d-89ac-c3722dc666c9",
    prefix: "อ.",
    nameTh: "อรรถวิท ชังคมานนท์",
    nameEn: "Attawit Changkamanon",
    position: "อาจารย์",
    education: "วท.ม.(วิทยาการคอมพิวเตอร์) มหาวิทยาลัยเชียงใหม่",
    email: "attawit@mju.ac.th",
    phone: "053-873890-93 ต่อ 13",
    image: "https://csmju.com/files/personnels/2026/08/1787120580723-728ef996-d445-4c9d-9950-f4447a84d696.png",
    expertise: [
      "Software and Application Development and Analysis",
      "Database Management"
    ],
    areas: [
      "software",
      "database"
    ]
  },
  {
    id: "1053e212-46a5-408f-ada3-f35cc60d418f",
    prefix: "อ.",
    nameTh: "อลงกต กองมณี",
    nameEn: "Alongkot Gongmanee",
    position: "อาจารย์",
    education: "M.S.(Information Systems Management) Ferris State University, U.S.A.",
    email: "alongkot@mju.ac.th",
    phone: "053-873890 ต่อ 22",
    image: "https://csmju.com/files/personnels/2026/08/1787120446612-fc38b52d-8a7a-49c4-9676-5413b47bd8c3.png",
    expertise: [
      "Data Structure",
      "Database System",
      "Block Chain Information System",
      "Intelligence Algorithm for Optimization",
      "Mobile Application"
    ],
    areas: [
      "database",
      "infosys",
      "software"
    ]
  }
];

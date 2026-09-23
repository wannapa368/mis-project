import axios from 'axios';

// กำหนด URL ของ Backend (ใช้ค่าจาก Environment Variable บน Vercel หรือลิงก์ Render โดยตรง)
const API_URL = import.meta.env.VITE_API_URL || 'https://mis-project-1.onrender.com';

// Cache รายการกระทู้ระดับโมดูล: อยู่รอดแม้กดเข้าไปดูกระทู้แล้วกลับมาหน้าแรก
// key = พารามิเตอร์ที่ส่งไป API, และรวม request ที่ซ้ำกันขณะกำลังโหลดให้เหลือครั้งเดียว
export const forumCache = new Map();
const forumInflight = new Map();

export function loadQuestions(params) {
  const key = JSON.stringify(params);
  if (!forumInflight.has(key)) {
    const request = axios.get(`${API_URL}/api/questions`, { params })
      .then((res) => {
        forumCache.set(key, res.data);
        return res.data;
      })
      .finally(() => forumInflight.delete(key));
    forumInflight.set(key, request);
  }
  return forumInflight.get(key);
}

// เรียกหลังแก้ไข/ลบกระทู้ เพื่อไม่ให้หน้ารวมกระทู้แสดงข้อมูลเก่า
export function invalidateForumCache() {
  forumCache.clear();
}

import { useMemo, useState } from 'react';
import { Mail, Phone, Search, ExternalLink, GraduationCap, Users, Award, Layers, X, Building2, Printer } from 'lucide-react';
import Avatar from './Avatar';
import {
  FACULTY,
  EXPERTISE_AREAS,
  PROGRAM_CONTACT,
  FACULTY_SOURCE_URL,
  FACULTY_UPDATED_AT,
} from '../data/faculty';

// "053-873890-93 ต่อ 21" -> "tel:053873890" (ใช้เบอร์แรกของช่วงเบอร์สำหรับโทรออก)
function telHref(phone) {
  const match = phone.match(/0\d{2}-?\d{6,7}/);
  return match ? `tel:${match[0].replace(/-/g, '')}` : null;
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft px-4 py-3.5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold text-slate-900 leading-none tabular-nums">{value}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">{label}</div>
      </div>
    </div>
  );
}

function FacultyPhoto({ person }) {
  const [failed, setFailed] = useState(false);
  if (!person.image || failed) {
    return <Avatar name={person.nameTh} size="lg" />;
  }
  return (
    <img
      src={person.image}
      alt={`${person.prefix} ${person.nameTh}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-16 h-16 rounded-2xl object-cover object-top bg-slate-100 shrink-0 ring-1 ring-slate-200"
    />
  );
}

function FacultyCard({ person, activeArea, onSelectArea }) {
  const tel = telHref(person.phone);
  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-lift hover:border-brand-200 transition-all duration-200 p-5 flex flex-col animate-fade-up">
      <div className="flex gap-4">
        <FacultyPhoto person={person} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-brand-700">{person.position}</div>
          <h3 className="font-bold text-slate-900 leading-snug">
            {person.prefix} {person.nameTh}
          </h3>
          <div className="text-xs text-slate-500">{person.nameEn}</div>
          {person.education && (
            <div className="mt-1.5 text-[11px] text-slate-500 flex items-start gap-1">
              <GraduationCap size={12} className="shrink-0 mt-0.5" />
              <span className="line-clamp-2">{person.education}</span>
            </div>
          )}
        </div>
      </div>

      {/* ด้านความถนัด (กดเพื่อกรอง) */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {person.areas.map((area) => (
          <button
            type="button"
            key={area}
            onClick={() => onSelectArea(activeArea === area ? null : area)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ring-1 ring-inset transition cursor-pointer ${
              activeArea === area
                ? 'bg-brand-600 text-white ring-brand-600'
                : 'bg-brand-50 text-brand-700 ring-brand-100 hover:bg-brand-100'
            }`}
          >
            {EXPERTISE_AREAS[area]}
          </button>
        ))}
      </div>

      {/* ความเชี่ยวชาญตามเว็บไซต์สาขา */}
      <ul className="mt-3 space-y-1 text-xs text-slate-600">
        {person.expertise.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* ช่องทางการติดต่อ */}
      <div className="mt-auto pt-4">
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <a
            href={`mailto:${person.email}`}
            className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-brand-700 transition group"
          >
            <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-50 text-slate-500 group-hover:text-brand-600 flex items-center justify-center shrink-0 transition">
              <Mail size={14} />
            </span>
            <span className="truncate font-medium">{person.email}</span>
          </a>
          {tel ? (
            <a href={tel} className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-brand-700 transition group">
              <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-50 text-slate-500 group-hover:text-brand-600 flex items-center justify-center shrink-0 transition">
                <Phone size={14} />
              </span>
              <span className="font-medium">{person.phone}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <Phone size={14} />
              </span>
              <span className="font-medium">{person.phone}</span>
            </div>
          )}
          <a
            href={`${FACULTY_SOURCE_URL}/${person.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
          >
            ดูประวัติ & ผลงานวิจัย <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function FacultyDashboard() {
  const [query, setQuery] = useState('');
  const [activeArea, setActiveArea] = useState(null);

  // จำนวนอาจารย์ในแต่ละด้าน เรียงจากมากไปน้อย
  const areaCounts = useMemo(() => {
    const counts = Object.keys(EXPERTISE_AREAS).map((key) => ({
      key,
      label: EXPERTISE_AREAS[key],
      count: FACULTY.filter((p) => p.areas.includes(key)).length,
    }));
    return counts.sort((a, b) => b.count - a.count);
  }, []);
  const maxCount = Math.max(...areaCounts.map((a) => a.count));

  const stats = useMemo(() => ({
    total: FACULTY.length,
    asstProf: FACULTY.filter((p) => p.position === 'ผู้ช่วยศาสตราจารย์').length,
    doctorate: FACULTY.filter((p) => p.prefix.includes('ดร.')).length,
    areas: Object.keys(EXPERTISE_AREAS).length,
  }), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACULTY.filter((p) => {
      if (activeArea && !p.areas.includes(activeArea)) return false;
      if (!q) return true;
      const haystack = [p.nameTh, p.nameEn, p.prefix, ...p.expertise, ...p.areas.map((a) => EXPERTISE_AREAS[a])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeArea]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0 bg-gradient-to-r from-brand-50/80 via-white to-violet-50/60">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">ทำเนียบอาจารย์ & ความเชี่ยวชาญ</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ค้นหาอาจารย์ตามความถนัด เพื่อขอคำปรึกษาหรือติดต่อเรื่องโครงงาน · ข้อมูลจาก{' '}
          <a href={FACULTY_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-medium">
            csmju.com
          </a>{' '}
          (อัปเดต {FACULTY_UPDATED_AT})
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile icon={Users} label="อาจารย์ประจำสาขา" value={stats.total} />
          <StatTile icon={Award} label="ผู้ช่วยศาสตราจารย์" value={stats.asstProf} />
          <StatTile icon={GraduationCap} label="วุฒิปริญญาเอก" value={stats.doctorate} />
          <StatTile icon={Layers} label="ด้านความเชี่ยวชาญ" value={stats.areas} />
        </div>

        {/* Expertise chart + contact */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <section className="card p-5 xl:col-span-2">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">จำนวนอาจารย์ตามด้านความเชี่ยวชาญ</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">กดที่แถบเพื่อกรองรายชื่ออาจารย์ด้านนั้น (อาจารย์ 1 ท่านมีได้หลายด้าน)</p>
              </div>
              {activeArea && (
                <button
                  type="button"
                  onClick={() => setActiveArea(null)}
                  className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer"
                >
                  ล้างตัวกรอง <X size={12} />
                </button>
              )}
            </div>
            <div className="space-y-0.5" role="list">
              {areaCounts.map(({ key, label, count }) => {
                const selected = activeArea === key;
                const dimmed = activeArea && !selected;
                return (
                  <button
                    type="button"
                    role="listitem"
                    key={key}
                    onClick={() => setActiveArea(selected ? null : key)}
                    title={`${label}: อาจารย์ ${count} ท่าน`}
                    aria-pressed={selected}
                    className={`group w-full grid grid-cols-[1fr_1.5rem] sm:grid-cols-[minmax(0,15rem)_1fr_1.5rem] items-center gap-x-3 gap-y-1 px-2 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      selected ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`col-span-2 sm:col-span-1 text-xs sm:truncate ${selected ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{label}</span>
                    <span className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <span
                        className={`block h-full rounded-full transition-all duration-300 ${
                          dimmed ? 'bg-brand-200' : 'bg-brand-500 group-hover:bg-brand-600'
                        }`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </span>
                    <span className="text-xs font-bold text-slate-700 tabular-nums text-right">{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card p-5 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Building2 size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">ติดต่อสำนักงานสาขา</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{PROGRAM_CONTACT.address}</p>
            <div className="mt-4 space-y-2 text-xs">
              <a href={telHref(PROGRAM_CONTACT.phone)} className="flex items-center gap-2 text-slate-700 hover:text-brand-700 font-medium">
                <Phone size={14} className="text-slate-400" /> โทร. {PROGRAM_CONTACT.phone}
              </a>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Printer size={14} className="text-slate-400" /> แฟกซ์. {PROGRAM_CONTACT.fax}
              </div>
            </div>
            <a
              href={FACULTY_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
            >
              ดูบุคลากรทั้งหมดบนเว็บไซต์สาขา <ExternalLink size={12} />
            </a>
          </section>
        </div>

        {/* Search + active filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่ออาจารย์ หรือความเชี่ยวชาญ เช่น Machine Learning, IoT, ฐานข้อมูล..."
              className="input-field pl-10"
            />
          </div>
          <div className="text-xs text-slate-500 shrink-0">
            แสดง <span className="font-bold text-slate-800">{filtered.length}</span> จาก {FACULTY.length} ท่าน
            {activeArea && <> · ด้าน <span className="font-semibold text-brand-700">{EXPERTISE_AREAS[activeArea]}</span></>}
          </div>
        </div>

        {/* Faculty grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filtered.map((person) => (
              <FacultyCard key={person.id} person={person} activeArea={activeArea} onSelectArea={setActiveArea} />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <h3 className="font-bold text-slate-900">ไม่พบอาจารย์ที่ตรงกับการค้นหา</h3>
            <p className="text-sm text-slate-500 mt-1.5">ลองค้นหาด้วยคำอื่น หรือล้างตัวกรองด้านความเชี่ยวชาญ</p>
            <button
              type="button"
              onClick={() => { setQuery(''); setActiveArea(null); }}
              className="btn-ghost text-xs mt-5"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// สีของแท็กที่ใช้ร่วมกันทั้งหน้ารวมกระทู้และหน้ารายละเอียดกระทู้
const TAG_STYLES = {
  Curriculum: 'bg-violet-50 text-violet-700 ring-violet-200',
  Database: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Error: 'bg-red-50 text-red-700 ring-red-200',
  React: 'bg-sky-50 text-sky-700 ring-sky-200',
  Java: 'bg-orange-50 text-orange-700 ring-orange-200',
  NestJS: 'bg-pink-50 text-pink-700 ring-pink-200',
};

export function tagClass(tag) {
  return `inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md ring-1 ring-inset ${
    TAG_STYLES[tag] || 'bg-slate-50 text-slate-600 ring-slate-200'
  }`;
}

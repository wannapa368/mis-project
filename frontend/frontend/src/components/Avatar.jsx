const GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-600',
];

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
};

// อวตารตัวอักษรแรกของชื่อ สีไล่ระดับคงที่ต่อชื่อ
export default function Avatar({ name = '', size = 'md', className = '' }) {
  const index = [...name].reduce((sum, ch) => sum + ch.codePointAt(0), 0) % GRADIENTS.length;
  return (
    <div
      className={`${SIZES[size]} rounded-full bg-gradient-to-br ${GRADIENTS[index]} text-white font-semibold flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {name.charAt(0)}
    </div>
  );
}

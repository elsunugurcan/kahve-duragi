/** Ürün görseli: markalı kahve paketi illüstrasyonu (SVG). Fotoğraf yerine tutarlı bir görsel dil sağlar. */
export default function BagArt({ color, name, origin, roast, className = "" }: { color: string; name: string; origin: string; roast: string; className?: string }) {
  const id = name.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 300 360" className={className} role="img" aria-label={`${name} kahve paketi`}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="#1c1917" /></linearGradient>
        <linearGradient id={`s${id}`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="335" rx="95" ry="12" fill="#2a1a12" opacity=".15" />
      <path d="M70 60 Q70 30 100 30 H200 Q230 30 230 60 V300 Q230 330 200 330 H100 Q70 330 70 300 Z" fill={`url(#g${id})`} />
      <path d="M70 60 Q70 30 100 30 H200 Q230 30 230 60 V300 Q230 330 200 330 H100 Q70 330 70 300 Z" fill={`url(#s${id})`} />
      <rect x="82" y="28" width="136" height="14" rx="4" fill="#1c1917" opacity=".6" />
      <circle cx="150" cy="70" r="7" fill="#f7f1e8" opacity=".9" /><circle cx="150" cy="70" r="3" fill={color} />
      <rect x="92" y="120" width="116" height="150" rx="10" fill="#f7f1e8" />
      <text x="150" y="150" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#2a1a12" letterSpacing="1.5">KAHVE DURAĞI</text>
      <line x1="108" y1="160" x2="192" y2="160" stroke="#2a1a12" strokeOpacity=".2" />
      {name.split(" ").slice(0, 3).map((w, i) => (
        <text key={w} x="150" y={186 + i * 20} textAnchor="middle" fontFamily="Georgia, serif" fontSize={name.length > 18 ? 15 : 18} fontWeight="700" fill="#2a1a12">{w}</text>
      ))}
      <text x="150" y="246" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="8" fill="#6b4a35">{origin.toUpperCase()} · {roast.toUpperCase()} KAVRUM</text>
      <rect x="120" y="254" width="60" height="6" rx="3" fill={color} />
      <text x="150" y="290" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#2a1a12" opacity=".6">250 g · TAZE KAVRULMUŞ</text>
    </svg>
  );
}

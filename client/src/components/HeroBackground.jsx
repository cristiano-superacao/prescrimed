export default function HeroBackground() {
  const photoUrl = import.meta.env.VITE_BG_IMAGE_URL || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <>
      {/* Padrão leve para textura */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20 bg-cover bg-center mix-blend-overlay" aria-hidden="true"></div>
      {/* Foto opcional (pode ser substituída via VITE_BG_IMAGE_URL) */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url('${photoUrl}')` }}
        aria-hidden="true"
      ></div>
      {/* Gradiente superior para profundidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" aria-hidden="true"></div>
    </>
  );
}

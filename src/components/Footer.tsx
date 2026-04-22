import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-obsidian text-white py-32 px-8 md:px-20 font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-serif mb-12 tracking-widest leading-none">AURELIAN</h2>
          <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-xs">Designing the legacy of tomorrow through the materials of today.</p>
        </div>
        <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-8 block">Archives</span><ul className="space-y-4 text-sm font-medium text-white/60"><li>Artifacts</li><li>Ateliers</li><li>Bespoke</li></ul></div>
        <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-8 block">Inquiries</span><ul className="space-y-4 text-sm font-medium text-white/60"><li>Contact</li><li>Press</li><li>Careers</li></ul></div>
        <div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-8 block">Legals</span><ul className="space-y-4 text-sm font-medium text-white/60"><li>Privacy</li><li>Terms</li><li>Cookies</li></ul></div>
      </div>
      <div className="pt-32 border-t border-white/10 mt-32 text-center">
         <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">© 2024 Aurelian Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}

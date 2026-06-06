import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(165deg, #1a3a4a 0%, #0f2d3d 50%, #142e3e 100%)' }}>
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-md shadow-indigo-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-white">
            Funnel<span className="text-indigo-400">Link</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-xs text-white/30">© {new Date().getFullYear()} FunnelLink. All rights reserved.</p>
      </footer>
    </div>
  );
}

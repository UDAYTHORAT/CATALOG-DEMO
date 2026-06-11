const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix Logos
content = content.replace(
  /<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500\/20 group-hover:scale-105 transition-transform">FL<\/div>/g,
  `<div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center border border-white/10 shadow-md group-hover:scale-105 transition-transform">
            <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
          </div>`
);

content = content.replace(
  /<div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white mx-auto mb-8 text-3xl shadow-\[0_0_30px_rgba\(79,70,229,0\.3\)\]">FL<\/div>/g,
  `<div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] mx-auto mb-8">
               <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
             </div>`
);

// Fix Colors (Slate -> Cinematic Dark #070b14 theme)
content = content.replace(/bg-slate-950/g, 'bg-[#070b14]');
content = content.replace(/bg-slate-900/g, 'bg-[#0c1222]');
content = content.replace(/bg-slate-800/g, 'bg-[#151e32]');
content = content.replace(/border-slate-800/g, 'border-white/5');
content = content.replace(/text-slate-50/g, 'text-white');
content = content.replace(/text-slate-200/g, 'text-neutral-200');
content = content.replace(/text-slate-300/g, 'text-neutral-300');
content = content.replace(/text-slate-400/g, 'text-neutral-400');
content = content.replace(/text-slate-500/g, 'text-neutral-500');
content = content.replace(/border-slate-700/g, 'border-white/10');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Fixed colors and logo.');

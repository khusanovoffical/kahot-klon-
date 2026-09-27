import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-[#060d24] border-t-2 border-black/40 mt-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-space font-bold text-lg text-[#eec200]">HUMOYUN QUIZ</span>
          <span className="text-sm text-[#c3c6d7]">— Jonli intellektual jang maydoni</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider">
            ARCADE ENGINE v2.4
          </span>
          <span className="text-xs text-[#c3c6d7]">
            © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
};

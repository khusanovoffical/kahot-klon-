import React from 'react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 pointer-events-auto p-4 bg-[#eec200] text-[#3c2f00] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-lg flex items-center gap-3 font-space font-bold text-lg max-w-md animate-bounce">
      <span className="material-symbols-outlined text-[26px]">verified</span>
      <span>{message}</span>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  roomPin: string;
  joinUrl?: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  roomPin,
  joinUrl,
  size = 190
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanPin = roomPin.replace(/\s+/g, '');
  const finalUrl = joinUrl || `https://humoyunquiz.uz/join?pin=${cleanPin}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        finalUrl,
        {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        error => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [finalUrl, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Brutalist QR Container */}
      <div className="relative p-2.5 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_#000000]">
        {/* Corner Neon Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-[#eec200]" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-[#eec200]" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-[#eec200]" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-[#eec200]" />

        <canvas ref={canvasRef} className="block rounded" />
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider">
          📷 Kamerani qarating
        </span>
        <span className="text-[11px] text-[#c3c6d7] font-mono select-all">
          {finalUrl.replace('https://', '')}
        </span>
      </div>
    </div>
  );
};

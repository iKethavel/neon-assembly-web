'use client';

// Install package:
// npm install qr-code-styling @types/react

import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface StyledQRCodeProps {
  data: string;
  logoUrl?: string;
  size?: number;
  dotsColor?: string;
  cornersColor?: string;
  backgroundColor?: string;
  logoSize?: number;
  cornerSquareType?: 'square' | 'dot' | 'extra-rounded';
  dotType?: 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded';
  onBase64Generated?: (base64: string) => void;
}

/**
 * A React component that renders a stylized QR code with logo
 */
export const QRCode: React.FC<StyledQRCodeProps> = ({
  data,
  logoUrl,
  size = 300,
  dotsColor = '#000000',
  cornersColor = '#000000',
  backgroundColor = '#FFFFFF',
  logoSize = 0.3, // 30% of QR code size
  cornerSquareType = 'extra-rounded',
  dotType = 'classy-rounded',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCodeRef.current) {
      // Initialize QR code on first render
      qrCodeRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg', // 'canvas' or 'svg'
        data: data,
        image: logoUrl,
        dotsOptions: {
          color: dotsColor,
          type: dotType,
        },
        cornersSquareOptions: {
          color: cornersColor,
          type: cornerSquareType,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
          imageSize: logoSize,
        },
        qrOptions: {
          errorCorrectionLevel: 'H',
        },
      });
    } else {
      // Update existing QR code when props change
      qrCodeRef.current.update({
        data,
        image: logoUrl,
        dotsOptions: {
          color: dotsColor,
          type: dotType,
        },
        cornersSquareOptions: {
          color: cornersColor,
          type: cornerSquareType,
        },
        width: size,
        height: size,
        imageOptions: {
          imageSize: logoSize,
        },
      });
    }

    // Render QR code to the DOM
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ref.current && qrCodeRef.current) {
      ref.current.innerHTML = '';
      qrCodeRef.current.append(ref.current);
    }
  }, [
    data,
    logoUrl,
    size,
    dotsColor,
    cornersColor,
    backgroundColor,
    logoSize,
    cornerSquareType,
    dotType,
  ]);


  return (
    <div className='flex justify-center items-center h-full'>
      <div ref={ref} />
    </div>
  );
};
